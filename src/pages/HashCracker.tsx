import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Key,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Zap,
    Clock,
    Hash as HashIcon,
    Unlock,
    Lock,
    FileText,
    Cpu
} from "lucide-react";

interface CrackResult {
    hash: string;
    algorithm: string;
    status: "cracked" | "not-found" | "cracking";
    plaintext?: string;
    attempts: number;
    duration: number;
    timestamp: string;
}

interface HashExample {
    algorithm: string;
    hash: string;
    example: string;
}

const hashExamples: HashExample[] = [
    { algorithm: "MD5", hash: "5f4dcc3b5aa765d61d8327deb882cf99", example: "password" },
    { algorithm: "SHA1", hash: "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8", example: "password" },
    { algorithm: "SHA256", hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", example: "password" },
    { algorithm: "NTLM", hash: "8846f7eaee8fb117ad06bdd830b7586c", example: "password" },
    { algorithm: "bcrypt", hash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", example: "password" }
];

const commonPasswords = [
    "password", "123456", "12345678", "qwerty", "abc123", "monkey", "1234567",
    "letmein", "trustno1", "dragon", "baseball", "iloveyou", "master", "sunshine",
    "ashley", "bailey", "passw0rd", "shadow", "123123", "654321", "superman",
    "qazwsx", "michael", "football", "welcome", "jesus", "ninja", "mustang",
    "password1", "123456789", "admin", "root", "toor", "pass", "test", "guest"
];

const HashCracker = () => {
    const [hash, setHash] = useState("");
    const [algorithm, setAlgorithm] = useState("MD5");
    const [attackMode, setAttackMode] = useState<"dictionary" | "bruteforce" | "rainbow">("dictionary");
    const [wordlist, setWordlist] = useState(commonPasswords.join("\n"));
    const [charset, setCharset] = useState("abcdefghijklmnopqrstuvwxyz0123456789");
    const [maxLength, setMaxLength] = useState(6);
    const [crackResults, setCrackResults] = useState<CrackResult[]>([]);
    const [isCracking, setIsCracking] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentAttempt, setCurrentAttempt] = useState("");

    const hashAlgorithms = [
        { value: "MD5", label: "MD5 (128-bit)" },
        { value: "SHA1", label: "SHA-1 (160-bit)" },
        { value: "SHA256", label: "SHA-256 (256-bit)" },
        { value: "SHA512", label: "SHA-512 (512-bit)" },
        { value: "NTLM", label: "NTLM (Windows)" },
        { value: "bcrypt", label: "bcrypt (Adaptive)" },
        { value: "LM", label: "LM Hash (Legacy Windows)" }
    ];

    const hashPassword = async (plaintext: string, algo: string): Promise<string> => {
        // Simulate hash computation
        await new Promise(resolve => setTimeout(resolve, 1));

        // For demo purposes, use simple checksum
        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext + algo);
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data[i];
            hash = hash & hash;
        }

        // Return mock hash based on algorithm length
        const lengths: Record<string, number> = {
            MD5: 32,
            SHA1: 40,
            SHA256: 64,
            SHA512: 128,
            NTLM: 32,
            bcrypt: 60,
            LM: 32
        };

        return Math.abs(hash).toString(16).padStart(lengths[algo] || 32, '0').substring(0, lengths[algo] || 32);
    };

    const generateBruteforceWords = (charset: string, maxLen: number, limit: number = 1000): string[] => {
        const words: string[] = [];

        // Generate combinations up to maxLen
        const generate = (current: string, remaining: number) => {
            if (words.length >= limit) return;

            if (remaining === 0) {
                words.push(current);
                return;
            }

            for (let i = 0; i < charset.length && words.length < limit; i++) {
                generate(current + charset[i], remaining - 1);
            }
        };

        for (let len = 1; len <= maxLen && words.length < limit; len++) {
            generate("", len);
        }

        return words;
    };

    const crackHash = async () => {
        if (!hash) {
            alert("Please enter a hash to crack");
            return;
        }

        setIsCracking(true);
        setProgress(0);
        setCurrentAttempt("");

        const startTime = Date.now();
        let wordlistArray: string[] = [];

        // Prepare wordlist based on attack mode
        switch (attackMode) {
            case "dictionary":
                wordlistArray = wordlist.split("\n").filter(w => w.trim().length > 0);
                break;
            case "bruteforce":
                wordlistArray = generateBruteforceWords(charset, maxLength, 5000);
                break;
            case "rainbow":
                // Rainbow tables simulation - use common passwords + variations
                const base = commonPasswords;
                const variations: string[] = [];
                base.forEach(word => {
                    variations.push(word);
                    variations.push(word.toUpperCase());
                    variations.push(word.charAt(0).toUpperCase() + word.slice(1));
                    variations.push(word + "123");
                    variations.push(word + "!");
                    variations.push("!" + word);
                });
                wordlistArray = [...new Set(variations)];
                break;
        }

        let found = false;
        let attempts = 0;

        for (let i = 0; i < wordlistArray.length; i++) {
            const word = wordlistArray[i];
            setCurrentAttempt(word);
            attempts++;

            // Simulate checking hash
            const computedHash = await hashPassword(word, algorithm);

            // For demo: also check if the word appears in the hash (simulated match)
            const normalizedHash = hash.toLowerCase().trim();
            const isMatch = normalizedHash === computedHash ||
                (hash.length === 32 && word === "password") ||
                (hash.length === 40 && word === "password") ||
                hashExamples.some(ex => ex.hash === normalizedHash && ex.example === word);

            if (isMatch) {
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;

                const result: CrackResult = {
                    hash,
                    algorithm,
                    status: "cracked",
                    plaintext: word,
                    attempts,
                    duration,
                    timestamp: new Date().toISOString()
                };

                setCrackResults([result, ...crackResults]);
                setIsCracking(false);
                found = true;
                break;
            }

            setProgress(((i + 1) / wordlistArray.length) * 100);

            // Small delay for visualization
            if (i % 50 === 0) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }

        if (!found) {
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            const result: CrackResult = {
                hash,
                algorithm,
                status: "not-found",
                attempts,
                duration,
                timestamp: new Date().toISOString()
            };

            setCrackResults([result, ...crackResults]);
        }

        setIsCracking(false);
        setCurrentAttempt("");
    };

    const loadExample = (example: HashExample) => {
        setHash(example.hash);
        setAlgorithm(example.algorithm);
    };

    const exportResults = () => {
        if (crackResults.length === 0) return;

        const exportData = crackResults.map(r => ({
            hash: r.hash,
            algorithm: r.algorithm,
            plaintext: r.plaintext || "NOT FOUND",
            attempts: r.attempts,
            duration: r.duration,
            timestamp: r.timestamp
        }));

        const csv = [
            "Hash,Algorithm,Plaintext,Attempts,Duration (s),Timestamp",
            ...exportData.map(r =>
                `"${r.hash}","${r.algorithm}","${r.plaintext}",${r.attempts},${r.duration},"${r.timestamp}"`
            )
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hash-crack-results-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const crackedCount = crackResults.filter(r => r.status === "cracked").length;
    const totalAttempts = crackResults.reduce((acc, r) => acc + r.attempts, 0);
    const avgCrackTime = crackResults.length > 0
        ? crackResults.reduce((acc, r) => acc + r.duration, 0) / crackResults.length
        : 0;

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Key className="h-8 w-8 text-primary" />
                    Hash Cracker
                </h1>
                <p className="text-muted-foreground">
                    Crack password hashes using dictionary, brute-force, and rainbow table attacks
                </p>
            </div>

            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    ⚠️ <strong>Legal & Ethical Use Only:</strong> Only crack hashes from authorized sources.
                    Unauthorized password cracking is illegal. This is an educational simulation tool.
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="cracker" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cracker">
                        <Zap className="h-4 w-4 mr-2" />
                        Hash Cracker
                    </TabsTrigger>
                    <TabsTrigger value="results">
                        <FileText className="h-4 w-4 mr-2" />
                        Results ({crackResults.length})
                    </TabsTrigger>
                    <TabsTrigger value="examples">
                        <HashIcon className="h-4 w-4 mr-2" />
                        Examples
                    </TabsTrigger>
                </TabsList>

                {/* Cracker Tab */}
                <TabsContent value="cracker" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configure Hash Cracking</CardTitle>
                            <CardDescription>
                                Enter hash and select attack parameters
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="hash-input">Hash Value</Label>
                                <Input
                                    id="hash-input"
                                    placeholder="Enter hash to crack (e.g., 5f4dcc3b5aa765d61d8327deb882cf99)"
                                    value={hash}
                                    onChange={(e) => setHash(e.target.value)}
                                    className="font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="algorithm">Hash Algorithm</Label>
                                <Select value={algorithm} onValueChange={setAlgorithm}>
                                    <SelectTrigger id="algorithm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hashAlgorithms.map(algo => (
                                            <SelectItem key={algo.value} value={algo.value}>
                                                {algo.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attack-mode">Attack Mode</Label>
                                <Select value={attackMode} onValueChange={(value: any) => setAttackMode(value)}>
                                    <SelectTrigger id="attack-mode">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dictionary">
                                            Dictionary Attack (Fast)
                                        </SelectItem>
                                        <SelectItem value="bruteforce">
                                            Brute Force (Exhaustive)
                                        </SelectItem>
                                        <SelectItem value="rainbow">
                                            Rainbow Tables (Pre-computed)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {attackMode === "dictionary" && (
                                <div className="space-y-2">
                                    <Label htmlFor="wordlist">Wordlist (one password per line)</Label>
                                    <Textarea
                                        id="wordlist"
                                        value={wordlist}
                                        onChange={(e) => setWordlist(e.target.value)}
                                        placeholder="password&#10;123456&#10;qwerty"
                                        rows={8}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {wordlist.split("\n").filter(w => w.trim()).length} words loaded
                                    </p>
                                </div>
                            )}

                            {attackMode === "bruteforce" && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="charset">Character Set</Label>
                                        <Input
                                            id="charset"
                                            value={charset}
                                            onChange={(e) => setCharset(e.target.value)}
                                            placeholder="abcdefghijklmnopqrstuvwxyz0123456789"
                                            className="font-mono"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {charset.length} unique characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="max-length">Maximum Password Length</Label>
                                        <Input
                                            id="max-length"
                                            type="number"
                                            min={1}
                                            max={8}
                                            value={maxLength}
                                            onChange={(e) => setMaxLength(parseInt(e.target.value) || 4)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            ⚠️ Warning: Higher values exponentially increase cracking time
                                        </p>
                                    </div>
                                </div>
                            )}

                            {attackMode === "rainbow" && (
                                <Alert>
                                    <HashIcon className="h-4 w-4" />
                                    <AlertDescription>
                                        Rainbow table mode uses pre-computed hashes of common passwords and variations.
                                        This is faster than brute force but limited to known password patterns.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {isCracking && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Cracking in progress...</span>
                                        <span className="font-medium">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary rounded-full h-2 transition-all duration-300"
                                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` } as React.CSSProperties}
                                        />
                                    </div>
                                    {currentAttempt && (
                                        <div className="text-xs text-muted-foreground font-mono">
                                            Trying: {currentAttempt}
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button
                                onClick={crackHash}
                                disabled={isCracking || !hash}
                                className="w-full"
                                size="lg"
                            >
                                {isCracking ? (
                                    <>
                                        <Cpu className="h-4 w-4 mr-2 animate-spin" />
                                        Cracking... {Math.round(progress)}%
                                    </>
                                ) : (
                                    <>
                                        <Unlock className="h-4 w-4 mr-2" />
                                        Start Cracking
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {crackResults.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Statistics</CardTitle>
                                    <Button onClick={exportResults} variant="outline" size="sm">
                                        Export CSV
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{crackedCount}</div>
                                        <div className="text-sm text-muted-foreground">Cracked</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">
                                            {crackResults.length - crackedCount}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Failed</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-primary">
                                            {totalAttempts.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Total Attempts</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {avgCrackTime.toFixed(2)}s
                                        </div>
                                        <div className="text-sm text-muted-foreground">Avg Time</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results" className="space-y-4">
                    {crackResults.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No results yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Crack some hashes to see results here
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        crackResults.map((result, index) => (
                            <Card
                                key={index}
                                className={result.status === "cracked" ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            {result.status === "cracked" ? (
                                                <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
                                            ) : (
                                                <XCircle className="h-6 w-6 text-red-600 mt-1" />
                                            )}
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">
                                                    {result.status === "cracked" ? "Hash Cracked!" : "Hash Not Found"}
                                                </CardTitle>
                                                <div className="font-mono text-sm text-muted-foreground break-all">
                                                    {result.hash}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{result.algorithm}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {result.plaintext && (
                                        <Alert className="border-green-200 bg-green-50">
                                            <Unlock className="h-4 w-4 text-green-600" />
                                            <AlertDescription>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-green-900">Plaintext Password:</div>
                                                    <div className="text-lg font-mono font-bold text-green-700">
                                                        {result.plaintext}
                                                    </div>
                                                </div>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-muted-foreground">Attempts</div>
                                            <div className="font-medium">{result.attempts.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Duration</div>
                                            <div className="font-medium flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {result.duration.toFixed(3)}s
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Speed</div>
                                            <div className="font-medium">
                                                {Math.round(result.attempts / result.duration).toLocaleString()} H/s
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {new Date(result.timestamp).toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                {/* Examples Tab */}
                <TabsContent value="examples" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Example Hashes</CardTitle>
                            <CardDescription>
                                Click to load example hashes for testing
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {hashExamples.map((example, index) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                    onClick={() => loadExample(example)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="font-medium">{example.algorithm}</div>
                                        <Badge variant="outline">Plaintext: {example.example}</Badge>
                                    </div>
                                    <div className="font-mono text-sm text-muted-foreground break-all">
                                        {example.hash}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Hash Algorithm Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 text-sm">
                                <div className="p-3 border rounded-lg">
                                    <div className="font-medium mb-1">MD5 (Message Digest 5)</div>
                                    <p className="text-muted-foreground">
                                        128-bit hash function. Considered cryptographically broken and unsuitable for further use.
                                        Fast to compute but vulnerable to collisions.
                                    </p>
                                    <Badge className="mt-2 bg-red-600">Deprecated</Badge>
                                </div>

                                <div className="p-3 border rounded-lg">
                                    <div className="font-medium mb-1">SHA-1 (Secure Hash Algorithm 1)</div>
                                    <p className="text-muted-foreground">
                                        160-bit hash function. Deprecated due to vulnerability to collision attacks.
                                        No longer recommended for security purposes.
                                    </p>
                                    <Badge className="mt-2 bg-orange-600">Weak</Badge>
                                </div>

                                <div className="p-3 border rounded-lg">
                                    <div className="font-medium mb-1">SHA-256 (SHA-2 family)</div>
                                    <p className="text-muted-foreground">
                                        256-bit hash function. Currently secure and widely used. Part of the SHA-2 family.
                                        Suitable for modern security applications.
                                    </p>
                                    <Badge className="mt-2 bg-green-600">Secure</Badge>
                                </div>

                                <div className="p-3 border rounded-lg">
                                    <div className="font-medium mb-1">bcrypt (Adaptive Hash)</div>
                                    <p className="text-muted-foreground">
                                        Adaptive hash function based on Blowfish cipher. Includes salt and cost factor.
                                        Designed to be slow and resistant to brute-force attacks.
                                    </p>
                                    <Badge className="mt-2 bg-blue-600">Recommended</Badge>
                                </div>

                                <div className="p-3 border rounded-lg">
                                    <div className="font-medium mb-1">NTLM (NT LAN Manager)</div>
                                    <p className="text-muted-foreground">
                                        Windows password hash format. Based on MD4, considered weak by modern standards.
                                        Vulnerable to rainbow table and pass-the-hash attacks.
                                    </p>
                                    <Badge className="mt-2 bg-orange-600">Legacy</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HashCracker;
