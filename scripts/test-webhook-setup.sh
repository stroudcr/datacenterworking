#!/bin/bash

# Webhook Setup Testing Script
# This script helps diagnose webhook configuration issues

echo "=========================================="
echo "Stripe Webhook Configuration Test"
echo "=========================================="
echo ""

# Get the site URL from env
SITE_URL=$(grep NEXT_PUBLIC_SITE_URL .env.local | cut -d '=' -f2)
echo "Site URL: $SITE_URL"
echo ""

echo "1. Testing webhook endpoint accessibility..."
echo "   GET $SITE_URL/api/stripe/webhook"
curl -s "$SITE_URL/api/stripe/webhook" | jq '.' || echo "   Error: Endpoint not accessible or invalid JSON"
echo ""

echo "2. Testing webhook health check..."
echo "   GET $SITE_URL/api/stripe/webhook-health"
curl -s "$SITE_URL/api/stripe/webhook-health" | jq '.' || echo "   Error: Health check failed"
echo ""

echo "3. Checking for pending payments..."
echo "   GET $SITE_URL/api/stripe/complete-payment"
curl -s "$SITE_URL/api/stripe/complete-payment" | jq '.' || echo "   Error: Could not fetch pending payments"
echo ""

echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. If endpoints are not accessible:"
echo "   - Verify deployment is live at $SITE_URL"
echo "   - Check Vercel deployment logs for errors"
echo ""
echo "2. Check webhook configuration in Stripe Dashboard:"
echo "   - Go to: https://dashboard.stripe.com/webhooks"
echo "   - Verify endpoint exists: $SITE_URL/api/stripe/webhook"
echo "   - Check 'Recent deliveries' for failed attempts"
echo ""
echo "3. Verify webhook secret matches:"
echo "   - Compare webhookSecretPrefix from step 1 above"
echo "   - With the secret in Stripe Dashboard endpoint"
echo "   - Update Vercel env vars if different"
echo ""
echo "4. To manually complete a pending payment:"
echo "   - Copy a stripeSessionId from step 3 above"
echo "   - Run: curl -X POST $SITE_URL/api/stripe/complete-payment \\"
echo "            -H 'Content-Type: application/json' \\"
echo "            -d '{\"sessionId\": \"cs_test_...\"}'  | jq '.'"
echo ""
