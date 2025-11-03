'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface UserMenuProps {
  name?: string;
  email: string;
  role: 'EMPLOYER' | 'JOB_SEEKER' | 'ADMIN';
}

export function UserMenu({ name, email, role }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  // Use name if available, otherwise fall back to email prefix
  const displayName = name || email.split('@')[0];

  // Generate initials from name
  const getInitials = (name: string): string => {
    if (!name || !name.trim()) {
      // Fallback to email if name is empty
      return email.substring(0, 2).toUpperCase();
    }
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format role for display
  const formatRole = (role: string): string => {
    return role.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  const dashboardLink = role === 'ADMIN'
    ? '/admin'
    : role === 'EMPLOYER'
    ? '/dashboard/employer'
    : '/dashboard/seeker';

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ice-blue/10 border border-ice-blue/20 hover:bg-ice-blue/20 transition-all duration-200 backdrop-blur-sm"
      >
        {/* Initials Circle */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ice-blue to-silver-400 flex items-center justify-center text-navy-900 font-semibold text-sm">
          {getInitials(displayName)}
        </div>

        {/* Name (hidden on mobile) */}
        <span className="hidden sm:block text-white font-medium text-sm">
          {displayName}
        </span>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-silver-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg bg-navy-800/95 border border-ice-blue/20 shadow-xl backdrop-blur-md overflow-hidden z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-ice-blue/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ice-blue to-silver-400 flex items-center justify-center text-navy-900 font-semibold">
                {getInitials(displayName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{displayName}</p>
                <p className="text-silver-400 text-xs truncate">{email}</p>
              </div>
            </div>
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-ice-blue/20 border border-ice-blue/30">
              <span className="text-ice-blue text-xs font-medium">{formatRole(role)}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href={dashboardLink}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-silver-300 hover:bg-ice-blue/10 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-silver-300 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isPending ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
