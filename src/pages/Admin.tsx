
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Car } from "@/types";
import AddCarForm from "@/components/admin/AddCarForm";
import FeaturedCarsList from "@/components/admin/FeaturedCarsList";
import UserManagement from "@/components/admin/UserManagement";
import DashboardStats from "@/components/admin/stats/DashboardStats";

const Admin = () => {
  const { toast } = useToast();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  const handleAddCar = (newCar: Car) => {
    setFeaturedCars([...featuredCars, newCar]);
    toast({
      title: "Success",
      description: "Car has been added successfully",
    });
  };

  const handleRemoveCar = (id: number) => {
    setFeaturedCars(featuredCars.filter((car) => car.id !== id));
    toast({
      title: "Success",
      description: "Car has been removed from featured list",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="space-y-8">
        <DashboardStats />
        
        <UserManagement />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Add New Car</h2>
            <AddCarForm onSubmit={handleAddCar} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Featured Cars</h2>
            <FeaturedCarsList cars={featuredCars} onRemove={handleRemoveCar} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
