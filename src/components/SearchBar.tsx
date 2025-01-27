import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
  const [openBrand, setOpenBrand] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from('car_brands')
          .select('*')
          .order('name');
        
        if (!brandsError && brandsData) {
          setBrands(brandsData);
        }

        // Fetch users (sellers)
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, name')
          .order('name');
        
        if (!usersError && usersData) {
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      brand: selectedBrand === "all" ? undefined : selectedBrand,
      userId: selectedUser === "all" ? undefined : selectedUser,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
      
      <Popover open={openBrand} onOpenChange={setOpenBrand}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openBrand}
            className="w-full md:w-[200px] justify-between bg-white"
          >
            {selectedBrand === "all" ? "All brands" : selectedBrand}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full md:w-[200px] p-0 bg-white">
          <Command>
            <CommandInput placeholder="Search brand..." />
            <CommandEmpty>No brand found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  setSelectedBrand("all");
                  setOpenBrand(false);
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
                  value={brand.name}
                  onSelect={() => {
                    setSelectedBrand(brand.name);
                    setOpenBrand(false);
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

      <Popover open={openUser} onOpenChange={setOpenUser}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openUser}
            className="w-full md:w-[200px] justify-between bg-white"
          >
            {selectedUser === "all" 
              ? "All sellers" 
              : users.find(user => user.id === selectedUser)?.name || "All sellers"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full md:w-[200px] p-0 bg-white">
          <Command>
            <CommandInput placeholder="Search seller..." />
            <CommandEmpty>No seller found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  setSelectedUser("all");
                  setOpenUser(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedUser === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                All sellers
              </CommandItem>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    setSelectedUser(user.id);
                    setOpenUser(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUser === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Button type="submit" variant="default">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;