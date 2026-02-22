import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, AlertTriangle, Trophy, Lightbulb, Shield } from "lucide-react";

type ChallengeType = "reflected" | "stored" | "dom" | "filter-bypass" | null;

const XSSPlayground = () => {
    const [activeChallenge, setActiveChallenge] = useState<ChallengeType>(null);
    const [searchInput, setSearchInput] = useState("");
    const [commentInput, setCommentInput] = useState("");
    const [urlHash, setUrlHash] = useState("");
    const [bypassInput, setBypassInput] = useState("");
    const [comments, setComments] = useState<string[]>([]);
    const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Check for XSS patterns
    const detectXSS = (input: string): boolean => {
        const xssPatterns = [
            /<script/i,
            /onerror/i,
            /onload/i,
            /onfocus/i,
            /alert\(/i,
            /javascript:/i,
            /<img/i,
            /<svg/i,
            /<iframe/i
        ];
        return xssPatterns.some(pattern => pattern.test(input));
    };

    // Reflected XSS handler
    const handleReflectedSearch = () => {
        setAttempts(prev => prev + 1);
        if (detectXSS(searchInput)) {
            // XSS detected!
            setCompletedChallenges(prev => new Set([...prev, "xss-reflected"]));
            alert("🎉 FLAG{reflected_xss_found} - Reflected XSS exploited successfully!");
        } else {
            if (attempts >= 2) setShowHint(true);
        }
    };

    // Stored XSS handler
    const handleAddComment = () => {
        setAttempts(prev => prev + 1);
        if (detectXSS(commentInput)) {
            setComments([...comments, commentInput]);
            setCompletedChallenges(prev => new Set([...prev, "xss-stored"]));
            alert("🎉 FLAG{stored_xss_persistent} - Stored XSS payload injected!");
        } else {
            setComments([...comments, commentInput]);
            if (attempts >= 2) setShowHint(true);
        }
        setCommentInput("");
    };

    // DOM XSS handler
    useEffect(() => {
        if (urlHash && detectXSS(urlHash)) {
            setCompletedChallenges(prev => new Set([...prev, "xss-dom"]));
            alert("🎉 FLAG{dom_xss_expert} - DOM XSS exploited!");
        }
    }, [urlHash]);

    // Filter bypass handler
    const handleFilterBypass = () => {
        setAttempts(prev => prev + 1);
        const blocked = /script/i.test(bypassInput);

        if (!blocked && detectXSS(bypassInput)) {
            setCompletedChallenges(prev => new Set([...prev, "xss-filter-bypass"]));
            alert("🎉 FLAG{filter_bypass_master} - Successfully bypassed XSS filter!");
        } else if (blocked) {
            alert("❌ Blocked: <script> tags are not allowed!");
            if (attempts >= 2) setShowHint(true);
        }
    };

    const getHints = (challenge: ChallengeType) => {
        const hints: Record<string, string[]> = {
            "reflected": [
                "User input is directly shown in the page",
                "Try: <script>alert('XSS')</script>",
                "The search parameter is reflected without encoding"
            ],
            "stored": [
                "Comments are stored and displayed to all users",
                "Try using an image tag with onerror event",
                "Payload: <img src=x onerror=alert(document.cookie)>"
            ],
            "dom": [
                "Check how JavaScript processes the hash parameter",
                "innerHTML is used without sanitization",
                "Try: #<img src=x onerror=alert('DOM_XSS')>"
            ],
            "filter-bypass": [
                "Basic filters block <script> tags",
                "Try alternative tags: <img>, <svg>, <iframe>",
                "Event handlers: onerror, onload, onfocus"
            ]
        };
        return hints[challenge || "reflected"] || [];
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-slate-950 to-orange-950/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Code className="h-6 w-6 text-orange-500" />
                                XSS Playground - Cross-Site Scripting Lab
                            </CardTitle>
                            <p className="text-sm text-slate-400 mt-2">
                                Master reflected, stored, and DOM-based XSS attacks
                            </p>
                        </div>
                        <Badge variant="secondary" className="text-lg py-2 px-4">
                            {completedChallenges.size}/4 Challenges
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Tabs value={activeChallenge || "intro"} onValueChange={(v) => setActiveChallenge(v as ChallengeType)}>
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="intro">Overview</TabsTrigger>
                            <TabsTrigger value="reflected">Reflected</TabsTrigger>
                            <TabsTrigger value="stored">Stored</TabsTrigger>
                            <TabsTrigger value="dom">DOM XSS</TabsTrigger>
                            <TabsTrigger value="filter-bypass">Filter Bypass</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="intro" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">About XSS Vulnerabilities</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <p>
                                        Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages viewed by other users.
                                        This lab contains 4 different XSS challenges representing real-world scenarios.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-orange-400">Types of XSS:</h4>
                                            <ul className="space-y-1 ml-4 list-disc">
                                                <li><strong>Reflected XSS</strong>: Payload in URL, immediately reflected</li>
                                                <li><strong>Stored XSS</strong>: Payload stored in database, persistent</li>
                                                <li><strong>DOM XSS</strong>: Client-side JavaScript vulnerability</li>
                                                <li><strong>Filter Bypass</strong>: Evading XSS protection mechanisms</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-orange-400">Learning Goals:</h4>
                                            <ul className="space-y-1 ml-4 list-disc">
                                                <li>Identify XSS injection points</li>
                                                <li>Craft effective XSS payloads</li>
                                                <li>Bypass input filters</li>
                                                <li>Understand XSS prevention (CSP, encoding)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Alert className="bg-blue-950/20 border-blue-500/20">
                                <AlertTriangle className="h-4 w-4 text-blue-400" />
                                <AlertDescription>
                                    <strong>Note:</strong> This is a safe, sandboxed environment. All XSS payloads execute in an isolated context and cannot harm your browser or data.
                                </AlertDescription>
                            </Alert>
                        </TabsContent>

                        {/* Reflected XSS Tab */}
                        <TabsContent value="reflected" className="space-y-4">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Challenge 1: Reflected XSS
                                        {completedChallenges.has("xss-reflected") && <Badge variant="default">✅ Completed</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        Find and exploit a reflected XSS vulnerability in the search feature.
                                        Your input is reflected directly in the page without proper encoding.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Search Query:</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                                placeholder="Enter search query..."
                                                className="font-mono"
                                            />
                                            <Button onClick={handleReflectedSearch}>Search</Button>
                                        </div>
                                    </div>

                                    {searchInput && (
                                        <Card className="bg-slate-950/50">
                                            <CardContent className="pt-4">
                                                <p className="text-sm text-slate-400">Search results for:</p>
                                                <div
                                                    className="mt-2 p-3 bg-slate-900 rounded border border-slate-700"
                                                    dangerouslySetInnerHTML={{ __html: searchInput }}
                                                />
                                            </CardContent>
                                        </Card>
                                    )}

                                    {showHint && !completedChallenges.has("xss-reflected") && (
                                        <Alert className="bg-blue-950/20 border-blue-500/20">
                                            <Lightbulb className="h-4 w-4 text-blue-400" />
                                            <AlertDescription>
                                                💡 {getHints("reflected")[Math.min(attempts - 2, 2)]}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Stored XSS Tab */}
                        <TabsContent value="stored" className="space-y-4">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Challenge 2: Stored XSS
                                        {completedChallenges.has("xss-stored") && <Badge variant="default">✅ Completed</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        Inject a persistent XSS payload in the comment section. The payload will be stored and executed for all users viewing the comments.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Add Comment:</label>
                                        <Textarea
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="font-mono"
                                            rows={3}
                                        />
                                        <Button onClick={handleAddComment} disabled={!commentInput}>
                                            Post Comment
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold">Comments ({comments.length}):</h4>
                                        <div className="space-y-2">
                                            {comments.map((comment, idx) => (
                                                <Card key={idx} className="bg-slate-950/50">
                                                    <CardContent className="pt-4">
                                                        <div
                                                            className="text-sm"
                                                            dangerouslySetInnerHTML={{ __html: comment }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            {comments.length === 0 && (
                                                <p className="text-sm text-slate-500 italic">No comments yet</p>
                                            )}
                                        </div>
                                    </div>

                                    {showHint && !completedChallenges.has("xss-stored") && (
                                        <Alert className="bg-blue-950/20 border-blue-500/20">
                                            <Lightbulb className="h-4 w-4 text-blue-400" />
                                            <AlertDescription>
                                                💡 {getHints("stored")[Math.min(attempts - 2, 2)]}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* DOM XSS Tab */}
                        <TabsContent value="dom" className="space-y-4">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Challenge 3: DOM-based XSS
                                        {completedChallenges.has("xss-dom") && <Badge variant="default">✅ Completed</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        Exploit client-side JavaScript to achieve DOM XSS. The application processes URL hash parameters using innerHTML without sanitization.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">URL Hash Parameter:</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={urlHash}
                                                onChange={(e) => setUrlHash(e.target.value)}
                                                placeholder="Enter hash value (e.g., #welcome)"
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>

                                    {urlHash && (
                                        <Card className="bg-slate-950/50">
                                            <CardContent className="pt-4">
                                                <p className="text-sm text-slate-400 mb-2">Content from hash:</p>
                                                <div
                                                    className="p-3 bg-slate-900 rounded border border-slate-700"
                                                    dangerouslySetInnerHTML={{ __html: urlHash }}
                                                />
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Alert className="bg-yellow-950/20 border-yellow-500/20">
                                        <Code className="h-4 w-4 text-yellow-400" />
                                        <AlertDescription className="text-xs">
                                            <strong>Vulnerable Code:</strong><br />
                                            <code className="text-yellow-300">
                                                const hash = location.hash.substr(1);<br />
                                                document.getElementById('content').innerHTML = hash;
                                            </code>
                                        </AlertDescription>
                                    </Alert>

                                    {showHint && !completedChallenges.has("xss-dom") && (
                                        <Alert className="bg-blue-950/20 border-blue-500/20">
                                            <Lightbulb className="h-4 w-4 text-blue-400" />
                                            <AlertDescription>
                                                💡 {getHints("dom")[Math.min(attempts - 2, 2)]}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Filter Bypass Tab */}
                        <TabsContent value="filter-bypass" className="space-y-4">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Challenge 4: XSS Filter Bypass
                                        {completedChallenges.has("xss-filter-bypass") && <Badge variant="default">✅ Completed</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        The application has a basic XSS filter that blocks &lt;script&gt; tags. Find an alternative way to execute JavaScript.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Input (filtered):</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={bypassInput}
                                                onChange={(e) => setBypassInput(e.target.value)}
                                                placeholder="Try to bypass the filter..."
                                                className="font-mono"
                                            />
                                            <Button onClick={handleFilterBypass}>Submit</Button>
                                        </div>
                                    </div>

                                    <Alert className="bg-red-950/20 border-red-500/20">
                                        <Shield className="h-4 w-4 text-red-400" />
                                        <AlertDescription className="text-xs">
                                            <strong>Filter Rules:</strong><br />
                                            ❌ &lt;script&gt; tags are blocked<br />
                                            ❌ Case-insensitive (&lt;ScRiPt&gt; also blocked)
                                        </AlertDescription>
                                    </Alert>

                                    {showHint && !completedChallenges.has("xss-filter-bypass") && (
                                        <Alert className="bg-blue-950/20 border-blue-500/20">
                                            <Lightbulb className="h-4 w-4 text-blue-400" />
                                            <AlertDescription>
                                                💡 {getHints("filter-bypass")[Math.min(attempts - 2, 2)]}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Learning Summary */}
                    <Card className="bg-green-950/20 border-green-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-400" />
                                XSS Prevention Best Practices
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <ul className="space-y-1 ml-4 list-disc">
                                <li>✅ Always encode output (HTML entity encoding)</li>
                                <li>✅ Use textContent instead of innerHTML</li>
                                <li>✅ Implement Content Security Policy (CSP)</li>
                                <li>✅ Set httpOnly flag on cookies</li>
                                <li>✅ Validate and sanitize all user input</li>
                                <li>✅ Use modern frameworks with auto-escaping (React, Vue)</li>
                            </ul>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
};

export default XSSPlayground;
