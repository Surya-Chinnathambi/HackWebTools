from pydantic import BaseModel, Field, EmailStr, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum

class AffiliateStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"

class CommissionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    PAID = "paid"
    REJECTED = "rejected"

class CommissionTier(str, Enum):
    STARTER = "starter"  # 20% up to 10 referrals
    BRONZE = "bronze"    # 25% 11-50 referrals
    SILVER = "silver"    # 30% 51-100 referrals
    GOLD = "gold"        # 35% 101+ referrals

COMMISSION_RATES = {
    "starter": 0.20,  # 20%
    "bronze": 0.25,   # 25%
    "silver": 0.30,   # 30%
    "gold": 0.35      # 35%
}

COMMISSION_THRESHOLDS = {
    "starter": 0,
    "bronze": 11,
    "silver": 51,
    "gold": 101
}

class Affiliate(BaseModel):
    user_id: str
    affiliate_code: str  # Unique referral code (e.g., "HACK-JOHN123")
    status: AffiliateStatus = AffiliateStatus.PENDING
    
    # Contact & Payment Info
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    
    # Payment details
    bank_account_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc_code: Optional[str] = None
    upi_id: Optional[str] = None
    paypal_email: Optional[EmailStr] = None
    
    # Commission tracking
    tier: CommissionTier = CommissionTier.STARTER
    commission_rate: float = 0.20  # Current rate
    total_referrals: int = 0
    successful_referrals: int = 0  # Paid conversions
    
    # Revenue tracking (in paise)
    total_revenue_generated: int = 0
    total_commission_earned: int = 0
    total_commission_paid: int = 0
    pending_commission: int = 0
    
    # Referral links
    referral_url: str  # https://hackwebtools.com?ref=HACK-JOHN123
    custom_landing_page: Optional[HttpUrl] = None
    
    # Marketing assets
    promotional_materials_sent: bool = False
    
    # Performance metrics
    click_count: int = 0
    conversion_rate: float = 0.0
    average_order_value: int = 0  # in paise
    
    # Dates
    created_at: datetime = Field(default_factory=datetime.utcnow)
    approved_at: Optional[datetime] = None
    last_payout_date: Optional[datetime] = None
    next_payout_date: Optional[datetime] = None
    
    # Terms acceptance
    terms_accepted: bool = False
    terms_accepted_at: Optional[datetime] = None
    
    class Config:
        use_enum_values = True

class AffiliateClick(BaseModel):
    affiliate_code: str
    user_id: Optional[str] = None  # If user clicks while logged in
    ip_address: str
    user_agent: str
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    clicked_at: datetime = Field(default_factory=datetime.utcnow)
    converted: bool = False
    conversion_date: Optional[datetime] = None

class Commission(BaseModel):
    commission_id: str  # Unique ID
    affiliate_code: str
    user_id: str  # Affiliate user ID
    
    # Customer details
    customer_user_id: str  # User who made purchase
    customer_email: EmailStr
    
    # Transaction details
    payment_id: str  # Razorpay payment ID or Stripe payment ID
    subscription_id: Optional[str] = None
    order_amount: int  # in paise
    commission_rate: float  # Rate at time of sale
    commission_amount: int  # in paise
    
    # Status
    status: CommissionStatus = CommissionStatus.PENDING
    
    # Payment tracking
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None  # Admin user ID
    paid_at: Optional[datetime] = None
    payment_reference: Optional[str] = None  # Transaction ID
    rejection_reason: Optional[str] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        use_enum_values = True

class Payout(BaseModel):
    payout_id: str
    affiliate_code: str
    user_id: str
    
    # Payout details
    amount: int  # in paise
    currency: str = "INR"
    commission_ids: List[str]  # List of commission IDs in this payout
    
    # Payment method
    payment_method: str  # bank_transfer, upi, paypal
    payment_details: dict  # Account number, UPI ID, etc.
    
    # Processing
    status: str  # pending, processing, completed, failed
    initiated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    # Transaction reference
    transaction_id: Optional[str] = None
    receipt_url: Optional[HttpUrl] = None
    
    # Metadata
    processed_by: Optional[str] = None  # Admin user ID
    notes: Optional[str] = None

class AffiliateApplication(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    website: Optional[HttpUrl] = None
    social_media_links: List[HttpUrl] = []
    
    # Marketing experience
    audience_size: Optional[int] = None
    audience_description: str
    promotion_channels: List[str]  # blog, youtube, instagram, twitter, etc.
    
    # Why join
    motivation: str
    experience_with_cybersecurity: str
    
    # Payment preference
    preferred_payment_method: str  # bank_transfer, upi, paypal
    
    # Terms
    terms_accepted: bool
    applied_at: datetime = Field(default_factory=datetime.utcnow)

class CreateAffiliateRequest(BaseModel):
    bank_account_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc_code: Optional[str] = None
    upi_id: Optional[str] = None
    paypal_email: Optional[EmailStr] = None
    terms_accepted: bool = True

class AffiliateStats(BaseModel):
    affiliate_code: str
    total_clicks: int = 0
    total_referrals: int = 0
    successful_conversions: int = 0
    conversion_rate: float = 0.0
    
    # Revenue (in paise)
    total_revenue_generated: int = 0
    total_commission_earned: int = 0
    pending_commission: int = 0
    paid_commission: int = 0
    
    # Recent activity
    clicks_this_month: int = 0
    conversions_this_month: int = 0
    revenue_this_month: int = 0
    
    # Tier info
    current_tier: str
    commission_rate: float
    next_tier: Optional[str] = None
    referrals_to_next_tier: Optional[int] = None
    
    # Top performing links
    top_traffic_sources: List[dict] = []

class AffiliateLeaderboard(BaseModel):
    rank: int
    affiliate_code: str
    full_name: str
    total_referrals: int
    total_revenue_generated: int  # in paise
    commission_earned: int  # in paise
    tier: str
