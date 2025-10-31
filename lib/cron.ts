import { NextRequest } from 'next/server';

/**
 * Verify that a request is coming from Vercel Cron
 * Checks the Authorization header against CRON_SECRET
 *
 * @param request - The Next.js request object
 * @returns true if the request is authorized, false otherwise
 */
export function verifyCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    console.warn('Cron request missing authorization header');
    return false;
  }

  const token = authHeader.replace('Bearer ', '');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('CRON_SECRET not configured in environment variables');
    return false;
  }

  const isValid = token === cronSecret;

  if (!isValid) {
    console.warn('Cron request has invalid token');
  }

  return isValid;
}
