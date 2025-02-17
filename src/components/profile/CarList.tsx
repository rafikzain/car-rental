
import { Car } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CarListProps {
  cars: Car[];
  emptyMessage: string;
}

export default function CarList({ cars, emptyMessage }: CarListProps) {
  if (cars.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <Link key={car.id} to={`/cars/${car.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">{car.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Brand: {car.brand}</p>
                <p className="text-sm text-muted-foreground">Daily Rate: ${car.dailyRate}</p>
                <p className="text-sm text-muted-foreground">
                  Listed on: {car.createdAt.toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
