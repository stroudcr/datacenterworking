'use client';

import { track } from '@vercel/analytics/react';

export type FunnelEvent =
  | 'employer_landing_view' | 'employer_cta_click' | 'pricing_view'
  | 'post_job_start' | 'post_job_validation_error' | 'featured_selected'
  | 'checkout_started' | 'checkout_cancelled' | 'employer_lead_submitted' | 'purchase';

export function trackFunnel(event: FunnelEvent, properties: Record<string, string | number | boolean> = {}) {
  track(event, properties);
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, properties);
  }
}

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}
