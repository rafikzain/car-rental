import { useState } from "react";
import CarCard from "@/components/CarCard";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import { Car } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { City } from "@/components/admin/constants/cities";

const Cars = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    brand: undefined,
    userId: undefined,
    startDate: undefined,
    endDate: undefined,
    city: undefined,
  });

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars", filters],
    queryFn: async () => {
      let query = supabase
        .from("cars")
        .select(`
          *,
          car_images (
            image_url
          ),
          car_availability (
            start_date,
            end_date,
            status
          )
        `)
        .order('created_at', { ascending: false })
        .limit(9);

      if (filters.searchTerm) {
        query = query.or(
          `name.ilike.%${filters.searchTerm}%,brand.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.city) {
        query = query.eq('city', filters.city as City);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      let filteredData = data;
      if (filters.startDate && filters.endDate) {
        filteredData = data.filter(car => {
          if (!car.car_availability) return true;
          
          const hasConflict = car.car_availability.some((availability: any) => {
            const availStart = new Date(availability.start_date);
            const availEnd = new Date(availability.end_date);
            const filterStart = new Date(filters.startDate!);
            const filterEnd = new Date(filters.endDate!);
            
            return (
              (filterStart >= availStart && filterStart <= availEnd) ||
              (filterEnd >= availStart && filterEnd <= availEnd) ||
              (filterStart <= availStart && filterEnd >= availEnd)
            );
          });
          
          return !hasConflict;
        });
      }

      return filteredData.map((car: any) => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        dailyRate: car.daily_rate,
        image: car.car_images?.[0]?.image_url || "/placeholder.svg",
        description: car.description,
        userId: car.user_id,
        location: car.location,
        phoneNumber: car.phone_number,
        featured: car.featured,
        city: car.city,
        createdAt: new Date(car.created_at)
      })) as Car[];
    },
  });

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {filters.searchTerm || filters.brand || filters.userId || filters.startDate || filters.city ? "Search Results" : "Available Cars"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          {cars.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No cars found matching your search.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cars;
