import { NextResponse } from 'next/server';

// Simple health check endpoint that Stripe can use to verify the webhook URL is reachable
// This endpoint doesn't require authentication or signature verification
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/stripe/webhook',
    message: 'Webhook endpoint is reachable',
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/stripe/webhook',
    message: 'Webhook endpoint accepts POST requests',
    timestamp: new Date().toISOString()
  });
}
