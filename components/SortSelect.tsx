'use client';

import { useSearchParams } from 'next/navigation';

export function SortSelect({ basePath }: { basePath?: string }) {
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  const handleChange = (value: string) => {
    // Read the live URL so this update preserves all current filters and search.
    const params = new URLSearchParams(window.location.search);
    params.set('sort', value);
    const pathname = basePath ?? window.location.pathname;
    window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      className="glass rounded-lg px-4 py-2 text-white text-sm cursor-pointer"
    >
      <option value="latest">Latest</option>
      <option value="applications">Most Applied</option>
    </select>
  );
}
