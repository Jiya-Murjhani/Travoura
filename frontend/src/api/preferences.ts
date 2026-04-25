import { supabase } from "@/integrations/supabase/client";

export interface UserPreferences {
  id?: string;
  user_id?: string;
  travel_style?: string;
  interests?: string[];
  dietary_prefs?: string;
  home_currency?: string;
  accommodation_tier?: string;
  group_type?: string;
  budget_tier?: string;
  budget_daily_max?: number;
  spend_priority?: string[];
  food_allergies?: string;
  cuisine_likes?: string[];
  mobility_modes?: string[];
  max_walking_distance?: string;
  accessibility_needs?: string;
  home_city?: string;
  passports?: string[];
  ai_verbosity?: string;
  itinerary_density?: string;
  auto_apply_prefs?: boolean;
  completed?: boolean;
  updated_at?: string;
}

const getHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const API_BASE = (import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000') + '/api';

export const getPreferences = async (userId: string): Promise<UserPreferences | null> => {
  const response = await fetch(`${API_BASE}/preferences/${userId}`, {
    method: 'GET',
    headers: await getHeaders(),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to fetch preferences');
  }

  const data = await response.json();
  return data.preferences;
};

export const updatePreferences = async (userId: string, payload: Partial<UserPreferences>): Promise<UserPreferences> => {
  const response = await fetch(`${API_BASE}/preferences/${userId}`, {
    method: 'PATCH',
    headers: await getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to update preferences');
  }

  const data = await response.json();
  return data.preferences;
};
