import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import type { Itinerary } from "@/hooks/useDashboard";

interface ItineraryStripProps {
  itineraries: Itinerary[];
}

export function ItineraryStrip({ itineraries }: ItineraryStripProps) {
  const navigate = useNavigate();

  // Sort by created_at descending, take first 3
  const sortedItineraries = [...itineraries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const getDuration = (itinerary: Itinerary) => {
    // If itinerary_data has start_date and end_date
    if (itinerary.itinerary_data?.start_date && itinerary.itinerary_data?.end_date) {
      const start = new Date(itinerary.itinerary_data.start_date);
      const end = new Date(itinerary.itinerary_data.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
      if (diffDays > 0 && !isNaN(diffDays)) return diffDays;
    }
    // Fallback to array length
    if (Array.isArray(itinerary.itinerary_data?.days)) {
      return itinerary.itinerary_data.days.length;
    }
    if (Array.isArray(itinerary.itinerary_data)) {
      return itinerary.itinerary_data.length;
    }
    return "?";
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-[24px] text-[var(--app-text-primary)] font-light">Recent itineraries</h3>
        <button 
          onClick={() => navigate("/app/itineraries")}
          className="text-[var(--app-accent-primary)] text-[13px] hover:text-[#b09055] transition-colors font-medium"
        >
          View all →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedItineraries.length > 0 ? (
          sortedItineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="flex flex-col p-6 bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg transition-colors hover:border-[var(--app-accent-primary)]/30 group"
            >
              <h4 className="font-serif text-[20px] text-[var(--app-text-primary)] mb-1 truncate">
                {itinerary.destination || "Unnamed Destination"}
              </h4>
              <p className="text-[var(--app-text-primary)]/60 text-[13px] font-sans mb-3">
                {getDuration(itinerary)} days
              </p>
              <p className="text-[var(--app-text-primary)]/40 text-[12px] font-sans mb-6">
                Generated {format(new Date(itinerary.created_at), "MMM d, yyyy")}
              </p>
              <button
                onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                className="mt-auto text-[var(--app-accent-primary)] text-[13px] font-semibold hover:text-[#b09055] transition-colors self-start"
              >
                View itinerary →
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center p-8 bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] border-dashed rounded-lg text-center">
            <p className="text-[var(--app-text-primary)]/50 text-sm mb-4">No itineraries yet.</p>
            <button
              onClick={() => navigate("/app/generate-itinerary")}
              className="text-[var(--app-accent-primary)] text-[13px] font-semibold hover:text-[#b09055] transition-colors"
            >
              Generate your first AI itinerary →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
