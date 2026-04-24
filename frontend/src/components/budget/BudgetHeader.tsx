import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface BudgetHeaderProps {
  totalBudget: number;
  totalSpent: number;
  tripName?: string;
  currency?: string;
}

const BudgetHeader = ({ totalBudget, totalSpent, tripName = "My Trip", currency = "₹" }: BudgetHeaderProps) => {
  const remaining = totalBudget - totalSpent;
  const percentSpent = (totalSpent / totalBudget) * 100;
  const isOverBudget = remaining < 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-ocean p-6 md:p-8 text-primary-foreground">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-secondary/20 backdrop-blur-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Trip Budget Tracker</h1>
            <p className="text-primary-foreground/70 text-sm">{tripName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Total Budget */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 md:p-5">
            <p className="text-primary-foreground/70 text-sm mb-1">Total Budget</p>
            <p className="text-2xl md:text-3xl font-display font-bold">
              {currency}{totalBudget.toLocaleString()}
            </p>
          </div>

          {/* Amount Spent */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-primary-foreground/70 text-sm">Spent</p>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-2xl md:text-3xl font-display font-bold">
              {currency}{totalSpent.toLocaleString()}
            </p>
            <div className="mt-3 h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-primary-foreground/60 mt-2">{percentSpent.toFixed(0)}% of budget used</p>
          </div>

          {/* Remaining */}
          <div className={`backdrop-blur-sm rounded-2xl p-4 md:p-5 ${
            isOverBudget ? 'bg-accent/20' : 'bg-primary-foreground/10'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-primary-foreground/70 text-sm">Remaining</p>
              {isOverBudget && <TrendingDown className="w-4 h-4 text-accent" />}
            </div>
            <p className={`text-2xl md:text-3xl font-display font-bold ${
              isOverBudget ? 'text-accent' : ''
            }`}>
              {isOverBudget ? '-' : ''}{currency}{Math.abs(remaining).toLocaleString()}
            </p>
            {isOverBudget && (
              <p className="text-xs text-accent mt-2">Over budget!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetHeader;

