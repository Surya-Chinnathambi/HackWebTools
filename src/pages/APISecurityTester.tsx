import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Zap,
    Send,
    Lock,
    Unlock,
    Database,
    Code,
    Clock,
    FileJson
} from "lucide-react";

interface VulnerabilityTest {
    id: string;
    name: string;
    description: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    category: string;
}

interface TestResult {
    test: VulnerabilityTest;
    status: "vulnerable" | "safe" | "error" | "info";
    details: string;
    timestamp: string;
    evidence?: string;
}

interface APIRequest {
    method: string;
    endpoint: string;
    headers: Record<string, string>;
    body: string;
}

const vulnerabilityTests: VulnerabilityTest[] = [
    {
        id: "sql-injection",
        name: "SQL Injection",
        description: "Tests for SQL injection vulnerabilities in query parameters",
        severity: "critical",
        category: "Injection"
    },
    {
        id: "nosql-injection",
        name: "NoSQL Injection",
        description: "Tests for NoSQL injection in MongoDB-style queries",
        severity: "critical",
        category: "Injection"
    },
    {
        id: "xss-reflection",
        name: "XSS in Response",
        description: "Checks if input is reflected unescaped in API responses",
        severity: "high",
        category: "XSS"
    },
    {
        id: "auth-bypass",
        name: "Authentication Bypass",
        description: "Tests for common authentication bypass techniques",
        severity: "critical",
        category: "Authentication"
    },
    {
        id: "broken-auth",
        name: "Broken Authentication",
        description: "Validates JWT tokens and session management",
        severity: "high",
        category: "Authentication"
    },
    {
        id: "idor",
        name: "IDOR (Insecure Direct Object Reference)",
        description: "Tests for unauthorized access to resources via ID manipulation",
        severity: "high",
        category: "Authorization"
    },
    {
        id: "xxe",
        name: "XML External Entity (XXE)",
        description: "Tests for XXE injection in XML parsers",
        severity: "high",
        category: "Injection"
    },
    {
        id: "ssrf",
        name: "Server-Side Request Forgery",
        description: "Tests for SSRF vulnerabilities in URL parameters",
        severity: "high",
        category: "SSRF"
    },
    {
        id: "cors-misconfiguration",
        name: "CORS Misconfiguration",
        description: "Checks for overly permissive CORS policies",
        severity: "medium",
        category: "Configuration"
    },
    {
        id: "rate-limiting",
        name: "Missing Rate Limiting",
        description: "Tests if API endpoints have rate limiting implemented",
        severity: "medium",
        category: "Configuration"
    },
    {
        id: "info-disclosure",
        name: "Information Disclosure",
        description: "Checks for sensitive information leakage in responses",
        severity: "medium",
        category: "Information"
    },
    {
        id: "http-methods",
        name: "Unsafe HTTP Methods",
        description: "Tests for dangerous HTTP methods (TRACE, PUT, DELETE)",
        severity: "low",
        category: "Configuration"
    }
];

