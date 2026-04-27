import { useQuery } from "@tanstack/react-query";
import { Trip } from "@/hooks/useDashboard";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Wallet, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BudgetSnapshotCardProps {
  trip: Trip;
}

export function BudgetSnapshotCard({ trip }: BudgetSnapshotCardProps) {
  const navigate = useNavigate();
  const totalBudget = trip.total_budget || 0;
  const currencySymbol = (trip as any).currency === 'USD' ? '$' : '₹';

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses", trip.id],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("No active session");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/trips/${trip.id}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 404) return []; // No expenses found isn't fatal
        throw new Error("Failed to fetch expenses");
      }
      const data = await res.json();
      return Array.isArray(data) ? data : (data.expenses || []);
    },
    enabled: !!trip.id
  });

  const calculateTotals = () => {
    if (!expenses) return { total: 0, food: 0, transport: 0, accommodation: 0, activity: 0 };
    return expenses.reduce((acc: any, exp: any) => {
      const amt = Number(exp.amount) || 0;
      acc.total += amt;
      const cat = (exp.category || '').toLowerCase();
      if (cat.includes('food')) acc.food += amt;
      else if (cat.includes('transport') || cat.includes('flight')) acc.transport += amt;
      else if (cat.includes('accommodation') || cat.includes('hotel')) acc.accommodation += amt;
      else acc.activity += amt;
      return acc;
    }, { total: 0, food: 0, transport: 0, accommodation: 0, activity: 0 });
  };

  const totals = calculateTotals();
  const spentPct = totalBudget > 0 ? Math.min((totals.total / totalBudget) * 100, 100) : 0;
  
  let barColor = "var(--app-accent-primary)";
  if (spentPct > 85) barColor = "var(--app-danger)";
  else if (spentPct >= 60) barColor = "var(--app-warning)";

  return (
    <div className="dashboard-card flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl text-[var(--app-text-primary)] font-light flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[var(--app-accent-primary)]" />
          Budget Overview
        </h3>
        <button
          onClick={() => navigate(`/trip/${trip.id}/budget`)}
          className="p-2 hover:bg-[var(--app-text-primary)]/5 rounded-full text-[var(--app-accent-primary)] transition-colors"
          title="Add Expense"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-[var(--app-accent-primary)] animate-spin" />
        </div>
      ) : totals.total === 0 && totalBudget === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-[var(--app-text-primary)]/50 text-sm mb-4">No budget set and no expenses tracked yet.</p>
          <button
            onClick={() => navigate(`/trip/${trip.id}/budget`)}
            className="px-4 py-2 bg-[var(--app-text-primary)]/5 hover:bg-[var(--app-text-primary)]/10 border border-[var(--app-text-primary)]/10 rounded-md text-sm text-[var(--app-accent-primary)] transition-colors"
          >
            + Add Expense
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-serif text-[var(--app-text-primary)]">{currencySymbol}{totals.total.toLocaleString()}</span>
              <span className="text-sm text-[var(--app-text-primary)]/50 mb-1">spent of {currencySymbol}{totalBudget.toLocaleString()}</span>
            </div>
            
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(139,120,221,0.1)" }}>
              <div 
                className="h-full transition-all duration-500 rounded-full" 
                style={{ width: `${spentPct}%`, background: barColor }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--app-text-primary)]/5">
            <MiniBar label="Accommodation" amount={totals.accommodation} total={totals.total} symbol={currencySymbol} color="var(--app-accent-blue)" />
            <MiniBar label="Transport" amount={totals.transport} total={totals.total} symbol={currencySymbol} color="var(--app-accent-purple)" />
            <MiniBar label="Food" amount={totals.food} total={totals.total} symbol={currencySymbol} color="var(--app-accent-orange)" />
            <MiniBar label="Activities" amount={totals.activity} total={totals.total} symbol={currencySymbol} color="var(--app-accent-teal)" />
          </div>
        </div>
      )}
    </div>
  );
}

function MiniBar({ label, amount, total, symbol, color }: { label: string, amount: number, total: number, symbol: string, color: string }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--app-text-primary)]/60">{label}</span>
        <span className="text-[var(--app-text-primary)]">{symbol}{amount.toLocaleString()}</span>
      </div>
      <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(139,120,221,0.1)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
