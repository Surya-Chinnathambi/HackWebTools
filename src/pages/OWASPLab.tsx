import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Shield,
    AlertTriangle,
    BookOpen,
    Code,
    Lock,
    Database,
    FileCode,
    CheckCircle2,
    XCircle,
    Lightbulb,
    Target,
    Trophy,
    Play,
    DollarSign,
    Building2,
    Server,
    Users,
    Clock,
    TrendingUp
} from "lucide-react";

interface AttackerMotivation {
    financial?: string;
    espionage?: string;
    access?: string;
    reputation?: string;
}

interface RealWorldImpact {
    breachExample?: string;
    averageCost?: string;
    timeToExploit?: string;
    severity?: string;
    affected?: string;
}

interface OWASPVulnerability {
    id: number;
    rank: string;
    title: string;
    description: string;
    impact: string;
    example: string;
    prevention: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
    attackerMotivation: AttackerMotivation;
    realWorldImpact: RealWorldImpact;
}

interface LabExercise {
    id: string;
    vulnerabilityId: number;
    title: string;
    description: string;
    objective: string;
    hint: string;
    solution: string;
    testInput: string;
    expectedOutput: string;
}

interface ExerciseResult {
    exerciseId: string;
    success: boolean;
    userInput: string;
    feedback: string;
    timestamp: string;
}

