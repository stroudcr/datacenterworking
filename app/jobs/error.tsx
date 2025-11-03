'use client';

import { useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { Briefcase, AlertTriangle } from 'lucide-react';

export default function JobsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Jobs error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Briefcase className="w-16 h-16 text-blue-400" />
            <AlertTriangle className="w-8 h-8 text-yellow-400 absolute -bottom-1 -right-1" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Job Not Found
        </h1>

        <p className="text-slate-300 mb-6">
          We couldn't load this job posting. It may have been removed, expired, or the link might be incorrect.
        </p>

        <div className="flex gap-3 justify-center flex-col sm:flex-row">
          <Button
            onClick={reset}
            variant="primary"
          >
            Try again
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Browse all jobs
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
