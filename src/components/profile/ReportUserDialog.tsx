import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface ReportFormData {
  description: string;
  carId?: number;
}

interface ReportUserDialogProps {
  userCars?: Array<{
    id: number;
    brand: string;
    name: string;
    price: number;
  }>;
}

export default function ReportUserDialog({ userCars }: ReportUserDialogProps) {
  const { toast } = useToast();
  const form = useForm<ReportFormData>();

  const handleReport = async (data: ReportFormData) => {
    try {
      toast({
        title: "User Reported",
        description: "Thank you for your report. We will review it shortly.",
      });
      
      const cancelButton = document.querySelector('[data-button-type="cancel"]') as HTMLButtonElement;
      if (cancelButton) {
        cancelButton.click();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Report User</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleReport)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Report User</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide details about why you are reporting this user.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe the issue..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {userCars && userCars.length > 0 && (
                <FormField
                  control={form.control}
                  name="carId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Car Listing</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        >
                          <option value="">Select a car listing</option>
                          {userCars.map((car) => (
                            <option key={car.id} value={car.id}>
                              {car.brand} {car.name} - ${car.price}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel data-button-type="cancel">Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Submit Report</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}