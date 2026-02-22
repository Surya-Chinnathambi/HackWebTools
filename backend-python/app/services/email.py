"""
Email Service using SendGrid
"""

import logging
from typing import List, Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Email service using SendGrid"""
    
    def __init__(self):
        self.client = None
        if settings.SENDGRID_API_KEY:
            self.client = SendGridAPIClient(settings.SENDGRID_API_KEY)
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """Send an email"""
        try:
            if not self.client:
                logger.warning("SendGrid not configured. Email not sent.")
                logger.info(f"Would send email to: {to_email}, subject: {subject}")
                return False
            
            message = Mail(
                from_email=Email(settings.FROM_EMAIL, settings.FROM_NAME),
                to_emails=To(to_email),
                subject=subject,
                html_content=Content("text/html", html_content)
            )
            
            if text_content:
                message.add_content(Content("text/plain", text_content))
            
            response = self.client.send(message)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"✅ Email sent successfully to {to_email}")
                return True
            else:
                logger.error(f"❌ Failed to send email. Status: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error sending email: {e}")
            return False
    
    async def send_verification_email(self, to_email: str, token: str) -> bool:
        """Send email verification email"""
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f4f4f4; padding: 30px; }}
                .button {{ display: inline-block; padding: 15px 30px; background: #667eea; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🛡️ Verify Your Email</h1>
                </div>
                <div class="content">
                    <h2>Welcome to HackWebTools!</h2>
                    <p>Thanks for signing up. Please verify your email address to get started.</p>
                    <p>Click the button below to verify your email:</p>
                    <a href="{verification_url}" class="button">Verify Email Address</a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p><a href="{verification_url}">{verification_url}</a></p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>© 2026 HackWebTools - Cybersecurity Learning Platform</p>
                    <p>hacktools.suryachinnathambi.tech</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to HackWebTools!
        
        Please verify your email address by clicking the link below:
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, you can safely ignore this email.
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Verify your email - HackWebTools",
            html_content=html_content,
            text_content=text_content
        )
    
    async def send_password_reset_email(self, to_email: str, user_name: str, reset_token: str) -> bool:
        """Send password reset email"""
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                          color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f4f4f4; padding: 30px; }}
                .button {{ display: inline-block; padding: 15px 30px; background: #f5576c; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .warning {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Reset Your Password</h1>
                </div>
                <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <a href="{reset_url}" class="button">Reset Password</a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p><a href="{reset_url}">{reset_url}</a></p>
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong><br>
                        This link will expire in 1 hour for security reasons.
                        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                    </div>
                </div>
                <div class="footer">
                    <p>© 2026 HackWebTools - Cybersecurity Learning Platform</p>
                    <p>hacktools.suryachinnathambi.tech</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Password Reset Request
        
        We received a request to reset your password. Click the link below to create a new password:
        {reset_url}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Reset your password - HackWebTools",
            html_content=html_content,
            text_content=text_content
        )
    
    async def send_welcome_email(self, to_email: str, full_name: str) -> bool:
        """Send welcome email to new users"""
        dashboard_url = f"{settings.FRONTEND_URL}/dashboard"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f4f4f4; padding: 30px; }}
                .button {{ display: inline-block; padding: 15px 30px; background: #667eea; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .features {{ background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }}
                .feature {{ margin: 15px 0; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to HackWebTools!</h1>
                </div>
                <div class="content">
                    <h2>Hey {full_name or 'there'}!</h2>
                    <p>Your cybersecurity learning journey starts now. We're excited to have you!</p>
                    
                    <div class="features">
                        <h3>🚀 Get Started:</h3>
                        <div class="feature">✅ 700+ hacking tools documentation</div>
                        <div class="feature">✅ Interactive practice labs</div>
                        <div class="feature">✅ Structured learning paths</div>
                        <div class="feature">✅ Quizzes and challenges</div>
                        <div class="feature">✅ Progress tracking & certificates</div>
                    </div>
                    
                    <a href="{dashboard_url}" class="button">Go to Dashboard</a>
                    
                    <p><strong>💡 Pro Tip:</strong> Start with the Beginner path if you're new to cybersecurity!</p>
                </div>
                <div class="footer">
                    <p>© 2026 HackWebTools - Cybersecurity Learning Platform</p>
                    <p>hacktools.suryachinnathambi.tech</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Welcome to HackWebTools! 🎉",
            html_content=html_content
        )


# Global email service instance
email_service = EmailService()
