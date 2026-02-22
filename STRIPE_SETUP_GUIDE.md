# Stripe Payment Integration Setup Guide

## Overview
This guide will help you set up Stripe payment integration for your HackWebTools platform with a budget under $50/month.

## Cost Breakdown
- **Stripe Fees**: 2.9% + $0.30 per transaction (no monthly fee)
- **Hosting**: Free (Render/Netlify free tier)
- **Database**: Free (MongoDB Atlas free tier - 512MB)
- **Estimated Monthly Cost**: $0-$5 (only pay when you get sales!)

## Setup Steps

### 1. Create Stripe Account
1. Go to https://stripe.com
2. Sign up for a free account
3. Verify your email and complete account setup
4. Get your API keys from Dashboard → Developers → API keys

### 2. Configure Environment Variables

Add to `server/.env`:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxx  # Your test secret key
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx  # Your test publishable key
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Get this after setting up webhook

# Frontend URL
FRONTEND_URL=http://localhost:5173  # Update for production

# For production, use live keys:
# STRIPE_SECRET_KEY=sk_live_xxxxx
# STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 3. Create Stripe Products & Prices

Run this script to create products in Stripe Dashboard or via API:

```javascript
// Create products using Stripe Dashboard or CLI

// Pro Plan
Product: "HackWebTools Pro"
Price: $19/month (recurring)
Price ID: price_pro_monthly

// Enterprise Plan  
Product: "HackWebTools Enterprise"
Price: $49/month (recurring)
Price ID: price_enterprise_monthly
```

Or use Stripe CLI:
```bash
stripe products create --name="HackWebTools Pro" --description="Professional cybersecurity training"
stripe prices create --product=prod_xxx --unit-amount=1900 --currency=usd --recurring[interval]=month
```

### 4. Update Frontend Configuration

Update `src/types/subscription.ts` with your Stripe Price IDs:

```typescript
{
  id: 'pro',
  stripePriceId: 'price_1xxxxx', // Replace with actual Stripe price ID
  // ...
},
{
  id: 'enterprise',
  stripePriceId: 'price_2xxxxx', // Replace with actual Stripe price ID
  // ...
}
```

### 5. Set Up Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend.onrender.com/api/payments/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret
5. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`

### 6. Install Dependencies

```bash
cd server
npm install stripe
```

### 7. Update Server Index

Add payment routes to `server/src/index.js`:

```javascript
import paymentRoutes from './routes/payments.js';

// Add this line after other routes
app.use('/api/payments', paymentRoutes);
```

### 8. Frontend Payment Integration

Create `src/services/PaymentService.ts`:

```typescript
export const createCheckoutSession = async (priceId: string, tier: string) => {
  const response = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId,
      userId: user.id,
      email: user.email,
      tier
    })
  });
  
  const { url } = await response.json();
  window.location.href = url; // Redirect to Stripe Checkout
};
```

### 9. Test Payment Flow

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Any postal code

### 10. Production Checklist

Before going live:
- [ ] Replace test keys with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Set up SSL/HTTPS (Render provides this free)
- [ ] Test full payment flow
- [ ] Set up email notifications (use free SendGrid tier - 100 emails/day)
- [ ] Add privacy policy and terms of service
- [ ] Enable Stripe Radar for fraud prevention (free)

## Database Schema for Users

```javascript
// MongoDB User Schema
{
  _id: ObjectId,
  email: String,
  name: String,
  tier: String, // 'free', 'pro', 'enterprise'
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  subscription: {
    status: String, // 'active', 'canceled', 'past_due'
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Security Best Practices

1. **Never expose secret keys** - Keep them in `.env` only
2. **Verify webhook signatures** - Always validate Stripe webhooks
3. **Use HTTPS in production** - Stripe requires it
4. **Implement rate limiting** - Prevent abuse
5. **Store minimal card data** - Let Stripe handle it

## Cost Optimization Tips

1. **Start with test mode** - No charges while testing
2. **Use free tier services**:
   - Render: Free backend hosting (750 hours/month)
   - MongoDB Atlas: Free 512MB database
   - Netlify: Free frontend hosting
3. **Only pay Stripe fees** - 2.9% + $0.30 per successful transaction
4. **No upfront costs** - Only pay when you make sales!

## Expected Monthly Costs

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Stripe | Pay per transaction | 2.9% + $0.30/txn |
| Hosting (Render) | 750 hrs free | $7/month if exceeded |
| Database (MongoDB) | 512MB free | $9/month for 2GB |
| Email (SendGrid) | 100/day free | $15/month for unlimited |
| **TOTAL** | **$0-5/month** | **Max $31/month** |

## Revenue Projections

| Subscribers | Monthly Revenue | Stripe Fees | Net Income |
|-------------|----------------|-------------|------------|
| 10 Pro | $190 | $8.50 | $181.50 |
| 50 Pro | $950 | $42.50 | $907.50 |
| 100 Pro | $1,900 | $85 | $1,815 |
| 20 Enterprise | $980 | $43.40 | $936.60 |

**Break-even**: Just 1 subscriber covers all hosting costs!

## Support

- Stripe Docs: https://stripe.com/docs
- Stripe Support: Dashboard → Help
- Test Cards: https://stripe.com/docs/testing

## Next Steps

1. Set up Stripe account
2. Get API keys
3. Install dependencies
4. Configure webhooks
5. Test with test cards
6. Deploy to production
7. Start accepting payments! 🚀
