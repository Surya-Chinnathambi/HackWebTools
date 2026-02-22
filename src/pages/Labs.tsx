import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Code, Key, Terminal, FolderOpen, Trophy, Clock, Target } from "lucide-react";
import SQLInjectionLab from "@/components/SQLInjectionLab";
import XSSPlayground from "@/components/XSSPlayground";
import JWTManipulator from "@/components/JWTManipulator";
import CommandInjectionLab from "@/components/CommandInjectionLab";
import DirectoryTraversalLab from "@/components/DirectoryTraversalLab";

type LabType = "sql" | "xss" | "jwt" | "command" | "traversal" | null;

interface LabInfo {
    id: LabType;
    title: string;
    description: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    estimatedTime: string;
    challenges: number;
    points: number;
    icon: any;
    color: string;
}

const labsData: LabInfo[] = [
    {
        id: "sql",
        title: "SQL Injection Lab",
        description: "Master authentication bypass, UNION attacks, and blind SQL injection techniques",
        difficulty: "Beginner",
        estimatedTime: "30 min",
        challenges: 3,
        points: 45,
        icon: Database,
        color: "red"
    },
    {
        id: "xss",
        title: "XSS Playground",
        description: "Learn reflected, stored, DOM-based XSS and filter bypass techniques",
        difficulty: "Beginner",
        estimatedTime: "45 min",
        challenges: 4,
        points: 60,
        icon: Code,
        color: "orange"
    },
    {
        id: "jwt",
        title: "JWT Manipulation",
        description: "Exploit algorithm confusion, weak secrets, and privilege escalation via JWT",
        difficulty: "Intermediate",
        estimatedTime: "40 min",
        challenges: 3,
        points: 55,
        icon: Key,
        color: "purple"
    },
    {
        id: "command",
        title: "Command Injection & RCE",
        description: "Achieve remote code execution through OS command injection vulnerabilities",
        difficulty: "Intermediate",
        estimatedTime: "35 min",
        challenges: 3,
        points: 45,
        icon: Terminal,
        color: "red"
    },
    {
        id: "traversal",
        title: "Path Traversal & LFI",
        description: "Read arbitrary files using directory traversal and encoding bypass techniques",
        difficulty: "Beginner",
        estimatedTime: "30 min",
        challenges: 3,
        points: 45,
        icon: FolderOpen,
        color: "yellow"
    }
];

const Labs = () => {
    const [selectedLab, setSelectedLab] = useState<LabType>(null);

    const renderLabComponent = () => {
        switch (selectedLab) {
            case "sql":
                return <SQLInjectionLab />;
            case "xss":
                return <XSSPlayground />;
            case "jwt":
                return <JWTManipulator />;
            case "command":
                return <CommandInjectionLab />;
            case "traversal":
                return <DirectoryTraversalLab />;
            default:
                return null;
        }
    };

    if (selectedLab) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="container mx-auto py-6">
                    <Button
                        variant="ghost"
                        onClick={() => setSelectedLab(null)}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Labs
                    </Button>
                    {renderLabComponent()}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="container mx-auto py-12 px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-purple-400 bg-clip-text text-transparent">
                        Practice Labs
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Master real-world vulnerabilities in safe, browser-based environments. Complete challenges, earn flags, and build your security skills.
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <Target className="h-8 w-8 text-blue-400" />
                                <div>
                                    <p className="text-2xl font-bold">{labsData.length}</p>
                                    <p className="text-sm text-slate-400">Total Labs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <Trophy className="h-8 w-8 text-yellow-400" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {labsData.reduce((sum, lab) => sum + lab.challenges, 0)}
                                    </p>
                                    <p className="text-sm text-slate-400">Challenges</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <Trophy className="h-8 w-8 text-purple-400" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {labsData.reduce((sum, lab) => sum + lab.points, 0)}
                                    </p>
                                    <p className="text-sm text-slate-400">Total Points</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <Clock className="h-8 w-8 text-green-400" />
                                <div>
                                    <p className="text-2xl font-bold">180</p>
                                    <p className="text-sm text-slate-400">Minutes Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Labs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {labsData.map((lab) => {
                        const Icon = lab.icon;
                        const colorClasses = {
                            red: "border-red-500/20 hover:border-red-500/50 bg-gradient-to-br from-slate-900 to-red-950/10",
                            orange: "border-orange-500/20 hover:border-orange-500/50 bg-gradient-to-br from-slate-900 to-orange-950/10",
                            purple: "border-purple-500/20 hover:border-purple-500/50 bg-gradient-to-br from-slate-900 to-purple-950/10",
                            yellow: "border-yellow-500/20 hover:border-yellow-500/50 bg-gradient-to-br from-slate-900 to-yellow-950/10"
                        };

                        return (
                            <Card
                                key={lab.id}
                                className={`${colorClasses[lab.color as keyof typeof colorClasses]} border-2 transition-all duration-300 cursor-pointer hover:scale-105`}
                                onClick={() => setSelectedLab(lab.id)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <Icon className={`h-8 w-8 text-${lab.color}-500`} />
                                        <Badge variant={lab.difficulty === "Beginner" ? "secondary" : "default"}>
                                            {lab.difficulty}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl mt-4">{lab.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-slate-400">
                                        {lab.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Trophy className="h-3 w-3 text-yellow-500" />
                                            <span>{lab.challenges} challenges</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="h-3 w-3 text-purple-500" />
                                            <span>{lab.points} pts</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-green-500" />
                                            <span>{lab.estimatedTime}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full" variant="outline">
                                        Start Lab
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Info Section */}
                <Card className="mt-12 bg-blue-950/20 border-blue-500/20">
                    <CardHeader>
                        <CardTitle className="text-lg">About Practice Labs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-blue-400 mb-2">🎯 Learning Approach</h4>
                                <ul className="space-y-1 ml-4 list-disc text-slate-300">
                                    <li>Hands-on practice with real vulnerability patterns</li>
                                    <li>Progressive difficulty with hints system</li>
                                    <li>Safe, sandboxed browser environment</li>
                                    <li>Track your progress with flags and points</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-400 mb-2">📚 What You'll Learn</h4>
                                <ul className="space-y-1 ml-4 list-disc text-slate-300">
                                    <li>OWASP Top 10 vulnerabilities</li>
                                    <li>Exploitation techniques and payloads</li>
                                    <li>Security best practices and prevention</li>
                                    <li>Real-world attack scenarios</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Labs;
