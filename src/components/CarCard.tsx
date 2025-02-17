
import { Link } from "react-router-dom";
import { Car } from "@/types";

const CarCard = ({ car }: { car: Car }) => {
  return (
    <Link to={`/cars/${car.id}`} className="group">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          {car.featured && (
            <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{car.name}</h3>
          <p className="text-gray-600 mt-1">{car.brand}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              ${car.dailyRate.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
