"""
User Routes - Profile, Progress, Dashboard
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.models.user import User, UserUpdate, UserResponse
from app.services.user_service import UserService
from app.middleware.auth import get_current_user, get_current_verified_user

router = APIRouter(prefix="/users", tags=["users"])


# Dependency to get user service
async def get_user_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> UserService:
    return UserService(db)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    return UserResponse.from_user(current_user)


@router.put("/me", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Update current user profile"""
    updated_user = await user_service.update_user(str(current_user.id), update_data)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.from_user(updated_user)


@router.get("/me/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Get comprehensive user statistics
    
    Returns:
    - Tools completed count
    - Pages read count
    - Quizzes attempted
    - Challenges completed
    - Total points
    - Current streak
    - Subscription tier
    - Certificates earned
    """
    stats = await user_service.get_user_stats(str(current_user.id))
    
    if not stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return stats


@router.get("/me/dashboard")
async def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Get dashboard data for current user
    
    Returns:
    - User stats
    - Progress overview
    - Recent activity
    - Subscription status
    """
    stats = await user_service.get_user_stats(str(current_user.id))
    
    # Build dashboard response
    dashboard_data = {
        "user": {
            "name": current_user.full_name,
            "email": current_user.email,
            "profile_picture": current_user.profile_picture,
            "is_verified": current_user.is_verified,
        },
        "stats": stats,
        "progress": {
            "tools_completed": current_user.progress.tools_completed,
            "pages_read": current_user.progress.pages_read,
            "challenges_completed": current_user.progress.challenges_completed,
            "courses_enrolled": current_user.progress.courses_enrolled,
            "total_points": current_user.progress.total_points,
            "last_activity": current_user.progress.last_activity,
        },
        "subscription": {
            "tier": current_user.subscription.tier,
            "status": current_user.subscription.status,
            "current_period_end": current_user.subscription.current_period_end,
        }
    }
    
    return dashboard_data


@router.post("/me/progress/page-read")
async def mark_page_read(
    page_url: str,
    current_user: User = Depends(get_current_verified_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Mark a documentation page as read
    
    - Updates user's reading progress
    - Updates streak if applicable
    """
    success = await user_service.mark_page_completed(str(current_user.id), page_url)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update progress"
        )
    
    # Update streak
    streak = await user_service.update_streak(str(current_user.id))
    
    return {
        "message": "Page marked as read",
        "current_streak": streak
    }


@router.post("/me/progress/tool-completed")
async def mark_tool_completed(
    tool_id: str,
    current_user: User = Depends(get_current_verified_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Mark a tool as completed
    
    - Adds tool to completed list
    - Awards points
    - Updates streak
    """
    success = await user_service.mark_tool_completed(str(current_user.id), tool_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update progress"
        )
    
    # Update streak
    streak = await user_service.update_streak(str(current_user.id))
    
    return {
        "message": "Tool marked as completed",
        "current_streak": streak,
        "points_awarded": 10  # Standard points per tool
    }


@router.post("/me/progress/quiz-score")
async def update_quiz_score(
    quiz_id: str,
    score: int,
    current_user: User = Depends(get_current_verified_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Record quiz score
    
    - Saves quiz result
    - Awards points based on score
    - Updates streak
    """
    if score < 0 or score > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Score must be between 0 and 100"
        )
    
    success = await user_service.update_quiz_score(str(current_user.id), quiz_id, score)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update quiz score"
        )
    
    # Calculate points (1 point per percent)
    points_awarded = score
    
    # Update streak
    streak = await user_service.update_streak(str(current_user.id))
    
    return {
        "message": "Quiz score recorded",
        "score": score,
        "passed": score >= 70,
        "points_awarded": points_awarded,
        "current_streak": streak
    }


@router.post("/me/progress/challenge-completed")
async def complete_challenge(
    challenge_id: str,
    points: int = 50,
    current_user: User = Depends(get_current_verified_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Mark challenge as completed
    
    - Adds challenge to completed list
    - Awards points
    - Updates streak
    """
    success = await user_service.complete_challenge(
        str(current_user.id),
        challenge_id,
        points
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to complete challenge"
        )
    
    # Update streak
    streak = await user_service.update_streak(str(current_user.id))
    
    return {
        "message": "Challenge completed successfully",
        "points_awarded": points,
        "current_streak": streak
    }


@router.get("/me/progress/streak")
async def get_current_streak(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Get current learning streak"""
    streak = await user_service.update_streak(str(current_user.id))
    
    return {
        "current_streak": streak,
        "longest_streak": current_user.stats.longest_streak or 0
    }


@router.get("/me/progress/history")
async def get_progress_history(
    current_user: User = Depends(get_current_user)
):
    """
    Get user's learning history
    
    Returns all completed items, quizzes, and challenges
    """
    return {
        "tools_completed": current_user.progress.tools_completed,
        "pages_read": current_user.progress.pages_read,
        "quizzes_attempted": current_user.progress.quizzes_attempted,
        "challenges_completed": current_user.progress.challenges_completed,
        "courses_enrolled": current_user.progress.courses_enrolled,
        "learning_paths": current_user.progress.learning_paths
    }


@router.get("/{user_id}/public-profile")
async def get_public_profile(
    user_id: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    Get public user profile (limited info)
    
    Useful for leaderboards and community features
    """
    user = await user_service.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return only public info
    return {
        "name": user.full_name,
        "profile_picture": user.profile_picture,
        "stats": {
            "tools_learned": user.stats.tools_learned,
            "challenges_solved": user.stats.challenges_solved,
            "certificates_earned": user.stats.certificates_earned,
            "current_streak": user.stats.current_streak,
            "longest_streak": user.stats.longest_streak
        },
        "member_since": user.created_at.strftime("%B %Y")
    }
