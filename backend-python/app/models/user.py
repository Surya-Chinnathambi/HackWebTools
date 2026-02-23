"""
User Model and Database Schemas
"""

from datetime import datetime
from typing import Optional, List, Dict, Any, Annotated
from pydantic import BaseModel, EmailStr, Field, field_validator, BeforeValidator, ConfigDict
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema
from bson import ObjectId
from enum import Enum


def validate_object_id(v: Any) -> ObjectId:
    """Validate ObjectId"""
    if isinstance(v, ObjectId):
        return v
    if ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("Invalid ObjectId")


# Type annotation for ObjectId fields
PyObjectId = Annotated[ObjectId, BeforeValidator(validate_object_id)]


class UserSubscriptionType(str, Enum):
    """User subscription tier types"""
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class UserProgress(BaseModel):
    """User learning progress"""
    tools_completed: List[str] = Field(default_factory=list)  # Tool IDs
    pages_read: List[str] = Field(default_factory=list)  # Page URLs
    quizzes_attempted: Dict[str, Any] = Field(default_factory=dict)  # quiz_id: score
    challenges_completed: List[str] = Field(default_factory=list)  # Challenge IDs
    courses_enrolled: List[str] = Field(default_factory=list)  # Course IDs
    courses_completed: List[str] = Field(default_factory=list)  # Course IDs
    learning_paths: Dict[str, Any] = Field(default_factory=dict)  # path_id: progress%
    total_points: int = 0
    streak_days: int = 0
    last_activity: Optional[datetime] = None


class UserStats(BaseModel):
    """User statistics"""
    tools_learned: int = 0
    quizzes_passed: int = 0
    challenges_solved: int = 0
    total_study_time: int = 0  # in minutes
    certificates_earned: int = 0
    current_streak: int = 0
    longest_streak: int = 0


class UserSubscription(BaseModel):
    """User subscription details"""
    tier: str = "free"  # free, pro, enterprise
    status: str = "active"  # active, canceled, past_due
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False


class UserSettings(BaseModel):
    """User preferences and settings"""
    email_notifications: bool = True
    daily_challenge: bool = True
    weekly_summary: bool = True
    dark_mode: bool = True
    language: str = "en"
    timezone: str = "UTC"


class User(BaseModel):
    """User model"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    hashed_password: Optional[str] = None  # None for OAuth users
    
    # OAuth
    google_id: Optional[str] = None
    oauth_provider: Optional[str] = None
    profile_picture: Optional[str] = None
    
    # Verification
    is_verified: bool = False
    is_active: bool = True
    is_admin: bool = False
    
    # Progress & Stats
    progress: UserProgress = Field(default_factory=UserProgress)
    stats: UserStats = Field(default_factory=UserStats)
    
    # Subscription
    subscription: UserSubscription = Field(default_factory=UserSubscription)
    
    # Settings
    settings: UserSettings = Field(default_factory=UserSettings)
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    @field_validator('email', mode='before')
    @classmethod
    def email_lowercase(cls, v):
        return v.lower() if v else v
    
    def model_dump(self, **kwargs):
        """Override model_dump to handle ObjectId"""
        d = super().model_dump(**kwargs)
        if '_id' in d and d['_id']:
            d['_id'] = str(d['_id'])
        return d


class UserInDB(User):
    """User model as stored in database"""
    hashed_password: str


class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    
    @field_validator('email', mode='before')
    @classmethod
    def email_lowercase(cls, v):
        return v.lower()
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str
    
    @field_validator('email', mode='before')
    @classmethod
    def email_lowercase(cls, v):
        return v.lower()


class UserUpdate(BaseModel):
    """Schema for user profile update"""
    full_name: Optional[str] = None
    username: Optional[str] = None
    profile_picture: Optional[str] = None
    settings: Optional[UserSettings] = None


class UserResponse(BaseModel):
    """Schema for user response (without sensitive data)"""
    id: str = Field(..., alias="_id")
    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None
    is_verified: bool
    subscription: UserSubscription
    progress: UserProgress
    stats: UserStats
    settings: UserSettings
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        populate_by_name = True


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class PasswordReset(BaseModel):
    """Schema for password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=8)


class EmailVerification(BaseModel):
    """Schema for email verification"""
    token: str
