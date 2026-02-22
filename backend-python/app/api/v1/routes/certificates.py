"""
Certificate API Routes
/api/v1/certificates endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response

from app.models.certificate import (
    CertificateRequest, CertificateResponse, CertificateVerification,
    UserCertificates, CertificateStats, CertificateEligibility
)
from app.models.user import User
from app.middleware.auth import get_current_user
from app.services.certificate_service import CertificateService
from app.core.database import get_database

router = APIRouter(prefix="/certificates", tags=["Certificates"])


@router.post("/check-eligibility", response_model=CertificateEligibility)
async def check_certificate_eligibility(
    request: CertificateRequest,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Check if user is eligible for a certificate
    
    - **Requires authentication**
    - Returns requirements met and pending
    """
    cert_service = CertificateService(db)
    
    if request.certificate_type == "learning_path":
        if not request.entity_id:
            raise HTTPException(status_code=400, detail="Learning path ID required")
        return await cert_service.check_eligibility_learning_path(
            current_user.user_id,
            request.entity_id
        )
    elif request.certificate_type == "quiz_mastery":
        return await cert_service.check_eligibility_quiz_mastery(current_user.user_id)
    else:
        raise HTTPException(status_code=400, detail="Unsupported certificate type")


@router.post("/generate", response_model=CertificateResponse)
async def generate_certificate(
    request: CertificateRequest,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Generate a certificate
    
    - **Requires authentication**
    - Checks eligibility before generation
    - Returns certificate details and PDF download URL
    """
    cert_service = CertificateService(db)
    return await cert_service.generate_certificate(current_user.user_id, request)


@router.get("/verify/{certificate_id}", response_model=CertificateVerification)
async def verify_certificate(
    certificate_id: str,
    db = Depends(get_database)
):
    """
    Verify a certificate by ID
    
    - **Public endpoint**
    - Returns certificate details if valid
    """
    cert_service = CertificateService(db)
    return await cert_service.verify_certificate(certificate_id)


@router.get("/my-certificates", response_model=UserCertificates)
async def get_my_certificates(
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Get all certificates for current user
    
    - **Requires authentication**
    - Returns list of all earned certificates
    """
    cert_service = CertificateService(db)
    return await cert_service.get_user_certificates(current_user.user_id)


@router.get("/{certificate_id}/download")
async def download_certificate_pdf(
    certificate_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Download certificate as PDF
    
    - **Requires authentication**
    - Returns PDF file
    """
    cert_service = CertificateService(db)
    
    # Verify certificate exists and belongs to user
    verification = await cert_service.verify_certificate(certificate_id)
    if not verification.is_valid:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    if verification.certificate.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to download this certificate")
    
    # Generate PDF (simple HTML-based approach for now)
    cert = verification.certificate
    
    # Simple PDF content (HTML that can be converted to PDF)
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {{ size: A4 landscape; margin: 0; }}
            body {{
                margin: 0;
                padding: 60px;
                font-family: 'Georgia', serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
                text-align: center;
            }}
            .certificate {{
                background: white;
                padding: 80px 60px;
                border: 10px solid #667eea;
                box-shadow: 0 0 30px rgba(0,0,0,0.3);
            }}
            .header {{
                font-size: 48px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 20px;
            }}
            .subheader {{
                font-size: 24px;
                color: #666;
                margin-bottom: 40px;
            }}
            .recipient {{
                font-size: 36px;
                font-weight: bold;
                color: #333;
                margin: 30px 0;
                border-bottom: 2px solid #667eea;
                padding-bottom: 10px;
                display: inline-block;
            }}
            .description {{
                font-size: 20px;
                color: #555;
                margin: 30px 0;
                line-height: 1.6;
            }}
            .skills {{
                margin: 30px 0;
                font-size: 16px;
            }}
            .metrics {{
                display: flex;
                justify-content: center;
                gap: 40px;
                margin: 40px 0;
            }}
            .metric {{
                text-align: center;
            }}
            .metric-value {{
                font-size: 32px;
                font-weight: bold;
                color: #667eea;
            }}
            .metric-label {{
                font-size: 14px;
                color: #666;
            }}
            .footer {{
                margin-top: 60px;
                font-size: 14px;
                color: #666;
            }}
            .verification {{
                margin-top: 20px;
                font-size: 12px;
                color: #999;
            }}
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="header">🏆 CERTIFICATE OF ACHIEVEMENT</div>
            <div class="subheader">HackWebTools Academy</div>
            
            <p style="font-size: 18px; color: #666;">This certifies that</p>
            
            <div class="recipient">{cert.username}</div>
            
            <div class="description">
                <strong>{cert.title}</strong><br />
                {cert.description}
            </div>
            
            <div class="skills">
                <strong>Skills Demonstrated:</strong><br />
                {', '.join(cert.skills_learned[:5]) if cert.skills_learned else 'Multiple Security Skills'}
            </div>
            
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">{cert.total_points}</div>
                    <div class="metric-label">Points Earned</div>
                </div>
                <div class="metric">
                    <div class="metric-value">{cert.quizzes_passed}</div>
                    <div class="metric-label">Quizzes Passed</div>
                </div>
                <div class="metric">
                    <div class="metric-value">{cert.labs_completed}</div>
                    <div class="metric-label">Labs Completed</div>
                </div>
            </div>
            
            <div class="footer">
                <strong>Issued:</strong> {cert.issued_date.strftime('%B %d, %Y')}<br />
                <strong>Certificate ID:</strong> {cert.certificate_id}
            </div>
            
            <div class="verification">
                Verify at: {cert.verification_url}
            </div>
        </div>
    </body>
    </html>
    """
    
    # Return HTML (can be converted to PDF client-side or with a PDF library)
    # For production, use libraries like weasyprint, reportlab, or pdfkit
    return Response(
        content=html_content,
        media_type="text/html",
        headers={
            "Content-Disposition": f'inline; filename="certificate_{certificate_id}.html"'
        }
    )


@router.get("/stats/global", response_model=CertificateStats)
async def get_certificate_stats(
    db = Depends(get_database)
):
    """
    Get global certificate statistics
    
    - **Public endpoint**
    - Returns stats about issued certificates
    """
    cert_service = CertificateService(db)
    return await cert_service.get_certificate_stats()
