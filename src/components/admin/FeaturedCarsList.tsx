import { Button } from "@/components/ui/button";
import { Car } from "@/types";

interface FeaturedCarsListProps {
  cars: Car[];
  onRemove: (id: number) => void;
}

const FeaturedCarsList = ({ cars, onRemove }: FeaturedCarsListProps) => {
  return (
    <div className="space-y-4">
      {cars.map((car) => (
        <div
          key={car.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <img
              src={car.image}
              alt={car.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{car.name}</h3>
              <p className="text-sm text-gray-600">{car.brand}</p>
            </div>
          </div>
          <Button variant="destructive" onClick={() => onRemove(car.id)}>
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FeaturedCarsList;