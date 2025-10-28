'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Bell, Mail, TrendingUp, CreditCard } from 'lucide-react';

interface NotificationPreferences {
  newApplications: boolean;
  expirationReminders: boolean;
  weeklyAnalytics: boolean;
  paymentConfirmations: boolean;
}

export function NotificationPreferencesForm() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newApplications: true,
    expirationReminders: true,
    weeklyAnalytics: true,
    paymentConfirmations: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/user/notification-preferences');
      const data = await response.json();

      if (response.ok && data.preferences) {
        setPreferences({
          newApplications: data.preferences.newApplications,
          expirationReminders: data.preferences.expirationReminders,
          weeklyAnalytics: data.preferences.weeklyAnalytics,
          paymentConfirmations: data.preferences.paymentConfirmations,
        });
      }
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/notification-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update preferences');
      }

      setSuccess('Notification preferences updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ice-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* New Applications */}
        <div className="flex items-start space-x-3 p-4 bg-dark-300 border border-dark-400 rounded-lg">
          <Bell className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <label
              htmlFor="newApplications"
              className="block text-sm font-medium text-white cursor-pointer"
            >
              New Applications
            </label>
            <p className="text-xs text-silver-400 mt-1">
              Receive email notifications when someone applies to your jobs
            </p>
          </div>
          <button
            type="button"
            id="newApplications"
            onClick={() => togglePreference('newApplications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.newApplications ? 'bg-ice-500' : 'bg-dark-500'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.newApplications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Expiration Reminders */}
        <div className="flex items-start space-x-3 p-4 bg-dark-300 border border-dark-400 rounded-lg">
          <Mail className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <label
              htmlFor="expirationReminders"
              className="block text-sm font-medium text-white cursor-pointer"
            >
              Expiration Reminders
            </label>
            <p className="text-xs text-silver-400 mt-1">
              Get notified 7, 3, and 1 day before your job postings expire
            </p>
          </div>
          <button
            type="button"
            id="expirationReminders"
            onClick={() => togglePreference('expirationReminders')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.expirationReminders ? 'bg-ice-500' : 'bg-dark-500'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.expirationReminders ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Weekly Analytics */}
        <div className="flex items-start space-x-3 p-4 bg-dark-300 border border-dark-400 rounded-lg">
          <TrendingUp className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <label
              htmlFor="weeklyAnalytics"
              className="block text-sm font-medium text-white cursor-pointer"
            >
              Weekly Analytics
            </label>
            <p className="text-xs text-silver-400 mt-1">
              Receive a weekly summary of your job performance and metrics
            </p>
          </div>
          <button
            type="button"
            id="weeklyAnalytics"
            onClick={() => togglePreference('weeklyAnalytics')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.weeklyAnalytics ? 'bg-ice-500' : 'bg-dark-500'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.weeklyAnalytics ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Payment Confirmations */}
        <div className="flex items-start space-x-3 p-4 bg-dark-300 border border-dark-400 rounded-lg">
          <CreditCard className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <label
              htmlFor="paymentConfirmations"
              className="block text-sm font-medium text-white cursor-pointer"
            >
              Payment Confirmations
            </label>
            <p className="text-xs text-silver-400 mt-1">
              Get email receipts and payment confirmations
            </p>
          </div>
          <button
            type="button"
            id="paymentConfirmations"
            onClick={() => togglePreference('paymentConfirmations')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.paymentConfirmations ? 'bg-ice-500' : 'bg-dark-500'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.paymentConfirmations ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg text-sm">
          {success}
        </div>
      )}

      <Button type="submit" disabled={isLoading} fullWidth>
        {isLoading ? 'Saving Preferences...' : 'Save Preferences'}
      </Button>
    </form>
  );
}
