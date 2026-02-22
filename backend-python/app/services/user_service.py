"""
User Service - CRUD operations for users
"""

from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.user import (
    User, UserCreate, UserUpdate, UserInDB,
    UserProgress, UserStats, UserSubscription
)
from app.core.security import get_password_hash, verify_password


class UserService:
    """Service for user operations"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.users
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Check if user already exists
        existing_user = await self.collection.find_one({"email": user_data.email})
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create user document
        user_dict = {
            "email": user_data.email,
            "full_name": user_data.full_name,
            "hashed_password": get_password_hash(user_data.password),
            "is_verified": False,
            "is_active": True,
            "is_admin": False,
            "progress": UserProgress().dict(),
            "stats": UserStats().dict(),
            "subscription": UserSubscription().dict(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        return User(**user_dict)
    
    async def create_oauth_user(
        self,
        email: str,
        full_name: Optional[str],
        oauth_provider: str,
        oauth_id: str,
        profile_picture: Optional[str] = None
    ) -> User:
        """Create user from OAuth provider"""
        # Check if user exists
        existing_user = await self.collection.find_one({"email": email})
        if existing_user:
            # Update OAuth info
            await self.collection.update_one(
                {"_id": existing_user["_id"]},
                {
                    "$set": {
                        f"{oauth_provider}_id": oauth_id,
                        "oauth_provider": oauth_provider,
                        "is_verified": True,
                        "profile_picture": profile_picture,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            existing_user = await self.collection.find_one({"_id": existing_user["_id"]})
            return User(**existing_user)
        
        # Create new OAuth user
        user_dict = {
            "email": email,
            "full_name": full_name,
            f"{oauth_provider}_id": oauth_id,
            "oauth_provider": oauth_provider,
            "profile_picture": profile_picture,
            "is_verified": True,  # OAuth users are auto-verified
            "is_active": True,
            "is_admin": False,
            "progress": UserProgress().dict(),
            "stats": UserStats().dict(),
            "subscription": UserSubscription().dict(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        return User(**user_dict)
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        user_data = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user_data:
            return User(**user_data)
        return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        user_data = await self.collection.find_one({"email": email.lower()})
        if user_data:
            return User(**user_data)
        return None
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = await self.get_user_by_email(email)
        if not user or not user.hashed_password:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    async def update_user(self, user_id: str, update_data: UserUpdate) -> Optional[User]:
        """Update user profile"""
        update_dict = update_data.dict(exclude_unset=True)
        if not update_dict:
            return await self.get_user_by_id(user_id)
        
        update_dict["updated_at"] = datetime.utcnow()
        
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_dict}
        )
        
        return await self.get_user_by_id(user_id)
    
    async def verify_user_email(self, email: str) -> bool:
        """Mark user's email as verified"""
        result = await self.collection.update_one(
            {"email": email},
            {
                "$set": {
                    "is_verified": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def update_password(self, email: str, new_password: str) -> bool:
        """Update user password"""
        hashed_password = get_password_hash(new_password)
        result = await self.collection.update_one(
            {"email": email},
            {
                "$set": {
                    "hashed_password": hashed_password,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def update_last_login(self, user_id: str):
        """Update user's last login timestamp"""
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "last_login": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
    
    async def update_subscription(
        self,
        user_id: str,
        subscription_data: UserSubscription
    ) -> Optional[User]:
        """Update user subscription"""
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "subscription": subscription_data.dict(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return await self.get_user_by_id(user_id)
    
    async def mark_page_completed(self, user_id: str, page_url: str) -> bool:
        """Mark a documentation page as completed"""
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$addToSet": {"progress.pages_read": page_url},
                "$set": {
                    "progress.last_activity": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def mark_tool_completed(self, user_id: str, tool_id: str) -> bool:
        """Mark a tool as completed"""
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$addToSet": {"progress.tools_completed": tool_id},
                "$inc": {"stats.tools_learned": 1},
                "$set": {
                    "progress.last_activity": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def update_quiz_score(self, user_id: str, quiz_id: str, score: int) -> bool:
        """Update quiz score"""
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    f"progress.quizzes_attempted.{quiz_id}": score,
                    "progress.last_activity": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                "$inc": {"stats.quizzes_passed": 1 if score >= 70 else 0}
            }
        )
        return result.modified_count > 0
    
    async def complete_challenge(self, user_id: str, challenge_id: str, points: int) -> bool:
        """Mark challenge as completed and award points"""
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$addToSet": {"progress.challenges_completed": challenge_id},
                "$inc": {
                    "progress.total_points": points,
                    "stats.challenges_solved": 1
                },
                "$set": {
                    "progress.last_activity": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def update_streak(self, user_id: str) -> int:
        """Update and return user's streak"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return 0
        
        now = datetime.utcnow()
        last_activity = user.progress.last_activity
        
        if not last_activity:
            new_streak = 1
        else:
            days_diff = (now - last_activity).days
            if days_diff == 0:
                # Same day, keep streak
                new_streak = user.stats.current_streak or 1
            elif days_diff == 1:
                # Next day, increment streak
                new_streak = (user.stats.current_streak or 0) + 1
            else:
                # Streak broken, reset
                new_streak = 1
        
        # Update longest streak if needed
        longest_streak = max(user.stats.longest_streak or 0, new_streak)
        
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "stats.current_streak": new_streak,
                    "stats.longest_streak": longest_streak,
                    "progress.last_activity": now,
                    "updated_at": now
                }
            }
        )
        
        return new_streak
    
    async def get_user_stats(self, user_id: str) -> Optional[dict]:
        """Get comprehensive user statistics"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        
        return {
            "tools_completed": len(user.progress.tools_completed),
            "pages_read": len(user.progress.pages_read),
            "quizzes_attempted": len(user.progress.quizzes_attempted),
            "challenges_completed": len(user.progress.challenges_completed),
            "total_points": user.progress.total_points,
            "current_streak": user.stats.current_streak,
            "longest_streak": user.stats.longest_streak,
            "subscription_tier": user.subscription.tier,
            "certificates_earned": user.stats.certificates_earned,
            "member_since": user.created_at.strftime("%B %Y")
        }
