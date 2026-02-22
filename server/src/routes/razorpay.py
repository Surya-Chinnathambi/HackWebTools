from fastapi import APIRouter, Depends, HTTPException, Header, Request
from typing import Optional
from datetime import datetime
import os

from models.razorpay import (
    CreateSubscriptionRequest, VerifyPaymentRequest, 
    CancelSubscriptionRequest, UpdateSubscriptionRequest
)
from services.razorpay_service import RazorpayService
from services.affiliate_service import AffiliateService
from dependencies import get_current_user, get_db

router = APIRouter(prefix="/razorpay", tags=["Razorpay Payments"])

def get_razorpay_service(db=Depends(get_db)) -> RazorpayService:
    """Get Razorpay service instance"""
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    
    if not key_id or not key_secret:
        raise HTTPException(status_code=500, detail="Razorpay credentials not configured")
    
    return RazorpayService(db, key_id, key_secret)

def get_affiliate_service(db=Depends(get_db)) -> AffiliateService:
    """Get Affiliate service instance"""
    return AffiliateService(db)

@router.post("/subscriptions/create")
async def create_subscription(
    request: CreateSubscriptionRequest,
    current_user: dict = Depends(get_current_user),
    service: RazorpayService = Depends(get_razorpay_service),
    affiliate_service: AffiliateService = Depends(get_affiliate_service)
):
    """
    Create a new Razorpay subscription
    
    - **plan_type**: pro_monthly, pro_yearly, enterprise_monthly, enterprise_yearly, institutional
    - **organization_name**: Required for institutional plans
    - **seats**: Required for institutional plans (minimum 10)
    - **affiliate_code**: Optional referral code
    """
    try:
        # Track affiliate click if code provided
        if request.affiliate_code:
            # Verify affiliate exists
            try:
                await affiliate_service.affiliates.find_one({"affiliate_code": request.affiliate_code})
            except:
                pass  # Invalid code, continue without affiliate
        
        result = await service.create_subscription(str(current_user["_id"]), request)
        return {
            "success": True,
            "message": "Subscription created successfully",
            "data": result
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create subscription: {str(e)}")

@router.post("/payments/verify")
async def verify_payment(
    request: VerifyPaymentRequest,
    current_user: dict = Depends(get_current_user),
    service: RazorpayService = Depends(get_razorpay_service),
    affiliate_service: AffiliateService = Depends(get_affiliate_service)
):
    """
    Verify Razorpay payment signature and process payment
    
    - **razorpay_payment_id**: Payment ID from Razorpay
    - **razorpay_order_id**: Order ID (for one-time payments)
    - **razorpay_subscription_id**: Subscription ID (for subscription payments)
    - **razorpay_signature**: Signature from Razorpay
    """
    try:
        # Verify signature
        is_valid = await service.verify_payment_signature(request)
        
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Get affiliate code from payment notes (if exists)
        affiliate_code = None
        try:
            payment = service.client.payment.fetch(request.razorpay_payment_id)
            affiliate_code = payment["notes"].get("affiliate_code")
        except:
            pass
        
        # Process payment
        payment_record = await service.handle_payment_success(
            request.razorpay_payment_id,
            request.razorpay_subscription_id,
            affiliate_code
        )
        
        # Create affiliate commission if applicable
        if affiliate_code:
            try:
                await affiliate_service.create_commission(
                    affiliate_code=affiliate_code,
                    customer_user_id=str(current_user["_id"]),
                    payment_id=request.razorpay_payment_id,
                    order_amount=payment_record.amount,
                    subscription_id=request.razorpay_subscription_id
                )
            except Exception as e:
                # Log error but don't fail payment
                print(f"Failed to create commission: {e}")
        
        return {
            "success": True,
            "message": "Payment verified successfully",
            "payment_id": payment_record.payment_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

@router.get("/subscriptions/my-subscription")
async def get_my_subscription(
    current_user: dict = Depends(get_current_user),
    service: RazorpayService = Depends(get_razorpay_service)
):
    """Get current user's active subscription"""
    try:
        subscription = await service.subscriptions.find_one({
            "user_id": str(current_user["_id"]),
            "status": {"$in": ["created", "authenticated", "active"]}
        })
        
        if not subscription:
            return {
                "success": True,
                "data": None,
                "message": "No active subscription found"
            }
        
        # Remove MongoDB _id
        subscription.pop("_id", None)
        
        return {
            "success": True,
            "data": subscription
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/subscriptions/{subscription_id}/cancel")
async def cancel_subscription(
    subscription_id: str,
    request: CancelSubscriptionRequest,
    current_user: dict = Depends(get_current_user),
    service: RazorpayService = Depends(get_razorpay_service)
):
    """
    Cancel a subscription
    
    - **cancel_at_cycle_end**: If true, subscription continues until end of billing cycle
    - **reason**: Optional cancellation reason
    """
    try:
        result = await service.cancel_subscription(
            str(current_user["_id"]),
            subscription_id,
            request
        )
        
        return {
            "success": True,
            "message": "Subscription cancelled successfully",
            "data": result
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/subscriptions/stats")
async def get_subscription_stats(
    current_user: dict = Depends(get_current_user),
    service: RazorpayService = Depends(get_razorpay_service)
):
    """Get subscription analytics (admin only)"""
    # Check if user is admin
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        stats = await service.get_subscription_stats()
        return {
            "success": True,
            "data": stats.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhooks")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None),
    service: RazorpayService = Depends(get_razorpay_service)
):
    """
    Handle Razorpay webhook events
    
    Processes subscription.activated, subscription.charged, subscription.cancelled, etc.
    """
    try:
        body = await request.json()
        
        # Verify webhook signature
        webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
        if webhook_secret and x_razorpay_signature:
            # Verify signature
            import hmac
            import hashlib
            
            body_bytes = await request.body()
            expected_signature = hmac.new(
                webhook_secret.encode(),
                body_bytes,
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(expected_signature, x_razorpay_signature):
                raise HTTPException(status_code=400, detail="Invalid webhook signature")
        
        # Process webhook
        event = body.get("event")
        payload = body.get("payload")
        
        await service.handle_webhook(event, payload)
        
        return {"success": True}
    except Exception as e:
        # Log error but return 200 to prevent retries
        print(f"Webhook error: {e}")
        return {"success": False, "error": str(e)}

@router.get("/pricing")
async def get_pricing():
    """Get Razorpay pricing plans"""
    from models.razorpay import RAZORPAY_PRICING
    
    # Convert paise to rupees for display
    pricing_display = {}
    for plan_type, config in RAZORPAY_PRICING.items():
        pricing_display[plan_type] = {
            **config,
            "amount_inr": config["amount"] / 100,  # Convert paise to rupees
            "amount_display": f"₹{config['amount'] / 100:.0f}"
        }
    
    return {
        "success": True,
        "data": pricing_display
    }
