import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockItineraries } from "@/features/itineraries/mockItineraries";
import { durationDays, formatRange } from "@/features/itineraries/dateUtils";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function ItineraryView() {
  const { id } = useParams();
  const itinerary = mockItineraries.find((i) => i.id === id);

  return (
    <div className="min-h-screen bg-gradient-light">
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{itinerary?.destination ?? "Itinerary"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This is a placeholder “View” screen. Later it will render the full AI-generated plan.
            </p>
          </div>
          <Link to="/itineraries">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Button>
          </Link>
        </div>

        <Card className="shadow-soft">
          <div className="grid gap-4 p-6">
            {!itinerary ? (
              <div className="text-sm text-muted-foreground">Couldn’t find that itinerary in mock data.</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{itinerary.status}</Badge>
                  <Badge variant="outline">{itinerary.pace}</Badge>
                  <Badge variant="outline">{itinerary.budget}</Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  {formatRange(itinerary.startDateISO, itinerary.endDateISO)} · {durationDays(itinerary.startDateISO, itinerary.endDateISO)} days
                </div>

                <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Interests</p>
                  <p className="mt-1">{itinerary.interests.join(", ")}</p>
                </div>
              </>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}


