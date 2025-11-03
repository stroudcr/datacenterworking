'use client';

import { useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { Shield, AlertTriangle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Shield className="w-16 h-16 text-purple-400" />
            <AlertTriangle className="w-8 h-8 text-red-400 absolute -bottom-1 -right-1" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Admin Panel Error
        </h1>

        <p className="text-slate-300 mb-6">
          An error occurred in the admin panel. This could be due to insufficient permissions or a server issue.
        </p>

        <div className="flex gap-3 justify-center flex-col sm:flex-row">
          <Button
            onClick={reset}
            variant="primary"
          >
            Try again
          </Button>

          <Button
            onClick={() => window.location.href = '/dashboard/employer'}
            variant="outline"
          >
            Dashboard
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
