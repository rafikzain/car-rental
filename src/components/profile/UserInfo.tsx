
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfileAvatar from "./ProfileAvatar";
import ReportUserDialog from "./ReportUserDialog";
import UserDetails from "./UserDetails";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  const { id } = useParams();

  // Fetch cars listed by this user
  const { data: userCars } = useQuery({
    queryKey: ["userCars", id],
    queryFn: async () => {
      const { data: cars, error } = await supabase
        .from("cars")
        .select("*")
        .eq("user_id", id);

      if (error) throw error;

      // Map the database results to match the expected type
      return cars?.map(car => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        dailyRate: car.daily_rate,
        description: car.description,
        specs: {
          engine: car.engine || "",
          power: car.power || "",
          acceleration: car.acceleration || "",
          transmission: car.transmission || "",
        },
        userId: car.user_id,
        location: car.location || undefined,
        phoneNumber: car.phone_number || undefined,
        featured: car.featured || false,
        createdAt: new Date(car.created_at)
      })) || [];
    },
  });

  // Use useQuery to get the current user
  const { data: currentUserResponse } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    },
  });

  const isOwnProfile = currentUserResponse?.user?.id === id;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ProfileAvatar
              avatarUrl={user.avatarUrl}
              name={user.name}
              userId={user.id}
              isOwnProfile={isOwnProfile}
            />
            <span>{user.name}'s Profile</span>
          </div>
          <ReportUserDialog userCars={userCars} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserDetails
          location={user.location}
          phoneNumber={user.phoneNumber}
          createdAt={user.createdAt}
          userType={user.userType}
        />
      </CardContent>
    </Card>
  );
}
