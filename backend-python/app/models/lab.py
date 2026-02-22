"""
Lab Practice Models
Track user progress in interactive security labs
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum


class LabType(str, Enum):
    """Types of practice labs"""
    SQL_INJECTION = "sql_injection"
    XSS = "xss"
    JWT = "jwt"
    COMMAND_INJECTION = "command_injection"
    DIRECTORY_TRAVERSAL = "directory_traversal"
    CSRF = "csrf"
    SSRF = "ssrf"


class LabDifficulty(str, Enum):
    """Lab difficulty levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class LabChallenge(BaseModel):
    """Individual challenge within a lab"""
    challenge_id: str
    title: str
    description: str
    flag: str
    points: int = 10
    hints: List[str] = []
    completed: bool = False
    completed_at: Optional[datetime] = None


class Lab(BaseModel):
    """Practice lab definition"""
    lab_id: str
    lab_type: LabType
    title: str
    description: str
    difficulty: LabDifficulty
    estimated_time: int  # minutes
    learning_objectives: List[str]
    challenges: List[LabChallenge]
    total_points: int
    resources: List[str] = []
    
    class Config:
        json_schema_extra = {
            "example": {
                "lab_id": "xss-basic",
                "lab_type": "xss",
                "title": "Cross-Site Scripting Fundamentals",
                "description": "Learn XSS by exploiting vulnerable applications",
                "difficulty": "beginner",
                "estimated_time": 30,
                "learning_objectives": ["Identify XSS", "Exploit DOM XSS"],
                "challenges": [],
                "total_points": 50
            }
        }


class UserLabProgress(BaseModel):
    """Track user progress in labs"""
    user_id: str
    lab_id: str
    lab_type: LabType
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    completed_challenges: List[str] = []  # List of challenge_ids
    total_challenges: int
    completion_percentage: float = 0.0
    points_earned: int = 0
    hints_used: int = 0
    attempts: int = 0
    completed: bool = False
    completed_at: Optional[datetime] = None
    time_spent: int = 0  # seconds


class LabSubmission(BaseModel):
    """User submission for lab challenge"""
    lab_id: str
    challenge_id: str
    flag_attempt: str
    

class LabSubmissionResult(BaseModel):
    """Result of lab submission"""
    success: bool
    message: str
    points_awarded: int = 0
    flag_correct: bool = False
    hint: Optional[str] = None
    challenge_completed: bool = False
    lab_completed: bool = False
    total_points: int = 0
    completion_percentage: float = 0.0


class LabStats(BaseModel):
    """User's overall lab statistics"""
    user_id: str
    total_labs_started: int = 0
    total_labs_completed: int = 0
    total_challenges_completed: int = 0
    total_points_earned: int = 0
    total_time_spent: int = 0  # seconds
    labs_by_type: Dict[str, int] = {}  # {lab_type: count_completed}
    favorite_lab_type: Optional[str] = None
    average_completion_time: float = 0.0  # minutes
    completion_rate: float = 0.0  # percentage


class LabLeaderboardEntry(BaseModel):
    """Leaderboard entry for labs"""
    user_id: str
    username: str
    total_points: int
    labs_completed: int
    challenges_completed: int
    rank: int
    badge: Optional[str] = None  # "Lab Master", "Speed Runner", etc.


class LabResponse(BaseModel):
    """Lab data with user progress"""
    lab: Lab
    user_progress: Optional[UserLabProgress] = None
    is_enrolled: bool = False
    
    
class AllLabsResponse(BaseModel):
    """All labs with user progress"""
    labs: List[LabResponse]
    total_labs: int
    completed_labs: int
    total_points_available: int
    user_points_earned: int
