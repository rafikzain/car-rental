
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ProfileRedirect() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          // User is logged in, redirect to their profile
          navigate(`/profile/${data.user.id}`);
        } else {
          // User is not logged in, redirect to login
          toast({
            title: "Authentication required",
            description: "Please login to view your profile",
          });
          navigate("/login", { state: { returnUrl: "/profile" } });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Loading Profile...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
