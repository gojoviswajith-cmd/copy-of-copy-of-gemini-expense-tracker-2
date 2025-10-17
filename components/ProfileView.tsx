import React from 'react';
import type { ProfileSettings } from '../types';

interface ProfileViewProps {
  settings: ProfileSettings;
  setSettings: (settings: ProfileSettings) => Promise<void>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ settings, setSettings }) => {
  const handleToggle = async () => {
    await setSettings({ ...settings, enableBudgetAlerts: !settings.enableBudgetAlerts });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Profile & Settings</h1>
      
      <div className="bg-[var(--card-background)] p-8 rounded-xl shadow-md max-w-2xl">
        <h2 className="text-xl font-semibold text-[var(--text-tertiary)] mb-6">Notification Preferences</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="budget-alerts" className="font-medium text-[var(--text-primary)] cursor-pointer">Email alerts for budget limits</label>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Receive an email when you're close to reaching your monthly budget.
            </p>
          </div>
          
          <button
            id="budget-alerts"
            role="switch"
            aria-checked={settings.enableBudgetAlerts}
            onClick={handleToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
              settings.enableBudgetAlerts ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-color-strong)]'
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                settings.enableBudgetAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
