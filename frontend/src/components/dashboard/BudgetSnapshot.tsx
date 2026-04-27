import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useBudget } from "@/contexts/BudgetContext";
import type { Trip } from "@/hooks/useDashboard";

interface BudgetSnapshotProps {
  nextTrip: Trip | null;
}

export function BudgetSnapshot({ nextTrip }: BudgetSnapshotProps) {
  const navigate = useNavigate();
  const { budgetData, activeTripName, activeTripId } = useBudget();

  // Determine if there's a budget for the active trip context
  // The global BudgetContext handles which trip is active, but we can display the data it provides
  const totalBudget = budgetData.total || 0;
  const spent = budgetData.spent || 0;
  const hasBudget = totalBudget > 0;
  const remaining = Math.max(0, totalBudget - spent);
  
  const percentUsed = hasBudget ? Math.min(100, Math.round((spent / totalBudget) * 100)) : 0;
  
  let barColor = "bg-[var(--app-accent-primary)]";
  if (percentUsed > 60 && percentUsed <= 85) barColor = "bg-amber-500";
  if (percentUsed > 85) barColor = "bg-red-500";

  const displayTripName = activeTripName || nextTrip?.destination || "Upcoming Trip";

  if (!hasBudget) {
    return (
      <div className="h-full flex flex-col p-6 bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg">
        <span className="text-[var(--app-accent-primary)] text-[11px] font-bold uppercase tracking-[0.15em] mb-4">
          Budget overview
        </span>
        <div className="flex-1 flex flex-col justify-center items-start">
          <p className="text-[var(--app-text-primary)]/50 text-sm mb-4">
            No budget set for {displayTripName}
          </p>
          <button
            onClick={() => navigate(activeTripId ? `/trip/${activeTripId}/budget` : "/app/budget")}
            className="text-[var(--app-accent-primary)] text-[13px] font-semibold hover:text-[#b09055] transition-colors"
          >
            Set budget →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg transition-colors hover:border-[var(--app-accent-primary)]/30">
      <span className="text-[var(--app-accent-primary)] text-[11px] font-bold uppercase tracking-[0.15em] mb-4">
        Budget overview
      </span>

      <h3 className="font-serif text-[18px] text-[var(--app-text-primary)] mb-4 truncate w-full">
        {displayTripName}
      </h3>

      <div className="mb-2">
        <span className="text-[var(--app-text-primary)] font-sans text-sm">Total: ₹{totalBudget.toLocaleString('en-IN')}</span>
      </div>

      <div className="w-full h-2 bg-[var(--app-text-primary)]/10 rounded-full overflow-hidden mb-2">
        <div 
          className={cn("h-full transition-all duration-500", barColor)} 
          style={{ width: `${percentUsed}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center mb-6 text-xs font-sans">
        <span className="text-[var(--app-text-primary)]/50">Spent: ₹{spent.toLocaleString('en-IN')}</span>
        <span className="text-[var(--app-text-primary)]/50">Remaining: ₹{remaining.toLocaleString('en-IN')}</span>
      </div>

      <button
        onClick={() => navigate(activeTripId ? `/trip/${activeTripId}/budget` : "/app/budget")}
        className="mt-auto text-[var(--app-accent-primary)] text-[13px] font-semibold hover:text-[#b09055] transition-colors self-start"
      >
        View full budget →
      </button>
    </div>
  );
}
