import { useParams, Link } from "react-router-dom";
import { Car, CarAvailability } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Car as CarIcon, Gauge, Settings, Zap, Timer, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { addDays, differenceInDays, isWithinInterval, format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const CarDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Get current user
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    },
  });

  // Fetch car details
  const { data: car, isLoading: isLoadingCar } = useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const numericId = parseInt(id!, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid car ID");
      }

      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          car_images (
            image_url
          )
        `)
        .eq("id", numericId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        brand: data.brand,
        dailyRate: data.daily_rate,
        image: data.car_images?.[0]?.image_url || "/placeholder.svg",
        description: data.description,
        userId: data.user_id,
        location: data.location,
        phoneNumber: data.phone_number,
        featured: data.featured,
        createdAt: new Date(data.created_at),
        specs: {
          engine: data.engine || "5.0L V8",
          power: data.power || "450 HP",
          acceleration: data.acceleration || "4.5s 0-60 mph",
          transmission: data.transmission || "8-Speed Automatic",
        }
      } as Car;
    },
  });

  // Fetch car availability
  const { data: availability = [] } = useQuery({
    queryKey: ["carAvailability", id],
    queryFn: async () => {
      const numericId = parseInt(id!, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid car ID");
      }

      const { data, error } = await supabase
        .from("car_availability")
        .select("*")
        .eq("car_id", numericId);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        carId: item.car_id,
        startDate: new Date(item.start_date),
        endDate: new Date(item.end_date),
        status: item.status,
        createdAt: new Date(item.created_at)
      })) as CarAvailability[];
    },
  });

  // Add new unavailability period
  const addUnavailabilityMutation = useMutation({
    mutationFn: async (dates: { startDate: Date; endDate: Date }) => {
      const numericId = parseInt(id!, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid car ID");
      }

      const { error } = await supabase
        .from("car_availability")
        .insert({
          car_id: numericId,
          start_date: dates.startDate.toISOString(),
          end_date: dates.endDate.toISOString(),
          status: 'unavailable'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carAvailability", id] });
      toast({
        title: "Success",
        description: "Availability updated successfully",
      });
      setStartDate(undefined);
      setEndDate(undefined);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
    }
  });

  const handleReserve = async () => {
    if (!car || !startDate || !endDate) return;

    // Check if dates are available
    const isUnavailable = availability.some(period => 
      isWithinInterval(startDate, { start: period.startDate, end: period.endDate }) ||
      isWithinInterval(endDate, { start: period.startDate, end: period.endDate })
    );

    if (isUnavailable) {
      toast({
        title: "Error",
        description: "Selected dates are not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const days = differenceInDays(endDate, startDate);
      const totalAmount = days * car.dailyRate;

      const { data, error } = await supabase.functions.invoke('initialize-cmi-payment', {
        body: {
          carId: car.id,
          amount: totalAmount,
          startDate,
          endDate,
          carName: car.name
        }
      });

      if (error) throw error;

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: "Reservation Error",
        description: "Failed to initialize reservation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkUnavailable = () => {
    if (!startDate || !endDate) return;
    addUnavailabilityMutation.mutate({ startDate, endDate });
  };

  if (isLoadingCar) {
    return (
      <div className="container mx-auto px-6 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Car not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Return to homepage
        </Link>
      </div>
    );
  }

  const isOwner = userData?.user?.id === car.userId;

  const getDayClassName = (date: Date) => {
    const unavailablePeriod = availability.find(period => 
      isWithinInterval(date, { start: period.startDate, end: period.endDate })
    );

    if (unavailablePeriod) {
      return "bg-red-100 text-red-800 rounded-full";
    }
    return "";
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-primary hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Car Image Section */}
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover"
          />
          {car.featured && (
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>

        {/* Car Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{car.name}</h1>
            <p className="text-xl text-gray-600 mt-2">{car.brand}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-primary">
              ${car.dailyRate.toLocaleString()}
              <span className="text-sm text-gray-500 ml-1">/day</span>
            </h2>
            <p className="mt-4 text-gray-600">{car.description}</p>
          </div>

          {/* Availability Calendar */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Availability Calendar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-medium mb-2">Check-in Date</h4>
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border"
                  modifiersClassNames={{
                    selected: "bg-primary text-primary-foreground",
                  }}
                  modifiersStyles={{
                    disabled: { opacity: 0.5 },
                  }}
                  components={{
                    DayContent: ({ date }) => (
                      <div className={getDayClassName(date)}>
                        {format(date, "d")}
                      </div>
                    ),
                  }}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Check-out Date</h4>
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => startDate ? date <= startDate : false}
                  className="rounded-md border"
                  modifiersClassNames={{
                    selected: "bg-primary text-primary-foreground",
                  }}
                  modifiersStyles={{
                    disabled: { opacity: 0.5 },
                  }}
                  components={{
                    DayContent: ({ date }) => (
                      <div className={getDayClassName(date)}>
                        {format(date, "d")}
                      </div>
                    ),
                  }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-white">Available</Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800">Unavailable</Badge>
              </div>

              {startDate && endDate && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Selected Period: {differenceInDays(endDate, startDate)} days
                  </p>
                  <p className="text-lg font-bold text-primary mt-2">
                    Total: ${(differenceInDays(endDate, startDate) * car.dailyRate).toLocaleString()}
                  </p>
                </div>
              )}

              {isOwner ? (
                <Button
                  onClick={handleMarkUnavailable}
                  className="w-full"
                  disabled={!startDate || !endDate}
                >
                  Mark as Unavailable
                </Button>
              ) : (
                <Button
                  onClick={handleReserve}
                  className="w-full"
                  disabled={!startDate || !endDate}
                >
                  Reserve Now
                </Button>
              )}
            </div>
          </div>

          {/* Car Specifications */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Car Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <CarIcon className="w-4 h-4 mr-1" />
                  Engine
                </p>
                <p className="text-gray-700">{car.specs.engine}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Power
                </p>
                <p className="text-gray-700">{car.specs.power}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Timer className="w-4 h-4 mr-1" />
                  Acceleration
                </p>
                <p className="text-gray-700">{car.specs.acceleration}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Gauge className="w-4 h-4 mr-1" />
                  Transmission
                </p>
                <p className="text-gray-700">{car.specs.transmission}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="space-y-2">
              {car.location && (
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {car.location}
                </p>
              )}
              {car.phoneNumber && (
                <p className="text-gray-600">
                  <span className="font-medium">Contact:</span> {car.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
