import { useState } from "react";
import Hero from "@/components/Hero";
import CarCard from "@/components/CarCard";
import SearchBar from "@/components/SearchBar";
import { Car } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("cars")
        .select(`
          *,
          car_images (
            image_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(9); // Show up to 9 recent cars

      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.map((car: any) => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        type: car.type as "rent" | "sale",
        price: car.price,
        image: car.car_images?.[0]?.image_url || "/placeholder.svg",
        description: car.description,
        userId: car.user_id,
        location: car.location,
        phoneNumber: car.phone_number,
        featured: car.featured,
        createdAt: new Date(car.created_at)
      })) as Car[];
    },
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <Hero />
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
              {searchTerm ? "Search Results" : "Recent Listings"}
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
    </div>
  );
};

export default Index;