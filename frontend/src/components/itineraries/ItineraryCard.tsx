import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Itinerary } from "@/features/itineraries/types";
import { durationDays, formatRange } from "@/features/itineraries/dateUtils";

function toneForBudget(budget: Itinerary["budget"]) {
  switch (budget) {
    case "Budget":
      return "bg-muted text-foreground";
    case "Comfort":
      return "bg-secondary text-secondary-foreground";
    case "Luxury":
      return "bg-gradient-sunset text-white";
  }
}

function toneForStatus(status: Itinerary["status"]) {
  return status === "Draft" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground";
}

export function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  const { toast } = useToast();
  const range = formatRange(itinerary.startDateISO, itinerary.endDateISO);
  const days = durationDays(itinerary.startDateISO, itinerary.endDateISO);

  const onAction = (action: string) => {
    toast({
      title: "Coming soon",
      description: `“${action}” will be connected once AI + backend are wired.`,
    });
  };

  return (
    <Card className="card-hover shadow-soft overflow-hidden">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{itinerary.destination}</CardTitle>
            <p className="text-sm text-muted-foreground">{range}</p>
          </div>

          <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", toneForStatus(itinerary.status))}>
            {itinerary.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{days} Days</Badge>
          <Badge variant="outline">{itinerary.pace}</Badge>
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", toneForBudget(itinerary.budget))}>
            {itinerary.budget}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {itinerary.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="font-normal">
              {interest}
            </Badge>
          ))}
          {itinerary.interests.length > 3 ? (
            <Badge variant="secondary" className="font-normal">
              +{itinerary.interests.length - 3}
            </Badge>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        <Link to={`/itineraries/${itinerary.id}`} className="inline-flex">
          <Button variant="ghost" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onAction("Edit")} aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onAction("Regenerate")} aria-label="Regenerate">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onAction("Delete")}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}


