import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car, User } from "@/types";
import UserInfo from "@/components/profile/UserInfo";
import UserTransactions from "@/components/profile/UserTransactions";
import UserSearch from "@/components/profile/UserSearch";

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
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profile) {
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const authUsers = users as unknown as AuthUser[];
          const authUser = authUsers.find(u => u.id === profile.id);

          setUser({
            id: profile.id,
            email: authUser?.email || "",
            name: profile.name,
            userType: profile.user_type as "buyer" | "seller" | "both" | "admin",
            phoneNumber: profile.phone_number || null,
            location: profile.location || null,
            isBanned: profile.is_banned || false,
            isScammer: profile.is_scammer || false,
            createdAt: new Date(profile.created_at)
          });

          // Fetch transactions
          const { data: soldTransactions } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('seller_id', id)
            .eq('type', 'sale');

          const { data: boughtTransactions } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('buyer_id', id)
            .eq('type', 'sale');

          const { data: rentedTransactions } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('buyer_id', id)
            .eq('type', 'rent');

          const { data: rentingTransactions } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('seller_id', id)
            .eq('type', 'rent');

          const mapTransactionToCar = (t: any): Car => ({
            ...t.cars,
            type: t.cars.type === "sale" ? "sale" : "rent",
            createdAt: new Date(t.cars.created_at),
            userId: t.cars.user_id,
            featured: t.cars.featured || false,
            location: t.cars.location || null,
            phoneNumber: t.cars.phone_number || null
          });

          setSoldCars(soldTransactions?.map(mapTransactionToCar) || []);
          setBoughtCars(boughtTransactions?.map(mapTransactionToCar) || []);
          setRentedCars(rentedTransactions?.map(mapTransactionToCar) || []);
          setRentingCars(rentingTransactions?.map(mapTransactionToCar) || []);
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

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-6">User not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <UserSearch />
      <UserInfo user={user} />
      <UserTransactions
        soldCars={soldCars}
        boughtCars={boughtCars}
        rentedCars={rentedCars}
        rentingCars={rentingCars}
      />
    </div>
  );
}