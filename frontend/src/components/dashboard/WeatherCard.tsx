import { useWeather } from "@/hooks/useWeather";
import { Loader2 } from "lucide-react";

interface WeatherCardProps {
  homeCity: string | null;
  destination: string | null;
}

export function WeatherCard({ homeCity, destination }: WeatherCardProps) {
  // Use homeCity first, fallback to destination, then a default for testing if both missing
  const cityToUse = homeCity || destination;

  const { data: weather, isLoading, isError } = useWeather(cityToUse);

  if (!cityToUse) {
    // If absolutely no city is available, hide silently as requested
    return null;
  }

  if (isLoading) {
    return (
      <div className="dashboard-card w-full p-5 flex items-center justify-center min-h-[88px]">
        <Loader2 className="w-5 h-5 text-[var(--app-accent-primary)] animate-spin" />
      </div>
    );
  }

  if (isError || !weather) {
    // Hide silently on API failure
    return null;
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="dashboard-card w-full p-5 flex items-center justify-between">
      <div>
        <h3 className="font-sans font-medium text-[var(--app-text-primary)] text-sm mb-1">
          Weather in {weather.city}
        </h3>
        <p className="text-xs text-[var(--app-text-primary)]/60 capitalize">
          {weather.description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <img src={iconUrl} alt={weather.description} className="w-12 h-12" />
        <span className="text-3xl font-serif text-[var(--app-text-primary)] leading-none">
          {weather.temp}°C
        </span>
      </div>
    </div>
  );
}
