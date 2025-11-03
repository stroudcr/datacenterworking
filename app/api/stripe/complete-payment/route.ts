import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { sendManagementLinkEmail, sendPaymentConfirmation } from '@/lib/email';

// Manual payment completion endpoint for testing/debugging
// This bypasses the webhook and directly processes a payment
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    console.log('Manual payment completion requested for session:', sessionId);

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession) {
      return NextResponse.json(
        { error: 'Checkout session not found in Stripe' },
        { status: 404 }
      );
    }

    console.log('Retrieved checkout session:', {
      id: checkoutSession.id,
      payment_status: checkoutSession.payment_status,
      status: checkoutSession.status
    });

    // Check if payment was actually completed
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json(
        {
          error: 'Payment not completed',
          payment_status: checkoutSession.payment_status,
          session_status: checkoutSession.status
        },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await db.payment.findUnique({
      where: { stripeSessionId: sessionId },
      include: { job: true }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found in database' },
        { status: 404 }
      );
    }

    console.log('Found payment record:', {
      id: payment.id,
      status: payment.status,
      jobId: payment.jobId
    });

    // Check if already processed
    if (payment.status === 'completed' && payment.job?.status === 'ACTIVE') {
      return NextResponse.json({
        message: 'Payment already processed',
        payment: {
          id: payment.id,
          status: payment.status
        },
        job: {
          id: payment.job.id,
          status: payment.job.status,
          slug: payment.job.slug
        }
      });
    }

    // Process the payment (same logic as webhook)
    const updatedPayment = await db.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { stripeSessionId: sessionId },
        data: {
          status: 'completed',
          stripePaymentId: checkoutSession.payment_intent as string,
        },
        include: {
          job: true,
        },
      });

      // Activate the job
      if (updated.jobId) {
        await tx.job.update({
          where: { id: updated.jobId },
          data: { status: 'ACTIVE' },
        });
      }

      return updated;
    });

    console.log('Payment processed successfully');

    // Send emails (non-blocking)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://workindatacenter.com');

    if (updatedPayment.job) {
      const job = updatedPayment.job;
      const jobUrl = `${baseUrl}/jobs/${job.slug}`;
      const managementUrl = job.managementToken
        ? `${baseUrl}/jobs/manage/${job.id}?token=${job.managementToken}`
        : undefined;

      const recipientEmail = job.email;

      // Send management link email for guest users
      if (!job.userId && job.managementToken && recipientEmail) {
        sendManagementLinkEmail({
          to: recipientEmail,
          jobTitle: job.title,
          company: job.company,
          managementUrl: managementUrl!,
        })
          .then(result => {
            console.log('Management link email sent:', result);
          })
          .catch(error => {
            console.error('Failed to send management link email:', error);
          });
      }

      // Send payment confirmation email
      if (recipientEmail) {
        sendPaymentConfirmation({
          to: recipientEmail,
          jobTitle: job.title,
          company: job.company,
          amount: updatedPayment.amount,
          paymentId: updatedPayment.stripePaymentId || checkoutSession.payment_intent as string || sessionId,
          isFeatured: job.isFeatured,
          jobUrl,
          managementUrl: !job.userId ? managementUrl : undefined,
        })
          .then(result => {
            console.log('Payment confirmation email sent:', result);
          })
          .catch(error => {
            console.error('Failed to send payment confirmation email:', error);
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment completed successfully',
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        amount: updatedPayment.amount
      },
      job: updatedPayment.job ? {
        id: updatedPayment.job.id,
        slug: updatedPayment.job.slug,
        status: updatedPayment.job.status,
        title: updatedPayment.job.title
      } : null
    });

  } catch (error: any) {
    console.error('Manual payment completion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete payment',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check pending payments
export async function GET() {
  try {
    const pendingPayments = await db.payment.findMany({
      where: {
        status: 'pending'
      },
      include: {
        job: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      pendingCount: pendingPayments.length,
      payments: pendingPayments.map(p => ({
        id: p.id,
        sessionId: p.stripeSessionId,
        amount: p.amount,
        status: p.status,
        createdAt: p.createdAt,
        job: p.job ? {
          id: p.job.id,
          title: p.job.title,
          status: p.job.status
        } : null
      }))
    });
  } catch (error: any) {
    console.error('Error fetching pending payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending payments', message: error.message },
      { status: 500 }
    );
  }
}
