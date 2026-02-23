from datetime import datetime, timedelta
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import secrets
import string

from app.models.affiliate import (
    Affiliate, AffiliateClick, Commission, Payout,
    AffiliateStatus, CommissionStatus, CommissionTier,
    COMMISSION_RATES, COMMISSION_THRESHOLDS,
    CreateAffiliateRequest, AffiliateStats, AffiliateLeaderboard
)

class AffiliateService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.affiliates = db.affiliates
        self.clicks = db.affiliate_clicks
        self.commissions = db.commissions
        self.payouts = db.payouts
        self.payments = db.razorpay_payments  # To track commissions
        self.users = db.users
    
    def _generate_affiliate_code(self, username: str) -> str:
        """Generate unique affiliate code"""
        # HACK-USERNAME-XXX format
        base = username.upper()[:10]
        suffix = ''.join(secrets.choice(string.digits) for _ in range(3))
        return f"HACK-{base}-{suffix}"
    
    async def create_affiliate(self, user_id: str, request: CreateAffiliateRequest) -> Affiliate:
        """Create a new affiliate account"""
        # Check if user already has affiliate account
        existing = await self.affiliates.find_one({"user_id": user_id})
        if existing:
            raise ValueError("User already has an affiliate account")
        
        # Get user details
        user = await self.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError("User not found")
        
        # Generate unique affiliate code
        code_attempts = 0
        while code_attempts < 10:
            affiliate_code = self._generate_affiliate_code(user.get("username", "USER"))
            existing_code = await self.affiliates.find_one({"affiliate_code": affiliate_code})
            if not existing_code:
                break
            code_attempts += 1
        
        if code_attempts >= 10:
            raise ValueError("Failed to generate unique affiliate code")
        
        # Create affiliate
        affiliate = Affiliate(
            user_id=user_id,
            affiliate_code=affiliate_code,
            status=AffiliateStatus.ACTIVE,  # Auto-approve for now
            full_name=user.get("username", "User"),
            email=user["email"],
            phone=user.get("phone"),
            bank_account_name=request.bank_account_name,
            bank_account_number=request.bank_account_number,
            bank_ifsc_code=request.bank_ifsc_code,
            upi_id=request.upi_id,
            paypal_email=request.paypal_email,
            referral_url=f"https://hackwebtools.com?ref={affiliate_code}",
            terms_accepted=request.terms_accepted,
            terms_accepted_at=datetime.utcnow(),
            approved_at=datetime.utcnow()
        )
        
        await self.affiliates.insert_one(affiliate.dict())
        
        # Update user role to include affiliate
        await self.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_affiliate": True, "affiliate_code": affiliate_code}}
        )
        
        return affiliate
    
    async def track_click(
        self, 
        affiliate_code: str, 
        ip_address: str,
        user_agent: str,
        referrer: Optional[str] = None,
        utm_source: Optional[str] = None,
        utm_medium: Optional[str] = None,
        utm_campaign: Optional[str] = None,
        user_id: Optional[str] = None
    ):
        """Track affiliate click"""
        # Verify affiliate exists
        affiliate = await self.affiliates.find_one({"affiliate_code": affiliate_code})
        if not affiliate:
            return
        
        # Record click
        click = AffiliateClick(
            affiliate_code=affiliate_code,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer,
            utm_source=utm_source,
            utm_medium=utm_medium,
            utm_campaign=utm_campaign
        )
        
        await self.clicks.insert_one(click.dict())
        
        # Update affiliate click count
        await self.affiliates.update_one(
            {"affiliate_code": affiliate_code},
            {"$inc": {"click_count": 1}}
        )
    
    def _calculate_tier(self, successful_referrals: int) -> CommissionTier:
        """Calculate affiliate tier based on referrals"""
        if successful_referrals >= COMMISSION_THRESHOLDS["gold"]:
            return CommissionTier.GOLD
        elif successful_referrals >= COMMISSION_THRESHOLDS["silver"]:
            return CommissionTier.SILVER
        elif successful_referrals >= COMMISSION_THRESHOLDS["bronze"]:
            return CommissionTier.BRONZE
        return CommissionTier.STARTER
    
    async def create_commission(
        self,
        affiliate_code: str,
        customer_user_id: str,
        payment_id: str,
        order_amount: int,  # in paise
        subscription_id: Optional[str] = None
    ) -> Commission:
        """Create commission for successful referral"""
        # Get affiliate
        affiliate = await self.affiliates.find_one({"affiliate_code": affiliate_code})
        if not affiliate:
            raise ValueError("Affiliate not found")
        
        # Get customer details
        customer = await self.users.find_one({"_id": ObjectId(customer_user_id)})
        if not customer:
            raise ValueError("Customer not found")
        
        # Calculate commission rate and amount
        commission_rate = COMMISSION_RATES[affiliate["tier"]]
        commission_amount = int(order_amount * commission_rate)
        
        # Create commission record
        commission_id = f"COM-{secrets.token_hex(8).upper()}"
        
        commission = Commission(
            commission_id=commission_id,
            affiliate_code=affiliate_code,
            user_id=affiliate["user_id"],
            customer_user_id=customer_user_id,
            customer_email=customer["email"],
            payment_id=payment_id,
            subscription_id=subscription_id,
            order_amount=order_amount,
            commission_rate=commission_rate,
            commission_amount=commission_amount,
            status=CommissionStatus.PENDING  # Pending approval
        )
        
        await self.commissions.insert_one(commission.dict())
        
        # Update affiliate stats
        await self.affiliates.update_one(
            {"affiliate_code": affiliate_code},
            {
                "$inc": {
                    "total_referrals": 1,
                    "successful_referrals": 1,
                    "total_revenue_generated": order_amount,
                    "total_commission_earned": commission_amount,
                    "pending_commission": commission_amount
                }
            }
        )
        
        # Update tier if needed
        updated_affiliate = await self.affiliates.find_one({"affiliate_code": affiliate_code})
        new_tier = self._calculate_tier(updated_affiliate["successful_referrals"])
        if new_tier != updated_affiliate["tier"]:
            await self.affiliates.update_one(
                {"affiliate_code": affiliate_code},
                {
                    "$set": {
                        "tier": new_tier.value,
                        "commission_rate": COMMISSION_RATES[new_tier.value]
                    }
                }
            )
        
        # Mark click as converted
        await self.clicks.update_many(
            {
                "affiliate_code": affiliate_code,
                "user_id": customer_user_id,
                "converted": False
            },
            {
                "$set": {
                    "converted": True,
                    "conversion_date": datetime.utcnow()
                }
            }
        )
        
        return commission
    
    async def approve_commission(self, commission_id: str, admin_user_id: str):
        """Approve a pending commission"""
        commission = await self.commissions.find_one({"commission_id": commission_id})
        if not commission:
            raise ValueError("Commission not found")
        
        if commission["status"] != CommissionStatus.PENDING.value:
            raise ValueError("Commission is not pending")
        
        # Approve commission
        await self.commissions.update_one(
            {"commission_id": commission_id},
            {
                "$set": {
                    "status": CommissionStatus.APPROVED.value,
                    "approved_at": datetime.utcnow(),
                    "approved_by": admin_user_id
                }
            }
        )
        
        # Update affiliate pending to approved (but not paid yet)
        # Commission still counts as pending until payout
    
    async def process_payout(
        self,
        affiliate_code: str,
        commission_ids: List[str],
        admin_user_id: str
    ) -> Payout:
        """Process payout for approved commissions"""
        # Get affiliate
        affiliate = await self.affiliates.find_one({"affiliate_code": affiliate_code})
        if not affiliate:
            raise ValueError("Affiliate not found")
        
        # Get commissions
        commissions = await self.commissions.find({
            "commission_id": {"$in": commission_ids},
            "status": CommissionStatus.APPROVED.value
        }).to_list(None)
        
        if len(commissions) != len(commission_ids):
            raise ValueError("Some commissions not found or not approved")
        
        # Calculate total payout
        total_amount = sum(c["commission_amount"] for c in commissions)
        
        # Determine payment method
        payment_method = "bank_transfer"
        payment_details = {}
        
        if affiliate.get("upi_id"):
            payment_method = "upi"
            payment_details = {"upi_id": affiliate["upi_id"]}
        elif affiliate.get("bank_account_number"):
            payment_method = "bank_transfer"
            payment_details = {
                "account_name": affiliate.get("bank_account_name"),
                "account_number": affiliate.get("bank_account_number"),
                "ifsc_code": affiliate.get("bank_ifsc_code")
            }
        elif affiliate.get("paypal_email"):
            payment_method = "paypal"
            payment_details = {"email": affiliate["paypal_email"]}
        
        # Create payout record
        payout_id = f"PAY-{secrets.token_hex(8).upper()}"
        
        payout = Payout(
            payout_id=payout_id,
            affiliate_code=affiliate_code,
            user_id=affiliate["user_id"],
            amount=total_amount,
            commission_ids=commission_ids,
            payment_method=payment_method,
            payment_details=payment_details,
            status="pending",
            processed_by=admin_user_id
        )
        
        await self.payouts.insert_one(payout.dict())
        
        # Mark commissions as paid
        await self.commissions.update_many(
            {"commission_id": {"$in": commission_ids}},
            {
                "$set": {
                    "status": CommissionStatus.PAID.value,
                    "paid_at": datetime.utcnow(),
                    "payment_reference": payout_id
                }
            }
        )
        
        # Update affiliate stats
        await self.affiliates.update_one(
            {"affiliate_code": affiliate_code},
            {
                "$inc": {
                    "total_commission_paid": total_amount,
                    "pending_commission": -total_amount
                },
                "$set": {
                    "last_payout_date": datetime.utcnow(),
                    "next_payout_date": datetime.utcnow() + timedelta(days=30)
                }
            }
        )
        
        return payout
    
    async def get_affiliate_stats(self, affiliate_code: str) -> AffiliateStats:
        """Get detailed affiliate statistics"""
        affiliate = await self.affiliates.find_one({"affiliate_code": affiliate_code})
        if not affiliate:
            raise ValueError("Affiliate not found")
        
        # Get this month's stats
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
        
        clicks_this_month = await self.clicks.count_documents({
            "affiliate_code": affiliate_code,
            "clicked_at": {"$gte": month_start}
        })
        
        conversions_this_month = await self.commissions.count_documents({
            "affiliate_code": affiliate_code,
            "created_at": {"$gte": month_start}
        })
        
        revenue_this_month_docs = await self.commissions.find({
            "affiliate_code": affiliate_code,
            "created_at": {"$gte": month_start}
        }).to_list(None)
        revenue_this_month = sum(c["order_amount"] for c in revenue_this_month_docs)
        
        # Calculate next tier info
        current_tier = affiliate["tier"]
        next_tier = None
        referrals_to_next = None
        
        if current_tier == "starter":
            next_tier = "bronze"
            referrals_to_next = COMMISSION_THRESHOLDS["bronze"] - affiliate["successful_referrals"]
        elif current_tier == "bronze":
            next_tier = "silver"
            referrals_to_next = COMMISSION_THRESHOLDS["silver"] - affiliate["successful_referrals"]
        elif current_tier == "silver":
            next_tier = "gold"
            referrals_to_next = COMMISSION_THRESHOLDS["gold"] - affiliate["successful_referrals"]
        
        # Top traffic sources
        traffic_pipeline = [
            {"$match": {"affiliate_code": affiliate_code}},
            {"$group": {
                "_id": "$utm_source",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        traffic_sources = await self.clicks.aggregate(traffic_pipeline).to_list(None)
        
        return AffiliateStats(
            affiliate_code=affiliate_code,
            total_clicks=affiliate["click_count"],
            total_referrals=affiliate["total_referrals"],
            successful_conversions=affiliate["successful_referrals"],
            conversion_rate=affiliate["successful_referrals"] / affiliate["click_count"] if affiliate["click_count"] > 0 else 0,
            total_revenue_generated=affiliate["total_revenue_generated"],
            total_commission_earned=affiliate["total_commission_earned"],
            pending_commission=affiliate["pending_commission"],
            paid_commission=affiliate["total_commission_paid"],
            clicks_this_month=clicks_this_month,
            conversions_this_month=conversions_this_month,
            revenue_this_month=revenue_this_month,
            current_tier=current_tier,
            commission_rate=affiliate["commission_rate"],
            next_tier=next_tier,
            referrals_to_next_tier=referrals_to_next if referrals_to_next and referrals_to_next > 0 else None,
            top_traffic_sources=[
                {"source": t["_id"] or "direct", "clicks": t["count"]}
                for t in traffic_sources
            ]
        )
    
    async def get_leaderboard(self, limit: int = 10) -> List[AffiliateLeaderboard]:
        """Get top affiliates leaderboard"""
        affiliates = await self.affiliates.find(
            {"status": AffiliateStatus.ACTIVE.value}
        ).sort("total_revenue_generated", -1).limit(limit).to_list(None)
        
        leaderboard = []
        for idx, affiliate in enumerate(affiliates, 1):
            leaderboard.append(AffiliateLeaderboard(
                rank=idx,
                affiliate_code=affiliate["affiliate_code"],
                full_name=affiliate["full_name"],
                total_referrals=affiliate["successful_referrals"],
                total_revenue_generated=affiliate["total_revenue_generated"],
                commission_earned=affiliate["total_commission_earned"],
                tier=affiliate["tier"]
            ))
        
        return leaderboard
