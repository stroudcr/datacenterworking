import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeAttribution } from '../lib/attribution';
import { normalizePublicRole } from '../lib/roles';
import { POST_JOB_DRAFT_MAX_AGE, readValidDraft, resolveFeaturedPlan } from '../lib/post-job-draft';
import { jobSchema } from '../lib/validations';

test('normalizes employer role and safely defaults invalid values', () => {
  assert.equal(normalizePublicRole('employer'), 'EMPLOYER');
  assert.equal(normalizePublicRole('not-a-role'), 'JOB_SEEKER');
});

test('draft expires after seven days and query plan has precedence', () => {
  const now = Date.now();
  assert.ok(readValidDraft(JSON.stringify({ version: 1, savedAt: now - 1000 }), now));
  assert.equal(readValidDraft(JSON.stringify({ version: 1, savedAt: now - POST_JOB_DRAFT_MAX_AGE - 1 }), now), null);
  assert.equal(resolveFeaturedPlan('standard', true), false);
  assert.equal(resolveFeaturedPlan('featured', false), true);
});

test('attribution rejects unsafe shapes and truncates values', () => {
  assert.equal(sanitizeAttribution({ firstTouch: { landingPath: 'https://evil.test', capturedAt: new Date().toISOString() } }).firstTouch, null);
  const valid = sanitizeAttribution({ lastTouch: { landingPath: '/employers', capturedAt: new Date().toISOString(), utmCampaign: 'x'.repeat(300) } });
  assert.equal(valid.lastTouch?.utmCampaign?.length, 200);
});

test('optional compensation fields accept empty browser number values', () => {
  const result = jobSchema.safeParse({
    email: 'qa@example.com', title: 'Data Center Technician', company: 'QA Company', location: 'Ashburn, VA',
    type: 'Full-time', category: 'Data Center Operations & Production', description: 'A'.repeat(60),
    requirements: 'B'.repeat(30), tags: ['QA'], salaryMin: Number.NaN, salaryMax: Number.NaN,
    hourlyRateMin: Number.NaN, hourlyRateMax: Number.NaN,
  });
  assert.equal(result.success, true);
});
