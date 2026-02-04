import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen, Calendar, CheckCircle2, Circle, Code, GitBranch,
    GitCommit, GitMerge, GitPullRequest, GraduationCap, Lock,
    Shield, Terminal, Trophy, Users, Zap, Target, Globe,
    FileCode, Workflow, Database, Cloud, Award, ExternalLink,
    Flame, Star, Sparkles, TrendingUp, Brain, Rocket, Video,
    Headphones, Book, Youtube, Linkedin, Twitter, MessageSquare,
    Lightbulb, Play, ChevronRight, Download, Coffee
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const LearningHub = () => {
    const [completedDays, setCompletedDays] = useState<number[]>([]);
    const [streak, setStreak] = useState(0);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    const toggleDayCompletion = (day: number) => {
        setCompletedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const learningPaths = [
        {
            id: "beginner",
            title: "Beginner Path",
            duration: "4-6 weeks",
            icon: GraduationCap,
            color: "from-green-600 to-emerald-600",
            topics: ["Linux Basics", "Networking Fundamentals", "Python Scripting", "Git Basics"]
        },
        {
            id: "intermediate",
            title: "Intermediate Path",
            duration: "8-10 weeks",
            icon: Shield,
            color: "from-blue-600 to-cyan-600",
            topics: ["Web Application Security", "Network Pentesting", "Exploit Development", "OWASP Top 10"]
        },
        {
            id: "advanced",
            title: "Advanced Path",
            duration: "12-16 weeks",
            icon: Trophy,
            color: "from-red-600 to-orange-600",
            topics: ["Binary Exploitation", "Reverse Engineering", "Red Team Operations", "Zero-Day Research"]
        }
    ];

    const thirtyDayRoadmap = [
        {
            week: 1,
            theme: "Foundations & Environment Setup",
            days: [
                {
                    day: 1,
                    title: "Linux Fundamentals",
                    topics: ["Linux file system", "Basic commands (ls, cd, pwd, cat)", "File permissions (chmod, chown)", "Process management"],
                    resources: ["https://linuxjourney.com", "https://overthewire.org/wargames/bandit/"],
                    practice: "Set up Kali Linux VM, practice 50 basic commands"
                },
                {
                    day: 2,
                    title: "Git Basics & Version Control",
                    topics: ["Git installation & config", "Repository initialization", "Basic workflow (add, commit, push)", "Branching basics"],
                    resources: ["https://git-scm.com/book", "https://learngitbranching.js.org"],
                    practice: "Create GitHub account, initialize first repository, make 10 commits"
                },
                {
                    day: 3,
                    title: "Git Advanced Concepts",
                    topics: ["Branching strategies", "Merge vs Rebase", "Resolving conflicts", "Git workflow best practices"],
                    resources: ["https://www.atlassian.com/git/tutorials", "https://github.com/git-tips/tips"],
                    practice: "Create feature branches, practice merging, handle conflicts"
                },
                {
                    day: 4,
                    title: "Networking Basics",
                    topics: ["OSI & TCP/IP models", "IP addressing & subnetting", "Common protocols (HTTP, DNS, FTP)", "Port numbers"],
                    resources: ["https://www.networklessons.com", "https://packetlife.net"],
                    practice: "Use Wireshark to capture traffic, analyze HTTP requests"
                },
                {
                    day: 5,
                    title: "Python for Security",
                    topics: ["Python basics", "Socket programming", "HTTP requests library", "File operations"],
                    resources: ["https://www.hackingarticles.in/python-for-pentester/", "https://realpython.com"],
                    practice: "Write port scanner, HTTP request script, file parser"
                },
                {
                    day: 6,
                    title: "Command Line Tools",
                    topics: ["Grep, sed, awk", "Curl & wget", "SSH & SCP", "Tmux/Screen"],
                    resources: ["https://explainshell.com", "https://cmdchallenge.com"],
                    practice: "Parse logs with grep/awk, automate downloads, use SSH keys"
                },
                {
                    day: 7,
                    title: "Week 1 Project",
                    topics: ["Build automated recon tool", "GitHub portfolio", "Documentation"],
                    resources: ["Personal project", "README best practices"],
                    practice: "Create tool combining week's learnings, push to GitHub with docs"
                }
            ]
        },
        {
            week: 2,
            theme: "Web Application Security Fundamentals",
            days: [
                {
                    day: 8,
                    title: "HTTP Protocol Deep Dive",
                    topics: ["HTTP methods", "Headers & cookies", "Status codes", "REST APIs"],
                    resources: ["https://developer.mozilla.org/en-US/docs/Web/HTTP", "https://httpbin.org"],
                    practice: "Use Burp Suite to intercept & modify requests"
                },
                {
                    day: 9,
                    title: "XSS (Cross-Site Scripting)",
                    topics: ["Reflected XSS", "Stored XSS", "DOM-based XSS", "XSS prevention"],
                    resources: ["https://portswigger.net/web-security/cross-site-scripting", "https://xss-game.appspot.com"],
                    practice: "Complete XSS challenges on PortSwigger Academy"
                },
                {
                    day: 10,
                    title: "SQL Injection",
                    topics: ["Union-based SQLi", "Blind SQLi", "Time-based SQLi", "SQLMap usage"],
                    resources: ["https://portswigger.net/web-security/sql-injection", "https://www.hacksplaining.com/exercises/sql-injection"],
                    practice: "Exploit SQLi on DVWA, use SQLMap"
                },
                {
                    day: 11,
                    title: "Authentication Attacks",
                    topics: ["Brute force", "Session hijacking", "JWT vulnerabilities", "OAuth flaws"],
                    resources: ["https://owasp.org/www-project-web-security-testing-guide/", "https://jwt.io"],
                    practice: "Crack passwords with Hydra, analyze JWT tokens"
                },
                {
                    day: 12,
                    title: "CSRF & SSRF",
                    topics: ["CSRF tokens", "SSRF exploitation", "Prevention techniques"],
                    resources: ["https://portswigger.net/web-security/csrf", "https://portswigger.net/web-security/ssrf"],
                    practice: "Complete CSRF & SSRF labs"
                },
                {
                    day: 13,
                    title: "File Upload Vulnerabilities",
                    topics: ["Bypassing file type checks", "Path traversal", "Web shells", "Mitigation"],
                    resources: ["https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload"],
                    practice: "Upload web shells, exploit path traversal"
                },
                {
                    day: 14,
                    title: "Week 2 CTF Challenge",
                    topics: ["Web exploitation CTF"],
                    resources: ["https://www.hackthebox.eu", "https://tryhackme.com"],
                    practice: "Complete 3 web-focused CTF challenges"
                }
            ]
        },
        {
            week: 3,
            theme: "Network Security & Reconnaissance",
            days: [
                {
                    day: 15,
                    title: "Information Gathering",
                    topics: ["OSINT techniques", "Google dorking", "Subdomain enumeration", "Metadata analysis"],
                    resources: ["https://osintframework.com", "https://github.com/jivoi/awesome-osint"],
                    practice: "Enumerate company infrastructure, find sensitive data"
                },
                {
                    day: 16,
                    title: "Port Scanning & Service Enumeration",
                    topics: ["Nmap techniques", "Service fingerprinting", "Version detection", "NSE scripts"],
                    resources: ["https://nmap.org/book/", "https://www.stationx.net/nmap-cheat-sheet/"],
                    practice: "Scan 10 targets, write custom NSE script"
                },
                {
                    day: 17,
                    title: "Vulnerability Scanning",
                    topics: ["Nessus/OpenVAS", "Nikto", "CVE databases", "Severity scoring"],
                    resources: ["https://www.tenable.com/products/nessus", "https://cve.mitre.org"],
                    practice: "Scan systems, analyze results, prioritize findings"
                },
                {
                    day: 18,
                    title: "Exploitation Basics",
                    topics: ["Metasploit Framework", "Exploit-DB", "Manual exploitation", "Post-exploitation"],
                    resources: ["https://www.offensive-security.com/metasploit-unleashed/", "https://www.exploit-db.com"],
                    practice: "Exploit vulnerable services, establish shells"
                },
                {
                    day: 19,
                    title: "Wireless Security",
                    topics: ["Wi-Fi protocols", "WPA/WPA2 cracking", "Evil twin attacks", "Aircrack-ng suite"],
                    resources: ["https://www.aircrack-ng.org/doku.php", "https://www.hackingarticles.in/wireless-penetration-testing/"],
                    practice: "Capture handshakes, crack Wi-Fi passwords (lab only)"
                },
                {
                    day: 20,
                    title: "Man-in-the-Middle Attacks",
                    topics: ["ARP spoofing", "SSL stripping", "DNS poisoning", "Ettercap/Bettercap"],
                    resources: ["https://www.bettercap.org/intro/", "https://github.com/bettercap/bettercap"],
                    practice: "Perform MITM in controlled lab environment"
                },
                {
                    day: 21,
                    title: "Week 3 Red Team Exercise",
                    topics: ["Full network penetration test"],
                    resources: ["Custom lab setup"],
                    practice: "Complete reconnaissance to exploitation on practice network"
                }
            ]
        },
        {
            week: 4,
            theme: "Advanced Topics & Real-World Practice",
            days: [
                {
                    day: 22,
                    title: "Active Directory Attacks",
                    topics: ["Kerberoasting", "Pass-the-Hash", "BloodHound", "Domain privilege escalation"],
                    resources: ["https://adsecurity.org", "https://github.com/BloodHoundAD/BloodHound"],
                    practice: "Exploit AD misconfigurations, map domain trust"
                },
                {
                    day: 23,
                    title: "Cloud Security (AWS/Azure)",
                    topics: ["S3 bucket misconfigs", "IAM vulnerabilities", "SSRF to metadata", "Cloud pentesting tools"],
                    resources: ["https://github.com/toniblyx/prowler", "https://cloudsplaining.readthedocs.io"],
                    practice: "Audit cloud infrastructure, find misconfigurations"
                },
                {
                    day: 24,
                    title: "API Security Testing",
                    topics: ["REST API attacks", "GraphQL exploitation", "JWT attacks", "Rate limiting bypass"],
                    resources: ["https://github.com/OWASP/API-Security", "https://apisecurity.io"],
                    practice: "Test APIs with Postman/Burp, exploit vulnerabilities"
                },
                {
                    day: 25,
                    title: "Mobile Security Basics",
                    topics: ["Android app analysis", "SSL pinning bypass", "Frida framework", "Static analysis"],
                    resources: ["https://github.com/OWASP/owasp-mstg", "https://frida.re"],
                    practice: "Decompile APK, bypass security controls"
                },
                {
                    day: 26,
                    title: "Report Writing & Communication",
                    topics: ["Executive summaries", "Technical findings", "Risk ratings", "Remediation advice"],
                    resources: ["https://github.com/hmaverickadams/TCM-Security-Sample-Pentest-Report"],
                    practice: "Write professional pentest report from previous week's work"
                },
                {
                    day: 27,
                    title: "Automation & Tool Development",
                    topics: ["Python automation", "Bash scripting", "Custom exploits", "CI/CD security"],
                    resources: ["https://automatetheboringstuff.com", "GitHub Actions"],
                    practice: "Automate recon pipeline, create custom tool"
                },
                {
                    day: 28,
                    title: "Bug Bounty Hunting",
                    topics: ["Platform selection", "Recon methodology", "Low-hanging fruit", "Submission tips"],
                    resources: ["https://www.bugcrowd.com/hackers/bugcrowd-university/", "https://hackerone.com/resources/"],
                    practice: "Set up bug bounty workflow, start recon on program"
                },
                {
                    day: 29,
                    title: "Certifications & Career Path",
                    topics: ["OSCP overview", "eJPT, CEH, PNPT", "Building portfolio", "Networking in infosec"],
                    resources: ["https://www.offensive-security.com/pwk-oscp/", "InfoSec communities"],
                    practice: "Plan certification path, update LinkedIn/GitHub"
                },
                {
                    day: 30,
                    title: "Capstone Project",
                    topics: ["Full penetration test", "Professional report", "GitHub portfolio update"],
                    resources: ["Personal project compilation"],
                    practice: "Complete end-to-end pentest, document everything, showcase work"
                }
            ]
        }
    ];

    const gitCommands = [
        {
            category: "Repository Setup",
            commands: [
                { cmd: "git init", desc: "Initialize a new Git repository", example: "git init my-project" },
                { cmd: "git clone", desc: "Clone a remote repository", example: "git clone https://github.com/user/repo.git" },
                { cmd: "git config", desc: "Configure Git settings", example: "git config --global user.name \"Your Name\"" }
            ]
        },
        {
            category: "Basic Workflow",
            commands: [
                { cmd: "git status", desc: "Check working directory status", example: "git status" },
                { cmd: "git add", desc: "Stage changes for commit", example: "git add filename.txt / git add ." },
                { cmd: "git commit", desc: "Commit staged changes", example: "git commit -m \"Fix: resolve security vulnerability\"" },
                { cmd: "git push", desc: "Upload local commits to remote", example: "git push origin main" },
                { cmd: "git pull", desc: "Fetch and merge remote changes", example: "git pull origin main" }
            ]
        },
        {
            category: "Branching & Merging",
            commands: [
                { cmd: "git branch", desc: "List, create, or delete branches", example: "git branch feature/new-tool" },
                { cmd: "git checkout", desc: "Switch branches", example: "git checkout -b feature/exploit-dev" },
                { cmd: "git merge", desc: "Merge branches", example: "git merge feature/new-tool" },
                { cmd: "git rebase", desc: "Reapply commits on top of another base", example: "git rebase main" }
            ]
        },
        {
            category: "Advanced Operations",
            commands: [
                { cmd: "git stash", desc: "Temporarily save changes", example: "git stash save \"WIP: scanner feature\"" },
                { cmd: "git log", desc: "View commit history", example: "git log --oneline --graph --all" },
                { cmd: "git reset", desc: "Undo commits", example: "git reset --soft HEAD~1" },
                { cmd: "git cherry-pick", desc: "Apply specific commit to current branch", example: "git cherry-pick abc123" },
                { cmd: "git revert", desc: "Create new commit that undoes changes", example: "git revert HEAD" }
            ]
        },
        {
            category: "Collaboration",
            commands: [
                { cmd: "git remote", desc: "Manage remote repositories", example: "git remote add upstream https://github.com/original/repo.git" },
                { cmd: "git fetch", desc: "Download objects from remote", example: "git fetch origin" },
                { cmd: "git diff", desc: "Show differences between commits", example: "git diff main feature/branch" },
                { cmd: "git blame", desc: "Show who modified each line", example: "git blame filename.py" }
            ]
        }
    ];

    const gitWorkflows = [
        {
            name: "Feature Branch Workflow",
            description: "Ideal for team collaboration and organized development",
            steps: [
                "Create feature branch: git checkout -b feature/new-scanner",
                "Make changes and commit: git add . && git commit -m \"Add port scanner\"",
                "Push to remote: git push origin feature/new-scanner",
                "Create Pull Request on GitHub",
                "Review, approve, and merge to main"
            ]
        },
        {
            name: "GitFlow Workflow",
            description: "Structured workflow for release management",
            steps: [
                "Main branches: main (production) and develop (integration)",
                "Feature branches: Branch from develop",
                "Release branches: Prepare for production release",
                "Hotfix branches: Quick fixes to production",
                "Merge back to both main and develop"
            ]
        },
        {
            name: "Forking Workflow",
            description: "Common in open-source projects",
            steps: [
                "Fork repository to your account",
                "Clone your fork locally",
                "Add upstream remote",
                "Create feature branch and make changes",
                "Push to your fork and create Pull Request to upstream"
            ]
        }
    ];

    const certifications = [
        {
            name: "eJPT (eLearnSecurity Junior Penetration Tester)",
            difficulty: "Beginner",
            cost: "$249",
            duration: "~1-2 months prep",
            topics: ["Network pentesting", "Web app testing", "Basic exploitation"],
            color: "bg-green-600"
        },
        {
            name: "CEH (Certified Ethical Hacker)",
            difficulty: "Intermediate",
            cost: "$1,199",
            duration: "~3-4 months prep",
            topics: ["Broad security topics", "Tools overview", "Ethics"],
            color: "bg-blue-600"
        },
        {
            name: "OSCP (Offensive Security Certified Professional)",
            difficulty: "Advanced",
            cost: "$1,649",
            duration: "~6-12 months prep",
            topics: ["Advanced exploitation", "Privilege escalation", "24-hour exam"],
            color: "bg-red-600"
        },
        {
            name: "PNPT (Practical Network Penetration Tester)",
            difficulty: "Intermediate",
            cost: "$399",
            duration: "~3-4 months prep",
            topics: ["Real-world pentest", "AD attacks", "Report writing"],
            color: "bg-purple-600"
        }
    ];

    const resources = [
        {
            category: "Practice Platforms",
            items: [
                { name: "HackTheBox", url: "https://www.hackthebox.eu", desc: "Realistic vulnerable machines" },
                { name: "TryHackMe", url: "https://tryhackme.com", desc: "Guided learning paths" },
                { name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", desc: "Free web security training" },
                { name: "PentesterLab", url: "https://pentesterlab.com", desc: "Web pentesting exercises" },
                { name: "VulnHub", url: "https://www.vulnhub.com", desc: "Downloadable vulnerable VMs" }
            ]
        },
        {
            category: "Learning Resources",
            items: [
                { name: "OWASP", url: "https://owasp.org", desc: "Web application security" },
                { name: "HackerOne Blog", url: "https://www.hackerone.com/blog", desc: "Bug bounty tips" },
                { name: "Offensive Security Proving Grounds", url: "https://www.offensive-security.com/labs/", desc: "OSCP-like practice" },
                { name: "Cybrary", url: "https://www.cybrary.it", desc: "Free cybersecurity courses" },
                { name: "Hack The Box Academy", url: "https://academy.hackthebox.com", desc: "Structured learning modules" }
            ]
        },
        {
            category: "Communities",
            items: [
                { name: "Reddit /r/netsec", url: "https://reddit.com/r/netsec", desc: "Security news and discussions" },
                { name: "Bugcrowd Discord", url: "https://discord.com/invite/bugcrowd", desc: "Bug bounty community" },
                { name: "The Cyber Mentor Discord", url: "https://discord.gg/tcm", desc: "Learning community" },
                { name: "InfoSec Twitter", url: "https://twitter.com", desc: "Follow @NahamSec, @stokfredrik, @InsiderPhD" },
                { name: "Stack Overflow", url: "https://stackoverflow.com/questions/tagged/security", desc: "Q&A for security" }
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-8 pb-16">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-rose-600 p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                            <GraduationCap className="h-10 w-10" />
                        </div>
                        <div>
                            <h1 className="font-bold text-4xl md:text-5xl">Learning Hub</h1>
                            <p className="text-white/90 mt-2">Your complete roadmap to becoming a cybersecurity professional</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6">
                        <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">30-Day Roadmap</Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">Git Mastery</Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">Career Guidance</Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">Certifications</Badge>
                    </div>
                </div>
            </div>

            {/* Learning Paths */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-red-600" />
                    Choose Your Learning Path
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {learningPaths.map((path) => (
                        <Card key={path.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardHeader>
                                <div className={`p-3 bg-gradient-to-br ${path.color} rounded-lg w-fit mb-3`}>
                                    <path.icon className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle>{path.title}</CardTitle>
                                <CardDescription>{path.duration}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {path.topics.map((topic, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 30-Day Roadmap */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-red-600" />
                        30-Day Intensive Roadmap
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            Progress: {completedDays.length}/30 days
                        </span>
                        <Progress value={(completedDays.length / 30) * 100} className="w-32" />
                    </div>
                </div>

                <Tabs defaultValue="week1" className="space-y-6">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                        {thirtyDayRoadmap.map((week) => (
                            <TabsTrigger key={week.week} value={`week${week.week}`}>
                                Week {week.week}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {thirtyDayRoadmap.map((week) => (
                        <TabsContent key={week.week} value={`week${week.week}`} className="space-y-4">
                            <Card className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border-red-600/20">
                                <CardHeader>
                                    <CardTitle className="text-xl">Week {week.week}: {week.theme}</CardTitle>
                                </CardHeader>
                            </Card>

                            <Accordion type="single" collapsible className="space-y-3">
                                {week.days.map((day) => {
                                    const dayNumber = (week.week - 1) * 7 + day.day - ((week.week - 1) * 7);
                                    const isCompleted = completedDays.includes(dayNumber);

                                    return (
                                        <AccordionItem key={day.day} value={`day-${day.day}`} className="border rounded-lg px-4 bg-card">
                                            <AccordionTrigger className="hover:no-underline">
                                                <div className="flex items-center gap-3 w-full">
                                                    <Button
                                                        size="icon"
                                                        variant={isCompleted ? "default" : "outline"}
                                                        className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDayCompletion(dayNumber);
                                                        }}
                                                    >
                                                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                                    </Button>
                                                    <div className="flex-1 text-left">
                                                        <div className="font-semibold">Day {day.day}: {day.title}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {day.topics.length} topics • {day.resources.length} resources
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-4 space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-red-600" />
                                                        Topics to Learn
                                                    </h4>
                                                    <ul className="space-y-1 ml-6">
                                                        {day.topics.map((topic, idx) => (
                                                            <li key={idx} className="text-sm list-disc">{topic}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-orange-600" />
                                                        Learning Resources
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {day.resources.map((resource, idx) => (
                                                            <li key={idx}>
                                                                <a
                                                                    href={resource}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-red-600 hover:underline flex items-center gap-2"
                                                                >
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    {resource}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                        <Terminal className="h-4 w-4 text-green-600" />
                                                        Hands-on Practice
                                                    </h4>
                                                    <p className="text-sm bg-muted/50 p-3 rounded-lg">{day.practice}</p>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            {/* Git Training Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <GitBranch className="h-6 w-6 text-red-600" />
                    Master Git & Version Control
                </h2>

                <Tabs defaultValue="commands" className="space-y-6">
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
                        <TabsTrigger value="commands">Commands</TabsTrigger>
                        <TabsTrigger value="workflows">Workflows</TabsTrigger>
                        <TabsTrigger value="practice">Practice</TabsTrigger>
                    </TabsList>

                    <TabsContent value="commands" className="space-y-6">
                        {gitCommands.map((category, idx) => (
                            <Card key={idx}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <GitCommit className="h-5 w-5 text-red-600" />
                                        {category.category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {category.commands.map((cmd, cmdIdx) => (
                                            <div key={cmdIdx} className="border-l-2 border-red-600 pl-4">
                                                <div className="font-mono text-sm font-bold text-red-600">{cmd.cmd}</div>
                                                <div className="text-sm text-muted-foreground mt-1">{cmd.desc}</div>
                                                <div className="mt-2 bg-muted/50 p-2 rounded font-mono text-xs">
                                                    $ {cmd.example}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="workflows" className="space-y-4">
                        {gitWorkflows.map((workflow, idx) => (
                            <Card key={idx}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GitMerge className="h-5 w-5 text-red-600" />
                                        {workflow.name}
                                    </CardTitle>
                                    <CardDescription>{workflow.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="space-y-3">
                                        {workflow.steps.map((step, stepIdx) => (
                                            <li key={stepIdx} className="flex gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                                                    {stepIdx + 1}
                                                </div>
                                                <div className="text-sm pt-0.5">{step}</div>
                                            </li>
                                        ))}
                                    </ol>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="practice" className="space-y-4">
                        <Card className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-green-600/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code className="h-5 w-5 text-green-600" />
                                    Git Practice Exercises
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">Exercise 1: First Repository</h4>
                                        <ul className="space-y-1 text-sm ml-4 list-disc">
                                            <li>Create a new directory for a security tool project</li>
                                            <li>Initialize Git repository</li>
                                            <li>Create README.md and add project description</li>
                                            <li>Make your first commit</li>
                                            <li>Create remote repository on GitHub and push</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">Exercise 2: Feature Development</h4>
                                        <ul className="space-y-1 text-sm ml-4 list-disc">
                                            <li>Create feature branch for port scanner module</li>
                                            <li>Implement basic functionality</li>
                                            <li>Make commits with descriptive messages</li>
                                            <li>Switch back to main and create another feature branch</li>
                                            <li>Practice merging branches</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">Exercise 3: Collaboration</h4>
                                        <ul className="space-y-1 text-sm ml-4 list-disc">
                                            <li>Fork popular security tool repository</li>
                                            <li>Clone your fork locally</li>
                                            <li>Add upstream remote</li>
                                            <li>Create feature branch and make improvements</li>
                                            <li>Submit Pull Request to original repository</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">Exercise 4: Conflict Resolution</h4>
                                        <ul className="space-y-1 text-sm ml-4 list-disc">
                                            <li>Create two branches that modify same file</li>
                                            <li>Intentionally create merge conflict</li>
                                            <li>Practice resolving conflicts manually</li>
                                            <li>Complete merge and verify result</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-amber-600/10 border border-amber-600/20 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-amber-600" />
                                        Pro Tips
                                    </h4>
                                    <ul className="space-y-1 text-sm ml-4 list-disc">
                                        <li>Always write clear, descriptive commit messages</li>
                                        <li>Commit early and often - small, focused commits</li>
                                        <li>Use .gitignore to exclude sensitive data and build artifacts</li>
                                        <li>Never commit credentials or API keys</li>
                                        <li>Review changes before committing with 'git diff'</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5 text-red-600" />
                                    Interactive Git Learning
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <a href="https://learngitbranching.js.org" target="_blank" rel="noopener noreferrer" className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="font-semibold text-red-600">Learn Git Branching</div>
                                    <div className="text-sm text-muted-foreground">Visual and interactive way to learn Git</div>
                                </a>
                                <a href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener noreferrer" className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="font-semibold text-red-600">Pro Git Book</div>
                                    <div className="text-sm text-muted-foreground">Comprehensive Git documentation (free online)</div>
                                </a>
                                <a href="https://github.com/git-tips/tips" target="_blank" rel="noopener noreferrer" className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="font-semibold text-red-600">Git Tips Collection</div>
                                    <div className="text-sm text-muted-foreground">Curated list of useful Git tips and tricks</div>
                                </a>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>

            {/* Certifications */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Award className="h-6 w-6 text-red-600" />
                    Cybersecurity Certifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certifications.map((cert, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-all">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                                        <CardDescription>{cert.duration}</CardDescription>
                                    </div>
                                    <Badge className={`${cert.color} text-white`}>{cert.difficulty}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-2xl font-bold text-red-600">
                                    {cert.cost}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold mb-2">Key Topics:</div>
                                    <ul className="space-y-1">
                                        {cert.topics.map((topic, topicIdx) => (
                                            <li key={topicIdx} className="text-sm flex items-center gap-2">
                                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Resources */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Database className="h-6 w-6 text-red-600" />
                    Essential Learning Resources
                </h2>
                <div className="space-y-6">
                    {resources.map((section, idx) => (
                        <Card key={idx}>
                            <CardHeader>
                                <CardTitle className="text-lg">{section.category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.items.map((item, itemIdx) => (
                                        <a
                                            key={itemIdx}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                                        >
                                            <ExternalLink className="h-4 w-4 text-red-600 mt-1 group-hover:translate-x-1 transition-transform" />
                                            <div>
                                                <div className="font-semibold text-sm group-hover:text-red-600 transition-colors">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Interactive Learning Stats */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-600/30 hover:scale-105 transition-transform">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-600 rounded-xl">
                                <Flame className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600">{completedDays.length}</div>
                                <div className="text-sm text-muted-foreground">Days Completed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-600/30 hover:scale-105 transition-transform">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-600 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-orange-600">{Math.round((completedDays.length / 30) * 100)}%</div>
                                <div className="text-sm text-muted-foreground">Progress</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-600/30 hover:scale-105 transition-transform">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-600 rounded-xl">
                                <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-600">{Math.floor(completedDays.length / 7)}</div>
                                <div className="text-sm text-muted-foreground">Weeks Finished</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-600/30 hover:scale-105 transition-transform">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-600 rounded-xl">
                                <Star className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-600">{30 - completedDays.length}</div>
                                <div className="text-sm text-muted-foreground">Days Remaining</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.section>

            {/* Video Tutorials & YouTube Channels */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Youtube className="h-6 w-6 text-red-600" />
                    Top YouTube Channels & Video Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            name: "The Cyber Mentor",
                            subscribers: "500K+",
                            url: "https://www.youtube.com/@TCMSecurityAcademy",
                            desc: "Practical pentesting & ethical hacking tutorials",
                            icon: Shield
                        },
                        {
                            name: "John Hammond",
                            subscribers: "600K+",
                            url: "https://www.youtube.com/@_JohnHammond",
                            desc: "CTF walkthroughs, malware analysis",
                            icon: Target
                        },
                        {
                            name: "IppSec",
                            subscribers: "400K+",
                            url: "https://www.youtube.com/@ippsec",
                            desc: "HackTheBox machine walkthroughs",
                            icon: Terminal
                        },
                        {
                            name: "LiveOverflow",
                            subscribers: "500K+",
                            url: "https://www.youtube.com/@LiveOverflow",
                            desc: "Binary exploitation & reverse engineering",
                            icon: Code
                        },
                        {
                            name: "NetworkChuck",
                            subscribers: "3.5M+",
                            url: "https://www.youtube.com/@NetworkChuck",
                            desc: "Networking & cybersecurity basics",
                            icon: Globe
                        },
                        {
                            name: "HackerSploit",
                            subscribers: "1.2M+",
                            url: "https://www.youtube.com/@HackerSploit",
                            desc: "Penetration testing & Linux security",
                            icon: Lock
                        },
                        {
                            name: "STÖK",
                            subscribers: "300K+",
                            url: "https://www.youtube.com/@STOKfredrik",
                            desc: "Bug bounty hunting & web security",
                            icon: Zap
                        },
                        {
                            name: "Nahamsec",
                            subscribers: "250K+",
                            url: "https://www.youtube.com/@NahamSec",
                            desc: "Bug bounty tips & methodology",
                            icon: Rocket
                        },
                        {
                            name: "PwnFunction",
                            subscribers: "200K+",
                            url: "https://www.youtube.com/@PwnFunction",
                            desc: "Animated security concept explanations",
                            icon: Brain
                        }
                    ].map((channel, idx) => (
                        <motion.a
                            key={idx}
                            href={channel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className="h-full hover:shadow-xl transition-all border-2 hover:border-red-600">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-red-600 rounded-xl group-hover:scale-110 transition-transform">
                                            <channel.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-bold text-lg group-hover:text-red-600 transition-colors">{channel.name}</h3>
                                                <Play className="h-5 w-5 text-red-600" />
                                            </div>
                                            <Badge className="mb-2">{channel.subscribers}</Badge>
                                            <p className="text-sm text-muted-foreground">{channel.desc}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* Podcasts & Audio Learning */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Headphones className="h-6 w-6 text-red-600" />
                    Cybersecurity Podcasts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            name: "Darknet Diaries",
                            host: "Jack Rhysider",
                            url: "https://darknetdiaries.com",
                            desc: "True stories from the dark side of the internet",
                            frequency: "Bi-weekly"
                        },
                        {
                            name: "Malicious Life",
                            host: "Ran Levi",
                            url: "https://malicious.life",
                            desc: "Cybersecurity history and hacking stories",
                            frequency: "Weekly"
                        },
                        {
                            name: "The CyberWire Daily",
                            host: "Dave Bittner",
                            url: "https://thecyberwire.com/podcasts/daily-podcast",
                            desc: "Daily cybersecurity news and analysis",
                            frequency: "Daily"
                        },
                        {
                            name: "Security Now",
                            host: "Steve Gibson",
                            url: "https://twit.tv/shows/security-now",
                            desc: "In-depth security topics and news",
                            frequency: "Weekly"
                        },
                        {
                            name: "Hacking Humans",
                            host: "Joe Carrigan & Dave Bittner",
                            url: "https://thecyberwire.com/podcasts/hacking-humans",
                            desc: "Social engineering and human factors",
                            frequency: "Weekly"
                        },
                        {
                            name: "Risky Business",
                            host: "Patrick Gray",
                            url: "https://risky.biz",
                            desc: "Information security news and analysis",
                            frequency: "Weekly"
                        }
                    ].map((podcast, idx) => (
                        <motion.a
                            key={idx}
                            href={podcast.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ x: 5 }}
                        >
                            <Card className="hover:shadow-lg transition-all hover:border-red-600 border-2">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl">
                                            <Headphones className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-1">{podcast.name}</h3>
                                            <div className="text-sm text-muted-foreground mb-2">by {podcast.host}</div>
                                            <Badge variant="outline" className="mb-2">{podcast.frequency}</Badge>
                                            <p className="text-sm">{podcast.desc}</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-red-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* Books & Reading Materials */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Book className="h-6 w-6 text-red-600" />
                    Must-Read Cybersecurity Books
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: "The Web Application Hacker's Handbook",
                            author: "Dafydd Stuttard & Marcus Pinto",
                            level: "Intermediate",
                            topics: ["Web Security", "SQL Injection", "XSS"],
                            color: "bg-blue-600"
                        },
                        {
                            title: "Penetration Testing: A Hands-On Introduction",
                            author: "Georgia Weidman",
                            level: "Beginner",
                            topics: ["Pentesting", "Metasploit", "Exploitation"],
                            color: "bg-green-600"
                        },
                        {
                            title: "The Hacker Playbook 3",
                            author: "Peter Kim",
                            level: "Intermediate",
                            topics: ["Red Team", "Tactics", "Tools"],
                            color: "bg-purple-600"
                        },
                        {
                            title: "Metasploit: The Penetration Tester's Guide",
                            author: "David Kennedy et al.",
                            level: "Intermediate",
                            topics: ["Metasploit", "Exploitation", "Post-Exploitation"],
                            color: "bg-red-600"
                        },
                        {
                            title: "The Art of Exploitation",
                            author: "Jon Erickson",
                            level: "Advanced",
                            topics: ["C Programming", "Buffer Overflow", "Shellcode"],
                            color: "bg-orange-600"
                        },
                        {
                            title: "RTFM: Red Team Field Manual",
                            author: "Ben Clark",
                            level: "All Levels",
                            topics: ["Quick Reference", "Commands", "Red Team"],
                            color: "bg-rose-600"
                        },
                        {
                            title: "Black Hat Python",
                            author: "Justin Seitz",
                            level: "Intermediate",
                            topics: ["Python", "Tool Development", "Automation"],
                            color: "bg-yellow-600"
                        },
                        {
                            title: "The Shellcoder's Handbook",
                            author: "Chris Anley et al.",
                            level: "Advanced",
                            topics: ["Exploit Development", "Shellcode", "Assembly"],
                            color: "bg-indigo-600"
                        },
                        {
                            title: "Social Engineering: The Art of Human Hacking",
                            author: "Christopher Hadnagy",
                            level: "Beginner",
                            topics: ["Social Engineering", "Psychology", "OSINT"],
                            color: "bg-pink-600"
                        }
                    ].map((book, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-xl transition-all group hover:-translate-y-2">
                                <CardContent className="pt-6 space-y-3">
                                    <div className={`${book.color} text-white p-1 rounded w-fit`}>
                                        <Book className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-red-600 transition-colors">{book.title}</h3>
                                    <div className="text-sm text-muted-foreground">by {book.author}</div>
                                    <Badge className={book.color + " text-white"}>{book.level}</Badge>
                                    <div className="flex flex-wrap gap-1 pt-2">
                                        {book.topics.map((topic, topicIdx) => (
                                            <Badge key={topicIdx} variant="outline" className="text-xs">{topic}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Online Courses & Platforms */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-red-600" />
                    Premium Online Courses & Training
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            platform: "Offensive Security",
                            courses: ["PEN-200 (OSCP)", "WEB-200", "EXP-301"],
                            url: "https://www.offensive-security.com",
                            price: "$999 - $1,649",
                            highlight: "Industry Standard"
                        },
                        {
                            platform: "TCM Security Academy",
                            courses: ["Practical Ethical Hacking", "PNPT Certification", "Linux Privilege Escalation"],
                            url: "https://academy.tcm-sec.com",
                            price: "$30 - $399",
                            highlight: "Best Value"
                        },
                        {
                            platform: "Hack The Box Academy",
                            courses: ["Bug Bounty Hunter", "Penetration Tester", "SOC Analyst"],
                            url: "https://academy.hackthebox.com",
                            price: "$8 - $490/year",
                            highlight: "Hands-on Labs"
                        },
                        {
                            platform: "eLearnSecurity",
                            courses: ["eJPT", "eCPPTv2", "eWPTXv2"],
                            url: "https://elearnsecurity.com",
                            price: "$199 - $799",
                            highlight: "Practical Exams"
                        },
                        {
                            platform: "SANS Cyber Aces",
                            courses: ["Operating Systems", "Networking", "Cybersecurity"],
                            url: "https://www.cyberaces.org",
                            price: "FREE",
                            highlight: "Free Quality Content"
                        },
                        {
                            platform: "Udemy (Selected)",
                            courses: ["Complete Ethical Hacking", "Web Security", "Python for Pentesters"],
                            url: "https://www.udemy.com",
                            price: "$10 - $200",
                            highlight: "Affordable"
                        }
                    ].map((course, idx) => (
                        <motion.a
                            key={idx}
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className="h-full hover:shadow-2xl transition-all border-2 hover:border-red-600">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-xl mb-2">{course.platform}</h3>
                                            <Badge className="bg-red-600 text-white">{course.highlight}</Badge>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg text-red-600">{course.price}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {course.courses.map((c, cidx) => (
                                            <div key={cidx} className="flex items-center gap-2 text-sm">
                                                <Sparkles className="h-3 w-3 text-orange-600" />
                                                {c}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-red-600 font-semibold">
                                        Explore Courses <ChevronRight className="h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* Community & Social Learning */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Users className="h-6 w-6 text-red-600" />
                    Join the Community
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-all hover:border-blue-600 border-2">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="mx-auto w-fit p-4 bg-blue-600 rounded-full">
                                <Linkedin className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg">LinkedIn Groups</h3>
                            <p className="text-sm text-muted-foreground">Connect with professionals, share experiences, find jobs</p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <a href="https://www.linkedin.com/groups" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    Join Groups <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all hover:border-purple-600 border-2">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="mx-auto w-fit p-4 bg-purple-600 rounded-full">
                                <MessageSquare className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg">Discord Servers</h3>
                            <p className="text-sm text-muted-foreground">Real-time chat, CTF teams, learning groups</p>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                <a href="https://discord.gg/infosec" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    Join Discord <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all hover:border-sky-600 border-2">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="mx-auto w-fit p-4 bg-sky-600 rounded-full">
                                <Twitter className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg">InfoSec Twitter</h3>
                            <p className="text-sm text-muted-foreground">Follow experts, latest news, vulnerability disclosures</p>
                            <Button className="w-full bg-sky-600 hover:bg-sky-700">
                                <a href="https://twitter.com/search?q=%23infosec" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    Follow #InfoSec <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Motivation & Tips */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <Card className="bg-gradient-to-br from-red-600 via-orange-600 to-rose-600 text-white border-0">
                    <CardContent className="pt-8 pb-8">
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <Lightbulb className="h-10 w-10" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h2 className="text-3xl font-bold">Pro Tips for Success</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex gap-2">
                                        <Coffee className="h-5 w-5 flex-shrink-0" />
                                        <span>Consistency over intensity - study daily, even 30 minutes</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Brain className="h-5 w-5 flex-shrink-0" />
                                        <span>Build projects to reinforce learning</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Users className="h-5 w-5 flex-shrink-0" />
                                        <span>Join communities, ask questions, help others</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Target className="h-5 w-5 flex-shrink-0" />
                                        <span>Focus on understanding, not just memorizing</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Rocket className="h-5 w-5 flex-shrink-0" />
                                        <span>Document your journey - blog, GitHub, Twitter</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Download className="h-5 w-5 flex-shrink-0" />
                                        <span>Practice on legal platforms only - stay ethical</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.section>
        </div>
    );
};

export default LearningHub;
