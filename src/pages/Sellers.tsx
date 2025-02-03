import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Phone, Star } from "lucide-react";
import { Link } from "react-router-dom";

const fetchSellers = async () => {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .in("user_type", ["seller", "both"]);

  if (error) throw error;

  // Map the Supabase response to our User type
  const sellers: User[] = profiles.map(profile => ({
    id: profile.id,
    email: "", // Email is not available from profiles table
    name: profile.name,
    userType: profile.user_type as "buyer" | "seller" | "both" | "admin",
    phoneNumber: profile.phone_number || undefined,
    location: profile.location || undefined,
    isBanned: profile.is_banned || false,
    isScammer: profile.is_scammer || false,
    createdAt: new Date(profile.created_at)
  }));

  return sellers;
};

export default function Sellers() {
  const { data: sellers, isLoading } = useQuery({
    queryKey: ["sellers"],
    queryFn: fetchSellers,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Car Sellers</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sellers?.map((seller) => (
          <Card key={seller.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{seller.name}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.5</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seller.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{seller.location}</span>
                  </div>
                )}
                {seller.phoneNumber && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{seller.phoneNumber}</span>
                  </div>
                )}
                <div className="pt-4">
                  <Link to={`/profile/${seller.id}`}>
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}