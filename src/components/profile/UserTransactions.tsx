import { Car } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CarList from "./CarList";

interface UserTransactionsProps {
  soldCars: Car[];
  boughtCars: Car[];
  rentedCars: Car[];
  rentingCars: Car[];
}

export default function UserTransactions({
  soldCars,
  boughtCars,
  rentedCars,
  rentingCars,
}: UserTransactionsProps) {
  return (
    <Tabs defaultValue="sold" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="sold">Sold Cars</TabsTrigger>
        <TabsTrigger value="bought">Bought Cars</TabsTrigger>
        <TabsTrigger value="rented">Rented Cars</TabsTrigger>
        <TabsTrigger value="renting">Cars for Rent</TabsTrigger>
      </TabsList>
      <TabsContent value="sold">
        <CarList cars={soldCars} emptyMessage="No cars sold yet" />
      </TabsContent>
      <TabsContent value="bought">
        <CarList cars={boughtCars} emptyMessage="No cars bought yet" />
      </TabsContent>
      <TabsContent value="rented">
        <CarList cars={rentedCars} emptyMessage="No cars rented yet" />
      </TabsContent>
      <TabsContent value="renting">
        <CarList cars={rentingCars} emptyMessage="No cars put up for rent" />
      </TabsContent>
    </Tabs>
  );
}