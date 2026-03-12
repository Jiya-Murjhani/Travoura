import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TripCard, Trip } from "@/components/TripCard";

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/trips", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data.trips)) {
          setTrips(
            data.trips.map((t: any) => ({
              id: String(t.id),
              destination: t.destination,
              startDate: t.startDate,
              endDate: t.endDate,
              budget: Number(t.budget) || 0,
            })),
          );
        } else {
          setError(data?.message || "Could not load trips.");
        }
      } catch (err) {
        console.error("Fetch trips failed:", err);
        setError("Something went wrong while loading trips.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

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

