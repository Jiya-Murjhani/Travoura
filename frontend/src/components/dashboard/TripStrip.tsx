import { useNavigate } from "react-router-dom";
import { format, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import type { Trip } from "@/hooks/useDashboard";

interface TripStripProps {
  trips: Trip[];
}

const getGradientForDestination = (destination: string) => {
  if (!destination) return "linear-gradient(135deg, var(--app-bg-primary), #2a2a20)";
  const lowerDesc = destination.toLowerCase();
  
  if (lowerDesc.includes("japan") || lowerDesc.includes("tokyo")) {
    return "linear-gradient(135deg, #1a1a2e, #16213e)";
  }
  if (lowerDesc.includes("bali") || lowerDesc.includes("indonesia")) {
    return "linear-gradient(135deg, #134e5e, #71b280)";
  }
  if (lowerDesc.includes("europe") || lowerDesc.includes("paris") || lowerDesc.includes("france")) {
    return "linear-gradient(135deg, #2c3e50, #3498db)";
  }
  if (lowerDesc.includes("india") || lowerDesc.includes("goa")) {
    return "linear-gradient(135deg, #f7971e, #ffd200)";
  }
  
  return "linear-gradient(135deg, var(--app-bg-primary), #2a2a20)";
};

const getTripStatus = (startDate: Date | null, endDate: Date | null) => {
  if (!startDate || !endDate) return { label: "PLANNING", color: "text-[var(--app-text-primary)]/60 bg-[var(--app-text-primary)]/10" };
  const today = new Date();
  
  if (isAfter(startDate, today)) return { label: "UPCOMING", color: "text-[var(--app-accent-primary)] bg-[var(--app-accent-primary)]/20" };
  if (isBefore(endDate, today)) return { label: "COMPLETED", color: "text-gray-400 bg-gray-500/20" };
  return { label: "ACTIVE", color: "text-green-400 bg-green-500/20" };
};

export function TripStrip({ trips }: TripStripProps) {
  const navigate = useNavigate();

  const displayTrips = trips.slice(0, 4);
  const remainingCount = Math.max(0, trips.length - 4);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-[24px] text-[var(--app-text-primary)] font-light">My trips</h3>
        <button 
          onClick={() => navigate("/trips")}
          className="text-[var(--app-accent-primary)] text-[13px] hover:text-[#b09055] transition-colors font-medium"
        >
          View all →
        </button>
      </div>

      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 gap-4 snap-x">
        {displayTrips.map((trip) => {
          const startDate = trip.start_date ? new Date(trip.start_date) : null;
          const endDate = trip.end_date ? new Date(trip.end_date) : null;
          const status = getTripStatus(startDate, endDate);
          const formattedDates = startDate && endDate 
            ? `${format(startDate, "MMM d")}–${format(endDate, "MMM d")}`
            : "Dates TBD";

          return (
            <button
              key={trip.id}
              onClick={() => navigate(`/trip/${trip.id}`)}
              className="flex flex-col min-w-[220px] max-w-[280px] flex-1 shrink-0 snap-start bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg overflow-hidden transition-colors hover:border-[var(--app-accent-primary)]/30 text-left group"
            >
              <div 
                className="h-[120px] w-full shrink-0 group-hover:opacity-90 transition-opacity"
                style={{ background: getGradientForDestination(trip.destination) }}
              />
              <div className="p-4 flex flex-col items-start gap-2 flex-1">
                <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm", status.color)}>
                  {status.label}
                </span>
                <h4 className="font-serif text-[18px] text-[var(--app-text-primary)] leading-tight truncate w-full">
                  {trip.destination || "Unnamed Trip"}
                </h4>
                <p className="text-[var(--app-text-primary)]/50 text-[12px] font-sans mt-auto">
                  {formattedDates}
                </p>
              </div>
            </button>
          );
        })}

        {remainingCount > 0 && (
          <button
            onClick={() => navigate("/trips")}
            className="flex flex-col min-w-[220px] flex-1 shrink-0 snap-start items-center justify-center bg-[var(--app-text-primary)]/[0.02] border border-[var(--app-text-primary)]/[0.05] border-dashed rounded-lg transition-colors hover:border-[var(--app-accent-primary)]/30 text-[var(--app-text-primary)]/50 hover:text-[var(--app-accent-primary)] group"
          >
            <span className="font-serif text-2xl mb-1">+{remainingCount}</span>
            <span className="font-sans text-sm">More trips</span>
          </button>
        )}

        {trips.length === 0 && (
          <div className="w-full text-center py-12 border border-[var(--app-text-primary)]/[0.05] border-dashed rounded-lg text-[var(--app-text-primary)]/50 text-sm">
            You don't have any trips yet.
          </div>
        )}
      </div>
    </section>
  );
}
