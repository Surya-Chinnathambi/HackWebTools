"""
Learning Path Models
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime


class PathModule(BaseModel):
    """Individual module within a learning path"""
    id: str
    title: str
    description: str
    estimated_hours: int
    topics: List[str]
    resources: List[str] = []
    quiz_id: Optional[str] = None
    challenge_id: Optional[str] = None
    order: int


class LearningPath(BaseModel):
    """Learning path definition"""
    id: str
    name: str
    level: str  # beginner, intermediate, advanced
    description: str
    icon: str
    color: str
    estimated_total_hours: int
    modules: List[PathModule]
    prerequisites: List[str] = []  # IDs of required paths
    completion_percentage_required: int = 80  # % needed to unlock next level
    skills_gained: List[str]
    certificate_awarded: str


class UserPathProgress(BaseModel):
    """User's progress in a specific path"""
    path_id: str
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)
    completed_modules: List[str] = []
    current_module: Optional[str] = None
    completion_percentage: int = 0
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    time_spent_hours: int = 0


class PathEnrollmentRequest(BaseModel):
    """Request to enroll in a learning path"""
    path_id: str


class PathProgressUpdate(BaseModel):
    """Update progress in a path"""
    path_id: str
    module_id: str
    time_spent_minutes: int = 0


class PathResponse(BaseModel):
    """Response with path and user progress"""
    path: LearningPath
    user_progress: Optional[UserPathProgress] = None
    is_locked: bool = False
    unlock_requirements: Optional[str] = None
