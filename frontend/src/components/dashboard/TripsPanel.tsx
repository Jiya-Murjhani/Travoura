import { useState, useEffect } from "react";
import { Trip } from "@/hooks/useDashboard";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripsPanelProps {
  trips: Trip[];
}

export function TripsPanel({ trips }: TripsPanelProps) {
  const navigate = useNavigate();
  const today = new Date();

  const ongoingTrips = trips.filter(t => t.start_date && t.end_date && new Date(t.start_date) <= today && today <= new Date(t.end_date));
  const upcomingTrips = trips.filter(t => t.start_date && new Date(t.start_date) > today).sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime());
  const pastTrips = trips.filter(t => t.end_date && new Date(t.end_date) < today).sort((a, b) => new Date(b.end_date!).getTime() - new Date(a.end_date!).getTime());

  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past">("upcoming");

  useEffect(() => {
    if (upcomingTrips.length > 0) setActiveTab("upcoming");
    else if (ongoingTrips.length > 0) setActiveTab("ongoing");
    else if (pastTrips.length > 0) setActiveTab("past");
  }, [trips]); // run once on mount or when trips change significantly

  const displayTrips = activeTab === "upcoming" ? upcomingTrips : activeTab === "ongoing" ? ongoingTrips : pastTrips;
  const slicedTrips = displayTrips.slice(0, 3);

  return (
    <div className="dashboard-card w-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl text-[var(--app-text-primary)] font-light">Your Trips</h3>
        
        <div className="flex items-center bg-[var(--app-text-primary)]/5 rounded-lg p-1">
          <TabButton active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")} count={upcomingTrips.length}>Upcoming</TabButton>
          <TabButton active={activeTab === "ongoing"} onClick={() => setActiveTab("ongoing")} count={ongoingTrips.length}>Ongoing</TabButton>
          <TabButton active={activeTab === "past"} onClick={() => setActiveTab("past")} count={pastTrips.length}>Past</TabButton>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {slicedTrips.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <Plane className="w-8 h-8 text-[var(--app-text-primary)]/20 mb-3" />
            <p className="text-[var(--app-text-primary)]/50 text-sm">No {activeTab} trips found.</p>
          </div>
        ) : (
          slicedTrips.map(trip => {
            const dateStr = trip.start_date && trip.end_date 
              ? `${format(new Date(trip.start_date), 'MMM d')} - ${format(new Date(trip.end_date), 'MMM d, yy')}` 
              : 'Dates TBD';
            const budgetTier = (trip as any).budget_tier;

            return (
              <div 
                key={trip.id} 
                className="group flex items-center justify-between p-4 rounded-lg bg-[var(--app-text-primary)]/[0.02] border border-[var(--app-text-primary)]/5 hover:bg-[var(--app-text-primary)]/[0.04] transition-colors cursor-pointer"
                onClick={() => navigate(`/trip/${trip.id}`)}
              >
                <div>
                  <h4 className="font-sans font-medium text-[var(--app-text-primary)]">{trip.destination}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--app-text-primary)]/50">
                    <span>{dateStr}</span>
                    {budgetTier && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[var(--app-text-primary)]/20" />
                        <span className="capitalize">{budgetTier}</span>
                      </>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--app-text-primary)]/30 group-hover:text-[var(--app-accent-primary)] transition-colors" />
              </div>
            );
          })
        )}
      </div>

      <button 
        onClick={() => navigate("/trips")}
        className="mt-4 pt-4 border-t border-[var(--app-text-primary)]/10 text-center text-sm text-[var(--app-accent-primary)] hover:text-[#b09055] transition-colors w-full"
      >
        View all trips →
      </button>
    </div>
  );
}

function TabButton({ children, active, count, onClick, status }: { children: React.ReactNode, active: boolean, count: number, onClick: () => void, status?: string }) {
  if (count === 0 && !active) return null; // Hide empty tabs if not active
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-[4px] uppercase",
        status === "ongoing" 
          ? "bg-[rgba(110,231,183,0.1)] text-[var(--app-success)] border border-[rgba(110,231,183,0.3)]" 
          : status === "upcoming"
          ? "bg-[rgba(139,120,221,0.15)] text-[var(--app-accent-light)] border border-[var(--app-border-hover)]"
          : "bg-[rgba(200,192,230,0.05)] text-[var(--app-text-tertiary)] border border-[rgba(200,192,230,0.1)]"
      )}
    >
      {children} {count > 0 && <span className="opacity-70 ml-1">({count})</span>}
    </button>
  );
}
