import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/auth';
import { Button } from './Button';
import { UserMenu } from './UserMenu';
import { HeaderNav } from './HeaderNav';

export async function HeaderServer() {
  const session = await getSession();

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

          {/* Navigation - Client Component for active link highlighting */}
          <HeaderNav />

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {session ? (
              <UserMenu
                name={session.name || session.email.split('@')[0]}
                email={session.email}
                role={session.role}
              />
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
