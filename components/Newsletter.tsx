'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Input } from './Input';
import { Mail, Check } from 'lucide-react';

interface NewsletterProps {
  showHeader?: boolean;
  headingLevel?: 'h2' | 'h3';
  buttonText?: string;
  categories?: string[];
  title?: string;
  description?: string;
  successDescription?: string;
}

export function Newsletter({
  showHeader = true,
  headingLevel = 'h3',
  buttonText = 'Subscribe to Alerts',
  categories = ['All'],
  title = 'Get Job Alerts',
  description = 'Subscribe to receive new job postings in your inbox',
  successDescription = "You'll receive job alerts for your selected categories.",
}: NewsletterProps = {}) {
  const Heading = headingLevel;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
          categories,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Subscription failed');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <GlassCard>
        <div className="py-8 text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Successfully Subscribed!
          </h3>
          <p className="text-silver-400">
            {successDescription}
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      {showHeader && (
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-ice-500 to-ice-600">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <Heading className="text-2xl font-semibold text-white mb-2">
              {title}
            </Heading>
            <p className="text-silver-400">
              {description}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
            {error}
          </div>
        )}

        <Input
          id="job-alert-email"
          type="email"
          label="Email address"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
          required
          fullWidth
        />

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Subscribing...' : buttonText}
        </Button>

        <p className="text-xs text-silver-500 text-center">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </form>
    </GlassCard>
  );
}
