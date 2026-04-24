export interface ItineraryRequest {
  destination: string;
  origin?: string;
  start_date: string;
  end_date: string;
  num_travelers: number;
  traveler_type?: "solo" | "couple" | "family" | "group";
  budget_level?: "budget" | "moderate" | "luxury";
  interests?: string[];
  pace?: "relaxed" | "moderate" | "packed";
  accommodation_type?: "hotel" | "hostel" | "airbnb" | "resort";
  avoid?: string[];
  trip_id?: string;
}

export interface ItinerarySummaryCard {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
  itinerary_data: {
    total_days: number;
    estimated_total_budget: string;
    summary: string;
  };
  request_data: {
    traveler_type: string;
    num_travelers: number;
    budget_level: string;
  };
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  duration_minutes: number;
  category: "sightseeing" | "food" | "adventure" | "leisure" | "culture";
  estimated_cost_usd?: number;
  tips?: string;
}

export interface Meal {
  type: "breakfast" | "lunch" | "dinner";
  name: string;
  cuisine: string;
  price_range: string;
}

export interface DayPlan {
  day_number: number;
  theme: string;
  activities: Activity[];
  meals: Meal[];
}

export interface ItineraryResponse {
  destination: string;
  summary: string;
  weather_note: string;
  total_days: number;
  days: DayPlan[];
  packing_tips: string[];
  best_time_to_visit: string;
  estimated_total_budget: string;
}

export interface SavedItinerary extends ItineraryResponse {
  id: string;
  user_id: string;
  trip_id?: string;
  start_date: string;
  end_date: string;
  status?: string;
  version?: number;
  created_at: string;
  updated_at: string;
  request_data: ItineraryRequest;
}

export interface ChatMessage {
  role: "user" | "assistant";
  message: string;
  created_at?: string;
}

export interface RefinementRequest {
  itinerary_id: string;
  user_message: string;
  conversation_history: ChatMessage[];
}
