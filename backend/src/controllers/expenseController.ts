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

const ALLOWED_CATEGORIES = ['food', 'transport', 'accommodation', 'activity', 'shopping', 'other'];

// GET EXPENSES FOR TRIP
export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    if (!tripId) {
      return res.status(400).json({ message: 'Trip ID is required', success: false });
    }

    const userSupabase = getUserSupabase(req);

    // 1. Verify trip ownership
    const { data: trip, error: tripError } = await userSupabase
      .from('trips')
      .select('id')
      .eq('user_id', userId)
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return res.status(404).json({ message: 'Trip not found or unauthorized', success: false });
    }

    // 2. Fetch expenses
    const { data: expenses, error } = await userSupabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Fetch expenses error:', error);
      return res.status(500).json({ message: 'Failed to fetch expenses', success: false });
    }

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error('Get expenses internal error:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

// CREATE EXPENSE
export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const { category, description, amount, currency, date } = req.body;

    // Validation
    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number', success: false });
    }
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`, success: false });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ message: 'Description is required', success: false });
    }
    if (!date) {
      return res.status(400).json({ message: 'Date is required', success: false });
    }

    const userSupabase = getUserSupabase(req);

    // Verify trip ownership
    const { data: trip, error: tripError } = await userSupabase
      .from('trips')
      .select('id')
      .eq('user_id', userId)
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return res.status(404).json({ message: 'Trip not found or unauthorized', success: false });
    }

    const { data: expense, error: insertError } = await userSupabase
      .from('expenses')
      .insert({
        trip_id: tripId,
        category,
        description: String(description).trim(),
        amount: parsedAmount,
        currency: currency || 'USD',
        date,
      })
      .select('*')
      .single();

    if (insertError || !expense) {
      console.error('Expense insert error:', insertError);
      const errMsg = `DB Error: ${(insertError as any)?.message || 'Unknown'}. Details: ${(insertError as any)?.details || 'None'}. Hint: ${(insertError as any)?.hint || 'None'}`;
      return res.status(500).json({ message: errMsg, success: false });
    }

    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error('Create expense internal error:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

// DELETE EXPENSE
export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { tripId, expenseId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const userSupabase = getUserSupabase(req);

    // Note: Due to RLS, if the expense doesn't belong to the user, delete will return no rows
    const { data: deletedExpense, error } = await userSupabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('trip_id', tripId)
      .select('id')
      .single();

    if (error || !deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized', success: false });
    }

    res.status(200).json({ message: 'Expense deleted successfully', success: true });
  } catch (error) {
    console.error('Delete expense internal error:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};
