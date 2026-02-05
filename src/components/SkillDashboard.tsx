import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, TrendingUp, Calendar, Download, Share2 } from "lucide-react";
import { jsPDF } from "jspdf";

interface SkillCategory {
    name: string;
    score: number;
    maxScore: number;
    labsCompleted: number;
    totalLabs: number;
    color: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: "common" | "rare" | "epic" | "legendary";
    unlockedAt: string | null;
}

interface LabCompletion {
    labId: string;
    labName: string;
    category: string;
    completedAt: string;
    timeSpent: number; // minutes
    attempts: number;
    flagCaptured: string;
}

const SkillDashboard = () => {
    const [skills, setSkills] = useState<SkillCategory[]>([
        { name: "Web Exploitation", score: 750, maxScore: 1000, labsCompleted: 15, totalLabs: 20, color: "#3b82f6" },
        { name: "Binary Exploitation", score: 450, maxScore: 1000, labsCompleted: 9, totalLabs: 20, color: "#f59e0b" },
        { name: "Cryptography", score: 600, maxScore: 1000, labsCompleted: 12, totalLabs: 20, color: "#8b5cf6" },
        { name: "Forensics", score: 300, maxScore: 1000, labsCompleted: 6, totalLabs: 20, color: "#10b981" },
        { name: "Networking", score: 850, maxScore: 1000, labsCompleted: 17, totalLabs: 20, color: "#06b6d4" },
        { name: "Blue Team / Defense", score: 550, maxScore: 1000, labsCompleted: 11, totalLabs: 20, color: "#ef4444" },
    ]);

    const [achievements, setAchievements] = useState<Achievement[]>([
        {
            id: "first-blood",
            title: "First Blood",
            description: "Complete your first lab",
            icon: "🩸",
            rarity: "common",
            unlockedAt: "2026-01-15T10:30:00Z",
        },
        {
            id: "sql-master",
            title: "SQL Injection Master",
            description: "Complete all SQL injection labs",
            icon: "💉",
            rarity: "rare",
            unlockedAt: "2026-01-20T14:22:00Z",
        },
        {
            id: "week-streak",
            title: "Week Warrior",
            description: "7-day learning streak",
            icon: "🔥",
            rarity: "rare",
            unlockedAt: "2026-01-25T09:15:00Z",
        },
        {
            id: "pentester",
            title: "Penetration Tester",
            description: "Complete 50 labs across all categories",
            icon: "🎯",
            rarity: "epic",
            unlockedAt: null,
        },
        {
            id: "legend",
            title: "Security Legend",
            description: "Complete all 120 labs",
            icon: "👑",
            rarity: "legendary",
            unlockedAt: null,
        },
    ]);

    const [recentLabs, setRecentLabs] = useState<LabCompletion[]>([
        {
            labId: "sqli-auth-bypass",
            labName: "SQL Injection - Authentication Bypass",
            category: "Web Exploitation",
            completedAt: "2026-02-05T10:30:00Z",
            timeSpent: 25,
            attempts: 4,
            flagCaptured: "FLAG{sql_1nj3ct10n_m4st3r}",
        },
        {
            labId: "xss-stored",
            labName: "Stored XSS Challenge",
            category: "Web Exploitation",
            completedAt: "2026-02-04T16:45:00Z",
            timeSpent: 18,
            attempts: 2,
            flagCaptured: "FLAG{st0r3d_xss_pwn3d}",
        },
        {
            labId: "ssh-bruteforce-detect",
            labName: "SSH Brute Force Detection",
            category: "Blue Team / Defense",
            completedAt: "2026-02-03T14:20:00Z",
            timeSpent: 32,
            attempts: 3,
            flagCaptured: "FLAG{d3t3ct_br00t3_f0rc3}",
        },
    ]);

    // Load from localStorage
    useEffect(() => {
        const savedSkills = localStorage.getItem("hackwebtools_skills");
        const savedAchievements = localStorage.getItem("hackwebtools_achievements");
        const savedLabs = localStorage.getItem("hackwebtools_labs");

        if (savedSkills) setSkills(JSON.parse(savedSkills));
        if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
        if (savedLabs) setRecentLabs(JSON.parse(savedLabs));
    }, []);

    const totalScore = skills.reduce((sum, skill) => sum + skill.score, 0);
    const maxTotalScore = skills.reduce((sum, skill) => sum + skill.maxScore, 0);
    const totalLabsCompleted = skills.reduce((sum, skill) => sum + skill.labsCompleted, 0);
    const totalLabs = skills.reduce((sum, skill) => sum + skill.totalLabs, 0);
    const level = Math.floor(totalScore / 100);
    const currentLevelXP = totalScore % 100;
    const unlockedAchievements = achievements.filter(a => a.unlockedAt !== null);

    const rarityColors = {
        common: "text-slate-400 border-slate-400",
        rare: "text-blue-400 border-blue-400",
        epic: "text-purple-400 border-purple-400",
        legendary: "text-yellow-400 border-yellow-400",
    };

    const generateCertificate = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        // Certificate border
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(2);
        doc.rect(10, 10, 277, 190);

        // Title
        doc.setFontSize(36);
        doc.setTextColor(59, 130, 246);
        doc.text("CERTIFICATE OF ACHIEVEMENT", 148.5, 40, { align: "center" });

        // Subtitle
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text("HackWebTools Professional Cybersecurity Training", 148.5, 55, { align: "center" });

        // Awarded to
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text("This certificate is awarded to", 148.5, 75, { align: "center" });

        // User name (placeholder)
        doc.setFontSize(28);
        doc.setTextColor(0, 0, 0);
        doc.text("Cybersecurity Professional", 148.5, 95, { align: "center" });

        // Achievement text
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text("for successfully completing", 148.5, 110, { align: "center" });

        // Stats
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text(`${totalLabsCompleted} Hands-On Security Labs`, 148.5, 125, { align: "center" });
        doc.text(`Level ${level} • ${totalScore} Points`, 148.5, 138, { align: "center" });

        // Skills summary
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const skillsSummary = skills
            .filter(s => s.labsCompleted > 0)
            .map(s => `${s.name}: ${s.labsCompleted} labs`)
            .join(" • ");
        doc.text(skillsSummary, 148.5, 155, { align: "center" });

        // Date
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        doc.text(`Issued on ${today}`, 148.5, 175, { align: "center" });

        // Signature line
        doc.setDrawColor(100, 100, 100);
        doc.line(115, 185, 182, 185);
        doc.setFontSize(9);
        doc.text("HackWebTools Platform", 148.5, 190, { align: "center" });

        // Save
        doc.save(`HackWebTools_Certificate_Level${level}.pdf`);
    };

    const exportProgress = () => {
        const portfolioData = {
            summary: {
                level,
                totalScore,
                labsCompleted: totalLabsCompleted,
                achievementsUnlocked: unlockedAchievements.length,
            },
            skills: skills.map(s => ({
                category: s.name,
                proficiency: `${Math.round((s.score / s.maxScore) * 100)}%`,
                labsCompleted: s.labsCompleted,
            })),
            achievements: unlockedAchievements.map(a => ({
                title: a.title,
                description: a.description,
                rarity: a.rarity,
                unlockedAt: a.unlockedAt,
            })),
            recentLabs: recentLabs.map(l => ({
                name: l.labName,
                category: l.category,
                completedAt: l.completedAt,
                flagCaptured: l.flagCaptured,
            })),
        };

        const dataStr = JSON.stringify(portfolioData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "hackwebtools-portfolio.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    const shareLinkedIn = () => {
        const message = `🎯 Just achieved Level ${level} on HackWebTools!

✅ Completed ${totalLabsCompleted}/${totalLabs} hands-on cybersecurity labs
✅ ${totalScore} total points across 6 skill categories
✅ ${unlockedAchievements.length} achievements unlocked

Skills: Web Exploitation, Binary Exploitation, Cryptography, Forensics, Networking, Blue Team Defense

#CyberSecurity #PenetrationTesting #InfoSec #CTF #HackWebTools`;

        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://hackwebtools.com")}&summary=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 border-blue-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Level</p>
                                <p className="text-3xl font-bold text-blue-400">{level}</p>
                            </div>
                            <Trophy className="h-10 w-10 text-blue-400" />
                        </div>
                        <Progress value={currentLevelXP} className="mt-2" />
                        <p className="text-xs text-slate-400 mt-1">{currentLevelXP}/100 XP to Level {level + 1}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-950/50 to-green-900/30 border-green-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Total Points</p>
                                <p className="text-3xl font-bold text-green-400">{totalScore}</p>
                            </div>
                            <Star className="h-10 w-10 text-green-400" />
                        </div>
                        <p className="text-xs text-slate-400 mt-3">of {maxTotalScore} possible</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 border-purple-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Labs Completed</p>
                                <p className="text-3xl font-bold text-purple-400">{totalLabsCompleted}</p>
                            </div>
                            <Award className="h-10 w-10 text-purple-400" />
                        </div>
                        <p className="text-xs text-slate-400 mt-3">of {totalLabs} total labs</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-950/50 to-orange-900/30 border-orange-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Rank</p>
                                <p className="text-3xl font-bold text-orange-400">#47</p>
                            </div>
                            <TrendingUp className="h-10 w-10 text-orange-400" />
                        </div>
                        <p className="text-xs text-slate-400 mt-3">Top 1% globally</p>
                    </CardContent>
                </Card>
            </div>

            {/* Skills Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Skill Proficiency
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {skills.map((skill) => {
                        const percentage = (skill.score / skill.maxScore) * 100;
                        return (
                            <div key={skill.name}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{skill.name}</span>
                                    <span className="text-sm text-slate-400">
                                        {skill.labsCompleted}/{skill.totalLabs} labs • {Math.round(percentage)}%
                                    </span>
                                </div>
                                <Progress value={percentage} className="h-2" style={{ backgroundColor: `${skill.color}20` }} />
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Achievements ({unlockedAchievements.length}/{achievements.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`p-4 rounded-lg border-2 text-center ${achievement.unlockedAt
                                        ? `${rarityColors[achievement.rarity]} bg-slate-900/50`
                                        : "border-slate-700 bg-slate-900/20 opacity-40"
                                    }`}
                            >
                                <div className="text-4xl mb-2">{achievement.icon}</div>
                                <p className="text-xs font-semibold mb-1">{achievement.title}</p>
                                <p className="text-xs text-slate-400">{achievement.description}</p>
                                {achievement.unlockedAt && (
                                    <Badge variant="outline" className="mt-2 text-xs">
                                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Lab Completions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Lab Completions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentLabs.map((lab) => (
                            <div key={lab.labId} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium">{lab.labName}</p>
                                    <p className="text-sm text-slate-400">
                                        {lab.category} • {lab.timeSpent} minutes • {lab.attempts} attempts
                                    </p>
                                    <p className="text-xs text-green-400 font-mono mt-1">{lab.flagCaptured}</p>
                                </div>
                                <Badge variant="outline">{new Date(lab.completedAt).toLocaleDateString()}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Export & Share */}
            <Card className="bg-gradient-to-r from-blue-950/30 to-purple-950/30 border-blue-500/20">
                <CardHeader>
                    <CardTitle>Portfolio & Social Proof</CardTitle>
                    <p className="text-sm text-slate-400">
                        Share your achievements or export for your portfolio
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={generateCertificate} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download Certificate (PDF)
                        </Button>
                        <Button onClick={exportProgress} variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export Progress (JSON)
                        </Button>
                        <Button onClick={shareLinkedIn} variant="outline" className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            Share on LinkedIn
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Missing icon import
function Target({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}

export default SkillDashboard;
