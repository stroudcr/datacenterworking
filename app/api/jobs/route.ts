import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { jobSchema } from '@/lib/validations';
import { createCheckoutSession } from '@/lib/stripe';
import { PRICING } from '@/lib/constants';
import { addDays } from 'date-fns';
import { generateJobSlug } from '@/lib/slugify';
import { generateManagementToken } from '@/lib/tokens';

export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in (optional for guest posting)
    const session = await getSession();

    const body = await request.json();
    const { isFeatured, ...jobData } = body;

    // Validate job data
    const validatedData = jobSchema.parse(jobData);

    // Generate management token for guest users
    const managementToken = !session ? generateManagementToken() : undefined;

    // Create job with temporary slug (will be updated with real ID-based slug)
    const job = await db.job.create({
      data: {
        // Required fields
        title: validatedData.title,
        company: validatedData.company,
        location: validatedData.location,
        type: validatedData.type,
        category: validatedData.category,
        description: validatedData.description,
        requirements: validatedData.requirements,
        tags: validatedData.tags,

        // Optional fields
        companyLogo: validatedData.companyLogo || undefined,
        shift: validatedData.shift || undefined,
        clearance: validatedData.clearance || undefined,
        certifications: validatedData.certifications || undefined,
        salaryMin: validatedData.salaryMin,
        salaryMax: validatedData.salaryMax,
        hourlyRateMin: validatedData.hourlyRateMin,
        hourlyRateMax: validatedData.hourlyRateMax,
        applyUrl: validatedData.applyUrl || undefined,
        applyEmail: validatedData.applyEmail || undefined,
        enableInternalApplications: validatedData.enableInternalApplications || false,

        // Guest posting fields
        email: validatedData.email,
        managementToken,

        // System fields
        slug: 'temp', // Temporary, will be updated immediately
        userId: session?.userId || null,
        status: 'PENDING', // Will be set to ACTIVE after payment confirmation
        isFeatured: isFeatured || false,
        expiresAt: addDays(new Date(), PRICING.LISTING_DURATION),
        featuredUntil: isFeatured
          ? addDays(new Date(), PRICING.FEATURED_DURATION)
          : undefined,
      },
    });

    // Generate and update slug with the real ID
    const slug = generateJobSlug(validatedData.title, validatedData.location, job.id);
    await db.job.update({
      where: { id: job.id },
      data: { slug },
    });

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      userId: session?.userId || null,
      jobId: job.id,
      isFeatured: isFeatured || false,
      email: validatedData.email,
    });

    // Create payment record
    await db.payment.create({
      data: {
        userId: session?.userId || null,
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
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create job', details: error.message },
      { status: 500 }
    );
  }
}
