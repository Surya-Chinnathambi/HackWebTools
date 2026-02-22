"""
Lab Service
Handle lab enrollment, submissions, and progress tracking
"""
from typing import List, Optional, Dict
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.lab import (
    Lab, UserLabProgress, LabSubmission, LabSubmissionResult,
    LabStats, LabLeaderboardEntry, LabResponse, AllLabsResponse, LabType
)
from app.data.labs import ALL_LABS, LABS_BY_ID


class LabService:
    """Service for managing practice labs"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.lab_progress_collection = db.lab_progress
        
    async def get_all_labs(self, user_id: Optional[str] = None) -> AllLabsResponse:
        """Get all labs with optional user progress"""
        labs_response = []
        total_points_available = sum(lab.total_points for lab in ALL_LABS)
        user_points_earned = 0
        completed_labs = 0
        
        for lab in ALL_LABS:
            user_progress = None
            is_enrolled = False
            
            if user_id:
                progress_doc = await self.lab_progress_collection.find_one({
                    "user_id": user_id,
                    "lab_id": lab.lab_id
                })
                
                if progress_doc:
                    user_progress = UserLabProgress(**progress_doc)
                    is_enrolled = True
                    user_points_earned += user_progress.points_earned
                    if user_progress.completed:
                        completed_labs += 1
            
            labs_response.append(LabResponse(
                lab=lab,
                user_progress=user_progress,
                is_enrolled=is_enrolled
            ))
        
        return AllLabsResponse(
            labs=labs_response,
            total_labs=len(ALL_LABS),
            completed_labs=completed_labs,
            total_points_available=total_points_available,
            user_points_earned=user_points_earned
        )
    
    async def get_lab_by_id(self, lab_id: str, user_id: Optional[str] = None) -> Optional[LabResponse]:
        """Get specific lab with user progress"""
        lab = LABS_BY_ID.get(lab_id)
        if not lab:
            return None
        
        user_progress = None
        is_enrolled = False
        
        if user_id:
            progress_doc = await self.lab_progress_collection.find_one({
                "user_id": user_id,
                "lab_id": lab_id
            })
            
            if progress_doc:
                user_progress = UserLabProgress(**progress_doc)
                is_enrolled = True
        
        return LabResponse(
            lab=lab,
            user_progress=user_progress,
            is_enrolled=is_enrolled
        )
    
    async def start_lab(self, user_id: str, lab_id: str) -> UserLabProgress:
        """Start a new lab (enroll)"""
        lab = LABS_BY_ID.get(lab_id)
        if not lab:
            raise ValueError(f"Lab {lab_id} not found")
        
        # Check if already started
        existing = await self.lab_progress_collection.find_one({
            "user_id": user_id,
            "lab_id": lab_id
        })
        
        if existing:
            return UserLabProgress(**existing)
        
        # Create new progress entry
        progress = UserLabProgress(
            user_id=user_id,
            lab_id=lab_id,
            lab_type=lab.lab_type,
            total_challenges=len(lab.challenges),
            completed_challenges=[],
            completion_percentage=0.0,
            points_earned=0,
            attempts=0,
            completed=False
        )
        
        await self.lab_progress_collection.insert_one(progress.model_dump())
        return progress
    
    async def submit_challenge(
        self, 
        user_id: str, 
        submission: LabSubmission,
        use_hint: bool = False
    ) -> LabSubmissionResult:
        """Submit a challenge solution"""
        lab = LABS_BY_ID.get(submission.lab_id)
        if not lab:
            return LabSubmissionResult(
                success=False,
                message="Lab not found",
                flag_correct=False
            )
        
        # Find the challenge
        challenge = None
        for ch in lab.challenges:
            if ch.challenge_id == submission.challenge_id:
                challenge = ch
                break
        
        if not challenge:
            return LabSubmissionResult(
                success=False,
                message="Challenge not found",
                flag_correct=False
            )
        
        # Get or create user progress
        progress = await self.lab_progress_collection.find_one({
            "user_id": user_id,
            "lab_id": submission.lab_id
        })
        
        if not progress:
            # Auto-enroll if not already started
            progress_obj = await self.start_lab(user_id, submission.lab_id)
            progress = progress_obj.model_dump()
        
        # Increment attempts
        await self.lab_progress_collection.update_one(
            {"user_id": user_id, "lab_id": submission.lab_id},
            {
                "$inc": {"attempts": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
        
        # Check if already completed
        if submission.challenge_id in progress.get("completed_challenges", []):
            return LabSubmissionResult(
                success=True,
                message="Challenge already completed!",
                points_awarded=0,
                flag_correct=True,
                challenge_completed=True,
                lab_completed=progress.get("completed", False),
                total_points=progress.get("points_earned", 0),
                completion_percentage=progress.get("completion_percentage", 0)
            )
        
        # Validate flag
        flag_correct = submission.flag_attempt.strip() == challenge.flag
        
        if not flag_correct:
            # Wrong flag - provide hint if requested
            hint = None
            if use_hint and challenge.hints:
                hints_used = progress.get("hints_used", 0)
                if hints_used < len(challenge.hints):
                    hint = challenge.hints[hints_used]
                    await self.lab_progress_collection.update_one(
                        {"user_id": user_id, "lab_id": submission.lab_id},
                        {"$inc": {"hints_used": 1}}
                    )
            
            return LabSubmissionResult(
                success=False,
                message="Incorrect flag. Keep trying!",
                flag_correct=False,
                hint=hint,
                total_points=progress.get("points_earned", 0),
                completion_percentage=progress.get("completion_percentage", 0)
            )
        
        # Correct flag! Update progress
        completed_challenges = progress.get("completed_challenges", [])
        completed_challenges.append(submission.challenge_id)
        
        points_earned = progress.get("points_earned", 0) + challenge.points
        completion_percentage = (len(completed_challenges) / len(lab.challenges)) * 100
        lab_completed = len(completed_challenges) == len(lab.challenges)
        
        update_data = {
            "completed_challenges": completed_challenges,
            "points_earned": points_earned,
            "completion_percentage": completion_percentage,
            "completed": lab_completed,
            "last_activity": datetime.utcnow()
        }
        
        if lab_completed:
            update_data["completed_at"] = datetime.utcnow()
        
        await self.lab_progress_collection.update_one(
            {"user_id": user_id, "lab_id": submission.lab_id},
            {"$set": update_data}
        )
        
        # Update user's overall stats in users collection
        await self.db.users.update_one(
            {"user_id": user_id},
            {
                "$inc": {"progress.total_points": challenge.points},
                "$addToSet": {"progress.challenges": submission.challenge_id}
            }
        )
        
        return LabSubmissionResult(
            success=True,
            message=f"🎉 Correct! You earned {challenge.points} points!",
            points_awarded=challenge.points,
            flag_correct=True,
            challenge_completed=True,
            lab_completed=lab_completed,
            total_points=points_earned,
            completion_percentage=completion_percentage
        )
    
    async def get_user_lab_stats(self, user_id: str) -> LabStats:
        """Get user's overall lab statistics"""
        all_progress = await self.lab_progress_collection.find(
            {"user_id": user_id}
        ).to_list(length=100)
        
        total_labs_started = len(all_progress)
        total_labs_completed = sum(1 for p in all_progress if p.get("completed", False))
        total_challenges_completed = sum(len(p.get("completed_challenges", [])) for p in all_progress)
        total_points_earned = sum(p.get("points_earned", 0) for p in all_progress)
        total_time_spent = sum(p.get("time_spent", 0) for p in all_progress)
        
        # Labs by type
        labs_by_type: Dict[str, int] = {}
        for p in all_progress:
            if p.get("completed", False):
                lab_type = p.get("lab_type", "unknown")
                labs_by_type[lab_type] = labs_by_type.get(lab_type, 0) + 1
        
        # Favorite lab type
        favorite_lab_type = None
        if labs_by_type:
            favorite_lab_type = max(labs_by_type, key=labs_by_type.get)
        
        # Average completion time
        completed_times = [p.get("time_spent", 0) for p in all_progress if p.get("completed", False)]
        average_completion_time = sum(completed_times) / len(completed_times) / 60 if completed_times else 0
        
        # Completion rate
        completion_rate = (total_labs_completed / total_labs_started * 100) if total_labs_started > 0 else 0
        
        return LabStats(
            user_id=user_id,
            total_labs_started=total_labs_started,
            total_labs_completed=total_labs_completed,
            total_challenges_completed=total_challenges_completed,
            total_points_earned=total_points_earned,
            total_time_spent=total_time_spent,
            labs_by_type=labs_by_type,
            favorite_lab_type=favorite_lab_type,
            average_completion_time=average_completion_time,
            completion_rate=completion_rate
        )
    
    async def get_leaderboard(self, limit: int = 10) -> List[LabLeaderboardEntry]:
        """Get lab leaderboard"""
        pipeline = [
            {
                "$group": {
                    "_id": "$user_id",
                    "total_points": {"$sum": "$points_earned"},
                    "labs_completed": {"$sum": {"$cond": ["$completed", 1, 0]}},
                    "challenges_completed": {"$sum": {"$size": "$completed_challenges"}}
                }
            },
            {"$sort": {"total_points": -1, "labs_completed": -1}},
            {"$limit": limit}
        ]
        
        results = await self.lab_progress_collection.aggregate(pipeline).to_list(length=limit)
        
        leaderboard = []
        for rank, entry in enumerate(results, 1):
            # Get username from users collection
            user = await self.db.users.find_one({"user_id": entry["_id"]})
            username = user.get("username", "Anonymous") if user else "Unknown"
            
            # Assign badge based on rank
            badge = None
            if rank == 1:
                badge = "🏆 Lab Champion"
            elif rank == 2:
                badge = "🥈 Security Expert"
            elif rank == 3:
                badge = "🥉 Hacking Prodigy"
            elif entry["labs_completed"] >= 5:
                badge = "⭐ Lab Master"
            
            leaderboard.append(LabLeaderboardEntry(
                user_id=entry["_id"],
                username=username,
                total_points=entry["total_points"],
                labs_completed=entry["labs_completed"],
                challenges_completed=entry["challenges_completed"],
                rank=rank,
                badge=badge
            ))
        
        return leaderboard
