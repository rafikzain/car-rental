
import { Car } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CarList from "./CarList";

interface UserTransactionsProps {
  ownedCars: Car[];
  rentedCars: Car[];
}

export default function UserTransactions({
  ownedCars,
  rentedCars,
}: UserTransactionsProps) {
  return (
    <Tabs defaultValue="owned" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="owned">My Cars</TabsTrigger>
        <TabsTrigger value="rented">Rented Cars</TabsTrigger>
      </TabsList>
      <TabsContent value="owned">
        <CarList cars={ownedCars} emptyMessage="No cars listed yet" />
      </TabsContent>
      <TabsContent value="rented">
        <CarList cars={rentedCars} emptyMessage="No cars rented yet" />
      </TabsContent>
    </Tabs>
  );
}
