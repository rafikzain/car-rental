
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

interface UserTableProps {
  users: User[];
  onToggleBan: (userId: string, currentBanStatus: boolean) => void;
}

const UserTable = ({ users, onToggleBan }: UserTableProps) => {
  if (users.length === 0) {
    return <p className="text-muted-foreground">No users found.</p>;
  }

  return (
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
                onClick={() => onToggleBan(user.id, user.isBanned)}
              >
                {user.isBanned ? "Unban" : "Ban"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
