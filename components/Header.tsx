'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, User, Settings } from 'lucide-react';
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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="px-4 py-2 rounded-lg bg-white/95 backdrop-blur-sm transition-all group-hover:bg-white">
              <Image
                src="/images/NavLogo.png"
                alt="Work In Data Center"
                width={180}
                height={60}
                className="h-10 w-auto"
                priority
              />
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
              href="/pricing"
              className={`text-sm font-medium transition-colors ${
                pathname === '/pricing' ? 'text-ice-400' : 'text-silver-300 hover:text-white'
              }`}
            >
              Pricing
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
