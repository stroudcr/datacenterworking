import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
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

      // Update payment status
      const payment = await db.payment.update({
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
      if (payment.jobId) {
        await db.job.update({
          where: { id: payment.jobId },
          data: { status: 'ACTIVE' },
        });
      }

      // TODO: Send management link email for guest users
      // If the job has no userId (guest posting), send an email with the management link
      if (payment.job && !payment.job.userId && payment.job.managementToken) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://datacenterworking.vercel.app');
        const managementUrl = `${baseUrl}/jobs/manage/${payment.job.id}?token=${payment.job.managementToken}`;

        // TODO: Implement email sending service (Resend, SendGrid, etc.)
        // await sendEmail({
        //   to: payment.job.email,
        //   subject: 'Your Job Posting is Live - Management Link',
        //   html: `
        //     <h1>Your job posting is now live!</h1>
        //     <p>Manage your job posting at: ${managementUrl}</p>
        //   `
        // });

        console.log('Management link for guest user:', managementUrl);
      }

      // Job is already ACTIVE, no need to update
      console.log('Payment completed:', session.id);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Mark payment as failed
      await db.payment.update({
        where: { stripeSessionId: session.id },
        data: { status: 'failed' },
      });

      // Optionally delete the job or mark it as expired
      const payment = await db.payment.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (payment) {
        await db.job.update({
          where: { id: payment.jobId },
          data: { status: 'DELETED' },
        });
      }

      console.log('Payment expired:', session.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
