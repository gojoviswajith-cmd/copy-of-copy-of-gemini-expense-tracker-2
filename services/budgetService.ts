import { supabase } from '../lib/supabase';
import type { Budget } from '../types';

export const budgetService = {
  async get(userId: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) return null;

    return {
      amount: Number((data as any).amount),
      period: (data as any).period as 'monthly' | 'weekly',
    };
  },

  async upsert(userId: string, budget: Budget): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .upsert({
        user_id: userId,
        amount: budget.amount,
        period: budget.period,
      }, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return {
      amount: Number((data as any).amount),
      period: (data as any).period as 'monthly' | 'weekly',
    };
  },
};
