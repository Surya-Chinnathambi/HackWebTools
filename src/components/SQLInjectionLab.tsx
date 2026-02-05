import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
    id: number;
    username: string;
    password: string;
    role: string;
    flag?: string;
}

const SQLInjectionLab = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState<string>("");
    const [attempts, setAttempts] = useState(0);
    const [solved, setSolved] = useState(false);
    const [queryExecuted, setQueryExecuted] = useState("");
    const [showHint, setShowHint] = useState(false);

    // Mock database (frontend only)
    const database: User[] = [
        { id: 1, username: "admin", password: "5up3r_s3cur3_p4ss!", role: "admin", flag: "FLAG{sql_1nj3ct10n_m4st3r}" },
        { id: 2, username: "user", password: "password123", role: "user" },
        { id: 3, username: "guest", password: "guest", role: "guest" },
    ];

    const checkSQLInjection = (user: string, pass: string): boolean => {
        const injectionPatterns = [
            /'/,                           // Single quote
            /--/,                          // SQL comment
            /#/,                           // MySQL comment
            /;/,                           // Statement terminator
            /or.*1.*=.*1/i,               // OR 1=1
            /or.*'.*'.*=/i,               // OR ''=''
            /union/i,                      // UNION
            /select/i,                     // SELECT
        ];

        return injectionPatterns.some(pattern =>
            pattern.test(user) || pattern.test(pass)
        );
    };

    const executeQuery = () => {
        setAttempts(prev => prev + 1);

        // Build the "vulnerable" SQL query
        const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
        setQueryExecuted(query);

        // Check if SQL injection was attempted
        const isInjection = checkSQLInjection(username, password);

        if (isInjection) {
            // Simulate successful SQL injection bypass
            if (
                username.toLowerCase().includes("admin") &&
                (password.toLowerCase().includes("or") || password.includes("'"))
            ) {
                const admin = database.find(u => u.username === "admin");
                setResult(`✅ Login successful! Welcome ${admin?.username}!\n\n🚩 You found the flag: ${admin?.flag}`);
                setSolved(true);
            } else if (password.toLowerCase().includes("' or '1'='1")) {
                const admin = database.find(u => u.username === "admin");
                setResult(`✅ Login successful! Welcome ${admin?.username}!\n\n🚩 You found the flag: ${admin?.flag}`);
                setSolved(true);
            } else if (password.includes("' or 1=1--") || password.includes("' or '1'='1'--")) {
                const admin = database.find(u => u.username === "admin");
                setResult(`✅ Login successful! Welcome ${admin?.username}!\n\n🚩 You found the flag: ${admin?.flag}`);
                setSolved(true);
            } else {
                setResult("⚠️ SQL syntax error detected. Query returned unexpected results.");
            }
        } else {
            // Normal authentication
            const user = database.find(u => u.username === username && u.password === password);

            if (user) {
                if (user.role === "admin") {
                    setResult(`✅ Login successful! Welcome ${user.username}!\n\n🚩 You found the flag: ${user.flag}`);
                    setSolved(true);
                } else {
                    setResult(`✅ Login successful as ${user.username}, but you need admin access to get the flag.`);
                }
            } else {
                setResult("❌ Invalid username or password.");
            }
        }

        // Show hints after failed attempts
        if (!solved && attempts >= 1) {
            setShowHint(true);
        }
    };

    const getHint = (): string => {
        if (attempts >= 6) {
            return "💡 Hint 3: Try payload: admin' OR '1'='1'-- in the password field";
        } else if (attempts >= 4) {
            return "💡 Hint 2: Use SQL comments (--) to ignore the rest of the query";
        } else if (attempts >= 2) {
            return "💡 Hint 1: The single quote (') can break out of the SQL string";
        }
        return "";
    };

    const reset = () => {
        setUsername("");
        setPassword("");
        setResult("");
        setQueryExecuted("");
        setAttempts(0);
        setSolved(false);
        setShowHint(false);
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Card className="border-2 border-red-500/20 bg-gradient-to-br from-slate-950 to-red-950/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                                SQL Injection Lab - Authentication Bypass
                            </CardTitle>
                            <p className="text-sm text-slate-400 mt-2">
                                Exploit the vulnerable login form to gain admin access
                            </p>
                        </div>
                        <Badge variant={solved ? "default" : "secondary"} className="text-lg py-2 px-4">
                            {solved ? "✅ Solved" : `${attempts} Attempts`}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs defaultValue="challenge" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="challenge">Challenge</TabsTrigger>
                            <TabsTrigger value="source">Vulnerable Code</TabsTrigger>
                            <TabsTrigger value="solution">Solution</TabsTrigger>
                        </TabsList>

                        <TabsContent value="challenge" className="space-y-6 mt-6">
                            {/* Login Form */}
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Vulnerable Login Portal</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Username</label>
                                        <Input
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter username"
                                            disabled={solved}
                                            className="font-mono"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Password</label>
                                        <Input
                                            type="text"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            disabled={solved}
                                            className="font-mono"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button onClick={executeQuery} disabled={solved} className="flex-1">
                                            Login
                                        </Button>
                                        <Button onClick={reset} variant="outline">
                                            Reset
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Query Display */}
                            {queryExecuted && (
                                <Card className="bg-slate-900/50 border-yellow-500/20">
                                    <CardHeader>
                                        <CardTitle className="text-sm text-yellow-500">Executed SQL Query</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="text-sm font-mono text-slate-300 bg-slate-950 p-4 rounded overflow-x-auto">
                                            {queryExecuted}
                                        </pre>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Result Display */}
                            {result && (
                                <Card className={`${solved ? 'border-green-500/50 bg-green-950/20' : 'border-red-500/50 bg-red-950/20'}`}>
                                    <CardContent className="pt-6">
                                        <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Hints */}
                            {showHint && !solved && (
                                <Card className="bg-blue-950/20 border-blue-500/20">
                                    <CardContent className="pt-6 flex items-start gap-3">
                                        <Lightbulb className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-blue-300">{getHint()}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Learning Objectives */}
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-sm">🎯 Learning Objectives</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Understand how SQL injection vulnerabilities occur</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Learn to manipulate SQL queries through input fields</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Practice authentication bypass techniques</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Understand the importance of parameterized queries</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="source" className="space-y-4 mt-6">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        Vulnerable PHP Code
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="text-sm font-mono text-slate-300 bg-slate-950 p-4 rounded overflow-x-auto">
                                        {`<?php
// VULNERABLE CODE - DO NOT USE IN PRODUCTION

$username = $_POST['username'];
$password = $_POST['password'];

// Directly concatenating user input into SQL query
$query = "SELECT * FROM users 
          WHERE username='$username' 
          AND password='$password'";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    echo "Login successful! Welcome " . $user['username'];
    if ($user['role'] == 'admin') {
        echo "FLAG: " . $user['flag'];
    }
} else {
    echo "Invalid username or password";
}
?>`}
                                    </pre>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        Secure PHP Code (Fixed)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="text-sm font-mono text-slate-300 bg-slate-950 p-4 rounded overflow-x-auto">
                                        {`<?php
// SECURE CODE - Using Prepared Statements

$username = $_POST['username'];
$password = $_POST['password'];

// Using parameterized query
$stmt = $conn->prepare(
    "SELECT * FROM users 
     WHERE username = ? AND password = ?"
);

$stmt->bind_param("ss", $username, $password);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo "Login successful! Welcome " . $user['username'];
    if ($user['role'] == 'admin') {
        echo "FLAG: " . $user['flag'];
    }
} else {
    echo "Invalid username or password";
}

$stmt->close();
?>`}
                                    </pre>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="solution" className="space-y-4 mt-6">
                            <Card className="bg-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">💡 Solution Walkthrough</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-slate-300">
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Step 1: Identify the Vulnerability</h3>
                                        <p>The login form directly concatenates user input into the SQL query without sanitization.</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Step 2: Break the Query</h3>
                                        <p>Try entering a single quote (') in the username field to see if it causes an error.</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Step 3: Authentication Bypass</h3>
                                        <p>Use SQL injection to bypass authentication:</p>
                                        <div className="bg-slate-950 p-3 rounded mt-2 font-mono">
                                            <p>Username: <span className="text-yellow-400">admin</span></p>
                                            <p>Password: <span className="text-yellow-400">' OR '1'='1</span></p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Step 4: Understanding the Exploit</h3>
                                        <p>The injected payload creates this query:</p>
                                        <div className="bg-slate-950 p-3 rounded mt-2 font-mono text-xs">
                                            SELECT * FROM users WHERE username='admin' AND password=<span className="text-red-400">'' OR '1'='1'</span>
                                        </div>
                                        <p className="mt-2">Since '1'='1' is always true, the query returns the admin user.</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Alternative Payloads:</h3>
                                        <ul className="space-y-1 ml-4">
                                            <li>• <span className="font-mono text-yellow-400">' or 1=1--</span></li>
                                            <li>• <span className="font-mono text-yellow-400">admin'--</span></li>
                                            <li>• <span className="font-mono text-yellow-400">' or 'a'='a</span></li>
                                        </ul>
                                    </div>

                                    <div className="bg-green-950/20 border border-green-500/20 p-4 rounded">
                                        <h3 className="font-semibold text-green-400 mb-2">🛡️ Prevention Methods:</h3>
                                        <ul className="space-y-1 ml-4">
                                            <li>✅ Always use parameterized queries (prepared statements)</li>
                                            <li>✅ Implement input validation and sanitization</li>
                                            <li>✅ Use an ORM that handles SQL escaping</li>
                                            <li>✅ Apply principle of least privilege to database users</li>
                                            <li>✅ Never display database errors to end users</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default SQLInjectionLab;
