import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Terminal, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import VirtualTerminal from "@/components/VirtualTerminal";

const CommandGenerator = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (command: string, id: string) => {
        navigator.clipboard.writeText(command);
        setCopied(id);
        toast({ description: "Command copied to clipboard" });
        setTimeout(() => setCopied(null), 2000);
    };

    // Nmap Generator
    const NmapGenerator = () => {
        const [target, setTarget] = useState("");
        const [scanType, setScanType] = useState("basic");
        const [ports, setPorts] = useState("");
        const [options, setOptions] = useState({
            osDetection: false,
            serviceVersion: false,
            aggressive: false,
            verboseOutput: false,
            timing: "3",
        });

        const generateCommand = () => {
            let cmd = "nmap";

            switch (scanType) {
                case "stealth":
                    cmd += " -sS";
                    break;
                case "connect":
                    cmd += " -sT";
                    break;
                case "udp":
                    cmd += " -sU";
                    break;
                case "comprehensive":
                    cmd += " -sC -sV";
                    break;
            }

            if (options.osDetection) cmd += " -O";
            if (options.serviceVersion && !scanType.includes("comprehensive")) cmd += " -sV";
            if (options.aggressive) cmd += " -A";
            if (options.verboseOutput) cmd += " -v";
            if (options.timing) cmd += ` -T${options.timing}`;
            if (ports) cmd += ` -p ${ports}`;

            cmd += ` ${target}`;
            return cmd;
        };

        const command = generateCommand();

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Nmap Command Generator</CardTitle>
                    <CardDescription>Generate Nmap scanning commands with various options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nmap-target">Target (IP/Domain/Range)</Label>
                            <Input
                                id="nmap-target"
                                placeholder="192.168.1.0/24"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="nmap-scantype">Scan Type</Label>
                            <Select value={scanType} onValueChange={setScanType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic Scan</SelectItem>
                                    <SelectItem value="stealth">Stealth Scan (-sS)</SelectItem>
                                    <SelectItem value="connect">Connect Scan (-sT)</SelectItem>
                                    <SelectItem value="udp">UDP Scan (-sU)</SelectItem>
                                    <SelectItem value="comprehensive">Comprehensive (-sC -sV)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="nmap-ports">Ports (optional)</Label>
                        <Input
                            id="nmap-ports"
                            placeholder="80,443,8080 or 1-1000"
                            value={ports}
                            onChange={(e) => setPorts(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Options</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="os-detection"
                                    checked={options.osDetection}
                                    onCheckedChange={(checked) => setOptions({ ...options, osDetection: checked })}
                                />
                                <Label htmlFor="os-detection" className="cursor-pointer">
                                    OS Detection (-O)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="service-version"
                                    checked={options.serviceVersion}
                                    onCheckedChange={(checked) => setOptions({ ...options, serviceVersion: checked })}
                                />
                                <Label htmlFor="service-version" className="cursor-pointer">
                                    Service Version Detection (-sV)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="aggressive"
                                    checked={options.aggressive}
                                    onCheckedChange={(checked) => setOptions({ ...options, aggressive: checked })}
                                />
                                <Label htmlFor="aggressive" className="cursor-pointer">
                                    Aggressive Scan (-A)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="verbose"
                                    checked={options.verboseOutput}
                                    onCheckedChange={(checked) => setOptions({ ...options, verboseOutput: checked })}
                                />
                                <Label htmlFor="verbose" className="cursor-pointer">
                                    Verbose Output (-v)
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="timing">Timing Template</Label>
                        <Select value={options.timing} onValueChange={(value) => setOptions({ ...options, timing: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Paranoid (T0)</SelectItem>
                                <SelectItem value="1">Sneaky (T1)</SelectItem>
                                <SelectItem value="2">Polite (T2)</SelectItem>
                                <SelectItem value="3">Normal (T3)</SelectItem>
                                <SelectItem value="4">Aggressive (T4)</SelectItem>
                                <SelectItem value="5">Insane (T5)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Generated Command</Label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(command, "nmap")}
                            >
                                {copied === "nmap" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                        <Textarea value={command} readOnly className="font-mono bg-muted" rows={2} />
                    </div>
                </CardContent>
            </Card>
        );
    };

    // SQLMap Generator
    const SQLMapGenerator = () => {
        const [url, setUrl] = useState("");
        const [parameter, setParameter] = useState("");
        const [options, setOptions] = useState({
            dbs: false,
            tables: false,
            dump: false,
            level: "1",
            risk: "1",
            batch: true,
            randomAgent: false,
        });

        const generateCommand = () => {
            let cmd = `sqlmap -u "${url}"`;
            if (parameter) cmd += ` -p ${parameter}`;
            if (options.dbs) cmd += " --dbs";
            if (options.tables) cmd += " --tables";
            if (options.dump) cmd += " --dump";
            if (options.level !== "1") cmd += ` --level=${options.level}`;
            if (options.risk !== "1") cmd += ` --risk=${options.risk}`;
            if (options.batch) cmd += " --batch";
            if (options.randomAgent) cmd += " --random-agent";
            return cmd;
        };

        const command = generateCommand();

        return (
            <Card>
                <CardHeader>
                    <CardTitle>SQLMap Command Generator</CardTitle>
                    <CardDescription>Generate SQLMap commands for SQL injection testing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="sqlmap-url">Target URL</Label>
                        <Input
                            id="sqlmap-url"
                            placeholder="http://example.com/page.php?id=1"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="sqlmap-param">Parameter to Test (optional)</Label>
                        <Input
                            id="sqlmap-param"
                            placeholder="id"
                            value={parameter}
                            onChange={(e) => setParameter(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="level">Level (1-5)</Label>
                            <Select value={options.level} onValueChange={(value) => setOptions({ ...options, level: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 - Basic</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5">5 - Extensive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="risk">Risk (1-3)</Label>
                            <Select value={options.risk} onValueChange={(value) => setOptions({ ...options, risk: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 - Safe</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3 - Risky</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="dbs"
                                checked={options.dbs}
                                onCheckedChange={(checked) => setOptions({ ...options, dbs: checked })}
                            />
                            <Label htmlFor="dbs" className="cursor-pointer">
                                Enumerate Databases (--dbs)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="tables"
                                checked={options.tables}
                                onCheckedChange={(checked) => setOptions({ ...options, tables: checked })}
                            />
                            <Label htmlFor="tables" className="cursor-pointer">
                                Enumerate Tables (--tables)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="dump"
                                checked={options.dump}
                                onCheckedChange={(checked) => setOptions({ ...options, dump: checked })}
                            />
                            <Label htmlFor="dump" className="cursor-pointer">
                                Dump Data (--dump)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="random-agent"
                                checked={options.randomAgent}
                                onCheckedChange={(checked) => setOptions({ ...options, randomAgent: checked })}
                            />
                            <Label htmlFor="random-agent" className="cursor-pointer">
                                Random User-Agent (--random-agent)
                            </Label>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Generated Command</Label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(command, "sqlmap")}
                            >
                                {copied === "sqlmap" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                        <Textarea value={command} readOnly className="font-mono bg-muted" rows={3} />
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Gobuster Generator
    const GobusterGenerator = () => {
        const [url, setUrl] = useState("");
        const [wordlist, setWordlist] = useState("/usr/share/wordlists/dirb/common.txt");
        const [mode, setMode] = useState("dir");
        const [extensions, setExtensions] = useState("");
        const [threads, setThreads] = useState("10");

        const generateCommand = () => {
            let cmd = `gobuster ${mode} -u ${url} -w ${wordlist}`;
            if (extensions && mode === "dir") cmd += ` -x ${extensions}`;
            if (threads) cmd += ` -t ${threads}`;
            return cmd;
        };

        const command = generateCommand();

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Gobuster Command Generator</CardTitle>
                    <CardDescription>Generate Gobuster commands for directory/DNS brute-forcing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="gobuster-mode">Mode</Label>
                        <Select value={mode} onValueChange={setMode}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dir">Directory Brute-Force</SelectItem>
                                <SelectItem value="dns">DNS Subdomain Brute-Force</SelectItem>
                                <SelectItem value="vhost">Virtual Host Brute-Force</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="gobuster-url">Target URL</Label>
                        <Input
                            id="gobuster-url"
                            placeholder="http://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="gobuster-wordlist">Wordlist Path</Label>
                        <Input
                            id="gobuster-wordlist"
                            placeholder="/usr/share/wordlists/dirb/common.txt"
                            value={wordlist}
                            onChange={(e) => setWordlist(e.target.value)}
                        />
                    </div>

                    {mode === "dir" && (
                        <div>
                            <Label htmlFor="extensions">File Extensions (comma-separated)</Label>
                            <Input
                                id="extensions"
                                placeholder="php,html,txt"
                                value={extensions}
                                onChange={(e) => setExtensions(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="threads">Threads</Label>
                        <Input
                            id="threads"
                            type="number"
                            placeholder="10"
                            value={threads}
                            onChange={(e) => setThreads(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Generated Command</Label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(command, "gobuster")}
                            >
                                {copied === "gobuster" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                        <Textarea value={command} readOnly className="font-mono bg-muted" rows={2} />
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Hydra Generator
    const HydraGenerator = () => {
        const [target, setTarget] = useState("");
        const [service, setService] = useState("ssh");
        const [username, setUsername] = useState("");
        const [userList, setUserList] = useState("");
        const [password, setPassword] = useState("");
        const [passList, setPassList] = useState("");
        const [threads, setThreads] = useState("16");

        const generateCommand = () => {
            let cmd = "hydra";
            if (threads) cmd += ` -t ${threads}`;

            if (username) {
                cmd += ` -l ${username}`;
            } else if (userList) {
                cmd += ` -L ${userList}`;
            }

            if (password) {
                cmd += ` -p ${password}`;
            } else if (passList) {
                cmd += ` -P ${passList}`;
            }

            cmd += ` ${target} ${service}`;
            return cmd;
        };

        const command = generateCommand();

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Hydra Command Generator</CardTitle>
                    <CardDescription>Generate Hydra commands for password brute-forcing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="hydra-target">Target IP/Domain</Label>
                            <Input
                                id="hydra-target"
                                placeholder="192.168.1.100"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="hydra-service">Service</Label>
                            <Select value={service} onValueChange={setService}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ssh">SSH</SelectItem>
                                    <SelectItem value="ftp">FTP</SelectItem>
                                    <SelectItem value="telnet">Telnet</SelectItem>
                                    <SelectItem value="http-get">HTTP GET</SelectItem>
                                    <SelectItem value="http-post">HTTP POST</SelectItem>
                                    <SelectItem value="smb">SMB</SelectItem>
                                    <SelectItem value="rdp">RDP</SelectItem>
                                    <SelectItem value="mysql">MySQL</SelectItem>
                                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="username">Single Username</Label>
                            <Input
                                id="username"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={!!userList}
                            />
                        </div>
                        <div>
                            <Label htmlFor="userlist">OR Username List</Label>
                            <Input
                                id="userlist"
                                placeholder="/path/to/users.txt"
                                value={userList}
                                onChange={(e) => setUserList(e.target.value)}
                                disabled={!!username}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="password">Single Password</Label>
                            <Input
                                id="password"
                                placeholder="password123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={!!passList}
                            />
                        </div>
                        <div>
                            <Label htmlFor="passlist">OR Password List</Label>
                            <Input
                                id="passlist"
                                placeholder="/path/to/passwords.txt"
                                value={passList}
                                onChange={(e) => setPassList(e.target.value)}
                                disabled={!!password}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="hydra-threads">Threads</Label>
                        <Input
                            id="hydra-threads"
                            type="number"
                            placeholder="16"
                            value={threads}
                            onChange={(e) => setThreads(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Generated Command</Label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(command, "hydra")}
                            >
                                {copied === "hydra" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                        <Textarea value={command} readOnly className="font-mono bg-muted" rows={2} />
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Terminal className="w-8 h-8" />
                    Command Generator
                </h1>
                <p className="text-muted-foreground">
                    Generate commands for popular penetration testing tools with ease
                </p>
            </div>

            <Tabs defaultValue="terminal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 h-auto">
                    <TabsTrigger value="terminal">Terminal</TabsTrigger>
                    <TabsTrigger value="nmap">Nmap</TabsTrigger>
                    <TabsTrigger value="sqlmap">SQLMap</TabsTrigger>
                    <TabsTrigger value="gobuster">Gobuster</TabsTrigger>
                    <TabsTrigger value="hydra">Hydra</TabsTrigger>
                </TabsList>

                <TabsContent value="terminal" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Terminal className="h-5 w-5" />
                                Interactive Terminal Simulator
                            </CardTitle>
                            <CardDescription>
                                Practice penetration testing commands in a safe, simulated environment
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 p-4 bg-blue-950/20 border border-blue-500/20 rounded-lg flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-300">
                                    <p className="font-semibold mb-1">🎯 Learning Mode</p>
                                    <p>
                                        This terminal simulates real penetration testing tools. Try commands like{" "}
                                        <code className="bg-blue-950 px-2 py-0.5 rounded">nmap</code>,{" "}
                                        <code className="bg-blue-950 px-2 py-0.5 rounded">sqlmap</code>,{" "}
                                        <code className="bg-blue-950 px-2 py-0.5 rounded">nikto</code>, and more!
                                    </p>
                                </div>
                            </div>

                            <VirtualTerminal />

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-slate-900/50">
                                    <CardHeader>
                                        <CardTitle className="text-sm">Available Commands</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-950 px-2 py-1 rounded text-green-400">nmap</code>
                                            <span className="text-slate-400">Network port scanner</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-950 px-2 py-1 rounded text-green-400">sqlmap</code>
                                            <span className="text-slate-400">SQL injection exploitation</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-950 px-2 py-1 rounded text-green-400">nikto</code>
                                            <span className="text-slate-400">Web server scanner</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-950 px-2 py-1 rounded text-green-400">gobuster</code>
                                            <span className="text-slate-400">Directory brute forcer</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-950 px-2 py-1 rounded text-green-400">theharvester</code>
                                            <span className="text-slate-400">OSINT gathering tool</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-900/50">
                                    <CardHeader>
                                        <CardTitle className="text-sm">Pro Tips</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm text-slate-300">
                                        <p>• Use <kbd className="bg-slate-950 px-2 py-0.5 rounded">↑</kbd> and <kbd className="bg-slate-950 px-2 py-0.5 rounded">↓</kbd> arrows to navigate command history</p>
                                        <p>• Type <code className="bg-slate-950 px-1 py-0.5 rounded">help</code> to see all available commands</p>
                                        <p>• Type <code className="bg-slate-950 px-1 py-0.5 rounded">clear</code> to clear the terminal</p>
                                        <p>• All commands are simulated - no actual network traffic is generated</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="nmap" className="mt-6">
                    <NmapGenerator />
                </TabsContent>

                <TabsContent value="sqlmap" className="mt-6">
                    <SQLMapGenerator />
                </TabsContent>

                <TabsContent value="gobuster" className="mt-6">
                    <GobusterGenerator />
                </TabsContent>

                <TabsContent value="hydra" className="mt-6">
                    <HydraGenerator />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CommandGenerator;
