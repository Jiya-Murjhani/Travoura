import { supabase } from "@/integrations/supabase/client";

export interface Expense {
  id: string;
  trip_id: string;
  user_id: string;
  category: 'food' | 'transport' | 'accommodation' | 'activity' | 'shopping' | 'other';
  description: string;
  amount: number;
  currency: string;
  date: string;
  created_at: string;
}

export interface CreateExpensePayload {
  category: Expense['category'];
  description: string;
  amount: number;
  currency?: string;
  date: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  expenses?: T[];
  expense?: T;
}

const getHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const getExpenses = async (tripId: string): Promise<Expense[]> => {
  const response = await fetch(`${API_BASE}/trips/${tripId}/expenses`, {
    method: 'GET',
    headers: await getHeaders(),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to fetch expenses');
  }

  const data: ApiResponse<Expense> = await response.json();
  return data.expenses || [];
};

export const createExpense = async (tripId: string, payload: CreateExpensePayload): Promise<Expense> => {
  const response = await fetch(`${API_BASE}/trips/${tripId}/expenses`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to create expense');
  }

  const data: ApiResponse<Expense> = await response.json();
  if (!data.expense) throw new Error('Expense missing in response');
  return data.expense;
};

export const deleteExpense = async (tripId: string, expenseId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/trips/${tripId}/expenses/${expenseId}`, {
    method: 'DELETE',
    headers: await getHeaders(),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to delete expense');
  }
};
