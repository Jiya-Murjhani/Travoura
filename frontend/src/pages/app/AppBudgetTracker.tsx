import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBudget } from "@/contexts/BudgetContext";

export default function AppBudgetTracker() {
  const { activeTripId } = useBudget();

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">Budget Tracker</h1>
        <p className="text-muted-foreground mb-6">Track expenses and stay on budget for your current ongoing trip.</p>
        <Card className="rounded-2xl border-border/80 shadow-soft">
          <CardHeader>
            <CardTitle>{activeTripId ? "Ongoing Trip Budget" : "Budget Overview"}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeTripId ? (
              <Button asChild className="rounded-xl">
                <Link to="/budget">Open Budget Tracker</Link>
              </Button>
            ) : (
               <div className="space-y-4">
                 <p className="text-sm text-muted-foreground">You don't have any ongoing trips to track. Create a trip to activate your budget planner.</p>
                 <Button asChild className="rounded-xl mt-2" variant="outline">
                   <Link to="/create-trip">Create a Trip</Link>
                 </Button>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
