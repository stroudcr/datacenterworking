'use client';

import { useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { AlertTriangle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-yellow-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Dashboard Error
        </h1>

        <p className="text-slate-300 mb-6">
          We couldn't load your dashboard. This could be due to a temporary issue with your session or our servers.
        </p>

        <div className="flex gap-3 justify-center flex-col sm:flex-row">
          <Button
            onClick={reset}
            variant="primary"
          >
            Try again
          </Button>

          <Button
            onClick={() => window.location.href = '/login'}
            variant="outline"
          >
            Log in again
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="ghost"
          >
            Go home
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
