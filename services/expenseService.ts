import { supabase } from '../lib/supabase';
import type { Expense } from '../types';

export const expenseService = {
  async getAll(userId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map((exp: any) => ({
      id: exp.id,
      categoryId: exp.category_id,
      amount: Number(exp.amount),
      date: exp.date,
      notes: exp.notes,
    }));
  },

  async create(userId: string, expense: Omit<Expense, 'id'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        category_id: expense.categoryId,
        amount: expense.amount,
        date: expense.date,
        notes: expense.notes,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return {
      id: data.id,
      categoryId: data.category_id,
      amount: Number(data.amount),
      date: data.date,
      notes: data.notes,
    };
  },

  async update(userId: string, expense: Expense): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update({
        category_id: expense.categoryId,
        amount: expense.amount,
        date: expense.date,
        notes: expense.notes,
      })
      .eq('id', expense.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return {
      id: data.id,
      categoryId: data.category_id,
      amount: Number(data.amount),
      date: data.date,
      notes: data.notes,
    };
  },

  async delete(userId: string, expenseId: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
