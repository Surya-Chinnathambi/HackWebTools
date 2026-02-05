import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Database, AlertTriangle, CheckCircle, Play, Pause } from "lucide-react";

const VAPTEducation = () => {
    const [playing, setPlaying] = useState(true);
    const [activePhase, setActivePhase] = useState(0);

    const vaptPhases = [
        { name: "Planning", icon: "📋", color: "from-red-500 to-orange-500" },
        { name: "Discovery", icon: "🔍", color: "from-orange-500 to-amber-500" },
        { name: "Attack", icon: "⚡", color: "from-amber-500 to-red-600" },
        { name: "Reporting", icon: "📊", color: "from-red-600 to-rose-600" }
    ];

    const ciaTriad = [
        {
            name: "Confidentiality",
            icon: Lock,
            color: "text-red-600",
            description: "Information is not disclosed to unauthorized individuals",
            threats: ["Eavesdropping", "Data Breach", "Shoulder Surfing"],
            controls: ["Encryption", "Access Controls", "Authentication"]
        },
        {
            name: "Integrity",
            icon: Shield,
            color: "text-orange-600",
            description: "Information remains accurate and complete",
            threats: ["Data Tampering", "Man-in-the-Middle", "Unauthorized Modification"],
            controls: ["Hashing", "Digital Signatures", "Checksums"]
        },
        {
            name: "Availability",
            icon: Database,
            color: "text-amber-600",
            description: "Information and systems are accessible when needed",
            threats: ["DDoS Attacks", "System Failures", "Natural Disasters"],
            controls: ["Redundancy", "Backups", "Load Balancing"]
        }
    ];

    const owaspTop5 = [
        { rank: "A01", name: "Broken Access Control", severity: "critical", impact: "Unauthorized access" },
        { rank: "A02", name: "Cryptographic Failures", severity: "critical", impact: "Data exposure" },
        { rank: "A03", name: "Injection", severity: "critical", impact: "Data breach/loss" },
        { rank: "A04", name: "Insecure Design", severity: "high", impact: "System compromise" },
        { rank: "A05", name: "Security Misconfiguration", severity: "high", impact: "Unauthorized access" }
    ];

    return (
        <div className="space-y-6">
            {/* VAPT Lifecycle Animation */}
            <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-950/10 to-orange-950/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Shield className="h-6 w-6 text-red-600" />
                                VAPT Lifecycle - Interactive Process Flow
                            </CardTitle>
                            <CardDescription>Vulnerability Assessment & Penetration Testing Methodology</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPlaying(!playing)}
                            className="gap-2"
                        >
                            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            {playing ? "Pause" : "Play"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Animated Process Flow */}
                    <div className="relative h-32 bg-gradient-to-r from-red-950/20 via-orange-950/20 to-rose-950/20 rounded-lg p-6 overflow-hidden">
                        <div className="flex justify-between items-center h-full">
                            {vaptPhases.map((phase, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 relative z-10">
                                    <div
                                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center text-2xl transform transition-all duration-500 ${playing && activePhase === index ? 'scale-125 animate-pulse' : 'scale-100'
                                            }`}
                                    >
                                        {phase.icon}
                                    </div>
                                    <span className="text-sm font-semibold">{phase.name}</span>
                                </div>
                            ))}
                        </div>
                        {/* Connecting Line Animation */}
                        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-gradient-to-r from-red-500 via-orange-500 to-rose-500 animate-gradient-x" />
                    </div>

                    {/* Phase Details */}
                    <div className="grid md:grid-cols-4 gap-4">
                        {[
                            {
                                phase: "Planning",
                                steps: ["Define Scope", "Set Objectives", "Rules of Engagement", "Resource Allocation"]
                            },
                            {
                                phase: "Discovery",
                                steps: ["Reconnaissance", "Port Scanning", "Service Enumeration", "Vulnerability Scanning"]
                            },
                            {
                                phase: "Attack",
                                steps: ["Exploit Vulnerabilities", "Gain Access", "Maintain Access", "Privilege Escalation"]
                            },
                            {
                                phase: "Reporting",
                                steps: ["Document Findings", "Risk Assessment", "Recommendations", "Executive Summary"]
                            }
                        ].map((item, index) => (
                            <Card key={index} className="bg-card/50 hover:bg-card transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold">{item.phase}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-1 text-xs">
                                        {item.steps.map((step, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="cia" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cia">CIA Triad</TabsTrigger>
                    <TabsTrigger value="owasp">OWASP Top 10</TabsTrigger>
                </TabsList>

                {/* CIA Triad Tab */}
                <TabsContent value="cia" className="space-y-4">
                    <Card className="border-2 border-red-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-red-600" />
                                CIA Triad - Foundation of Information Security
                            </CardTitle>
                            <CardDescription>
                                The three pillars of cybersecurity protecting your organization's information assets
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {ciaTriad.map((principle, index) => {
                                const Icon = principle.icon;
                                return (
                                    <Card key={index} className="overflow-hidden">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="bg-gradient-to-br from-red-600/10 to-orange-600/10 p-6 md:w-48 flex items-center justify-center">
                                                <Icon className={`h-16 w-16 ${principle.color}`} />
                                            </div>
                                            <div className="flex-1 p-6">
                                                <h3 className="text-xl font-bold mb-2">{principle.name}</h3>
                                                <p className="text-muted-foreground mb-4">{principle.description}</p>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                                                            Common Threats
                                                        </h4>
                                                        <ul className="space-y-1">
                                                            {principle.threats.map((threat, idx) => (
                                                                <li key={idx} className="text-sm flex items-center gap-2">
                                                                    <span className="h-1.5 w-1.5 bg-red-500 rounded-full" />
                                                                    {threat}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                                            <Shield className="h-4 w-4 text-green-600" />
                                                            Security Controls
                                                        </h4>
                                                        <ul className="space-y-1">
                                                            {principle.controls.map((control, idx) => (
                                                                <li key={idx} className="text-sm flex items-center gap-2">
                                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                                    {control}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}

                            {/* Interactive CIA Balance Visualization */}
                            <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20">
                                <CardHeader>
                                    <CardTitle className="text-lg">Security Balance Triangle</CardTitle>
                                    <CardDescription>All three pillars must work together for effective security</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center items-center h-64 relative">
                                        <svg viewBox="0 0 200 200" className="w-full h-full">
                                            {/* Triangle */}
                                            <polygon
                                                points="100,30 30,170 170,170"
                                                fill="none"
                                                stroke="url(#gradient1)"
                                                strokeWidth="3"
                                                className="animate-pulse"
                                            />
                                            <defs>
                                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#DC2626" />
                                                    <stop offset="50%" stopColor="#EA580C" />
                                                    <stop offset="100%" stopColor="#F59E0B" />
                                                </linearGradient>
                                            </defs>

                                            {/* Labels */}
                                            <text x="100" y="20" textAnchor="middle" className="fill-red-600 text-xs font-bold">
                                                Confidentiality
                                            </text>
                                            <text x="25" y="180" textAnchor="middle" className="fill-orange-600 text-xs font-bold">
                                                Integrity
                                            </text>
                                            <text x="175" y="180" textAnchor="middle" className="fill-amber-600 text-xs font-bold">
                                                Availability
                                            </text>

                                            {/* Center point */}
                                            <circle cx="100" cy="127" r="8" className="fill-red-500 animate-pulse" />
                                            <text x="100" y="155" textAnchor="middle" className="fill-foreground text-xs font-semibold">
                                                Security
                                            </text>
                                        </svg>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* OWASP Top 10 Tab */}
                <TabsContent value="owasp" className="space-y-4">
                    <Card className="border-2 border-red-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                OWASP Top 10 - Web Application Security Risks
                            </CardTitle>
                            <CardDescription>
                                The most critical security risks to web applications (2021 Edition)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {owaspTop5.map((risk, index) => (
                                <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-red-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex flex-col items-center">
                                                    <Badge className="bg-red-600 text-white mb-1">{risk.rank}</Badge>
                                                    <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg mb-1">{risk.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{risk.impact}</p>
                                                </div>
                                            </div>
                                            <Badge variant={risk.severity === "critical" ? "destructive" : "outline"}>
                                                {risk.severity.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-2 border-orange-500/20">
                                <CardHeader>
                                    <CardTitle className="text-lg">Complete OWASP Top 10 Coverage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            "A06: Vulnerable Components",
                                            "A07: ID & Auth Failures",
                                            "A08: Software & Data Integrity",
                                            "A09: Logging & Monitoring Failures",
                                            "A10: Server-Side Request Forgery"
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full mt-4" asChild>
                                        <a href="/owasp-lab" className="flex items-center gap-2">
                                            Explore Interactive OWASP Lab
                                            <Play className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default VAPTEducation;
