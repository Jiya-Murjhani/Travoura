import { supabase } from "@/integrations/supabase/client";
import { 
  ItineraryRequest, 
  SavedItinerary, 
  RefinementRequest, 
  ItineraryResponse,
  ItinerarySummaryCard
} from "../types/itinerary";

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

const getHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const generateItinerary = async (request: ItineraryRequest): Promise<SavedItinerary> => {
  const response = await fetch(`${API_BASE}/itinerary/generate`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || 'Failed to generate itinerary');
  }

  const data = await response.json();
  if (!data.itinerary) throw new Error('Itinerary missing in response');
  return data.itinerary;
};

export const refineItinerary = async (request: RefinementRequest): Promise<ItineraryResponse> => {
  const response = await fetch(`${API_BASE}/itinerary/refine`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || 'Failed to refine itinerary');
  }

  const data = await response.json();
  if (!data.itinerary) throw new Error('Itinerary missing in response');
  // Backend returns updated itinerary row containing itinerary_data
  return data.itinerary.itinerary_data || data.itinerary;
};

export const getMyItineraries = async (): Promise<SavedItinerary[]> => {
  const response = await fetch(`${API_BASE}/itinerary/my-itineraries`, {
    method: 'GET',
    headers: await getHeaders(),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || 'Failed to fetch itineraries');
  }

  const data = await response.json();
  return data.itineraries || [];
};

export const getItineraryById = async (id: string): Promise<SavedItinerary> => {
  const response = await fetch(`${API_BASE}/itinerary/${id}`, {
    method: 'GET',
    headers: await getHeaders(),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || 'Failed to fetch itinerary');
  }

  const data = await response.json();
  return data.itinerary;
};

export const getItinerariesByTrip = async (
  tripId: string
): Promise<ItinerarySummaryCard[]> => {
  const response = await fetch(`${API_BASE}/itinerary/trip/${tripId}`, {
    headers: await getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch itineraries");
  const data = await response.json();
  return data.itineraries;
};

export const deleteItinerary = async (itineraryId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/itinerary/${itineraryId}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete itinerary");
};
