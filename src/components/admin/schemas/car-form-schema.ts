
import * as z from "zod";

export const carFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  dailyRate: z.number().min(0, "Daily rate must be positive"),
  image: z.string().url("Must be a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  engine: z.string(),
  power: z.string(),
  acceleration: z.string(),
  transmission: z.string(),
  city: z.enum(['Casablanca', 'FES', 'RABAT', 'AGADIR', 'MARRAKECH']),
});

export type CarFormValues = z.infer<typeof carFormSchema>;
