'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Bell, Mail, Bookmark, TrendingUp } from 'lucide-react';

interface NotificationPreferences {
  jobAlerts: boolean;
  applicationUpdates: boolean;
  savedJobReminders: boolean;
  weeklyDigest: boolean;
}

export function SeekerNotificationPreferencesForm() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    jobAlerts: true,
    applicationUpdates: true,
    savedJobReminders: true,
    weeklyDigest: true,
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
          jobAlerts: data.preferences.jobAlerts ?? true,
          applicationUpdates: data.preferences.applicationUpdates ?? true,
          savedJobReminders: data.preferences.savedJobReminders ?? true,
          weeklyDigest: data.preferences.weeklyDigest ?? true,
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
        {/* Job Alerts */}
        <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <label
              htmlFor="jobAlerts"
              className="block text-sm font-medium text-white cursor-pointer"
            >
              Job Alerts
            </label>
            <p className="text-xs text-silver-400 mt-1">
              Get notified when new jobs match your preferences and saved searches
            </p>
          </div>
          <button
            type="button"
            id="jobAlerts"
            onClick={() => togglePreference('jobAlerts')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.jobAlerts ? 'bg-ice-500' : 'bg-silver-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.jobAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Application Updates */}
        <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          <Mail className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <label
              htmlFor="applicationUpdates"
              className="block text-sm font-medium text-white cursor-pointer"
            >
              Application Status Updates
            </label>
            <p className="text-xs text-silver-400 mt-1">
              Receive emails when employers review, accept, or reject your applications
            </p>
          </div>
          <button
            type="button"
            id="applicationUpdates"
            onClick={() => togglePreference('applicationUpdates')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.applicationUpdates ? 'bg-ice-500' : 'bg-silver-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.applicationUpdates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Saved Job Reminders */}
        <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          <Bookmark className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <label
              htmlFor="savedJobReminders"
              className="block text-sm font-medium text-white cursor-pointer"
            >
              Saved Job Reminders
            </label>
            <p className="text-xs text-silver-400 mt-1">
              Get notified when jobs you've saved are about to expire
            </p>
          </div>
          <button
            type="button"
            id="savedJobReminders"
            onClick={() => togglePreference('savedJobReminders')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.savedJobReminders ? 'bg-ice-500' : 'bg-silver-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.savedJobReminders ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Weekly Digest */}
        <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          <TrendingUp className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <label
              htmlFor="weeklyDigest"
              className="block text-sm font-medium text-white cursor-pointer"
            >
              Weekly Job Digest
            </label>
            <p className="text-xs text-silver-400 mt-1">
              Receive a weekly email with curated job recommendations
            </p>
          </div>
          <button
            type="button"
            id="weeklyDigest"
            onClick={() => togglePreference('weeklyDigest')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.weeklyDigest ? 'bg-ice-500' : 'bg-silver-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
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
