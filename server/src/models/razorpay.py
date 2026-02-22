from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class RazorpayPlanType(str, Enum):
    PRO_MONTHLY = "pro_monthly"
    PRO_YEARLY = "pro_yearly"
    ENTERPRISE_MONTHLY = "enterprise_monthly"
    ENTERPRISE_YEARLY = "enterprise_yearly"
    INSTITUTIONAL = "institutional"

class RazorpaySubscriptionStatus(str, Enum):
    CREATED = "created"
    AUTHENTICATED = "authenticated"
    ACTIVE = "active"
    PAUSED = "paused"
    HALTED = "halted"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    EXPIRED = "expired"

class RazorpayPaymentStatus(str, Enum):
    PENDING = "pending"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    REFUNDED = "refunded"
    FAILED = "failed"

class Currency(str, Enum):
    INR = "INR"
    USD = "USD"

# Pricing Configuration
RAZORPAY_PRICING = {
    "pro_monthly": {
        "amount": 19900,  # ₹199 in paise
        "currency": "INR",
        "interval": 1,
        "period": "monthly",
        "name": "Pro Monthly Plan",
        "description": "Full access to all tools and features"
    },
    "pro_yearly": {
        "amount": 149900,  # ₹1499 in paise (₹199 * 12 = ₹2388, discount to ₹1499)
        "currency": "INR",
        "interval": 1,
        "period": "yearly",
        "name": "Pro Yearly Plan",
        "description": "Full access with 37% savings"
    },
    "enterprise_monthly": {
        "amount": 49900,  # ₹499 in paise
        "currency": "INR",
        "interval": 1,
        "period": "monthly",
        "name": "Enterprise Monthly Plan",
        "description": "Priority support + team features"
    },
    "enterprise_yearly": {
        "amount": 499900,  # ₹4999 in paise
        "currency": "INR",
        "interval": 1,
        "period": "yearly",
        "name": "Enterprise Yearly Plan",
        "description": "Best value with priority support"
    },
    "institutional": {
        "amount": 299900,  # ₹2999 in paise per month
        "currency": "INR",
        "interval": 1,
        "period": "monthly",
        "name": "Institutional Plan",
        "description": "Custom for colleges and training centers"
    }
}

class RazorpaySubscription(BaseModel):
    user_id: str
    subscription_id: str  # Razorpay subscription ID
    plan_id: str  # Razorpay plan ID
    plan_type: RazorpayPlanType
    status: RazorpaySubscriptionStatus
    customer_id: str  # Razorpay customer ID
    
    # Pricing details
    amount: int  # in paise
    currency: Currency = Currency.INR
    interval: int
    period: str  # monthly, yearly
    
    # Subscription lifecycle
    current_start: datetime
    current_end: datetime
    next_billing_date: Optional[datetime] = None
    paid_count: int = 0
    remaining_count: Optional[int] = None
    
    # Payment tracking
    total_amount_paid: int = 0  # in paise
    last_payment_id: Optional[str] = None
    last_payment_date: Optional[datetime] = None
    
    # Institutional details (if applicable)
    organization_name: Optional[str] = None
    organization_email: Optional[EmailStr] = None
    seats_purchased: Optional[int] = None
    seats_used: Optional[int] = 0
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    cancelled_at: Optional[datetime] = None
    cancel_reason: Optional[str] = None
    
    class Config:
        use_enum_values = True

class RazorpayPayment(BaseModel):
    payment_id: str  # Razorpay payment ID
    order_id: Optional[str] = None  # Razorpay order ID
    subscription_id: Optional[str] = None  # If part of subscription
    user_id: str
    
    # Payment details
    amount: int  # in paise
    currency: Currency = Currency.INR
    status: RazorpayPaymentStatus
    method: Optional[str] = None  # card, netbanking, upi, wallet
    
    # Card details (if applicable)
    card_last4: Optional[str] = None
    card_network: Optional[str] = None
    
    # Contact info
    email: EmailStr
    contact: str  # Phone number
    
    # Razorpay response
    razorpay_signature: Optional[str] = None
    error_code: Optional[str] = None
    error_description: Optional[str] = None
    
    # Affiliate tracking
    affiliate_code: Optional[str] = None
    affiliate_commission: Optional[int] = 0  # in paise
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    captured_at: Optional[datetime] = None
    
    class Config:
        use_enum_values = True

class CreateSubscriptionRequest(BaseModel):
    plan_type: RazorpayPlanType
    organization_name: Optional[str] = None  # For institutional plans
    organization_email: Optional[EmailStr] = None
    seats: Optional[int] = None  # For institutional plans
    affiliate_code: Optional[str] = None

class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: Optional[str] = None
    razorpay_subscription_id: Optional[str] = None
    razorpay_signature: str

class CancelSubscriptionRequest(BaseModel):
    cancel_at_cycle_end: bool = True
    reason: Optional[str] = None

class UpdateSubscriptionRequest(BaseModel):
    plan_type: Optional[RazorpayPlanType] = None
    seats: Optional[int] = None  # For institutional plans

class RazorpayWebhookEvent(BaseModel):
    event: str  # subscription.activated, payment.captured, etc.
    payload: dict
    created_at: int  # Unix timestamp
    
class SubscriptionStats(BaseModel):
    total_subscriptions: int = 0
    active_subscriptions: int = 0
    cancelled_subscriptions: int = 0
    total_revenue: int = 0  # in paise
    monthly_recurring_revenue: int = 0  # MRR in paise
    annual_recurring_revenue: int = 0  # ARR in paise
    average_revenue_per_user: int = 0  # in paise
    churn_rate: float = 0.0
    
    # Plan breakdown
    pro_monthly_count: int = 0
    pro_yearly_count: int = 0
    enterprise_monthly_count: int = 0
    enterprise_yearly_count: int = 0
    institutional_count: int = 0

class InstitutionalDashboard(BaseModel):
    organization_name: str
    subscription_id: str
    plan_type: str
    status: str
    seats_purchased: int
    seats_used: int
    seats_available: int
    amount_paid: int  # in paise
    next_billing_date: Optional[datetime] = None
    students: List[dict] = []  # List of student emails and status
