'use client';

import { useEffect } from 'react';
import { trackFunnel } from '@/lib/analytics';

export function ClearPostJobDraft({ amount, featured }: { amount: number; featured: boolean }) {
  useEffect(() => {
    localStorage.removeItem('widc:post-job-draft:v1');
    trackFunnel('purchase', { amount, plan: featured ? 'featured' : 'standard' });
  }, [amount, featured]);
  return null;
}
