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
      return cars;
    },
  });

  const currentUser = supabase.auth.getUser();
  const isOwnProfile = currentUser?.data?.user?.id === id;

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