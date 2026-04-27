import { Trip, Itinerary } from "@/hooks/useDashboard";
import { PlaneTakeoff, Globe, Map, CalendarCheck } from "lucide-react";

interface QuickStatsCardProps {
  trips: Trip[];
  itineraries: Itinerary[];
}

export function QuickStatsCard({ trips, itineraries }: QuickStatsCardProps) {
  const today = new Date();
  
  const upcomingTripsCount = trips.filter(t => t.start_date && new Date(t.start_date) > today).length;
  const validItinerariesCount = itineraries.filter(i => (i as any).status !== 'deleted').length;
  
  const pastTrips = trips.filter(t => t.end_date && new Date(t.end_date) < today);
  const uniqueCountries = new Set<string>();
  pastTrips.forEach(t => {
    if ((t as any).country) {
      uniqueCountries.add((t as any).country);
    }
  });

  return (
    <div className="dashboard-card w-full p-5">
      <h3 className="font-sans font-medium text-[var(--app-text-primary)] text-sm mb-4">Quick Stats</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <StatTile 
          icon={<PlaneTakeoff className="w-4 h-4 text-blue-400" />}
          value={trips.length}
          label="Total Trips"
        />
        <StatTile 
          icon={<Globe className="w-4 h-4 text-emerald-400" />}
          value={uniqueCountries.size}
          label="Countries Visited"
        />
        <StatTile 
          icon={<Map className="w-4 h-4 text-purple-400" />}
          value={validItinerariesCount}
          label="Itineraries"
        />
        <StatTile 
          icon={<CalendarCheck className="w-4 h-4 text-amber-400" />}
          value={upcomingTripsCount}
          label="Upcoming"
        />
      </div>
    </div>
  );
}

function StatTile({ icon, value, label }: { icon: React.ReactNode, value: number, label: string }) {
  return (
    <div className="flex flex-col p-3 rounded-lg bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/5">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xl font-serif text-[var(--app-text-primary)] leading-none">{value}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-[var(--app-text-primary)]/50">{label}</span>
    </div>
  );
}
