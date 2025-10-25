'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LogOut, User, Settings } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  user?: {
    name: string;
    role: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-ice-500 to-ice-600 group-hover:from-ice-600 group-hover:to-ice-700 transition-all">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DataCenter Jobs</h1>
              <p className="text-xs text-silver-400">Premium Data Center Careers</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-ice-400' : 'text-silver-300 hover:text-white'
              }`}
            >
              Browse Jobs
            </Link>
            <Link
              href="/post-job"
              className={`text-sm font-medium transition-colors ${
                pathname === '/post-job' ? 'text-ice-400' : 'text-silver-300 hover:text-white'
              }`}
            >
              Post a Job
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href={user.role === 'EMPLOYER' ? '/dashboard/employer' : '/dashboard/seeker'}>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <form action="/api/auth/logout" method="POST">
                  <Button variant="outline" size="sm" type="submit">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
