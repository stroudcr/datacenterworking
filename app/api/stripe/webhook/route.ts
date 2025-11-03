import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { sendManagementLinkEmail, sendPaymentConfirmation } from '@/lib/email';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

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
      if (payment.job) {
        const job = payment.job;
        const jobUrl = `${baseUrl}/jobs/${job.slug}`;
        const managementUrl = job.managementToken
          ? `${baseUrl}/jobs/manage/${job.id}?token=${job.managementToken}`
          : undefined;

        // Determine recipient email (guest job email or user email)
        const recipientEmail = job.email;

        // Send management link email for guest users (no userId)
        if (!job.userId && job.managementToken && recipientEmail) {
          sendManagementLinkEmail({
            to: recipientEmail,
            jobTitle: job.title,
            company: job.company,
            managementUrl: managementUrl!,
          })
            .then(result => {
              console.log('Management link email sent successfully to:', recipientEmail, result);
            })
            .catch(error => {
              console.error('Failed to send management link email to:', recipientEmail, error);
            });
        }

        // Send payment confirmation email to all users
        if (recipientEmail) {
          sendPaymentConfirmation({
            to: recipientEmail,
            jobTitle: job.title,
            company: job.company,
            amount: payment.amount,
            paymentId: payment.stripePaymentId || session.payment_intent as string || session.id,
            isFeatured: job.isFeatured,
            jobUrl,
            managementUrl: !job.userId ? managementUrl : undefined, // Only include for guests
          })
            .then(result => {
              console.log('Payment confirmation email sent successfully to:', recipientEmail, result);
            })
            .catch(error => {
              console.error('Failed to send payment confirmation email to:', recipientEmail, error);
            });
        } else {
          console.warn('No recipient email available for payment confirmation. Job ID:', job.id);
        }
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
