
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  searchTerm: string;
  brand?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  city?: string;
}

const CITIES = ['Casablanca', 'FES', 'RABAT', 'AGADIR', 'MARRAKECH'];

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
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

  // New useEffect to trigger search when filters change
  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedBrand, selectedUser, selectedCity, startDate, endDate]);

  const handleSearch = () => {
    onSearch({
      searchTerm,
      brand: selectedBrand === "all" ? undefined : selectedBrand,
      userId: selectedUser === "all" ? undefined : selectedUser,
      city: selectedCity === "all" ? undefined : selectedCity,
      startDate,
      endDate
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search cars by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 text-lg"
            />
          </div>
          
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-full md:w-[200px] h-12 bg-white">
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

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full md:w-[200px] h-12 bg-white">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All cities</SelectItem>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full md:w-[200px] h-12 bg-white">
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

          <div className="flex flex-1 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[240px] h-12 justify-start text-left font-normal bg-white",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>From date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[240px] h-12 justify-start text-left font-normal bg-white",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>To date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => startDate ? date <= startDate : false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            type="button" 
            variant="default" 
            onClick={handleSearch}
            className="h-12 px-8 text-lg"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
