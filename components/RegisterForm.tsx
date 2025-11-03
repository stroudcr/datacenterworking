'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { GlassCard } from '@/components/GlassCard';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { UserPlus, Briefcase, User } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get email and role from URL params if provided
  const emailParam = searchParams.get('email');
  const roleParam = searchParams.get('role') as 'EMPLOYER' | 'JOB_SEEKER' | null;

  const [selectedRole, setSelectedRole] = useState<'EMPLOYER' | 'JOB_SEEKER'>(
    roleParam || 'JOB_SEEKER'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: roleParam || 'JOB_SEEKER',
      email: emailParam || '',
    },
  });

  // Pre-fill email if provided in URL
  useEffect(() => {
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data: RegisterInput) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Redirect based on role
      if (result.user.role === 'EMPLOYER') {
        router.push('/dashboard/employer');
      } else {
        router.push('/dashboard/seeker');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: 'EMPLOYER' | 'JOB_SEEKER') => {
    setSelectedRole(role);
    setValue('role', role);
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-silver-200">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('JOB_SEEKER')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'JOB_SEEKER'
                      ? 'border-ice-500 bg-ice-500/10'
                      : 'border-white/10 glass hover:border-white/20'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2 text-ice-400" />
                  <div className="text-sm font-medium text-white">Job Seeker</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('EMPLOYER')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'EMPLOYER'
                      ? 'border-ice-500 bg-ice-500/10'
                      : 'border-white/10 glass hover:border-white/20'
                  }`}
                >
                  <Briefcase className="w-6 h-6 mx-auto mb-2 text-ice-400" />
                  <div className="text-sm font-medium text-white">Employer</div>
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              fullWidth
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              fullWidth
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              fullWidth
              error={errors.password?.message}
              {...register('password')}
            />

            {selectedRole === 'EMPLOYER' && (
              <Input
                label="Company Name"
                type="text"
                placeholder="Acme Corp"
                fullWidth
                error={errors.company?.message}
                {...register('company')}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm text-silver-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-ice-400 hover:text-ice-300 font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
