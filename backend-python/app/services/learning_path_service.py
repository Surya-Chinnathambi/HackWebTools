"""
Learning Path Service
"""

from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.learning_path import (
    LearningPath, UserPathProgress, PathResponse
)
from app.data.learning_paths import get_all_paths, get_path_by_id


class LearningPathService:
    """Service for learning path operations"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db.users
    
    async def get_all_paths_with_progress(self, user_id: str) -> List[PathResponse]:
        """Get all paths with user's progress"""
        paths = get_all_paths()
        user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return [PathResponse(path=p, is_locked=self._is_path_locked(p, [])) 
                    for p in paths]
        
        user_progress_dict = user.get("progress", {}).get("learning_paths", {})
        
        result = []
        for path in paths:
            # Get user's progress for this path
            progress_data = user_progress_dict.get(path.id)
            user_progress = UserPathProgress(**progress_data) if progress_data else None
            
            # Check if path is locked
            is_locked, unlock_msg = self._check_path_lock(path, user_progress_dict)
            
            result.append(PathResponse(
                path=path,
                user_progress=user_progress,
                is_locked=is_locked,
                unlock_requirements=unlock_msg
            ))
        
        return result
    
    async def get_path_with_progress(
        self, 
        user_id: str, 
        path_id: str
    ) -> Optional[PathResponse]:
        """Get specific path with user's progress"""
        path = get_path_by_id(path_id)
        if not path:
            return None
        
        user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            is_locked, unlock_msg = self._check_path_lock(path, {})
            return PathResponse(
                path=path,
                is_locked=is_locked,
                unlock_requirements=unlock_msg
            )
        
        user_progress_dict = user.get("progress", {}).get("learning_paths", {})
        progress_data = user_progress_dict.get(path_id)
        user_progress = UserPathProgress(**progress_data) if progress_data else None
        
        is_locked, unlock_msg = self._check_path_lock(path, user_progress_dict)
        
        return PathResponse(
            path=path,
            user_progress=user_progress,
            is_locked=is_locked,
            unlock_requirements=unlock_msg
        )
    
    async def enroll_in_path(self, user_id: str, path_id: str) -> bool:
        """Enroll user in a learning path"""
        path = get_path_by_id(path_id)
        if not path:
            raise ValueError("Learning path not found")
        
        # Get user's current progress
        user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError("User not found")
        
        user_progress_dict = user.get("progress", {}).get("learning_paths", {})
        
        # Check if path is locked
        is_locked, unlock_msg = self._check_path_lock(path, user_progress_dict)
        if is_locked:
            raise ValueError(unlock_msg)
        
        # Check if already enrolled
        if path_id in user_progress_dict:
            raise ValueError("Already enrolled in this path")
        
        # Create initial progress
        initial_progress = UserPathProgress(
            path_id=path_id,
            enrolled_at=datetime.utcnow(),
            completed_modules=[],
            current_module=path.modules[0].id if path.modules else None,
            completion_percentage=0,
            is_completed=False
        )
        
        # Update user record
        result = await self.users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    f"progress.learning_paths.{path_id}": initial_progress.dict(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return result.modified_count > 0
    
    async def complete_module(
        self, 
        user_id: str, 
        path_id: str, 
        module_id: str,
        time_spent_minutes: int = 0
    ) -> bool:
        """Mark a module as completed"""
        path = get_path_by_id(path_id)
        if not path:
            raise ValueError("Learning path not found")
        
        # Verify module exists
        module = next((m for m in path.modules if m.id == module_id), None)
        if not module:
            raise ValueError("Module not found")
        
        # Get user's progress
        user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError("User not found")
        
        user_progress_dict = user.get("progress", {}).get("learning_paths", {})
        if path_id not in user_progress_dict:
            raise ValueError("Not enrolled in this path")
        
        progress_data = user_progress_dict[path_id]
        
        # Add module to completed list if not already there
        if module_id not in progress_data.get("completed_modules", []):
            completed_modules = progress_data.get("completed_modules", []) + [module_id]
            
            # Calculate new completion percentage
            completion_pct = int((len(completed_modules) / len(path.modules)) * 100)
            
            # Check if path is now complete
            is_completed = completion_pct == 100
            
            # Find next module
            current_module_order = module.order
            next_module = next(
                (m for m in path.modules if m.order == current_module_order + 1), 
                None
            )
            
            # Update progress
            update_data = {
                f"progress.learning_paths.{path_id}.completed_modules": completed_modules,
                f"progress.learning_paths.{path_id}.completion_percentage": completion_pct,
                f"progress.learning_paths.{path_id}.is_completed": is_completed,
                f"progress.learning_paths.{path_id}.current_module": next_module.id if next_module else None,
                f"progress.learning_paths.{path_id}.time_spent_hours": progress_data.get("time_spent_hours", 0) + (time_spent_minutes / 60),
                "updated_at": datetime.utcnow()
            }
            
            if is_completed:
                update_data[f"progress.learning_paths.{path_id}.completed_at"] = datetime.utcnow()
            
            result = await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            return result.modified_count > 0
        
        return False
    
    def _check_path_lock(
        self, 
        path: LearningPath, 
        user_progress: dict
    ) -> tuple[bool, Optional[str]]:
        """Check if path is locked based on prerequisites"""
        if not path.prerequisites:
            return False, None
        
        for prereq_id in path.prerequisites:
            prereq_path = get_path_by_id(prereq_id)
            if not prereq_path:
                continue
            
            prereq_progress = user_progress.get(prereq_id)
            if not prereq_progress:
                return True, f"Complete '{prereq_path.name}' first to unlock this path"
            
            completion = prereq_progress.get("completion_percentage", 0)
            required = prereq_path.completion_percentage_required
            
            if completion < required:
                return True, f"Complete at least {required}% of '{prereq_path.name}' to unlock this path (current: {completion}%)"
        
        return False, None
    
    def _is_path_locked(self, path: LearningPath, user_progress: dict) -> bool:
        """Simple check if path is locked"""
        is_locked, _ = self._check_path_lock(path, user_progress)
        return is_locked
    
    async def get_user_path_stats(self, user_id: str) -> dict:
        """Get user's overall learning path statistics"""
        user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {
                "total_paths": 0,
                "enrolled_paths": 0,
                "completed_paths": 0,
                "total_modules_completed": 0,
                "total_hours_spent": 0
            }
        
        user_progress = user.get("progress", {}).get("learning_paths", {})
        
        enrolled = len(user_progress)
        completed = sum(1 for p in user_progress.values() if p.get("is_completed", False))
        total_modules = sum(len(p.get("completed_modules", [])) for p in user_progress.values())
        total_hours = sum(p.get("time_spent_hours", 0) for p in user_progress.values())
        
        return {
            "total_paths": len(get_all_paths()),
            "enrolled_paths": enrolled,
            "completed_paths": completed,
            "total_modules_completed": total_modules,
            "total_hours_spent": round(total_hours, 1)
        }
