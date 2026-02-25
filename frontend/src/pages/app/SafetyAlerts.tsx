import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SafetyAlerts() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">Safety Alerts</h1>
        <p className="text-muted-foreground mb-6">Travel advisories and safety information.</p>
        <Card className="rounded-2xl border-border/80 shadow-soft">
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Safety alerts will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
