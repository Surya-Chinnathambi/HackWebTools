from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Optional, List

from app.models.affiliate import (
    CreateAffiliateRequest, AffiliateApplication
)
from app.models.user import User
from app.services.affiliate_service import AffiliateService
from app.middleware.auth import get_current_user
from app.core.database import get_database

router = APIRouter(prefix="/affiliates", tags=["Affiliate Program"])

def get_affiliate_service(db=Depends(get_database)) -> AffiliateService:
    """Get Affiliate service instance"""
    return AffiliateService(db)

@router.post("/join")
async def join_affiliate_program(
    request: CreateAffiliateRequest,
    current_user: dict = Depends(get_current_user),
    service: AffiliateService = Depends(get_affiliate_service)
):
    """
    Join the affiliate program
    
    - Generates unique affiliate code (HACK-USERNAME-XXX)
    - **20% commission** on all referrals (starter tier)
    - Commission tiers: Starter (20%), Bronze (25%), Silver (30%), Gold (35%)
    - Requires payment details for payouts
    """
    try:
        affiliate = await service.create_affiliate(str(current_user["_id"]), request)
        
        return {
            "success": True,
            "message": "Welcome to the affiliate program!",
            "data": {
                "affiliate_code": affiliate.affiliate_code,
                "referral_url": affiliate.referral_url,
                "commission_rate": affiliate.commission_rate,
                "tier": affiliate.tier
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to join affiliate program: {str(e)}")

@router.get("/my-account")
async def get_my_affiliate_account(
    current_user: dict = Depends(get_current_user),
    service: AffiliateService = Depends(get_affiliate_service)
):
    """Get current user's affiliate account details"""
    try:
        affiliate = await service.affiliates.find_one({"user_id": str(current_user["_id"])})
        
        if not affiliate:
            return {
                "success": True,
                "data": None,
                "message": "No affiliate account found"
            }
        
        # Remove sensitive data
        affiliate.pop("_id", None)
        affiliate.pop("bank_account_number", None)
        
        return {
            "success": True,
            "data": affiliate
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_affiliate_stats(
    current_user: dict = Depends(get_current_user),
    service: AffiliateService = Depends(get_affiliate_service)
):
    """
    Get detailed affiliate statistics
    
    Returns:
    - Total clicks, referrals, conversions
    - Revenue generated and commission earned
    - Current tier and commission rate
    - Progress to next tier
    - Top traffic sources
    """
    try:
        # Get user's affiliate code
        user = await service.users.find_one({"_id": current_user["_id"]})
        affiliate_code = user.get("affiliate_code")
        
        if not affiliate_code:
            raise HTTPException(status_code=404, detail="No affiliate account found")
        
        stats = await service.get_affiliate_stats(affiliate_code)
        
        return {
            "success": True,
            "data": stats.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/commissions")
async def get_my_commissions(
    status: Optional[str] = None,
    limit: int = 50,
    current_user: dict = Depends(get_current_user),
    service: AffiliateService = Depends(get_affiliate_service)
):
    """
    Get affiliate's commission history
    
    - **status**: Filter by pending, approved, paid, rejected
    - **limit**: Maximum number of records (default: 50)
    """
    try:
        # Get user's affiliate code
        user = await service.users.find_one({"_id": current_user["_id"]})
        affiliate_code = user.get("affiliate_code")
        
        if not affiliate_code:
            raise HTTPException(status_code=404, detail="No affiliate account found")
        
        # Build query
        query = {"affiliate_code": affiliate_code}
        if status:
            query["status"] = status
        
        commissions = await service.commissions.find(query).sort(
            "created_at", -1
        ).limit(limit).to_list(None)
        
        # Remove MongoDB _id
        for commission in commissions:
            commission.pop("_id", None)
        
        return {
            "success": True,
            "data": commissions,
            "count": len(commissions)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payouts")
async def get_my_payouts(
    limit: int = 20,
    current_user: dict = Depends(get_current_user),
    service: AffiliateService = Depends(get_affiliate_service)
):
    """Get affiliate's payout history"""
    try:
        # Get user's affiliate code
        user = await service.users.find_one({"_id": current_user["_id"]})
        affiliate_code = user.get("affiliate_code")
        
        if not affiliate_code:
            raise HTTPException(status_code=404, detail="No affiliate account found")
        
        payouts = await service.payouts.find({
            "affiliate_code": affiliate_code
        }).sort("initiated_at", -1).limit(limit).to_list(None)
        
        # Remove MongoDB _id and sensitive data
        for payout in payouts:
            payout.pop("_id", None)
            payout.pop("payment_details", None)
        
        return {
            "success": True,
            "data": payouts,
            "count": len(payouts)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard")
async def get_leaderboard(
    limit: int = 10,
    service: AffiliateService = Depends(get_affiliate_service)
):
    """
    Get top affiliates leaderboard (public)
    
    Shows top performers by total revenue generated
    """
    try:
        leaderboard = await service.get_leaderboard(limit)
        
        return {
            "success": True,
            "data": [lb.dict() for lb in leaderboard]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/track-click")
async def track_affiliate_click(
    request: Request,
    ref: str,  # Affiliate code from query param
    service: AffiliateService = Depends(get_affiliate_service),
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Track affiliate click (called when user visits with ?ref=CODE)
    
    - Stores click with IP, user agent, referrer, UTM params
    - Increments affiliate click count
    """
    try:
        # Get request details
        ip_address = request.client.host
        user_agent = request.headers.get("user-agent", "")
        referrer = request.headers.get("referer")
        
        # Extract UTM parameters from query
        utm_source = request.query_params.get("utm_source")
        utm_medium = request.query_params.get("utm_medium")
        utm_campaign = request.query_params.get("utm_campaign")
        
        user_id = str(current_user["_id"]) if current_user else None
        
        await service.track_click(
            affiliate_code=ref,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer,
            utm_source=utm_source,
            utm_medium=utm_medium,
            utm_campaign=utm_campaign,
            user_id=user_id
        )
        
        return {"success": True}
    except Exception as e:
        # Don't fail if tracking fails
        return {"success": False, "error": str(e)}

# Admin endpoints

@router.post("/admin/commissions/{commission_id}/approve")
async def approve_commission(
    commission_id: str,
    current_user: dict = Depends(get_current_user),
    service: AffiliateService = Depends(get_affiliate_service)
):
    """Approve a pending commission (admin only)"""
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        await service.approve_commission(commission_id, str(current_user["_id"]))
        
        return {
            "success": True,
            "message": "Commission approved"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/payouts/process")
async def process_payout(
    affiliate_code: str,
    commission_ids: List[str],
    current_user: dict = Depends(get_current_user),
    service: AffiliateService = Depends(get_affiliate_service)
):
    """Process payout for approved commissions (admin only)"""
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        payout = await service.process_payout(
            affiliate_code=affiliate_code,
            commission_ids=commission_ids,
            admin_user_id=str(current_user["_id"])
        )
        
        return {
            "success": True,
            "message": "Payout processed",
            "data": {
                "payout_id": payout.payout_id,
                "amount": payout.amount,
                "payment_method": payout.payment_method
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/pending-commissions")
async def get_pending_commissions(
    current_user: dict = Depends(get_current_user),
    service: AffiliateService = Depends(get_affiliate_service)
):
    """Get all pending commissions for approval (admin only)"""
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        commissions = await service.commissions.find({
            "status": "pending"
        }).sort("created_at", -1).to_list(None)
        
        for commission in commissions:
            commission.pop("_id", None)
        
        return {
            "success": True,
            "data": commissions,
            "count": len(commissions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
