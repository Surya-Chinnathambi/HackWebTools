"""
HackWebTools - Python FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import logging
from datetime import datetime

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1 import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting HackWebTools Backend...")
    await connect_to_mongo()
    logger.info("✅ MongoDB connected")
    yield
    # Shutdown
    logger.info("🛑 Shutting down...")
    await close_mongo_connection()
    logger.info("✅ Cleanup complete")


# Create FastAPI app
app = FastAPI(
    title="HackWebTools API",
    description="Backend API for HackWebTools - Cybersecurity Learning Platform",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Trusted Host Middleware (security)
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*.suryachinnathambi.tech", "localhost"]
    )

# Include API routes
app.include_router(api_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "HackWebTools API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
        "docs": "/api/docs" if settings.DEBUG else "disabled"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.ENVIRONMENT
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An error occurred"
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