const owaspTop10: OWASPVulnerability[] = [
    {
        id: 1,
        rank: "A01",
        title: "Broken Access Control",
        description: "Failures related to access control, allowing users to act outside of their intended permissions.",
        impact: "Unauthorized access to sensitive data, modification or deletion of data, performing unauthorized functions.",
        example: "User can access admin panel by changing URL from /user/profile to /admin/panel without proper authorization checks.",
        prevention: [
            "Deny access by default",
            "Implement access control mechanisms once and re-use throughout the application",
            "Model access controls to enforce record ownership",
            "Disable web server directory listing",
            "Log access control failures and alert admins",
            "Rate limit API and controller access to minimize automated attack tooling"
        ],
        difficulty: "intermediate",
        category: "Authorization",
        attackerMotivation: {
            financial: "Access premium features without payment, steal customer data worth $50-200 per record on dark web",
            access: "Escalate from regular user to admin, modify any user's data, access restricted functionality",
            espionage: "View competitor data, steal business intelligence, access confidential documents"
        },
        realWorldImpact: {
            breachExample: "Facebook Cambridge Analytica (2018): IDOR vulnerability allowed access to 87 million users' data through broken access control",
            averageCost: "$3.86 million average breach cost (IBM 2023)",
            timeToExploit: "5-30 minutes using browser dev tools or Burp Suite",
            severity: "HIGH - Most common web vulnerability (94% of apps tested had some form)",
            affected: "Every user account and their associated data"
        }
    },
    {
        id: 2,
        rank: "A02",
        title: "Cryptographic Failures",
        description: "Failures related to cryptography, which often lead to exposure of sensitive data.",
        impact: "Exposure of sensitive data such as passwords, credit card numbers, health records, personal information.",
        example: "Application stores passwords in plain text or uses weak encryption algorithms like MD5 or SHA1 without salting.",
        prevention: [
            "Classify data processed, stored, or transmitted by an application",
            "Don't store sensitive data unnecessarily",
            "Encrypt all sensitive data at rest and in transit",
            "Use strong adaptive and salted hashing functions (Argon2, scrypt, bcrypt, or PBKDF2)",
            "Disable caching for responses containing sensitive data",
            "Store passwords using strong adaptive salted hashing functions"
        ],
        difficulty: "intermediate",
        category: "Cryptography",
        attackerMotivation: {
            financial: "Crack password databases using rainbow tables, steal credit cards and sell for $10-100 each",
            access: "Decrypt sensitive communications, access encrypted files, intercept HTTPS traffic with weak SSL",
            espionage: "Read confidential business data, government secrets, trade secrets worth millions"
        },
        realWorldImpact: {
            breachExample: "Yahoo (2013): 3 billion accounts compromised using MD5 hashing without proper salting. Passwords cracked in hours.",
            averageCost: "$150 per stolen record containing PII (2023 data)",
            timeToExploit: "Minutes to hours depending on algorithm weakness (MD5 cracked instantly, weak bcrypt in days)",
            severity: "CRITICAL - Affects 100% of stolen data's confidentiality",
            affected: "All users whose passwords or sensitive data is stored with weak crypto"
        }
    },
    {
        id: 3,
        rank: "A03",
        title: "Injection",
        description: "User-supplied data is not validated, filtered, or sanitized by the application.",
        impact: "Data loss, corruption, disclosure, denial of access, or complete host takeover.",
        example: "SQL Injection: SELECT * FROM users WHERE username = '[userInput]' - attacker enters: admin' OR '1'='1",
        prevention: [
            "Use parameterized queries (prepared statements)",
            "Use ORM frameworks that automatically sanitize inputs",
            "Positive server-side input validation",
            "Escape special characters using context-specific escape syntax",
            "Use LIMIT and other SQL controls within queries to prevent mass disclosure"
        ],
        difficulty: "beginner",
        category: "Input Validation",
        attackerMotivation: {
            financial: "Dump entire customer database, extract credit cards, sell complete DB for $10k-500k on dark web",
            access: "Bypass authentication (login as admin without password), execute OS commands, upload web shells",
            reputation: "Most iconic hack technique - proves skill, easy to demonstrate in bug bounties ($500-50k rewards)"
        },
        realWorldImpact: {
            breachExample: "Equifax (2017): Apache Struts SQL Injection led to 147 million records stolen. Settlement: $700 million. CEO resigned.",
            averageCost: "$4.45 million average data breach cost",
            timeToExploit: "30 seconds with SQLMap automated tool",
            severity: "CRITICAL (CVSS 9.0+) - Complete database compromise",
            affected: "Every database record in vulnerable table (potentially millions)"
        }
    },
    {
        id: 4,
        rank: "A04",
        title: "Insecure Design",
        description: "Missing or ineffective control design, representing different weaknesses expressed as 'missing or ineffective control design'.",
        impact: "Wide range of impacts depending on the specific design flaws, from data exposure to complete system compromise.",
        example: "Cinema booking system allows free tickets by manipulating client-side validation without server-side checks.",
        prevention: [
            "Establish and use a secure development lifecycle",
            "Establish and use a library of secure design patterns",
            "Use threat modeling for critical authentication, access control, business logic, and key flows",
            "Integrate security language and controls into user stories",
            "Write unit and integration tests to validate that all critical flows are resistant to threat models"
        ],
        difficulty: "advanced",
        category: "Design",
        attackerMotivation: {
            financial: "Exploit business logic to get free products/services, transfer funds without authorization",
            access: "Bypass payment systems, manipulate pricing, abuse referral/reward programs",
            reputation: "Find novel vulnerabilities that automated scanners miss - high bug bounty rewards ($1k-25k)"
        },
        realWorldImpact: {
            breachExample: "Airline loyalty program: Logic flaw allowed users to book first-class flights for economy prices. Lost revenue: $1.2M",
            averageCost: "Varies widely - from thousands in lost revenue to complete business model failure",
            timeToExploit: "Hours to days of manual testing to discover, seconds to exploit once found",
            severity: "MEDIUM to HIGH - Depends on business impact",
            affected: "All users exploiting the flaw + company financial losses"
        }
    },
    {
        id: 5,
        rank: "A05",
        title: "Security Misconfiguration",
        description: "Security misconfiguration can happen at any level of an application stack.",
        impact: "Unauthorized access to system data or functionality, complete system compromise.",
        example: "Default admin credentials still enabled (admin/admin), directory listing enabled exposing source code, detailed error messages revealing stack traces.",
        prevention: [
            "Implement a minimal platform without unnecessary features",
            "Review and update configurations as part of patch management",
            "Implement a segmented application architecture",
            "Send security directives to clients (Security Headers)",
            "Automate process to verify effectiveness of configurations in all environments"
        ],
        difficulty: "beginner",
        category: "Configuration",
        attackerMotivation: {
            financial: "Use default credentials to access admin panels, steal data, deploy ransomware",
            access: "Exploit exposed debug endpoints, access internal APIs, enumerate system information",
            reputation: "Low-hanging fruit - easy to find with automated scanners, proves basic pentesting skills"
        },
        realWorldImpact: {
            breachExample: "MongoDB databases: 600+ million records exposed due to default 'no authentication' configuration in 2017-2019",
            averageCost: "$2.8M average breach cost from misconfiguration",
            timeToExploit: "5 minutes (automated scanners find these instantly)",
            severity: "HIGH - 95% of breaches involve misconfiguration",
            affected: "Entire application and all user data"
        }
    },
    {
        id: 6,
        rank: "A06",
        title: "Vulnerable and Outdated Components",
        description: "Using components with known vulnerabilities or unsupported versions.",
        impact: "Ranges from minimal to complete host takeover and data breach.",
        example: "Using old version of Apache Struts framework vulnerable to remote code execution (Equifax breach).",
        prevention: [
            "Remove unused dependencies and unnecessary features",
            "Continuously inventory versions of client-side and server-side components",
            "Monitor sources like CVE and NVD for vulnerabilities",
            "Only obtain components from official sources over secure links",
            "Monitor for libraries and components that are unmaintained"
        ],
        difficulty: "intermediate",
        category: "Components",
        attackerMotivation: {
            financial: "Exploit public CVEs with ready-made exploit code - no skill needed, maximum impact",
            access: "Remote code execution in hours, full server control, pivot to internal network",
            reputation: "Automated mass-exploitation - hack thousands of sites simultaneously using Shodan + Metasploit"
        },
        realWorldImpact: {
            breachExample: "Equifax (2017): Unpatched Apache Struts CVE-2017-5638. Breach: 147M records, Cost: $1.4 billion, CEO resigned, 4 executives charged",
            averageCost: "$4.24M average breach + legal penalties + reputation damage",
            timeToExploit: "Minutes (exploit code publicly available for known CVEs)",
            severity: "CRITICAL (CVSS 9-10) - Often leads to full server compromise",
            affected: "All application users + potential lateral movement to other systems"
        }
    },
    {
        id: 7,
        rank: "A07",
        title: "Identification and Authentication Failures",
        description: "Failures in confirming the user's identity, authentication, and session management.",
        impact: "Account takeover, identity theft, unauthorized access to sensitive data.",
        example: "Application allows brute force attacks, uses default passwords, has weak password requirements, exposes session IDs in URLs.",
        prevention: [
            "Implement multi-factor authentication",
            "Do not ship or deploy with default credentials",
            "Implement weak password checks (top 10000 passwords)",
            "Align password length, complexity, and rotation policies with NIST 800-63b",
            "Ensure registration and credential recovery paths are hardened",
            "Use server-side, secure, built-in session manager"
        ],
        difficulty: "intermediate",
        category: "Authentication",
        attackerMotivation: {
            financial: "Take over accounts to steal payment info, cryptocurrency wallets, commit fraud using victim's identity",
            access: "Brute force admin accounts, credential stuffing using leaked password databases (billions available)",
            espionage: "Access email accounts for corporate espionage, government surveillance, blackmail material"
        },
        realWorldImpact: {
            breachExample: "Dropbox (2012): 68M passwords stolen due to weak hashing. Uber (2016): AWS keys exposed, 57M records stolen. Cost: $148M settlement",
            averageCost: "$4.5M average breach cost from credential theft",
            timeToExploit: "Hours to days for brute force (1000s of attempts/sec), instant if credentials reused from previous breaches",
            severity: "HIGH - Account takeover affects victim's entire digital life",
            affected: "Individual users to entire user base if mass credential stuffing"
        }
    },
    {
        id: 8,
        rank: "A08",
        title: "Software and Data Integrity Failures",
        description: "Code and infrastructure that doesn't protect against integrity violations.",
        impact: "Unauthorized access, malicious code execution, compromised CI/CD pipeline.",
        example: "Auto-update feature downloads updates over unencrypted HTTP connection without signature verification.",
        prevention: [
            "Use digital signatures to verify software or data is from expected source",
            "Ensure libraries and dependencies use trusted repositories",
            "Use software supply chain security tools",
            "Ensure CI/CD pipeline has proper segregation and access control",
            "Ensure unsigned or unencrypted serialized data is not sent to untrusted clients"
        ],
        difficulty: "advanced",
        category: "Integrity",
        attackerMotivation: {
            financial: "Inject malware into software updates reaching millions of users, cryptominers, ransomware distribution",
            access: "Compromise CI/CD pipeline to backdoor all future releases, supply chain attack affecting thousands of companies",
            espionage: "Nation-state attacks (SolarWinds-style) to infiltrate governments and Fortune 500 companies"
        },
        realWorldImpact: {
            breachExample: "SolarWinds (2020): CI/CD compromise injected backdoor into Orion updates. Affected: 18,000 organizations, 9 US agencies. Estimated cost: $100+ billion",
            averageCost: "Catastrophic - can exceed $10B for supply chain attacks",
            timeToExploit: "Months of planning for supply chain attacks, seconds for deserialization exploits",
            severity: "CRITICAL - Can affect millions of downstream users/customers",
            affected: "All users of compromised software (potentially millions)"
        }
    },
    {
        id: 9,
        rank: "A09",
        title: "Security Logging and Monitoring Failures",
        description: "Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response.",
        impact: "Increased damage from breaches, inability to detect attacks in progress, delayed incident response.",
        example: "Failed login attempts not logged, critical transactions lacking audit trail, logs only stored locally.",
        prevention: [
            "Ensure all login, access control, and server-side input validation failures are logged",
            "Ensure logs are in a format that log management solutions can consume",
            "Ensure log data is encoded correctly to prevent injections or attacks",
            "Ensure high-value transactions have audit trail with integrity controls",
            "Establish effective monitoring and alerting",
            "Establish or adopt an incident response and recovery plan"
        ],
        difficulty: "intermediate",
        category: "Monitoring",
        attackerMotivation: {
            financial: "Stay undetected longer = more data stolen. Average breach detection: 287 days without monitoring",
            access: "Cover tracks by deleting logs, prevent forensics investigation, avoid attribution",
            reputation: "Advanced persistent threats (APTs) - maintain access for years without detection"
        },
        realWorldImpact: {
            breachExample: "Target (2013): Breach undetected for weeks despite security alerts being ignored. 40M credit cards stolen. Cost: $202M + CEO resignation",
            averageCost: "287 days average detection time × daily breach cost = $1.2M-4.5M additional losses",
            timeToExploit: "N/A - This vulnerability allows OTHER exploits to go undetected",
            severity: "HIGH - Multiplies impact of all other vulnerabilities",
            affected: "All users (breach runs longer, more data stolen before detection)"
        }
    },
    {
        id: 10,
        rank: "A10",
        title: "Server-Side Request Forgery (SSRF)",
        description: "SSRF flaws occur whenever a web application fetches a remote resource without validating the user-supplied URL.",
        impact: "Scan and connect to internal network, read sensitive data, access cloud metadata services.",
        example: "Application fetches user-provided URL without validation: fetch(userInput) where attacker provides: http://169.254.169.254/latest/meta-data/",
        prevention: [
            "Sanitize and validate all client-supplied input data",
            "Enforce URL schema, port, and destination with positive allow list",
            "Do not send raw responses to clients",
            "Disable HTTP redirections",
            "Segment remote resource access functionality in separate networks"
        ],
        difficulty: "advanced",
        category: "Input Validation",
        attackerMotivation: {
            financial: "Steal AWS/Azure credentials from cloud metadata, pivot to entire infrastructure, cryptomining on cloud resources",
            access: "Access internal services (databases, admin panels) not exposed to internet, bypass firewalls",
            espionage: "Read internal documentation, source code repositories, environment variables with secrets"
        },
        realWorldImpact: {
            breachExample: "Capital One (2019): SSRF in AWS metadata service. 100M credit applications stolen. Fine: $80M, Total cost: $300M+",
            averageCost: "$2.5M-5M+ (can escalate to full infrastructure compromise)",
            timeToExploit: "5-30 minutes once SSRF found (cloud metadata at 169.254.169.254)",
            severity: "HIGH to CRITICAL - Can expose entire cloud infrastructure",
            affected: "All internal systems accessible from compromised server"
        }
    }
];

