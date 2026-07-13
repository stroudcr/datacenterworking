export const POST_JOB_DRAFT_KEY = 'widc:post-job-draft:v1';
export const POST_JOB_DRAFT_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export function readValidDraft(raw: string | null, now = Date.now()) {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    return value?.version === 1 && typeof value.savedAt === 'number' && now - value.savedAt <= POST_JOB_DRAFT_MAX_AGE ? value : null;
  } catch { return null; }
}

export function resolveFeaturedPlan(plan: string | null, draftFeatured = false) {
  if (plan === 'featured') return true;
  if (plan === 'standard') return false;
  return draftFeatured;
}
