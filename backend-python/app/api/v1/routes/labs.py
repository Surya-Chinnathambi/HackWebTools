"""
Lab API Routes
/api/v1/labs endpoints for practice labs
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

from app.models.lab import (
    LabSubmission, LabSubmissionResult, LabStats,
    LabLeaderboardEntry, LabResponse, AllLabsResponse
)
from app.models.user import User
from app.middleware.auth import get_current_user, get_optional_user
from app.services.lab_service import LabService
from app.core.database import get_database

router = APIRouter(prefix="/labs", tags=["Practice Labs"])


@router.get("/", response_model=AllLabsResponse)
async def get_all_labs(
    current_user: Optional[User] = Depends(get_optional_user),
    db = Depends(get_database)
):
    """
    Get all available practice labs with optional user progress
    
    - **Public**: Returns all labs
    - **Authenticated**: Includes user progress and enrollment status
    """
    lab_service = LabService(db)
    user_id = current_user.user_id if current_user else None
    return await lab_service.get_all_labs(user_id)


@router.get("/{lab_id}", response_model=LabResponse)
async def get_lab_by_id(
    lab_id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db = Depends(get_database)
):
    """
    Get specific lab details with user progress
    
    - **lab_id**: Lab identifier (e.g., "sql-injection-basics")
    """
    lab_service = LabService(db)
    user_id = current_user.user_id if current_user else None
    
    lab = await lab_service.get_lab_by_id(lab_id, user_id)
    if not lab:
        raise HTTPException(status_code=404, detail=f"Lab '{lab_id}' not found")
    
    return lab


@router.post("/{lab_id}/start")
async def start_lab(
    lab_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Start a lab (enroll)
    
    - **Requires authentication**
    - Creates progress tracking for the lab
    """
    lab_service = LabService(db)
    
    try:
        progress = await lab_service.start_lab(current_user.user_id, lab_id)
        return {
            "success": True,
            "message": f"Lab started successfully!",
            "progress": progress
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/submit", response_model=LabSubmissionResult)
async def submit_challenge(
    submission: LabSubmission,
    use_hint: bool = False,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Submit a challenge solution
    
    - **submission**: Lab ID, challenge ID, and flag attempt
    - **use_hint**: Request a hint if flag is incorrect
    - **Requires authentication**
    
    Returns:
    - Success/failure status
    - Points awarded
    - Hint (if requested and available)
    - Lab completion status
    """
    lab_service = LabService(db)
    return await lab_service.submit_challenge(
        current_user.user_id,
        submission,
        use_hint
    )


@router.get("/user/stats", response_model=LabStats)
async def get_user_lab_stats(
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Get user's overall lab statistics
    
    - **Requires authentication**
    - Returns total labs completed, points earned, favorite lab type, etc.
    """
    lab_service = LabService(db)
    return await lab_service.get_user_lab_stats(current_user.user_id)


@router.get("/leaderboard/all", response_model=List[LabLeaderboardEntry])
async def get_lab_leaderboard(
    limit: int = 10,
    db = Depends(get_database)
):
    """
    Get global lab leaderboard
    
    - **Public endpoint**
    - **limit**: Number of entries to return (default: 10, max: 100)
    
    Returns top users by total points and labs completed
    """
    if limit > 100:
        limit = 100
    
    lab_service = LabService(db)
    return await lab_service.get_leaderboard(limit)
