import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivitiesAndEvents() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">Activities & Events</h1>
        <p className="text-muted-foreground mb-6">Discover tours, activities, and local events.</p>
        <Card className="rounded-2xl border-border/80 shadow-soft">
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Activities and events will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
