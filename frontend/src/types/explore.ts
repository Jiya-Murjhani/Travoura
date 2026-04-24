export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  heroImageUrl: string;
  tags: string[];
  avgCostPerDayUsd: number;
  bestMonths: number[];
  rating: number;
  aiCaption: string;
  visaComplexity: 'easy' | 'moderate' | 'complex';
}

export interface DestinationWithScore extends Destination {
  matchScore: number | null;
}

export interface SeasonalMonth {
  month: number;
  qualityScore: number;
  label: string;
  avgTempCelsius: number;
  crowdLevel: 'low' | 'medium' | 'high';
}
