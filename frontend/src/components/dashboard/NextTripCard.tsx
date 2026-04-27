import { useNavigate } from "react-router-dom";
import { format, differenceInDays, isAfter, isBefore } from "date-fns";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trip, Itinerary } from "@/hooks/useDashboard";

interface NextTripCardProps {
  trip: Trip | null;
  hasItinerary: boolean;
}

export function NextTripCard({ trip, hasItinerary }: NextTripCardProps) {
  const navigate = useNavigate();

  if (!trip) {
    return (
      <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8 bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg">
        <h3 className="font-serif text-[24px] text-[var(--app-text-primary)] mb-2 font-light">No upcoming trips.</h3>
        <p className="text-[var(--app-text-primary)]/50 text-sm mb-6 max-w-sm mx-auto">
          You don't have any upcoming trips planned. Time to start dreaming about your next destination.
        </p>
        <button
          onClick={() => navigate("/create-trip")}
          className="bg-[var(--app-accent-primary)] text-[var(--app-bg-primary)] px-6 py-2.5 rounded-[2px] font-sans text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[#b09055] transition-colors"
        >
          Start planning →
        </button>
      </div>
    );
  }

  const startDate = trip.start_date ? new Date(trip.start_date) : null;
  const endDate = trip.end_date ? new Date(trip.end_date) : null;
  const today = new Date();

  // Determine countdown state
  let countdownText = "Planning";
  let countdownColor = "text-[var(--app-accent-primary)] bg-[var(--app-accent-primary)]/10 border-[var(--app-accent-primary)]/20";

  if (startDate && endDate) {
    if (isAfter(startDate, today)) {
      const days = differenceInDays(startDate, today);
      countdownText = days === 0 ? "Starts today!" : `${days} days away`;
    } else if (isBefore(endDate, today)) {
      countdownText = "Completed";
      countdownColor = "text-[var(--app-text-primary)]/60 bg-[var(--app-text-primary)]/5 border-[var(--app-text-primary)]/10";
    } else {
      countdownText = "Trip is active";
      countdownColor = "text-green-400 bg-green-400/10 border-green-400/20";
    }
  }

  const formattedDates = startDate && endDate 
    ? `${format(startDate, "MMM d")} → ${format(endDate, "MMM d, yyyy")}`
    : "Dates TBD";

  const hasBudget = trip.total_budget && trip.total_budget > 0;

  return (
    <div className="h-full flex flex-col p-6 bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg transition-colors hover:border-[var(--app-accent-primary)]/30">
      <span className="text-[var(--app-accent-primary)] text-[11px] font-bold uppercase tracking-[0.15em] mb-4">
        Your next trip
      </span>

      <div className="flex-1">
        <h2 className="font-serif text-[32px] text-[var(--app-text-primary)] leading-tight mb-1">
          {trip.destination || "Unnamed Trip"}
        </h2>
        <p className="text-[var(--app-text-primary)]/50 text-[14px] mb-4 font-sans">
          {formattedDates}
        </p>

        <span className={cn(
          "inline-block px-3 py-1 rounded border text-xs font-semibold uppercase tracking-wider mb-6",
          countdownColor
        )}>
          {countdownText}
        </span>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex items-center gap-2 text-[13px] font-medium">
            {hasItinerary ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-[var(--app-accent-primary)]" />
            )}
            <span className={hasItinerary ? "text-[var(--app-text-primary)]/80" : "text-[var(--app-text-primary)]/60"}>
              {hasItinerary ? "Itinerary ready" : "No itinerary yet"}
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-4 bg-[var(--app-text-primary)]/10 my-auto" />

          <div className="flex items-center gap-2 text-[13px] font-medium">
            {hasBudget ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-[var(--app-accent-primary)]" />
            )}
            <span className={hasBudget ? "text-[var(--app-text-primary)]/80" : "text-[var(--app-text-primary)]/60"}>
              {hasBudget ? "Budget set" : "No budget set"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/trip/${trip.id}`)}
        className="w-fit bg-[var(--app-accent-primary)] text-[var(--app-bg-primary)] px-6 py-2.5 rounded-[2px] font-sans text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[#b09055] transition-colors"
      >
        View trip →
      </button>
    </div>
  );
}
