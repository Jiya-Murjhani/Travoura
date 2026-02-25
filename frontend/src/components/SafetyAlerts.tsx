import { AlertTriangle, Cloud, Plane, MapPin, Globe, X, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

const alerts = [
  {
    id: 1,
    type: "weather",
    title: "Weather Advisory",
    message: "Heavy rainfall expected in Paris",
    severity: "medium",
    location: "Paris, France",
    icon: Cloud,
    color: "hsl(var(--alert-weather))",
    details: "Moderate to heavy rainfall expected for the next 48 hours. Consider indoor activities."
  },
  {
    id: 2,
    type: "flight",
    title: "Flight Delay Alert",
    message: "Minor delays at CDG Airport",
    severity: "low",
    location: "Charles de Gaulle Airport",
    icon: Plane,
    color: "hsl(var(--alert-flight))",
    details: "Average delay of 30-45 minutes. Check with your airline for updates."
  },
  {
    id: 3,
    type: "area",
    title: "Local Area Update",
    message: "Street festival causing traffic",
    severity: "low",
    location: "Barcelona, Spain",
    icon: MapPin,
    color: "hsl(var(--alert-area))",
    details: "Annual street festival in Gothic Quarter. Public transport recommended."
  }
];

const SafetyAlerts = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const dismissAlert = (id: number) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-soft max-w-4xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Safety & Travel Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className="relative group animate-slide-up"
                >
                  <Alert className="border-l-4 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md pr-10" style={{ borderLeftColor: alert.color }}>
                    <Icon className="h-4 w-4" style={{ color: alert.color }} />
                    <AlertTitle className="flex items-center gap-2 mb-1">
                      {alert.title}
                      <Badge variant="outline" className="text-xs font-normal">
                        {alert.location}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      {alert.message}
                      <div className="mt-2">
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-xs"
                          onClick={() => {}}
                        >
                          More Info <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </AlertDescription>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Alert>
                </div>
              );
            })}
            
            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Last updated: 2 hours ago</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SafetyAlerts;
