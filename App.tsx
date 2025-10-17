import React, { useState, useMemo, useEffect } from 'react';
import type { View, Expense, Budget, ProfileSettings } from './types';
import { CATEGORIES } from './constants';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ExpensesView from './components/ExpensesView';
import BudgetsView from './components/BudgetsView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';

const getInitialExpenses = (): Expense[] => {
  const today = new Date();
  const expenses: Expense[] = [];
  for (let i = 0; i < 20; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), Math.floor(Math.random() * 28) + 1);
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    expenses.push({
      id: crypto.randomUUID(),
      categoryId: category.id,
      amount: parseFloat((Math.random() * 100 + 5).toFixed(2)),
      date: date.toISOString().split('T')[0],
      notes: `Sample expense entry #${i + 1}`
    });
  }
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (storedPrefs === 'light' || storedPrefs === 'dark') {
      return storedPrefs;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>(getInitialExpenses());
  const [budget, setBudget] = useState<Budget>({ amount: 1000, period: 'monthly' });
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({ enableBudgetAlerts: true });
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const categoryMap = useMemo(() => {
    return new Map(CATEGORIES.map(cat => [cat.id, cat]));
  }, []);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    const updatedExpenses = [...expenses, newExpense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setExpenses(updatedExpenses);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView expenses={expenses} budget={budget} categoryMap={categoryMap} />;
      case 'expenses':
        return <ExpensesView expenses={expenses} categoryMap={categoryMap} onAddExpense={addExpense} onUpdateExpense={updateExpense} onDeleteExpense={deleteExpense} />;
      case 'budgets':
        return <BudgetsView budget={budget} setBudget={setBudget} expenses={expenses} />;
      case 'profile':
        return <ProfileView settings={profileSettings} setSettings={setProfileSettings} />;
      default:
        return <DashboardView expenses={expenses} budget={budget} categoryMap={categoryMap} />;
    }
  };
  
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen font-sans bg-[var(--background-muted)]">
      <Sidebar activeView={view} setView={setView} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;