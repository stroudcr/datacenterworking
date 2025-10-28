import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const notificationPreferencesSchema = z.object({
  newApplications: z.boolean().optional(),
  expirationReminders: z.boolean().optional(),
  weeklyAnalytics: z.boolean().optional(),
  paymentConfirmations: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create notification preferences
    let preferences = await db.notificationPreferences.findUnique({
      where: { userId: session.userId },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await db.notificationPreferences.create({
        data: {
          userId: session.userId,
          newApplications: true,
          expirationReminders: true,
          weeklyAnalytics: true,
          paymentConfirmations: true,
        },
      });
    }

    return NextResponse.json({ preferences }, { status: 200 });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to get notification preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = notificationPreferencesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Update or create notification preferences
    const preferences = await db.notificationPreferences.upsert({
      where: { userId: session.userId },
      update: validation.data,
      create: {
        userId: session.userId,
        ...validation.data,
      },
    });

    return NextResponse.json(
      {
        message: 'Notification preferences updated successfully',
        preferences,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update notification preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
