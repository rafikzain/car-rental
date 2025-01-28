import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  searchTerm: string;
  brand?: string;
  userId?: string;
  type?: "rent" | "sale";
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch brands
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('car_brands')
        .select('*')
        .order('name');
      if (!error && data) {
        setBrands(data);
      }
    };

    // Fetch users (sellers)
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .order('name');
      if (!error && data) {
        setUsers(data);
      }
    };

    fetchBrands();
    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      brand: selectedBrand === "all" ? undefined : selectedBrand,
      userId: selectedUser === "all" ? undefined : selectedUser,
      type: selectedType === "all" ? undefined : selectedType as "rent" | "sale",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full max-w-6xl gap-4">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search cars by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4"
        />
      </div>
      
      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
        <SelectTrigger className="w-full md:w-[200px] bg-white">
          <SelectValue placeholder="Select brand" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All brands</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.name}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedUser} onValueChange={setSelectedUser}>
        <SelectTrigger className="w-full md:w-[200px] bg-white">
          <SelectValue placeholder="Select seller" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All sellers</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-full md:w-[200px] bg-white">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="rent">For Rent</SelectItem>
          <SelectItem value="sale">For Sale</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" variant="default">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;