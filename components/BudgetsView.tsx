import React, { useState, useMemo, useEffect } from 'react';
import type { Budget, Expense } from '../types';
import { formatCurrency } from '../utils';

interface BudgetsViewProps {
  budget: Budget;
  setBudget: (budget: Budget) => void;
  expenses: Expense[];
}

const BudgetsView: React.FC<BudgetsViewProps> = ({ budget, setBudget, expenses }) => {
  const [newAmount, setNewAmount] = useState(budget.amount.toString());

  useEffect(() => {
    setNewAmount(budget.amount.toString());
  }, [budget]);

  const { totalSpent, progress, progressBarColor } = useMemo(() => {
    const today = new Date();
    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
    });

    const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const progress = budget.amount > 0 ? Math.min((totalSpent / budget.amount) * 100, 100) : 0;

    let progressBarColor = 'bg-emerald-500';
    if (progress > 90) {
      progressBarColor = 'bg-red-500';
    } else if (progress > 75) {
      progressBarColor = 'bg-yellow-500';
    }

    return { totalSpent, progress, progressBarColor };
  }, [expenses, budget]);

  const handleSave = () => {
    const amount = parseFloat(newAmount);
    if (!isNaN(amount) && amount >= 0) {
      setBudget({ ...budget, amount });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Budgets</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--card-background)] p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[var(--text-tertiary)] mb-4">Set Monthly Budget</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-secondary)]">₹</span>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="pl-7 pr-4 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)]"
                placeholder="e.g., 50000"
              />
            </div>
            <button
              onClick={handleSave}
              className="bg-[var(--brand-primary)] text-[var(--brand-text-on-primary)] font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-[var(--brand-primary-hover)] transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        <div className="bg-[var(--card-background)] p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[var(--text-tertiary)] mb-4">Monthly Progress</h2>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(totalSpent)}</span>
            <span className="text-[var(--text-secondary)]">spent of {formatCurrency(budget.amount)}</span>
          </div>
          <div className="w-full bg-[var(--border-color)] rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
           {totalSpent > budget.amount && (
            <p className="text-red-600 mt-2 text-sm font-medium">
              You've exceeded your budget by {formatCurrency(totalSpent - budget.amount)}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetsView;
