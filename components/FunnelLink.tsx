'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { trackFunnel, type FunnelEvent } from '@/lib/analytics';

export function FunnelView({ event }: { event: FunnelEvent }) {
  useEffect(() => trackFunnel(event), [event]);
  return null;
}

export function FunnelLink({ href, event = 'employer_cta_click', placement, className, children }: {
  href: string; event?: FunnelEvent; placement: string; className?: string; children: React.ReactNode;
}) {
  return <Link href={href} className={className} onClick={() => trackFunnel(event, { placement })}>{children}</Link>;
}
