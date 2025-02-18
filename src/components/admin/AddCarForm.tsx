
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Car } from "@/types";
import { carFormSchema, CarFormValues } from "./schemas/car-form-schema";
import { CarBasicFields } from "./form-fields/CarBasicFields";
import { CarSpecsFields } from "./form-fields/CarSpecsFields";

interface AddCarFormProps {
  onSubmit: (car: Car) => void;
}

const AddCarForm = ({ onSubmit }: AddCarFormProps) => {
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      dailyRate: 0,
      image: "",
      description: "",
      engine: "",
      power: "",
      acceleration: "",
      transmission: "",
      city: "Casablanca",
    },
  });

  const handleSubmit = (values: CarFormValues) => {
    const newCar: Car = {
      id: Date.now(),
      name: values.name,
      brand: values.brand,
      dailyRate: values.dailyRate,
      image: values.image,
      description: values.description,
      specs: {
        engine: values.engine,
        power: values.power,
        acceleration: values.acceleration,
        transmission: values.transmission,
      },
      city: values.city,
      createdAt: new Date(),
    };
    onSubmit(newCar);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CarBasicFields form={form} />
        <CarSpecsFields form={form} />
        <Button type="submit" className="w-full">
          Add Car
        </Button>
      </form>
    </Form>
  );
};

export default AddCarForm;
