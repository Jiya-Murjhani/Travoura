import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export function EmptyItineraries() {
  return (
    <Card className="shadow-soft">
      <div className="grid gap-5 p-8 sm:p-10 sm:grid-cols-[140px_1fr] sm:items-center">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-gradient-mesh bg-[length:200%_200%] ring-1 ring-border">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-background/70 backdrop-blur">
            <Compass className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold">No trips yet. Let’s plan your first adventure ✨</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Answer a few quick questions—then we’ll be ready to generate a calm, beautifully paced plan.
          </p>

          <div className="mt-5 flex justify-center sm:justify-start">
            <Link to="/itineraries/new">
              <Button className="gap-2">Create Itinerary</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}


