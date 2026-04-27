import { Itinerary } from "@/hooks/useDashboard";
import { format } from "date-fns";
import { ArrowRight, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentItinerariesProps {
  itineraries: Itinerary[];
}

export function RecentItineraries({ itineraries }: RecentItinerariesProps) {
  const navigate = useNavigate();
  
  // Filter out deleted, then sort by created_at descending
  const validItineraries = itineraries
    .filter(i => (i as any).status !== 'deleted')
    .sort((a, b) => new Date((b as any).created_at || (b as any).createdAt || 0).getTime() - new Date((a as any).created_at || (a as any).createdAt || 0).getTime())
    .slice(0, 3);

  if (validItineraries.length === 0) {
    return (
      <div className="dashboard-card w-full p-6 flex flex-col items-center justify-center text-center">
        <Map className="w-8 h-8 text-[var(--app-text-secondary)] mb-3" />
        <p className="text-[var(--app-text-primary)]/50 text-sm mb-4">No itineraries yet. Generate one for your trip.</p>
        <button 
          onClick={() => navigate("/generate-itinerary")}
          className="text-[var(--app-accent-primary)] text-sm font-medium hover:underline"
        >
          Create Itinerary →
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="font-serif text-xl text-[var(--app-text-primary)] font-light mb-4">Recent Itineraries</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {validItineraries.map((itinerary: any) => {
          // Extract dates from itinerary data if possible, else fallback to created_at
          const createdAt = itinerary.created_at || itinerary.createdAt || new Date().toISOString();
          let dateStr = "Created " + format(new Date(createdAt), "MMM d, yyyy");
          
          const destination = itinerary.destination || itinerary.itinerary_data?.destination || "Mystery Destination";
          
          return (
            <div 
              key={itinerary.id} 
              className="dashboard-card flex flex-col justify-between p-5"
            >
              <div>
                <h4 className="font-serif text-lg text-[var(--app-text-primary)] line-clamp-1 mb-1">
                  {destination}
                </h4>
                <p className="text-xs text-[var(--app-text-primary)]/50 mb-4">{dateStr}</p>
              </div>
              
              <button 
                onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                className="flex items-center gap-1 text-sm text-[var(--app-accent-primary)] font-medium w-fit hover:text-[#b09055] transition-colors"
              >
                View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
