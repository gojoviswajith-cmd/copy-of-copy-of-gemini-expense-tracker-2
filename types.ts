
export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id:string;
  categoryId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  notes: string;
}

export interface Budget {
  amount: number;
  period: 'monthly' | 'weekly';
}

export interface ProfileSettings {
  enableBudgetAlerts: boolean;
}

export type View = 'dashboard' | 'expenses' | 'budgets' | 'profile';
