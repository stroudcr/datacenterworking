'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Browse Jobs', active: pathname === '/' },
    { href: '/states', label: 'Browse by State', active: pathname?.startsWith('/states') },
    { href: '/pricing', label: 'Pricing', active: pathname === '/pricing' },
    { href: '/post-job', label: 'Post a Job', active: pathname === '/post-job' },
    { href: '/contact', label: 'Contact', active: pathname === '/contact' },
  ];

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.active ? 'text-ice-400' : 'text-silver-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-silver-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium py-3 px-3 rounded-lg transition-colors ${
                    link.active
                      ? 'text-ice-400 bg-ice-500/10'
                      : 'text-silver-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                {user ? (
                  <UserMenu name={user.name} email={user.email} role={user.role} />
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full justify-center">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
