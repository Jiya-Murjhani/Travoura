import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
}

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  return (
    <Link to={`/trip/${trip.id}`} className="block">
      <Card className="h-full border-border/60 bg-card/95 shadow-soft transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{trip.destination}</CardTitle>
          <CardDescription>
            {trip.startDate} – {trip.endDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Budget: ₹{trip.budget.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

