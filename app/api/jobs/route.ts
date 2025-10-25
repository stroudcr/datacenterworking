import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { jobSchema } from '@/lib/validations';
import { createCheckoutSession } from '@/lib/stripe';
import { PRICING } from '@/lib/constants';
import { addDays } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isFeatured, ...jobData } = body;

    // Validate job data
    const validatedData = jobSchema.parse(jobData);

    // Create job (inactive until payment)
    const job = await db.job.create({
      data: {
        ...validatedData,
        userId: session.userId,
        status: 'ACTIVE', // Will be ACTIVE after payment
        isFeatured: isFeatured || false,
        expiresAt: addDays(new Date(), PRICING.LISTING_DURATION),
        featuredUntil: isFeatured
          ? addDays(new Date(), PRICING.FEATURED_DURATION)
          : undefined,
      },
    });

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      userId: session.userId,
      jobId: job.id,
      isFeatured: isFeatured || false,
    });

    // Create payment record
    await db.payment.create({
      data: {
        userId: session.userId,
        jobId: job.id,
        stripeSessionId: checkoutSession.id,
        amount: isFeatured
          ? PRICING.BASE_LISTING + PRICING.FEATURED_UPGRADE
          : PRICING.BASE_LISTING,
        isFeatured: isFeatured || false,
        status: 'pending',
      },
    });

    return NextResponse.json({
      jobId: job.id,
      checkoutUrl: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Job creation error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
