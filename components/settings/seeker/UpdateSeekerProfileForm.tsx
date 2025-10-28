'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { User, Mail } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
}

export function UpdateSeekerProfileForm() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/update-profile');
      const data = await response.json();

      if (response.ok && data.user) {
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
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
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully');

      // Update local state with the returned user data
      if (data.user) {
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
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
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-silver-300 mb-1"
        >
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
          <input
            type="text"
            id="name"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            required
            minLength={2}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-ice-500 focus:border-ice-500"
            placeholder="Your full name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-silver-300 mb-1"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
          <input
            type="email"
            id="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            required
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-ice-500 focus:border-ice-500"
            placeholder="your@email.com"
          />
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
        {isLoading ? 'Saving Changes...' : 'Save Changes'}
      </Button>
    </form>
  );
}
