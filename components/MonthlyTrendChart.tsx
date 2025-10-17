import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Expense } from '../types';
import { formatCurrency, formatCurrencyShort } from '../utils';

interface MonthlyTrendChartProps {
  expenses: Expense[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ expenses }) => {
  const data = useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      monthlyTotals[key] = (monthlyTotals[key] || 0) + expense.amount;
    });

    return Object.entries(monthlyTotals)
      .map(([key, amount]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          date: new Date(year, month),
          name: `${monthNames[month]} '${year.toString().slice(2)}`,
          spending: amount,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [expenses]);
  
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">Not enough data to show a trend.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey="name" stroke="var(--text-secondary)" />
        <YAxis stroke="var(--text-secondary)" tickFormatter={(value) => formatCurrencyShort(value as number)} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card-background)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
        <Line type="monotone" dataKey="spending" stroke="var(--brand-primary)" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MonthlyTrendChart;