const APISecurityTester = () => {
    const [endpoint, setEndpoint] = useState("https://api.example.com/users");
    const [method, setMethod] = useState("GET");
    const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer token_here"\n}');
    const [body, setBody] = useState('{\n  "id": 1,\n  "name": "test"\n}');
    const [selectedTests, setSelectedTests] = useState<string[]>(vulnerabilityTests.map(t => t.id));
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [response, setResponse] = useState("");
    const [responseTime, setResponseTime] = useState(0);

    const toggleTest = (testId: string) => {
        setSelectedTests(prev =>
            prev.includes(testId)
                ? prev.filter(id => id !== testId)
                : [...prev, testId]
        );
    };

    const toggleAllTests = () => {
        if (selectedTests.length === vulnerabilityTests.length) {
            setSelectedTests([]);
        } else {
            setSelectedTests(vulnerabilityTests.map(t => t.id));
        }
    };

    const simulateVulnerabilityTest = async (test: VulnerabilityTest): Promise<TestResult> => {
        // Simulate scanning delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        // Simulate test results (in real implementation, this would make actual API calls)
        const vulnerabilityChance = Math.random();
        let status: TestResult["status"];
        let details: string;
        let evidence: string | undefined;

        // Simulate different outcomes based on test severity
        if (vulnerabilityChance < 0.2) {
            status = "vulnerable";
            details = getVulnerabilityDetails(test);
            evidence = getVulnerabilityEvidence(test);
        } else if (vulnerabilityChance < 0.3) {
            status = "info";
            details = `Test completed. Further manual inspection recommended for ${test.name}.`;
        } else {
            status = "safe";
            details = `No ${test.name} vulnerability detected. Endpoint appears secure.`;
        }

        return {
            test,
            status,
            details,
            timestamp: new Date().toISOString(),
            evidence
        };
    };

    const getVulnerabilityDetails = (test: VulnerabilityTest): string => {
        const details: Record<string, string> = {
            "sql-injection": "SQL injection vulnerability detected! The endpoint accepts unescaped user input in SQL queries. Attack vector: Parameter manipulation with SQL syntax.",
            "nosql-injection": "NoSQL injection vulnerability found! MongoDB query operators like $ne, $gt can be used to bypass authentication.",
            "xss-reflection": "XSS vulnerability detected! User input is reflected in API response without proper sanitization.",
            "auth-bypass": "Authentication bypass possible! The endpoint can be accessed without valid credentials using header manipulation.",
            "broken-auth": "Weak authentication detected! JWT token validation is insufficient or session management is flawed.",
            "idor": "IDOR vulnerability confirmed! Sequential ID enumeration allows unauthorized access to other users' resources.",
            "xxe": "XXE vulnerability detected! XML parser processes external entities, allowing file disclosure and SSRF.",
            "ssrf": "SSRF vulnerability found! URL parameter accepts internal network addresses enabling port scanning and data exfiltration.",
            "cors-misconfiguration": "CORS misconfiguration detected! Access-Control-Allow-Origin set to '*' or reflects untrusted origins.",
            "rate-limiting": "Rate limiting not implemented! Endpoint vulnerable to brute force attacks and DoS.",
            "info-disclosure": "Information disclosure detected! Sensitive data like error traces, internal IPs, or database details exposed.",
            "http-methods": "Unsafe HTTP methods enabled! TRACE/TRACK methods can leak authentication headers."
        };
        return details[test.id] || "Vulnerability detected!";
    };

    const getVulnerabilityEvidence = (test: VulnerabilityTest): string => {
        const evidence: Record<string, string> = {
            "sql-injection": "Payload: ' OR '1'='1 -- \nResponse: 200 OK with all user records",
            "nosql-injection": 'Payload: {"username": {"$ne": null}, "password": {"$ne": null}}\nResponse: Authentication successful',
            "xss-reflection": 'Payload: <script>alert(1)</script>\nResponse: {"message": "<script>alert(1)</script>"}',
            "auth-bypass": "Header removed: Authorization\nResponse: 200 OK with restricted data",
            "broken-auth": "JWT token: expired token still accepted\nResponse: Authenticated access granted",
            "idor": "Original: /api/users/1\nModified: /api/users/2\nResponse: Different user data accessible",
            "xxe": '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><data>&xxe;</data>',
            "ssrf": "Payload: http://169.254.169.254/latest/meta-data/\nResponse: AWS metadata accessible",
            "cors-misconfiguration": 'Header: Access-Control-Allow-Origin: *\nOR reflects: Origin: https://evil.com',
            "rate-limiting": "Sent: 1000 requests in 10 seconds\nResponse: All requests processed without blocking",
            "info-disclosure": 'Error: "DatabaseError: Connection failed to mysql://root@internal-db:3306"',
            "http-methods": "TRACE / HTTP/1.1\nResponse: HTTP/1.1 200 OK with reflected headers"
        };
        return evidence[test.id] || "See details above";
    };

    const runSecurityScan = async () => {
        if (!endpoint) {
            alert("Please enter an API endpoint");
            return;
        }

        setIsScanning(true);
        setScanProgress(0);
        setTestResults([]);

        const testsToRun = vulnerabilityTests.filter(test => selectedTests.includes(test.id));
        const results: TestResult[] = [];

        for (let i = 0; i < testsToRun.length; i++) {
            const result = await simulateVulnerabilityTest(testsToRun[i]);
            results.push(result);
            setTestResults([...results]);
            setScanProgress(((i + 1) / testsToRun.length) * 100);
        }

        setIsScanning(false);
    };

    const sendRequest = async () => {
        setResponse("Sending request...");
        setResponseTime(0);

        const startTime = Date.now();

        // Simulate API request
        setTimeout(() => {
            const endTime = Date.now();
            setResponseTime(endTime - startTime);

            // Simulate response
            const mockResponse = {
                status: 200,
                statusText: "OK",
                headers: {
                    "content-type": "application/json",
                    "x-powered-by": "Express",
                    "access-control-allow-origin": "*"
                },
                data: {
                    id: 1,
                    username: "testuser",
                    email: "test@example.com",
                    role: "user"
                }
            };

            setResponse(JSON.stringify(mockResponse, null, 2));
        }, 1000);
    };

    const getSeverityColor = (severity: string) => {
        const colors = {
            critical: "text-red-600 bg-red-50 border-red-200",
            high: "text-orange-600 bg-orange-50 border-orange-200",
            medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
            low: "text-blue-600 bg-blue-50 border-blue-200",
            info: "text-gray-600 bg-gray-50 border-gray-200"
        };
        return colors[severity as keyof typeof colors] || colors.info;
    };

    const getStatusIcon = (status: TestResult["status"]) => {
        switch (status) {
            case "vulnerable":
                return <XCircle className="h-5 w-5 text-red-600" />;
            case "safe":
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case "error":
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case "info":
                return <Shield className="h-5 w-5 text-blue-600" />;
        }
    };

    const vulnerableCount = testResults.filter(r => r.status === "vulnerable").length;
    const safeCount = testResults.filter(r => r.status === "safe").length;
    const criticalCount = testResults.filter(r => r.status === "vulnerable" && r.test.severity === "critical").length;
    const highCount = testResults.filter(r => r.status === "vulnerable" && r.test.severity === "high").length;

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Shield className="h-8 w-8 text-primary" />
                    API Security Tester
                </h1>
                <p className="text-muted-foreground">
                    Comprehensive REST API vulnerability scanner for penetration testing
                </p>
            </div>

            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    ⚠️ <strong>Educational Tool - Authorized Testing Only:</strong> Only test APIs you own or have explicit permission to test.
                    Unauthorized security testing is illegal. This is a simulated testing environment for learning purposes.
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="scanner" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="scanner">
                        <Zap className="h-4 w-4 mr-2" />
                        Security Scanner
                    </TabsTrigger>
                    <TabsTrigger value="manual">
                        <Send className="h-4 w-4 mr-2" />
                        Manual Testing
                    </TabsTrigger>
                    <TabsTrigger value="results">
                        <FileJson className="h-4 w-4 mr-2" />
                        Results ({testResults.length})
                    </TabsTrigger>
                </TabsList>

                {/* Security Scanner Tab */}
                <TabsContent value="scanner" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configure Security Scan</CardTitle>
                            <CardDescription>
                                Select vulnerability tests to run against your API endpoint
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="endpoint">API Endpoint URL</Label>
                                <Input
                                    id="endpoint"
                                    placeholder="https://api.example.com/endpoint"
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="scan-method">HTTP Method</Label>
                                    <Select value={method} onValueChange={setMethod}>
                                        <SelectTrigger id="scan-method">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tests Selected</Label>
                                    <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md bg-muted">
                                        <span className="text-sm font-medium">
                                            {selectedTests.length} of {vulnerabilityTests.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Vulnerability Tests</Label>
                                    <Button onClick={toggleAllTests} variant="outline" size="sm">
                                        {selectedTests.length === vulnerabilityTests.length ? "Deselect All" : "Select All"}
                                    </Button>
                                </div>

                                <div className="grid gap-3 max-h-96 overflow-y-auto p-4 border rounded-lg">
                                    {vulnerabilityTests.map((test) => (
                                        <div key={test.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                            <Switch
                                                checked={selectedTests.includes(test.id)}
                                                onCheckedChange={() => toggleTest(test.id)}
                                                id={test.id}
                                            />
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor={test.id} className="cursor-pointer font-medium">
                                                        {test.name}
                                                    </Label>
                                                    <Badge className={getSeverityColor(test.severity)}>
                                                        {test.severity.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{test.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {isScanning && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Scanning progress...</span>
                                        <span className="font-medium">{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-primary rounded-full h-2 transition-all duration-300"
                                            style={{ width: `${scanProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={runSecurityScan}
                                disabled={isScanning || selectedTests.length === 0}
                                className="w-full"
                                size="lg"
                            >
                                {isScanning ? (
                                    <>
                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                        Scanning... ({testResults.length}/{selectedTests.length})
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4 mr-2" />
                                        Run Security Scan
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {testResults.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Scan Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{vulnerableCount}</div>
                                        <div className="text-sm text-muted-foreground">Vulnerable</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{safeCount}</div>
                                        <div className="text-sm text-muted-foreground">Safe</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-red-700">{criticalCount}</div>
                                        <div className="text-sm text-muted-foreground">Critical</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{highCount}</div>
                                        <div className="text-sm text-muted-foreground">High Risk</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Manual Testing Tab */}
                <TabsContent value="manual" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manual API Request</CardTitle>
                            <CardDescription>
                                Send custom API requests and analyze responses
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <Label htmlFor="manual-method">Method</Label>
                                    <Select value={method} onValueChange={setMethod}>
                                        <SelectTrigger id="manual-method">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                                            <SelectItem value="HEAD">HEAD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-3">
                                    <Label htmlFor="manual-endpoint">Endpoint URL</Label>
                                    <Input
                                        id="manual-endpoint"
                                        placeholder="https://api.example.com/endpoint"
                                        value={endpoint}
                                        onChange={(e) => setEndpoint(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="headers">Headers (JSON format)</Label>
                                <Textarea
                                    id="headers"
                                    value={headers}
                                    onChange={(e) => setHeaders(e.target.value)}
                                    placeholder='{"Authorization": "Bearer token"}'
                                    rows={5}
                                    className="font-mono text-sm"
                                />
                            </div>

                            {method !== "GET" && method !== "HEAD" && (
                                <div className="space-y-2">
                                    <Label htmlFor="body">Request Body (JSON format)</Label>
                                    <Textarea
                                        id="body"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        placeholder='{"key": "value"}'
                                        rows={6}
                                        className="font-mono text-sm"
                                    />
                                </div>
                            )}

                            <Button onClick={sendRequest} className="w-full" size="lg">
                                <Send className="h-4 w-4 mr-2" />
                                Send Request
                            </Button>

                            {response && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Response</Label>
                                        {responseTime > 0 && (
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {responseTime}ms
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <pre className="text-xs overflow-x-auto">{response}</pre>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results" className="space-y-4">
                    {testResults.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No scan results yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Run a security scan to see vulnerability test results here
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {testResults.map((result, index) => (
                                <Card key={index} className={result.status === "vulnerable" ? "border-red-200 bg-red-50/50" : ""}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                {getStatusIcon(result.status)}
                                                <div>
                                                    <CardTitle className="text-lg">{result.test.name}</CardTitle>
                                                    <CardDescription>{result.test.description}</CardDescription>
                                                </div>
                                            </div>
                                            <Badge className={getSeverityColor(result.test.severity)}>
                                                {result.test.severity.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {new Date(result.timestamp).toLocaleString()}
                                        </div>

                                        <Alert className={result.status === "vulnerable" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                                            <AlertDescription>{result.details}</AlertDescription>
                                        </Alert>

                                        {result.evidence && (
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Evidence:</Label>
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <pre className="text-xs whitespace-pre-wrap">{result.evidence}</pre>
                                                </div>
                                            </div>
                                        )}

                                        {result.status === "vulnerable" && (
                                            <div className="flex gap-2 pt-2">
                                                <Badge variant="outline" className="text-red-600">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    Requires Patching
                                                </Badge>
                                                <Badge variant="outline">
                                                    {result.test.category}
                                                </Badge>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default APISecurityTester;
