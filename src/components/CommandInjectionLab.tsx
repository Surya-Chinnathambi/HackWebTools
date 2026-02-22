import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal, Trophy, Lightbulb, Shield, AlertTriangle } from "lucide-react";

const CommandInjectionLab = () => {
    const [pingTarget, setPingTarget] = useState("");
    const [output, setOutput] = useState("");
    const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Simulated file system
    const fileSystem: Record<string, string> = {
        "/etc/passwd": "root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000:admin:/home/admin:/bin/bash\nFLAG{file_read_success}",
        "/etc/secret.txt": "🚩 FLAG{command_injection_works}",
        "C:\\Windows\\System32\\drivers\\etc\\hosts": "127.0.0.1 localhost\n::1 localhost\nFLAG{windows_file_read}"
    };

    const executePing = () => {
        setAttempts(prev => prev + 1);

        // Check for command injection patterns
        const injectionPatterns = [
            /;/,
            /&&/,
            /\|\|/,
            /\|/,
            /\`/,
            /\$\(/,
            /%0A/,
            /%0D/
        ];

        const hasInjection = injectionPatterns.some(pattern => pattern.test(pingTarget));

        if (!hasInjection) {
            // Normal ping execution
            setOutput(`PING ${pingTarget}\n64 bytes from ${pingTarget}: icmp_seq=1 ttl=64 time=1.2ms\n64 bytes from ${pingTarget}: icmp_seq=2 ttl=64 time=1.1ms\n\n--- ${pingTarget} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`);
            if (attempts >= 2) setShowHint(true);
            return;
        }

        // Command injection detected!
        let result = `PING ${pingTarget.split(/[;&|`$]/)[0]}\n64 bytes from ${pingTarget.split(/[;&|`$]/)[0]}: icmp_seq=1 ttl=64 time=1.2ms\n\n`;

        // Simulate command execution
        if (pingTarget.includes("whoami") || pingTarget.includes("id")) {
            result += "\nwww-data\n";
            setCompletedChallenges(prev => new Set([...prev, "cmd-basic-injection"]));
            result += "\n🎉 FLAG{command_injection_works} - Basic command injection successful!";
        }

        if (pingTarget.includes("ls") || pingTarget.includes("dir")) {
            result += "\ntotal 24\ndrwxr-xr-x 2 root root 4096 Jan 1 12:00 html\n-rw-r--r-- 1 root root 1234 Jan 1 12:00 index.php\n-rw-r--r-- 1 root root  256 Jan 1 12:00 config.php\n";
            setCompletedChallenges(prev => new Set([...prev, "cmd-basic-injection"]));
        }

        if (pingTarget.includes("cat /etc/passwd") || pingTarget.includes("cat/etc/passwd")) {
            result += "\n" + fileSystem["/etc/passwd"];
            setCompletedChallenges(prev => new Set([...prev, "cmd-file-read"]));
        }

        if (pingTarget.includes("type") && pingTarget.includes("hosts")) {
            result += "\n" + fileSystem["C:\\Windows\\System32\\drivers\\etc\\hosts"];
            setCompletedChallenges(prev => new Set([...prev, "cmd-file-read"]));
        }

        // Filter bypass challenges
        if (pingTarget.includes("%0A") || pingTarget.includes("%0D")) {
            result += "\nwww-data\n";
            setCompletedChallenges(prev => new Set([...prev, "cmd-filter-bypass"]));
            result += "\n🎉 FLAG{filter_bypass_rce} - Filter bypass successful using URL encoding!";
        }

        if (pingTarget.includes("`whoami`") || pingTarget.includes("$(whoami)")) {
            result += "\nwww-data\n";
            setCompletedChallenges(prev => new Set([...prev, "cmd-filter-bypass"]));
            result += "\n🎉 FLAG{filter_bypass_rce} - Command substitution bypass successful!";
        }

        setOutput(result);
    };

    const hints = [
        "The ping command takes user input directly. Try chaining commands with ; or &&",
        "Use ; or && to execute multiple commands: 127.0.0.1; whoami",
        "For file reading, use: 127.0.0.1; cat /etc/passwd",
        "To bypass filters, try URL encoding (%0A for newline) or command substitution $(whoami)"
    ];

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Card className="border-2 border-red-500/20 bg-gradient-to-br from-slate-950 to-red-950/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Terminal className="h-6 w-6 text-red-500" />
                                Command Injection & RCE Lab
                            </CardTitle>
                            <p className="text-sm text-slate-400 mt-2">
                                Exploit OS command injection to achieve remote code execution
                            </p>
                        </div>
                        <Badge variant="secondary" className="text-lg py-2 px-4">
                            {completedChallenges.size}/3 Challenges
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Alert className="bg-yellow-950/20 border-yellow-500/20">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <AlertDescription>
                            <strong>Scenario:</strong> This web application allows users to ping remote hosts. However, it doesn't properly sanitize user input, making it vulnerable to command injection.
                        </AlertDescription>
                    </Alert>

                    {/* Vulnerable Ping Tool */}
                    <Card className="bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Network Diagnostic Tool</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target IP or Hostname:</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={pingTarget}
                                        onChange={(e) => setPingTarget(e.target.value)}
                                        placeholder="e.g., 127.0.0.1"
                                        className="font-mono"
                                    />
                                    <Button onClick={executePing}>Ping</Button>
                                </div>
                            </div>

                            {output && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-green-400">Output:</label>
                                    <pre className="text-xs font-mono bg-slate-950 p-4 rounded border border-slate-700 overflow-x-auto whitespace-pre-wrap">
                                        {output}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Challenges */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card className={`${completedChallenges.has("cmd-basic-injection") ? "border-green-500/50" : "border-slate-700"}`}>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    Challenge 1: Basic Injection
                                    {completedChallenges.has("cmd-basic-injection") && <Badge>✅</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <p>Execute additional commands using ; or &&</p>
                                <p className="text-slate-500">
                                    <strong>Goal:</strong> Run 'whoami' command
                                </p>
                                <p className="font-mono text-yellow-400 bg-slate-950 p-2 rounded">
                                    127.0.0.1; whoami
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`${completedChallenges.has("cmd-file-read") ? "border-green-500/50" : "border-slate-700"}`}>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    Challenge 2: File Read
                                    {completedChallenges.has("cmd-file-read") && <Badge>✅</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <p>Read sensitive files using cat command</p>
                                <p className="text-slate-500">
                                    <strong>Goal:</strong> Read /etc/passwd
                                </p>
                                <p className="font-mono text-yellow-400 bg-slate-950 p-2 rounded">
                                    ; cat /etc/passwd
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`${completedChallenges.has("cmd-filter-bypass") ? "border-green-500/50" : "border-slate-700"}`}>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    Challenge 3: Filter Bypass
                                    {completedChallenges.has("cmd-filter-bypass") && <Badge>✅</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <p>Bypass filters using encoding or substitution</p>
                                <p className="text-slate-500">
                                    <strong>Try:</strong> URL encoding or $()
                                </p>
                                <p className="font-mono text-yellow-400 bg-slate-950 p-2 rounded">
                                    %0Awhoami or $(whoami)
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

                    {/* Vulnerable Code */}
                    <Card className="bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-sm">Vulnerable PHP Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs font-mono bg-red-950/20 p-4 rounded border border-red-500/20 overflow-x-auto">
                                {`<?php
// VULNERABLE CODE - DO NOT USE!
$target = $_GET['target'];

// Directly passing user input to system command
$command = "ping -c 2 " . $target;
$output = shell_exec($command);

echo "<pre>$output</pre>";
?>

// Attack: ping.php?target=127.0.0.1; whoami
// Result: Executes both ping AND whoami commands`}</pre>
                        </CardContent>
                    </Card>

                    {/* Secure Code */}
                    <Card className="bg-green-950/20 border-green-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-400" />
                                Prevention & Secure Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm space-y-2">
                                <h4 className="font-semibold text-green-400">Best Practices:</h4>
                                <ul className="space-y-1 ml-4 list-disc">
                                    <li>✅ Avoid system() and shell_exec() if possible</li>
                                    <li>✅ Use language-specific functions (e.g., PHP's dns_get_record())</li>
                                    <li>✅ Whitelist allowed input values</li>
                                    <li>✅ Use escapeshellarg() and escapeshellcmd()</li>
                                    <li>✅ Run with minimal privileges (principle of least privilege)</li>
                                    <li>✅ Implement strict input validation (regex for IP addresses)</li>
                                </ul>
                            </div>

                            <pre className="text-xs font-mono bg-slate-950 p-4 rounded overflow-x-auto">
                                {`<?php
// SECURE CODE
$target = $_GET['target'];

// Validate input - must be valid IP address
if (!filter_var($target, FILTER_VALIDATE_IP)) {
    die("Invalid IP address");
}

// Use escapeshellarg to safely escape the argument
$command = "ping -c 2 " . escapeshellarg($target);
$output = shell_exec($command);

echo "<pre>" . htmlspecialchars($output) . "</pre>";
?>`}</pre>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
};

export default CommandInjectionLab;
