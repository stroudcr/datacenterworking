'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { UserMenu } from './UserMenu';

interface MobileMenuButtonProps {
  user?: {
    name: string;
    email: string;
    role: 'EMPLOYER' | 'JOB_SEEKER' | 'ADMIN';
  } | null;
}

export function MobileMenuButton({ user }: MobileMenuButtonProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Browse Jobs', active: pathname === '/' },
    { href: '/states', label: 'Browse by State', active: pathname?.startsWith('/states') },
    { href: '/employers', label: 'For Employers', active: pathname?.startsWith('/employers') },
    { href: '/pricing', label: 'Pricing', active: pathname === '/pricing' },
    { href: '/post-job', label: 'Post a Job', active: pathname === '/post-job' },
    { href: '/contact', label: 'Contact', active: pathname === '/contact' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-silver-300 hover:text-white transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-[73px] left-0 right-0 bg-[#0f172a]/98 backdrop-blur-lg border-b border-white/10 md:hidden z-50">
          <nav className="container mx-auto px-4 py-4">
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
                    <Link href="/register?role=EMPLOYER" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full justify-center">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
