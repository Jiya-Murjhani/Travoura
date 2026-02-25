import { useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";

type TripPlan = {
  destination: string;
  startDate: string;
  endDate: string;
  flexibleDates: boolean;
  travelers: { adults: number; children: number };
  budgetTier: 1 | 2 | 3;
  accommodation: string;
  transport: string;
  vibes: string[];
  specialRequests: string;
  aiPreferences: {
    hiddenGems: boolean;
    avoidCrowds: boolean;
    budgetOptimization: boolean;
  };
};

export default function ItineraryResults() {
  const location = useLocation();
  const trip = (location.state as { trip?: TripPlan } | null)?.trip;

  const budgetLabel = trip?.budgetTier === 1 ? "Budget" : trip?.budgetTier === 2 ? "Comfort" : "Luxury";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8C8B4] via-[#E6A6B3] to-[#C7D2FE]">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm text-white/85">
              <Sparkles className="h-4 w-4" />
              Itinerary results (demo)
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow">
              {trip?.destination ? `Your trip to ${trip.destination}` : "Your AI itinerary"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/85">
              This is a placeholder results page. Later, we’ll render a full day-by-day itinerary from the AI.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/startplanning">
              <Button variant="secondary" className="gap-2 bg-white/70 hover:bg-white/80">
                <ArrowLeft className="h-4 w-4" />
                Back to planner
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mt-8 rounded-2xl border border-white/25 bg-white/20 shadow-soft">
          <CardContent className="p-6">
            {!trip ? (
              <div className="text-sm text-white/85">
                No trip data found. Start from <Link className="underline" to="/startplanning">Start Planning</Link>.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/70 text-foreground">{budgetLabel}</Badge>
                    <Badge variant="outline" className="border-white/40 text-white">
                      {trip.accommodation}
                    </Badge>
                    <Badge variant="outline" className="border-white/40 text-white">
                      {trip.transport}
                    </Badge>
                  </div>

                  <div className="text-sm text-white/85">
                    <div>
                      <span className="font-semibold text-white">Dates:</span>{" "}
                      {trip.startDate && trip.endDate ? `${trip.startDate} → ${trip.endDate}` : trip.flexibleDates ? "Flexible" : "—"}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold text-white">Travelers:</span>{" "}
                      {trip.travelers.adults} adult{trip.travelers.adults === 1 ? "" : "s"}
                      {trip.travelers.children ? `, ${trip.travelers.children} child${trip.travelers.children === 1 ? "" : "ren"}` : ""}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold text-white">Vibes:</span>{" "}
                      {trip.vibes.length ? trip.vibes.join(", ") : "—"}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/25 bg-white/15 p-5 text-sm text-white/85">
                  <div className="font-semibold text-white">Special requests</div>
                  <p className="mt-2">{trip.specialRequests || "—"}</p>

                  <div className="mt-4 font-semibold text-white">AI preferences</div>
                  <ul className="mt-2 list-disc pl-5">
                    <li>Hidden gems: {trip.aiPreferences.hiddenGems ? "On" : "Off"}</li>
                    <li>Avoid crowds: {trip.aiPreferences.avoidCrowds ? "On" : "Off"}</li>
                    <li>Budget optimization: {trip.aiPreferences.budgetOptimization ? "On" : "Off"}</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



