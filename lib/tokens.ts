import crypto from 'crypto';

/**
 * Generates a secure random token for job management
 * @returns A URL-safe base64 encoded string
 */
export function generateManagementToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Verifies if a token matches the stored token
 * @param token The token to verify
 * @param storedToken The token stored in the database
 * @returns True if tokens match
 */
export function verifyManagementToken(token: string, storedToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  );
}
