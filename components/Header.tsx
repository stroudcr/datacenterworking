'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: 'EMPLOYER' | 'JOB_SEEKER' | 'ADMIN';
  } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="px-4 py-2 rounded-lg bg-white transition-[background-color,box-shadow] duration-200 group-hover:shadow-lg">
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
              href="/states"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith('/states') ? 'text-ice-400' : 'text-silver-300 hover:text-white'
              }`}
            >
              Browse by State
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
              <UserMenu name={user.name} email={user.email} role={user.role} />
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
