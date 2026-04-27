import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeather } from "@/hooks/useWeather";
import type { Trip } from "@/hooks/useDashboard";
import { isAfter, isBefore } from "date-fns";

interface AlertsWidgetProps {
  trips: Trip[];
}

function WeatherItem({ city }: { city: string }) {
  const { data: weather, isLoading } = useWeather(city);

  if (isLoading) {
    return <Skeleton className="h-6 w-3/4 bg-[var(--app-text-primary)]/5 mb-2" />;
  }

  if (!weather) {
    return <div className="text-[var(--app-text-primary)]/50 text-sm mb-2">Weather data unavailable for {city}.</div>;
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <img 
        src={`https://openweathermap.org/img/wn/${weather.icon}.png`} 
        alt={weather.description}
        className="w-6 h-6 -ml-1"
      />
      <span className="text-[var(--app-text-primary)] text-sm">
        <span className="font-semibold">{city}:</span> {weather.temp}°C, <span className="capitalize">{weather.description}</span>
      </span>
    </div>
  );
}

export function AlertsWidget({ trips }: AlertsWidgetProps) {
  const navigate = useNavigate();
  const today = new Date();

  // Filter for active or upcoming trips
  const relevantTrips = trips.filter(t => {
    if (!t.start_date) return false;
    const startDate = new Date(t.start_date);
    const endDate = t.end_date ? new Date(t.end_date) : startDate;
    // Trip hasn't ended yet
    return isAfter(endDate, today) || isAfter(startDate, today) || 
           (isBefore(startDate, today) && isAfter(endDate, today));
  }).slice(0, 3); // Max 3 to not overflow the widget

  const uniqueDestinations = Array.from(new Set(relevantTrips.map(t => t.destination).filter(Boolean)));

  return (
    <div className="h-full flex flex-col p-6 bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg">
      <span className="text-[var(--app-accent-primary)] text-[11px] font-bold uppercase tracking-[0.15em] mb-4">
        Trip alerts
      </span>

      <div className="flex-1 flex flex-col gap-1 mb-6">
        {uniqueDestinations.length > 0 ? (
          uniqueDestinations.map(dest => (
            <WeatherItem key={dest} city={dest} />
          ))
        ) : (
          <p className="text-[var(--app-text-primary)]/50 text-sm mb-2">No upcoming trips to fetch weather for.</p>
        )}

        <div className="mt-2 pt-3 border-t border-[var(--app-text-primary)]/10">
          <p className="text-[var(--app-text-primary)]/80 text-sm flex items-center gap-2">
            <span>🛡️</span> No safety advisories for your destinations.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/app/updates")}
        className="mt-auto text-[var(--app-accent-primary)] text-[13px] font-semibold hover:text-[#b09055] transition-colors self-start"
      >
        View all updates →
      </button>
    </div>
  );
}
