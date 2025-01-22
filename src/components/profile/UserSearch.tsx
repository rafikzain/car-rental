import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name')
        .ilike('name', `%${searchTerm}%`)
        .limit(1);

      if (error) throw error;

      if (profiles && profiles.length > 0) {
        navigate(`/profile/${profiles[0].id}`);
      } else {
        toast({
          title: "User not found",
          description: "No user found with that name",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      toast({
        title: "Error",
        description: "Failed to search for user",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2 mb-6">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4"
        />
      </div>
      <Button type="submit" variant="default">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}