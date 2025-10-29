'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.replace(`/?${params.toString()}`, { scroll: false });
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
