export interface Car {
  id: number;
  name: string;
  brand: string;
  type: "rent" | "sale";
  price: number;
  image: string;
  description: string;
  specs: {
    engine: string;
    power: string;
    acceleration: string;
    transmission: string;
  };
}