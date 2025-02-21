import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  // TODO: Replace with actual auth state
  const isAuthenticated = false;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            AutoLuxe
          </Link>
          <div className="flex items-center space-x-8">
            {isAuthenticated ? (
              <Button variant="ghost" onClick={() => {/* TODO: Implement logout */}}>
                Sign Out
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;