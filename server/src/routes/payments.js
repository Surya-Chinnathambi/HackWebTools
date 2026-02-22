import Stripe from 'stripe';
import express from 'express';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
    apiVersion: '2023-10-16',
});

const router = express.Router();

/**
 * Create a Stripe Checkout Session for subscription
 * POST /api/payments/create-checkout-session
 */
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, userId, email, tier } = req.body;

        if (!priceId || !userId || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // Stripe Price ID (e.g., price_1234...)
                    quantity: 1,
                },
            ],
            customer_email: email,
            metadata: {
                userId,
                tier,
            },
            success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing`,
            subscription_data: {
                metadata: {
                    userId,
                    tier,
                },
            },
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

/**
 * Create a Stripe Customer Portal Session for managing subscription
 * POST /api/payments/create-portal-session
 */
router.post('/create-portal-session', async (req, res) => {
    try {
        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ error: 'Customer ID required' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.FRONTEND_URL}/dashboard`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe portal error:', error);
        res.status(500).json({ error: 'Failed to create portal session' });
    }
});

/**
 * Webhook handler for Stripe events
 * POST /api/payments/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            console.log('Checkout session completed:', session.id);

            // TODO: Update user subscription in database
            const { userId, tier } = session.metadata;
            // await updateUserSubscription(userId, {
            //   tier,
            //   status: 'active',
            //   stripeCustomerId: session.customer,
            //   stripeSubscriptionId: session.subscription,
            // });

            break;
        }

        case 'customer.subscription.updated': {
            const subscription = event.data.object;
            console.log('Subscription updated:', subscription.id);

            // TODO: Update subscription status
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            console.log('Subscription cancelled:', subscription.id);

            // TODO: Downgrade user to free tier
            // const userId = subscription.metadata.userId;
            // await updateUserSubscription(userId, { tier: 'free', status: 'canceled' });

            break;
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object;
            console.log('Payment succeeded:', invoice.id);
            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object;
            console.log('Payment failed:', invoice.id);

            // TODO: Send email notification to user
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

/**
 * Get subscription details
 * GET /api/payments/subscription/:subscriptionId
 */
router.get('/subscription/:subscriptionId', async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        res.json({
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            plan: subscription.items.data[0].price.id,
        });
    } catch (error) {
        console.error('Failed to retrieve subscription:', error);
        res.status(500).json({ error: 'Failed to retrieve subscription' });
    }
});

/**
 * Cancel subscription
 * POST /api/payments/cancel-subscription
 */
router.post('/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({ error: 'Subscription ID required' });
        }

        // Cancel at period end (don't immediately cancel)
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        res.json({
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
    } catch (error) {
        console.error('Failed to cancel subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
});

export default router;
