import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { ItineraryCard } from "@/components/itineraries/ItineraryCard";
import { EmptyItineraries } from "@/components/itineraries/EmptyItineraries";
import { mockItineraries } from "@/features/itineraries/mockItineraries";
import { useMemo, useState } from "react";
import type { Itinerary, ItineraryFilter } from "@/features/itineraries/types";
import { isPast, isUpcoming } from "@/features/itineraries/dateUtils";

function filterItineraries(items: Itinerary[], filter: ItineraryFilter) {
  if (filter === "All") return items;
  if (filter === "Drafts") return items.filter((i) => i.status === "Draft");
  if (filter === "Upcoming") return items.filter((i) => i.status !== "Draft" && isUpcoming(i.startDateISO));
  if (filter === "Past") return items.filter((i) => i.status !== "Draft" && isPast(i.endDateISO));
  return items;
}

export default function ItinerariesDashboard() {
  // Static for now; later this becomes server state (React Query already installed).
  const [filter, setFilter] = useState<ItineraryFilter>("All");
  const [searchParams] = useSearchParams();
  // Handy for design/QA: `/itineraries?empty=1` forces the empty state without changing mock data.
  const forceEmpty = searchParams.get("empty") === "1";
  const itineraries = forceEmpty ? [] : mockItineraries;
  const visible = useMemo(() => filterItineraries(itineraries, filter), [itineraries, filter]);

  return (
    <div className="min-h-screen bg-gradient-light">
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">My Itineraries</h2>
            <p className="mt-1 text-sm text-muted-foreground">Every journey you’ve planned, in one place.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/itineraries/new">
              <Button className="hidden gap-2 sm:inline-flex">
                <Plus className="h-4 w-4" />
                Create New Itinerary
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as ItineraryFilter)}>
            <TabsList className="bg-background/70 backdrop-blur">
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="Past">Past</TabsTrigger>
              <TabsTrigger value="Drafts">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-6">
          {itineraries.length === 0 ? (
            <EmptyItineraries />
          ) : (
            <>
              {visible.length === 0 ? (
                <div className="rounded-2xl border border-border bg-background/70 p-8 text-center text-sm text-muted-foreground">
                  Nothing here yet for <span className="font-medium text-foreground">{filter}</span>. Try another tab.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((itinerary) => (
                    <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile-first “always available” primary action (mirrors header CTA on desktop). */}
      <Link to="/itineraries/new" className="fixed bottom-6 right-6 sm:hidden">
        <Button className="gap-2 shadow-soft">
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </Link>
    </div>
  );
}


