import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SetupChecklistProps {
  preferencesComplete: boolean;
  hasTrips: boolean;
  hasItineraries: boolean;
  hasBudget: boolean;
}

export function SetupChecklist({
  preferencesComplete,
  hasTrips,
  hasItineraries,
  hasBudget,
}: SetupChecklistProps) {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      label: "Set your travel preferences",
      isComplete: preferencesComplete,
      isLocked: false,
      onClick: () => navigate("/app/settings"),
      tooltip: null,
    },
    {
      id: 2,
      label: "Create your first trip",
      isComplete: hasTrips,
      isLocked: false,
      onClick: () => navigate("/create-trip"),
      tooltip: null,
    },
    {
      id: 3,
      label: "Generate an AI itinerary",
      isComplete: hasItineraries,
      isLocked: !hasTrips,
      onClick: () => {
        if (hasTrips) navigate("/app/itineraries");
      },
      tooltip: !hasTrips ? "Create a trip first" : null,
    },
    {
      id: 4,
      label: "Set a trip budget",
      isComplete: hasBudget,
      isLocked: !hasTrips,
      onClick: () => {
        if (hasTrips) navigate("/app/budget");
      },
      tooltip: !hasTrips ? "Create a trip first" : null,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h3 className="font-serif text-[22px] text-[var(--app-text-primary)] font-light">Get started</h3>
        <p className="text-[var(--app-text-primary)]/50 font-sans text-[15px]">Four steps to your first Travoura trip</p>
      </div>

      <div className="w-full flex flex-col gap-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={step.onClick}
            disabled={step.isLocked || step.isComplete}
            title={step.tooltip || undefined}
            className={cn(
              "w-full group flex items-center justify-between p-4 rounded-lg bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] transition-all",
              step.isComplete && "opacity-60 cursor-default",
              step.isLocked && "opacity-40 cursor-not-allowed",
              !step.isComplete && !step.isLocked && "hover:border-[var(--app-accent-primary)]/30 cursor-pointer"
            )}
          >
            <div className="flex items-center gap-4">
              {step.isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-[var(--app-accent-primary)]" />
              ) : (
                <Circle className={cn("h-5 w-5", step.isLocked ? "text-[var(--app-text-primary)]/20" : "text-[var(--app-text-primary)]/40 group-hover:text-[var(--app-accent-primary)]/70")} />
              )}
              <span
                className={cn(
                  "font-sans text-[15px]",
                  step.isComplete ? "text-[var(--app-text-primary)]/50 line-through" : "text-[var(--app-text-primary)]"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {!step.isComplete && !step.isLocked && (
              <ArrowRight className="h-4 w-4 text-[var(--app-text-primary)]/40 group-hover:text-[var(--app-accent-primary)] transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
