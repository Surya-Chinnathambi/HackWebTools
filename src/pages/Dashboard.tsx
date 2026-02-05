import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Shield,
    TrendingUp,
    AlertTriangle,
    Target,
    Activity,
    BarChart3,
    Users,
    Globe,
    Lock,
    Zap,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    Calendar
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeScans, setActiveScans] = useState(3);
    const [todayScans, setTodayScans] = useState(12);

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const securityMetrics = {
        overallScore: 82,
        criticalVulns: 5,
        highVulns: 12,
        mediumVulns: 28,
        lowVulns: 45,
        resolvedThisWeek: 23,
        avgResolutionTime: "3.2 hours",
        complianceScore: 94
    };

    const recentActivity = [
        { type: "scan", target: "api.production.com", time: "2 mins ago", status: "completed", vulns: 3 },
        { type: "threat", target: "CVE-2024-1234", time: "15 mins ago", status: "detected", severity: "critical" },
        { type: "report", target: "Monthly Assessment", time: "1 hour ago", status: "generated", size: "2.4 MB" },
        { type: "scan", target: "app.staging.com", time: "2 hours ago", status: "completed", vulns: 8 }
    ];

    const topVulnerabilities = [
        { cve: "CVE-2024-0001", title: "SQL Injection in Auth Module", cvss: 9.8, affected: 5, status: "open" },
        { cve: "CVE-2024-0002", title: "XSS in User Dashboard", cvss: 8.6, affected: 3, status: "patching" },
        { cve: "CVE-2024-0003", title: "CSRF in API Endpoints", cvss: 7.5, affected: 12, status: "open" },
        { cve: "CVE-2024-0004", title: "Broken Access Control", cvss: 9.1, affected: 8, status: "open" },
        { cve: "CVE-2024-0005", title: "Insecure Deserialization", cvss: 8.8, affected: 2, status: "resolved" }
    ];

    const complianceStatus = [
        { framework: "OWASP Top 10", score: 92, status: "good" },
        { framework: "ISO 27001", score: 87, status: "good" },
        { framework: "PCI-DSS", score: 78, status: "warning" },
        { framework: "GDPR", score: 95, status: "excellent" },
        { framework: "SOC 2", score: 82, status: "good" }
    ];

    const threatIntelligence = [
        { threat: "Ransomware Campaign", severity: "critical", targets: "Healthcare", trend: "increasing" },
        { threat: "Phishing Wave", severity: "high", targets: "Financial", trend: "stable" },
        { threat: "DDoS Attacks", severity: "medium", targets: "E-commerce", trend: "decreasing" },
        { threat: "Zero-Day Exploit", severity: "critical", targets: "Enterprise", trend: "new" }
    ];

    const getSeverityColor = (cvss: number) => {
        if (cvss >= 9.0) return "bg-red-600";
        if (cvss >= 7.0) return "bg-orange-600";
        if (cvss >= 4.0) return "bg-amber-600";
        return "bg-green-600";
    };

    const getComplianceColor = (status: string) => {
        switch (status) {
            case "excellent": return "text-green-600";
            case "good": return "text-blue-600";
            case "warning": return "text-amber-600";
            default: return "text-red-600";
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-16">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold flex items-center gap-3">
                    <BarChart3 className="h-10 w-10 text-red-600" />
                    Security Operations Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                    Real-time security metrics, vulnerability tracking, and compliance monitoring
                </p>
            </div>

            {isLoading ? (
                // Loading skeleton
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i}>
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-4 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-16 mb-2" />
                                    <Skeleton className="h-2 w-full mb-2" />
                                    <Skeleton className="h-3 w-24" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((j) => (
                                            <Skeleton key={j} className="h-20 w-full" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Key Metrics */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="card-interactive border-l-4 border-l-red-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Overall Security Score</CardTitle>
                                <Shield className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{securityMetrics.overallScore}%</div>
                                <Progress value={securityMetrics.overallScore} className="mt-2" />
                                <p className="text-xs text-muted-foreground mt-2">
                                    +5% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="card-interactive border-l-4 border-l-orange-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Critical Vulnerabilities</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{securityMetrics.criticalVulns}</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {securityMetrics.highVulns} high, {securityMetrics.mediumVulns} medium
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="card-interactive border-l-4 border-l-green-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Resolved This Week</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{securityMetrics.resolvedThisWeek}</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Avg: {securityMetrics.avgResolutionTime}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="card-interactive border-l-4 border-l-blue-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
                                <Activity className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{activeScans}</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {todayScans} completed today
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="vulnerabilities" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
                            <TabsTrigger value="compliance">Compliance</TabsTrigger>
                            <TabsTrigger value="threats">Threat Intel</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>

                        {/* Vulnerabilities Tab */}
                        <TabsContent value="vulnerabilities" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card className="card-base">
                                    <CardHeader>
                                        <CardTitle>Top Critical Vulnerabilities</CardTitle>
                                        <CardDescription>Prioritized by CVSS score and impact</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {topVulnerabilities.map((vuln, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="text-xs">{vuln.cve}</Badge>
                                                        <Badge className={`${getSeverityColor(vuln.cvss)} text-white text-xs`}>
                                                            {vuln.cvss}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm font-medium">{vuln.title}</p>
                                                    <p className="text-xs text-muted-foreground">{vuln.affected} systems affected</p>
                                                </div>
                                                <Badge variant={vuln.status === "resolved" ? "default" : "destructive"}>
                                                    {vuln.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="card-base">
                                    <CardHeader>
                                        <CardTitle>Vulnerability Distribution</CardTitle>
                                        <CardDescription>By severity level</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-sm">
                                                <span className="text-sm font-medium flex items-center gap-2">
                                                    <span className="h-3 w-3 bg-red-600 rounded-full" />
                                                    Critical
                                                </span>
                                                <span className="text-sm font-bold">{securityMetrics.criticalVulns}</span>
                                            </div>
                                            <Progress value={(securityMetrics.criticalVulns / 90) * 100} className="h-2" />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium flex items-center gap-2">
                                                    <span className="h-3 w-3 bg-orange-600 rounded-full" />
                                                    High
                                                </span>
                                                <span className="text-sm font-bold">{securityMetrics.highVulns}</span>
                                            </div>
                                            <Progress value={(securityMetrics.highVulns / 90) * 100} className="h-2" />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium flex items-center gap-2">
                                                    <span className="h-3 w-3 bg-amber-600 rounded-full" />
                                                    Medium
                                                </span>
                                                <span className="text-sm font-bold">{securityMetrics.mediumVulns}</span>
                                            </div>
                                            <Progress value={(securityMetrics.mediumVulns / 90) * 100} className="h-2" />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium flex items-center gap-2">
                                                    <span className="h-3 w-3 bg-green-600 rounded-full" />
                                                    Low
                                                </span>
                                                <span className="text-sm font-bold">{securityMetrics.lowVulns}</span>
                                            </div>
                                            <Progress value={(securityMetrics.lowVulns / 90) * 100} className="h-2" />
                                        </div>

                                        <Alert className="mt-4">
                                            <Target className="h-4 w-4" />
                                            <AlertDescription className="text-xs">
                                                Total: {securityMetrics.criticalVulns + securityMetrics.highVulns + securityMetrics.mediumVulns + securityMetrics.lowVulns} vulnerabilities detected across all assets
                                            </AlertDescription>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Compliance Tab */}
                        <TabsContent value="compliance" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Compliance Framework Status</CardTitle>
                                            <CardDescription>Organizational compliance posture across major frameworks</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Download className="h-4 w-4" />
                                            Export Report
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {complianceStatus.map((item, idx) => (
                                            <Card key={idx} className="bg-card/50">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-semibold">{item.framework}</h3>
                                                        <Badge className={getComplianceColor(item.status)} variant="outline">
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-2xl font-bold">{item.score}%</span>
                                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <Progress value={item.score} className="h-2" />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <Alert className="mt-4 border-amber-500/50 bg-amber-950/20">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                        <AlertDescription>
                                            <strong>Action Required:</strong> PCI-DSS compliance below target (78%).
                                            Review encryption standards and access controls.
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Threat Intelligence Tab */}
                        <TabsContent value="threats" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-red-600" />
                                        Global Threat Intelligence
                                    </CardTitle>
                                    <CardDescription>Real-time threat landscape and emerging attacks</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {threatIntelligence.map((threat, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant={threat.severity === "critical" ? "destructive" : "outline"}>
                                                        {threat.severity}
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {threat.trend === "increasing" ? "↑" : threat.trend === "decreasing" ? "↓" : threat.trend === "new" ? "★" : "→"} {threat.trend}
                                                    </Badge>
                                                </div>
                                                <p className="font-medium">{threat.threat}</p>
                                                <p className="text-xs text-muted-foreground">Primary targets: {threat.targets}</p>
                                            </div>
                                            <Button variant="outline" size="sm">Details</Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Activity Tab */}
                        <TabsContent value="activity" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                        Recent Activity
                                    </CardTitle>
                                    <CardDescription>System events and security operations</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentActivity.map((activity, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors">
                                                <div className={`p-2 rounded-full ${activity.type === "scan" ? "bg-blue-100 dark:bg-blue-950" :
                                                    activity.type === "threat" ? "bg-red-100 dark:bg-red-950" :
                                                        "bg-green-100 dark:bg-green-950"
                                                    }`}>
                                                    {activity.type === "scan" && <Target className="h-4 w-4 text-blue-600" />}
                                                    {activity.type === "threat" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                                                    {activity.type === "report" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{activity.target}</p>
                                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                                </div>
                                                <Badge variant={activity.status === "completed" ? "default" : "destructive"}>
                                                    {activity.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Quick Actions */}
                    <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20 border-2 border-red-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-orange-600" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-4">
                                <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                                    <a href="/advanced-vuln-scanner">
                                        <Target className="h-5 w-5" />
                                        New Scan
                                    </a>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                                    <a href="/report-generator">
                                        <Download className="h-5 w-5" />
                                        Generate Report
                                    </a>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                                    <a href="/threat-intelligence">
                                        <Globe className="h-5 w-5" />
                                        Threat Intel
                                    </a>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                                    <a href="/owasp-lab">
                                        <Shield className="h-5 w-5" />
                                        OWASP Lab
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Dashboard;
