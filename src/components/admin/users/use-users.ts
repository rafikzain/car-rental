
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

export const useUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const mappedUsers: User[] = data.map((profile) => ({
            id: profile.id,
            email: "",
            name: profile.name,
            userType: profile.user_type as "owner" | "renter" | "both" | "admin",
            phoneNumber: profile.phone_number || undefined,
            location: profile.location || undefined,
            isBanned: profile.is_banned || false,
            isScammer: profile.is_scammer || false,
            createdAt: new Date(profile.created_at),
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: !currentBanStatus })
        .eq("id", userId);

      if (error) throw error;

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isBanned: !currentBanStatus } : user
        )
      );

      toast({
        title: "Success",
        description: `User has been ${!currentBanStatus ? "banned" : "unbanned"}`,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  return {
    users,
    loading,
    handleToggleBan,
  };
};
