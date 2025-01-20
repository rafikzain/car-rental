import { useParams } from "react-router-dom";
import { Car } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Calendar, Car as CarIcon, Gauge, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const CarDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // For now, we'll use the mock data. In a real application, this would come from an API
  const car = featuredCars.find((car) => car.id === Number(id));

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

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span className="text-gray-600">Engine</span>
              </div>
              <p className="mt-1 font-semibold">{car.specs.engine}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-primary" />
                <span className="text-gray-600">Power</span>
              </div>
              <p className="mt-1 font-semibold">{car.specs.power}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <CarIcon className="w-5 h-5 text-primary" />
                <span className="text-gray-600">Acceleration</span>
              </div>
              <p className="mt-1 font-semibold">{car.specs.acceleration}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span className="text-gray-600">Transmission</span>
              </div>
              <p className="mt-1 font-semibold">{car.specs.transmission}</p>
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

// Mock data (this would typically come from an API)
const featuredCars = [
  {
    id: 1,
    name: "Model S",
    brand: "Tesla",
    type: "sale",
    price: 89990,
    image: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    description: "Luxury electric sedan with incredible performance",
    specs: {
      engine: "Dual Motor",
      power: "670hp",
      acceleration: "0-60 mph in 3.1s",
      transmission: "Single-speed",
    },
  },
  {
    id: 2,
    name: "911 GT3",
    brand: "Porsche",
    type: "rent",
    price: 1200,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    description: "Track-focused sports car with racing DNA",
    specs: {
      engine: "4.0L Flat-6",
      power: "502hp",
      acceleration: "0-60 mph in 3.2s",
      transmission: "7-speed PDK",
    },
  },
  {
    id: 3,
    name: "G63 AMG",
    brand: "Mercedes-Benz",
    type: "sale",
    price: 156450,
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    description: "Luxury SUV with incredible off-road capability",
    specs: {
      engine: "4.0L V8 Biturbo",
      power: "577hp",
      acceleration: "0-60 mph in 4.5s",
      transmission: "9-speed automatic",
    },
  },
];

export default CarDetails;