"""
Certificate Service
Generate, verify, and manage certificates
"""
from typing import List, Optional
from datetime import datetime, timedelta
import secrets
from motor.motor_asyncio import AsyncIOMotorDatabase
from urllib.parse import quote

from app.models.certificate import (
    Certificate, CertificateType, CertificateEligibility,
    CertificateRequest, CertificateResponse, CertificateVerification,
    UserCertificates, CertificateStats
)


class CertificateService:
    """Service for certificate management"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.certificates_collection = db.certificates
        
    def _generate_certificate_id(self) -> str:
        """Generate unique certificate ID"""
        year = datetime.utcnow().year
        random_part = secrets.token_hex(4).upper()
        return f"CERT-{year}-{random_part}"
    
    async def check_eligibility_learning_path(
        self, 
        user_id: str, 
        path_id: str
    ) -> CertificateEligibility:
        """Check if user is eligible for learning path certificate"""
        # Get user's path progress
        progress = await self.db.user_path_progress.find_one({
            "user_id": user_id,
            "path_id": path_id
        })
        
        if not progress:
            return CertificateEligibility(
                is_eligible=False,
                certificate_type=CertificateType.LEARNING_PATH,
                requirements_pending=["Enroll in the learning path"],
                message="You haven't started this learning path yet"
            )
        
        requirements_met = []
        requirements_pending = []
        
        # Check 100% completion
        completion = progress.get("completion_percentage", 0)
        if completion >= 100:
            requirements_met.append(f"✅ Learning path completed ({completion}%)")
        else:
            requirements_pending.append(f"❌ Complete learning path ({completion}% / 100%)")
        
        # Check quiz performance (at least 5 quizzes with 80%+)
        quiz_attempts = await self.db.quiz_results.find({
            "user_id": user_id,
            "score": {"$gte": 80}
        }).to_list(length=100)
        
        passed_quizzes = len(quiz_attempts)
        if passed_quizzes >= 5:
            requirements_met.append(f"✅ Passed {passed_quizzes} quizzes with 80%+")
        else:
            requirements_pending.append(f"❌ Pass at least 5 quizzes with 80%+ score ({passed_quizzes} / 5)")
        
        # Check lab completion (at least 3 labs)
        lab_progress = await self.db.lab_progress.find({
            "user_id": user_id,
            "completed": True
        }).to_list(length=100)
        
        labs_completed = len(lab_progress)
        if labs_completed >= 3:
            requirements_met.append(f"✅ Completed {labs_completed} practice labs")
        else:
            requirements_pending.append(f"❌ Complete at least 3 practice labs ({labs_completed} / 3)")
        
        is_eligible = len(requirements_pending) == 0
        
        return CertificateEligibility(
            is_eligible=is_eligible,
            certificate_type=CertificateType.LEARNING_PATH,
            requirements_met=requirements_met,
            requirements_pending=requirements_pending,
            completion_percentage=completion,
            message="You are eligible for a certificate!" if is_eligible else "Complete all requirements to earn your certificate"
        )
    
    async def check_eligibility_quiz_mastery(self, user_id: str) -> CertificateEligibility:
        """Check if user is eligible for quiz mastery certificate"""
        # Get all quiz attempts
        quiz_results = await self.db.quiz_results.find({
            "user_id": user_id
        }).to_list(length=1000)
        
        requirements_met = []
        requirements_pending = []
        
        # Check total quizzes passed with 90%+
        high_score_quizzes = [q for q in quiz_results if q.get("score", 0) >= 90]
        if len(high_score_quizzes) >= 10:
            requirements_met.append(f"✅ Passed {len(high_score_quizzes)} quizzes with 90%+")
        else:
            requirements_pending.append(f"❌ Pass at least 10 quizzes with 90%+ ({len(high_score_quizzes)} / 10)")
        
        # Check average score
        if quiz_results:
            avg_score = sum(q.get("score", 0) for q in quiz_results) / len(quiz_results)
            if avg_score >= 85:
                requirements_met.append(f"✅ Average score: {avg_score:.1f}%")
            else:
                requirements_pending.append(f"❌ Achieve 85% average score ({avg_score:.1f}% / 85%)")
        else:
            requirements_pending.append("❌ Take at least one quiz")
        
        is_eligible = len(requirements_pending) == 0
        
        return CertificateEligibility(
            is_eligible=is_eligible,
            certificate_type=CertificateType.QUIZ_MASTERY,
            requirements_met=requirements_met,
            requirements_pending=requirements_pending,
            message="You are eligible for Quiz Mastery certificate!" if is_eligible else "Complete all requirements"
        )
    
    async def generate_certificate(
        self, 
        user_id: str, 
        request: CertificateRequest
    ) -> CertificateResponse:
        """Generate a certificate for user"""
        # Get user details
        user = await self.db.users.find_one({"user_id": user_id})
        if not user:
            return CertificateResponse(
                success=False,
                message="User not found"
            )
        
        # Check eligibility
        eligibility = None
        if request.certificate_type == CertificateType.LEARNING_PATH:
            if not request.entity_id:
                return CertificateResponse(
                    success=False,
                    message="Learning path ID required"
                )
            eligibility = await self.check_eligibility_learning_path(user_id, request.entity_id)
        elif request.certificate_type == CertificateType.QUIZ_MASTERY:
            eligibility = await self.check_eligibility_quiz_mastery(user_id)
        
        if not eligibility or not eligibility.is_eligible:
            return CertificateResponse(
                success=False,
                message=eligibility.message if eligibility else "Not eligible"
            )
        
        # Check if certificate already exists
        existing = await self.certificates_collection.find_one({
            "user_id": user_id,
            "certificate_type": request.certificate_type,
            "entity_id": request.entity_id
        })
        
        if existing:
            cert = Certificate(**existing)
            return CertificateResponse(
                success=True,
                message="Certificate already exists",
                certificate=cert,
                pdf_url=f"/api/v1/certificates/{cert.certificate_id}/download",
                linkedin_share_url=cert.linkedin_share_url
            )
        
        # Generate new certificate
        cert_id = self._generate_certificate_id()
        
        # Gather skills and metrics
        skills_learned = []
        total_points = user.get("progress", {}).get("total_points", 0)
        
        if request.certificate_type == CertificateType.LEARNING_PATH:
            # Get path details
            from app.data.learning_paths import PATHS_BY_ID
            path = PATHS_BY_ID.get(request.entity_id)
            if path:
                title = f"{path.title} - Completion Certificate"
                description = f"Successfully completed the {path.title} learning path"
                skills_learned = [module.title for module in path.modules[:5]]  # Top 5 modules
        elif request.certificate_type == CertificateType.QUIZ_MASTERY:
            title = "Quiz Mastery Certificate"
            description = "Demonstrated exceptional knowledge across multiple cybersecurity domains"
            skills_learned = ["SQL Injection", "XSS", "Network Security", "Web Application Security"]
        else:
            title = "Achievement Certificate"
            description = "Completed cybersecurity training"
        
        # Get quiz and lab stats
        quizzes_passed = len(await self.db.quiz_results.find({
            "user_id": user_id,
            "score": {"$gte": 80}
        }).to_list(length=1000))
        
        labs_completed = len(await self.db.lab_progress.find({
            "user_id": user_id,
            "completed": True
        }).to_list(length=100))
        
        paths_completed = len(await self.db.user_path_progress.find({
            "user_id": user_id,
            "completed": True
        }).to_list(length=100))
        
        # Create verification URL
        verification_url = f"https://hackwebtools.com/verify/{cert_id}"
        
        # Create LinkedIn share URL
        linkedin_cert_url = f"https://hackwebtools.com/certificates/{cert_id}"
        linkedin_text = f"I just earned: {title} from HackWebTools Academy!"
        linkedin_share_url = f"https://www.linkedin.com/sharing/share-offsite/?url={quote(linkedin_cert_url)}"
        
        certificate = Certificate(
            certificate_id=cert_id,
            user_id=user_id,
            username=user.get("username", "Unknown"),
            email=user.get("email", ""),
            certificate_type=request.certificate_type,
            title=title,
            description=description,
            skills_learned=skills_learned,
            total_points=total_points,
            quizzes_passed=quizzes_passed,
            labs_completed=labs_completed,
            learning_paths_completed=paths_completed,
            verification_url=verification_url,
            linkedin_share_url=linkedin_share_url,
            credential_id=cert_id
        )
        
        # Save to database
        cert_dict = certificate.model_dump()
        cert_dict["entity_id"] = request.entity_id  # Store the path/course ID
        await self.certificates_collection.insert_one(cert_dict)
        
        # Update user's certificate count
        await self.db.users.update_one(
            {"user_id": user_id},
            {"$inc": {"stats.certificates_earned": 1}}
        )
        
        return CertificateResponse(
            success=True,
            message="Certificate generated successfully!",
            certificate=certificate,
            pdf_url=f"/api/v1/certificates/{cert_id}/download",
            linkedin_share_url=linkedin_share_url
        )
    
    async def verify_certificate(self, certificate_id: str) -> CertificateVerification:
        """Verify a certificate by ID"""
        cert_doc = await self.certificates_collection.find_one({
            "certificate_id": certificate_id
        })
        
        if not cert_doc:
            return CertificateVerification(
                is_valid=False,
                message="Certificate not found"
            )
        
        certificate = Certificate(**cert_doc)
        
        return CertificateVerification(
            is_valid=True,
            certificate=certificate,
            message="Certificate is valid and verified"
        )
    
    async def get_user_certificates(self, user_id: str) -> UserCertificates:
        """Get all certificates for a user"""
        certs = await self.certificates_collection.find({
            "user_id": user_id
        }).sort("issued_date", -1).to_list(length=100)
        
        certificates = [Certificate(**cert) for cert in certs]
        
        user = await self.db.users.find_one({"user_id": user_id})
        username = user.get("username", "Unknown") if user else "Unknown"
        
        return UserCertificates(
            user_id=user_id,
            username=username,
            total_certificates=len(certificates),
            certificates=certificates,
            latest_certificate=certificates[0] if certificates else None
        )
    
    async def get_certificate_stats(self) -> CertificateStats:
        """Get certificate statistics"""
        total_issued = await self.certificates_collection.count_documents({})
        
        # Issued this month
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        issued_this_month = await self.certificates_collection.count_documents({
            "issued_date": {"$gte": month_start}
        })
        
        # By type
        pipeline = [
            {"$group": {"_id": "$certificate_type", "count": {"$sum": 1}}}
        ]
        by_type_results = await self.certificates_collection.aggregate(pipeline).to_list(length=10)
        by_type = {item["_id"]: item["count"] for item in by_type_results}
        
        # Top achievers
        pipeline = [
            {"$group": {
                "_id": "$user_id",
                "certificate_count": {"$sum": 1},
                "username": {"$first": "$username"}
            }},
            {"$sort": {"certificate_count": -1}},
            {"$limit": 10}
        ]
        top_achievers_results = await self.certificates_collection.aggregate(pipeline).to_list(length=10)
        top_achievers = [
            {
                "username": item["username"],
                "certificate_count": item["certificate_count"]
            }
            for item in top_achievers_results
        ]
        
        return CertificateStats(
            total_issued=total_issued,
            issued_this_month=issued_this_month,
            by_type=by_type,
            top_achievers=top_achievers
        )
