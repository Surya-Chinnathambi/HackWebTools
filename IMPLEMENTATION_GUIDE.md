# 🚀 HackWebTools: Complete Implementation & Design Guide

> **Transforming theory into portfolio-worthy cybersecurity mastery**

---

## 📑 Table of Contents

- [PART A: Security & Learning Improvements](#part-a-security--learning-improvements)
- [PART B: Interactive UI/Animation Design](#part-b-interactive-uianimation-design)
- [PART C: Portfolio & Interview Value](#part-c-portfolio--interview-value)

---

# PART A: SECURITY & LEARNING IMPROVEMENTS

## 🔴 CRITICAL ISSUE #1: Shallow Theory Without Practice

### **Why This Matters in Real Cybersecurity Jobs:**

**Interview Reality:**
- Interviewer: "Show me how you'd exploit SQL injection on this login form"
- ❌ Theory Student: "Um... I know you use OR 1=1... I read about it"
- ✅ HackWebTools Graduate: *Opens browser console* "Let me demonstrate the attack flow step-by-step"

**Job Performance:**
- **Red Team:** Needs to exploit live vulnerabilities in client pentests
- **Blue Team:** Must understand attack mechanics to write effective detection rules
- **AppSec:** Requires hands-on exploitation to prioritize remediation

### **Concrete Improvements:**

#### **Solution 1.1: Browser-Based Vulnerable Playground**

**Implementation: Zero-Backend SQL Injection Lab**

Create `src/pages/labs/SQLInjectionLab.tsx`:

```typescript
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, CheckCircle, XCircle, Lightbulb } from "lucide-react";

interface User {
    id: number;
    username: string;
    password: string;
    role: "admin" | "user";
    flag?: string;
}

const SQLInjectionLab = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [sqlQuery, setSqlQuery] = useState("");
    const [queryResult, setQueryResult] = useState<User[]>([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [attackDetected, setAttackDetected] = useState(false);
    const [hints, setHints] = useState<string[]>([]);
    const [attempts, setAttempts] = useState(0);

    // Mock database (client-side)
    const database: User[] = [
        { id: 1, username: "admin", password: "5f4dcc3b5aa765d61d8327deb882cf99", role: "admin", flag: "FLAG{sql_1nj3ct10n_m4st3r}" },
        { id: 2, username: "john", password: "098f6bcd4621d373cade4e832627b4f6", role: "user" },
        { id: 3, username: "sarah", password: "5ebe2294ecd0e0f08eab7690d2a6ee69", role: "user" }
    ];

    const executeLogin = () => {
        setAttempts(prev => prev + 1);
        
        // Simulate vulnerable SQL query (client-side visualization)
        const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
        setSqlQuery(query);

        // Check for SQL injection patterns
        const injectionPatterns = [
            "' OR '1'='1",
            "' OR 1=1--",
            "admin'--",
            "' UNION SELECT",
            "'; DROP TABLE"
        ];

        const isInjection = injectionPatterns.some(pattern => 
            username.toLowerCase().includes(pattern.toLowerCase()) ||
            password.toLowerCase().includes(pattern.toLowerCase())
        );

        if (isInjection) {
            setAttackDetected(true);
            
            // Successful SQL injection scenarios
            if (username.includes("' OR '1'='1") || username.includes("' OR 1=1")) {
                // Boolean-based SQLi - returns all users
                setQueryResult(database);
                setAuthenticated(true);
                
                // Check if admin was compromised
                const adminCompromised = database.find(u => u.role === "admin");
                if (adminCompromised) {
                    // User found the flag!
                    setTimeout(() => {
                        alert(`🎉 SUCCESS! You've bypassed authentication!\n\nAdmin Flag: ${adminCompromised.flag}\n\nAttack Vector: Boolean-based SQL Injection`);
                    }, 1000);
                }
            } else if (username.includes("admin'--") || username.includes("admin' --")) {
                // Comment-based SQLi
                const admin = database.find(u => u.username === "admin");
                if (admin) {
                    setQueryResult([admin]);
                    setAuthenticated(true);
                    setTimeout(() => {
                        alert(`🎉 SUCCESS! Comment injection worked!\n\nAdmin Flag: ${admin.flag}\n\nAttack Vector: SQL Comment Injection`);
                    }, 1000);
                }
            }
        } else {
            // Normal authentication (must match exactly)
            const user = database.find(u => 
                u.username === username && u.password === password
            );
            
            if (user) {
                setQueryResult([user]);
                setAuthenticated(true);
            } else {
                setQueryResult([]);
                setAuthenticated(false);
            }
        }

        // Progressive hints after failed attempts
        if (attempts === 2 && !authenticated) {
            setHints(prev => [...prev, "💡 Try adding a single quote ' to the username field"]);
        }
        if (attempts === 4 && !authenticated) {
            setHints(prev => [...prev, "💡 SQL uses OR for boolean logic. What if username OR password is always true?"]);
        }
        if (attempts === 6 && !authenticated) {
            setHints(prev => [...prev, "💡 Try: admin' OR '1'='1"]);
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Lab Header */}
            <Card className="border-2 border-red-500/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Terminal className="h-6 w-6 text-red-500" />
                                Lab 01: SQL Injection - Authentication Bypass
                            </CardTitle>
                            <p className="text-muted-foreground mt-2">
                                Exploit vulnerable authentication to retrieve admin flag
                            </p>
                        </div>
                        <Badge variant="destructive">VULNERABLE</Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Vulnerable Application */}
                <Card>
                    <CardHeader>
                        <CardTitle>🎯 Target: Login Form</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Username</label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                className="font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                className="font-mono"
                            />
                        </div>
                        <Button 
                            onClick={executeLogin} 
                            className="w-full"
                            variant={attackDetected ? "destructive" : "default"}
                        >
                            Login
                        </Button>

                        {/* Authentication Result */}
                        {queryResult.length > 0 && (
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    {authenticated ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="font-medium text-green-500">Authentication Successful</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-red-500" />
                                            <span className="font-medium text-red-500">Authentication Failed</span>
                                        </>
                                    )}
                                </div>
                                
                                {/* Show compromised users */}
                                {queryResult.map(user => (
                                    <div key={user.id} className="p-2 bg-background rounded border">
                                        <div className="text-xs">User ID: {user.id}</div>
                                        <div className="font-medium">{user.username}</div>
                                        <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                                            {user.role}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right: Attack Analysis */}
                <div className="space-y-4">
                    {/* SQL Query Visualization */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">🔍 Executed SQL Query</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="p-4 bg-slate-950 text-green-400 rounded-lg text-xs overflow-x-auto">
                                {sqlQuery || "-- No query executed yet"}
                            </pre>
                            {attackDetected && (
                                <Badge variant="destructive" className="mt-2">
                                    ⚠️ SQL Injection Detected
                                </Badge>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vulnerable Source Code */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">💻 Vulnerable Source Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="p-4 bg-slate-950 text-slate-300 rounded-lg text-xs overflow-x-auto">
{`<?php
$username = $_POST['username'];
$password = $_POST['password'];

// VULNERABLE: No input sanitization!
$query = "SELECT * FROM users 
          WHERE username='$username' 
          AND password='$password'";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    echo "Login successful!";
} else {
    echo "Login failed!";
}
?>`}
                            </pre>
                        </CardContent>
                    </Card>

                    {/* Hints */}
                    {hints.length > 0 && (
                        <Card className="border-yellow-500/50">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                                    Hints
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {hints.map((hint, idx) => (
                                    <div key={idx} className="text-sm text-yellow-500">
                                        {hint}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Learning Objectives */}
            <Card>
                <CardHeader>
                    <CardTitle>📚 Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">1. Understand the Vulnerability</h4>
                            <p className="text-sm text-muted-foreground">
                                Learn how unescaped user input in SQL queries creates injection points
                            </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">2. Master Exploitation</h4>
                            <p className="text-sm text-muted-foreground">
                                Practice boolean-based, comment-based, and UNION-based SQL injection
                            </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">3. Learn Remediation</h4>
                            <p className="text-sm text-muted-foreground">
                                Understand parameterized queries and input validation best practices
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-green-950/20 border border-green-500/20 rounded-lg">
                        <h4 className="font-semibold text-green-500 mb-2">✅ Secure Code (Remediation)</h4>
                        <pre className="text-xs text-green-400 bg-slate-950 p-3 rounded overflow-x-auto">
{`<?php
// SECURE: Using prepared statements
$stmt = $conn->prepare("SELECT * FROM users WHERE username=? AND password=?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();
?>`}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SQLInjectionLab;
```

**Why This Works:**
- ✅ **No backend needed** - Pure JavaScript simulation
- ✅ **Real attack patterns** - Teaches actual SQLi techniques
- ✅ **Progressive hints** - Guides without spoiling
- ✅ **Source code shown** - Bridges theory to practice
- ✅ **Remediation included** - Shows secure coding

**Job Interview Value:**
- Can demonstrate exploitation live in interview
- Understands both vulnerability and fix
- Has vocabulary: "boolean-based", "comment injection", "parameterized queries"

---

#### **Solution 1.2: Command Execution Terminal Simulator**

**Problem:** Tools documentation shows commands but users can't execute them.

**Solution:** Browser-based terminal that simulates command output.

Create `src/components/VirtualTerminal.tsx`:

```typescript
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Terminal as TerminalIcon } from "lucide-react";

interface CommandResponse {
    command: string;
    output: string;
    exitCode: number;
    duration: number;
}

const VirtualTerminal = () => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<CommandResponse[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    // Mock command database
    const commandDatabase: Record<string, (args: string[]) => string> = {
        nmap: (args) => {
            const target = args[0] || "scanme.nmap.org";
            return `
Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${target}
Host is up (0.012s latency).
Not shown: 995 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql
8080/tcp open  http-proxy

Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds
            `.trim();
        },
        
        sqlmap: (args) => {
            const url = args.find(arg => arg.startsWith("http")) || "http://target.com/vuln.php?id=1";
            return `
        ___
       __H__
 ___ ___[']_____ ___ ___  {1.7.2#stable}
|_ -| . [']     | .'| . |
|___|_  ["]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] starting @ 10:15:32
[*] testing connection to the target URL
[*] testing if the target URL is stable
[*] target URL is stable
[*] heuristic (basic) test shows that GET parameter 'id' might be injectable
[*] testing for SQL injection on GET parameter 'id'
[*] testing 'AND boolean-based blind - WHERE or HAVING clause'
[INFO] GET parameter 'id' appears to be 'AND boolean-based blind - WHERE or HAVING clause' injectable 
[*] testing 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause'
[INFO] GET parameter 'id' is 'MySQL >= 5.0 AND error-based' injectable

sqlmap identified the following injection point(s) with a total of 46 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 1=1

    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause
    Payload: id=1 AND (SELECT * FROM (SELECT(SLEEP(5)))a)
---
[*] shutting down at 10:15:45
            `.trim();
        },

        nikto: (args) => {
            const host = args.find(arg => arg.startsWith("-h"))?.split("=")[1] || "target.com";
            return `
- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          ${host}
+ Target Hostname:    ${host}
+ Target Port:        80
+ Start Time:         2024-02-05 10:16:20
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ Retrieved x-powered-by header: PHP/7.4.3
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-Content-Type-Options header is not set.
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Apache/2.4.41 appears to be outdated (current is at least Apache/2.4.54)
+ /admin/: Admin login page/section found.
+ /phpmyadmin/: phpMyAdmin directory found
+ /backup/: Backup directory found
+ /config.php.bak: Backup file found - may contain sensitive information
+ OSVDB-3092: /admin/: This might be interesting...
+ OSVDB-3268: /config/: Directory indexing found.
+ 8726 requests: 0 error(s) and 12 item(s) reported on remote host
+ End Time:           2024-02-05 10:18:45 (145 seconds)
            `.trim();
        },

        gobuster: (args) => {
            const url = args.find(arg => arg.startsWith("http")) || "http://target.com";
            return `
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     ${url}
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Status codes:            200,204,301,302,307,401,403
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/admin                (Status: 301) [Size: 312] [--> http://target.com/admin/]
/backup               (Status: 301) [Size: 313] [--> http://target.com/backup/]
/config               (Status: 301) [Size: 313] [--> http://target.com/config/]
/images               (Status: 301) [Size: 313] [--> http://target.com/images/]
/js                   (Status: 301) [Size: 309] [--> http://target.com/js/]
/uploads              (Status: 301) [Size: 314] [--> http://target.com/uploads/]
===============================================================
Finished
===============================================================
            `.trim();
        },

        help: () => {
            return `
Available Commands:
  nmap <target>              - Network port scanner
  sqlmap -u <url>            - SQL injection testing tool
  nikto -h <host>            - Web server scanner
  gobuster dir -u <url>      - Directory brute forcer
  theharvester -d <domain>   - OSINT email/subdomain harvester
  clear                      - Clear terminal
  help                       - Show this help message

Example:
  nmap 192.168.1.1
  sqlmap -u http://target.com/page?id=1
  nikto -h http://target.com
  gobuster dir -u http://target.com -w wordlist.txt
            `.trim();
        },

        clear: () => "",

        theharvester: (args) => {
            const domain = args.find(arg => arg.startsWith("-d"))?.split(" ")[1] || "example.com";
            return `
*******************************************************************
*  _   _                                            _             *
* | |_| |__   ___    /\\  /\\__ _ _ ____   _____  ___| |_ ___ _ __  *
* | __|  _ \\ / _ \\  / /_/ / _\` | '__\\ \\ / / _ \\/ __| __/ _ \\ '__| *
* | |_| | | |  __/ / __  / (_| | |   \\ V /  __/\\__ \\ ||  __/ |    *
*  \\__|_| |_|\\___| \\/ /_/ \\__,_|_|    \\_/ \\___||___/\\__\\___|_|    *
*                                                                 *
* theHarvester 4.2.0                                              *
* Coded by Christian Martorella                                   *
*******************************************************************

[*] Target: ${domain}

[*] Searching Bing...
	[+] Emails found: 3
	[+] Hosts found: 12

[*] Searching Google...
	[+] Emails found: 5
	[+] Hosts found: 18

[*] Results:

Emails:
-------
admin@${domain}
contact@${domain}
info@${domain}
sales@${domain}
support@${domain}

Hosts:
------
www.${domain}
mail.${domain}
ftp.${domain}
admin.${domain}
api.${domain}
dev.${domain}
staging.${domain}
test.${domain}

[*] Total unique emails: 5
[*] Total unique hosts: 8
            `.trim();
        }
    };

    const executeCommand = (cmd: string) => {
        const startTime = Date.now();
        const parts = cmd.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        let output = "";
        let exitCode = 0;

        if (command === "clear") {
            setHistory([]);
            setInput("");
            return;
        }

        if (commandDatabase[command]) {
            output = commandDatabase[command](args);
        } else if (command === "") {
            return; // Empty command
        } else {
            output = `bash: ${command}: command not found\n\nType 'help' to see available commands`;
            exitCode = 127;
        }

        const duration = Date.now() - startTime;
        
        setHistory(prev => [...prev, {
            command: cmd,
            output,
            exitCode,
            duration
        }]);
        
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            executeCommand(input);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (history.length > 0) {
                const newIndex = historyIndex + 1;
                if (newIndex < history.length) {
                    setHistoryIndex(newIndex);
                    setInput(history[history.length - 1 - newIndex].command);
                }
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex].command);
            } else {
                setHistoryIndex(-1);
                setInput("");
            }
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [history]);

    return (
        <Card className="bg-slate-950 border-slate-800 p-4 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                <TerminalIcon className="h-4 w-4 text-green-500" />
                <span className="text-green-500">HackWebTools Virtual Terminal</span>
            </div>
            
            <div className="h-[500px] overflow-y-auto space-y-2">
                {/* Command History */}
                {history.map((entry, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">┌──(kali㉿kali)-[~]</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">└─$</span>
                            <span className="text-slate-300">{entry.command}</span>
                        </div>
                        <pre className="text-slate-400 whitespace-pre-wrap pl-4">
                            {entry.output}
                        </pre>
                    </div>
                ))}

                {/* Current Input */}
                <div className="flex items-center gap-2">
                    <span className="text-green-500">└─$</span>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none text-slate-300"
                        placeholder="Type 'help' for available commands"
                        autoFocus
                    />
                </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-800 text-xs text-slate-500">
                💡 Tip: Use ↑ and ↓ arrows to navigate command history
            </div>
        </Card>
    );
};

export default VirtualTerminal;
```

**Integration into Tool Detail Pages:**

Update `src/pages/ToolDetail.tsx`:

```typescript
// Add VirtualTerminal component to tool pages
import VirtualTerminal from "@/components/VirtualTerminal";

// In the render:
<Tabs defaultValue="overview">
    <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="terminal">🚀 Try It Live</TabsTrigger>
    </TabsList>
    
    <TabsContent value="terminal">
        <VirtualTerminal />
    </TabsContent>
</Tabs>
```

**Why This Works:**
- ✅ **Zero setup** - No Kali VM needed for beginners
- ✅ **Safe practice** - Can't harm real systems
- ✅ **Realistic output** - Matches actual tool behavior
- ✅ **Command history** - Mimics real terminal UX
- ✅ **Progressive learning** - Start with help, build up

---

## 🔴 CRITICAL ISSUE #2: Missing Attack Chains & Real-World Context

### **Why This Matters:**

**Interview Scenario:**
- Interviewer: "Walk me through a typical web app pentest"
- ❌ Bad Answer: "I'd run Nmap... then maybe Nikto... then try some stuff"
- ✅ Good Answer: "I follow a methodical approach: Reconnaissance → Enumeration → Exploitation → Post-Exploitation. Let me show you..."

**Job Requirement:**
- Red teamers must chain techniques (Phishing → Initial Access → Lateral Movement → Exfiltration)
- SOC analysts must understand attack chains to prioritize alerts
- Report writing requires explaining full attack narrative

### **Solution 2.1: Interactive Attack Flow Visualizer**

Create `src/pages/AttackFlows.tsx`:

```typescript
import { useState } from "react";
import ReactFlow, { 
    Node, 
    Edge, 
    Background, 
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface AttackScenario {
    id: string;
    title: string;
    target: string;
    objective: string;
    nodes: Node[];
    edges: Edge[];
    mitreTechniques: string[];
}

const AttackFlows = () => {
    const [selectedScenario, setSelectedScenario] = useState<string>("ecommerce-hack");
    const [playing, setPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Example Attack Scenario: E-commerce Website Compromise
    const ecommerceScenario: AttackScenario = {
        id: "ecommerce-hack",
        title: "E-commerce Website Full Compromise",
        target: "https://vulnerable-shop.example.com",
        objective: "Gain admin access → Steal customer database → Maintain persistence",
        mitreTechniques: ["T1595.002", "T1190", "T1078", "T1059.004", "T1041"],
        nodes: [
            {
                id: "1",
                type: "input",
                data: { 
                    label: "🎯 Target Identified",
                    description: "E-commerce website: vulnerable-shop.com"
                },
                position: { x: 250, y: 0 },
                style: { 
                    background: "#1e293b", 
                    color: "#fff", 
                    border: "2px solid #ef4444",
                    padding: "10px"
                }
            },
            {
                id: "2",
                data: { 
                    label: "🔍 Subdomain Enumeration",
                    tool: "Sublist3r",
                    command: "sublist3r -d vulnerable-shop.com",
                    findings: ["admin.vulnerable-shop.com", "api.vulnerable-shop.com", "dev.vulnerable-shop.com"]
                },
                position: { x: 250, y: 100 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #3b82f6"
                }
            },
            {
                id: "3",
                data: { 
                    label: "📂 Directory Brute Force",
                    tool: "Gobuster",
                    command: "gobuster dir -u http://admin.vulnerable-shop.com -w common.txt",
                    findings: ["/backup", "/config.php.bak", "/uploads"]
                },
                position: { x: 250, y: 200 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #3b82f6"
                }
            },
            {
                id: "4",
                data: { 
                    label: "📄 Source Code Analysis",
                    tool: "Manual Review",
                    command: "curl http://admin.vulnerable-shop.com/config.php.bak",
                    findings: ["Database credentials exposed", "SQL injection in login.php"]
                },
                position: { x: 250, y: 300 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #eab308"
                }
            },
            {
                id: "5",
                data: { 
                    label: "💉 SQL Injection Exploitation",
                    tool: "SQLMap",
                    command: "sqlmap -u 'http://admin.vulnerable-shop.com/login.php?id=1' --dump",
                    findings: ["Admin password hash retrieved", "Customer data dumped"]
                },
                position: { x: 100, y: 400 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #f59e0b"
                }
            },
            {
                id: "6",
                data: { 
                    label: "🔓 Hash Cracking",
                    tool: "Hashcat",
                    command: "hashcat -m 0 -a 0 hashes.txt rockyou.txt",
                    findings: ["Admin password: Admin123!"]
                },
                position: { x: 100, y: 500 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #f59e0b"
                }
            },
            {
                id: "7",
                data: { 
                    label: "🚪 Admin Panel Access",
                    tool: "Browser",
                    command: "Login with cracked credentials",
                    findings: ["Full admin dashboard access"]
                },
                position: { x: 250, y: 600 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #ef4444"
                }
            },
            {
                id: "8",
                data: { 
                    label: "📤 File Upload Shell",
                    tool: "Webshell",
                    command: "Upload PHP reverse shell via admin file manager",
                    findings: ["Shell uploaded to /uploads/shell.php"]
                },
                position: { x: 400, y: 700 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #ef4444"
                }
            },
            {
                id: "9",
                data: { 
                    label: "🖥️ Reverse Shell Connection",
                    tool: "Netcat",
                    command: "nc -lvnp 4444",
                    findings: ["Interactive shell established"]
                },
                position: { x: 400, y: 800 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #ef4444"
                }
            },
            {
                id: "10",
                data: { 
                    label: "📊 Database Exfiltration",
                    tool: "MySQL CLI",
                    command: "mysqldump -u admin -p ecommerce > dump.sql",
                    findings: ["50,000 customer records stolen"]
                },
                position: { x: 250, y: 900 },
                style: { 
                    background: "#0f172a", 
                    color: "#fff", 
                    border: "2px solid #dc2626"
                }
            },
            {
                id: "11",
                type: "output",
                data: { 
                    label: "✅ Mission Complete",
                    summary: "Admin access gained, database exfiltrated, shell maintained"
                },
                position: { x: 250, y: 1000 },
                style: { 
                    background: "#16a34a", 
                    color: "#fff", 
                    border: "2px solid #22c55e",
                    padding: "10px"
                }
            }
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2", animated: true, label: "Reconnaissance" },
            { id: "e2-3", source: "2", target: "3", animated: true, label: "Enumeration" },
            { id: "e3-4", source: "3", target: "4", animated: true, label: "Discovery" },
            { id: "e4-5", source: "4", target: "5", animated: true, label: "Exploitation" },
            { id: "e5-6", source: "5", target: "6", animated: true, label: "Privilege Escalation" },
            { id: "e6-7", source: "6", target: "7", animated: true, label: "Access Gained" },
            { id: "e7-8", source: "7", target: "8", animated: true, label: "Persistence" },
            { id: "e8-9", source: "8", target: "9", animated: true, label: "Command & Control" },
            { id: "e9-10", source: "9", target: "10", animated: true, label: "Exfiltration" },
            { id: "e10-11", source: "10", target: "11", animated: true, label: "Mission Complete" }
        ]
    };

    const [nodes, setNodes, onNodesChange] = useNodesState(ecommerceScenario.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(ecommerceScenario.edges);

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                🎯 Attack Flow: {ecommerceScenario.title}
                            </CardTitle>
                            <p className="text-muted-foreground mt-2">
                                {ecommerceScenario.objective}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => setPlaying(!playing)} variant="outline">
                                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button onClick={() => setCurrentStep(0)} variant="outline">
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {ecommerceScenario.mitreTechniques.map(technique => (
                            <Badge key={technique} variant="secondary">
                                MITRE ATT&CK: {technique}
                            </Badge>
                        ))}
                    </div>

                    {/* Attack Flow Diagram */}
                    <div style={{ height: "600px" }} className="border rounded-lg">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            fitView
                        >
                            <Background />
                            <Controls />
                            <MiniMap />
                        </ReactFlow>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AttackFlows;
```

**Install ReactFlow:**
```bash
npm install reactflow
```

**Why This Works:**
- ✅ **Visual learning** - See entire attack chain at once
- ✅ **Step-by-step** - Can animate through phases
- ✅ **Tool mapping** - Shows when to use which tool
- ✅ **MITRE ATT&CK** - Industry standard framework
- ✅ **Interview prep** - Can explain methodology visually

---

## 🔴 CRITICAL ISSUE #3: Zero Blue Team / Defensive Perspective

### **Why This Matters:**

**Job Market Reality:**
- 50% of cybersecurity jobs are defensive (SOC Analyst, Incident Response, Threat Hunter)
- Employers want "purple team" thinking (understand both attack and defense)
- Can't secure systems if you only know how to break them

**Interview Questions:**
- "How would you DETECT this SQL injection attack?"
- "What SIEM rule would you write?"
- "How would you respond to this incident?"

### **Solution 3.1: Blue Team Log Analysis Lab**

Create `src/pages/labs/BlueTeamLab.tsx`:

```typescript
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle, CheckCircle, Target } from "lucide-react";

interface LogEntry {
    timestamp: string;
    level: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
    source: string;
    message: string;
    ip?: string;
    suspicious: boolean;
}

interface DetectionRule {
    name: string;
    pattern: RegExp;
    severity: "low" | "medium" | "high" | "critical";
    mitreId: string;
}

const BlueTeamLab = () => {
    const [selectedLab, setSelectedLab] = useState<string>("ssh-bruteforce");
    const [userAnswer, setUserAnswer] = useState("");
    const [detectionRule, setDetectionRule] = useState("");
    const [findings, setFindings] = useState<string[]>([]);
    const [score, setScore] = useState(0);

    // Sample SSH Brute Force Attack Logs
    const sshBruteForceLog = `
2024-02-05 10:15:32 sshd[1234]: Failed password for root from 192.168.1.100 port 52341 ssh2
2024-02-05 10:15:35 sshd[1235]: Failed password for admin from 192.168.1.100 port 52342 ssh2
2024-02-05 10:15:38 sshd[1236]: Failed password for user from 192.168.1.100 port 52343 ssh2
2024-02-05 10:15:41 sshd[1237]: Failed password for test from 192.168.1.100 port 52344 ssh2
2024-02-05 10:15:44 sshd[1238]: Failed password for guest from 192.168.1.100 port 52345 ssh2
2024-02-05 10:15:47 sshd[1239]: Failed password for ubuntu from 192.168.1.100 port 52346 ssh2
2024-02-05 10:15:50 sshd[1240]: Failed password for administrator from 192.168.1.100 port 52347 ssh2
2024-02-05 10:15:53 sshd[1241]: Failed password for root from 192.168.1.100 port 52348 ssh2
2024-02-05 10:15:56 sshd[1242]: Failed password for oracle from 192.168.1.100 port 52349 ssh2
2024-02-05 10:15:59 sshd[1243]: Failed password for postgres from 192.168.1.100 port 52350 ssh2
2024-02-05 10:16:02 sshd[1244]: Failed password for mysql from 192.168.1.100 port 52351 ssh2
2024-02-05 10:16:05 sshd[1245]: Failed password for jenkins from 192.168.1.100 port 52352 ssh2
2024-02-05 10:16:08 sshd[1246]: Failed password for tomcat from 192.168.1.100 port 52353 ssh2
2024-02-05 10:16:11 sshd[1247]: Failed password for webadmin from 192.168.1.100 port 52354 ssh2
2024-02-05 10:16:14 sshd[1248]: Failed password for support from 192.168.1.100 port 52355 ssh2
2024-02-05 10:16:17 sshd[1249]: Failed password for backup from 192.168.1.100 port 52356 ssh2
2024-02-05 10:16:20 sshd[1250]: Failed password for ftp from 192.168.1.100 port 52357 ssh2
2024-02-05 10:16:23 sshd[1251]: Failed password for dev from 192.168.1.100 port 52358 ssh2
2024-02-05 10:16:26 sshd[1252]: Failed password for admin123 from 192.168.1.100 port 52359 ssh2
2024-02-05 10:16:29 sshd[1253]: Failed password for password from 192.168.1.100 port 52360 ssh2
2024-02-05 10:16:32 sshd[1254]: Failed password for default from 192.168.1.100 port 52361 ssh2
2024-02-05 10:16:35 sshd[1255]: Failed password for service from 192.168.1.100 port 52362 ssh2
2024-02-05 10:16:38 sshd[1256]: Failed password for deploy from 192.168.1.100 port 52363 ssh2
2024-02-05 10:16:41 sshd[1257]: Failed password for system from 192.168.1.100 port 52364 ssh2
2024-02-05 10:16:44 sshd[1258]: Accepted password for root from 192.168.1.100 port 52365 ssh2
    `.trim();

    const labScenarios = {
        "ssh-bruteforce": {
            title: "Detect SSH Brute Force Attack",
            difficulty: "Beginner",
            description: "Analyze SSH authentication logs to identify a brute force attack and determine which account was compromised",
            logs: sshBruteForceLog,
            questions: [
                {
                    q: "What is the attacker's IP address?",
                    answer: "192.168.1.100",
                    hint: "Look for repeated failed attempts from the same source"
                },
                {
                    q: "How many failed login attempts occurred before success?",
                    answer: "24",
                    hint: "Count the 'Failed password' log entries"
                },
                {
                    q: "Which username was successfully compromised?",
                    answer: "root",
                    hint: "Find the 'Accepted password' entry"
                },
                {
                    q: "What time was access gained? (HH:MM:SS)",
                    answer: "10:16:44",
                    hint: "Check the timestamp of the successful login"
                }
            ],
            detectionRules: {
                suricata: `alert tcp any any -> $HOME_NET 22 (msg:"SSH Brute Force Detected"; flow:to_server; content:"SSH"; threshold:type both,track by_src,count 5,seconds 60; classtype:attempted-admin; sid:1000001; rev:1;)`,
                sigma: `
title: SSH Brute Force Attack
id: 1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6
status: stable
description: Detects potential SSH brute force attacks
logsource:
    product: linux
    service: sshd
detection:
    selection:
        action: 'failed'
    timeframe: 60s
    condition: selection | count(src_ip) > 5
level: high
tags:
    - attack.credential_access
    - attack.t1110
                `.trim(),
                elk: `
POST _search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "message": "Failed password" } },
        { "range": { "@timestamp": { "gte": "now-5m" } } }
      ]
    }
  },
  "aggs": {
    "failed_attempts_by_ip": {
      "terms": {
        "field": "source.ip",
        "min_doc_count": 5
      }
    }
  }
}
                `.trim()
            },
            mitreTechnique: "T1110.001 - Brute Force: Password Guessing",
            remediation: [
                "Implement fail2ban to automatically block IPs after failed attempts",
                "Enforce strong password policies",
                "Disable root SSH login (PermitRootLogin no)",
                "Use SSH key-based authentication",
                "Implement multi-factor authentication (MFA)",
                "Rate limit SSH connections"
            ]
        }
    };

    const currentLab = labScenarios[selectedLab as keyof typeof labScenarios];

    const analyzeLogs = () => {
        // Parse user's answers
        const answers = userAnswer.toLowerCase().split("\n");
        const correctAnswers = currentLab.questions.map(q => q.answer.toLowerCase());
        
        let foundIssues: string[] = [];
        let scorePoints = 0;

        // Check each answer
        currentLab.questions.forEach((question, idx) => {
            if (answers[idx]?.includes(question.answer.toLowerCase())) {
                foundIssues.push(`✅ Correct: ${question.q} → ${question.answer}`);
                scorePoints += 25;
            } else {
                foundIssues.push(`❌ Incorrect: ${question.q}`);
            }
        });

        setFindings(foundIssues);
        setScore(scorePoints);
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Lab Header */}
            <Card className="border-2 border-blue-500/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Shield className="h-6 w-6 text-blue-500" />
                                Blue Team Lab: {currentLab.title}
                            </CardTitle>
                            <p className="text-muted-foreground mt-2">
                                {currentLab.description}
                            </p>
                        </div>
                        <Badge variant="outline">{currentLab.difficulty}</Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Log Analysis */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Security Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="p-4 bg-slate-950 text-green-400 rounded-lg text-xs h-[400px] overflow-y-auto">
                                {currentLab.logs}
                            </pre>
                        </CardContent>
                    </Card>

                    {/* Analysis Input */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Your Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {currentLab.questions.map((q, idx) => (
                                    <div key={idx}>
                                        <label className="text-xs font-medium">{idx + 1}. {q.q}</label>
                                        <Input 
                                            placeholder="Your answer"
                                            className="font-mono text-xs"
                                            onChange={(e) => {
                                                const lines = userAnswer.split("\n");
                                                lines[idx] = e.target.value;
                                                setUserAnswer(lines.join("\n"));
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button onClick={analyzeLogs} className="w-full">
                                Submit Analysis
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    {findings.length > 0 && (
                        <Card className="border-2 border-blue-500/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">Analysis Results</CardTitle>
                                    <Badge variant={score === 100 ? "default" : "secondary"}>
                                        Score: {score}/100
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {findings.map((finding, idx) => (
                                    <div key={idx} className="text-sm">
                                        {finding}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: Defense Strategies */}
                <div className="space-y-4">
                    {/* Detection Rules */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">🛡️ Detection Rules</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-xs mb-2">Suricata IDS Rule</h4>
                                <pre className="p-3 bg-slate-950 text-green-400 rounded text-xs overflow-x-auto">
                                    {currentLab.detectionRules.suricata}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-semibold text-xs mb-2">Sigma Rule (SIEM)</h4>
                                <pre className="p-3 bg-slate-950 text-yellow-400 rounded text-xs overflow-x-auto">
                                    {currentLab.detectionRules.sigma}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-semibold text-xs mb-2">ELK Stack Query</h4>
                                <pre className="p-3 bg-slate-950 text-blue-400 rounded text-xs overflow-x-auto">
                                    {currentLab.detectionRules.elk}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    {/* MITRE ATT&CK */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">🎯 MITRE ATT&CK Mapping</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="destructive" className="mb-2">
                                {currentLab.mitreTechnique}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                                Adversaries may use brute force techniques to gain access to accounts when passwords are unknown
                            </p>
                        </CardContent>
                    </Card>

                    {/* Remediation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">✅ Remediation Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {currentLab.remediation.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs">
                                        <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BlueTeamLab;
```

**Why This Works:**
- ✅ **Real SOC workflow** - Log analysis is #1 SOC skill
- ✅ **Detection rules** - Teaches Suricata, Sigma, ELK
- ✅ **MITRE ATT&CK** - Industry standard mapping
- ✅ **Remediation focus** - Not just find, but FIX
- ✅ **Interview prep** - Can explain blue team thinking

---

## 🔴 CRITICAL ISSUE #4: No Practical Assessment / Progress Validation

### **Why This Matters:**

**Resume Impact:**
- ❌ "Completed online cybersecurity course" (Generic, no proof)
- ✅ "Exploited 50+ vulnerable applications with verified flags" (Specific, provable)

**Portfolio Value:**
- Employers want EVIDENCE of skills
- GitHub with writeups >> Certificate of completion
- Leaderboard ranking shows competitive drive

### **Solution 4.1: Comprehensive Skill Tracking System**

Create `src/pages/SkillDashboard.tsx`:

```typescript
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Trophy, 
    Target, 
    Flame, 
    Star, 
    Award,
    Download,
    Github,
    Linkedin
} from "lucide-react";
import { jsPDF } from "jspdf";

interface UserSkills {
    webExploitation: number; // 0-100
    binaryExploitation: number;
    cryptography: number;
    forensics: number;
    networking: number;
    blueTeam: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: "common" | "rare" | "epic" | "legendary";
    category: string;
    dateEarned: string;
    points: number;
}

interface LabCompletion {
    labId: string;
    labName: string;
    category: string;
    difficulty: string;
    completedAt: string;
    timeSpent: number; // minutes
    attempts: number;
    flag: string;
}

const SkillDashboard = () => {
    const [userLevel, setUserLevel] = useState(15);
    const [totalPoints, setTotalPoints] = useState(3450);
    const [completedLabs, setCompletedLabs] = useState(28);
    const [streak, setStreak] = useState(12);
    const [rank, setRank] = useState(47);

    const [skills, setSkills] = useState<UserSkills>({
        webExploitation: 75,
        binaryExploitation: 45,
        cryptography: 60,
        forensics: 55,
        networking: 80,
        blueTeam: 70
    });

    const [achievements, setAchievements] = useState<Achievement[]>([
        {
            id: "ach-001",
            title: "SQL Ninja",
            description: "Complete 10 SQL injection labs",
            icon: "💉",
            rarity: "rare",
            category: "Web Exploitation",
            dateEarned: "2024-02-01",
            points: 500
        },
        {
            id: "ach-002",
            title: "Blue Team Guardian",
            description: "Analyze 15 security incidents",
            icon: "🛡️",
            rarity: "epic",
            category: "Blue Team",
            dateEarned: "2024-02-03",
            points: 750
        },
        {
            id: "ach-003",
            title: "Streak Master",
            description: "Maintain 7-day learning streak",
            icon: "🔥",
            rarity: "common",
            category: "Consistency",
            dateEarned: "2024-02-05",
            points: 250
        }
    ]);

    const [recentCompletions, setRecentCompletions] = useState<LabCompletion[]>([
        {
            labId: "sql-001",
            labName: "SQL Injection Authentication Bypass",
            category: "Web Exploitation",
            difficulty: "Beginner",
            completedAt: "2024-02-05 14:30",
            timeSpent: 25,
            attempts: 3,
            flag: "FLAG{sql_1nj3ct10n_m4st3r}"
        },
        {
            labId: "blue-001",
            labName: "SSH Brute Force Detection",
            category: "Blue Team",
            difficulty: "Intermediate",
            completedAt: "2024-02-05 16:45",
            timeSpent: 40,
            attempts: 2,
            flag: "FLAG{d3t3ct_br00t3_f0rc3}"
        }
    ]);

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "common": return "text-gray-400";
            case "rare": return "text-blue-400";
            case "epic": return "text-purple-400";
            case "legendary": return "text-yellow-400";
            default: return "text-gray-400";
        }
    };

    const generateCertificate = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        // Certificate Design
        doc.setFillColor(15, 23, 42); // Slate-950
        doc.rect(0, 0, 297, 210, "F");

        // Border
        doc.setDrawColor(239, 68, 68); // Red-500
        doc.setLineWidth(2);
        doc.rect(10, 10, 277, 190);

        // Title
        doc.setFontSize(32);
        doc.setTextColor(239, 68, 68);
        doc.text("CERTIFICATE OF ACHIEVEMENT", 148.5, 50, { align: "center" });

        // Subtitle
        doc.setFontSize(16);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.text("HackWebTools Cybersecurity Training Platform", 148.5, 65, { align: "center" });

        // Recipient
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("John Doe", 148.5, 90, { align: "center" });

        // Achievement Text
        doc.setFontSize(14);
        doc.setTextColor(203, 213, 225); // Slate-300
        doc.text("has successfully demonstrated proficiency in cybersecurity", 148.5, 105, { align: "center" });
        doc.text("by completing the following achievements:", 148.5, 115, { align: "center" });

        // Stats
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text(`Total Labs Completed: ${completedLabs}`, 40, 140);
        doc.text(`Total Points Earned: ${totalPoints}`, 40, 150);
        doc.text(`Current Level: ${userLevel}`, 40, 160);
        doc.text(`Global Rank: #${rank}`, 40, 170);

        doc.text(`Web Exploitation: ${skills.webExploitation}%`, 170, 140);
        doc.text(`Blue Team Defense: ${skills.blueTeam}%`, 170, 150);
        doc.text(`Network Security: ${skills.networking}%`, 170, 160);
        doc.text(`Achievements Unlocked: ${achievements.length}`, 170, 170);

        // Date
        doc.setTextColor(148, 163, 184);
        doc.text(`Issued: ${new Date().toLocaleDateString()}`, 148.5, 190, { align: "center" });

        // Save
        doc.save("HackWebTools_Certificate.pdf");
    };

    const exportToJSON = () => {
        const portfolio = {
            profile: {
                level: userLevel,
                totalPoints,
                completedLabs,
                streak,
                globalRank: rank
            },
            skills,
            achievements,
            recentCompletions,
            generatedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(portfolio, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "hackwebtools-portfolio.json";
        a.click();
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Level</p>
                                <h3 className="text-3xl font-bold">{userLevel}</h3>
                            </div>
                            <Trophy className="h-8 w-8 text-yellow-500" />
                        </div>
                        <Progress value={(userLevel / 100) * 100} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Points</p>
                                <h3 className="text-3xl font-bold">{totalPoints}</h3>
                            </div>
                            <Star className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed Labs</p>
                                <h3 className="text-3xl font-bold">{completedLabs}</h3>
                            </div>
                            <Target className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Day Streak</p>
                                <h3 className="text-3xl font-bold">{streak}</h3>
                            </div>
                            <Flame className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Skill Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Skill Proficiency</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(skills).map(([skill, value]) => (
                        <div key={skill}>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium capitalize">
                                    {skill.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="text-sm text-muted-foreground">{value}%</span>
                            </div>
                            <Progress value={value} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Achievements</CardTitle>
                        <Badge>{achievements.length} Unlocked</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        {achievements.map(achievement => (
                            <Card key={achievement.id} className="border-2">
                                <CardContent className="pt-6">
                                    <div className="text-center space-y-2">
                                        <div className={`text-4xl ${getRarityColor(achievement.rarity)}`}>
                                            {achievement.icon}
                                        </div>
                                        <h4 className="font-bold">{achievement.title}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {achievement.description}
                                        </p>
                                        <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                                            {achievement.rarity.toUpperCase()}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">
                                            +{achievement.points} points
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Completions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Lab Completions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentCompletions.map((completion, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <h4 className="font-semibold">{completion.labName}</h4>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="secondary">{completion.category}</Badge>
                                        <Badge variant="outline">{completion.difficulty}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Completed in {completion.timeSpent} minutes • {completion.attempts} attempts
                                    </p>
                                </div>
                                <code className="text-xs bg-slate-950 px-3 py-1 rounded text-green-400">
                                    {completion.flag}
                                </code>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Portfolio & Certification
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Export your achievements and skills for job applications and interviews
                    </p>
                    <div className="flex gap-2">
                        <Button onClick={generateCertificate} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download Certificate (PDF)
                        </Button>
                        <Button onClick={exportToJSON} variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export Portfolio (JSON)
                        </Button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            Share on GitHub
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4" />
                            Share on LinkedIn
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SkillDashboard;
```

**Install jsPDF:**
```bash
npm install jspdf
```

**Why This Works:**
- ✅ **Measurable progress** - Numerical skill scores
- ✅ **Portfolio artifacts** - PDF certificates, JSON exports
- ✅ **Social proof** - GitHub/LinkedIn integration
- ✅ **Gamification** - Achievements, streaks, ranks
- ✅ **Resume-ready** - Specific, quantifiable accomplishments

---

*Due to length constraints, I'll continue with the remaining sections in the next part of the implementation guide...*

**Would you like me to continue with:**
1. PART B: Interactive UI/Animation Design (terminal animations, attack flow SVGs, progress visualizations)
2. PART C: Portfolio & Interview Value (resume templates, interview prep, GitHub showcase)
3. Implementation of the remaining issues (Payload Builder, Tool Workflows, Threat Modeling)

Let me know which section you'd like me to expand next, or I can continue with all of them in a follow-up document!
