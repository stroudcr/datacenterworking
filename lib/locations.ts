/**
 * Location utilities for parsing and formatting job locations
 * Supports US states with future expansion for countries
 */

export interface ParsedLocation {
  city: string | null;
  state: string | null;
  states: string[];
  country: string;
  isRemote: boolean;
}

/**
 * US States mapping (full name to 2-letter abbreviation)
 */
export const US_STATES: Record<string, string> = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  'District of Columbia': 'DC',
};

/**
 * Reverse mapping (abbreviation to full name)
 */
export const STATE_ABBREVIATIONS: Record<string, string> = Object.entries(US_STATES).reduce(
  (acc, [fullName, abbr]) => {
    acc[abbr] = fullName;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * All state abbreviations as array
 */
export const STATE_CODES = Object.values(US_STATES);

/**
 * All state full names as array (sorted alphabetically)
 */
export const STATE_NAMES = Object.keys(US_STATES).sort();

const STATE_ENTRIES = Object.entries(US_STATES);
const LOCATION_SEPARATOR = /\s*(?:\/|\||;)\s*|\n+/;

/**
 * Keywords that indicate a remote job
 */
const REMOTE_KEYWORDS = [
  'remote',
  'work from home',
  'wfh',
  'anywhere',
  'distributed',
  'virtual',
  'telecommute',
];

/**
 * Keywords that indicate multi-location jobs
 */
const MULTI_LOCATION_KEYWORDS = [
  'nationwide',
  'various locations',
  'multiple locations',
  'usa',
  'united states',
  'all states',
];

/**
 * Parse a location string to extract city, state, and country
 *
 * Expected formats:
 * - "City, ST" (e.g., "Ashburn, VA")
 * - "City, State" (e.g., "Ashburn, Virginia")
 * - "Remote"
 * - "Nationwide"
 *
 * @param location - Raw location string
 * @returns Parsed location object with city, state, and country
 */
export function parseLocation(location: string): ParsedLocation {
  if (!location || typeof location !== 'string') {
    return { city: null, state: null, states: [], country: 'US', isRemote: false };
  }

  const trimmed = location.trim();
  const lowerTrimmed = trimmed.toLowerCase();
  const isRemote = REMOTE_KEYWORDS.some(keyword => lowerTrimmed.includes(keyword));

  if (isRemote) {
    return { city: null, state: null, states: [], country: 'US', isRemote: true };
  }

  if (MULTI_LOCATION_KEYWORDS.some(keyword => lowerTrimmed.includes(keyword))) {
    return { city: null, state: null, states: [], country: 'US', isRemote: false };
  }

  const locationParts = trimmed.split(LOCATION_SEPARATOR).map(part => part.trim()).filter(Boolean);
  const states: string[] = [];

  for (const locationPart of locationParts) {
    const commaParts = locationPart.split(',').map(part => part.trim()).filter(Boolean);
    const candidates = commaParts.length > 1 ? commaParts.slice(1) : commaParts;

    for (const candidate of candidates) {
      const stateCode = getStateAbbreviation(candidate);
      if (stateCode && !states.includes(stateCode)) {
        states.push(stateCode);
        break;
      }
    }
  }

  const firstLocationParts = locationParts[0]?.split(',').map(part => part.trim()) || [];
  const city = firstLocationParts.length > 1
    ? firstLocationParts[0] || null
    : states.length > 0
      ? null
      : firstLocationParts[0] || null;

  return {
    city,
    state: states[0] || null,
    states,
    country: 'US',
    isRemote: false,
  };
}

/**
 * Get full state name from abbreviation
 *
 * @param abbreviation - 2-letter state code (e.g., "VA")
 * @returns Full state name (e.g., "Virginia") or null if not found
 */
export function getStateFullName(abbreviation: string | null): string | null {
  if (!abbreviation) return null;
  return STATE_ABBREVIATIONS[abbreviation.toUpperCase()] || null;
}

/**
 * Get state abbreviation from full name
 *
 * @param fullName - Full state name (e.g., "Virginia")
 * @returns 2-letter state code (e.g., "VA") or null if not found
 */
export function getStateAbbreviation(fullName: string | null): string | null {
  if (!fullName) return null;
  const normalized = fullName.trim();
  const upper = normalized.toUpperCase();

  if (STATE_CODES.includes(upper)) return upper;

  const matchedState = STATE_ENTRIES.find(
    ([stateName]) => stateName.toLowerCase() === normalized.toLowerCase()
  );
  return matchedState?.[1] || null;
}

/**
 * Convert state name to URL-friendly slug
 *
 * @param stateName - Full state name (e.g., "Virginia", "New York")
 * @returns URL slug (e.g., "virginia", "new-york")
 */
export function getStateSlug(stateName: string): string {
  return stateName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Convert slug back to state name
 *
 * @param slug - URL slug (e.g., "virginia", "new-york")
 * @returns Full state name (e.g., "Virginia", "New York") or null if not found
 */
export function getStateFromSlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ');
  const matched = STATE_NAMES.find(
    name => name.toLowerCase() === normalized.toLowerCase()
  );
  return matched || null;
}

/**
 * Format location for display
 *
 * @param city - City name
 * @param state - State abbreviation
 * @param country - Country code
 * @returns Formatted location string
 */
export function formatLocation(
  city: string | null,
  state: string | null,
  country: string = 'US'
): string {
  if (!city && !state) {
    return 'Remote';
  }

  if (city && state) {
    return `${city}, ${state}`;
  }

  return city || state || 'Unknown';
}

/**
 * Check if a location string indicates a remote job
 *
 * @param location - Raw location string
 * @returns True if the location is remote
 */
export function isRemoteLocation(location: string): boolean {
  if (!location) return false;
  const lower = location.toLowerCase();
  return REMOTE_KEYWORDS.some(keyword => lower.includes(keyword));
}

/**
 * Get all states with their slugs
 * Useful for generating static params
 *
 * @returns Array of objects with state name and slug
 */
export function getAllStates(): Array<{ name: string; slug: string; abbreviation: string }> {
  return STATE_NAMES.map(name => ({
    name,
    slug: getStateSlug(name),
    abbreviation: US_STATES[name],
  }));
}
