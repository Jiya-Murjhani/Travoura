import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Transport() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">Transport</h1>
        <p className="text-muted-foreground mb-6">Book trains, buses, and car rentals.</p>
        <Card className="rounded-2xl border-border/80 shadow-soft">
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Transport search and booking will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
