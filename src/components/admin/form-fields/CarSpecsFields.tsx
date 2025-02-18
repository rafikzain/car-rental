
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CarFormValues } from "../schemas/car-form-schema";

interface CarSpecsFieldsProps {
  form: UseFormReturn<CarFormValues>;
}

export const CarSpecsFields = ({ form }: CarSpecsFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="engine"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engine</FormLabel>
            <FormControl>
              <Input placeholder="4.0L V8" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="power"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Power</FormLabel>
            <FormControl>
              <Input placeholder="670hp" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="acceleration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Acceleration</FormLabel>
            <FormControl>
              <Input placeholder="0-60 mph in 3.1s" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transmission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transmission</FormLabel>
            <FormControl>
              <Input placeholder="7-speed PDK" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
