import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyCronRequest } from '@/lib/cron';
import { sendJobExpirationReminder } from '@/lib/email';
import { addDays, startOfDay, endOfDay } from 'date-fns';

/**
 * Cron job to send expiration reminder emails
 * Runs daily at 9 AM UTC
 *
 * Sends reminder emails to employers for jobs expiring in exactly 1 day
 */
export async function GET(request: NextRequest) {
  // Verify this request is from Vercel Cron
  if (!verifyCronRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.workindatacenter.com';

  // Calculate tomorrow's date range
  const tomorrow = addDays(new Date(), 1);
  const startOfTomorrow = startOfDay(tomorrow);
  const endOfTomorrow = endOfDay(tomorrow);

  let remindersSent = 0;
  let remindersSkipped = 0;
  const errors: string[] = [];

  try {
    // Find jobs expiring tomorrow
    const jobsExpiringTomorrow = await db.job.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: startOfTomorrow,
          lte: endOfTomorrow,
        },
      },
      include: {
        user: {
          select: {
            email: true,
            notificationPreferences: true,
          },
        },
      },
    });

    console.log(`Found ${jobsExpiringTomorrow.length} jobs expiring tomorrow`);

    // Send reminder email for each job
    for (const job of jobsExpiringTomorrow) {
      // Determine employer email (registered user or guest)
      const employerEmail = job.user?.email || job.email;

      if (!employerEmail) {
        console.warn(`Job ${job.id} has no email address, skipping reminder`);
        remindersSkipped++;
        continue;
      }

      // Check notification preferences for registered users
      const shouldSendEmail = job.userId
        ? job.user?.notificationPreferences?.expirationReminders !== false
        : true; // Always send for guest posters

      if (!shouldSendEmail) {
        console.log(`User opted out of reminders for job ${job.id}, skipping`);
        remindersSkipped++;
        continue;
      }

      // Construct URLs
      const jobUrl = `${baseUrl}/jobs/${job.slug}`;
      const managementUrl = job.managementToken
        ? `${baseUrl}/jobs/manage/${job.id}?token=${job.managementToken}`
        : undefined;

      // Send reminder email
      try {
        const result = await sendJobExpirationReminder({
          to: employerEmail,
          jobTitle: job.title,
          company: job.company,
          viewCount: job.viewCount,
          applicationCount: job.applicationCount,
          jobUrl,
          managementUrl,
        });

        if (result.success) {
          remindersSent++;
          console.log(`Sent expiration reminder for job ${job.id} to ${employerEmail}`);
        } else {
          remindersSkipped++;
          errors.push(`Failed to send to ${employerEmail}: ${result.error}`);
        }
      } catch (error) {
        remindersSkipped++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`Exception sending to ${employerEmail}: ${errorMsg}`);
        console.error(`Error sending reminder for job ${job.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent,
      remindersSkipped,
      totalJobsExpiring: jobsExpiringTomorrow.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in send-expiration-reminders cron:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send expiration reminders',
        remindersSent,
        remindersSkipped,
      },
      { status: 500 }
    );
  }
}
