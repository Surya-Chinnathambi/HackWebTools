"""
Quiz Models
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    CODE_SNIPPET = "code_snippet"


class QuizDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuizQuestion(BaseModel):
    """Single quiz question"""
    id: str
    question: str
    question_type: QuestionType
    options: List[str]  # For multiple choice
    correct_answer: str  # Index for MC, "true"/"false" for TF, answer text for code
    explanation: str
    difficulty: QuizDifficulty
    category: str  # nmap, sqlmap, burp, etc.
    points: int = 10


class Quiz(BaseModel):
    """Quiz configuration"""
    id: str
    title: str
    description: str
    category: str
    difficulty: QuizDifficulty
    total_questions: int = 10
    time_limit_minutes: int = 15
    passing_score: int = 70
    questions: List[QuizQuestion] = []


class QuizAttempt(BaseModel):
    """User's quiz attempt"""
    id: str = Field(default_factory=lambda: str(datetime.utcnow().timestamp()))
    user_id: str
    quiz_id: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    submitted_at: Optional[datetime] = None
    answers: Dict[str, str] = {}  # question_id -> user_answer
    score: Optional[int] = None
    passed: Optional[bool] = None
    time_taken_seconds: Optional[int] = None


class QuizSubmission(BaseModel):
    """Submit quiz answers"""
    quiz_id: str
    answers: Dict[str, str]  # question_id -> answer
    time_taken_seconds: int


class QuizResult(BaseModel):
    """Quiz result after submission"""
    quiz_id: str
    score: int
    passed: bool
    total_questions: int
    correct_answers: int
    time_taken_seconds: int
    points_earned: int
    answers_review: List[Dict] = []  # Detailed review of each answer


class QuizStats(BaseModel):
    """User's quiz statistics"""
    total_quizzes_taken: int
    total_quizzes_passed: int
    average_score: float
    total_points_earned: int
    best_category: Optional[str] = None
    recent_attempts: List[QuizAttempt] = []


class LeaderboardEntry(BaseModel):
    """Leaderboard entry"""
    rank: int
    user_name: str
    score: int
    time_taken_seconds: int
    attempted_at: datetime
