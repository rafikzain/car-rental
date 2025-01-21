import Hero from "@/components/Hero";
import CarCard from "@/components/CarCard";
import { Car } from "@/types";

const featuredCars: Car[] = [
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
    createdAt: new Date(), // Add the createdAt field
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
    createdAt: new Date(), // Add the createdAt field
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
    createdAt: new Date(), // Add the createdAt field
  },
];

const Index = () => {
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;