import razorpay
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import secrets

from models.razorpay import (
    RazorpaySubscription, RazorpayPayment, RazorpayPlanType,
    RazorpaySubscriptionStatus, RazorpayPaymentStatus, Currency,
    RAZORPAY_PRICING, CreateSubscriptionRequest, VerifyPaymentRequest,
    CancelSubscriptionRequest, UpdateSubscriptionRequest, SubscriptionStats
)
from models.user import UserSubscriptionType

class RazorpayService:
    def __init__(self, db: AsyncIOMotorDatabase, razorpay_key_id: str, razorpay_key_secret: str):
        self.db = db
        self.client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))
        self.key_secret = razorpay_key_secret
        
        # Collections
        self.subscriptions = db.razorpay_subscriptions
        self.payments = db.razorpay_payments
        self.users = db.users
    
    async def create_customer(self, user_id: str, email: str, name: str, phone: str) -> str:
        """Create or get Razorpay customer ID"""
        # Check if customer already exists
        user = await self.users.find_one({"_id": ObjectId(user_id)})
        if user and user.get("razorpay_customer_id"):
            return user["razorpay_customer_id"]
        
        # Create new customer
        customer_data = {
            "name": name,
            "email": email,
            "contact": phone,
            "fail_existing": "0"  # Return existing customer if already exists
        }
        
        customer = self.client.customer.create(data=customer_data)
        customer_id = customer["id"]
        
        # Save customer ID to user
        await self.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"razorpay_customer_id": customer_id}}
        )
        
        return customer_id
    
    async def create_subscription(
        self, 
        user_id: str, 
        request: CreateSubscriptionRequest
    ) -> Dict[str, Any]:
        """Create a Razorpay subscription"""
        # Get user details
        user = await self.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError("User not found")
        
        # Get pricing details
        plan_config = RAZORPAY_PRICING[request.plan_type.value]
        
        # Adjust pricing for institutional plans
        if request.plan_type == RazorpayPlanType.INSTITUTIONAL:
            if not request.seats or request.seats < 10:
                raise ValueError("Institutional plans require minimum 10 seats")
            # Base price is per seat
            plan_config = plan_config.copy()
            plan_config["amount"] = plan_config["amount"] * request.seats
        
        # Create or get customer
        customer_id = await self.create_customer(
            user_id, 
            user["email"], 
            user.get("username", "User"),
            user.get("phone", "+919999999999")
        )
        
        # Create Razorpay plan (if not exists)
        plan_id = f"plan_{request.plan_type.value}_{secrets.token_hex(4)}"
        
        try:
            razorpay_plan = self.client.plan.create({
                "period": plan_config["period"],
                "interval": plan_config["interval"],
                "item": {
                    "name": plan_config["name"],
                    "description": plan_config["description"],
                    "amount": plan_config["amount"],
                    "currency": plan_config["currency"]
                }
            })
            plan_id = razorpay_plan["id"]
        except Exception as e:
            # Plan might already exist, use predefined ID
            pass
        
        # Create subscription
        subscription_data = {
            "plan_id": plan_id,
            "customer_id": customer_id,
            "quantity": 1,
            "total_count": 12 if "yearly" in request.plan_type.value else 0,  # 0 = infinite
            "customer_notify": 1,
            "notes": {
                "user_id": user_id,
                "plan_type": request.plan_type.value,
                "affiliate_code": request.affiliate_code or ""
            }
        }
        
        if request.plan_type == RazorpayPlanType.INSTITUTIONAL:
            subscription_data["notes"]["organization_name"] = request.organization_name
            subscription_data["notes"]["seats"] = str(request.seats)
        
        razorpay_subscription = self.client.subscription.create(subscription_data)
        
        # Calculate dates
        current_start = datetime.utcnow()
        if "monthly" in request.plan_type.value:
            current_end = current_start + timedelta(days=30)
            next_billing = current_end
        else:  # yearly
            current_end = current_start + timedelta(days=365)
            next_billing = current_end
        
        # Save subscription to database
        subscription = RazorpaySubscription(
            user_id=user_id,
            subscription_id=razorpay_subscription["id"],
            plan_id=plan_id,
            plan_type=request.plan_type,
            status=RazorpaySubscriptionStatus.CREATED,
            customer_id=customer_id,
            amount=plan_config["amount"],
            currency=Currency.INR,
            interval=plan_config["interval"],
            period=plan_config["period"],
            current_start=current_start,
            current_end=current_end,
            next_billing_date=next_billing,
            organization_name=request.organization_name,
            organization_email=request.organization_email,
            seats_purchased=request.seats,
            seats_used=0
        )
        
        await self.subscriptions.insert_one(subscription.dict())
        
        return {
            "subscription_id": razorpay_subscription["id"],
            "short_url": razorpay_subscription.get("short_url"),
            "status": razorpay_subscription["status"],
            "plan_type": request.plan_type.value,
            "amount": plan_config["amount"],
            "currency": plan_config["currency"]
        }
    
    async def verify_payment_signature(self, request: VerifyPaymentRequest) -> bool:
        """Verify Razorpay payment signature"""
        if request.razorpay_subscription_id:
            # Subscription payment
            message = f"{request.razorpay_payment_id}|{request.razorpay_subscription_id}"
        else:
            # One-time payment
            message = f"{request.razorpay_order_id}|{request.razorpay_payment_id}"
        
        generated_signature = hmac.new(
            self.key_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(generated_signature, request.razorpay_signature)
    
    async def handle_payment_success(
        self, 
        payment_id: str, 
        subscription_id: Optional[str] = None,
        affiliate_code: Optional[str] = None
    ):
        """Handle successful payment"""
        # Fetch payment details from Razorpay
        payment = self.client.payment.fetch(payment_id)
        
        # Get user from payment
        user_id = payment["notes"].get("user_id")
        if not user_id:
            # Try to get from subscription
            if subscription_id:
                sub_doc = await self.subscriptions.find_one({"subscription_id": subscription_id})
                if sub_doc:
                    user_id = sub_doc["user_id"]
        
        if not user_id:
            raise ValueError("Cannot determine user_id from payment")
        
        # Calculate affiliate commission if applicable
        affiliate_commission = 0
        if affiliate_code:
            # Default 20% commission
            affiliate_commission = int(payment["amount"] * 0.20)
        
        # Save payment record
        payment_record = RazorpayPayment(
            payment_id=payment_id,
            order_id=payment.get("order_id"),
            subscription_id=subscription_id,
            user_id=user_id,
            amount=payment["amount"],
            currency=Currency.INR,
            status=RazorpayPaymentStatus.CAPTURED,
            method=payment.get("method"),
            card_last4=payment.get("card", {}).get("last4"),
            card_network=payment.get("card", {}).get("network"),
            email=payment["email"],
            contact=payment["contact"],
            affiliate_code=affiliate_code,
            affiliate_commission=affiliate_commission,
            captured_at=datetime.utcnow()
        )
        
        await self.payments.insert_one(payment_record.dict())
        
        # Update subscription if applicable
        if subscription_id:
            await self.subscriptions.update_one(
                {"subscription_id": subscription_id},
                {
                    "$set": {
                        "status": RazorpaySubscriptionStatus.ACTIVE.value,
                        "last_payment_id": payment_id,
                        "last_payment_date": datetime.utcnow()
                    },
                    "$inc": {
                        "paid_count": 1,
                        "total_amount_paid": payment["amount"]
                    }
                }
            )
            
            # Update user subscription status
            sub_doc = await self.subscriptions.find_one({"subscription_id": subscription_id})
            if sub_doc:
                user_sub_type = self._map_plan_to_subscription_type(sub_doc["plan_type"])
                await self.users.update_one(
                    {"_id": ObjectId(user_id)},
                    {
                        "$set": {
                            "subscription_type": user_sub_type,
                            "subscription_status": "active",
                            "subscription_end_date": sub_doc["current_end"]
                        }
                    }
                )
        
        return payment_record
    
    def _map_plan_to_subscription_type(self, plan_type: str) -> str:
        """Map Razorpay plan to user subscription type"""
        if "pro" in plan_type:
            return UserSubscriptionType.PRO.value
        elif "enterprise" in plan_type or "institutional" in plan_type:
            return UserSubscriptionType.ENTERPRISE.value
        return UserSubscriptionType.FREE.value
    
    async def cancel_subscription(
        self, 
        user_id: str, 
        subscription_id: str,
        request: CancelSubscriptionRequest
    ):
        """Cancel a subscription"""
        # Verify subscription belongs to user
        subscription = await self.subscriptions.find_one({
            "subscription_id": subscription_id,
            "user_id": user_id
        })
        
        if not subscription:
            raise ValueError("Subscription not found")
        
        # Cancel on Razorpay
        try:
            cancelled = self.client.subscription.cancel(
                subscription_id, 
                {"cancel_at_cycle_end": 1 if request.cancel_at_cycle_end else 0}
            )
        except Exception as e:
            raise ValueError(f"Failed to cancel subscription: {str(e)}")
        
        # Update database
        update_data = {
            "status": RazorpaySubscriptionStatus.CANCELLED.value,
            "cancelled_at": datetime.utcnow(),
            "cancel_reason": request.reason
        }
        
        await self.subscriptions.update_one(
            {"subscription_id": subscription_id},
            {"$set": update_data}
        )
        
        # Update user if cancelled immediately
        if not request.cancel_at_cycle_end:
            await self.users.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {
                        "subscription_type": UserSubscriptionType.FREE.value,
                        "subscription_status": "cancelled"
                    }
                }
            )
        
        return cancelled
    
    async def get_subscription_stats(self) -> SubscriptionStats:
        """Get subscription analytics"""
        pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1},
                    "revenue": {"$sum": "$total_amount_paid"}
                }
            }
        ]
        
        results = await self.subscriptions.aggregate(pipeline).to_list(None)
        
        total = sum(r["count"] for r in results)
        active = next((r["count"] for r in results if r["_id"] == "active"), 0)
        cancelled = next((r["count"] for r in results if r["_id"] == "cancelled"), 0)
        total_revenue = sum(r["revenue"] for r in results)
        
        # Calculate MRR and ARR
        active_subs = await self.subscriptions.find({"status": "active"}).to_list(None)
        mrr = sum(s["amount"] for s in active_subs if "monthly" in s["plan_type"])
        arr = mrr * 12 + sum(s["amount"] for s in active_subs if "yearly" in s["plan_type"])
        
        # Plan breakdown
        plan_counts = {}
        for sub in active_subs:
            plan_type = sub["plan_type"]
            plan_counts[plan_type] = plan_counts.get(plan_type, 0) + 1
        
        return SubscriptionStats(
            total_subscriptions=total,
            active_subscriptions=active,
            cancelled_subscriptions=cancelled,
            total_revenue=total_revenue,
            monthly_recurring_revenue=mrr,
            annual_recurring_revenue=arr,
            average_revenue_per_user=total_revenue // total if total > 0 else 0,
            churn_rate=cancelled / total if total > 0 else 0,
            pro_monthly_count=plan_counts.get("pro_monthly", 0),
            pro_yearly_count=plan_counts.get("pro_yearly", 0),
            enterprise_monthly_count=plan_counts.get("enterprise_monthly", 0),
            enterprise_yearly_count=plan_counts.get("enterprise_yearly", 0),
            institutional_count=plan_counts.get("institutional", 0)
        )
    
    async def handle_webhook(self, event: str, payload: dict):
        """Handle Razorpay webhook events"""
        if event == "subscription.activated":
            subscription_id = payload["subscription"]["entity"]["id"]
            await self.subscriptions.update_one(
                {"subscription_id": subscription_id},
                {"$set": {"status": RazorpaySubscriptionStatus.ACTIVE.value}}
            )
        
        elif event == "subscription.charged":
            # Payment successful
            payment_id = payload["payment"]["entity"]["id"]
            subscription_id = payload["subscription"]["entity"]["id"]
            await self.handle_payment_success(payment_id, subscription_id)
        
        elif event == "subscription.cancelled":
            subscription_id = payload["subscription"]["entity"]["id"]
            await self.subscriptions.update_one(
                {"subscription_id": subscription_id},
                {"$set": {
                    "status": RazorpaySubscriptionStatus.CANCELLED.value,
                    "cancelled_at": datetime.utcnow()
                }}
            )
        
        elif event == "subscription.paused":
            subscription_id = payload["subscription"]["entity"]["id"]
            await self.subscriptions.update_one(
                {"subscription_id": subscription_id},
                {"$set": {"status": RazorpaySubscriptionStatus.PAUSED.value}}
            )
        
        elif event == "payment.failed":
            payment_id = payload["payment"]["entity"]["id"]
            # Log failed payment
            pass
