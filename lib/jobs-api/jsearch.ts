import { JSearchResponse, JSearchJob } from './types';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// Optimized query for data center jobs
const DATA_CENTER_QUERY = '(data center OR datacenter) (technician OR engineer OR manager OR operator OR electrician OR facilities)';

export interface SearchOptions {
  query?: string;
  location?: string;
  page?: number;
  numPages?: number;
  employmentTypes?: string;
  datePosted?: 'all' | 'today' | '3days' | 'week' | 'month';
}

/**
 * Search for jobs using JSearch API via RapidAPI
 */
export async function searchJobs(options: SearchOptions = {}): Promise<JSearchJob[]> {
  if (!RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY environment variable is not set');
  }

  const {
    query = DATA_CENTER_QUERY,
    location = 'United States',
    page = 1,
    numPages = 1,
    employmentTypes,
    datePosted = 'all',
  } = options;

  const params = new URLSearchParams({
    query,
    page: page.toString(),
    num_pages: numPages.toString(),
  });

  if (location) {
    params.append('location', location);
  }

  if (employmentTypes) {
    params.append('employment_types', employmentTypes);
  }

  if (datePosted !== 'all') {
    params.append('date_posted', datePosted);
  }

  const url = `${BASE_URL}/search?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JSearch API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: JSearchResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`JSearch API returned non-OK status: ${data.status}`);
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching jobs from JSearch API:', error);
    throw error;
  }
}

/**
 * Fetch multiple pages of jobs efficiently
 * For free tier: Use all 100 requests to get 100 pages (up to ~1000 jobs)
 */
export async function fetchMultiplePages(
  startPage: number,
  endPage: number,
  options: Omit<SearchOptions, 'page'> = {}
): Promise<JSearchJob[]> {
  const allJobs: JSearchJob[] = [];
  const totalPages = endPage - startPage + 1;

  console.log(`Fetching ${totalPages} pages (${startPage}-${endPage}) from JSearch API...`);

  // Fetch pages sequentially to avoid rate limiting
  for (let page = startPage; page <= endPage; page++) {
    try {
      console.log(`Fetching page ${page}/${endPage}...`);
      const jobs = await searchJobs({ ...options, page, numPages: 1 });
      allJobs.push(...jobs);

      // Small delay to respect rate limits (5 requests/second = 200ms between requests)
      if (page < endPage) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      // Continue with next page instead of failing completely
    }
  }

  console.log(`Successfully fetched ${allJobs.length} jobs from ${totalPages} pages`);
  return allJobs;
}

/**
 * Fetch jobs using the free tier strategy (100 pages = 100 API calls)
 */
export async function fetchJobsFreeTier(): Promise<JSearchJob[]> {
  return fetchMultiplePages(1, 100, {
    query: DATA_CENTER_QUERY,
    location: 'United States',
  });
}
