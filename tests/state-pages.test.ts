import assert from 'node:assert/strict';
import test from 'node:test';
import { getAllStates } from '../lib/locations';
import { mapJSearchJobToSchema } from '../lib/jobs-api/mapper';
import { buildStateFaqs, getStateProfile, getStateSourceLinks } from '../lib/state-profiles';
import type { ScoredJob } from '../lib/jobs-api/types';

function makeJob(overrides: Partial<ScoredJob> = {}): ScoredJob {
  return {
    job_id: 'state-page-location-test',
    employer_name: 'Test Employer',
    job_publisher: 'Test Publisher',
    job_employment_type: 'FULLTIME',
    job_title: 'Data Center Technician',
    job_apply_link: 'https://example.com/apply',
    job_apply_is_direct: true,
    job_apply_quality_score: 1,
    job_description: 'Maintain critical data center infrastructure and safety procedures.',
    job_is_remote: false,
    job_posted_at_timestamp: 0,
    job_posted_at_datetime_utc: '2026-08-01T00:00:00.000Z',
    job_city: 'Richmond',
    job_state: 'Virginia',
    job_country: 'United States',
    job_google_link: 'https://example.com/job',
    relevanceScore: 100,
    ...overrides,
  };
}

test('every state route has a complete state-specific career profile', () => {
  const states = getAllStates();
  assert.equal(states.length, 51);

  for (const state of states) {
    const profile = getStateProfile(state.abbreviation);
    assert.ok(profile, `${state.name} is missing a profile`);
    assert.equal(profile.name, state.name);
    assert.ok(profile.energy.length > 80);
    assert.ok(profile.climate.length > 80);
    assert.ok(profile.workforce.length > 80);
    assert.equal(getStateSourceLinks(profile).length, 4);
    assert.equal(buildStateFaqs(profile).length, 4);
  }
});

test('imported jobs retain parsed state fields for state page discovery', () => {
  const mapped = mapJSearchJobToSchema(makeJob());

  assert.equal(mapped.location, 'Richmond, Virginia');
  assert.equal(mapped.city, 'Richmond');
  assert.equal(mapped.state, 'VA');
  assert.equal(mapped.country, 'US');
});

test('remote imports are not assigned to a state page', () => {
  const mapped = mapJSearchJobToSchema(makeJob({ job_is_remote: true }));

  assert.equal(mapped.location, 'Remote');
  assert.equal(mapped.city, null);
  assert.equal(mapped.state, null);
});
