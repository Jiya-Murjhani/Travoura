import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  createdAt?: string;
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

export interface BudgetData {
  total: number;
  spent: number;
  categories: BudgetCategory[];
}

interface BudgetContextType {
  activeTripId: string | null;
  activeTripName: string;
  budgetData: BudgetData;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateBudget: (total: number, categories: BudgetCategory[]) => void;
  getExpensesByCategory: (category: string) => Expense[];
  getTotalSpentByCategory: (category: string) => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const frontendToBackendCat: Record<string, string> = {
  Transport: 'transport',
  Stay: 'accommodation',
  Food: 'food',
  Activities: 'activity',
  Shopping: 'shopping',
  Other: 'other'
};

const backendToFrontendCat: Record<string, string> = {
  transport: 'Transport',
  accommodation: 'Stay',
  food: 'Food',
  activity: 'Activities',
  shopping: 'Shopping',
  other: 'Other'
};

const defaultCategories: BudgetCategory[] = [
  { name: 'Transport', allocated: 200, spent: 0 },
  { name: 'Stay', allocated: 400, spent: 0 },
  { name: 'Food', allocated: 300, spent: 0 },
  { name: 'Activities', allocated: 150, spent: 0 },
  { name: 'Shopping', allocated: 100, spent: 0 },
  { name: 'Other', allocated: 50, spent: 0 }
];

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [activeTripName, setActiveTripName] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    total: 0,
    spent: 0,
    categories: defaultCategories,
  });
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthReady(!!data.session));
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthReady(!!session);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const loadData = useCallback(async () => {
    if (!isAuthReady) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch active trip
    const { data: trips } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: true });

    if (!trips || trips.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const ongoingTrip = trips.find(
      (t) => !t.start_date || t.start_date >= today || t.status === 'planning'
    ) || trips[trips.length - 1];

    if (!ongoingTrip) return;
    setActiveTripId(ongoingTrip.id);
    setActiveTripName(ongoingTrip.title || ongoingTrip.destination || 'My Trip');

    // 2. Fetch expenses for trip
    const { data: expenseRecords } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', ongoingTrip.id);

    const loadedExpenses: Expense[] = (expenseRecords || []).map(r => ({
      id: r.id,
      category: backendToFrontendCat[r.category] || 'Other',
      description: r.description,
      amount: Number(r.amount),
      date: r.date || new Date().toISOString().split('T')[0],
      paymentMethod: r.currency || 'USD',
      createdAt: r.created_at
    }));

    setExpenses(loadedExpenses);

    // 3. Extract correct budget alloc
    const totalAllocated = ongoingTrip.total_budget || ongoingTrip.budget || 2000;
    
    // Attempt parsing custom allocated amounts if stored in notes or similar
    // for now we divide proportionately if not explicitly bound
    const catRatios: Record<string, number> = {
      Transport: 0.2, Stay: 0.35, Food: 0.25, Activities: 0.1, Shopping: 0.05, Other: 0.05
    };

    setBudgetData(prev => ({
      ...prev,
      total: Number(totalAllocated),
      categories: defaultCategories.map(c => ({
        ...c,
        allocated: Math.floor(Number(totalAllocated) * (catRatios[c.name] || 0.1))
      }))
    }));
  }, [isAuthReady]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Recalculate spent whenever expenses change
  useEffect(() => {
    const categorySpent: Record<string, number> = {};
    expenses.forEach(e => {
      categorySpent[e.category] = (categorySpent[e.category] || 0) + e.amount;
    });

    setBudgetData(prev => {
      let totalSpent = 0;
      const updatedCategories = prev.categories.map(cat => {
        const spent = categorySpent[cat.name] || 0;
        totalSpent += spent;
        return { ...cat, spent };
      });
      return { ...prev, spent: totalSpent, categories: updatedCategories };
    });
  }, [expenses]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!activeTripId) return;

    const payload = {
      trip_id: activeTripId,
      category: frontendToBackendCat[expense.category] || 'other',
      description: expense.description,
      amount: expense.amount,
      currency: expense.paymentMethod,
      date: expense.date
    };

    const { data, error } = await supabase.from('expenses').insert(payload).select().single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to add expense', variant: 'destructive' });
      return;
    }

    if (data) {
      const newExpense: Expense = {
        ...expense,
        id: data.id,
        createdAt: data.created_at
      };
      setExpenses(prev => [...prev, newExpense]);
      toast({ title: 'Expense Added' });
    }
  };

  const updateExpense = async (id: string, updatedExpense: Partial<Expense>) => {
    const payload: any = {};
    if (updatedExpense.category) payload.category = frontendToBackendCat[updatedExpense.category] || 'other';
    if (updatedExpense.description) payload.description = updatedExpense.description;
    if (updatedExpense.amount !== undefined) payload.amount = updatedExpense.amount;
    if (updatedExpense.paymentMethod) payload.currency = updatedExpense.paymentMethod;
    if (updatedExpense.date) payload.date = updatedExpense.date;

    const { error } = await supabase.from('expenses').update(payload).eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update expense', variant: 'destructive' });
      return;
    }

    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedExpense } : e));
    toast({ title: 'Expense Updated' });
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
       toast({ title: 'Error', description: 'Failed to delete expense', variant: 'destructive' });
       return;
    }
    
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast({ title: 'Expense Deleted' });
  };

  const updateBudget = (total: number, categories: BudgetCategory[]) => {
    // If the user wants to update the total budget, we optionally push to trips table
    if (activeTripId) {
      supabase.from('trips').update({ total_budget: total }).eq('id', activeTripId).then();
    }
    setBudgetData(prev => ({ ...prev, total, categories }));
    toast({ title: 'Budget Updated' });
  };

  const getExpensesByCategory = (category: string) => expenses.filter(e => e.category === category);
  const getTotalSpentByCategory = (category: string) => getExpensesByCategory(category).reduce((s, e) => s + e.amount, 0);

  return (
    <BudgetContext.Provider
      value={{
        activeTripId,
        activeTripName,
        budgetData,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        updateBudget,
        getExpensesByCategory,
        getTotalSpentByCategory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
