export type ItineraryStatus = "Draft" | "Final";
export type ItineraryPace = "Chill" | "Balanced" | "Packed";
export type ItineraryBudget = "Budget" | "Comfort" | "Luxury";
export type ItineraryFilter = "All" | "Upcoming" | "Past" | "Drafts";

export type ItineraryInterest =
  | "Nature"
  | "Food"
  | "Culture"
  | "Shopping"
  | "Adventure";

export type FoodPreference = "Street Food" | "Cafés" | "Fine Dining";

export interface Itinerary {
  id: string;
  destination: string;
  startDateISO: string; // ISO date (yyyy-mm-dd)
  endDateISO: string; // ISO date (yyyy-mm-dd)
  pace: ItineraryPace;
  budget: ItineraryBudget;
  status: ItineraryStatus;
  interests: ItineraryInterest[];
  createdAtISO: string; // ISO datetime
}

export interface CreateItineraryDraft {
  // Step 1
  destination: string;
  startDateISO: string;
  endDateISO: string;
  travelers: number | "";
  budget: ItineraryBudget | "";

  // Step 2
  pace: ItineraryPace | "";
  interests: ItineraryInterest[];
  food: FoodPreference | "";

  // Step 3
  travelerVibe: string;
  mustDos: string;
  avoid: string;
}


