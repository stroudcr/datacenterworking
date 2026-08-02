import { db } from '@/lib/db';

interface StateJobCountRow {
  state: string;
  count: number;
}

export async function getActiveStateJobCounts(now: Date): Promise<Record<string, number>> {
  const rows = await db.$queryRaw<StateJobCountRow[]>`
    SELECT locations.state AS "state", COUNT(*)::int AS "count"
    FROM "Job" AS job
    CROSS JOIN LATERAL unnest(job."locationStates") AS locations(state)
    WHERE job.status = 'ACTIVE'
      AND job."expiresAt" >= ${now}
      AND job.country = 'US'
    GROUP BY locations.state
  `;

  return Object.fromEntries(rows.map((row) => [row.state, row.count]));
}
