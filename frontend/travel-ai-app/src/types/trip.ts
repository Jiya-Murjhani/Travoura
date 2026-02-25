export interface TripDetails {
  destination: string;
  startDate: Date;
  endDate: Date;
  flexibleDates: boolean;
  travelers: {
    adults: number;
    children: number;
  };
  budget: number; // Representing budget in a specific currency
  accommodationPreference: string; // e.g., "Hotel", "Hostel", "Airbnb"
  transportPreference: string; // e.g., "Car", "Train", "Flight"
  tripVibes: string[]; // Array of selected trip vibes
  specialRequests: string; // Any special requests from the user
}

export interface UserPreferences {
  avoidCrowds: boolean;
  hiddenGems: boolean;
  budgetOptimization: boolean;
}