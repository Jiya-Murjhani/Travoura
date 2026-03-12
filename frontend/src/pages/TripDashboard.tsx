import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ListChecks, Plane, Hotel } from "lucide-react";

const TripDashboard = () => {
  const { tripId } = useParams<{ tripId: string }>();

  // In a real app, you would fetch the trip details by ID here.
  // For now, we show a placeholder layout focused on navigation.

  return (
    <div className="min-h-screen bg-gradient-light px-4 py-10">
      <div className="mx-auto max-w-5xl pt-16 space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Trip dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Trip #{tripId}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your budget, itinerary, flights, and stays for this trip.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/60 bg-card/95 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Trip Overview</CardTitle>
              <CardDescription>
                Destination, dates, and budget summary will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a placeholder overview. Once your backend supports trip details, this
                section can show real data for destination, dates, and total budget.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/95 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <CardDescription>Jump into a module to start planning.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-xl">
                <Link to={`/trip/${tripId}/budget`} className="inline-flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Budget Tracker
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="#" className="inline-flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Itinerary (coming soon)
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="#" className="inline-flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Flights (coming soon)
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="#" className="inline-flex items-center gap-2">
                  <Hotel className="h-4 w-4" />
                  Hotels (coming soon)
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default TripDashboard;

