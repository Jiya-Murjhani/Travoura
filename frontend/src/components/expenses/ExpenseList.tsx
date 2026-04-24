import React from 'react';
import { Expense, deleteExpense } from '../../api/expenses';
import { Trash2 } from 'lucide-react';

interface ExpenseListProps {
  tripId: string;
  expenses: Expense[];
  onDeleted: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-100 text-orange-800 border-orange-200',
  transport: 'bg-blue-100 text-blue-800 border-blue-200',
  accommodation: 'bg-purple-100 text-purple-800 border-purple-200',
  activity: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shopping: 'bg-pink-100 text-pink-800 border-pink-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
};

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍔 Food',
  transport: '🚗 Transport',
  accommodation: '🏨 Stay',
  activity: '🎟️ Activity',
  shopping: '🛍️ Shopping',
  other: '📌 Other',
};

export const ExpenseList: React.FC<ExpenseListProps> = ({ tripId, expenses, onDeleted }) => {
  const handleDelete = async (expenseId: string) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(tripId, expenseId);
      onDeleted();
    } catch (err) {
      alert('Failed to delete expense.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm font-medium text-gray-500">No expenses logged yet.</p>
        <p className="text-xs text-gray-400 mt-1">Start tracking to stay on budget.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 transition-all duration-200"
        >
          <div className="flex items-start space-x-4">
            <div 
              className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full border ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.other}`}
            >
              {CATEGORY_LABELS[expense.category] || 'Other'}
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                {expense.description}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(expense.date)}
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end w-full sm:w-auto pl-14 sm:pl-0">
            <span className="text-base font-bold text-gray-900 mr-4">
              {Number(expense.amount).toLocaleString(undefined, {
                style: 'currency',
                currency: expense.currency || 'USD'
              })}
            </span>
            <button
              onClick={() => handleDelete(expense.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
              aria-label="Delete expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
