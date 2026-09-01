import { NextRequest, NextResponse } from 'next/server';
import {
  sendWelcomeEmail,
  sendManagementLinkEmail,
  sendPaymentConfirmation,
  sendApplicationNotification,
  sendContactFormEmail,
  sendJobExpirationReminder,
} from '@/lib/email';

/**
 * Test Email API Endpoint
 *
 * Purpose: Test email delivery and troubleshoot email configuration
 *
 * Usage:
 * POST /api/test-email
 * Body: {
 *   "type": "welcome" | "management" | "payment" | "application" | "contact" | "expiration",
 *   "recipient": "test@example.com"
 * }
 *
 * Security: Add authentication in production or remove this endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, recipient } = body;

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'welcome-employer':
        result = await sendWelcomeEmail({
          to: recipient,
          name: 'Test Employer',
          role: 'EMPLOYER',
          company: 'Test Data Center Inc.',
        });
        break;

      case 'welcome-seeker':
        result = await sendWelcomeEmail({
          to: recipient,
          name: 'Test Job Seeker',
          role: 'JOB_SEEKER',
        });
        break;

      case 'management':
        result = await sendManagementLinkEmail({
          to: recipient,
          jobTitle: 'Test Data Center Technician',
          company: 'Test Data Center Inc.',
          managementUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/manage/test-job-id?token=test-token`,
        });
        break;

      case 'payment':
        result = await sendPaymentConfirmation({
          to: recipient,
          jobTitle: 'Test Data Center Technician',
          company: 'Test Data Center Inc.',
          amount: 249,
          paymentId: 'test_payment_123',
          isFeatured: false,
          jobUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/test-job-slug`,
          managementUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/manage/test-job-id?token=test-token`,
        });
        break;

      case 'payment-featured':
        result = await sendPaymentConfirmation({
          to: recipient,
          jobTitle: 'Test Data Center Manager (Featured)',
          company: 'Test Data Center Inc.',
          amount: 398,
          paymentId: 'test_payment_456',
          isFeatured: true,
          jobUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/test-featured-job-slug`,
          managementUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/manage/test-job-id?token=test-token`,
        });
        break;

      case 'application':
        result = await sendApplicationNotification({
          to: recipient,
          jobTitle: 'Test Data Center Technician',
          company: 'Test Data Center Inc.',
          applicantName: 'John Doe',
          applicantEmail: 'john.doe@example.com',
          coverLetter: 'This is a test cover letter for the application notification email.',
          applicantsPageUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/employer/jobs/test-job-id/applicants`,
        });
        break;

      case 'contact':
        result = await sendContactFormEmail({
          name: 'Test User',
          email: recipient,
          inquiryType: 'General Inquiry',
          subject: 'Test Contact Form Submission',
          message: 'This is a test message from the contact form email testing endpoint.',
        });
        break;

      case 'expiration':
        result = await sendJobExpirationReminder({
          to: recipient,
          jobTitle: 'Test Data Center Technician',
          company: 'Test Data Center Inc.',
          applicationCount: 8,
          jobUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/test-job-slug`,
          managementUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/manage/test-job-id?token=test-token`,
        });
        break;

      default:
        return NextResponse.json(
          {
            error: 'Invalid email type',
            validTypes: [
              'welcome-employer',
              'welcome-seeker',
              'management',
              'payment',
              'payment-featured',
              'application',
              'contact',
              'expiration',
            ],
          },
          { status: 400 }
        );
    }

    // Check if email was sent successfully
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${recipient}`,
        emailId: result.data?.id,
        type,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email failed to send',
        error: result.error,
        type,
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[TEST EMAIL API ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to show usage instructions
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/test-email',
    method: 'POST',
    description: 'Test email delivery and troubleshoot email configuration',
    usage: {
      body: {
        type: 'welcome-employer | welcome-seeker | management | payment | payment-featured | application | contact | expiration',
        recipient: 'test@example.com',
      },
    },
    examples: [
      {
        description: 'Test employer welcome email',
        request: {
          type: 'welcome-employer',
          recipient: 'employer@example.com',
        },
      },
      {
        description: 'Test job seeker welcome email',
        request: {
          type: 'welcome-seeker',
          recipient: 'seeker@example.com',
        },
      },
      {
        description: 'Test payment confirmation',
        request: {
          type: 'payment',
          recipient: 'test@example.com',
        },
      },
      {
        description: 'Test featured payment confirmation',
        request: {
          type: 'payment-featured',
          recipient: 'test@example.com',
        },
      },
      {
        description: 'Test application notification',
        request: {
          type: 'application',
          recipient: 'employer@example.com',
        },
      },
      {
        description: 'Test contact form email',
        request: {
          type: 'contact',
          recipient: 'admin@example.com',
        },
      },
      {
        description: 'Test expiration reminder',
        request: {
          type: 'expiration',
          recipient: 'employer@example.com',
        },
      },
    ],
    environment: {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✓ Configured' : '✗ Missing',
      EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@workindatacenter.com',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '✗ Not set',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    security: {
      warning: 'This endpoint should be protected with authentication in production or removed entirely',
      recommendation: 'Add middleware to restrict access or delete this file before deploying to production',
    },
  });
}
