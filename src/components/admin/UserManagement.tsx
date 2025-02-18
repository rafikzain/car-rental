
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ban, CheckCircle } from "lucide-react";

const UserManagement = () => {
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
          user.id === userId
            ? { ...user, isBanned: !currentBanStatus }
            : user
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>
      {users.length === 0 ? (
        <p className="text-muted-foreground">No users found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell className="capitalize">{user.userType}</TableCell>
                <TableCell>{user.location || "N/A"}</TableCell>
                <TableCell>
                  {user.isBanned ? (
                    <span className="text-red-500 flex items-center gap-1">
                      <Ban className="h-4 w-4" />
                      Banned
                    </span>
                  ) : (
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Active
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant={user.isBanned ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => handleToggleBan(user.id, user.isBanned)}
                  >
                    {user.isBanned ? "Unban" : "Ban"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserManagement;
