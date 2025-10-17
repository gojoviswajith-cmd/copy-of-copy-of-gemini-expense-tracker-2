import React, { useMemo } from 'react';
import type { Expense, Budget, Category } from '../types';
import SummaryCard from './SummaryCard';
import CategoryPieChart from './CategoryPieChart';
import MonthlyTrendChart from './MonthlyTrendChart';

interface DashboardViewProps {
  expenses: Expense[];
  budget: Budget;
  categoryMap: Map<string, Category>;
}

const DashboardView: React.FC<DashboardViewProps> = ({ expenses, budget, categoryMap }) => {
  const { totalSpent, remainingBudget, topCategory } = useMemo(() => {
    const today = new Date();
    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
    });

    const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remainingBudget = budget.amount - totalSpent;

    const categorySpending = currentMonthExpenses.reduce((acc, exp) => {
      acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategoryId = Object.keys(categorySpending).sort((a, b) => categorySpending[b] - categorySpending[a])[0];
    const topCategory = topCategoryId ? categoryMap.get(topCategoryId)?.name : 'N/A';

    return { totalSpent, remainingBudget, topCategory };
  }, [expenses, budget, categoryMap]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Total Spent (This Month)" value={totalSpent} format="currency" />
        <SummaryCard title="Remaining Budget" value={remainingBudget} format="currency" />
        <SummaryCard title="Top Spending Category" value={topCategory} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-[var(--card-background)] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[var(--text-tertiary)] mb-4">Monthly Spending Trend</h2>
          <MonthlyTrendChart expenses={expenses} />
        </div>
        <div className="lg:col-span-2 bg-[var(--card-background)] p-6 rounded-xl shadow-md">
           <h2 className="text-xl font-semibold text-[var(--text-tertiary)] mb-4">Spending by Category</h2>
          <CategoryPieChart expenses={expenses} categoryMap={categoryMap} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
