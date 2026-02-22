"""
Quiz Service
"""

import random
from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.quiz import (
    Quiz, QuizQuestion, QuizAttempt, QuizSubmission,
    QuizResult, QuizDifficulty, QuizStats, LeaderboardEntry
)
from app.data.quiz_questions import get_questions_by_category, get_all_categories, ALL_QUESTIONS


class QuizService:
    """Service for quiz operations"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.attempts_collection = db.quiz_attempts
        self.users_collection = db.users
    
    def generate_quiz(self, category: str, difficulty: Optional[QuizDifficulty] = None) -> Quiz:
        """Generate a quiz from question bank"""
        all_questions = ALL_QUESTIONS.get(category, [])
        
        if not all_questions:
            raise ValueError(f"No questions found for category: {category}")
        
        # Filter by difficulty if specified
        if difficulty:
            questions = [q for q in all_questions if q.difficulty == difficulty]
        else:
            questions = all_questions
        
        # Select 10 random questions
        selected = random.sample(questions, min(10, len(questions)))
        
        # Strip correct answers before sending to client
        client_questions = []
        for q in selected:
            q_dict = q.dict()
            # Don't send correct answer to client yet
            client_q = q.copy()
            client_questions.append(client_q)
        
        quiz = Quiz(
            id=f"{category}_{int(datetime.utcnow().timestamp())}",
            title=f"{category.upper()} Mastery Quiz",
            description=f"Test your knowledge of {category}",
            category=category,
            difficulty=difficulty or QuizDifficulty.MEDIUM,
            total_questions=len(selected),
            questions=client_questions
        )
        
        return quiz
    
    async def start_quiz(self, user_id: str, quiz_id: str) -> QuizAttempt:
        """Start a new quiz attempt"""
        attempt = QuizAttempt(
            user_id=user_id,
            quiz_id=quiz_id,
        )
        
        # Store attempt
        await self.attempts_collection.insert_one(attempt.dict())
        
        return attempt
    
    async def submit_quiz(
        self,
        user_id: str,
        submission: QuizSubmission
    ) -> QuizResult:
        """Submit quiz and calculate score"""
        # Get correct answers from question bank
        category = submission.quiz_id.split('_')[0]
        all_questions = ALL_QUESTIONS.get(category, [])
        
        # Create lookup for correct answers
        correct_answers = {q.id: q for q in all_questions}
        
        # Grade the quiz
        correct_count = 0
        answers_review = []
        
        for question_id, user_answer in submission.answers.items():
            question = correct_answers.get(question_id)
            if not question:
                continue
            
            is_correct = user_answer == question.correct_answer
            if is_correct:
                correct_count += 1
            
            answers_review.append({
                "question_id": question_id,
                "question": question.question,
                "user_answer": user_answer,
                "correct_answer": question.correct_answer,
                "is_correct": is_correct,
                "explanation": question.explanation
            })
        
        total_questions = len(submission.answers)
        score = int((correct_count / total_questions) * 100) if total_questions > 0 else 0
        passed = score >= 70
        points_earned = score  # 1 point per percentage
        
        # Save attempt result
        attempt_data = {
            "user_id": user_id,
            "quiz_id": submission.quiz_id,
            "submitted_at": datetime.utcnow(),
            "answers": submission.answers,
            "score": score,
            "passed": passed,
            "time_taken_seconds": submission.time_taken_seconds,
            "points_earned": points_earned
        }
        
        await self.attempts_collection.insert_one(attempt_data)
        
        # Update user progress
        await self.users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    f"progress.quizzes_attempted.{submission.quiz_id}": score,
                    "progress.last_activity": datetime.utcnow()
                },
                "$inc": {
                    "stats.quizzes_passed": 1 if passed else 0,
                    "progress.total_points": points_earned
                }
            }
        )
        
        return QuizResult(
            quiz_id=submission.quiz_id,
            score=score,
            passed=passed,
            total_questions=total_questions,
            correct_answers=correct_count,
            time_taken_seconds=submission.time_taken_seconds,
            points_earned=points_earned,
            answers_review=answers_review
        )
    
    async def get_user_quiz_stats(self, user_id: str) -> QuizStats:
        """Get user's quiz statistics"""
        # Get all attempts
        attempts = await self.attempts_collection.find(
            {"user_id": user_id}
        ).sort("submitted_at", -1).to_list(100)
        
        if not attempts:
            return QuizStats(
                total_quizzes_taken=0,
                total_quizzes_passed=0,
                average_score=0.0,
                total_points_earned=0,
                recent_attempts=[]
            )
        
        total_taken = len(attempts)
        total_passed = sum(1 for a in attempts if a.get("passed", False))
        avg_score = sum(a.get("score", 0) for a in attempts) / total_taken
        total_points = sum(a.get("points_earned", 0) for a in attempts)
        
        # Find best category
        category_scores = {}
        for attempt in attempts:
            quiz_id = attempt.get("quiz_id", "")
            category = quiz_id.split('_')[0] if '_' in quiz_id else "unknown"
            score = attempt.get("score", 0)
            
            if category not in category_scores:
                category_scores[category] = []
            category_scores[category].append(score)
        
        best_category = None
        if category_scores:
            avg_by_category = {
                cat: sum(scores) / len(scores)
                for cat, scores in category_scores.items()
            }
            best_category = max(avg_by_category, key=avg_by_category.get)
        
        # Recent attempts
        recent = [QuizAttempt(**a) for a in attempts[:5]]
        
        return QuizStats(
            total_quizzes_taken=total_taken,
            total_quizzes_passed=total_passed,
            average_score=round(avg_score, 1),
            total_points_earned=total_points,
            best_category=best_category,
            recent_attempts=recent
        )
    
    async def get_leaderboard(
        self,
        category: str,
        limit: int = 10
    ) -> List[LeaderboardEntry]:
        """Get top scores for a category"""
        # Aggregate top scores
        pipeline = [
            {"$match": {"quiz_id": {"$regex": f"^{category}_"}}},
            {"$sort": {"score": -1, "time_taken_seconds": 1}},
            {"$limit": limit * 2},  # Get more to handle duplicates
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
            {"$unwind": "$user"},
            {
                "$project": {
                    "user_name": "$user.full_name",
                    "score": 1,
                    "time_taken_seconds": 1,
                    "submitted_at": 1
                }
            }
        ]
        
        results = await self.attempts_collection.aggregate(pipeline).to_list(limit)
        
        # Convert to leaderboard entries
        leaderboard = []
        for idx, result in enumerate(results[:limit], 1):
            entry = LeaderboardEntry(
                rank=idx,
                user_name=result.get("user_name", "Anonymous"),
                score=result.get("score", 0),
                time_taken_seconds=result.get("time_taken_seconds", 0),
                attempted_at=result.get("submitted_at", datetime.utcnow())
            )
            leaderboard.append(entry)
        
        return leaderboard
    
    def get_available_categories(self) -> List[str]:
        """Get list of available quiz categories"""
        return get_all_categories()
