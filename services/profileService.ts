import { supabase } from '../lib/supabase';
import type { ProfileSettings } from '../types';

export const profileService = {
  async get(userId: string): Promise<ProfileSettings | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) return null;

    return {
      enableBudgetAlerts: (data as any).enable_budget_alerts,
    };
  },

  async update(userId: string, settings: ProfileSettings): Promise<ProfileSettings> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        enable_budget_alerts: settings.enableBudgetAlerts,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return {
      enableBudgetAlerts: (data as any).enable_budget_alerts,
    };
  },
};
