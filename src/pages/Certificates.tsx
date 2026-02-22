import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Award, Download, Share2, CheckCircle, XCircle,
    Trophy, Target, BookOpen, Code, Linkedin
} from "lucide-react";

interface Certificate {
    certificate_id: string;
    title: string;
    description: string;
    skills_learned: string[];
    issued_date: string;
    total_points: number;
    quizzes_passed: number;
    labs_completed: number;
    verification_url: string;
    linkedin_share_url?: string;
}

interface CertificateEligibility {
    is_eligible: boolean;
    certificate_type: string;
    requirements_met: string[];
    requirements_pending: string[];
    completion_percentage: number;
    message: string;
}

const Certificates = () => {
    const [myCertificates, setMyCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCertType, setSelectedCertType] = useState<string | null>(null);
    const [eligibility, setEligibility] = useState<CertificateEligibility | null>(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchMyCertificates();
    }, []);

    const fetchMyCertificates = async () => {
        try {
            // Mock data for now
            setMyCertificates([]);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching certificates:", error);
            setLoading(false);
        }
    };

    const checkEligibility = async (certType: string, entityId?: string) => {
        try {
            // Mock eligibility check
            const mockEligibility: CertificateEligibility = {
                is_eligible: false,
                certificate_type: certType,
                requirements_met: [
                    "✅ Learning path completed (100%)",
                    "✅ Passed 7 quizzes with 80%+"
                ],
                requirements_pending: [
                    "❌ Complete at least 3 practice labs (1 / 3)"
                ],
                completion_percentage: 100,
                message: "Complete all requirements to earn your certificate"
            };
            setEligibility(mockEligibility);
            setSelectedCertType(certType);
        } catch (error) {
            console.error("Error checking eligibility:", error);
        }
    };

    const generateCertificate = async (certType: string, entityId?: string) => {
        setGenerating(true);
        try {
            // Mock certificate generation
            alert("Certificate generated successfully! 🎉");
            fetchMyCertificates();
            setSelectedCertType(null);
        } catch (error) {
            console.error("Error generating certificate:", error);
            alert("Failed to generate certificate");
        } finally {
            setGenerating(false);
        }
    };

    const downloadCertificate = (certId: string) => {
        window.open(`/api/v1/certificates/${certId}/download`, '_blank');
    };

    const shareOnLinkedIn = (url: string) => {
        window.open(url, '_blank', 'width=600,height=600');
    };

    const availableCertificates = [
        {
            id: "beginner-path",
            type: "learning_path",
            title: "Beginner Path Certificate",
            description: "Complete the Beginner Learning Path",
            requirements: ["100% path completion", "5 quizzes with 80%+", "3 practice labs"],
            icon: BookOpen,
            color: "green"
        },
        {
            id: "intermediate-path",
            type: "learning_path",
            title: "Intermediate Path Certificate",
            description: "Complete the Intermediate Learning Path",
            requirements: ["100% path completion", "5 quizzes with 80%+", "3 practice labs"],
            icon: Target,
            color: "orange"
        },
        {
            id: "advanced-path",
            type: "learning_path",
            title: "Advanced Path Certificate",
            description: "Complete the Advanced Learning Path",
            requirements: ["100% path completion", "5 quizzes with 80%+", "3 practice labs"],
            icon: Trophy,
            color: "red"
        },
        {
            id: "quiz-mastery",
            type: "quiz_mastery",
            title: "Quiz Mastery Certificate",
            description: "Demonstrate exceptional quiz performance",
            requirements: ["10 quizzes with 90%+", "85% average score"],
            icon: Code,
            color: "purple"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="container mx-auto py-12 px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                        Certificates
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Earn verifiable certificates by completing learning paths, quizzes, and labs. Share your achievements on LinkedIn!
                    </p>
                </div>

                {/* My Certificates Section */}
                {myCertificates.length > 0 && (
                    <Card className="mb-12 bg-gradient-to-br from-yellow-950/20 to-orange-950/20 border-yellow-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-6 w-6 text-yellow-500" />
                                My Certificates ({myCertificates.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                {myCertificates.map((cert) => (
                                    <Card key={cert.certificate_id} className="bg-slate-900/50">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                                                    <p className="text-sm text-slate-400 mt-1">{cert.description}</p>
                                                </div>
                                                <Award className="h-8 w-8 text-yellow-500" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                                <div className="text-center">
                                                    <div className="font-bold text-lg text-purple-400">{cert.total_points}</div>
                                                    <div className="text-slate-500">Points</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-lg text-blue-400">{cert.quizzes_passed}</div>
                                                    <div className="text-slate-500">Quizzes</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-lg text-green-400">{cert.labs_completed}</div>
                                                    <div className="text-slate-500">Labs</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {cert.skills_learned.slice(0, 3).map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => downloadCertificate(cert.certificate_id)}
                                                    className="flex-1"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </Button>
                                                {cert.linkedin_share_url && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => shareOnLinkedIn(cert.linkedin_share_url!)}
                                                    >
                                                        <Linkedin className="h-4 w-4 mr-2" />
                                                        Share
                                                    </Button>
                                                )}
                                            </div>

                                            <p className="text-xs text-slate-500">
                                                Issued: {new Date(cert.issued_date).toLocaleDateString()}<br />
                                                ID: {cert.certificate_id}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Available Certificates */}
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                        <CardTitle>Available Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {availableCertificates.map((cert) => {
                                const Icon = cert.icon;
                                const colorClasses = {
                                    green: "border-green-500/20 hover:border-green-500/50",
                                    orange: "border-orange-500/20 hover:border-orange-500/50",
                                    red: "border-red-500/20 hover:border-red-500/50",
                                    purple: "border-purple-500/20 hover:border-purple-500/50"
                                };

                                return (
                                    <Card
                                        key={cert.id}
                                        className={`${colorClasses[cert.color as keyof typeof colorClasses]} border-2 transition-all`}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                                                    <p className="text-sm text-slate-400 mt-1">{cert.description}</p>
                                                </div>
                                                <Icon className={`h-8 w-8 text-${cert.color}-500`} />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <p className="text-sm font-semibold mb-2">Requirements:</p>
                                                <ul className="text-xs space-y-1 text-slate-400">
                                                    {cert.requirements.map((req, idx) => (
                                                        <li key={idx}>• {req}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <Button
                                                onClick={() => checkEligibility(cert.type, cert.id)}
                                                className="w-full"
                                                variant="outline"
                                            >
                                                Check Eligibility
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Eligibility Modal */}
                {selectedCertType && eligibility && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="max-w-2xl w-full bg-slate-900">
                            <CardHeader>
                                <CardTitle>Certificate Eligibility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Alert className={eligibility.is_eligible ? "bg-green-950/20 border-green-500/20" : "bg-blue-950/20 border-blue-500/20"}>
                                    <AlertDescription>
                                        {eligibility.message}
                                    </AlertDescription>
                                </Alert>

                                {eligibility.requirements_met.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            Requirements Met
                                        </h4>
                                        <ul className="space-y-1 text-sm">
                                            {eligibility.requirements_met.map((req, idx) => (
                                                <li key={idx} className="text-green-400">{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {eligibility.requirements_pending.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <XCircle className="h-5 w-5 text-red-500" />
                                            Requirements Pending
                                        </h4>
                                        <ul className="space-y-1 text-sm">
                                            {eligibility.requirements_pending.map((req, idx) => (
                                                <li key={idx} className="text-red-400">{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {eligibility.is_eligible ? (
                                        <Button
                                            onClick={() => generateCertificate(selectedCertType)}
                                            disabled={generating}
                                            className="flex-1"
                                        >
                                            {generating ? "Generating..." : "Generate Certificate"}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setSelectedCertType(null)}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Continue Learning
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => setSelectedCertType(null)}
                                        variant="ghost"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Info Section */}
                <Card className="mt-12 bg-blue-950/20 border-blue-500/20">
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <h4 className="font-semibold text-blue-400 mb-2">📜 Verifiable</h4>
                                <p className="text-slate-300">
                                    Each certificate includes a unique ID and verification URL for employers to validate your achievements.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-400 mb-2">💼 LinkedIn Ready</h4>
                                <p className="text-slate-300">
                                    Share your certificates directly to LinkedIn with one click to showcase your cybersecurity skills.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-400 mb-2">📥 PDF Download</h4>
                                <p className="text-slate-300">
                                    Download beautifully designed PDF certificates to add to your portfolio or resume.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Certificates;
