import { useNavigate } from "react-router-dom";
import { Plus, Wand2, Receipt } from "lucide-react";

interface QuickActionsBarProps {
  activeTripId?: string;
}

export function QuickActionsBar({ activeTripId }: QuickActionsBarProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-[#121212]/80 backdrop-blur-md border border-[var(--app-text-primary)]/10 rounded-full shadow-2xl shadow-black/50">
        
        <button
          onClick={() => navigate("/generate-itinerary")}
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[var(--app-text-primary)]/5 transition-colors text-sm font-medium text-[var(--app-text-primary)]"
        >
          <Wand2 className="w-4 h-4 text-[var(--app-accent-primary)]" />
          <span>Generate Itinerary</span>
        </button>
        
        <div className="w-[1px] h-6 bg-[var(--app-text-primary)]/10" />
        
        <button
          onClick={() => navigate(activeTripId ? `/trip/${activeTripId}/budget` : `/app/budget`)}
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[var(--app-text-primary)]/5 transition-colors text-sm font-medium text-[var(--app-text-primary)]"
        >
          <Receipt className="w-4 h-4 text-[var(--app-accent-primary)]" />
          <span>Add Expense</span>
        </button>
        
        <div className="w-[1px] h-6 bg-[var(--app-text-primary)]/10" />
        
        <button
          onClick={() => navigate("/create-trip")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--app-accent-primary)]/10 hover:bg-[var(--app-accent-primary)]/20 transition-colors text-sm font-medium text-[var(--app-accent-primary)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Trip</span>
        </button>

      </div>
    </div>
  );
}
