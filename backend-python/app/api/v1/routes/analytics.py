"""
Analytics API Routes
Track user events and provide analytics data
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from collections import defaultdict

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# In-memory storage (replace with MongoDB in production)
analytics_events = []


class AnalyticsEvent(BaseModel):
    eventName: str
    userId: Optional[str] = None
    tier: Optional[str] = None
    eventData: Optional[Dict[str, Any]] = None


# ========== ANALYTICS TRACKING ==========

@router.post("/track")
async def track_event(event: AnalyticsEvent):
    """
    Track analytics event
    
    - **eventName**: Event type (page_view, user_signup, tool_usage, etc.)
    - **userId**: Optional user ID
    - **tier**: Optional user tier (free, pro, enterprise)
    - **eventData**: Optional event metadata
    """
    try:
        event_data = {
            **event.dict(),
            "timestamp": datetime.utcnow()
        }
        
        # Store event (in production, save to MongoDB)
        analytics_events.append(event_data)
        
        # Keep only last 10,000 events in memory
        if len(analytics_events) > 10000:
            analytics_events.pop(0)
        
        # TODO: Save to MongoDB
        # await AnalyticsEvent.create(event_data)
        
        return {"success": True}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to track event: {str(e)}")


# ========== ANALYTICS SUMMARY ==========

@router.get("/summary")
async def get_analytics_summary(
    startDate: Optional[str] = Query(None, description="Start date (ISO format)"),
    endDate: Optional[str] = Query(None, description="End date (ISO format)")
):
    """
    Get analytics summary with metrics
    
    - **startDate**: Optional start date filter
    - **endDate**: Optional end date filter
    """
    try:
        # Filter events by date range
        filtered = analytics_events
        
        if startDate and endDate:
            start = datetime.fromisoformat(startDate.replace('Z', '+00:00'))
            end = datetime.fromisoformat(endDate.replace('Z', '+00:00'))
            filtered = [
                e for e in analytics_events
                if start <= e["timestamp"] <= end
            ]
        
        # Calculate metrics
        metrics = {
            "totalEvents": len(filtered),
            "pageViews": len([e for e in filtered if e["eventName"] == "page_view"]),
            "signups": len([e for e in filtered if e["eventName"] == "user_signup"]),
            "subscriptions": len([e for e in filtered if e["eventName"] == "subscription_purchase"]),
            "toolUsage": len([e for e in filtered if e["eventName"] == "tool_usage"]),
            "challengeCompletions": len([e for e in filtered if e["eventName"] == "challenge_complete"]),
            "courseEnrollments": len([e for e in filtered if e["eventName"] == "course_enroll"]),
            
            # Revenue
            "revenue": sum(
                e.get("eventData", {}).get("amount", 0)
                for e in filtered
                if e["eventName"] == "subscription_purchase"
            ),
            
            # By tier
            "byTier": {
                "free": len([e for e in filtered if e.get("tier") == "free"]),
                "pro": len([e for e in filtered if e.get("tier") == "pro"]),
                "enterprise": len([e for e in filtered if e.get("tier") == "enterprise"])
            },
            
            # Top pages
            "topPages": get_top_items(
                [e for e in filtered if e["eventName"] == "page_view"],
                "page",
                10
            ),
            
            # Top tools
            "topTools": get_top_items(
                [e for e in filtered if e["eventName"] == "tool_usage"],
                "toolName",
                10
            )
        }
        
        return metrics
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics summary: {str(e)}")


# ========== CONVERSION FUNNEL ==========

@router.get("/funnel")
async def get_conversion_funnel():
    """
    Get conversion funnel data
    
    Returns visitor → signup → pricing → purchase flow
    """
    try:
        funnel = {
            "visitors": len([e for e in analytics_events if e["eventName"] == "page_view"]),
            "signups": len([e for e in analytics_events if e["eventName"] == "user_signup"]),
            "pricingViews": len([e for e in analytics_events if e["eventName"] == "pricing_page_view"]),
            "purchases": len([e for e in analytics_events if e["eventName"] == "subscription_purchase"])
        }
        
        # Calculate conversion rates
        funnel["signupRate"] = (
            f"{(funnel['signups'] / funnel['visitors'] * 100):.2f}"
            if funnel["visitors"] > 0 else "0.00"
        )
        
        funnel["purchaseRate"] = (
            f"{(funnel['purchases'] / funnel['pricingViews'] * 100):.2f}"
            if funnel["pricingViews"] > 0 else "0.00"
        )
        
        return funnel
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get funnel data: {str(e)}")


# ========== USER TIMELINE ==========

@router.get("/timeline/{userId}")
async def get_user_timeline(userId: str):
    """
    Get user activity timeline
    
    - **userId**: User ID to get timeline for
    
    Returns last 100 events for the user
    """
    try:
        user_events = [
            e for e in analytics_events
            if e.get("userId") == userId
        ]
        
        # Sort by timestamp descending
        user_events.sort(key=lambda e: e["timestamp"], reverse=True)
        
        # Return last 100 events
        return user_events[:100]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get timeline: {str(e)}")


# ========== HELPER FUNCTIONS ==========

def get_top_items(events: List[Dict], key: str, limit: int = 10) -> List[Dict]:
    """Get top items by frequency"""
    counter = defaultdict(int)
    
    for event in events:
        event_data = event.get("eventData", {})
        value = event_data.get(key) if event_data else None
        if value:
            counter[value] += 1
    
    # Sort by count
    top_items = sorted(
        [{"name": k, "count": v} for k, v in counter.items()],
        key=lambda x: x["count"],
        reverse=True
    )
    
    return top_items[:limit]
