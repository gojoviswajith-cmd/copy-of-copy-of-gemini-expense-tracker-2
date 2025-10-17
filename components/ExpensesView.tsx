import React, { useState, useMemo, useEffect } from 'react';
import type { Expense, Category } from '../types';
import { CATEGORIES } from '../constants';
import ExpenseForm from './ExpenseForm';
import { formatCurrency } from '../utils';
import { SearchIcon } from './icons';

interface ExpensesViewProps {
  expenses: Expense[];
  categoryMap: Map<string, Category>;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const ITEMS_PER_PAGE = 8;

const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, categoryMap, onAddExpense, onUpdateExpense, onDeleteExpense }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenModal = (expense?: Expense) => {
    setEditingExpense(expense || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSaveExpense = (expenseData: Omit<Expense, 'id'> | Expense) => {
    if ('id' in expenseData) {
      onUpdateExpense(expenseData);
    } else {
      onAddExpense(expenseData);
    }
    handleCloseModal();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStartDate('');
    setEndDate('');
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Search term filter (notes)
      if (searchTerm && !expense.notes.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && expense.categoryId !== selectedCategory) {
        return false;
      }
      // Date range filter
      const expenseDate = new Date(expense.date);
      if (startDate && new Date(expense.date) < new Date(startDate)) {
        return false;
      }
      // Adjusting endDate to be inclusive of the selected day
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to end of day
        if (expenseDate > end) {
          return false;
        }
      }
      return true;
    });
  }, [expenses, searchTerm, selectedCategory, startDate, endDate]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, startDate, endDate]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExpenses, currentPage]);

  const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const lastItemIndex = firstItemIndex + paginatedExpenses.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Expenses</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[var(--brand-primary)] text-[var(--brand-text-on-primary)] font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-[var(--brand-primary-hover)] transition-colors"
        >
          Add Expense
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--card-background)] p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <label htmlFor="search-notes" className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">Search Notes</label>
            <input
              type="text"
              id="search-notes"
              placeholder="e.g., Coffee meeting"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[var(--background-muted)] text-[var(--text-primary)]"
            />
            <SearchIcon className="absolute left-3 top-9 h-5 w-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">Category</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[var(--background-muted)] text-[var(--text-primary)]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">Start Date</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[var(--background-muted)] text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">End Date</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[var(--background-muted)] text-[var(--text-primary)]"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1 flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-[var(--border-color)] text-[var(--text-primary)] font-semibold rounded-lg hover:bg-[var(--border-color-strong)] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--card-background)] rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="bg-[var(--background-muted)]">
                <tr>
                  <th className="p-4 font-semibold text-[var(--text-tertiary)]">Date</th>
                  <th className="p-4 font-semibold text-[var(--text-tertiary)]">Category</th>
                  <th className="p-4 font-semibold text-[var(--text-tertiary)]">Amount</th>
                  <th className="p-4 font-semibold text-[var(--text-tertiary)]">Notes</th>
                  <th className="p-4 font-semibold text-[var(--text-tertiary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense, index) => {
                  const category = categoryMap.get(expense.categoryId);
                  return (
                    <tr key={expense.id} className={`border-t border-[var(--border-color)] ${index % 2 !== 0 ? 'bg-[var(--background-muted)]' : ''}`}>
                      <td className="p-4 text-[var(--text-secondary)]">{formatDate(expense.date)}</td>
                      <td className="p-4 text-[var(--text-secondary)]">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: category?.color, color: 'white' }}>
                          {category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--text-primary)] font-medium">{formatCurrency(expense.amount)}</td>
                      <td className="p-4 text-[var(--text-secondary)] truncate max-w-xs">{expense.notes}</td>
                      <td className="p-4">
                        <button onClick={() => handleOpenModal(expense)} className="text-blue-500 hover:text-blue-700 font-semibold mr-4">Edit</button>
                        <button onClick={() => onDeleteExpense(expense.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
        {filteredExpenses.length === 0 && (
            <div className="text-center p-8 text-[var(--text-secondary)]">
                <p className="font-semibold">No expenses found.</p>
                <p className="text-sm">Try adjusting your filters or adding a new expense.</p>
            </div>
        )}
        {totalPages > 1 && (
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center border-t border-[var(--border-color)] gap-4">
                <span className="text-sm text-[var(--text-secondary)]">
                    Showing {paginatedExpenses.length > 0 ? firstItemIndex + 1 : 0} to {lastItemIndex} of {filteredExpenses.length} expenses
                </span>
                <div className="inline-flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-[var(--border-color-strong)] rounded-md text-sm font-medium text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--background-muted)] transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-[var(--border-color-strong)] rounded-md text-sm font-medium text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--background-muted)] transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        )}
      </div>

      {isModalOpen && (
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSaveExpense}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ExpensesView;