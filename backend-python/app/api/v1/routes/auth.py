"""
Authentication Routes - Registration, Login, OAuth
"""

from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings
from app.core.database import get_database
from app.core.security import (
    create_access_token, create_refresh_token,
    create_email_verification_token, decode_token,
    create_password_reset_token
)
from app.models.user import (
    User, UserCreate, UserLogin, UserResponse, TokenResponse
)
from app.services.user_service import UserService
from app.services.email import EmailService

router = APIRouter(prefix="/auth", tags=["authentication"])


# Dependency to get user service
async def get_user_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> UserService:
    return UserService(db)


# Dependency to get email service
async def get_email_service() -> EmailService:
    return EmailService()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    user_service: UserService = Depends(get_user_service),
    email_service: EmailService = Depends(get_email_service)
):
    """
    Register a new user account
    
    - Validates email format and password strength
    - Sends verification email
    - Returns user profile (without password)
    """
    try:
        # Create user
        user = await user_service.create_user(user_data)
        
        # Create verification token
        verification_token = create_email_verification_token(user.email)
        
        # Send verification email
        await email_service.send_verification_email(
            to_email=user.email,
            user_name=user.full_name,
            verification_token=verification_token
        )
        
        return UserResponse.from_user(user)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_service: UserService = Depends(get_user_service)
):
    """
    Login with email and password
    
    - Returns access token (30min) and refresh token (7 days)
    - Sets refresh token in HTTP-only cookie
    - Updates last login timestamp
    """
    # Authenticate user
    user = await user_service.authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Set refresh token in HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7 days
        samesite="lax",
        secure=settings.ENVIRONMENT == "production"
    )
    
    # Update last login
    await user_service.update_last_login(str(user.id))
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.from_user(user)
    )


@router.post("/google", response_model=TokenResponse)
async def google_auth(
    token: dict,
    response: Response,
    user_service: UserService = Depends(get_user_service),
    email_service: EmailService = Depends(get_email_service)
):
    """
    Authenticate with Google OAuth
    
    - Verifies Google ID token
    - Creates user if doesn't exist
    - Returns tokens
    """
    try:
        # Verify Google token
        id_info = id_token.verify_oauth2_token(
            token["credential"],
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid issuer')
        
        # Extract user info
        email = id_info.get('email')
        full_name = id_info.get('name')
        google_id = id_info.get('sub')
        picture = id_info.get('picture')
        
        # Create or update user
        user = await user_service.create_oauth_user(
            email=email,
            full_name=full_name,
            oauth_provider="google",
            oauth_id=google_id,
            profile_picture=picture
        )
        
        # Send welcome email for new users
        existing_user = await user_service.get_user_by_email(email)
        if not existing_user:
            await email_service.send_welcome_email(
                to_email=email,
                user_name=full_name
            )
        
        # Create tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Set refresh token cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=7 * 24 * 60 * 60,
            samesite="lax",
            secure=settings.ENVIRONMENT == "production"
        )
        
        # Update last login
        await user_service.update_last_login(str(user.id))
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.from_user(user)
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication failed: {str(e)}"
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    response: Response,
    user_service: UserService = Depends(get_user_service)
):
    """
    Refresh access token using refresh token
    
    - Validates refresh token
    - Returns new access token and refresh token
    """
    # Decode refresh token
    payload = decode_token(refresh_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get user
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create new tokens
    new_access_token = create_access_token(data={"sub": user_id})
    new_refresh_token = create_refresh_token(data={"sub": user_id})
    
    # Set new refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax",
        secure=settings.ENVIRONMENT == "production"
    )
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        user=UserResponse.from_user(user)
    )


@router.post("/verify-email")
async def verify_email(
    token: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    Verify user email with verification token
    
    - Validates verification token
    - Marks email as verified
    """
    # Decode token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    email: str = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload"
        )
    
    # Verify email
    success = await user_service.verify_user_email(email)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "Email verified successfully"}


@router.post("/forgot-password")
async def forgot_password(
    email: str,
    user_service: UserService = Depends(get_user_service),
    email_service: EmailService = Depends(get_email_service)
):
    """
    Request password reset email
    
    - Sends reset link to user's email
    - Token expires in 1 hour
    """
    # Check if user exists
    user = await user_service.get_user_by_email(email)
    if not user:
        # Don't reveal if email exists
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Create reset token
    reset_token = create_password_reset_token(email)
    
    # Send reset email
    await email_service.send_password_reset_email(
        to_email=email,
        user_name=user.full_name,
        reset_token=reset_token
    )
    
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    Reset password with reset token
    
    - Validates reset token
    - Updates user password
    """
    # Decode token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    email: str = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload"
        )
    
    # Validate password
    if len(new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )
    
    # Update password
    success = await user_service.update_password(email, new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "Password reset successfully"}


@router.post("/logout")
async def logout(response: Response):
    """
    Logout user by clearing refresh token cookie
    """
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}
