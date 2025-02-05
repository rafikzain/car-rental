import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { useCallback } from "react";

interface UserInfoProps {
  user: User;
}

interface ReportFormData {
  description: string;
  carId?: number;
}

export default function UserInfo({ user }: UserInfoProps) {
  const { toast } = useToast();
  const { id } = useParams();
  const form = useForm<ReportFormData>();
  const queryClient = useQueryClient();

  // Fetch cars listed by this user
  const { data: userCars } = useQuery({
    queryKey: ["userCars", id],
    queryFn: async () => {
      const { data: cars, error } = await supabase
        .from("cars")
        .select("*")
        .eq("user_id", id);

      if (error) throw error;
      return cars;
    },
  });

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

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('profile_pictures')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', id);

      if (updateError) throw updateError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['profile', id] });

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    }
  }, [id, toast, queryClient]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {id === supabase.auth.user()?.id && (
                <label 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
                  htmlFor="avatar-upload"
                >
                  <Upload className="h-6 w-6 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <span>{user.name}'s Profile</span>
          </div>
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p>{user.location || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{user.phoneNumber || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p>{user.createdAt.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User Type</p>
            <p className="capitalize">{user.userType}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}