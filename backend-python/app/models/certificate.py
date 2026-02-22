"""
Certificate Models
Track and generate completion certificates
"""
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum


class CertificateType(str, Enum):
    """Types of certificates"""
    LEARNING_PATH = "learning_path"
    COURSE = "course"
    LAB = "lab"
    QUIZ_MASTERY = "quiz_mastery"
    OVERALL_ACHIEVEMENT = "overall_achievement"


class SkillLevel(str, Enum):
    """Skill proficiency levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class Certificate(BaseModel):
    """Certificate document"""
    certificate_id: str  # Unique ID for verification
    user_id: str
    username: str
    email: str
    certificate_type: CertificateType
    title: str
    description: str
    skills_learned: List[str] = []
    issued_date: datetime = Field(default_factory=datetime.utcnow)
    
    # Achievement metrics
    completion_percentage: float = 100.0
    total_points: int = 0
    quizzes_passed: int = 0
    labs_completed: int = 0
    learning_paths_completed: int = 0
    
    # Verification
    verification_url: str
    is_verified: bool = True
    
    # Optional metadata
    issuer: str = "HackWebTools Academy"
    credential_id: Optional[str] = None
    linkedin_share_url: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "certificate_id": "CERT-2026-ABC123",
                "user_id": "user123",
                "username": "John Doe",
                "email": "john@example.com",
                "certificate_type": "learning_path",
                "title": "Web Application Security - Beginner Path",
                "description": "Successfully completed the Beginner Learning Path",
                "skills_learned": ["SQL Injection", "XSS", "Security Basics"],
                "total_points": 150,
                "verification_url": "https://hackwebtools.com/verify/CERT-2026-ABC123"
            }
        }


class CertificateEligibility(BaseModel):
    """Check if user is eligible for a certificate"""
    is_eligible: bool
    certificate_type: CertificateType
    requirements_met: List[str] = []
    requirements_pending: List[str] = []
    completion_percentage: float = 0.0
    message: str


class CertificateRequest(BaseModel):
    """Request to generate a certificate"""
    certificate_type: CertificateType
    entity_id: Optional[str] = None  # learning_path_id, course_id, etc.


class CertificateResponse(BaseModel):
    """Certificate generation response"""
    success: bool
    message: str
    certificate: Optional[Certificate] = None
    pdf_url: Optional[str] = None
    linkedin_share_url: Optional[str] = None


class CertificateVerification(BaseModel):
    """Certificate verification result"""
    is_valid: bool
    certificate: Optional[Certificate] = None
    message: str


class UserCertificates(BaseModel):
    """All certificates for a user"""
    user_id: str
    username: str
    total_certificates: int
    certificates: List[Certificate]
    latest_certificate: Optional[Certificate] = None


class CertificateStats(BaseModel):
    """Certificate statistics"""
    total_issued: int = 0
    issued_this_month: int = 0
    by_type: dict = {}
    top_achievers: List[dict] = []
