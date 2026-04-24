import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  durationDays: number;
  totalBudget: number;
  currency: string;
  travelStyle: string;
  groupType: string;
  interests: string[];
  status: string;
}

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "TBD";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "planning": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link to={`/trip/${trip.id}`} className="block">
      <Card className="h-full border-border/60 bg-card/95 shadow-soft transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{trip.destination}</CardTitle>
            {trip.status && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(trip.status)}`}>
                {trip.status}
              </span>
            )}
          </div>
          <CardDescription>
            {formatDate(trip.startDate)}
            {trip.durationDays ? ` · ${trip.durationDays} days` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Budget: {trip.currency || "₹"}{trip.totalBudget?.toLocaleString() ?? "N/A"}
          </p>
          {trip.travelStyle && (
            <p className="text-xs text-muted-foreground capitalize">
              Style: {trip.travelStyle} · {trip.groupType}
            </p>
          )}
          {trip.interests && trip.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {trip.interests.slice(0, 3).map((interest, i) => (
                <span key={i} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium capitalize">
                  {interest}
                </span>
              ))}
              {trip.interests.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{trip.interests.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
