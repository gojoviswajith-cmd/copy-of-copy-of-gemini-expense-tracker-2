import React from 'react';
import { formatCurrency } from '../utils';

interface SummaryCardProps {
  title: string;
  value: number | string;
  format?: 'currency' | 'default';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, format = 'default' }) => {
  const displayValue = format === 'currency' && typeof value === 'number'
    ? formatCurrency(value)
    : value;

  return (
    <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-md">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">{title}</h3>
      <p className="text-3xl font-bold text-[var(--text-primary)]">{displayValue}</p>
    </div>
  );
};

export default SummaryCard;
