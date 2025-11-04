import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { sendManagementLinkEmail, sendPaymentConfirmation } from '@/lib/email';
import Stripe from 'stripe';

// GET endpoint for debugging webhook configuration
export async function GET() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return NextResponse.json({
    status: 'webhook_endpoint_active',
    configured: !!webhookSecret,
    webhookSecretPrefix: webhookSecret ? webhookSecret.substring(0, 10) : 'NOT_SET',
    siteUrl: siteUrl || 'NOT_SET',
    expectedUrl: `${siteUrl}/api/stripe/webhook`,
    timestamp: new Date().toISOString(),
    message: webhookSecret
      ? 'Webhook endpoint is configured. Verify this secret matches your Stripe Dashboard endpoint.'
      : 'ERROR: STRIPE_WEBHOOK_SECRET is not set in environment variables.'
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Webhook error: No stripe-signature header present');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  // Validate webhook secret is configured
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Webhook error: STRIPE_WEBHOOK_SECRET is not configured in environment variables');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  // Log webhook secret prefix for debugging (first 10 chars only)
  console.log('Webhook verification attempt with secret prefix:', webhookSecret.substring(0, 10));

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    console.error('This usually means:');
    console.error('1. The STRIPE_WEBHOOK_SECRET does not match the endpoint configured in Stripe Dashboard');
    console.error('2. You are using a local CLI secret (from "stripe listen") for a production URL');
    console.error('3. The webhook endpoint URL in Stripe Dashboard does not match your actual URL');
    console.error('Current site URL:', process.env.NEXT_PUBLIC_SITE_URL);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log('Webhook signature verified successfully for event:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update payment status and activate job in a transaction
      // This ensures atomicity - both operations succeed or both fail
      const payment = await db.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
          where: { stripeSessionId: session.id },
          data: {
            status: 'completed',
            stripePaymentId: session.payment_intent as string,
          },
          include: {
            job: true,
          },
        });

        // Activate the job now that payment is confirmed
        if (updatedPayment.jobId) {
          await tx.job.update({
            where: { id: updatedPayment.jobId },
            data: { status: 'ACTIVE' },
          });
        }

        return updatedPayment;
      });

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://workindatacenter.com');

      // Send emails (non-blocking - failures won't affect webhook processing)
      console.log('[WEBHOOK] Payment completed, checking for job and email...');
      console.log('[WEBHOOK] Payment has job:', !!payment.job);

      if (payment.job) {
        const job = payment.job;
        const jobUrl = `${baseUrl}/jobs/${job.slug}`;
        const managementUrl = job.managementToken
          ? `${baseUrl}/jobs/manage/${job.id}?token=${job.managementToken}`
          : undefined;

        // Determine recipient email (guest job email or user email)
        const recipientEmail = job.email;

        console.log('[WEBHOOK] Job details:', {
          jobId: job.id,
          jobTitle: job.title,
          recipientEmail: recipientEmail || 'NULL/UNDEFINED',
          hasManagementToken: !!job.managementToken,
          hasUserId: !!job.userId,
        });

        // Send management link email for guest users (no userId)
        if (!job.userId && job.managementToken && recipientEmail) {
          console.log('[WEBHOOK] Sending management link email to:', recipientEmail);
          try {
            const result = await sendManagementLinkEmail({
              to: recipientEmail,
              jobTitle: job.title,
              company: job.company,
              managementUrl: managementUrl!,
            });
            console.log('[WEBHOOK] Management link email result:', result);
          } catch (error) {
            console.error('[WEBHOOK] Management link email error:', error);
          }
        } else {
          console.log('[WEBHOOK] Skipping management link email. Reasons:', {
            hasUserId: !!job.userId,
            hasManagementToken: !!job.managementToken,
            hasRecipientEmail: !!recipientEmail,
          });
        }

        // Send payment confirmation email to all users
        if (recipientEmail) {
          console.log('[WEBHOOK] Sending payment confirmation email to:', recipientEmail);
          try {
            const result = await sendPaymentConfirmation({
              to: recipientEmail,
              jobTitle: job.title,
              company: job.company,
              amount: payment.amount,
              paymentId: payment.stripePaymentId || session.payment_intent as string || session.id,
              isFeatured: job.isFeatured,
              jobUrl,
              managementUrl: !job.userId ? managementUrl : undefined, // Only include for guests
            });
            console.log('[WEBHOOK] Payment confirmation email result:', result);
          } catch (error) {
            console.error('[WEBHOOK] Payment confirmation email error:', error);
          }
        } else {
          console.error('[WEBHOOK] ❌ No recipient email available for payment confirmation. Job ID:', job.id);
        }
      } else {
        console.error('[WEBHOOK] ❌ Payment has no associated job! Payment ID:', payment.id);
      }

      console.log('Payment completed:', session.id);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Mark payment as failed and delete job in a transaction
      // This ensures atomicity - both operations succeed or both fail
      await db.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { stripeSessionId: session.id },
          data: { status: 'failed' },
        });

        // Delete the job since payment failed
        if (payment.jobId) {
          await tx.job.update({
            where: { id: payment.jobId },
            data: { status: 'DELETED' },
          });
        }
      });

      console.log('Payment expired:', session.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
