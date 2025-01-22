import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car, User } from "@/types";
import CarList from "@/components/profile/CarList";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminUserList } from "@supabase/auth-ui-shared";

type AuthUser = {
  id: string;
  email?: string;
};

export default function Profile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [soldCars, setSoldCars] = useState<Car[]>([]);
  const [boughtCars, setBoughtCars] = useState<Car[]>([]);
  const [rentedCars, setRentedCars] = useState<Car[]>([]);
  const [rentingCars, setRentingCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profile) {
          // Get user email from auth
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const authUsers = users as AuthUser[];
          const authUser = authUsers.find(u => u.id === profile.id);

          setUser({
            id: profile.id,
            email: authUser?.email || "",
            name: profile.name,
            userType: profile.user_type as "buyer" | "seller" | "both" | "admin",
            phoneNumber: profile.phone_number,
            location: profile.location,
            isBanned: profile.is_banned,
            isScammer: profile.is_scammer,
            createdAt: new Date(profile.created_at)
          });

          // Fetch sold cars
          const { data: soldTransactions } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('seller_id', id)
            .eq('type', 'sale');

          // Fetch bought cars
          const { data: boughtTransactions } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('buyer_id', id)
            .eq('type', 'sale');

          // Fetch rented cars (as renter)
          const { data: rentedTransactions } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('buyer_id', id)
            .eq('type', 'rent');

          // Fetch cars put for rent (as owner)
          const { data: rentingTransactions } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('seller_id', id)
            .eq('type', 'rent');

          setSoldCars(soldTransactions?.map(t => ({
            ...t.cars,
            type: t.cars.type as "rent" | "sale",
            createdAt: new Date(t.cars.created_at)
          })) || []);

          setBoughtCars(boughtTransactions?.map(t => ({
            ...t.cars,
            type: t.cars.type as "rent" | "sale",
            createdAt: new Date(t.cars.created_at)
          })) || []);

          setRentedCars(rentedTransactions?.map(t => ({
            ...t.cars,
            type: t.cars.type as "rent" | "sale",
            createdAt: new Date(t.cars.created_at)
          })) || []);

          setRentingCars(rentingTransactions?.map(t => ({
            ...t.cars,
            type: t.cars.type as "rent" | "sale",
            createdAt: new Date(t.cars.created_at)
          })) || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id, toast]);

  const handleReport = async () => {
    // Here you would implement the report logic
    toast({
      title: "User Reported",
      description: "Thank you for your report. We will review it shortly.",
    });
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-6">User not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{user.name}'s Profile</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Report User</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Report User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to report this user? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReport}>Report</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p>{user.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{user.phoneNumber || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p>{user.createdAt.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User Type</p>
              <p className="capitalize">{user.userType}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sold" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sold">Sold Cars</TabsTrigger>
          <TabsTrigger value="bought">Bought Cars</TabsTrigger>
          <TabsTrigger value="rented">Rented Cars</TabsTrigger>
          <TabsTrigger value="renting">Cars for Rent</TabsTrigger>
        </TabsList>
        <TabsContent value="sold">
          <CarList cars={soldCars} emptyMessage="No cars sold yet" />
        </TabsContent>
        <TabsContent value="bought">
          <CarList cars={boughtCars} emptyMessage="No cars bought yet" />
        </TabsContent>
        <TabsContent value="rented">
          <CarList cars={rentedCars} emptyMessage="No cars rented yet" />
        </TabsContent>
        <TabsContent value="renting">
          <CarList cars={rentingCars} emptyMessage="No cars put up for rent" />
        </TabsContent>
      </Tabs>
    </div>
  );
}