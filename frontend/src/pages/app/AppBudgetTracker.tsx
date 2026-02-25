import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AppBudgetTracker() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">Budget Tracker</h1>
        <p className="text-muted-foreground mb-6">Track expenses and stay on budget.</p>
        <Card className="rounded-2xl border-border/80 shadow-soft">
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="rounded-xl">
              <Link to="/budget">Open Budget Tracker</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
