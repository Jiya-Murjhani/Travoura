import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const getUserSupabase = (req: AuthRequest) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
};

// GET PREFERENCES BY USER ID
export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const authUserId = req.user?.id;
    const { userId } = req.params;

    if (!authUserId || authUserId !== userId) {
      return res.status(403).json({ message: 'Forbidden', success: false });
    }

    const userSupabase = getUserSupabase(req);

    const { data: preferences, error } = await userSupabase
      .from('preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is not found
      return res.status(500).json({ error: 'Failed to fetch preferences', success: false });
    }

    res.status(200).json({
      success: true,
      preferences: preferences || null, // Return null if user has no preferences yet
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Failed to fetch preferences', success: false });
  }
};

// PATCH PREFERENCES BY USER ID
export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const authUserId = req.user?.id;
    const { userId } = req.params;

    if (!authUserId || authUserId !== userId) {
      return res.status(403).json({ message: 'Forbidden', success: false });
    }

    const { child_ages, ...updates } = req.body;
    const userSupabase = getUserSupabase(req);

    // Check if preferences already exist
    const { data: existingPref } = await userSupabase
      .from('preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    let preferences, error;

    if (existingPref) {
      // Update existing
      const result = await userSupabase
        .from('preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select('*')
        .single();
      preferences = result.data;
      error = result.error;
    } else {
      // Insert new
      const result = await userSupabase
        .from('preferences')
        .insert({ user_id: userId, ...updates, updated_at: new Date().toISOString() })
        .select('*')
        .single();
      preferences = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Update preferences error:', error);
      return res.status(500).json({ error: 'Failed to update preferences', success: false });
    }

    res.status(200).json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Failed to update preferences', success: false });
  }
};
