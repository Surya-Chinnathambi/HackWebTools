import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Trophy, Lightbulb, Shield, Copy, Check } from "lucide-react";

const JWTManipulator = () => {
    const [jwtToken, setJwtToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NDA5NjAwMDB9.4Kx3Qz8YQq7JT3xD5H8FKZ7yL9M2N4P6R8S0T2V4W6Y");
    const [decodedHeader, setDecodedHeader] = useState("");
    const [decodedPayload, setDecodedPayload] = useState("");
    const [signature, setSignature] = useState("");
    const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [copied, setCopied] = useState(false);

    // Sample valid token with weak secret
    const WEAK_SECRET = "secret123";

    const decodeJWT = (token: string) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error("Invalid JWT format");
            }

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            setDecodedHeader(JSON.stringify(header, null, 2));
            setDecodedPayload(JSON.stringify(payload, null, 2));
            setSignature(parts[2]);
        } catch (error) {
            alert("Invalid JWT token format!");
        }
    };

    const encodeJWT = (header: string, payload: string, sig: string): string => {
        try {
            const headerObj = JSON.parse(header);
            const payloadObj = JSON.parse(payload);

            const encodedHeader = btoa(JSON.stringify(headerObj)).replace(/=/g, '');
            const encodedPayload = btoa(JSON.stringify(payloadObj)).replace(/=/g, '');

            return `${encodedHeader}.${encodedPayload}.${sig}`;
        } catch (error) {
            alert("Invalid JSON format!");
            return jwtToken;
        }
    };

    const handleAlgNoneAttack = () => {
        setAttempts(prev => prev + 1);
        try {
            const header = JSON.parse(decodedHeader);

            if (header.alg === "none" || header.alg === "None" || header.alg === "NONE") {
                setCompletedChallenges(prev => new Set([...prev, "jwt-alg-none"]));
                alert("🎉 FLAG{jwt_alg_none_bypass} - Algorithm confusion attack successful!");
            } else {
                if (attempts >= 2) setShowHint(true);
                alert("❌ Attack failed. Check the algorithm in the header.");
            }
        } catch (error) {
            alert("Invalid header JSON!");
        }
    };

    const handleWeakSecretCrack = () => {
        setAttempts(prev => prev + 1);

        // Simulate cracking attempt
        alert("🔍 Running dictionary attack on JWT secret...\n\nTrying common passwords:\n- secret\n- secret123 ✓ FOUND!\n- password\n- ...");

        setTimeout(() => {
            setCompletedChallenges(prev => new Set([...prev, "jwt-weak-secret"]));
            alert(`🎉 FLAG{jwt_secret_cracked}\n\nSecret found: ${WEAK_SECRET}\n\nYou can now forge your own tokens!`);
        }, 1000);
    };

    const handlePrivilegeEscalation = () => {
        setAttempts(prev => prev + 1);
        try {
            const payload = JSON.parse(decodedPayload);

            if (payload.role === "admin" || payload.role === "administrator") {
                setCompletedChallenges(prev => new Set([...prev, "jwt-claim-manipulation"]));
                alert("🎉 FLAG{jwt_admin_escalation} - Privilege escalation successful! You are now admin.");
            } else {
                if (attempts >= 2) setShowHint(true);
                alert(`❌ Access denied. Current role: ${payload.role}`);
            }
        } catch (error) {
            alert("Invalid payload JSON!");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hints = {
        "alg-none": [
            "JWT signature verification can be bypassed by setting algorithm to 'none'",
            "Change 'alg' in header from 'HS256' to 'none'",
            "Remove the signature but keep the final dot: header.payload."
        ],
        "weak-secret": [
            "The JWT is signed with a weak secret",
            "Try common passwords: secret, secret123, password",
            "Use the 'Crack Secret' button to simulate a dictionary attack"
        ],
        "privilege": [
            "Check the current role in the payload",
            "Change 'role' from 'user' to 'admin'",
            "You need to re-sign the token with the cracked secret"
        ]
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-slate-950 to-purple-950/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Key className="h-6 w-6 text-purple-500" />
                                JWT Manipulation Lab
                            </CardTitle>
                            <p className="text-sm text-slate-400 mt-2">
                                Exploit JWT vulnerabilities: algorithm confusion, weak secrets, and claim manipulation
                            </p>
                        </div>
                        <Badge variant="secondary" className="text-lg py-2 px-4">
                            {completedChallenges.size}/3 Challenges
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* JWT Decoder/Encoder */}
                    <Card className="bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-lg">JWT Token Analyzer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">JWT Token:</label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(jwtToken)}
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <Textarea
                                    value={jwtToken}
                                    onChange={(e) => setJwtToken(e.target.value)}
                                    className="font-mono text-xs"
                                    rows={3}
                                />
                                <Button onClick={() => decodeJWT(jwtToken)} className="w-full">
                                    Decode JWT
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-blue-400">Header:</label>
                                    <Textarea
                                        value={decodedHeader}
                                        onChange={(e) => setDecodedHeader(e.target.value)}
                                        className="font-mono text-xs bg-blue-950/20"
                                        rows={5}
                                        placeholder="Decoded header will appear here..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-green-400">Payload:</label>
                                    <Textarea
                                        value={decodedPayload}
                                        onChange={(e) => setDecodedPayload(e.target.value)}
                                        className="font-mono text-xs bg-green-950/20"
                                        rows={5}
                                        placeholder="Decoded payload will appear here..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-red-400">Signature:</label>
                                <Textarea
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    className="font-mono text-xs bg-red-950/20"
                                    rows={2}
                                    placeholder="Signature will appear here..."
                                />
                            </div>

                            <Button
                                onClick={() => setJwtToken(encodeJWT(decodedHeader, decodedPayload, signature))}
                                variant="secondary"
                                className="w-full"
                            >
                                Encode Modified JWT
                            </Button>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="alg-none">Alg=None</TabsTrigger>
                            <TabsTrigger value="weak-secret">Weak Secret</TabsTrigger>
                            <TabsTrigger value="privilege">Privilege Esc</TabsTrigger>
                        </TabsList>

                        {/* Overview */}
                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">About JWT Attacks</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <p>
                                        JSON Web Tokens (JWT) are used for authentication and authorization. However, improper implementation can lead to serious vulnerabilities.
                                    </p>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-400">Common JWT Vulnerabilities:</h4>
                                        <ul className="space-y-1 ml-4 list-disc">
                                            <li><strong>Algorithm Confusion (alg=none):</strong> Bypass signature verification</li>
                                            <li><strong>Weak Secrets:</strong> Crack the signing key using dictionary attacks</li>
                                            <li><strong>Claim Manipulation:</strong> Modify user role or permissions</li>
                                            <li><strong>Algorithm Switching:</strong> Change from RS256 to HS256</li>
                                        </ul>
                                    </div>
                                    <Alert className="bg-yellow-950/20 border-yellow-500/20">
                                        <AlertDescription className="text-xs">
                                            <strong>JWT Structure:</strong> header.payload.signature<br />
                                            Each part is Base64-encoded. The signature ensures integrity.
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Challenge 1: alg=none */}
                        <TabsContent value="alg-none" className="space-y-4">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Challenge 1: Algorithm None Attack
                                        {completedChallenges.has("jwt-alg-none") && <Badge>✅ Completed</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        Bypass authentication by changing the algorithm to 'none'. This exploits applications that don't properly verify the algorithm.
                                    </p>

                                    <Alert className="bg-blue-950/20 border-blue-500/20">
                                        <AlertDescription className="text-xs">
                                            <strong>Goal:</strong> Modify the JWT header to use algorithm 'none' and remove the signature
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-2">
                                        <p className="text-xs font-mono bg-slate-950 p-3 rounded">
                                            Current: {`{"alg":"HS256","typ":"JWT"}`}<br />
                                            Target: {`{"alg":"none","typ":"JWT"}`}
                                        </p>
                                    </div>

                                    <Button onClick={handleAlgNoneAttack} className="w-full">
                                        Test Algorithm None Attack
                                    </Button>

                                    {showHint && !completedChallenges.has("jwt-alg-none") && (
                                        <Alert className="bg-blue-950/20 border-blue-500/20">
                                            <Lightbulb className="h-4 w-4" />
                                            <AlertDescription className="text-xs">
                                                💡 {hints["alg-none"][Math.min(attempts - 2, 2)]}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Challenge 2: Weak Secret */}
                        <TabsContent value="weak-secret" className="space-y-4">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Challenge 2: Crack Weak JWT Secret
                                        {completedChallenges.has("jwt-weak-secret") && <Badge>✅ Completed</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        The JWT is signed with a weak secret. Use a dictionary attack to crack the signing key.
                                    </p>

                                    <Alert className="bg-yellow-950/20 border-yellow-500/20">
                                        <AlertDescription className="text-xs">
                                            <strong>Hint:</strong> The secret is one of the most common passwords. Try: secret, password, 123456, admin, secret123
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-400">
                                            In real attacks, tools like hashcat or john can crack JWT secrets:
                                        </p>
                                        <pre className="text-xs bg-slate-950 p-3 rounded font-mono">
                                            hashcat -a 0 -m 16500 jwt.txt wordlist.txt
                                        </pre>
                                    </div>

                                    <Button onClick={handleWeakSecretCrack} variant="destructive" className="w-full">
                                        🔨 Crack JWT Secret (Dictionary Attack)
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Challenge 3: Privilege Escalation */}
                        <TabsContent value="privilege" className="space-y-4">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Challenge 3: Privilege Escalation
                                        {completedChallenges.has("jwt-claim-manipulation") && <Badge>✅ Completed</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        Modify the JWT payload to escalate your privileges from 'user' to 'admin'.
                                    </p>

                                    <Alert className="bg-blue-950/20 border-blue-500/20">
                                        <AlertDescription className="text-xs">
                                            <strong>Steps:</strong><br />
                                            1. Decode the JWT<br />
                                            2. Change "role": "user" to "role": "admin" in payload<br />
                                            3. Re-sign with cracked secret (if needed)<br />
                                            4. Test the attack
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-2">
                                        <p className="text-xs font-mono bg-slate-950 p-3 rounded">
                                            Current: {`{"user_id":"123","role":"user"}`}<br />
                                            Target: {`{"user_id":"123","role":"admin"}`}
                                        </p>
                                    </div>

                                    <Button onClick={handlePrivilegeEscalation} variant="destructive" className="w-full">
                                        Test Admin Access
                                    </Button>

                                    {showHint && !completedChallenges.has("jwt-claim-manipulation") && (
                                        <Alert className="bg-blue-950/20 border-blue-500/20">
                                            <Lightbulb className="h-4 w-4" />
                                            <AlertDescription className="text-xs">
                                                💡 {hints["privilege"][Math.min(attempts - 2, 2)]}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Prevention */}
                    <Card className="bg-green-950/20 border-green-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-400" />
                                JWT Security Best Practices
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <ul className="space-y-1 ml-4 list-disc">
                                <li>✅ Use strong, random secrets (32+ characters)</li>
                                <li>✅ Explicitly verify the algorithm (don't allow 'none')</li>
                                <li>✅ Validate all JWT claims (exp, iat, nbf)</li>
                                <li>✅ Use short expiration times (15-30 minutes)</li>
                                <li>✅ Store secrets securely (environment variables, vault)</li>
                                <li>✅ Consider using asymmetric algorithms (RS256, ES256)</li>
                            </ul>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
};

export default JWTManipulator;
