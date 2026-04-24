import { z } from 'zod';

export const itineraryRequestSchema = z.object({
  destination: z.string().trim().min(2, 'destination is required'),
  days: z.number().int().min(1).max(30),
  budget: z.enum(['low', 'mid', 'high']),
  interests: z.array(z.string().trim().min(1)).min(1),
  pace: z.enum(['relaxed', 'balanced', 'fast']),
});

export type ItineraryRequest = z.infer<typeof itineraryRequestSchema>;

export function buildItineraryPrompt(input: ItineraryRequest): string {
  const { destination, days, budget, interests, pace } = input;

  return [
    `You are Travoura's itinerary engine.`,
    `Create a highly personalized ${days}-day travel itinerary for ${destination}.`,
    ``,
    `Traveler preferences:`,
    `- Budget level: ${budget}`,
    `- Pace: ${pace}`,
    `- Interests: ${interests.join(', ')}`,
    ``,
    `Hard requirements:`,
    `1) Output MUST be STRICT JSON only. No markdown. No code fences. No commentary.`,
    `2) The JSON MUST match this exact schema and include all fields:`,
    `{"trip_summary":"string","total_budget_estimate":"string","days":[{"day":1,"activities":[{"time":"string","title":"string","description":"string","location":"string","travel_time_from_previous":"string","cost_estimate":"string"}]}]}`,
    `3) days array length MUST equal ${days}. Day numbers MUST be 1..${days}.`,
    `4) Provide 4-6 activities per day. Times should be realistic and ordered (e.g. "09:00", "11:30", "14:00", "18:00").`,
    `5) Activities MUST be specific to ${destination} and aligned with interests. Avoid generic fillers like "Explore the city".`,
    `6) Optimize for travel efficiency: group nearby activities per day, mention short travel times.`,
    `7) Costs should be plausible for the chosen budget tier (${budget}), formatted as strings (e.g., "₹800", "₹0", "₹2,500").`,
    `8) total_budget_estimate must be a single string summarizing the total trip estimate consistent with daily costs.`,
    ``,
    `Now return the JSON.`,
  ].join('\n');
}

