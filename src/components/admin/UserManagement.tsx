import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/types";

export default function UserManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // First get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get users from auth to get emails
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Map profiles to our User type
      return profiles.map((profile): User => {
        const authUser = authUsers.find(u => u.id === profile.id);
        return {
          id: profile.id,
          email: authUser?.email || "",
          name: profile.name,
          userType: profile.user_type as "buyer" | "seller" | "both" | "admin",
          phoneNumber: profile.phone_number || undefined,
          location: profile.location || undefined,
          isBanned: profile.is_banned || false,
          isScammer: profile.is_scammer || false,
          createdAt: new Date(profile.created_at),
        };
      });
    },
  });

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    setLoading(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User has been ${!currentStatus ? "banned" : "unbanned"}`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
    setLoading(null);
  };

  const handleToggleScammer = async (userId: string, currentStatus: boolean) => {
    setLoading(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_scammer: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User has been ${
          !currentStatus ? "marked" : "unmarked"
        } as scammer`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
    setLoading(null);
  };

  if (!users) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-gray-500">
            Manage user accounts, ban users, and mark scammers
          </p>
        </div>
        <div className="divide-y">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400">Type: {user.userType}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Ban User</span>
                  <Switch
                    checked={user.isBanned}
                    disabled={loading === user.id}
                    onCheckedChange={() =>
                      handleToggleBan(user.id, user.isBanned || false)
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Mark as Scammer</span>
                  <Switch
                    checked={user.isScammer}
                    disabled={loading === user.id}
                    onCheckedChange={() =>
                      handleToggleScammer(user.id, user.isScammer || false)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}