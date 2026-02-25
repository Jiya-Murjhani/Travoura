import { LucideIcon } from "lucide-react";

interface BudgetCardProps {
  title: string;
  icon: LucideIcon;
  allocated: number;
  spent: number;
  currency?: string;
  iconBgClass?: string;
  delay?: number;
}

const BudgetCard = ({ 
  title, 
  icon: Icon, 
  allocated, 
  spent, 
  currency = "₹",
  iconBgClass = "bg-secondary/10",
  delay = 0
}: BudgetCardProps) => {
  const percentage = (spent / allocated) * 100;
  const isOverBudget = percentage > 100;
  const remaining = allocated - spent;

  return (
    <div 
      className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgClass}`}>
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          isOverBudget 
            ? 'bg-accent/10 text-accent' 
            : percentage > 75 
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
        }`}>
          {isOverBudget ? 'Over Budget' : percentage > 75 ? 'Almost Full' : 'On Track'}
        </span>
      </div>

      <h3 className="font-display font-semibold text-foreground mb-1">{title}</h3>
      
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-display font-bold text-foreground">
          {currency}{spent.toLocaleString()}
        </span>
        <span className="text-muted-foreground text-sm">
          / {currency}{allocated.toLocaleString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isOverBudget 
              ? 'bg-gradient-coral' 
              : percentage > 75 
                ? 'bg-amber-400'
                : 'bg-gradient-sky'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{percentage.toFixed(0)}% used</span>
        <span className={`font-medium ${isOverBudget ? 'text-accent' : 'text-foreground'}`}>
          {isOverBudget ? '-' : ''}{currency}{Math.abs(remaining).toLocaleString()} {isOverBudget ? 'over' : 'left'}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;

