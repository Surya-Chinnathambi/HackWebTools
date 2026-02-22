"""
Payment Service - Stripe integration for subscriptions
"""

import stripe
from typing import Optional
from datetime import datetime

from app.core.config import settings
from app.models.user import UserSubscription

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentService:
    """Service for handling Stripe payments and subscriptions"""
    
    # Subscription tier pricing (in cents)
    TIER_PRICES = {
        "free": 0,
        "pro": 1900,  # $19.00
        "enterprise": 4900  # $49.00
    }
    
    # Stripe price IDs (set these in Stripe Dashboard)
    STRIPE_PRICE_IDS = {
        "pro_monthly": settings.STRIPE_PRO_PRICE_ID,
        "enterprise_monthly": settings.STRIPE_ENTERPRISE_PRICE_ID
    }
    
    @staticmethod
    async def create_customer(email: str, name: str, user_id: str) -> str:
        """Create a Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata={"user_id": user_id}
            )
            return customer.id
        except stripe.error.StripeError as e:
            raise ValueError(f"Failed to create Stripe customer: {str(e)}")
    
    @staticmethod
    async def create_checkout_session(
        customer_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str,
        tier: str
    ) -> str:
        """Create a Stripe Checkout session for subscription"""
        try:
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=["card"],
                line_items=[{
                    "price": price_id,
                    "quantity": 1
                }],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={"tier": tier}
            )
            return session.url
        except stripe.error.StripeError as e:
            raise ValueError(f"Failed to create checkout session: {str(e)}")
    
    @staticmethod
    async def create_subscription(
        customer_id: str,
        price_id: str
    ) -> dict:
        """Create a subscription directly (without checkout)"""
        try:
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{"price": price_id}],
                payment_behavior="default_incomplete",
                expand=["latest_invoice.payment_intent"]
            )
            return {
                "subscription_id": subscription.id,
                "client_secret": subscription.latest_invoice.payment_intent.client_secret,
                "status": subscription.status
            }
        except stripe.error.StripeError as e:
            raise ValueError(f"Failed to create subscription: {str(e)}")
    
    @staticmethod
    async def cancel_subscription(subscription_id: str) -> bool:
        """Cancel a subscription"""
        try:
            stripe.Subscription.delete(subscription_id)
            return True
        except stripe.error.StripeError as e:
            raise ValueError(f"Failed to cancel subscription: {str(e)}")
    
    @staticmethod
    async def update_subscription(
        subscription_id: str,
        new_price_id: str
    ) -> dict:
        """Update subscription to a different tier"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            updated_subscription = stripe.Subscription.modify(
                subscription_id,
                items=[{
                    "id": subscription["items"]["data"][0].id,
                    "price": new_price_id
                }],
                proration_behavior="create_prorations"
            )
            return {
                "subscription_id": updated_subscription.id,
                "status": updated_subscription.status,
                "current_period_end": datetime.fromtimestamp(
                    updated_subscription.current_period_end
                )
            }
        except stripe.error.StripeError as e:
            raise ValueError(f"Failed to update subscription: {str(e)}")
    
    @staticmethod
    async def get_subscription(subscription_id: str) -> Optional[dict]:
        """Get subscription details"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            return {
                "id": subscription.id,
                "status": subscription.status,
                "current_period_end": datetime.fromtimestamp(
                    subscription.current_period_end
                ),
                "cancel_at_period_end": subscription.cancel_at_period_end
            }
        except stripe.error.StripeError as e:
            return None
    
    @staticmethod
    async def create_customer_portal_session(
        customer_id: str,
        return_url: str
    ) -> str:
        """Create a billing portal session for customer to manage subscription"""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url
            )
            return session.url
        except stripe.error.StripeError as e:
            raise ValueError(f"Failed to create portal session: {str(e)}")
    
    @staticmethod
    def verify_webhook_signature(
        payload: bytes,
        signature: str,
        webhook_secret: str
    ) -> Optional[dict]:
        """Verify and parse Stripe webhook event"""
        try:
            event = stripe.Webhook.construct_event(
                payload, signature, webhook_secret
            )
            return event
        except stripe.error.SignatureVerificationError:
            return None
    
    @staticmethod
    def get_tier_from_price_id(price_id: str) -> str:
        """Get subscription tier from Stripe price ID"""
        price_map = {
            settings.STRIPE_PRO_PRICE_ID: "pro",
            settings.STRIPE_ENTERPRISE_PRICE_ID: "enterprise"
        }
        return price_map.get(price_id, "free")
    
    @staticmethod
    async def handle_subscription_updated(event_data: dict) -> UserSubscription:
        """Handle subscription.updated webhook event"""
        subscription = event_data["object"]
        
        # Get tier from price ID
        price_id = subscription["items"]["data"][0]["price"]["id"]
        tier = PaymentService.get_tier_from_price_id(price_id)
        
        return UserSubscription(
            tier=tier,
            stripe_customer_id=subscription["customer"],
            stripe_subscription_id=subscription["id"],
            status=subscription["status"],
            current_period_end=datetime.fromtimestamp(
                subscription["current_period_end"]
            )
        )
    
    @staticmethod
    async def handle_subscription_deleted(event_data: dict) -> UserSubscription:
        """Handle subscription.deleted webhook event"""
        subscription = event_data["object"]
        
        # Downgrade to free tier
        return UserSubscription(
            tier="free",
            stripe_customer_id=subscription["customer"],
            stripe_subscription_id=None,
            status="canceled",
            current_period_end=None
        )
