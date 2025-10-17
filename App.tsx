import React, { useState, useMemo, useEffect } from 'react';
import type { View, Expense, Budget, ProfileSettings } from './types';
import { CATEGORIES } from './constants';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ExpensesView from './components/ExpensesView';
import BudgetsView from './components/BudgetsView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { expenseService } from './services/expenseService';
import { budgetService } from './services/budgetService';
import { profileService } from './services/profileService';


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


const AppContent: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [view, setView] = useState<View>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget>({ amount: 1000, period: 'monthly' });
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({ enableBudgetAlerts: true });
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const [expensesData, budgetData, profileData] = await Promise.all([
        expenseService.getAll(user.id),
        budgetService.get(user.id),
        profileService.get(user.id),
      ]);

      setExpenses(expensesData);
      if (budgetData) setBudget(budgetData);
      if (profileData) setProfileSettings(profileData);
    } catch (error: any) {
      console.error('Error loading user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const categoryMap = useMemo(() => {
    return new Map(CATEGORIES.map(cat => [cat.id, cat]));
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return;
    try {
      const newExpense = await expenseService.create(user.id, expense);
      setExpenses(prev => [newExpense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error: any) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const updateExpense = async (updatedExpense: Expense) => {
    if (!user) return;
    try {
      await expenseService.update(user.id, updatedExpense);
      setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error: any) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;
    try {
      await expenseService.delete(user.id, id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };
  
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView expenses={expenses} budget={budget} categoryMap={categoryMap} />;
      case 'expenses':
        return <ExpensesView expenses={expenses} categoryMap={categoryMap} onAddExpense={addExpense} onUpdateExpense={updateExpense} onDeleteExpense={deleteExpense} />;
      case 'budgets':
        return <BudgetsView budget={budget} setBudget={async (newBudget) => {
          if (!user) return;
          try {
            await budgetService.upsert(user.id, newBudget);
            setBudget(newBudget);
          } catch (error: any) {
            console.error('Error updating budget:', error);
            alert('Failed to update budget. Please try again.');
          }
        }} expenses={expenses} />;
      case 'profile':
        return <ProfileView settings={profileSettings} setSettings={async (newSettings) => {
          if (!user) return;
          try {
            await profileService.update(user.id, newSettings);
            setProfileSettings(newSettings);
          } catch (error: any) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
          }
        }} />;
      default:
        return <DashboardView expenses={expenses} budget={budget} categoryMap={categoryMap} />;
    }
  };
  
  if (loading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-muted)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;