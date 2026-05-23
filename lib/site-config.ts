/**
 * Central site configuration.
 * Keep the public canonical host stable even if an environment variable is set
 * to the apex domain; the apex redirects to www in production.
 */

function normalizeSiteUrl(url: string) {
  const withoutTrailingSlash = url.replace(/\/+$/, '');

  try {
    const parsed = new URL(withoutTrailingSlash);
    parsed.protocol = 'https:';

    if (parsed.hostname.toLowerCase() === 'workindatacenter.com') {
      parsed.hostname = 'www.workindatacenter.com';
    }

    return parsed.origin;
  } catch {
    return withoutTrailingSlash.replace(
      /^https?:\/\/workindatacenter\.com$/i,
      'https://www.workindatacenter.com'
    );
  }
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.workindatacenter.com'
);

export const SITE_NAME = 'Work In Data Center';

export const SITE_DESCRIPTION = 'Find top data center jobs in operations, engineering, IT, security, and more. Post jobs and connect with qualified professionals in the data center industry.';

export const SITE_EMAIL = 'info@workindatacenter.com';

export function absoluteUrl(path = '') {
  if (!path || path === '/') {
    return SITE_URL;
  }

  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
