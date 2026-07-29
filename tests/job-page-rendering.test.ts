import assert from 'node:assert/strict';
import test from 'node:test';

test('job detail pages remain dynamic when they read session cookies', async () => {
  const jobPage = await import('../app/jobs/[slug]/page');

  assert.equal(jobPage.dynamic, 'force-dynamic');
  assert.equal('generateStaticParams' in jobPage, false);
});
