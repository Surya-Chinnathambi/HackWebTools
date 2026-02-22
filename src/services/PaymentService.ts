const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CheckoutSessionResponse {
    sessionId: string;
    url: string;
}

export interface PortalSessionResponse {
    url: string;
}

export class PaymentService {
    /**
     * Create a Stripe Checkout session for subscription
     */
    static async createCheckoutSession(
        priceId: string,
        tier: 'pro' | 'enterprise',
        userId: string,
        email: string
    ): Promise<CheckoutSessionResponse> {
        try {
            const response = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    tier,
                    userId,
                    email,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Checkout session error:', error);
            throw error;
        }
    }

    /**
     * Redirect to Stripe Checkout
     */
    static async redirectToCheckout(
        priceId: string,
        tier: 'pro' | 'enterprise',
        userId: string,
        email: string
    ): Promise<void> {
        try {
            const { url } = await this.createCheckoutSession(priceId, tier, userId, email);
            window.location.href = url;
        } catch (error) {
            console.error('Redirect to checkout failed:', error);
            throw error;
        }
    }

    /**
     * Create Stripe Customer Portal session for managing subscription
     */
    static async createPortalSession(customerId: string): Promise<PortalSessionResponse> {
        try {
            const response = await fetch(`${API_URL}/api/payments/create-portal-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create portal session');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Portal session error:', error);
            throw error;
        }
    }

    /**
     * Redirect to Stripe Customer Portal
     */
    static async redirectToPortal(customerId: string): Promise<void> {
        try {
            const { url } = await this.createPortalSession(customerId);
            window.location.href = url;
        } catch (error) {
            console.error('Redirect to portal failed:', error);
            throw error;
        }
    }

    /**
     * Get subscription details
     */
    static async getSubscriptionDetails(subscriptionId: string) {
        try {
            const response = await fetch(
                `${API_URL}/api/payments/subscription/${subscriptionId}`
            );

            if (!response.ok) {
                throw new Error('Failed to get subscription details');
            }

            return await response.json();
        } catch (error) {
            console.error('Get subscription error:', error);
            throw error;
        }
    }

    /**
     * Cancel subscription (at period end)
     */
    static async cancelSubscription(subscriptionId: string) {
        try {
            const response = await fetch(`${API_URL}/api/payments/cancel-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            return await response.json();
        } catch (error) {
            console.error('Cancel subscription error:', error);
            throw error;
        }
    }
}
