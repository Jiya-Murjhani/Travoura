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

// CREATE TRIP
export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const {
      title,
      destination,
      country,
      start_date,
      duration_days,
      total_budget,
      currency,
      budget_tier,
      travel_style,
      group_type,
      num_travelers,
      trip_type,
      interests,
      pace,
      accommodation_type,
      transport_pref,
      dietary_needs,
      accessibility_notes,
      notes,
    } = req.body;

    // --- Validation ---
    if (!destination || !String(destination).trim()) {
      return res.status(400).json({ message: 'Destination is required', success: false });
    }
    if (!start_date) {
      return res.status(400).json({ message: 'Start date is required', success: false });
    }

    const parsedDuration = Number(duration_days);
    if (!duration_days || Number.isNaN(parsedDuration) || parsedDuration <= 0 || !Number.isInteger(parsedDuration)) {
      return res.status(400).json({ message: 'Duration must be a positive integer', success: false });
    }

    const parsedBudget = Number(total_budget);
    if (total_budget == null || total_budget === '' || Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      return res.status(400).json({ message: 'Total budget must be a valid positive number', success: false });
    }

    if (!currency) {
      return res.status(400).json({ message: 'Currency is required', success: false });
    }

    // --- Auto-generate title if not provided ---
    let tripTitle = title ? String(title).trim() : '';
    if (!tripTitle) {
      const dateObj = new Date(start_date);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formatted = `${monthNames[dateObj.getUTCMonth()]} ${dateObj.getUTCFullYear()}`;
      tripTitle = `${String(destination).trim()} \u00b7 ${formatted}`;
    }

    const userSupabase = getUserSupabase(req);

    const { data: trip, error: insertError } = await userSupabase
      .from('trips')
      .insert({
        user_id: userId,
        title: tripTitle,
        destination: String(destination).trim(),
        country: country || null,
        start_date,
        duration_days: parsedDuration,
        total_budget: parsedBudget,
        currency,
        budget_tier: budget_tier || null,
        travel_style: travel_style || null,
        group_type: group_type || null,
        num_travelers: num_travelers || 1,
        trip_type: trip_type || null,
        interests: interests || null,
        pace: pace || 3,
        accommodation_type: accommodation_type || null,
        transport_pref: transport_pref || null,
        dietary_needs: dietary_needs || null,
        accessibility_notes: accessibility_notes || null,
        notes: notes || null,
        status: 'planning',
      })
      .select('*')
      .single();

    if (insertError || !trip) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({
        message: 'Failed to create trip. Please try again.',
        success: false,
      });
    }

    res.status(201).json({
      success: true,
      trip: {
        id: trip.id,
        user_id: trip.user_id,
        title: trip.title,
        destination: trip.destination,
        country: trip.country,
        start_date: trip.start_date,
        duration_days: trip.duration_days,
        total_budget: Number(trip.total_budget),
        currency: trip.currency,
        budget_tier: trip.budget_tier,
        travel_style: trip.travel_style,
        group_type: trip.group_type,
        num_travelers: trip.num_travelers,
        trip_type: trip.trip_type,
        interests: trip.interests,
        pace: trip.pace,
        accommodation_type: trip.accommodation_type,
        transport_pref: trip.transport_pref,
        dietary_needs: trip.dietary_needs,
        accessibility_notes: trip.accessibility_notes,
        notes: trip.notes,
        status: trip.status,
        created_at: trip.created_at,
      },
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      message: 'Failed to create trip. Please try again.',
      success: false,
    });
  }
};


// FETCH ALL TRIPS FOR LOGGED-IN USER
export const getUserTrips = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
        success: false,
      });
    }

    const userSupabase = getUserSupabase(req);

    const { data, error } = await userSupabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch trips error:', error);
      return res.status(500).json({ message: 'Failed to fetch trips', success: false });
    }

    return res.json(data || []);
  } catch (error) {
    console.error('Fetch trips error:', error);
    return res.status(500).json({
      message: 'Failed to fetch trips',
      success: false,
    });
  }
};

// GET TRIP BY ID
export const getTripById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const userSupabase = getUserSupabase(req);

    // Match id directly without legacy schema fallbacks that crash
    const { data: trip, error } = await userSupabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .single();

    if (error || !trip) {
      return res.status(404).json({ error: 'Trip not found', success: false });
    }

    res.status(200).json({
      success: true,
      trip: {
        id: trip.trip_id || trip.id,
        trip_id: trip.trip_id || trip.id,
        user_id: trip.user_id,
        destination: trip.destination,
        startDate: trip.start_date,
        endDate: trip.end_date,
        budget: Number(trip.budget),
        createdAt: trip.created_at,
        durationDays: trip.duration_days,
        totalBudget: Number(trip.total_budget),
        currency: trip.currency,
        travelStyle: trip.travel_style,
        groupType: trip.group_type,
        interests: trip.interests,
        status: trip.status,
      },
    });
  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch trip', success: false });
  }
};

// UPDATE TRIP
export const updateTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const {
      destination,
      start_date,
      duration_days,
      total_budget,
      currency,
      travel_style,
      group_type,
      interests,
      status,
    } = req.body;

    const userSupabase = getUserSupabase(req);

    const { data: trip, error } = await userSupabase
      .from('trips')
      .update({
        destination,
        start_date,
        duration_days,
        total_budget,
        currency,
        travel_style,
        group_type,
        interests,
        status,
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized', success: false });
    }

    res.status(200).json({
      success: true,
      trip: {
        id: trip.trip_id || trip.id,
        trip_id: trip.trip_id || trip.id,
        user_id: trip.user_id,
        destination: trip.destination,
        startDate: trip.start_date,
        endDate: trip.end_date,
        budget: Number(trip.budget),
        createdAt: trip.created_at,
        durationDays: trip.duration_days,
        totalBudget: Number(trip.total_budget),
        currency: trip.currency,
        travelStyle: trip.travel_style,
        groupType: trip.group_type,
        interests: trip.interests,
        status: trip.status,
      },
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Failed to update trip', success: false });
  }
};

// DELETE TRIP
export const deleteTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const userSupabase = getUserSupabase(req);

    const { data: trip, error } = await userSupabase
      .from('trips')
      .delete()
      .eq('user_id', userId)
      .eq('id', id)
      .select('id')
      .single();

    if (error || !trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized', success: false });
    }

    res.status(200).json({ message: 'Trip deleted successfully', success: true });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Failed to delete trip', success: false });
  }
};
