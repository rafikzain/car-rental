
import { useParams, Link } from "react-router-dom";
import { Car } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Car as CarIcon, Gauge, Settings, Zap, Timer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CarDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: car, isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      // Convert string id to number
      const numericId = parseInt(id!, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid car ID");
      }

      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          car_images (
            image_url
          )
        `)
        .eq("id", numericId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        brand: data.brand,
        type: data.type as "rent" | "sale",
        price: data.price,
        image: data.car_images?.[0]?.image_url || "/placeholder.svg",
        description: data.description,
        userId: data.user_id,
        location: data.location,
        phoneNumber: data.phone_number,
        featured: data.featured,
        createdAt: new Date(data.created_at),
        specs: {
          engine: data.engine || "5.0L V8",
          power: data.power || "450 HP",
          acceleration: data.acceleration || "4.5s 0-60 mph",
          transmission: data.transmission || "8-Speed Automatic",
        }
      } as Car;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Car not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Return to homepage
        </Link>
      </div>
    );
  }

  const handleContact = () => {
    toast({
      title: "Contact request sent",
      description: "The seller will contact you soon.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-primary hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Car Image Section */}
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full">
            {car.type}
          </div>
        </div>

        {/* Car Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{car.name}</h1>
            <p className="text-xl text-gray-600 mt-2">{car.brand}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-primary">
              ${car.price.toLocaleString()}
              <span className="text-sm text-gray-500 ml-1">
                {car.type === "rent" ? "/day" : ""}
              </span>
            </h2>
            <p className="mt-4 text-gray-600">{car.description}</p>
          </div>

          {/* Car Specifications */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Car Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <CarIcon className="w-4 h-4 mr-1" />
                  Engine
                </p>
                <p className="text-gray-700">{car.specs.engine}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Power
                </p>
                <p className="text-gray-700">{car.specs.power}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Timer className="w-4 h-4 mr-1" />
                  Acceleration
                </p>
                <p className="text-gray-700">{car.specs.acceleration}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Gauge className="w-4 h-4 mr-1" />
                  Transmission
                </p>
                <p className="text-gray-700">{car.specs.transmission}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="space-y-2">
              {car.location && (
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {car.location}
                </p>
              )}
              {car.phoneNumber && (
                <p className="text-gray-600">
                  <span className="font-medium">Contact:</span> {car.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <Button
              onClick={handleContact}
              className="w-full py-6 text-lg"
            >
              Contact Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
