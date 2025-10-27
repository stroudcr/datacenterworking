'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function SearchBar({ initialSearch = '' }: { initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) {
      params.set('search', search);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <GlassCard className="p-2">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="w-5 h-5 text-silver-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-silver-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 sm:px-6 py-3 rounded-lg bg-gradient-to-r from-ice-500 to-ice-600 text-white font-medium hover:from-ice-600 hover:to-ice-700 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </GlassCard>
    </form>
  );
}
