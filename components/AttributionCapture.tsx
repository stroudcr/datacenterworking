'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ATTRIBUTION_KEY, ATTRIBUTION_MAX_AGE_MS, type Attribution, type Touchpoint } from '@/lib/attribution';

export function AttributionCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const now = Date.now();
    const params = searchParams;
    let referrer: string | undefined;
    try {
      if (document.referrer) {
        const url = new URL(document.referrer);
        if (url.origin !== window.location.origin) referrer = `${url.origin}${url.pathname}`.slice(0, 200);
      }
    } catch {}
    const touch: Touchpoint = {
      capturedAt: new Date(now).toISOString(), landingPath: pathname.slice(0, 200), referrer,
      utmSource: params.get('utm_source')?.slice(0, 200), utmMedium: params.get('utm_medium')?.slice(0, 200),
      utmCampaign: params.get('utm_campaign')?.slice(0, 200), utmTerm: params.get('utm_term')?.slice(0, 200),
      utmContent: params.get('utm_content')?.slice(0, 200),
    };
    try {
      const previous = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || 'null') as Attribution | null;
      const firstTouch = previous && previous.expiresAt > now ? previous.firstTouch : touch;
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({ firstTouch, lastTouch: touch, expiresAt: now + ATTRIBUTION_MAX_AGE_MS }));
    } catch {}
  }, [pathname, searchParams]);
  return null;
}
