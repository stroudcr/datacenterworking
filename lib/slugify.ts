/**
 * Generate an SEO-friendly slug for a job posting
 * Format: {title}-{location}-{shortId}
 * Example: senior-data-center-technician-ashburn-va-cmh6y4apx
 */
export function generateJobSlug(title: string, location: string, id: string): string {
  // Take first 9 characters of the ID for uniqueness
  const shortId = id.substring(0, 9);

  // Combine title and location
  const combined = `${title} ${location}`;

  // Create slug:
  // 1. Convert to lowercase
  // 2. Remove special characters (keep letters, numbers, spaces, hyphens)
  // 3. Replace spaces with hyphens
  // 4. Remove multiple consecutive hyphens
  // 5. Remove leading/trailing hyphens
  const slug = combined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
    .substring(0, 100);            // Limit length to keep URLs reasonable

  // Append short ID for guaranteed uniqueness
  return `${slug}-${shortId}`;
}

/**
 * Extract the job ID from a slug
 * Example: "senior-data-center-technician-ashburn-va-cmh6y4apx" -> "cmh6y4apx..."
 */
export function extractIdFromSlug(slug: string): string {
  // The ID is the last segment after the final hyphen
  const parts = slug.split('-');
  const shortId = parts[parts.length - 1];

  // Return the short ID - we'll need to query the database to find the full ID
  return shortId;
}

/**
 * Check if a string looks like an old-style ID (CUID)
 * CUIDs start with 'c' and are 25 characters long
 */
export function isLegacyId(str: string): boolean {
  return /^c[a-z0-9]{24}$/i.test(str);
}
