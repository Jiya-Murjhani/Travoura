import { Destination, DestinationWithScore, SeasonalMonth } from '@/types/explore';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const publicHeaders = () => ({
  'Content-Type': 'application/json',
});

// ─── Recommended (protected) ───────────────────────────────────────
export const fetchRecommended = async (token: string): Promise<DestinationWithScore[]> => {
  const response = await fetch(`${API_BASE}/explore/recommended`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch recommended destinations');
  }

  const data = await response.json();
  return data.destinations.map((d: any) => ({
    ...d,
    heroImageUrl: d.hero_image_url || d.heroImageUrl,
    avgCostPerDayUsd: d.avg_cost_per_day_usd || d.avgCostPerDayUsd,
    bestMonths: d.best_months || d.bestMonths,
    aiCaption: d.ai_caption || d.aiCaption,
    visaComplexity: d.visa_complexity || d.visaComplexity,
  }));
};

// ─── All destinations (public, optional tag filter) ────────────────
export const fetchDestinations = async (token: string | null, tag?: string): Promise<Destination[]> => {
  const url = new URL(`${API_BASE}/explore/destinations`);
  if (tag) url.searchParams.set('tag', tag);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: token ? authHeaders(token) : publicHeaders(),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch destinations');
  }

  const data = await response.json();
  return data.destinations.map((d: any) => ({
    ...d,
    heroImageUrl: d.hero_image_url || d.heroImageUrl,
    avgCostPerDayUsd: d.avg_cost_per_day_usd || d.avgCostPerDayUsd,
    bestMonths: d.best_months || d.bestMonths,
    aiCaption: d.ai_caption || d.aiCaption,
    visaComplexity: d.visa_complexity || d.visaComplexity,
  }));
};

// ─── Seasonal data (public) ────────────────────────────────────────
export const fetchSeasonalData = async (destinationId: string): Promise<SeasonalMonth[]> => {
  const response = await fetch(`${API_BASE}/explore/destinations/${destinationId}/seasonal`, {
    method: 'GET',
    headers: publicHeaders(),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch seasonal data');
  }

  const data = await response.json();
  return data.seasonalData.map((m: any) => ({
    ...m,
    qualityScore: m.quality_score || m.qualityScore,
    avgTempCelsius: m.avg_temp_celsius || m.avgTempCelsius,
    crowdLevel: m.crowd_level || m.crowdLevel,
  }));
};

// ─── Wishlist (protected) ──────────────────────────────────────────
export const fetchWishlist = async (token: string): Promise<string[]> => {
  const response = await fetch(`${API_BASE}/explore/wishlist`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch wishlist');
  }

  const data = await response.json();
  return data.wishlist;
};

export const saveToWishlist = async (token: string, destinationId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/explore/wishlist`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ destinationId }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to save to wishlist');
  }
};

export const removeFromWishlist = async (token: string, destinationId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/explore/wishlist/${destinationId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to remove from wishlist');
  }
};
