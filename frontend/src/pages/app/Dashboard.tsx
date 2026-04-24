import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useBudget } from "@/contexts/BudgetContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Plane,
  Hotel,
  Map,
  Wallet,
  Calendar,
  ChevronRight,
  Radio,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  { to: "/app/flights", label: "Search Flights", icon: Plane },
  { to: "/app/hotels", label: "Find Hotels", icon: Hotel },
  { to: "/app/itineraries", label: "Itineraries", icon: Map },
  { to: "/app/budget", label: "Budget Tracker", icon: Wallet },
];

const mockUpdates = [
  { id: "1", text: "Flight JFK → LHR on time. Gate B12.", time: "2m ago", type: "flight" },
  { id: "2", text: "Weather in Bali: Sunny, 28°C.", time: "1h ago", type: "weather" },
  { id: "3", text: "Your hotel check-in is from 3:00 PM.", time: "3h ago", type: "hotel" },
];

function getDaysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  if (diff < 0) return null;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

type Trip = {
  id: string;
  destination: string;
  dates: string;
  startDate?: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Traveler");
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      // Get name from metadata
      const name = user.user_metadata?.full_name ?? user.email ?? "Traveler";
      setUserName(name);

      // Fetch trips
      const { data: trips, error } = await supabase
        .from("trips")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Failed to fetch trips:", error);
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      setUpcomingTrips(
        (trips ?? [])
          .filter((t) => !t.start_date || t.start_date >= today || t.status === "planning")
          .map((t) => ({
            id: t.id,
            destination: t.destination,
            dates: t.start_date ?? "Date TBD",
            startDate: t.start_date,
          }))
      );

      setPastTrips(
        (trips ?? [])
          .filter((t) => t.start_date && t.start_date < today && t.status !== "planning")
          .map((t) => ({
            id: t.id,
            destination: t.destination,
            dates: t.start_date,
          }))
      );

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const { budgetData } = useBudget();
  const budgetPercent =
    budgetData.total > 0
      ? Math.min(100, (budgetData.spent / budgetData.total) * 100)
      : 0;

  const nextTrip = upcomingTrips[0];
  const daysUntil = nextTrip?.startDate ? getDaysUntil(nextTrip.startDate) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Welcome Header + Quick Actions */}
        <section className="space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Dashboard
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Welcome back, {userName}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Plan and manage your next adventure from one place.
              </p>
              {daysUntil !== null && nextTrip && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {daysUntil === 0
                      ? "Departure today – "
                      : daysUntil === 1
                        ? "1 day until "
                        : `${daysUntil} days until `}
                    <span className="text-primary">{nextTrip.destination}</span>
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {quickActions.map(({ to, label, icon: Icon }) => (
                <Button
                  key={to}
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link to={to} className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                Logout
              </Button>
            </div>
          </div>
        </section>

        {/* My Trips */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            My Trips
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Upcoming */}
            <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-soft transition-all duration-200 hover:shadow-elevated">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming
                </CardTitle>
                <CardDescription>Your next getaways</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTrips.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      No upcoming trips yet.
                    </p>
                    <Button asChild variant="outline" size="sm" className="rounded-xl">
                      <Link to="/create-trip">Plan a trip</Link>
                    </Button>
                  </div>
                ) : (
                  upcomingTrips.map((trip) => (
                    <Link
                      key={trip.id}
                      to={`/trip/${trip.id}`}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-5 py-4 transition-colors hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{trip.destination}</p>
                        <p className="text-sm text-muted-foreground">{trip.dates}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Past */}
            <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-soft transition-all duration-200 hover:shadow-elevated">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-lg">Past</CardTitle>
                <CardDescription>Trips you've taken</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastTrips.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No past trips yet.
                  </p>
                ) : (
                  pastTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-5 py-4 opacity-90"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{trip.destination}</p>
                        <p className="text-sm text-muted-foreground">{trip.dates}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* My Itineraries */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              My Itineraries
            </h2>
            <Button asChild variant="ghost" size="sm" className="rounded-xl transition-colors duration-200">
              <Link to="/app/itineraries">View all</Link>
            </Button>
          </div>
          <Card className="overflow-hidden rounded-3xl border-border/80 bg-card shadow-soft transition-all duration-200 hover:shadow-elevated">
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Map className="mb-4 h-12 w-12 opacity-50" />
                <p className="mb-6">No itineraries yet.</p>
                <Button asChild variant="outline" size="sm" className="rounded-xl transition-all duration-200 hover:shadow-md">
                  <Link to="/itineraries/new">Create itinerary</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Budget + Real-Time Updates */}
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Budget Overview
            </h2>
            <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-soft transition-all duration-200 hover:shadow-elevated">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                  Spending progress
                </CardTitle>
                <CardDescription>
                  ₹{budgetData.spent.toLocaleString()} of ₹{budgetData.total.toLocaleString()} used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={budgetPercent} className="h-3 rounded-full" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">0%</span>
                  <span className="font-semibold text-foreground">{Math.round(budgetPercent)}%</span>
                  <span className="text-muted-foreground">100%</span>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full rounded-xl transition-all duration-200 hover:shadow-md">
                  <Link to="/app/budget">Open Budget Tracker</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Real-Time Updates
              </h2>
              <Button asChild variant="ghost" size="sm" className="rounded-xl transition-colors duration-200">
                <Link to="/app/updates">View all</Link>
              </Button>
            </div>
            <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-soft transition-all duration-200 hover:shadow-elevated">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Radio className="h-5 w-5 text-primary" />
                  Live updates
                </CardTitle>
                <CardDescription>Flight, weather, and booking updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {mockUpdates.map((update) => (
                    <li
                      key={update.id}
                      className="flex gap-4 rounded-2xl border border-border/60 bg-muted/20 px-5 py-4 transition-colors hover:bg-muted/30"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{update.text}</p>
                        <p className="text-xs text-muted-foreground">{update.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}