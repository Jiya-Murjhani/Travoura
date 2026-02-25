import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

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
  budgetData: BudgetData;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateBudget: (total: number, categories: BudgetCategory[]) => void;
  getExpensesByCategory: (category: string) => Expense[];
  getTotalSpentByCategory: (category: string) => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const initialCategories: BudgetCategory[] = [
  { name: 'Transport', allocated: 45000, spent: 0 },
  { name: 'Stay', allocated: 50000, spent: 0 },
  { name: 'Food', allocated: 30000, spent: 0 },
  { name: 'Activities', allocated: 25000, spent: 0 },
];

const initialExpenses: Expense[] = [
  { 
    id: '1', 
    category: 'Transport', 
    description: 'Flight to Bali - Air Asia', 
    amount: 24500, 
    date: '2024-12-15', 
    paymentMethod: 'Card',
    createdAt: new Date().toISOString()
  },
  { 
    id: '2', 
    category: 'Stay', 
    description: 'Ubud Villa - 5 nights', 
    amount: 28500, 
    date: '2024-12-15', 
    paymentMethod: 'UPI',
    createdAt: new Date().toISOString()
  },
  { 
    id: '3', 
    category: 'Food', 
    description: 'Dinner at La Lucciola', 
    amount: 3200, 
    date: '2024-12-16', 
    paymentMethod: 'Cash',
    createdAt: new Date().toISOString()
  },
  { 
    id: '4', 
    category: 'Transport', 
    description: 'Airport Transfer', 
    amount: 1500, 
    date: '2024-12-15', 
    paymentMethod: 'Cash',
    createdAt: new Date().toISOString()
  },
  { 
    id: '5', 
    category: 'Activities', 
    description: 'Sunrise Trek - Mt. Batur', 
    amount: 4500, 
    date: '2024-12-17', 
    paymentMethod: 'Card',
    createdAt: new Date().toISOString()
  },
];

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    total: 150000,
    spent: 0,
    categories: initialCategories,
  });

  // Calculate spent amounts from expenses
  useEffect(() => {
    const categorySpent: Record<string, number> = {};
    
    expenses.forEach(expense => {
      categorySpent[expense.category] = (categorySpent[expense.category] || 0) + expense.amount;
    });

    setBudgetData(prev => {
      const updatedCategories = prev.categories.map(cat => ({
        ...cat,
        spent: categorySpent[cat.name] || 0,
      }));

      const totalSpent = updatedCategories.reduce((sum, cat) => sum + cat.spent, 0);

      return {
        ...prev,
        spent: totalSpent,
        categories: updatedCategories,
      };
    });
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setExpenses(prev => [...prev, newExpense]);

    toast({
      title: 'Expense Added',
      description: 'Your expense has been successfully added.',
    });
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );

    toast({
      title: 'Expense Updated',
      description: 'Your expense has been successfully updated.',
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));

    toast({
      title: 'Expense Deleted',
      description: 'Your expense has been successfully deleted.',
    });
  };

  const updateBudget = (total: number, categories: BudgetCategory[]) => {
    setBudgetData(prev => ({
      ...prev,
      total,
      categories,
    }));

    toast({
      title: 'Budget Updated',
      description: 'Your budget has been successfully updated.',
    });
  };

  const getExpensesByCategory = (category: string) => {
    return expenses.filter(expense => expense.category === category);
  };

  const getTotalSpentByCategory = (category: string) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };


  return (
    <BudgetContext.Provider
      value={{
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

