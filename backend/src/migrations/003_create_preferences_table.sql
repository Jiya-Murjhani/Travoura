-- Create the preferences table if it does not exist
CREATE TABLE IF NOT EXISTS public.preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    travel_style TEXT,
    interests TEXT[],
    dietary_prefs TEXT,
    home_currency TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Newly added columns
    accommodation_tier TEXT,
    group_type TEXT,
    budget_tier TEXT,
    budget_daily_max NUMERIC(10,2),
    spend_priority TEXT[],
    food_allergies TEXT,
    cuisine_likes TEXT[],
    mobility_modes TEXT[],
    max_walking_distance TEXT,
    accessibility_needs TEXT,
    home_city TEXT,
    passports TEXT[],
    ai_verbosity TEXT DEFAULT 'concise',
    itinerary_density TEXT DEFAULT 'balanced',
    auto_apply_prefs BOOLEAN DEFAULT true,
    completed BOOLEAN DEFAULT false,

    -- Ensure one row per user
    CONSTRAINT preferences_user_id_key UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own preferences" 
ON public.preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.preferences FOR UPDATE 
USING (auth.uid() = user_id);

-- Add updated_at auto-updater trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists (to avoid duplicate creation error) then create it
DROP TRIGGER IF EXISTS update_preferences_updated_at ON public.preferences;
CREATE TRIGGER update_preferences_updated_at
BEFORE UPDATE ON public.preferences
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
