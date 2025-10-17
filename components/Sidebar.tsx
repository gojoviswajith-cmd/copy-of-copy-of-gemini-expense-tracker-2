import React from 'react';
import type { View } from '../types';
import { DashboardIcon, ExpensesIcon, BudgetsIcon, LogoIcon, ProfileIcon, SunIcon, MoonIcon, LogoutIcon } from './icons';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-[var(--sidebar-hover-background)] text-[var(--sidebar-text)] hover:bg-opacity-80 transition-colors"
    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
  >
    {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    <span className="text-sm font-medium">Switch Theme</span>
  </button>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, theme, toggleTheme, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'expenses', label: 'Expenses', icon: ExpensesIcon },
    { id: 'budgets', label: 'Budgets', icon: BudgetsIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
  ];

  return (
    <aside className="w-64 bg-[var(--sidebar-background)] text-[var(--sidebar-text)] flex flex-col">
      <div className="h-20 flex items-center justify-center px-6 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-emerald-400" />
          <span className="text-xl font-bold">ExpenseTracker</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id as View)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activeView === item.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-hover-background)] hover:text-[var(--sidebar-text)]'
                }`}
              >
                <item.icon className="h-6 w-6 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-[var(--sidebar-border)]">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-hover-background)] hover:text-[var(--sidebar-text)] mb-2"
        >
          <LogoutIcon className="h-6 w-6 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <p className="text-xs text-[var(--sidebar-text-muted)] text-center mt-4">&copy; 2024 Gemini Inc.</p>
      </div>
    </aside>
  );
};

export default Sidebar;