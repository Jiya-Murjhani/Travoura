import React, { useState } from 'react';
import { CreateExpensePayload, createExpense } from '../../api/expenses';
import { PlusCircle, Loader2 } from 'lucide-react';

interface AddExpenseFormProps {
  tripId: string;
  onExpenseAdded: () => void;
}

const CATEGORIES = [
  { value: 'food', label: '🍔 Food & Dining' },
  { value: 'transport', label: '🚗 Transporte' },
  { value: 'accommodation', label: '🏨 Accommodation' },
  { value: 'activity', label: '🎟️ Activity' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'other', label: '📌 Other' },
] as const;

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD'];

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ tripId, onExpenseAdded }) => {
  const [formData, setFormData] = useState<CreateExpensePayload>({
    category: 'food',
    description: '',
    amount: '' as unknown as number, // Start empty for clean input
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || formData.amount <= 0) {
      setError('Please provide a valid description and a positive amount.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createExpense(tripId, formData);
      setFormData({
        ...formData,
        description: '',
        amount: '' as unknown as number,
      });
      onExpenseAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition-colors";

  return (
    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
        <PlusCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
        Add New Expense
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as CreateExpensePayload['category'] })}
              className={inputClasses}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
          <input
            type="text"
            required
            placeholder="e.g., Dinner at local market"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || ('' as unknown as number) })}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className={inputClasses}
            >
              {CURRENCIES.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Expense'}
        </button>
      </form>
    </div>
  );
};
