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
    const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
    const [streak, setStreak] = useState(0);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);

    const toggleWeekCompletion = (week: number) => {
        setCompletedWeeks(prev =>
            prev.includes(week)
                ? prev.filter(w => w !== week)
                : [...prev, week]
        );
    };

    const totalWeeks = 24; // 6 months = ~24 weeks
    const progressPercentage = Math.round((completedWeeks.length / totalWeeks) * 100);

    const learningPaths = [
        {
            id: "beginner",
            title: "Foundation Phase",
            duration: "Months 1-2",
            icon: GraduationCap,
            color: "from-green-600 to-emerald-600",
            topics: ["Linux Mastery", "Networking Deep Dive", "Python & Bash Scripting", "Git & Development Workflow", "Web Fundamentals"]
        },
        {
            id: "intermediate",
            title: "Practical Skills Phase",
            duration: "Months 3-4",
            icon: Shield,
            color: "from-blue-600 to-cyan-600",
            topics: ["Web Application Security", "Network Penetration Testing", "Active Directory Attacks", "OWASP Top 10 Mastery", "Cloud Security Basics"]
        },
        {
            id: "advanced",
            title: "Advanced & Specialization",
            duration: "Months 5-6",
            icon: Trophy,
            color: "from-red-600 to-orange-600",
            topics: ["Binary Exploitation", "Reverse Engineering", "Advanced Red Teaming", "API Security", "Mobile Security", "Bug Bounty & Real-World Practice"]
        }
    ];

    const sixMonthRoadmap = [
        {
            month: 1,
            title: "Foundation Month: Linux, Networking & Programming",
            theme: "Build Your Technical Foundation",
            weeks: [
                {
                    week: 1,
                    title: "Linux Fundamentals & Shell Mastery",
                    focus: "Operating System Basics",
                    topics: [
                        "Linux file system hierarchy (/etc, /var, /home, /opt)",
                        "Essential commands: navigation, file manipulation, process management",
                        "File permissions and ownership (chmod, chown, sticky bits)",
                        "User and group management",
                        "Package management (apt, yum, dnf)",
                        "System monitoring (top, htop, ps, netstat)"
                    ],
                    resources: [
                        { name: "Linux Journey", url: "https://linuxjourney.com", type: "Interactive Tutorial" },
                        { name: "OverTheWire: Bandit", url: "https://overthewire.org/wargames/bandit/", type: "Hands-on Practice" },
                        { name: "Linux Command Line Basics (Udacity)", url: "https://www.udacity.com/course/linux-command-line-basics", type: "Free Course" },
                        { name: "Linux Survival", url: "https://linuxsurvival.com", type: "Interactive" }
                    ],
                    labs: ["Set up Kali Linux VM", "Complete Bandit Levels 0-15", "Create 10 shell scripts for automation"],
                    certificationPrep: "Linux+ foundational knowledge"
                },
                {
                    week: 2,
                    title: "Advanced Linux & Bash Scripting",
                    focus: "Automation & Scripting",
                    topics: [
                        "Bash scripting fundamentals (variables, loops, conditionals)",
                        "Text processing with grep, sed, awk",
                        "Regular expressions mastery",
                        "Cron jobs and task scheduling",
                        "SSH configuration and key management",
                        "Log analysis techniques"
                    ],
                    resources: [
                        { name: "Bash Scripting Tutorial", url: "https://www.shellscript.sh", type: "Tutorial" },
                        { name: "Explainshell.com", url: "https://explainshell.com", type: "Tool" },
                        { name: "Regex101", url: "https://regex101.com", type: "Practice Tool" },
                        { name: "Command Line Kung Fu", url: "https://blog.commandlinekungfu.com", type: "Blog" }
                    ],
                    labs: ["Build log parser script", "Automate system hardening", "Create backup automation script"],
                    certificationPrep: "Scripting for eJPT"
                },
                {
                    week: 3,
                    title: "Networking Fundamentals - Theory",
                    focus: "Network Protocols & Architecture",
                    topics: [
                        "OSI Model (all 7 layers explained)",
                        "TCP/IP Model and protocol suite",
                        "IP addressing, subnetting, CIDR notation",
                        "Common protocols: HTTP/HTTPS, DNS, FTP, SSH, SMTP",
                        "Port numbers (well-known, registered, dynamic)",
                        "Network topologies and devices (routers, switches, firewalls)"
                    ],
                    resources: [
                        { name: "Professor Messer Network+ Course", url: "https://www.professormesser.com/network-plus/n10-008/n10-008-training-course/", type: "Free Video Course" },
                        { name: "Subnet Calculator", url: "https://www.subnet-calculator.com", type: "Tool" },
                        { name: "Network Lessons", url: "https://networklessons.com", type: "Tutorials" },
                        { name: "Practical Networking", url: "https://www.practicalnetworking.net", type: "Blog/Videos" }
                    ],
                    labs: ["Subnet 10 different networks", "Analyze DNS queries with Wireshark", "Map network topology"],
                    certificationPrep: "Network+ theory"
                },
                {
                    week: 4,
                    title: "Networking Fundamentals - Practice",
                    focus: "Traffic Analysis & Troubleshooting",
                    topics: [
                        "Wireshark mastery (filters, following streams)",
                        "tcpdump for packet capture",
                        "Analyzing HTTP/HTTPS traffic",
                        "Understanding three-way handshake",
                        "Network troubleshooting methodology",
                        "Common network attacks overview"
                    ],
                    resources: [
                        { name: "Wireshark University", url: "https://www.wireshark.org/docs/", type: "Official Docs" },
                        { name: "Malware Traffic Analysis", url: "https://www.malware-traffic-analysis.net", type: "PCAP Analysis Practice" },
                        { name: "PacketLife", url: "https://packetlife.net", type: "Cheat Sheets" },
                        { name: "Chris Greer YouTube", url: "https://www.youtube.com/user/ChrisGreer", type: "Video Tutorials" }
                    ],
                    labs: ["Capture and analyze 100 packets", "Identify malicious traffic patterns", "Complete Wireshark challenges"],
                    certificationPrep: "Network traffic analysis for pentesting"
                }
            ]
        },
        {
            month: 2,
            title: "Programming & Development Workflow",
            theme: "Code Like a Pro",
            weeks: [
                {
                    week: 5,
                    title: "Python for Cybersecurity - Basics",
                    focus: "Programming Fundamentals",
                    topics: [
                        "Python syntax, data types, control structures",
                        "Functions, modules, and packages",
                        "File I/O operations",
                        "Exception handling",
                        "Regular expressions in Python",
                        "Virtual environments and pip"
                    ],
                    resources: [
                        { name: "Python for Everybody", url: "https://www.py4e.com", type: "Free Course" },
                        { name: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com", type: "Free Book" },
                        { name: "Real Python", url: "https://realpython.com", type: "Tutorials" },
                        { name: "Python Crash Course", url: "https://ehmatthes.github.io/pcc/", type: "Book Resources" }
                    ],
                    labs: ["Build CLI tool", "Create file parser", "Automate 5 repetitive tasks"],
                    certificationPrep: "Python scripting for OSCP"
                },
                {
                    week: 6,
                    title: "Python for Security - Advanced",
                    focus: "Security-Focused Programming",
                    topics: [
                        "Socket programming (TCP/UDP)",
                        "HTTP requests with requests library",
                        "BeautifulSoup for web scraping",
                        "Paramiko for SSH automation",
                        "Scapy for packet manipulation",
                        "Multi-threading for scanners"
                    ],
                    resources: [
                        { name: "Black Hat Python", url: "https://nostarch.com/black-hat-python2E", type: "Book" },
                        { name: "Violent Python", url: "https://www.amazon.com/Violent-Python-Cookbook-Penetration-Engineers/dp/1597499579", type: "Book" },
                        { name: "Python for Pentesters", url: "https://www.hackingarticles.in/python-for-pentester/", type: "Tutorial Series" },
                        { name: "Scapy Documentation", url: "https://scapy.readthedocs.io", type: "Docs" }
                    ],
                    labs: ["Build port scanner", "Create HTTP fuzzer", "Develop subdomain enumerator"],
                    certificationPrep: "Custom tool development"
                },
                {
                    week: 7,
                    title: "Git & Version Control Mastery",
                    focus: "Professional Development Workflow",
                    topics: [
                        "Git fundamentals (init, add, commit, push, pull)",
                        "Branching strategies (feature branches, git-flow)",
                        "Merge vs rebase",
                        "Resolving merge conflicts",
                        "GitHub/GitLab workflow",
                        "Pull requests and code review"
                    ],
                    resources: [
                        { name: "Pro Git Book", url: "https://git-scm.com/book/en/v2", type: "Free Book" },
                        { name: "Learn Git Branching", url: "https://learngitbranching.js.org", type: "Interactive" },
                        { name: "GitHub Learning Lab", url: "https://lab.github.com", type: "Hands-on Courses" },
                        { name: "Atlassian Git Tutorials", url: "https://www.atlassian.com/git/tutorials", type: "Tutorials" }
                    ],
                    labs: ["Create GitHub portfolio", "Contribute to open-source project", "Master git workflow"],
                    certificationPrep: "Version control for collaboration"
                },
                {
                    week: 8,
                    title: "Web Development Fundamentals",
                    focus: "Understanding Web Technologies",
                    topics: [
                        "HTML5, CSS3, JavaScript basics",
                        "HTTP protocol deep dive (methods, headers, status codes)",
                        "Cookies, sessions, tokens",
                        "RESTful APIs and JSON",
                        "Browser DevTools mastery",
                        "Same-Origin Policy and CORS"
                    ],
                    resources: [
                        { name: "MDN Web Docs", url: "https://developer.mozilla.org", type: "Documentation" },
                        { name: "freeCodeCamp", url: "https://www.freecodecamp.org", type: "Interactive Course" },
                        { name: "HTTP Protocol Course", url: "https://www.youtube.com/watch?v=iYM2zFP3Zn0", type: "Video" },
                        { name: "The Odin Project", url: "https://www.theodinproject.com", type: "Full Course" }
                    ],
                    labs: ["Build simple web app", "Analyze HTTP traffic", "Understand session management"],
                    certificationPrep: "Web fundamentals for BWAPP/DVWA"
                }
            ]
        },
        {
            month: 3,
            title: "Web Application Security",
            theme: "Master the OWASP Top 10",
            weeks: [
                {
                    week: 9,
                    title: "XSS (Cross-Site Scripting)",
                    focus: "Client-Side Attacks",
                    topics: [
                        "Reflected XSS exploitation",
                        "Stored XSS and persistence",
                        "DOM-based XSS",
                        "XSS filters and bypasses",
                        "Cookie theft and session hijacking",
                        "BeEF Framework for XSS exploitation"
                    ],
                    resources: [
                        { name: "PortSwigger XSS Labs", url: "https://portswigger.net/web-security/cross-site-scripting", type: "Interactive Labs" },
                        { name: "XSS Game", url: "https://xss-game.appspot.com", type: "Practice Game" },
                        { name: "Payload All The Things", url: "https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection", type: "Cheat Sheet" },
                        { name: "OWASP XSS Guide", url: "https://owasp.org/www-community/attacks/xss/", type: "Documentation" }
                    ],
                    labs: ["Complete all PortSwigger XSS labs", "Exploit XSS on DVWA", "Test 10 real applications (with permission)"],
                    certificationPrep: "OWASP Top 10 - A03"
                },
                {
                    week: 10,
                    title: "SQL Injection",
                    focus: "Database Attacks",
                    topics: [
                        "Union-based SQLi",
                        "Boolean-based blind SQLi",
                        "Time-based blind SQLi",
                        "Error-based SQLi",
                        "SQLMap automation",
                        "Manual SQLi techniques"
                    ],
                    resources: [
                        { name: "PortSwigger SQL Injection", url: "https://portswigger.net/web-security/sql-injection", type: "Labs" },
                        { name: "PentesterLab SQLi", url: "https://pentesterlab.com/exercises/from_sqli_to_shell", type: "Practice" },
                        { name: "SQLMap Tutorial", url: "https://github.com/sqlmapproject/sqlmap/wiki/Usage", type: "Tool Guide" },
                        { name: "HackerSploit SQLi", url: "https://www.youtube.com/watch?v=2OPVViV-GQk", type: "Video Series" }
                    ],
                    labs: ["Exploit DVWA SQLi (all levels)", "Use SQLMap on 5 targets", "Write SQL injection cheat sheet"],
                    certificationPrep: "Database exploitation for eWPT"
                },
                {
                    week: 11,
                    title: "Authentication & Session Management",
                    focus: "Access Control Attacks",
                    topics: [
                        "Brute force attacks (Hydra, Burp Intruder)",
                        "Session hijacking and fixation",
                        "JWT vulnerabilities (algorithm confusion, weak secrets)",
                        "OAuth 2.0 misconfigurations",
                        "Password reset flaws",
                        "Multi-factor authentication bypasses"
                    ],
                    resources: [
                        { name: "PortSwigger Authentication Labs", url: "https://portswigger.net/web-security/authentication", type: "Labs" },
                        { name: "JWT.io Debugger", url: "https://jwt.io", type: "Tool" },
                        { name: "OAuth Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheatsheet.html", type: "Reference" },
                        { name: "HackerOne JWT Reports", url: "https://github.com/ticarpi/jwt_tool", type: "Tool & Examples" }
                    ],
                    labs: ["Crack passwords with Hydra", "Exploit JWT vulnerabilities", "Complete auth bypass challenges"],
                    certificationPrep: "OWASP Top 10 - A07"
                },
                {
                    week: 12,
                    title: "CSRF, SSRF, XXE & File Upload",
                    focus: "Advanced Web Attacks",
                    topics: [
                        "CSRF token bypasses",
                        "SSRF to internal network access",
                        "XXE (XML External Entity) attacks",
                        "File upload filter bypasses",
                        "Path traversal exploitation",
                        "Remote Code Execution via file upload"
                    ],
                    resources: [
                        { name: "PortSwigger SSRF Labs", url: "https://portswigger.net/web-security/ssrf", type: "Labs" },
                        { name: "File Upload Attacks", url: "https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload", type: "Guide" },
                        { name: "XXE Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html", type: "Reference" },
                        { name: "HackTricks Web Attacks", url: "https://book.hacktricks.xyz/pentesting-web/", type: "Comprehensive Guide" }
                    ],
                    labs: ["Complete SSRF & XXE labs", "Upload web shells", "Exploit file inclusion vulnerabilities"],
                    certificationPrep: "Web pentesting methodology"
                }
            ]
        },
        {
            month: 4,
            title: "Network Penetration Testing",
            theme: "From Reconnaissance to Exploitation",
            weeks: [
                {
                    week: 13,
                    title: "Information Gathering & OSINT",
                    focus: "Reconnaissance Phase",
                    topics: [
                        "Passive reconnaissance techniques",
                        "Google dorking mastery",
                        "Subdomain enumeration (subfinder, assetfinder, amass)",
                        "WHOIS, DNS, and email harvesting",
                        "Social media intelligence (LinkedIn, GitHub)",
                        "Shodan and Censys for internet-wide scanning"
                    ],
                    resources: [
                        { name: "OSINT Framework", url: "https://osintframework.com", type: "Tool Collection" },
                        { name: "IntelTechniques", url: "https://inteltechniques.com/menu.html", type: "OSINT Tools" },
                        { name: "OSINT Dojo", url: "https://www.osintdojo.com/resources/", type: "Learning Resources" },
                        { name: "Awesome OSINT", url: "https://github.com/jivoi/awesome-osint", type: "GitHub Repository" }
                    ],
                    labs: ["Enumerate company infrastructure", "Create OSINT report", "Build reconnaissance automation script"],
                    certificationPrep: "Recon for OSCP & PNPT"
                },
                {
                    week: 14,
                    title: "Scanning & Enumeration",
                    focus: "Active Reconnaissance",
                    topics: [
                        "Nmap mastery (timing, scripts, output)",
                        "Service version detection",
                        "NSE script development",
                        "Vulnerability scanning (Nessus, OpenVAS)",
                        "SMB enumeration (enum4linux, smbclient)",
                        "SNMP enumeration"
                    ],
                    resources: [
                        { name: "Nmap Official Guide", url: "https://nmap.org/book/", type: "Book" },
                        { name: "Nmap NSE Scripts", url: "https://nmap.org/nsedoc/", type: "Documentation" },
                        { name: "Hack The Box Machines", url: "https://www.hackthebox.com", type: "Practice" },
                        { name: "Nmap Cheat Sheet", url: "https://www.stationx.net/nmap-cheat-sheet/", type: "Reference" }
                    ],
                    labs: ["Scan 20 HTB machines", "Write custom NSE script", "Create scanning methodology"],
                    certificationPrep: "Enumeration for OSCP"
                },
                {
                    week: 15,
                    title: "Exploitation Fundamentals",
                    focus: "Getting Initial Access",
                    topics: [
                        "Metasploit Framework mastery",
                        "Exploit-DB and CVE research",
                        "Manual exploitation techniques",
                        "Reverse shells (netcat, bash, Python)",
                        "Bind shells vs reverse shells",
                        "Stabilizing shells"
                    ],
                    resources: [
                        { name: "Metasploit Unleashed", url: "https://www.offensive-security.com/metasploit-unleashed/", type: "Free Course" },
                        { name: "Exploit Database", url: "https://www.exploit-db.com", type: "Exploit Repository" },
                        { name: "GTFOBins", url: "https://gtfobins.github.io", type: "Unix Binaries" },
                        { name: "PayloadsAllTheThings", url: "https://github.com/swisskyrepo/PayloadsAllTheThings", type: "Cheat Sheet" }
                    ],
                    labs: ["Exploit 10 vulnerable services", "Practice different shell types", "Complete Metasploitable"],
                    certificationPrep: "Exploitation for eJPT"
                },
                {
                    week: 16,
                    title: "Post-Exploitation & Privilege Escalation",
                    focus: "Maintaining Access & Escalating",
                    topics: [
                        "Linux privilege escalation (SUID, sudo, kernel exploits)",
                        "Windows privilege escalation (services, registry, tokens)",
                        "Lateral movement techniques",
                        "Credential harvesting (mimikatz, hashdump)",
                        "Persistence mechanisms",
                        "Pivoting and tunneling (chisel, proxychains)"
                    ],
                    resources: [
                        { name: "Linux PrivEsc", url: "https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Linux%20-%20Privilege%20Escalation.md", type: "Cheat Sheet" },
                        { name: "Windows PrivEsc", url: "https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Windows%20-%20Privilege%20Escalation.md", type: "Cheat Sheet" },
                        { name: "TryHackMe Priv Esc Rooms", url: "https://tryhackme.com", type: "Practice Rooms" },
                        { name: "HackTricks", url: "https://book.hacktricks.xyz", type: "Comprehensive Guide" }
                    ],
                    labs: ["Root 15 machines on HTB/THM", "Practice all PrivEsc vectors", "Build PrivEsc checklist"],
                    certificationPrep: "PrivEsc for OSCP (critical skill)"
                }
            ]
        },
        {
            month: 5,
            title: "Advanced Topics & Specializations",
            theme: "Deep Dive into Complex Attacks",
            weeks: [
                {
                    week: 17,
                    title: "Active Directory Exploitation",
                    focus: "Enterprise Network Attacks",
                    topics: [
                        "AD enumeration (BloodHound, PowerView)",
                        "Kerberoasting",
                        "AS-REP Roasting",
                        "Pass-the-Hash & Pass-the-Ticket",
                        "Domain privilege escalation",
                        "DCSync attack and Golden Ticket"
                    ],
                    resources: [
                        { name: "AD Security Blog", url: "https://adsecurity.org", type: "Blog" },
                        { name: "BloodHound Documentation", url: "https://bloodhound.readthedocs.io", type: "Tool Guide" },
                        { name: "TryHackMe AD Rooms", url: "https://tryhackme.com/room/attacktivedirectory", type: "Practice" },
                        { name: "PentestPartners AD Guide", url: "https://www.pentestpartners.com/security-blog/", type: "Blog" }
                    ],
                    labs: ["Set up AD lab", "Complete THM AD pathway", "Exploit 5 AD misconfigurations"],
                    certificationPrep: "AD attacks for PNPT & CRTP"
                },
                {
                    week: 18,
                    title: "Cloud Security (AWS/Azure/GCP)",
                    focus: "Cloud Penetration Testing",
                    topics: [
                        "Cloud misconfigurations (S3 buckets, IAM)",
                        "SSRF to cloud metadata service",
                        "AWS enumeration (Prowler, ScoutSuite)",
                        "Azure AD exploitation",
                        "Container security basics",
                        "Serverless security considerations"
                    ],
                    resources: [
                        { name: "Hacking The Cloud", url: "https://hackingthe.cloud", type: "Knowledge Base" },
                        { name: "CloudGoat", url: "https://github.com/RhinoSecurityLabs/cloudgoat", type: "Vulnerable Cloud Environment" },
                        { name: "Prowler Tool", url: "https://github.com/prowler-cloud/prowler", type: "AWS Security Assessment" },
                        { name: "Kubernetes Goat", url: "https://github.com/madhuakula/kubernetes-goat", type: "K8s Practice" }
                    ],
                    labs: ["Audit AWS account with Prowler", "Exploit S3 misconfigurations", "Complete CloudGoat scenarios"],
                    certificationPrep: "Cloud security awareness"
                },
                {
                    week: 19,
                    title: "API Security Testing",
                    focus: "Modern Application Architecture",
                    topics: [
                        "REST API testing methodology",
                        "GraphQL vulnerabilities",
                        "API authentication attacks",
                        "BOLA/IDOR in APIs",
                        "Mass assignment vulnerabilities",
                        "API rate limiting bypasses"
                    ],
                    resources: [
                        { name: "OWASP API Security Top 10", url: "https://owasp.org/www-project-api-security/", type: "Standard" },
                        { name: "API Security University", url: "https://university.apisec.ai", type: "Free Courses" },
                        { name: "Damn Vulnerable GraphQL", url: "https://github.com/dolevf/Damn-Vulnerable-GraphQL-Application", type: "Practice" },
                        { name: "API Security Tools", url: "https://github.com/arainho/awesome-api-security", type: "Tool Collection" }
                    ],
                    labs: ["Test 10 public APIs", "Exploit GraphQL", "Build API security testing methodology"],
                    certificationPrep: "Modern app security"
                },
                {
                    week: 20,
                    title: "Wireless Security & IoT",
                    focus: "Physical Layer Attacks",
                    topics: [
                        "Wi-Fi protocols (WPA2, WPA3)",
                        "Handshake capture and cracking",
                        "Evil twin and rogue AP attacks",
                        "Bluetooth attacks",
                        "IoT device exploitation",
                        "SDR (Software Defined Radio) basics"
                    ],
                    resources: [
                        { name: "Aircrack-ng Tutorial", url: "https://www.aircrack-ng.org/doku.php", type: "Documentation" },
                        { name: "WiFi Pineapple", url: "https://shop.hak5.org/products/wifi-pineapple", type: "Hardware Platform" },
                        { name: "IoT Security 101", url: "https://github.com/V33RU/IoTSecurity101", type: "Guide" },
                        { name: "RTL-SDR Blog", url: "https://www.rtl-sdr.com", type: "Blog" }
                    ],
                    labs: ["Crack WPA2 handshake (lab only)", "Perform evil twin attack", "Analyze IoT device"],
                    certificationPrep: "Wireless security for specialized roles"
                }
            ]
        },
        {
            month: 6,
            title: "Real-World Practice & Career Development",
            theme: "Apply Your Skills & Build Your Career",
            weeks: [
                {
                    week: 21,
                    title: "Bug Bounty Hunting",
                    focus: "Real-World Vulnerabilities",
                    topics: [
                        "Choosing bug bounty programs",
                        "Advanced reconnaissance for bug bounties",
                        "Low-hanging fruit strategies",
                        "Report writing for bug bounties",
                        "Automation for scalability",
                        "Building reputation and networking"
                    ],
                    resources: [
                        { name: "Bug Bounty Bootcamp Book", url: "https://nostarch.com/bug-bounty-bootcamp", type: "Book" },
                        { name: "HackerOne Hacktivity", url: "https://hackerone.com/hacktivity", type: "Public Reports" },
                        { name: "Bugcrowd University", url: "https://www.bugcrowd.com/hackers/bugcrowd-university/", type: "Free Courses" },
                        { name: "Jason Haddix's Methodology", url: "https://www.youtube.com/watch?v=p4JgIu1mceI", type: "Video" }
                    ],
                    labs: ["Choose 5 programs", "Do recon for 1 week", "Submit first reports"],
                    certificationPrep: "Real-world application of skills"
                },
                {
                    week: 22,
                    title: "CTF Competitions & Practice",
                    focus: "Competitive Hacking",
                    topics: [
                        "CTF categories (web, crypto, forensics, pwn)",
                        "CTF tools and frameworks",
                        "Team collaboration",
                        "Time management in CTFs",
                        "Write-up creation",
                        "CTF platform navigation"
                    ],
                    resources: [
                        { name: "CTFtime", url: "https://ctftime.org", type: "Competition Calendar" },
                        { name: "PicoCTF", url: "https://picoctf.org", type: "Beginner CTF" },
                        { name: "OverTheWire", url: "https://overthewire.org", type: "Wargames" },
                        { name: "CTF Field Guide", url: "https://trailofbits.github.io/ctf/", type: "Guide" }
                    ],
                    labs: ["Participate in 2 CTFs", "Complete 50 challenges", "Write 5 CTF write-ups"],
                    certificationPrep: "Skill validation"
                },
                {
                    week: 23,
                    title: "Professional Skills & Certification Prep",
                    focus: "Career Preparation",
                    topics: [
                        "Penetration testing report writing",
                        "Executive vs technical communication",
                        "Risk assessment and CVSS scoring",
                        "Certification roadmap (eJPT → OSCP)",
                        "Building portfolio and resume",
                        "LinkedIn and networking strategies"
                    ],
                    resources: [
                        { name: "TCM Security Report", url: "https://github.com/hmaverickadams/TCM-Security-Sample-Pentest-Report", type: "Sample Report" },
                        { name: "OSCP Certification Guide", url: "https://www.offensive-security.com/pwk-oscp/", type: "Official Info" },
                        { name: "Cybersecurity Resume Guide", url: "https://www.cybersecurityeducation.org/careers/resume/", type: "Guide" },
                        { name: "InfoSec Prep Discord", url: "https://discord.gg/infosec", type: "Community" }
                    ],
                    labs: ["Write 3 professional reports", "Update all profiles", "Plan certification path"],
                    certificationPrep: "Career planning"
                },
                {
                    week: 24,
                    title: "Capstone Project & Portfolio",
                    focus: "Showcase Your Skills",
                    topics: [
                        "Capstone penetration test project",
                        "Comprehensive documentation",
                        "GitHub portfolio creation",
                        "Blog/YouTube channel setup",
                        "Contributing to open-source security tools",
                        "Continuous learning plan"
                    ],
                    resources: [
                        { name: "GitHub Profile README", url: "https://github.com/abhisheknaiidu/awesome-github-profile-readme", type: "Examples" },
                        { name: "Jekyll for Blogging", url: "https://jekyllrb.com", type: "Static Site Generator" },
                        { name: "Awesome Security", url: "https://github.com/sbilly/awesome-security", type: "Open Source Projects" },
                        { name: "InfoSec Career Roadmap", url: "https://pauljerimy.com/security-certification-roadmap/", type: "Certification Path" }
                    ],
                    labs: ["Complete capstone project", "Launch portfolio site", "Share first blog post/video"],
                    certificationPrep: "Job application readiness"
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
                        <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">6-Month Professional Roadmap</Badge>
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

            {/* 6-Month Roadmap */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-red-600" />
                        6-Month Professional Roadmap
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            Progress: {completedWeeks.length}/{totalWeeks} weeks
                        </span>
                        <Progress value={progressPercentage} className="w-32" />
                    </div>
                </div>

                <Tabs defaultValue="month1" className="space-y-6">
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
                        {sixMonthRoadmap.map((monthData) => (
                            <TabsTrigger key={monthData.month} value={`month${monthData.month}`}>
                                Month {monthData.month}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {sixMonthRoadmap.map((monthData) => (
                        <TabsContent key={monthData.month} value={`month${monthData.month}`} className="space-y-4">
                            <Card className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border-red-600/20">
                                <CardHeader>
                                    <div className="space-y-2">
                                        <CardTitle className="text-2xl">Month {monthData.month}: {monthData.title}</CardTitle>
                                        <p className="text-muted-foreground italic">🎯 {monthData.theme}</p>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Accordion type="single" collapsible className="space-y-3">
                                {monthData.weeks.map((weekData) => {
                                    const isCompleted = completedWeeks.includes(weekData.week);

                                    return (
                                        <AccordionItem key={weekData.week} value={`week-${weekData.week}`} className="border rounded-lg px-4 bg-card">
                                            <AccordionTrigger className="hover:no-underline">
                                                <div className="flex items-center gap-3 w-full">
                                                    <Button
                                                        size="icon"
                                                        variant={isCompleted ? "default" : "outline"}
                                                        className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleWeekCompletion(weekData.week);
                                                        }}
                                                    >
                                                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                                    </Button>
                                                    <div className="flex-1 text-left">
                                                        <div className="font-semibold">Week {weekData.week}: {weekData.title}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {weekData.focus} • {weekData.topics.length} topics
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-4 space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-red-600" />
                                                        Topics to Master
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {weekData.topics.map((topic, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                                {topic}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-orange-600" />
                                                        Learning Resources
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {weekData.resources.map((resource, idx) => (
                                                            <li key={idx} className="bg-muted/30 p-3 rounded-lg">
                                                                <a
                                                                    href={resource.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-red-600 hover:underline flex items-center gap-2 font-medium"
                                                                >
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    {resource.name}
                                                                </a>
                                                                <p className="text-xs text-muted-foreground mt-1">{resource.type}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                        <Terminal className="h-4 w-4 text-green-600" />
                                                        Hands-on Labs
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {weekData.labs.map((lab, idx) => (
                                                            <li key={idx} className="text-sm bg-green-600/10 border-l-2 border-green-600 p-3 rounded">
                                                                ⚡ {lab}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-blue-600/10 border border-blue-600/20 p-3 rounded-lg">
                                                    <p className="text-sm text-blue-600 font-medium">
                                                        📚 Certification Prep: {weekData.certificationPrep}
                                                    </p>
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
                                <div className="text-3xl font-bold text-green-600">{completedWeeks.length}</div>
                                <div className="text-sm text-muted-foreground">Weeks Completed</div>
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
                                <div className="text-3xl font-bold text-orange-600">{progressPercentage}%</div>
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
                                <div className="text-3xl font-bold text-purple-600">{Math.floor(completedWeeks.length / 4)}</div>
                                <div className="text-sm text-muted-foreground">Months Finished</div>
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
                                <div className="text-3xl font-bold text-blue-600">{totalWeeks - completedWeeks.length}</div>
                                <div className="text-sm text-muted-foreground">Weeks Remaining</div>
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
