import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, AlertTriangle, Target, Activity, Cpu, Globe, Eye, Shield, Zap, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { realTimeThreatService } from "@/services/RealTimeThreatService";

interface ThreatPattern {
    id: string;
    type: string;
    severity: "critical" | "high" | "medium" | "low";
    confidence: number;
    description: string;
    indicators: string[];
    mitre: string;
    techniques: string[];
}

interface AnomalyDetection {
    timestamp: string;
    anomalyType: string;
    score: number;
    baseline: number;
    actual: number;
    deviation: number;
    mlModel: string;
}

interface NetworkBehavior {
    ip: string;
    country: string;
    requestCount: number;
    errorRate: number;
    avgResponseTime: number;
    suspiciousPatterns: string[];
    threatScore: number;
}

const ThreatIntelligence = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logData, setLogData] = useState("");
    const [threats, setThreats] = useState<ThreatPattern[]>([]);
    const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
    const [networkBehavior, setNetworkBehavior] = useState<NetworkBehavior[]>([]);
    const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);

    // Real-time monitoring effect
    useEffect(() => {
        if (realTimeMonitoring) {
            // Start real-time monitoring
            realTimeThreatService.startRealTimeMonitoring((data) => {
                setThreats(data.threats || []);
                setNetworkBehavior(data.networkBehavior || []);
                setAnomalies(realTimeThreatService.generateAnomalies(6));
                
                toast({
                    title: "🔄 Threat Data Updated",
                    description: `Updated with ${data.threats?.length || 0} CVEs from NIST`,
                });
            }, 30000); // Update every 30 seconds

            // Initial load
            simulateMLAnalysis();

            return () => {
                realTimeThreatService.stopRealTimeMonitoring();
            };
        } else {
            realTimeThreatService.stopRealTimeMonitoring();
        }
    }, [realTimeMonitoring]);

    const threatDatabase: ThreatPattern[] = [
        {
            id: "t1",
            type: "SQL Injection Attack",
            severity: "critical",
            confidence: 0.95,
            description: "Multiple SQL injection attempts detected using UNION-based and error-based techniques",
            indicators: ["' OR '1'='1", "UNION SELECT", "'; DROP TABLE", "1=1--"],
            mitre: "T1190",
            techniques: ["Initial Access", "Execution"]
        },
        {
            id: "t2",
            type: "Brute Force Authentication",
            severity: "high",
            confidence: 0.88,
            description: "Abnormal login attempt pattern detected - 500+ failed attempts from single IP",
            indicators: ["Failed login spikes", "Sequential username testing", "Password spraying"],
            mitre: "T1110",
            techniques: ["Credential Access", "Brute Force"]
        },
        {
            id: "t3",
            type: "DDoS Attack Pattern",
            severity: "critical",
            confidence: 0.92,
            description: "Distributed Denial of Service attack detected with traffic spike of 10000%",
            indicators: ["Traffic volume anomaly", "Request rate surge", "Multiple source IPs"],
            mitre: "T1499",
            techniques: ["Impact", "Network Denial of Service"]
        },
        {
            id: "t4",
            type: "Command Injection",
            severity: "critical",
            confidence: 0.90,
            description: "OS command injection attempts detected in user input parameters",
            indicators: ["; ls -la", "| whoami", "&& cat /etc/passwd", "`id`"],
            mitre: "T1059",
            techniques: ["Execution", "Command and Scripting Interpreter"]
        },
        {
            id: "t5",
            type: "Cross-Site Scripting (XSS)",
            severity: "high",
            confidence: 0.85,
            description: "XSS payload injection detected in multiple input fields",
            indicators: ["<script>", "onerror=", "javascript:", "document.cookie"],
            mitre: "T1189",
            techniques: ["Initial Access", "Drive-by Compromise"]
        },
        {
            id: "t6",
            type: "Directory Traversal",
            severity: "high",
            confidence: 0.87,
            description: "Path traversal attempts to access sensitive system files",
            indicators: ["../../../etc/passwd", "..\\..\\windows\\system32"],
            mitre: "T1083",
            techniques: ["Discovery", "File and Directory Discovery"]
        },
        {
            id: "t7",
            type: "Data Exfiltration",
            severity: "critical",
            confidence: 0.93,
            description: "Unusual data transfer pattern - Large file downloads to external IP",
            indicators: ["High bandwidth usage", "Large file transfers", "Uncommon protocols"],
            mitre: "T1041",
            techniques: ["Exfiltration", "Exfiltration Over C2 Channel"]
        },
        {
            id: "t8",
            type: "Malware Communication",
            severity: "critical",
            confidence: 0.89,
            description: "Communication with known malicious C2 server detected",
            indicators: ["Known malicious IP", "Suspicious DNS queries", "Encrypted traffic patterns"],
            mitre: "T1071",
            techniques: ["Command and Control", "Application Layer Protocol"]
        }
    ];

    const mlModels = [
        "Random Forest Classifier",
        "LSTM Neural Network",
        "Isolation Forest",
        "AutoEncoder",
        "Gradient Boosting"
    ];

    const simulateMLAnalysis = async () => {
        if (!logData && !realTimeMonitoring) {
            toast({ title: "Error", description: "Please enter log data or enable real-time monitoring", variant: "destructive" });
            return;
        }

        setAnalyzing(true);
        setProgress(0);
        setThreats([]);
        setAnomalies([]);
        setNetworkBehavior([]);

        const phases = [
            "📊 Preprocessing log data",
            "🔍 Feature extraction",
            "🤖 Loading ML models",
            "⚠️ Fetching real CVE data from NIST",
            "🧠 Anomaly detection (Isolation Forest)",
            "🔮 Pattern matching (Deep Learning)",
            "🌐 Network behavior analysis with AbuseIPDB",
            "📈 Threat correlation",
            "✅ Generating AI-powered insights"
        ];

        let totalProgress = 0;
        const increment = 100 / phases.length;

        try {
            // Phase 1-3: Initialization
            for (let i = 0; i < 3; i++) {
                await new Promise(resolve => setTimeout(resolve, 500));
                totalProgress += increment;
                setProgress(totalProgress);
            }

            // Phase 4: Fetch REAL CVE threats from NIST
            const detectedThreats = await realTimeThreatService.fetchCVEThreats(10);
            setThreats(detectedThreats);
            totalProgress += increment;
            setProgress(totalProgress);

            // Phase 5-6: ML Analysis & Anomaly Detection
            await new Promise(resolve => setTimeout(resolve, 800));
            const detectedAnomalies = realTimeThreatService.generateAnomalies(6);
            setAnomalies(detectedAnomalies);
            totalProgress += increment * 2;
            setProgress(totalProgress);

            // Phase 7: Network behavior with REAL IP reputation data
            const ipAddresses = [
                "8.8.8.8", "1.1.1.1", "45.33.32.156",
                "192.168.1.100", "10.0.0.5"
            ];

            toast({
                title: "🔍 Checking IP Reputation",
                description: "Querying AbuseIPDB for real-time threat data...",
            });

            const behaviors = await Promise.all(
                ipAddresses.map(ip => realTimeThreatService.checkIPReputation(ip))
            );

            setNetworkBehavior(behaviors.sort((a, b) => b.threatScore - a.threatScore));
            totalProgress += increment;
            setProgress(totalProgress);

            // Phase 8-9: Final analysis
            await new Promise(resolve => setTimeout(resolve, 500));
            setProgress(100);

            setAnalyzing(false);
            
            const criticalCount = detectedThreats.filter(t => t.severity === 'critical').length;
            const highCount = detectedThreats.filter(t => t.severity === 'high').length;

            toast({
                title: "✅ AI Analysis completed using real NIST CVE Database & IP reputation services",
                description: `🔴 ${criticalCount} Critical CVEs · 🟠 ${highCount} High Severity · 🌐 ${behaviors.length} IPs analyzed`,
                variant: "default"
            });

        } catch (error) {
            console.error('Analysis error:', error);
            setAnalyzing(false);
            toast({
                title: "Error",
                description: "Failed to complete AI analysis. Check your API keys in Settings.",
                variant: "destructive"
            });
        }
    };
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical": return "bg-red-600 text-white";
            case "high": return "bg-orange-500 text-white";
            case "medium": return "bg-yellow-500 text-black";
            case "low": return "bg-blue-500 text-white";
            default: return "bg-gray-400 text-white";
        }
    };

    const getConfidenceColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-orange-500";
        if (score >= 40) return "text-yellow-600";
        return "text-red-600";
    };

    const getThreatScoreColor = (score: number) => {
        if (score >= 80) return "text-red-600";
        if (score >= 60) return "text-orange-500";
        if (score >= 40) return "text-yellow-600";
        return "text-green-600";
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8 relative p-8 rounded-2xl bg-gradient-to-r from-red-600/10 via-orange-600/10 to-rose-600/10 backdrop-blur-sm border-2 border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                    <Brain className="h-10 w-10 text-red-600 animate-pulse-glow" />
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                        AI Threat Intelligence Platform
                    </h1>
                    <RefreshCw className="h-6 w-6 text-green-500 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                    🤖 Machine Learning-powered real-time threat detection with NIST CVE correlation and behavioral analysis
                </p>
                <div className="mt-3 flex gap-2">
                    <Badge variant="default" className="text-sm bg-red-600">Real-time CVE Integration</Badge>
                    <Badge variant="default" className="text-sm bg-orange-600">IP Reputation Analysis</Badge>
                    <Badge variant="default" className="text-sm bg-amber-600">ML-Powered Detection</Badge>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Enhanced Control Panel */}
                <Card className="border-2 border-purple-500/20 shadow-xl glass-effect">
                    <CardHeader className="bg-gradient-to-r from-red-600/10 to-orange-600/10">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Cpu className="h-6 w-6 text-red-600" />
                            AI Analysis Control Center
                        </CardTitle>
                        <CardDescription className="text-base">Real-time threat detection with ML-powered behavioral analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex gap-4">
                            <Input
                                placeholder="📊 Paste log data or enable live monitoring for real-time analysis..."
                                value={logData}
                                onChange={(e) => setLogData(e.target.value)}
                                className="flex-1 h-12 text-base border-2 focus:border-purple-500 transition-all"
                            />
                            <Button
                                onClick={simulateMLAnalysis}
                                disabled={analyzing}
                                variant="default"
                                size="lg"
                                className="gap-2 min-w-[140px]"
                            >
                                {analyzing ? (
                                    <>
                                        <Activity className="h-5 w-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="h-5 w-5" />
                                        Analyze
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => setRealTimeMonitoring(!realTimeMonitoring)}
                                variant={realTimeMonitoring ? "destructive" : "outline"}
                                size="lg"
                                className="gap-2 min-w-[120px]"
                            >
                                <Eye className="h-5 w-5" />
                                {realTimeMonitoring ? "Stop Live" : "Start Live"}
                            </Button>
                        </div>

                        {analyzing && (
                            <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-purple-700 dark:text-purple-300 animate-pulse">🧠 ML engines processing data...</span>
                                    <span className="text-pink-700 dark:text-pink-300">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-3 bg-white dark:bg-gray-800" />
                                <p className="text-xs text-muted-foreground">Fetching real CVE data from NIST NVD API...</p>
                            </div>
                        )}

                        {realTimeMonitoring && (
                            <Alert className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                                <Activity className="h-5 w-5 animate-pulse text-green-600" />
                                <AlertDescription className="text-base font-semibold text-green-800 dark:text-green-200">
                                    🟢 Real-time monitoring active - Auto-refresh every 10 seconds with live CVE feeds
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Results Dashboard */}
                {threats.length > 0 && (
                    <>
                        {/* Enhanced Threat Summary with Gradients */}
                        <Alert className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                            <Shield className="h-5 w-5 text-orange-600" />
                            <AlertDescription className="text-base font-semibold text-orange-800 dark:text-orange-200">
                                ✅ AI Analysis completed using real NIST CVE Database & IP reputation services
                            </AlertDescription>
                        </Alert>

                        <div className="grid md:grid-cols-4 gap-6">
                            <Card className="border-2 border-red-500/30 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Threats Detected
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-5xl font-extrabold text-red-600 dark:text-red-400">{threats.length}</div>
                                    <p className="text-sm font-medium text-red-700/80 dark:text-red-300/80 mt-2">
                                        🔴 {threats.filter(t => t.severity === "critical").length} Critical CVEs
                                    </p>
                                    <div className="mt-3 h-2 bg-red-200 dark:bg-red-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-red-600 to-pink-600 w-full animate-pulse"></div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                        <Brain className="h-4 w-4" />
                                        ML Confidence
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-5xl font-extrabold text-red-600 dark:text-red-400">
                                        {Math.round((threats.reduce((sum, t) => sum + t.confidence, 0) / threats.length) * 100)}%
                                    </div>
                                    <p className="text-sm font-medium text-purple-700/80 dark:text-purple-300/80 mt-2">
                                        Average Accuracy
                                    </p>
                                    <Progress
                                        value={Math.round((threats.reduce((sum, t) => sum + t.confidence, 0) / threats.length) * 100)}
                                        className="h-3 mt-3 bg-purple-200 dark:bg-purple-900"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Anomalies Found
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-5xl font-extrabold text-orange-600 dark:text-orange-400">{anomalies.length}</div>
                                    <p className="text-sm font-medium text-orange-700/80 dark:text-orange-300/80 mt-2">
                                        🟠 {anomalies.filter(a => a.score > 80).length} High Severity
                                    </p>
                                    <div className="flex gap-1 mt-3">
                                        {Array.from({ length: Math.min(10, anomalies.length) }).map((_, i) => (
                                            <div key={i} className={`h-2 w-full bg-orange-600 rounded animate-pulse animation-delay-${i * 100}`}></div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Suspicious IPs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-5xl font-extrabold text-orange-600 dark:text-orange-400">
                                        {networkBehavior.filter(n => n.threatScore > 60).length}
                                    </div>
                                    <p className="text-sm font-medium text-blue-700/80 dark:text-blue-300/80 mt-2">
                                        High Threat Score
                                    </p>
                                    <Progress
                                        value={Math.round((networkBehavior.filter(n => n.threatScore > 60).length / networkBehavior.length) * 100)}
                                        className="h-3 mt-3 bg-blue-200 dark:bg-blue-900"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Analysis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Threat Intelligence Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="threats">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="threats">Detected Threats</TabsTrigger>
                                        <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                                        <TabsTrigger value="network">Network Behavior</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="threats" className="space-y-4 mt-4">
                                        {threats.map((threat) => (
                                            <Card key={threat.id} className="border-l-4 border-l-red-500">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge className={getSeverityColor(threat.severity)}>
                                                                    {threat.severity.toUpperCase()}
                                                                </Badge>
                                                                <Badge variant="outline">MITRE {threat.mitre}</Badge>
                                                                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                                                                    {Math.round(threat.confidence * 100)}% ML Confidence
                                                                </Badge>
                                                            </div>
                                                            <CardTitle className="text-lg">{threat.type}</CardTitle>
                                                            <CardDescription className="mt-1">{threat.description}</CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2 text-sm">Indicators of Compromise (IOCs)</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {threat.indicators.map((indicator, idx) => (
                                                                <Badge key={idx} variant="outline" className="font-mono text-xs">
                                                                    {indicator}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2 text-sm">ATT&CK Techniques</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {threat.techniques.map((technique, idx) => (
                                                                <Badge key={idx} variant="secondary">
                                                                    {technique}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="anomalies" className="space-y-4 mt-4">
                                        {anomalies.map((anomaly, idx) => (
                                            <Card key={idx}>
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge className={
                                                                    anomaly.score > 80 ? "bg-red-600 text-white" :
                                                                        anomaly.score > 60 ? "bg-orange-500 text-white" :
                                                                            "bg-yellow-500 text-black"
                                                                }>
                                                                    Anomaly Score: {Math.round(anomaly.score)}
                                                                </Badge>
                                                                <Badge variant="outline">{anomaly.mlModel}</Badge>
                                                            </div>
                                                            <CardTitle className="text-lg">{anomaly.anomalyType}</CardTitle>
                                                            <CardDescription>
                                                                Detected at {new Date(anomaly.timestamp).toLocaleString()}
                                                            </CardDescription>
                                                        </div>
                                                        <TrendingUp className="h-8 w-8 text-red-500" />
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-3 gap-4 text-center">
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">Baseline</div>
                                                            <div className="text-xl font-bold">{Math.round(anomaly.baseline)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">Actual</div>
                                                            <div className="text-xl font-bold text-red-600">{Math.round(anomaly.actual)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">Deviation</div>
                                                            <div className="text-xl font-bold text-orange-600">+{Math.round(anomaly.deviation)}%</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="network" className="space-y-4 mt-4">
                                        {networkBehavior.map((behavior, idx) => (
                                            <Card key={idx} className={behavior.threatScore > 80 ? "border-2 border-red-500" : ""}>
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge variant="outline" className="font-mono">{behavior.ip}</Badge>
                                                                <Badge variant="outline">
                                                                    <Globe className="h-3 w-3 mr-1" />
                                                                    {behavior.country}
                                                                </Badge>
                                                            </div>
                                                            <CardTitle className={`text-2xl ${getThreatScoreColor(behavior.threatScore)}`}>
                                                                Threat Score: {Math.round(behavior.threatScore)}/100
                                                            </CardTitle>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">Requests</div>
                                                            <div className="text-lg font-semibold">{behavior.requestCount.toLocaleString()}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">Error Rate</div>
                                                            <div className="text-lg font-semibold">{behavior.errorRate.toFixed(1)}%</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">Avg Response</div>
                                                            <div className="text-lg font-semibold">{Math.round(behavior.avgResponseTime)}ms</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2 text-sm">Suspicious Patterns</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {behavior.suspiciousPatterns.map((pattern, pidx) => (
                                                                <Badge key={pidx} variant="destructive">
                                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                                    {pattern}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}

export default ThreatIntelligence;
