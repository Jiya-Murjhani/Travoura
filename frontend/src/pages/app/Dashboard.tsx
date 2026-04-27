import { useDashboard, Trip } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

// Components
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { HeroTripCard } from "@/components/dashboard/HeroTripCard";
import { BudgetSnapshotCard } from "@/components/dashboard/BudgetSnapshotCard";
import { RecentItineraries } from "@/components/dashboard/RecentItineraries";
import { TripsPanel } from "@/components/dashboard/TripsPanel";
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { QuickStatsCard } from "@/components/dashboard/QuickStatsCard";
import { QuickActionsBar } from "@/components/dashboard/QuickActionsBar";
import { AIPromptBar } from "@/components/dashboard/AIPromptBar";
import GradientText from "@/components/ui/GradientText";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();
  const { displayName, session } = useAuth();
  const firstName = displayName?.split(" ")[0] || "Traveler";
  const token = session?.access_token;

  const isFullyLoading = isLoading || !token;

  if (isFullyLoading) {
    return (
      <div className="min-h-screen bg-[var(--app-bg-primary)] p-4 md:p-10 flex flex-col gap-6 max-w-6xl mx-auto">
        <Skeleton className="w-2/3 h-12 bg-[var(--app-text-primary)]/10 rounded-lg" />
        <Skeleton className="w-full h-[400px] bg-[var(--app-text-primary)]/10 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="w-full h-48 bg-[var(--app-text-primary)]/10 rounded-xl" />
          <Skeleton className="w-full h-48 bg-[var(--app-text-primary)]/10 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--app-bg-primary)] flex items-center justify-center text-[var(--app-text-primary)]">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  if (data.trips.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--app-bg-primary)]">
        <EmptyDashboard />
        <QuickActionsBar />
      </div>
    );
  }

  // --- Classification Logic ---
  const today = new Date();
  const trips = data.trips;
  
  const ongoingTrips = trips.filter(t => t.start_date && t.end_date && new Date(t.start_date) <= today && today <= new Date(t.end_date));
  const upcomingTrips = trips.filter(t => t.start_date && new Date(t.start_date) > today).sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime());
  const pastTrips = trips.filter(t => t.end_date && new Date(t.end_date) < today).sort((a, b) => new Date(b.end_date!).getTime() - new Date(a.end_date!).getTime());

  let activeTrip: Trip | null = null;
  if (ongoingTrips.length > 0) activeTrip = ongoingTrips[0];
  else if (upcomingTrips.length > 0) activeTrip = upcomingTrips[0];
  else if (pastTrips.length > 0) activeTrip = pastTrips[0];

  // Greeting Subtitle & Chips Logic
  let subtitle = "Welcome back. Ready for your next adventure?";
  let contextualChips: { text: string; prompt: string }[] = [{ text: "Surprise me 🎲", prompt: "Plan a surprise 5-day adventure to a hidden gem destination" }];
  
  if (activeTrip) {
    const isOngoing = ongoingTrips.some(t => t.id === activeTrip!.id);
    const isUpcoming = upcomingTrips.some(t => t.id === activeTrip!.id);
    
    if (isOngoing) {
      subtitle = `You're currently in ${activeTrip.destination}.`;
      contextualChips.unshift({ text: `Explore ${activeTrip.destination} 🗺`, prompt: `Hidden gems in ${activeTrip.destination}` });
    } else if (isUpcoming) {
      const days = Math.ceil((new Date(activeTrip.start_date!).getTime() - today.getTime()) / (1000 * 3600 * 24));
      subtitle = `Your ${activeTrip.destination} trip is in ${days} days.`;
      contextualChips.unshift({ text: `Add a day in ${activeTrip.destination} →`, prompt: `1 day itinerary for ${activeTrip.destination}` });
    }
  }

  if (pastTrips.length > 0) {
    const mostRecentPast = pastTrips[0];
    if (!contextualChips.some(c => c.text.includes(mostRecentPast.destination))) {
       contextualChips.splice(1, 0, { text: `Trip like ${mostRecentPast.destination} ✈️`, prompt: `Plan a trip similar to ${mostRecentPast.destination}` });
    }
  }

  // Find if active trip has itinerary
  let activeItineraryId: string | null = null;
  if (activeTrip) {
    const matchingItinerary = data.itineraries.find(i => i.trip_id === activeTrip!.id || i.destination === activeTrip!.destination);
    if (matchingItinerary) activeItineraryId = matchingItinerary.id;
  }

  const hour = new Date().getHours();
  let timeGreeting = "evening";
  if (hour < 12) timeGreeting = "morning";
  else if (hour < 17) timeGreeting = "afternoon";

  return (
    <div className="min-h-screen bg-[var(--app-bg-primary)] pb-24">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 py-10 px-4 md:px-10">
        
        {/* Section 1: Greeting */}
        <section className="space-y-2">
          <h1 className="font-serif text-[40px] md:text-[48px] font-light flex justify-start leading-tight">
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
              animationSpeed={3}
              showBorder={false}
              className="pb-2 !m-0"
            >
              Good {timeGreeting}, {firstName}.
            </GradientText>
          </h1>
          <p className="text-[var(--app-text-primary)]/50 font-sans text-lg">{subtitle}</p>
        </section>

        {/* Section 2: AI Prompt */}
        <section className="w-full">
          <AIPromptBar variant="onboarding" chips={contextualChips.slice(0, 3)} />
        </section>

        {/* Section 3: Hero Active Trip */}
        {activeTrip && (
          <section className="w-full">
            <HeroTripCard trip={activeTrip} itineraryId={activeItineraryId} />
          </section>
        )}

        {/* Section 4 & 5: Budget and Itineraries (Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTrip && <BudgetSnapshotCard trip={activeTrip} />}
          <div className="flex flex-col">
            <RecentItineraries itineraries={data.itineraries} />
          </div>
        </section>

        {/* Section 6: Lower Two-Column Section */}
        <section className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[60%] flex flex-col">
            <TripsPanel trips={data.trips} />
          </div>
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <WeatherCard 
              destination={activeTrip?.destination || null}
              homeCity={data.preferences?.home_city || null} 
            />
            <QuickStatsCard trips={data.trips} itineraries={data.itineraries} />
          </div>
        </section>
      </div>

      {/* Section 7: Quick Actions */}
      <QuickActionsBar activeTripId={activeTrip?.id} />
    </div>
  );
}