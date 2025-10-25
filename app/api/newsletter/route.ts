import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = newsletterSchema.parse(body);

    // Check if email already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email: validatedData.email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await db.newsletter.update({
          where: { email: validatedData.email },
          data: {
            isActive: true,
            categories: validatedData.categories,
          },
        });
        return NextResponse.json({ success: true, message: 'Subscription reactivated' });
      }
    }

    // Create new subscription
    await db.newsletter.create({
      data: {
        email: validatedData.email,
        categories: validatedData.categories,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, message: 'Successfully subscribed' });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Deactivate subscription
    await db.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Unsubscribe failed' },
      { status: 500 }
    );
  }
}
