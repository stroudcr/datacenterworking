export const ATTRIBUTION_KEY = 'widc:attribution:v1';
export const ATTRIBUTION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

export type Touchpoint = {
  capturedAt: string;
  landingPath: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export type Attribution = { firstTouch: Touchpoint; lastTouch: Touchpoint; expiresAt: number };

const clean = (value: unknown) =>
  typeof value === 'string' ? value.trim().slice(0, 200) || undefined : undefined;

export function sanitizeTouchpoint(value: unknown): Touchpoint | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Record<string, unknown>;
  const landingPath = clean(input.landingPath);
  const capturedAt = clean(input.capturedAt);
  if (!landingPath || !landingPath.startsWith('/') || !capturedAt || Number.isNaN(Date.parse(capturedAt))) return null;
  return {
    capturedAt,
    landingPath,
    referrer: clean(input.referrer),
    utmSource: clean(input.utmSource),
    utmMedium: clean(input.utmMedium),
    utmCampaign: clean(input.utmCampaign),
    utmTerm: clean(input.utmTerm),
    utmContent: clean(input.utmContent),
  };
}

export function sanitizeAttribution(value: unknown) {
  if (!value || typeof value !== 'object') return { firstTouch: null, lastTouch: null };
  const input = value as Record<string, unknown>;
  return {
    firstTouch: sanitizeTouchpoint(input.firstTouch),
    lastTouch: sanitizeTouchpoint(input.lastTouch),
  };
}
