
import { Car } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeaturedCarsListProps {
  cars: Car[];
  onRemove: (id: number) => void;
}

const FeaturedCarsList = ({ cars, onRemove }: FeaturedCarsListProps) => {
  return (
    <div>
      {cars.length === 0 ? (
        <p className="text-muted-foreground">No featured cars yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>{car.name}</TableCell>
                <TableCell>{car.brand}</TableCell>
                <TableCell>{car.city}</TableCell>
                <TableCell>${car.dailyRate}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(car.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default FeaturedCarsList;
