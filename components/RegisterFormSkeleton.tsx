import { GlassCard } from '@/components/GlassCard';
import { UserPlus } from 'lucide-react';

export function RegisterFormSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
          <p className="text-silver-400">Create your account to continue</p>
        </div>

        <GlassCard>
          <div className="space-y-4">
            {/* Role Selection Skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-20 bg-silver-300/20 rounded animate-pulse mb-2" />
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg border-2 border-white/10 glass h-24 animate-pulse" />
                <div className="p-4 rounded-lg border-2 border-white/10 glass h-24 animate-pulse" />
              </div>
            </div>

            {/* Input Skeletons */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-silver-300/20 rounded animate-pulse" />
              <div className="h-11 bg-white/5 border border-white/10 rounded-lg animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-16 bg-silver-300/20 rounded animate-pulse" />
              <div className="h-11 bg-white/5 border border-white/10 rounded-lg animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-20 bg-silver-300/20 rounded animate-pulse" />
              <div className="h-11 bg-white/5 border border-white/10 rounded-lg animate-pulse" />
            </div>

            {/* Button Skeleton */}
            <div className="h-11 bg-ice-blue/20 rounded-lg animate-pulse" />

            {/* Sign in link skeleton */}
            <div className="text-center">
              <div className="h-4 w-48 mx-auto bg-silver-300/20 rounded animate-pulse" />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
