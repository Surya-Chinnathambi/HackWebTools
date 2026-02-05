import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Database, AlertTriangle, CheckCircle, Play, Pause, Search, Target, FileText, Users, Clock, Network, Radar, Bug, Key, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VAPTEducation = () => {
    const [playing, setPlaying] = useState(true);
    const [activePhase, setActivePhase] = useState(0);
    const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

    // Auto-cycle through phases when playing
    useEffect(() => {
        if (!playing) return;
        const interval = setInterval(() => {
            setActivePhase((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, [playing]);

    const vaptPhases = [
        {
            name: "Planning",
            icon: Users,
            color: "from-red-500 to-orange-500",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500",
            description: "Define scope, objectives, and rules of engagement",
            timeline: "1-2 weeks",
            deliverables: ["Scope Document", "Testing Plan", "NDA & Contracts", "Resource Allocation"]
        },
        {
            name: "Discovery",
            icon: Search,
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-500/10",
            borderColor: "border-orange-500",
            description: "Reconnaissance and information gathering phase",
            timeline: "2-3 weeks",
            deliverables: ["Network Map", "Service Enumeration", "Vulnerability Report", "Attack Surface Analysis"]
        },
        {
            name: "Attack",
            icon: Target,
            color: "from-amber-500 to-red-600",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500",
            description: "Exploit vulnerabilities and attempt system compromise",
            timeline: "3-4 weeks",
            deliverables: ["Exploitation Results", "Access Logs", "Privilege Escalation Proof", "Data Exfiltration Evidence"]
        },
        {
            name: "Reporting",
            icon: FileText,
            color: "from-red-600 to-rose-600",
            bgColor: "bg-red-600/10",
            borderColor: "border-red-600",
            description: "Document findings and provide remediation guidance",
            timeline: "1-2 weeks",
            deliverables: ["Executive Summary", "Technical Report", "Risk Matrix", "Remediation Roadmap"]
        }
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
            <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-950/10 to-orange-950/10 overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <motion.div
                                        animate={{
                                            rotate: [0, -10, 10, 0],
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Shield className="h-6 w-6 text-red-600" />
                                    </motion.div>
                                    VAPT Lifecycle - Interactive Process Flow
                                </CardTitle>
                                <CardDescription>Vulnerability Assessment & Penetration Testing Methodology</CardDescription>
                            </motion.div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPlaying(!playing)}
                                className="gap-2"
                            >
                                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                {playing ? "Pause" : "Play"}
                            </Button>
                        </motion.div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Animated Process Flow - Enhanced */}
                    <div className="relative min-h-[200px] bg-gradient-to-r from-red-950/20 via-orange-950/20 to-rose-950/20 rounded-lg p-8 overflow-hidden">
                        {/* Animated background particles */}
                        <motion.div
                            className="absolute inset-0 opacity-30"
                            animate={{
                                backgroundPosition: ["0% 0%", "100% 100%"],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                backgroundImage: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 1px, transparent 1px)",
                                backgroundSize: "30px 30px"
                            }}
                        />

                        <div className="flex justify-between items-center h-full relative z-10">
                            {vaptPhases.map((phase, index) => {
                                const Icon = phase.icon;
                                const isActive = activePhase === index;
                                const isHovered = hoveredPhase === index;
                                const isPast = activePhase > index;

                                return (
                                    <motion.div
                                        key={index}
                                        className="flex flex-col items-center gap-3 relative cursor-pointer"
                                        onHoverStart={() => setHoveredPhase(index)}
                                        onHoverEnd={() => setHoveredPhase(null)}
                                        onClick={() => {
                                            setActivePhase(index);
                                            setPlaying(false);
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        animate={{
                                            y: isActive ? [-5, 5, -5] : 0,
                                        }}
                                        transition={{
                                            y: {
                                                duration: 2,
                                                repeat: isActive ? Infinity : 0,
                                                ease: "easeInOut"
                                            }
                                        }}
                                    >
                                        {/* Phase Circle */}
                                        <motion.div
                                            className={`w-20 h-20 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg relative`}
                                            animate={{
                                                scale: isActive ? [1, 1.15, 1] : 1,
                                                boxShadow: isActive
                                                    ? [
                                                        "0 0 0 0 rgba(220, 38, 38, 0.7)",
                                                        "0 0 0 15px rgba(220, 38, 38, 0)",
                                                        "0 0 0 0 rgba(220, 38, 38, 0)"
                                                    ]
                                                    : "0 0 0 0 rgba(220, 38, 38, 0)"
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: isActive ? Infinity : 0,
                                            }}
                                        >
                                            <Icon className="h-8 w-8 text-white" />

                                            {/* Checkmark for completed phases */}
                                            <AnimatePresence>
                                                {isPast && !isActive && (
                                                    <motion.div
                                                        className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        exit={{ scale: 0, rotate: 180 }}
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-white" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        {/* Phase Name */}
                                        <motion.span
                                            className={`text-sm font-semibold ${isActive ? 'text-red-600' : ''}`}
                                            animate={{
                                                scale: isActive ? [1, 1.05, 1] : 1,
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: isActive ? Infinity : 0,
                                            }}
                                        >
                                            {phase.name}
                                        </motion.span>

                                        {/* Timeline Badge */}
                                        <Badge variant="outline" className="text-xs">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {phase.timeline}
                                        </Badge>

                                        {/* Connection Arrow */}
                                        {index < vaptPhases.length - 1 && (
                                            <motion.div
                                                className="absolute left-full top-10 w-[calc(100vw/4-5rem)] h-0.5 origin-left"
                                                style={{
                                                    background: isPast || isActive
                                                        ? "linear-gradient(to right, rgba(220, 38, 38, 0.8), rgba(234, 88, 12, 0.8))"
                                                        : "rgba(156, 163, 175, 0.3)"
                                                }}
                                                animate={{
                                                    scaleX: isPast ? 1 : (isActive ? [0, 1] : 0),
                                                }}
                                                transition={{
                                                    duration: isActive ? 2.5 : 0.5,
                                                    repeat: isActive ? Infinity : 0,
                                                }}
                                            >
                                                {/* Animated dot traveling along the line */}
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full shadow-lg"
                                                        animate={{
                                                            left: ["0%", "100%"],
                                                        }}
                                                        transition={{
                                                            duration: 2.5,
                                                            repeat: Infinity,
                                                            ease: "linear"
                                                        }}
                                                    />
                                                )}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Phase Details - Enhanced */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePhase}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.5 }}
                            className={`${vaptPhases[activePhase].bgColor} border-2 ${vaptPhases[activePhase].borderColor} rounded-lg p-6`}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className={`p-3 bg-gradient-to-br ${vaptPhases[activePhase].color} rounded-lg`}>
                                    {(() => {
                                        const Icon = vaptPhases[activePhase].icon;
                                        return <Icon className="h-8 w-8 text-white" />;
                                    })()}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">{vaptPhases[activePhase].name} Phase</h3>
                                    <p className="text-muted-foreground">{vaptPhases[activePhase].description}</p>
                                </div>
                                <Badge className="bg-red-600 text-white">
                                    Phase {activePhase + 1}/4
                                </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Award className="h-4 w-4 text-red-600" />
                                        Key Deliverables
                                    </h4>
                                    <ul className="space-y-2">
                                        {vaptPhases[activePhase].deliverables.map((deliverable, idx) => (
                                            <motion.li
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-start gap-2 text-sm"
                                            >
                                                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                                                <span>{deliverable}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Network className="h-4 w-4 text-red-600" />
                                        Phase Activities
                                    </h4>
                                    <div className="space-y-2">
                                        {activePhase === 0 && (
                                            <>
                                                <ActivityItem icon={Users} text="Stakeholder meetings and kick-off" delay={0} />
                                                <ActivityItem icon={FileText} text="Documentation review" delay={0.1} />
                                                <ActivityItem icon={Target} text="Scope definition & boundaries" delay={0.2} />
                                                <ActivityItem icon={Shield} text="Legal agreements & permissions" delay={0.3} />
                                            </>
                                        )}
                                        {activePhase === 1 && (
                                            <>
                                                <ActivityItem icon={Radar} text="Passive reconnaissance" delay={0} />
                                                <ActivityItem icon={Network} text="Active network scanning" delay={0.1} />
                                                <ActivityItem icon={Search} text="Service enumeration" delay={0.2} />
                                                <ActivityItem icon={Bug} text="Automated vulnerability scanning" delay={0.3} />
                                            </>
                                        )}
                                        {activePhase === 2 && (
                                            <>
                                                <ActivityItem icon={Target} text="Manual exploitation attempts" delay={0} />
                                                <ActivityItem icon={Key} text="Credential harvesting" delay={0.1} />
                                                <ActivityItem icon={Shield} text="Privilege escalation" delay={0.2} />
                                                <ActivityItem icon={Network} text="Lateral movement testing" delay={0.3} />
                                            </>
                                        )}
                                        {activePhase === 3 && (
                                            <>
                                                <ActivityItem icon={FileText} text="Evidence compilation" delay={0} />
                                                <ActivityItem icon={AlertTriangle} text="Risk assessment & scoring" delay={0.1} />
                                                <ActivityItem icon={CheckCircle} text="Remediation recommendations" delay={0.2} />
                                                <ActivityItem icon={Users} text="Executive presentation" delay={0.3} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Phase Navigation */}
                    <div className="flex justify-center gap-2">
                        {vaptPhases.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => {
                                    setActivePhase(index);
                                    setPlaying(false);
                                }}
                                className={`h-2 rounded-full transition-all ${activePhase === index ? 'w-8 bg-red-600' : 'w-2 bg-gray-400'
                                    }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            />
                        ))}
                    </div>

                    {/* Phase Details Cards Grid */}
                    <div className="grid md:grid-cols-4 gap-4">
                        {[
                            {
                                phase: "Planning",
                                steps: ["Define Scope", "Set Objectives", "Rules of Engagement", "Resource Allocation"],
                                icon: Users,
                                color: "text-red-600"
                            },
                            {
                                phase: "Discovery",
                                steps: ["Reconnaissance", "Port Scanning", "Service Enumeration", "Vulnerability Scanning"],
                                icon: Search,
                                color: "text-orange-600"
                            },
                            {
                                phase: "Attack",
                                steps: ["Exploit Vulnerabilities", "Gain Access", "Maintain Access", "Privilege Escalation"],
                                icon: Target,
                                color: "text-amber-600"
                            },
                            {
                                phase: "Reporting",
                                steps: ["Document Findings", "Risk Assessment", "Recommendations", "Executive Summary"],
                                icon: FileText,
                                color: "text-rose-600"
                            }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{
                                        y: -5,
                                        transition: { type: "spring", stiffness: 400, damping: 25 }
                                    }}
                                >
                                    <Card className="bg-card/50 hover:bg-card transition-all duration-300 h-full border-2 hover:border-red-600/50">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon className={`h-5 w-5 ${item.color}`} />
                                                <CardTitle className="text-sm font-bold">{item.phase}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-xs">
                                                {item.steps.map((step, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                                                        <span>{step}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
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

// Helper component for activity items
const ActivityItem = ({ icon: Icon, text, delay }: { icon: any, text: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-center gap-2 text-sm"
    >
        <div className="p-1.5 bg-red-600/10 rounded">
            <Icon className="h-3 w-3 text-red-600" />
        </div>
        <span>{text}</span>
    </motion.div>
);

export default VAPTEducation;
