import Link from 'next/link';
import Image from 'next/image';

export function HeaderSkeleton() {
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

          {/* Navigation placeholder */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="h-5 w-20 bg-silver-300/20 rounded animate-pulse" />
            <div className="h-5 w-16 bg-silver-300/20 rounded animate-pulse" />
            <div className="h-5 w-24 bg-silver-300/20 rounded animate-pulse" />
          </nav>

          {/* Auth section placeholder */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-20 bg-ice-blue/10 rounded-lg animate-pulse" />
            <div className="h-9 w-24 bg-ice-blue/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
