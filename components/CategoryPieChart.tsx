import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Expense, Category } from '../types';
import { formatCurrency } from '../utils';

interface CategoryPieChartProps {
  expenses: Expense[];
  categoryMap: Map<string, Category>;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ expenses, categoryMap }) => {
  const data = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    expenses.forEach(expense => {
      const currentTotal = categoryTotals.get(expense.categoryId) || 0;
      categoryTotals.set(expense.categoryId, currentTotal + expense.amount);
    });

    return Array.from(categoryTotals.entries()).map(([categoryId, total]) => {
      const category = categoryMap.get(categoryId);
      return {
        name: category?.name || 'Uncategorized',
        value: total,
        color: category?.color || '#94a3b8',
      };
    });
  }, [expenses, categoryMap]);

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">No expense data for this month.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
