"""
Quiz Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional

from app.core.database import get_database
from app.models.user import User
from app.models.quiz import (
    Quiz, QuizSubmission, QuizResult, QuizStats, 
    LeaderboardEntry, QuizDifficulty
)
from app.services.quiz_service import QuizService
from app.middleware.auth import get_current_verified_user, get_optional_user

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


async def get_quiz_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> QuizService:
    return QuizService(db)


@router.get("/categories")
async def get_quiz_categories(
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Get all available quiz categories
    
    Returns list of categories like: nmap, sqli, xss, burp, metasploit
    """
    categories = quiz_service.get_available_categories()
    return {
        "categories": categories,
        "total": len(categories)
    }


@router.get("/generate/{category}", response_model=Quiz)
async def generate_quiz(
    category: str,
    difficulty: Optional[QuizDifficulty] = None,
    current_user: User = Depends(get_current_verified_user),
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Generate a new quiz for a specific category
    
    - **category**: Topic (nmap, sqli, xss, burp, metasploit)
    - **difficulty**: Optional filter (easy, medium, hard)
    
    Returns 10 random questions without correct answers
    """
    try:
        quiz = quiz_service.generate_quiz(category, difficulty)
        
        # Remove correct answers before sending to client
        for question in quiz.questions:
            question.correct_answer = ""  # Hide answer
        
        return quiz
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/submit", response_model=QuizResult)
async def submit_quiz(
    submission: QuizSubmission,
    current_user: User = Depends(get_current_verified_user),
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Submit quiz answers and get results
    
    - Grades the quiz
    - Awards points based on score
    - Updates user statistics
    - Returns detailed review with explanations
    """
    result = await quiz_service.submit_quiz(
        str(current_user.id),
        submission
    )
    
    return result


@router.get("/my-stats", response_model=QuizStats)
async def get_my_quiz_stats(
    current_user: User = Depends(get_current_verified_user),
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Get user's quiz statistics
    
    Returns:
    - Total quizzes taken
    - Total passed (70%+)
    - Average score
    - Total points earned
    - Best category
    - Recent attempts
    """
    stats = await quiz_service.get_user_quiz_stats(str(current_user.id))
    return stats


@router.get("/leaderboard/{category}", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    category: str,
    limit: int = 10,
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Get leaderboard for a specific category
    
    Ranks by:
    1. Highest score
    2. Fastest time (tie-breaker)
    
    Returns top performers
    """
    if limit > 100:
        limit = 100
    
    leaderboard = await quiz_service.get_leaderboard(category, limit)
    return leaderboard


@router.get("/practice/{category}")
async def get_practice_questions(
    category: str,
    count: int = 5,
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Get practice questions with answers (not graded)
    
    Useful for learning mode
    """
    from app.data.quiz_questions import get_questions_by_category
    
    questions = get_questions_by_category(category, count)
    
    return {
        "category": category,
        "questions": [q.dict() for q in questions],
        "total": len(questions)
    }
