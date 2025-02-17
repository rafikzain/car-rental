
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car, User } from "@/types";
import UserInfo from "@/components/profile/UserInfo";
import UserTransactions from "@/components/profile/UserTransactions";
import UserSearch from "@/components/profile/UserSearch";

export default function Profile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [ownedCars, setOwnedCars] = useState<Car[]>([]);
  const [rentedCars, setRentedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          const userType = profile.user_type as "owner" | "renter" | "both" | "admin";
          setUser({
            id: profile.id,
            email: "", // We don't have access to email without admin privileges
            name: profile.name,
            userType,
            phoneNumber: profile.phone_number || undefined,
            location: profile.location || undefined,
            isBanned: profile.is_banned || false,
            isScammer: profile.is_scammer || false,
            createdAt: new Date(profile.created_at)
          });

          // Fetch owned cars
          const { data: ownedCarsData, error: ownedError } = await supabase
            .from('cars')
            .select('*')
            .eq('user_id', id);

          if (ownedError) throw ownedError;

          // Fetch rented cars through transactions
          const { data: rentedTransactions, error: rentedError } = await supabase
            .from('transactions')
            .select('*, cars(*)')
            .eq('renter_id', id);

          if (rentedError) throw rentedError;

          setOwnedCars(ownedCarsData || []);
          setRentedCars(rentedTransactions?.map(t => ({
            id: t.cars.id,
            name: t.cars.name,
            brand: t.cars.brand,
            price: t.cars.price,
            dailyRate: t.cars.daily_rate,
            description: t.cars.description,
            createdAt: new Date(t.cars.created_at),
            userId: t.cars.user_id,
            location: t.cars.location,
            phoneNumber: t.cars.phone_number,
            featured: t.cars.featured
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
        ownedCars={ownedCars}
        rentedCars={rentedCars}
      />
    </div>
  );
}
