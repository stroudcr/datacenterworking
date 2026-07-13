export type PublicRole = 'EMPLOYER' | 'JOB_SEEKER';

export function normalizePublicRole(value: string | null | undefined): PublicRole {
  return value?.trim().toUpperCase().replaceAll('-', '_') === 'EMPLOYER' ? 'EMPLOYER' : 'JOB_SEEKER';
}
