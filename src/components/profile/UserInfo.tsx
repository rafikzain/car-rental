
import { useState } from "react";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfileAvatar from "./ProfileAvatar";
import ReportUserDialog from "./ReportUserDialog";
import UserDetails from "./UserDetails";
import ProfileEditor from "./ProfileEditor";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch cars listed by this user
  const { data: userCars } = useQuery({
    queryKey: ["userCars", id],
    queryFn: async () => {
      const { data: cars, error } = await supabase
        .from("cars")
        .select("*")
        .eq("user_id", id);

      if (error) throw error;

      // Map the database results to match the expected type for ReportUserDialog
      return cars?.map(car => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        price: car.daily_rate // Map dailyRate to price for ReportUserDialog
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
          <div className="flex items-center gap-2">
            {isOwnProfile && !isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
            <ReportUserDialog userCars={userCars} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing && isOwnProfile ? (
          <ProfileEditor 
            user={user} 
            onCancel={() => setIsEditing(false)} 
            onSuccess={() => setIsEditing(false)}
          />
        ) : (
          <UserDetails
            location={user.location}
            phoneNumber={user.phoneNumber}
            createdAt={user.createdAt}
            userType={user.userType}
          />
        )}
      </CardContent>
    </Card>
  );
}