const labExercises: LabExercise[] = [
    {
        id: "sqli-basic",
        vulnerabilityId: 3,
        title: "SQL Injection - Authentication Bypass",
        description: "Exploit a vulnerable login form to gain admin access",
        objective: "Bypass authentication using SQL injection in the username field",
        hint: "Try using SQL comment syntax (--) to ignore the password check",
        solution: "admin' --",
        testInput: "admin' --",
        expectedOutput: "Login successful! Welcome, admin"
    },
    {
        id: "xss-reflected",
        vulnerabilityId: 3,
        title: "Cross-Site Scripting - Reflected XSS",
        description: "Inject JavaScript code into search parameter",
        objective: "Trigger an alert box by injecting JavaScript",
        hint: "Use <script> tags to execute JavaScript code",
        solution: "<script>alert('XSS')</script>",
        testInput: "<script>alert('XSS')</script>",
        expectedOutput: "XSS vulnerability detected!"
    },
    {
        id: "idor-exploit",
        vulnerabilityId: 1,
        title: "IDOR - Access Other User's Data",
        description: "Manipulate user ID to access unauthorized data",
        objective: "Access user ID 2's data when logged in as user ID 1",
        hint: "Change the user_id parameter in the URL",
        solution: "user_id=2",
        testInput: "user_id=2",
        expectedOutput: "Unauthorized access detected! IDOR vulnerability confirmed"
    },
    {
        id: "weak-crypto",
        vulnerabilityId: 2,
        title: "Cryptographic Failure - Weak Hash Detection",
        description: "Identify weak password hashing algorithm",
        objective: "Identify the hashing algorithm used (MD5, SHA1, or bcrypt)",
        hint: "MD5 hashes are 32 characters, SHA1 are 40, bcrypt start with $2",
        solution: "MD5",
        testInput: "MD5",
        expectedOutput: "Correct! MD5 is cryptographically broken and should not be used for passwords"
    },
    {
        id: "default-creds",
        vulnerabilityId: 5,
        title: "Security Misconfiguration - Default Credentials",
        description: "Find and exploit default admin credentials",
        objective: "Login using common default credentials",
        hint: "Try the most common default username and password combination",
        solution: "admin:admin",
        testInput: "admin:admin",
        expectedOutput: "Login successful! Default credentials should be changed immediately"
    }
];

