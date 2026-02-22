"""
Payment Routes - Stripe subscription management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from app.core.config import settings
from app.core.database import get_database
from app.models.user import User
from app.services.user_service import UserService
from app.services.payment_service import PaymentService
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])


# Request models
class CreateCheckoutSession(BaseModel):
    tier: str  # "pro" or "enterprise"
    success_url: str
    cancel_url: str


class UpdateSubscription(BaseModel):
    tier: str  # "pro" or "enterprise"


# Dependency
async def get_user_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> UserService:
    return UserService(db)


@router.post("/create-checkout-session")
async def create_checkout_session(
    request: CreateCheckoutSession,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Create a Stripe Checkout session for subscription
    
    Steps:
    1. Create Stripe customer if doesn't exist
    2. Create checkout session
    3. Return checkout URL
    """
    # Validate tier
    if request.tier not in ["pro", "enterprise"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subscription tier"
        )
    
    # Get price ID
    price_id = (
        settings.STRIPE_PRO_PRICE_ID 
        if request.tier == "pro" 
        else settings.STRIPE_ENTERPRISE_PRICE_ID
    )
    
    if not price_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stripe price ID not configured"
        )
    
    try:
        # Create customer if doesn't exist
        customer_id = current_user.subscription.stripe_customer_id
        if not customer_id:
            customer_id = await PaymentService.create_customer(
                email=current_user.email,
                name=current_user.full_name,
                user_id=str(current_user.id)
            )
            # Update user with customer ID
            current_user.subscription.stripe_customer_id = customer_id
            await user_service.update_subscription(
                str(current_user.id),
                current_user.subscription
            )
        
        # Create checkout session
        checkout_url = await PaymentService.create_checkout_session(
            customer_id=customer_id,
            price_id=price_id,
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            tier=request.tier
        )
        
        return {"checkout_url": checkout_url}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/create-subscription")
async def create_subscription(
    tier: str,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Create subscription directly (returns client secret for frontend payment)
    """
    if tier not in ["pro", "enterprise"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subscription tier"
        )
    
    price_id = (
        settings.STRIPE_PRO_PRICE_ID 
        if tier == "pro" 
        else settings.STRIPE_ENTERPRISE_PRICE_ID
    )
    
    try:
        # Create customer if doesn't exist
        customer_id = current_user.subscription.stripe_customer_id
        if not customer_id:
            customer_id = await PaymentService.create_customer(
                email=current_user.email,
                name=current_user.full_name,
                user_id=str(current_user.id)
            )
        
        # Create subscription
        result = await PaymentService.create_subscription(
            customer_id=customer_id,
            price_id=price_id
        )
        
        return result
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/cancel-subscription")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Cancel current subscription"""
    subscription_id = current_user.subscription.stripe_subscription_id
    
    if not subscription_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active subscription"
        )
    
    try:
        await PaymentService.cancel_subscription(subscription_id)
        
        # Update user subscription to free
        current_user.subscription.tier = "free"
        current_user.subscription.status = "canceled"
        current_user.subscription.stripe_subscription_id = None
        await user_service.update_subscription(
            str(current_user.id),
            current_user.subscription
        )
        
        return {"message": "Subscription canceled successfully"}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/update-subscription")
async def update_subscription(
    request: UpdateSubscription,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Update subscription to different tier"""
    if request.tier not in ["pro", "enterprise"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subscription tier"
        )
    
    subscription_id = current_user.subscription.stripe_subscription_id
    if not subscription_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active subscription to update"
        )
    
    price_id = (
        settings.STRIPE_PRO_PRICE_ID 
        if request.tier == "pro" 
        else settings.STRIPE_ENTERPRISE_PRICE_ID
    )
    
    try:
        result = await PaymentService.update_subscription(
            subscription_id=subscription_id,
            new_price_id=price_id
        )
        
        # Update user subscription
        current_user.subscription.tier = request.tier
        current_user.subscription.status = result["status"]
        current_user.subscription.current_period_end = result["current_period_end"]
        await user_service.update_subscription(
            str(current_user.id),
            current_user.subscription
        )
        
        return {"message": "Subscription updated successfully"}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/customer-portal")
async def customer_portal(
    current_user: User = Depends(get_current_user)
):
    """Get Stripe customer portal URL"""
    customer_id = current_user.subscription.stripe_customer_id
    
    if not customer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No Stripe customer found"
        )
    
    try:
        portal_url = await PaymentService.create_customer_portal_session(
            customer_id=customer_id,
            return_url=f"{settings.FRONTEND_URL}/dashboard"
        )
        
        return {"portal_url": portal_url}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    user_service: UserService = Depends(get_user_service)
):
    """
    Handle Stripe webhook events
    
    Events handled:
    - checkout.session.completed
    - customer.subscription.updated
    - customer.subscription.deleted
    - invoice.payment_succeeded
    - invoice.payment_failed
    """
    # Get raw body
    payload = await request.body()
    
    # Verify webhook signature
    event = PaymentService.verify_webhook_signature(
        payload=payload,
        signature=stripe_signature,
        webhook_secret=settings.STRIPE_WEBHOOK_SECRET
    )
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook signature"
        )
    
    event_type = event["type"]
    event_data = event["data"]
    
    try:
        if event_type == "checkout.session.completed":
            # Payment successful, subscription created
            session = event_data["object"]
            customer_id = session["customer"]
            subscription_id = session["subscription"]
            
            # Find user by customer ID
            db = await get_database()
            user_data = await db.users.find_one(
                {"subscription.stripe_customer_id": customer_id}
            )
            
            if user_data:
                user = User(**user_data)
                # Update subscription will be handled by subscription.updated event
        
        elif event_type == "customer.subscription.updated":
            # Subscription status changed
            subscription_data = await PaymentService.handle_subscription_updated(event_data)
            
            # Find user by customer ID
            db = await get_database()
            user_data = await db.users.find_one(
                {"subscription.stripe_customer_id": subscription_data.stripe_customer_id}
            )
            
            if user_data:
                user = User(**user_data)
                await user_service.update_subscription(
                    str(user.id),
                    subscription_data
                )
        
        elif event_type == "customer.subscription.deleted":
            # Subscription canceled
            subscription_data = await PaymentService.handle_subscription_deleted(event_data)
            
            # Find user by customer ID
            db = await get_database()
            user_data = await db.users.find_one(
                {"subscription.stripe_customer_id": subscription_data.stripe_customer_id}
            )
            
            if user_data:
                user = User(**user_data)
                await user_service.update_subscription(
                    str(user.id),
                    subscription_data
                )
        
        elif event_type == "invoice.payment_failed":
            # Payment failed - notify user
            invoice = event_data["object"]
            customer_id = invoice["customer"]
            # TODO: Send email notification
        
        return {"status": "success"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Webhook processing failed: {str(e)}"
        )


@router.get("/subscription-status")
async def get_subscription_status(
    current_user: User = Depends(get_current_user)
):
    """Get current subscription status"""
    subscription = current_user.subscription
    
    result = {
        "tier": subscription.tier,
        "status": subscription.status,
        "customer_id": subscription.stripe_customer_id,
        "subscription_id": subscription.stripe_subscription_id,
        "current_period_end": subscription.current_period_end
    }
    
    # Get live status from Stripe if subscription exists
    if subscription.stripe_subscription_id:
        stripe_data = await PaymentService.get_subscription(
            subscription.stripe_subscription_id
        )
        if stripe_data:
            result["stripe_status"] = stripe_data["status"]
            result["cancel_at_period_end"] = stripe_data["cancel_at_period_end"]
    
    return result
