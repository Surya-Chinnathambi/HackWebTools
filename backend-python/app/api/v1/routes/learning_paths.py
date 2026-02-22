"""
Learning Paths Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from app.core.database import get_database
from app.models.user import User
from app.models.learning_path import (
    PathResponse, PathEnrollmentRequest, PathProgressUpdate
)
from app.services.learning_path_service import LearningPathService
from app.middleware.auth import get_current_verified_user, get_optional_user

router = APIRouter(prefix="/learning-paths", tags=["learning-paths"])


async def get_path_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> LearningPathService:
    return LearningPathService(db)


@router.get("", response_model=List[PathResponse])
async def get_all_learning_paths(
    current_user: User = Depends(get_optional_user),
    path_service: LearningPathService = Depends(get_path_service)
):
    """
    Get all learning paths with user progress
    
    Returns paths with:
    - Path details
    - User's progress (if logged in)
    - Lock status based on prerequisites
    """
    user_id = str(current_user.id) if current_user else None
    
    if user_id:
        return await path_service.get_all_paths_with_progress(user_id)
    else:
        # Return paths without progress for non-authenticated users
        from app.data.learning_paths import get_all_paths
        paths = get_all_paths()
        return [PathResponse(path=p, is_locked=False) for p in paths]


@router.get("/{path_id}", response_model=PathResponse)
async def get_learning_path(
    path_id: str,
    current_user: User = Depends(get_optional_user),
    path_service: LearningPathService = Depends(get_path_service)
):
    """
    Get specific learning path with details and user progress
    """
    user_id = str(current_user.id) if current_user else None
    
    if user_id:
        path_response = await path_service.get_path_with_progress(user_id, path_id)
    else:
        from app.data.learning_paths import get_path_by_id
        path = get_path_by_id(path_id)
        if not path:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Learning path not found"
            )
        path_response = PathResponse(path=path, is_locked=False)
    
    if not path_response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning path not found"
        )
    
    return path_response


@router.post("/enroll")
async def enroll_in_path(
    request: PathEnrollmentRequest,
    current_user: User = Depends(get_current_verified_user),
    path_service: LearningPathService = Depends(get_path_service)
):
    """
    Enroll in a learning path
    
    Requirements:
    - User must be verified
    - Path must not be locked (prerequisites must be met)
    """
    try:
        success = await path_service.enroll_in_path(
            str(current_user.id),
            request.path_id
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to enroll in path"
            )
        
        return {
            "message": "Successfully enrolled in learning path",
            "path_id": request.path_id
        }
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/complete-module")
async def complete_module(
    request: PathProgressUpdate,
    current_user: User = Depends(get_current_verified_user),
    path_service: LearningPathService = Depends(get_path_service)
):
    """
    Mark a module as completed
    
    Updates:
    - Adds module to completed list
    - Calculates new completion percentage
    - Unlocks next module
    - Awards certificate if path completed
    """
    try:
        success = await path_service.complete_module(
            str(current_user.id),
            request.path_id,
            request.module_id,
            request.time_spent_minutes
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Module already completed or not found"
            )
        
        # Get updated progress
        path_response = await path_service.get_path_with_progress(
            str(current_user.id),
            request.path_id
        )
        
        response = {
            "message": "Module completed successfully",
            "completion_percentage": path_response.user_progress.completion_percentage,
            "is_path_completed": path_response.user_progress.is_completed
        }
        
        if path_response.user_progress.is_completed:
            response["certificate_awarded"] = path_response.path.certificate_awarded
        
        return response
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/my-progress/summary")
async def get_my_path_progress(
    current_user: User = Depends(get_current_verified_user),
    path_service: LearningPathService = Depends(get_path_service)
):
    """
    Get user's overall learning path statistics
    
    Returns:
    - Total paths available
    - Enrolled paths count
    - Completed paths count
    - Total modules completed
    - Total hours spent
    """
    stats = await path_service.get_user_path_stats(str(current_user.id))
    return stats


@router.get("/my-progress/detailed")
async def get_my_detailed_progress(
    current_user: User = Depends(get_current_verified_user),
    path_service: LearningPathService = Depends(get_path_service)
):
    """
    Get detailed progress for all enrolled paths
    """
    paths = await path_service.get_all_paths_with_progress(str(current_user.id))
    
    # Filter only enrolled paths
    enrolled_paths = [p for p in paths if p.user_progress is not None]
    
    return {
        "enrolled_paths": enrolled_paths,
        "total_enrolled": len(enrolled_paths),
        "completed_count": sum(1 for p in enrolled_paths if p.user_progress.is_completed)
    }


@router.get("/levels/{level}")
async def get_paths_by_level(
    level: str,
    current_user: User = Depends(get_optional_user),
    path_service: LearningPathService = Depends(get_path_service)
):
    """
    Get learning paths filtered by level
    
    Levels: beginner, intermediate, advanced
    """
    if level not in ["beginner", "intermediate", "advanced"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid level. Must be: beginner, intermediate, or advanced"
        )
    
    from app.data.learning_paths import get_paths_by_level
    paths = get_paths_by_level(level)
    
    if not current_user:
        return [PathResponse(path=p, is_locked=False) for p in paths]
    
    # Get with progress
    all_paths = await path_service.get_all_paths_with_progress(str(current_user.id))
    filtered = [p for p in all_paths if p.path.level == level]
    
    return filtered
