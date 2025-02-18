
import { useUsers } from "./users/use-users";
import UserTable from "./users/UserTable";

const UserManagement = () => {
  const { users, loading, handleToggleBan } = useUsers();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>
      <UserTable users={users} onToggleBan={handleToggleBan} />
    </div>
  );
};

export default UserManagement;
