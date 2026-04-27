import { useNavigate } from "react-router-dom";
import { Plus, Plane, DollarSign, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AddExpenseForm } from "@/components/expenses/AddExpenseForm";
import type { Trip } from "@/hooks/useDashboard";
import { useState } from "react";

interface QuickActionsProps {
  nextTrip: Trip | null;
}

export function QuickActions({ nextTrip }: QuickActionsProps) {
  const navigate = useNavigate();
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col p-6 bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg">
      <span className="text-[var(--app-text-primary)]/50 text-[11px] font-bold uppercase tracking-[0.15em] mb-4">
        Quick actions
      </span>

      <div className="flex flex-col gap-2.5 flex-1">
        <button
          onClick={() => navigate("/create-trip")}
          className="flex items-center gap-3 w-full p-3 rounded bg-[var(--app-text-primary)]/[0.02] border border-[var(--app-text-primary)]/[0.05] hover:border-[var(--app-accent-primary)]/30 hover:bg-[var(--app-accent-primary)]/[0.02] transition-colors text-left group"
        >
          <div className="h-8 w-8 rounded-sm bg-[var(--app-text-primary)]/[0.05] flex items-center justify-center group-hover:bg-[var(--app-accent-primary)]/10 transition-colors">
            <Plus className="h-4 w-4 text-[var(--app-text-primary)]/70 group-hover:text-[var(--app-accent-primary)]" />
          </div>
          <span className="font-sans text-[14px] text-[var(--app-text-primary)]/80 group-hover:text-[var(--app-text-primary)] font-medium">New trip</span>
        </button>

        <button
          onClick={() => navigate("/app/generate-itinerary", { state: { tripId: nextTrip?.id } })}
          className="flex items-center gap-3 w-full p-3 rounded bg-[var(--app-text-primary)]/[0.02] border border-[var(--app-text-primary)]/[0.05] hover:border-[var(--app-accent-primary)]/30 hover:bg-[var(--app-accent-primary)]/[0.02] transition-colors text-left group"
        >
          <div className="h-8 w-8 rounded-sm bg-[var(--app-text-primary)]/[0.05] flex items-center justify-center group-hover:bg-[var(--app-accent-primary)]/10 transition-colors">
            <Plane className="h-4 w-4 text-[var(--app-text-primary)]/70 group-hover:text-[var(--app-accent-primary)]" />
          </div>
          <span className="font-sans text-[14px] text-[var(--app-text-primary)]/80 group-hover:text-[var(--app-text-primary)] font-medium">Generate itinerary</span>
        </button>

        <Dialog open={expenseModalOpen} onOpenChange={setExpenseModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-3 w-full p-3 rounded bg-[var(--app-text-primary)]/[0.02] border border-[var(--app-text-primary)]/[0.05] hover:border-[var(--app-accent-primary)]/30 hover:bg-[var(--app-accent-primary)]/[0.02] transition-colors text-left group">
              <div className="h-8 w-8 rounded-sm bg-[var(--app-text-primary)]/[0.05] flex items-center justify-center group-hover:bg-[var(--app-accent-primary)]/10 transition-colors">
                <DollarSign className="h-4 w-4 text-[var(--app-text-primary)]/70 group-hover:text-[var(--app-accent-primary)]" />
              </div>
              <span className="font-sans text-[14px] text-[var(--app-text-primary)]/80 group-hover:text-[var(--app-text-primary)] font-medium">Log expense</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[var(--app-bg-primary)] border-[var(--app-text-primary)]/10 text-[var(--app-text-primary)]">
            <DialogTitle className="text-xl font-serif font-light mb-1">Log Expense</DialogTitle>
            <DialogDescription className="text-[var(--app-text-primary)]/50 mb-4">
              Add a new expense for your trip.
            </DialogDescription>
            <AddExpenseForm tripId={nextTrip?.id || ""} onExpenseAdded={() => setExpenseModalOpen(false)} />
          </DialogContent>
        </Dialog>

        <button
          onClick={() => navigate("/app/activities")}
          className="flex items-center gap-3 w-full p-3 rounded bg-[var(--app-text-primary)]/[0.02] border border-[var(--app-text-primary)]/[0.05] hover:border-[var(--app-accent-primary)]/30 hover:bg-[var(--app-accent-primary)]/[0.02] transition-colors text-left group"
        >
          <div className="h-8 w-8 rounded-sm bg-[var(--app-text-primary)]/[0.05] flex items-center justify-center group-hover:bg-[var(--app-accent-primary)]/10 transition-colors">
            <Search className="h-4 w-4 text-[var(--app-text-primary)]/70 group-hover:text-[var(--app-accent-primary)]" />
          </div>
          <span className="font-sans text-[14px] text-[var(--app-text-primary)]/80 group-hover:text-[var(--app-text-primary)] font-medium">Explore destinations</span>
        </button>
      </div>
    </div>
  );
}
