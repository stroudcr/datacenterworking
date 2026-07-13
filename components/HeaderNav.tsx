'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderNav() {
  const pathname = usePathname();

  return (
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
        href="/employers"
        className={`text-sm font-medium transition-colors ${
          pathname?.startsWith('/employers') ? 'text-ice-400' : 'text-silver-300 hover:text-white'
        }`}
      >
        For Employers
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
      <Link
        href="/contact"
        className={`text-sm font-medium transition-colors ${
          pathname === '/contact' ? 'text-ice-400' : 'text-silver-300 hover:text-white'
        }`}
      >
        Contact
      </Link>
    </nav>
  );
}
