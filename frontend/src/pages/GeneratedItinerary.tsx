import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CreateItineraryDraft } from "@/features/itineraries/types";
import { formatRange, durationDays } from "@/features/itineraries/dateUtils";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function GeneratedItinerary() {
  const location = useLocation();
  const draft = (location.state as { draft?: CreateItineraryDraft } | null)?.draft;

  return (
    <div className="min-h-screen bg-gradient-light">
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Placeholder view
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Your itinerary (preview)</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This will become the AI-generated itinerary screen. For now, we’re showing the submitted preferences.
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
            {!draft ? (
              <div className="text-sm text-muted-foreground">
                No draft data found. Start from <Link className="underline" to="/itineraries/new">Create itinerary</Link>.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{draft.budget || "—"}</Badge>
                  <Badge variant="outline">{draft.pace || "—"}</Badge>
                  {draft.food ? <Badge variant="outline">{draft.food}</Badge> : null}
                </div>

                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="font-medium">Destination:</span> {draft.destination || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Dates:</span>{" "}
                    {draft.startDateISO && draft.endDateISO
                      ? `${formatRange(draft.startDateISO, draft.endDateISO)} · ${durationDays(draft.startDateISO, draft.endDateISO)} days`
                      : "—"}
                  </div>
                  <div>
                    <span className="font-medium">Travelers:</span> {draft.travelers || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Interests:</span>{" "}
                    {draft.interests.length ? draft.interests.join(", ") : "—"}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">What happens next (later):</p>
                  <ul className="mt-2 list-disc pl-5">
                    <li>We’ll send this draft to the AI itinerary model</li>
                    <li>We’ll render day-by-day cards with maps, timings, and booking links</li>
                    <li>You’ll be able to edit + regenerate sections</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}


