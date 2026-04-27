import { Trip } from "@/hooks/useDashboard";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Wallet, Activity, MapPin, ArrowRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroTripCardProps {
  trip: Trip;
  itineraryId: string | null;
}

export function HeroTripCard({ trip, itineraryId }: HeroTripCardProps) {
  const navigate = useNavigate();
  const today = new Date();
  
  // Parse dates safely
  const startDate = trip.start_date ? new Date(trip.start_date) : null;
  const endDate = trip.end_date ? new Date(trip.end_date) : null;
  
  const isOngoing = startDate && endDate && startDate <= today && today <= endDate;
  const isUpcoming = startDate && startDate > today;
  const isPast = endDate && endDate < today;

  let badgeText = "";
  let badgeColor = "bg-gray-500/20 text-gray-300";

  if (isOngoing && startDate && endDate) {
    const dayOf = differenceInDays(today, startDate) + 1;
    const totalDays = differenceInDays(endDate, startDate) + 1;
    badgeText = `Day ${dayOf} of ${totalDays}`;
    badgeColor = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  } else if (isUpcoming && startDate) {
    const daysToGo = differenceInDays(startDate, today);
    badgeText = `${daysToGo} day${daysToGo === 1 ? '' : 's'} to go`;
    badgeColor = "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  } else if (isPast) {
    badgeText = "Completed";
    badgeColor = "bg-blue-500/20 text-blue-400 border border-blue-500/30";
  }

  const dateRangeStr = startDate && endDate 
    ? `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`
    : 'Dates not set';

  // Parse trip_type if it's an array stored as json or text. If not available, fallback.
  // The backend might send it as part of a `group_type` or similar. Let's assume standard properties.
  // Using 'any' cast as the actual interface might lack some specific DB fields not modeled in useDashboard
  const anyTrip = trip as any;

  let gradientClass = "var(--app-gradient-card)";
  if (trip.destination.toLowerCase().includes("japan") || trip.destination.toLowerCase().includes("tokyo")) {
    gradientClass = "linear-gradient(135deg, #1e1b3a, #2d1b4e)";
  } else if (trip.destination.toLowerCase().includes("bali") || trip.destination.toLowerCase().includes("indonesia")) {
    gradientClass = "linear-gradient(135deg, #1b2d3a, #1b3a2d)";
  } else if (trip.destination.toLowerCase().includes("paris") || trip.destination.toLowerCase().includes("europe")) {
    gradientClass = "linear-gradient(135deg, #1e2040, #2d2650)";
  } else if (trip.destination.toLowerCase().includes("goa") || trip.destination.toLowerCase().includes("india")) {
    gradientClass = "linear-gradient(135deg, #2d1f3a, #3a1b2d)";
  } else {
    gradientClass = "linear-gradient(135deg, #1a1826, #0f0e17)";
  }

  return (
    <div className="dashboard-card w-full relative overflow-hidden" style={{ background: gradientClass }}>
      <div className="p-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Content */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("px-3 py-1 rounded-full text-xs font-semibold tracking-wide", badgeColor)}>
              {badgeText}
            </div>
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--app-text-primary)] font-light mb-2 flex items-center gap-3">
            {trip.destination}
          </h2>
          
          <div className="flex items-center gap-2 text-[var(--app-text-primary)]/60 text-sm md:text-base mb-8">
            <Calendar className="w-4 h-4" />
            <span>{dateRangeStr}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {anyTrip.group_type && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--app-text-primary)]/5 border border-[var(--app-text-primary)]/10 text-xs text-[var(--app-text-primary)]/80">
                <Users className="w-3.5 h-3.5 text-[var(--app-accent-primary)]" />
                <span className="capitalize">{anyTrip.group_type}</span>
              </div>
            )}
            {anyTrip.num_travelers && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--app-bg-glass)] border border-[var(--app-border-default)] text-xs text-[var(--app-text-secondary)]">
                <Users className="w-3.5 h-3.5 text-[var(--app-accent-primary)]" />
                <span className="font-medium">{anyTrip.num_travelers}</span> travelers
              </div>
            )}
            {anyTrip.budget_tier && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--app-bg-glass)] border border-[var(--app-border-default)] text-xs text-[var(--app-text-secondary)]">
                <Wallet className="w-3.5 h-3.5 text-[var(--app-success)]" />
                <span className="capitalize">{anyTrip.budget_tier} Budget</span>
              </div>
            )}
            {anyTrip.pace && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--app-bg-glass)] border border-[var(--app-border-default)] text-xs text-[var(--app-text-secondary)]">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span className="capitalize">{anyTrip.pace} Pace</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Content / Actions */}
        <div className="flex flex-col justify-end gap-3 md:min-w-[240px]">
          {itineraryId ? (
            <button 
              onClick={() => navigate(`/itinerary/${itineraryId}`)}
              className="cta-primary w-full flex items-center justify-between text-sm py-3.5"
            >
              <span>View Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={() => navigate(`/trip/${trip.id}/generate-itinerary`)}
              className="cta-primary w-full flex items-center justify-between text-sm py-3.5"
            >
              <span>Generate Itinerary</span>
              <WandIcon className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="cta-ghost w-full flex items-center justify-center gap-2 text-sm py-3.5"
          >
            <Settings className="w-4 h-4" />
            <span>Manage Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function WandIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9h2" />
      <path d="M20 9h2" />
      <path d="M17.8 11.8 19 13" />
      <path d="M15 9h.01" />
      <path d="M17.8 6.2 19 5" />
      <path d="m3 21 9-9" />
      <path d="M12.2 6.2 11 5" />
    </svg>
  )
}
