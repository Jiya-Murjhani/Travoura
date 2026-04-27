import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/hooks/usePreferences";

import { NextTripCard } from "./NextTripCard";
import { QuickActions } from "./QuickActions";
import { TripStrip } from "./TripStrip";
import { BudgetSnapshot } from "./BudgetSnapshot";
import { AlertsWidget } from "./AlertsWidget";
import { ItineraryStrip } from "./ItineraryStrip";
import WeatherWidget from "./WeatherWidget";
import type { Trip, Itinerary, UserPreferences } from "@/hooks/useDashboard";
import { Plane } from "lucide-react";
import GradientText from "@/components/ui/GradientText";

interface ReturningDashboardProps {
  trips: Trip[];
  itineraries: Itinerary[];
  preferences: UserPreferences;
}

export function ReturningDashboard({ trips, itineraries, preferences: initialPrefs }: ReturningDashboardProps) {
  const { data: preferences } = usePreferences();
  const city = preferences?.home_city;
  console.log('DEBUG weather:', { city, preferences });  

  const { displayName } = useAuth();
  const firstName = displayName?.split(" ")[0] || "Traveler";

  // Figure out the next trip
  // Assuming trips are sorted, or we can just pick the first upcoming one
  const today = new Date();
  const upcomingTrips = trips.filter(t => t.start_date && new Date(t.start_date) >= today);
  const nextTrip = upcomingTrips.length > 0 ? upcomingTrips[0] : (trips.length > 0 ? trips[0] : null);

  const hasItineraryForNextTrip = nextTrip 
    ? itineraries.some(i => i.trip_id === nextTrip.id || i.destination === nextTrip.destination)
    : false;

  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateString = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 py-8 px-4 md:px-10">
      
      {/* Top Bar - Prompt & Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="w-full">
        <section className="space-y-1">
          <h1 className="font-serif text-[36px] md:text-[40px] font-light flex justify-start leading-tight">
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
              animationSpeed={3}
              showBorder={false}
              className="pb-2 !m-0"
            >
              {greeting}, {firstName}.
            </GradientText>
          </h1>
          <p className="text-[var(--app-text-primary)]/50 font-sans text-[16px]">
            {dateString}
          </p>
        </section>
        
        <div>
          <WeatherWidget />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Next Trip Card - Spans 2 cols on Desktop */}
        <div className="lg:col-span-2">
          <NextTripCard trip={nextTrip} hasItinerary={hasItineraryForNextTrip} />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions nextTrip={nextTrip} />
        </div>

        {/* Trip Strip - Full width */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
          <TripStrip trips={trips} />
        </div>

        {/* Budget Snapshot */}
        <div className="lg:col-span-1 mt-4">
          <BudgetSnapshot nextTrip={nextTrip} />
        </div>

        {/* Alerts Widget */}
        <div className="lg:col-span-1 mt-4">
          <AlertsWidget trips={trips} />
        </div>

        {/* Promo / Placeholder Card */}
        <div className="lg:col-span-1 mt-4 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[var(--app-accent-primary)]/10 to-transparent border border-[var(--app-accent-primary)]/20 rounded-lg text-center">
          <div className="w-12 h-12 bg-[var(--app-accent-primary)]/10 rounded-full flex items-center justify-center mb-4">
            <Plane className="h-6 w-6 text-[var(--app-accent-primary)]" />
          </div>
          <h4 className="font-serif text-[18px] text-[var(--app-accent-primary)] mb-2">Travoura Pro</h4>
          <p className="text-[var(--app-text-primary)]/50 text-sm font-sans mb-4">
            Unlock advanced AI planning and priority support.
          </p>
          <button className="text-[var(--app-bg-primary)] bg-[var(--app-accent-primary)] px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#b09055] transition-colors">
            Coming Soon
          </button>
        </div>

        {/* Itinerary Strip - Full width */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
          <ItineraryStrip itineraries={itineraries} />
        </div>

      </div>
    </div>
  );
}
