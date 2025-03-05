
import { useState } from "react";
import { useUsers } from "./users/use-users";
import UserTable from "./users/UserTable";
import AddUserForm from "./users/AddUserForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UserManagement = () => {
  const { users, loading, handleToggleBan, refreshUsers } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUserAdded = () => {
    setIsDialogOpen(false);
    refreshUsers();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. The user will receive an email to confirm their account.
              </DialogDescription>
            </DialogHeader>
            <AddUserForm onSuccess={handleUserAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <UserTable users={users} onToggleBan={handleToggleBan} />
    </div>
  );
};

export default UserManagement;
