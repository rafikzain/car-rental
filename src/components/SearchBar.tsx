import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  searchTerm: string;
  brand?: string;
  userId?: string;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);

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
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full max-w-4xl gap-4">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search cars by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4"
        />
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full md:w-[200px] bg-white justify-between"
          >
            {selectedBrand === "all" ? "All brands" : selectedBrand}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full md:w-[200px] p-0 bg-white">
          <Command>
            <CommandInput placeholder="Search brands..." />
            <CommandEmpty>No brand found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSelectedBrand("all");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedBrand === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                All brands
              </CommandItem>
              {brands.map((brand) => (
                <CommandItem
                  key={brand.id}
                  onSelect={() => {
                    setSelectedBrand(brand.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBrand === brand.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {brand.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

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

      <Button type="submit" variant="default">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;