import React, { useState, useEffect } from 'react';
import type { Expense } from '../types';
import { CATEGORIES } from '../constants';
import { CloseIcon } from './icons';

interface ExpenseFormProps {
  expense: Expense | null;
  onSave: (expense: Omit<Expense, 'id'> | Expense) => void;
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSave, onClose }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategoryId(expense.categoryId);
      setDate(expense.date);
      setNotes(expense.notes);
    } else {
      // Reset form to default state for a new expense
      setAmount('');
      setCategoryId(CATEGORIES[0].id);
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const expenseData = {
      amount: parsedAmount,
      categoryId,
      date,
      notes,
    };
    
    if (expense) {
        onSave({ ...expenseData, id: expense.id });
    } else {
        onSave(expenseData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[var(--card-background)] rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <CloseIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{expense ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1" htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required
              className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1" htmlFor="category">Category</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1" htmlFor="date">Date</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required
              className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)]"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1" htmlFor="notes">Notes</label>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)]"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[var(--border-color)] text-[var(--text-primary)] font-semibold rounded-lg hover:bg-[var(--border-color-strong)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--brand-primary)] text-[var(--brand-text-on-primary)] font-semibold rounded-lg hover:bg-[var(--brand-primary-hover)]">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;