const OWASPLab = () => {
    const [selectedVulnerability, setSelectedVulnerability] = useState<OWASPVulnerability>(owaspTop10[0]);
    const [selectedExercise, setSelectedExercise] = useState<LabExercise | null>(null);
    const [userInput, setUserInput] = useState("");
    const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const runExercise = () => {
        if (!selectedExercise) return;

        const isCorrect = userInput.trim().toLowerCase() === selectedExercise.solution.toLowerCase();

        const result: ExerciseResult = {
            exerciseId: selectedExercise.id,
            success: isCorrect,
            userInput,
            feedback: isCorrect
                ? `✅ ${selectedExercise.expectedOutput}`
                : `❌ Incorrect. The input doesn't exploit the vulnerability correctly.`,
            timestamp: new Date().toISOString()
        };

        setExerciseResults([result, ...exerciseResults]);
    };

    const resetExercise = () => {
        setUserInput("");
        setShowHint(false);
        setShowSolution(false);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return "text-green-600 bg-green-50 border-green-200";
            case "intermediate":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "advanced":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const completedExercises = new Set(
        exerciseResults.filter(r => r.success).map(r => r.exerciseId)
    );

    const totalExercises = labExercises.length;
    const completedCount = completedExercises.size;
    const successRate = exerciseResults.length > 0
        ? (exerciseResults.filter(r => r.success).length / exerciseResults.length) * 100
        : 0;

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Shield className="h-8 w-8 text-primary" />
                    OWASP Top 10 Interactive Lab
                </h1>
                <p className="text-muted-foreground">
                    Learn about web application security vulnerabilities through interactive exercises
                </p>
            </div>

            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    📚 <strong>Educational Lab Environment:</strong> Practice identifying and exploiting common web vulnerabilities
                    in a safe, simulated environment. Knowledge gained should only be used for authorized security testing.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <Trophy className="h-8 w-8 mx-auto text-yellow-600" />
                            <div className="text-2xl font-bold">{completedCount}/{totalExercises}</div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <Target className="h-8 w-8 mx-auto text-primary" />
                            <div className="text-2xl font-bold">{exerciseResults.length}</div>
                            <div className="text-sm text-muted-foreground">Attempts</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <CheckCircle2 className="h-8 w-8 mx-auto text-green-600" />
                            <div className="text-2xl font-bold">{successRate.toFixed(0)}%</div>
                            <div className="text-sm text-muted-foreground">Success Rate</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <Shield className="h-8 w-8 mx-auto text-blue-600" />
                            <div className="text-2xl font-bold">10</div>
                            <div className="text-sm text-muted-foreground">OWASP Top 10</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="learn" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="learn">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Learn
                    </TabsTrigger>
                    <TabsTrigger value="practice">
                        <Code className="h-4 w-4 mr-2" />
                        Practice
                    </TabsTrigger>
                    <TabsTrigger value="results">
                        <Trophy className="h-4 w-4 mr-2" />
                        Progress
                    </TabsTrigger>
                </TabsList>

                {/* Learn Tab */}
                <TabsContent value="learn" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-1 space-y-2">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                                OWASP Top 10 2021
                            </h3>
                            <div className="space-y-1">
                                {owaspTop10.map((vuln) => (
                                    <Button
                                        key={vuln.id}
                                        onClick={() => setSelectedVulnerability(vuln)}
                                        variant={selectedVulnerability.id === vuln.id ? "default" : "outline"}
                                        className="w-full justify-start text-left"
                                        size="sm"
                                    >
                                        <span className="font-mono mr-2">{vuln.rank}</span>
                                        <span className="truncate">{vuln.title}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="font-mono">
                                                {selectedVulnerability.rank}
                                            </Badge>
                                            <Badge className={getDifficultyColor(selectedVulnerability.difficulty)}>
                                                {selectedVulnerability.difficulty}
                                            </Badge>
                                            <Badge variant="outline">{selectedVulnerability.category}</Badge>
                                        </div>
                                        <CardTitle className="text-2xl">{selectedVulnerability.title}</CardTitle>
                                    </div>
                                </div>
                                <CardDescription className="text-base mt-2">
                                    {selectedVulnerability.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                                        Impact
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedVulnerability.impact}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Code className="h-4 w-4 text-primary" />
                                        Example
                                    </h4>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm font-mono">{selectedVulnerability.example}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-green-600" />
                                        Prevention
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedVulnerability.prevention.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Why Attackers Love This Section */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                                        <Target className="h-5 w-5 text-red-600" />
                                        Why Attackers Love This
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedVulnerability.attackerMotivation.financial && (
                                            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900">
                                                <DollarSign className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-semibold text-sm text-red-900 dark:text-red-100 mb-1">Financial Gain</h5>
                                                    <p className="text-sm text-red-800 dark:text-red-200">{selectedVulnerability.attackerMotivation.financial}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedVulnerability.attackerMotivation.espionage && (
                                            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900">
                                                <Building2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-1">Corporate Espionage</h5>
                                                    <p className="text-sm text-purple-800 dark:text-purple-200">{selectedVulnerability.attackerMotivation.espionage}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedVulnerability.attackerMotivation.access && (
                                            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
                                                <Server className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">System Control</h5>
                                                    <p className="text-sm text-blue-800 dark:text-blue-200">{selectedVulnerability.attackerMotivation.access}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedVulnerability.attackerMotivation.reputation && (
                                            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900">
                                                <Users className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-semibold text-sm text-orange-900 dark:text-orange-100 mb-1">Reputation / Notoriety</h5>
                                                    <p className="text-sm text-orange-800 dark:text-orange-200">{selectedVulnerability.attackerMotivation.reputation}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Real World Impact Section */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                                        Real-World Impact
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedVulnerability.realWorldImpact.breachExample && (
                                            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                                                <TrendingUp className="h-4 w-4 text-amber-600" />
                                                <AlertDescription className="text-sm text-amber-900 dark:text-amber-100">
                                                    <strong>Famous Breach:</strong> {selectedVulnerability.realWorldImpact.breachExample}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {selectedVulnerability.realWorldImpact.averageCost && (
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <DollarSign className="h-4 w-4 text-gray-600" />
                                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Average Cost</span>
                                                    </div>
                                                    <p className="text-sm font-medium">{selectedVulnerability.realWorldImpact.averageCost}</p>
                                                </div>
                                            )}
                                            {selectedVulnerability.realWorldImpact.timeToExploit && (
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock className="h-4 w-4 text-gray-600" />
                                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Time to Exploit</span>
                                                    </div>
                                                    <p className="text-sm font-medium">{selectedVulnerability.realWorldImpact.timeToExploit}</p>
                                                </div>
                                            )}
                                            {selectedVulnerability.realWorldImpact.severity && (
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <AlertTriangle className="h-4 w-4 text-gray-600" />
                                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Severity</span>
                                                    </div>
                                                    <p className="text-sm font-medium">{selectedVulnerability.realWorldImpact.severity}</p>
                                                </div>
                                            )}
                                            {selectedVulnerability.realWorldImpact.affected && (
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Users className="h-4 w-4 text-gray-600" />
                                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Affected</span>
                                                    </div>
                                                    <p className="text-sm font-medium">{selectedVulnerability.realWorldImpact.affected}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Practice Tab */}
                <TabsContent value="practice" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-1 space-y-2">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                                Lab Exercises
                            </h3>
                            <div className="space-y-1">
                                {labExercises.map((exercise) => {
                                    const isCompleted = completedExercises.has(exercise.id);
                                    return (
                                        <Button
                                            key={exercise.id}
                                            onClick={() => {
                                                setSelectedExercise(exercise);
                                                resetExercise();
                                            }}
                                            variant={selectedExercise?.id === exercise.id ? "default" : "outline"}
                                            className="w-full justify-start text-left"
                                            size="sm"
                                        >
                                            {isCompleted && <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />}
                                            <span className="truncate">{exercise.title}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {!selectedExercise ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-2">Select an Exercise</h3>
                                        <p className="text-muted-foreground">
                                            Choose a lab exercise from the list to begin practicing
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>{selectedExercise.title}</CardTitle>
                                                <CardDescription className="mt-2">
                                                    {selectedExercise.description}
                                                </CardDescription>
                                            </div>
                                            {completedExercises.has(selectedExercise.id) && (
                                                <Badge className="bg-green-600">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Completed
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Alert>
                                            <Target className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Objective:</strong> {selectedExercise.objective}
                                            </AlertDescription>
                                        </Alert>

                                        <div className="space-y-2">
                                            <Label htmlFor="exploit-input">Your Exploit Attempt</Label>
                                            <Textarea
                                                id="exploit-input"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                placeholder="Enter your exploit payload here..."
                                                rows={4}
                                                className="font-mono"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button onClick={runExercise} className="flex-1">
                                                <Play className="h-4 w-4 mr-2" />
                                                Test Exploit
                                            </Button>
                                            <Button onClick={resetExercise} variant="outline">
                                                Reset
                                            </Button>
                                        </div>

                                        {exerciseResults.filter(r => r.exerciseId === selectedExercise.id).length > 0 && (
                                            <Alert className={
                                                exerciseResults.find(r => r.exerciseId === selectedExercise.id)?.success
                                                    ? "border-green-200 bg-green-50"
                                                    : "border-red-200 bg-red-50"
                                            }>
                                                {exerciseResults.find(r => r.exerciseId === selectedExercise.id)?.success ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                                <AlertDescription>
                                                    {exerciseResults.find(r => r.exerciseId === selectedExercise.id)?.feedback}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="space-y-2 pt-4 border-t">
                                            <Button
                                                onClick={() => setShowHint(!showHint)}
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                            >
                                                <Lightbulb className="h-4 w-4 mr-2" />
                                                {showHint ? "Hide Hint" : "Show Hint"}
                                            </Button>

                                            {showHint && (
                                                <Alert className="border-yellow-200 bg-yellow-50">
                                                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                                                    <AlertDescription>
                                                        <strong>Hint:</strong> {selectedExercise.hint}
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            <Button
                                                onClick={() => setShowSolution(!showSolution)}
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                            >
                                                <Lock className="h-4 w-4 mr-2" />
                                                {showSolution ? "Hide Solution" : "Show Solution"}
                                            </Button>

                                            {showSolution && (
                                                <Alert className="border-blue-200 bg-blue-50">
                                                    <FileCode className="h-4 w-4 text-blue-600" />
                                                    <AlertDescription>
                                                        <strong>Solution:</strong>
                                                        <div className="mt-2 p-2 bg-white rounded border font-mono text-sm">
                                                            {selectedExercise.solution}
                                                        </div>
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Progress</CardTitle>
                            <CardDescription>
                                Track your learning journey through OWASP Top 10 vulnerabilities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {labExercises.map((exercise) => {
                                    const attempts = exerciseResults.filter(r => r.exerciseId === exercise.id);
                                    const isCompleted = completedExercises.has(exercise.id);

                                    return (
                                        <div key={exercise.id} className="p-4 border rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-5 w-5 text-gray-400" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{exercise.title}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {exercise.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">
                                                    {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
                                                </Badge>
                                            </div>

                                            {attempts.length > 0 && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    Last attempt: {new Date(attempts[0].timestamp).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {exerciseResults.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {exerciseResults.slice(0, 10).map((result, index) => {
                                        const exercise = labExercises.find(e => e.id === result.exerciseId);
                                        return (
                                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                                {result.success ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">{exercise?.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(result.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OWASPLab;
