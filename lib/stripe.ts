import Stripe from 'stripe';
import { PRICING } from './constants';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function createCheckoutSession({
  userId,
  jobId,
  isFeatured,
  email,
}: {
  userId: string | null;
  jobId: string;
  isFeatured: boolean;
  email: string;
}) {
  const amount = isFeatured
    ? PRICING.BASE_LISTING + PRICING.FEATURED_UPGRADE
    : PRICING.BASE_LISTING;

  // Get the base URL - use NEXT_PUBLIC_SITE_URL or fallback to VERCEL_URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL or VERCEL_URL must be set for Stripe checkout');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: '30-Day Job Listing',
            description: isFeatured
              ? 'Premium listing with featured placement for 7 days'
              : 'Standard 30-day job listing',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/post-job/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/post-job?payment=cancelled`,
    metadata: {
      userId: userId || '',
      jobId,
      isFeatured: isFeatured.toString(),
    },
  });

  return session;
}
