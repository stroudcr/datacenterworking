import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db.job.updateMany({ where: { id, status: 'ACTIVE' }, data: { applyClickCount: { increment: 1 } } });
  return result.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: 'Job not found' }, { status: 404 });
}
