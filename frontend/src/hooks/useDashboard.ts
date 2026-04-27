import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  total_budget: number | null;
  status: string;
  created_at: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  destination?: string;
  trip_id?: string;
  itinerary_data: any;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  home_city: string | null;
  completed: boolean;
  [key: string]: any;
}

export const useDashboard = () => {
  const { session } = useAuth();
  const token = session?.access_token;
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["dashboard-data", userId],
    queryFn: async () => {
      if (!token || !userId) {
        throw new Error("No active session");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      // Fetch all three endpoints in parallel
      const [tripsRes, itinerariesRes, preferencesRes] = await Promise.all([
        fetch(`${apiUrl}/api/trips`, { headers }),
        fetch(`${apiUrl}/api/itinerary/my-itineraries`, { headers }),
        fetch(`${apiUrl}/api/preferences/${userId}`, { headers }),
      ]);

      if (!tripsRes.ok) throw new Error("Failed to fetch trips");
      if (!itinerariesRes.ok) throw new Error("Failed to fetch itineraries");
      if (!preferencesRes.ok) throw new Error("Failed to fetch preferences");

      let trips: Trip[] = await tripsRes.json();
      const itinData = await itinerariesRes.json();
      const preferences: UserPreferences = await preferencesRes.json();

      if (!Array.isArray(trips)) trips = [];
      let itineraries: Itinerary[] = itinData.itineraries || itinData.data || itinData || [];
      if (!Array.isArray(itineraries)) itineraries = [];

      return {
        trips,
        itineraries,
        preferences,
        isNewUser: !trips || trips.length === 0,
        isPreferencesComplete: preferences?.completed === true,
      };
    },
    enabled: !!token && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
