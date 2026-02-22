import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Award, CheckCircle, XCircle, Shield, Calendar,
    User, Trophy, Code, BookOpen, Search
} from "lucide-react";

interface VerifiedCertificate {
    certificate_id: string;
    title: string;
    description: string;
    username: string;
    email: string;
    certificate_type: string;
    skills_learned: string[];
    issued_date: string;
    total_points: number;
    quizzes_passed: number;
    labs_completed: number;
    learning_paths_completed: number;
    completion_percentage: number;
    issuer: string;
}

const CertificateVerification = () => {
    const { certificateId } = useParams<{ certificateId?: string }>();
    const [inputCertId, setInputCertId] = useState(certificateId || "");
    const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const verifyCertificate = async (certId: string) => {
        if (!certId.trim()) {
            setError("Please enter a certificate ID");
            return;
        }

        setLoading(true);
        setError("");
        setCertificate(null);

        try {
            // Mock verification - replace with actual API call
            // const response = await fetch(`/api/v1/certificates/verify/${certId}`);
            // if (!response.ok) throw new Error("Certificate not found");
            // const data = await response.json();

            // Mock data for demonstration
            setTimeout(() => {
                const mockCertificate: VerifiedCertificate = {
                    certificate_id: certId,
                    title: "Beginner Path Certificate",
                    description: "Successfully completed the Beginner Learning Path in Cybersecurity",
                    username: "JohnDoe",
                    email: "john@example.com",
                    certificate_type: "learning_path",
                    skills_learned: [
                        "Network Security Fundamentals",
                        "Web Application Security",
                        "SQL Injection",
                        "XSS Attacks",
                        "Security Best Practices"
                    ],
                    issued_date: new Date().toISOString(),
                    total_points: 450,
                    quizzes_passed: 12,
                    labs_completed: 5,
                    learning_paths_completed: 1,
                    completion_percentage: 100,
                    issuer: "HackWebTools Academy"
                };

                setCertificate(mockCertificate);
                setLoading(false);
            }, 1000);

        } catch (err) {
            setError("Certificate not found or invalid");
            setLoading(false);
        }
    };

    const handleVerify = () => {
        verifyCertificate(inputCertId);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "learning_path": return BookOpen;
            case "quiz_mastery": return Code;
            case "lab": return Trophy;
            default: return Award;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "learning_path": return "green";
            case "quiz_mastery": return "purple";
            case "lab": return "blue";
            default: return "yellow";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="container mx-auto py-12 px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Shield className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                        Certificate Verification
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Verify the authenticity of HackWebTools Academy certificates
                    </p>
                </div>

                {/* Verification Input */}
                <Card className="max-w-2xl mx-auto mb-12 bg-slate-900/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Enter Certificate ID
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                placeholder="CERT-2024-ABC123"
                                value={inputCertId}
                                onChange={(e) => setInputCertId(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                                className="flex-1 bg-slate-950 border-slate-700"
                            />
                            <Button
                                onClick={handleVerify}
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Certificate IDs are in the format: CERT-YYYY-XXXXXX
                        </p>
                    </CardContent>
                </Card>

                {/* Error Message */}
                {error && (
                    <Alert className="max-w-2xl mx-auto mb-8 bg-red-950/20 border-red-500/20">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-400">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Verified Certificate Display */}
                {certificate && (
                    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
                        {/* Verification Status */}
                        <Alert className="bg-green-950/20 border-green-500/20">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-400 font-semibold">
                                ✓ This certificate is authentic and verified
                            </AlertDescription>
                        </Alert>

                        {/* Certificate Details */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                            <CardHeader className="border-b border-slate-700">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl mb-2">{certificate.title}</CardTitle>
                                        <p className="text-slate-400">{certificate.description}</p>
                                    </div>
                                    {(() => {
                                        const Icon = getTypeIcon(certificate.certificate_type);
                                        return <Icon className={`h-12 w-12 text-${getTypeColor(certificate.certificate_type)}-500`} />;
                                    })()}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-6">
                                {/* Recipient Info */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Recipient
                                        </h4>
                                        <p className="text-lg font-semibold">{certificate.username}</p>
                                        <p className="text-sm text-slate-400">{certificate.email}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Issued Date
                                        </h4>
                                        <p className="text-lg font-semibold">
                                            {new Date(certificate.issued_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-sm text-slate-400">by {certificate.issuer}</p>
                                    </div>
                                </div>

                                {/* Achievement Metrics */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                        <Trophy className="h-4 w-4" />
                                        Achievement Metrics
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-950/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-400">{certificate.total_points}</div>
                                            <div className="text-xs text-slate-500">Total Points</div>
                                        </div>
                                        <div className="bg-slate-950/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-400">{certificate.quizzes_passed}</div>
                                            <div className="text-xs text-slate-500">Quizzes Passed</div>
                                        </div>
                                        <div className="bg-slate-950/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-green-400">{certificate.labs_completed}</div>
                                            <div className="text-xs text-slate-500">Labs Completed</div>
                                        </div>
                                        <div className="bg-slate-950/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-yellow-400">{certificate.completion_percentage}%</div>
                                            <div className="text-xs text-slate-500">Completion</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Learned */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                        <Code className="h-4 w-4" />
                                        Skills Learned
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {certificate.skills_learned.map((skill, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="px-3 py-1"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Certificate ID */}
                                <div className="border-t border-slate-700 pt-4">
                                    <p className="text-xs text-slate-500">
                                        Certificate ID: <span className="font-mono text-slate-400">{certificate.certificate_id}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Verification Info */}
                        <Card className="bg-blue-950/10 border-blue-500/20">
                            <CardContent className="pt-6">
                                <div className="grid md:grid-cols-3 gap-6 text-sm">
                                    <div>
                                        <h4 className="font-semibold text-blue-400 mb-2">🔒 Secure</h4>
                                        <p className="text-slate-300">
                                            Each certificate has a unique ID and is cryptographically verified for authenticity.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-400 mb-2">📋 Permanent</h4>
                                        <p className="text-slate-300">
                                            Certificates are permanently stored and can be verified at any time in the future.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-400 mb-2">🌐 Public</h4>
                                        <p className="text-slate-300">
                                            Anyone can verify the authenticity of a certificate using its unique ID.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* How to Verify Section */}
                {!certificate && !error && (
                    <Card className="max-w-2xl mx-auto bg-slate-900/30 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-lg">How to Verify a Certificate</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-300">
                            <p>1. Locate the certificate ID on the certificate (format: CERT-YYYY-XXXXXX)</p>
                            <p>2. Enter the certificate ID in the verification box above</p>
                            <p>3. Click "Verify" to check the authenticity</p>
                            <p>4. View the certificate details including recipient, skills, and achievements</p>
                            <div className="bg-blue-950/20 border border-blue-500/20 rounded-lg p-4 mt-4">
                                <p className="font-semibold text-blue-400 mb-2">💡 For Employers</p>
                                <p>
                                    Use this verification system to confirm the authenticity of certificates presented by job candidates.
                                    All certificates issued by HackWebTools Academy can be verified instantly.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CertificateVerification;
