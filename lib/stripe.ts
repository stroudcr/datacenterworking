import Stripe from 'stripe';
import { PRICING } from './constants';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function createCheckoutSession({
  userId,
  jobId,
  isFeatured,
}: {
  userId: string;
  jobId: string;
  isFeatured: boolean;
}) {
  const amount = isFeatured
    ? PRICING.BASE_LISTING + PRICING.FEATURED_UPGRADE
    : PRICING.BASE_LISTING;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
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
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/employer?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/post-job?payment=cancelled`,
    metadata: {
      userId,
      jobId,
      isFeatured: isFeatured.toString(),
    },
  });

  return session;
}
