import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TripCard, Trip } from "@/components/TripCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Trips = () => {
  const { session } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!session?.user) return;

      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("trips")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Fetch trips error:", fetchError);
          setError(fetchError.message || "Could not load trips.");
          return;
        }

        if (Array.isArray(data)) {
          setTrips(
            data.map((t: any) => ({
              id: String(t.id || t.trip_id),
              destination: t.destination || "Unknown",
              startDate: t.start_date || "",
              durationDays: t.duration_days || 0,
              totalBudget: Number(t.total_budget) || 0,
              currency: t.currency || "INR",
              travelStyle: t.travel_style || "",
              groupType: t.group_type || "",
              interests: t.interests || [],
              status: t.status || "planning",
            })),
          );
        } else {
          setTrips([]);
        }
      } catch (err) {
        console.error("Fetch trips failed:", err);
        setError("Something went wrong while loading trips.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-light px-4 py-10">
      <div className="mx-auto max-w-5xl pt-16 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Trips</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all your planned adventures in one place.
          </p>
        </header>

        <Card className="border-border/60 bg-card/95 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Trips</CardTitle>
            <CardDescription>Click a trip to open its dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-sm text-muted-foreground">Loading trips...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!loading && !error && trips.length === 0 && (
              <p className="text-sm text-muted-foreground">You haven&apos;t created any trips yet.</p>
            )}
            {!loading && !error && trips.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Trips;
