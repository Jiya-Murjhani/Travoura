import { Link } from "react-router-dom";
import { Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBudget } from "@/contexts/BudgetContext";
import { Progress } from "@/components/ui/progress";

const BudgetQuickAccess = () => {
  const { budgetData } = useBudget();
  
  const remaining = budgetData.total - budgetData.spent;
  const percentSpent = (budgetData.spent / budgetData.total) * 100;
  const isOverBudget = remaining < 0;
  const isWarning = percentSpent > 80;

  return (
    <Card className="bg-gradient-ocean border-none text-primary-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-foreground/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-primary-foreground">Budget Tracker</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Track your travel expenses
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-foreground/70">Total Budget</span>
            <span className="font-semibold">₹{budgetData.total.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-foreground/70">Spent</span>
            <span className="font-semibold">₹{budgetData.spent.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-foreground/70">Remaining</span>
            <span className={`font-semibold ${isOverBudget ? 'text-accent' : ''}`}>
              {isOverBudget ? '-' : ''}₹{Math.abs(remaining).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-primary-foreground/70">Budget Usage</span>
            <span className="text-primary-foreground/70">{percentSpent.toFixed(0)}%</span>
          </div>
          <Progress 
            value={Math.min(percentSpent, 100)} 
            className="h-2 bg-primary-foreground/20"
          />
        </div>

        {isWarning && !isOverBudget && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/20 text-amber-100 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>You've used {percentSpent.toFixed(0)}% of your budget</span>
          </div>
        )}

        {isOverBudget && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/20 text-accent-foreground text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>You're over budget by ₹{Math.abs(remaining).toLocaleString()}</span>
          </div>
        )}

        <Link to="/budget">
          <Button 
            variant="secondary" 
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Full Budget
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BudgetQuickAccess;







