'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Input } from './Input';
import { Mail, Check } from 'lucide-react';
import { JOB_CATEGORIES } from '@/lib/constants';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          categories: selectedCategories.length > 0 ? selectedCategories : JOB_CATEGORIES,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Subscription failed');
      }

      setSuccess(true);
      setEmail('');
      setSelectedCategories([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Successfully Subscribed!
          </h3>
          <p className="text-silver-400">
            You'll receive job alerts for your selected categories.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-ice-500 to-ice-600">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Get Job Alerts
          </h3>
          <p className="text-silver-400">
            Subscribe to receive new job postings in your inbox
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />

        <div>
          <p className="text-sm text-silver-400 mb-3">
            Select categories (optional - leave blank for all):
          </p>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {JOB_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedCategories.includes(category)
                    ? 'bg-ice-500 text-white'
                    : 'glass text-silver-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe to Alerts'}
        </Button>

        <p className="text-xs text-silver-500 text-center">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </form>
    </GlassCard>
  );
}
