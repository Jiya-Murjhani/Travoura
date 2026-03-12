import { Compass, MapPin, ListChecks } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-light px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 pt-16">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Welcome back! Where would you like to travel next?
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Start a new adventure, pick up an existing trip, or get inspired by new destinations.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <ActionCard
            to="/create-trip"
            title="Plan a New Trip"
            description="Create a new trip with dates, budget, and destination."
            icon={<Compass className="h-5 w-5" />}
          />
          <ActionCard
            to="/trips"
            title="My Trips"
            description="View and manage all the trips you have created."
            icon={<ListChecks className="h-5 w-5" />}
          />
          <ActionCard
            to="/home#explore"
            title="Explore Destinations"
            description="Browse destination ideas and inspiration (coming soon)."
            icon={<MapPin className="h-5 w-5" />}
          />
        </section>

        <section id="explore" className="rounded-3xl border border-dashed border-border/60 bg-card/60 p-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">Explore Destinations (Coming Soon)</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Soon you&apos;ll be able to discover curated destinations, sample itineraries, and AI-powered trip ideas here.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Home;

