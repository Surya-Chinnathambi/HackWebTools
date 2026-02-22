"""
API v1 Router - Aggregates all route modules
"""

from fastapi import APIRouter
from app.api.v1.routes import auth, users, payments, learning_paths, quizzes, labs, certificates, razorpay, affiliates

api_router = APIRouter(prefix="/api/v1")

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(payments.router)
api_router.include_router(learning_paths.router)
api_router.include_router(quizzes.router)
api_router.include_router(labs.router)
api_router.include_router(certificates.router)
api_router.include_router(razorpay.router)
api_router.include_router(affiliates.router)
