"""
Learning Path Data - Structured curriculum
"""

from app.models.learning_path import LearningPath, PathModule

LEARNING_PATHS = [
    LearningPath(
        id="beginner-cybersecurity",
        name="Beginner Cybersecurity Fundamentals",
        level="beginner",
        description="Start your penetration testing journey with essential tools and concepts",
        icon="🎓",
        color="#4CAF50",
        estimated_total_hours=40,
        prerequisites=[],
        completion_percentage_required=80,
        skills_gained=[
            "Network scanning basics",
            "Traffic analysis",
            "Information gathering",
            "Basic web vulnerabilities",
            "SQL injection fundamentals"
        ],
        certificate_awarded="Beginner Cybersecurity Certificate",
        modules=[
            PathModule(
                id="nmap-basics",
                title="Network Scanning with Nmap",
                description="Learn to discover hosts, scan ports, and detect services",
                estimated_hours=8,
                topics=[
                    "Host discovery techniques",
                    "Port scanning methods",
                    "Service version detection",
                    "OS fingerprinting",
                    "NSE scripting basics"
                ],
                resources=[
                    "/docs/nmap",
                    "/tools/nmap"
                ],
                quiz_id="nmap_basics_quiz",
                challenge_id="nmap_scan_challenge",
                order=1
            ),
            PathModule(
                id="wireshark-fundamentals",
                title="Network Traffic Analysis with Wireshark",
                description="Capture and analyze network packets",
                estimated_hours=8,
                topics=[
                    "Packet capture basics",
                    "Protocol analysis (TCP/IP, HTTP, DNS)",
                    "Display filters",
                    "Following streams",
                    "Detecting suspicious traffic"
                ],
                resources=[
                    "/docs/wireshark",
                    "/tools/wireshark"
                ],
                quiz_id="wireshark_quiz",
                challenge_id="packet_analysis_challenge",
                order=2
            ),
            PathModule(
                id="google-dorking",
                title="OSINT & Google Dorking",
                description="Advanced search techniques for information gathering",
                estimated_hours=6,
                topics=[
                    "Google search operators",
                    "Finding exposed files",
                    "Discovering subdomains",
                    "Email harvesting",
                    "Metadata extraction"
                ],
                resources=[
                    "/docs/osint",
                    "/tools/google-dorking"
                ],
                quiz_id="osint_quiz",
                challenge_id="dorking_challenge",
                order=3
            ),
            PathModule(
                id="basic-sqli",
                title="SQL Injection Basics",
                description="Understand and exploit SQL injection vulnerabilities",
                estimated_hours=10,
                topics=[
                    "What is SQL injection",
                    "Error-based SQLi",
                    "Union-based SQLi",
                    "Blind SQL injection",
                    "SQLi prevention"
                ],
                resources=[
                    "/docs/sql-injection",
                    "/labs/sqli",
                    "/tools/sqlmap"
                ],
                quiz_id="sqli_basics_quiz",
                challenge_id="sqli_basic_challenge",
                order=4
            ),
            PathModule(
                id="basic-xss",
                title="Cross-Site Scripting (XSS) Fundamentals",
                description="Learn to find and exploit XSS vulnerabilities",
                estimated_hours=8,
                topics=[
                    "Reflected XSS",
                    "Stored XSS",
                    "DOM-based XSS",
                    "XSS payloads",
                    "XSS prevention"
                ],
                resources=[
                    "/docs/xss",
                    "/labs/xss",
                    "/tools/xss-tester"
                ],
                quiz_id="xss_basics_quiz",
                challenge_id="xss_basic_challenge",
                order=5
            )
        ]
    ),
    
    LearningPath(
        id="intermediate-pentesting",
        name="Intermediate Penetration Testing",
        level="intermediate",
        description="Master advanced tools and exploitation techniques",
        icon="🔧",
        color="#FF9800",
        estimated_total_hours=60,
        prerequisites=["beginner-cybersecurity"],
        completion_percentage_required=80,
        skills_gained=[
            "Web application testing",
            "Advanced SQLi exploitation",
            "Post-exploitation",
            "JWT vulnerabilities",
            "API security testing"
        ],
        certificate_awarded="Intermediate Penetration Testing Certificate",
        modules=[
            PathModule(
                id="burp-suite-mastery",
                title="Burp Suite Professional",
                description="Master the #1 web application security testing tool",
                estimated_hours=12,
                topics=[
                    "Proxy configuration",
                    "Intruder attacks",
                    "Repeater usage",
                    "Scanner automation",
                    "Extensions & plugins"
                ],
                resources=[
                    "/docs/burp-suite",
                    "/tools/burp-suite"
                ],
                quiz_id="burp_suite_quiz",
                challenge_id="burp_suite_challenge",
                order=1
            ),
            PathModule(
                id="sqlmap-advanced",
                title="Advanced SQLMap Exploitation",
                description="Automate SQL injection with SQLMap",
                estimated_hours=10,
                topics=[
                    "Automatic detection",
                    "Database enumeration",
                    "File system access",
                    "OS command execution",
                    "WAF bypass techniques"
                ],
                resources=[
                    "/docs/sqlmap",
                    "/tools/sqlmap",
                    "/labs/sqli"
                ],
                quiz_id="sqlmap_quiz",
                challenge_id="sqlmap_challenge",
                order=2
            ),
            PathModule(
                id="metasploit-framework",
                title="Metasploit Framework",
                description="Exploitation and post-exploitation with Metasploit",
                estimated_hours=15,
                topics=[
                    "MSFconsole basics",
                    "Exploit modules",
                    "Payload generation",
                    "Meterpreter sessions",
                    "Post-exploitation modules"
                ],
                resources=[
                    "/docs/metasploit",
                    "/tools/metasploit"
                ],
                quiz_id="metasploit_quiz",
                challenge_id="metasploit_challenge",
                order=3
            ),
            PathModule(
                id="jwt-attacks",
                title="JWT Security & Attacks",
                description="Exploit JSON Web Token vulnerabilities",
                estimated_hours=8,
                topics=[
                    "JWT structure",
                    "Algorithm confusion attacks",
                    "Weak secret keys",
                    "None algorithm bypass",
                    "JWT best practices"
                ],
                resources=[
                    "/docs/jwt",
                    "/labs/jwt",
                    "/tools/jwt-decoder"
                ],
                quiz_id="jwt_quiz",
                challenge_id="jwt_challenge",
                order=4
            ),
            PathModule(
                id="api-security",
                title="API Security Testing",
                description="Test REST and GraphQL APIs for vulnerabilities",
                estimated_hours=10,
                topics=[
                    "API enumeration",
                    "Authentication bypass",
                    "IDOR vulnerabilities",
                    "Rate limiting bypass",
                    "GraphQL injection"
                ],
                resources=[
                    "/docs/api-security",
                    "/tools/api-tester"
                ],
                quiz_id="api_security_quiz",
                challenge_id="api_challenge",
                order=5
            ),
            PathModule(
                id="command-injection",
                title="Command Injection & RCE",
                description="Remote code execution techniques",
                estimated_hours=5,
                topics=[
                    "OS command injection",
                    "Filter bypass techniques",
                    "Blind command injection",
                    "RCE exploitation",
                    "Reverse shells"
                ],
                resources=[
                    "/docs/command-injection",
                    "/labs/command-injection"
                ],
                quiz_id="command_injection_quiz",
                challenge_id="rce_challenge",
                order=6
            )
        ]
    ),
    
    LearningPath(
        id="advanced-exploitation",
        name="Advanced Exploitation & Research",
        level="advanced",
        description="Cutting-edge exploitation techniques and vulnerability research",
        icon="🚀",
        color="#F44336",
        estimated_total_hours=80,
        prerequisites=["intermediate-pentesting"],
        completion_percentage_required=80,
        skills_gained=[
            "Binary exploitation",
            "Reverse engineering",
            "Custom exploit development",
            "Zero-day research",
            "Advanced post-exploitation"
        ],
        certificate_awarded="Advanced Cybersecurity Expert Certificate",
        modules=[
            PathModule(
                id="buffer-overflow",
                title="Buffer Overflow Exploitation",
                description="Master stack-based buffer overflows",
                estimated_hours=15,
                topics=[
                    "Stack structure",
                    "EIP control",
                    "Shellcode development",
                    "Bad character analysis",
                    "ASLR & DEP bypass"
                ],
                resources=[
                    "/docs/buffer-overflow",
                    "/labs/buffer-overflow"
                ],
                quiz_id="buffer_overflow_quiz",
                challenge_id="buffer_overflow_challenge",
                order=1
            ),
            PathModule(
                id="reverse-engineering",
                title="Reverse Engineering",
                description="Analyze and understand binaries",
                estimated_hours=20,
                topics=[
                    "Assembly language basics",
                    "IDA Pro / Ghidra",
                    "Debugger usage (GDB, OllyDbg)",
                    "Malware analysis",
                    "Patching binaries"
                ],
                resources=[
                    "/docs/reverse-engineering",
                    "/tools/ghidra"
                ],
                quiz_id="reverse_engineering_quiz",
                challenge_id="reverse_engineering_challenge",
                order=2
            ),
            PathModule(
                id="exploit-development",
                title="Custom Exploit Development",
                description="Write exploits from scratch",
                estimated_hours=20,
                topics=[
                    "Vulnerability analysis",
                    "Exploit proof-of-concept",
                    "Metasploit module creation",
                    "Fuzzing techniques",
                    "Exploit reliability"
                ],
                resources=[
                    "/docs/exploit-dev",
                    "/labs/exploit-dev"
                ],
                quiz_id="exploit_dev_quiz",
                challenge_id="exploit_dev_challenge",
                order=3
            ),
            PathModule(
                id="kernel-exploitation",
                title="Kernel Exploitation",
                description="Advanced privilege escalation",
                estimated_hours=15,
                topics=[
                    "Kernel architecture",
                    "Kernel debugging",
                    "Use-after-free",
                    "Privilege escalation",
                    "Kernel exploit mitigation"
                ],
                resources=[
                    "/docs/kernel-exploitation"
                ],
                quiz_id="kernel_exploitation_quiz",
                challenge_id="kernel_challenge",
                order=4
            ),
            PathModule(
                id="zero-day-research",
                title="Zero-Day Vulnerability Research",
                description="Discover and responsibly disclose vulnerabilities",
                estimated_hours=10,
                topics=[
                    "Bug hunting methodology",
                    "Fuzzing automation",
                    "Code auditing",
                    "Responsible disclosure",
                    "Bug bounty programs"
                ],
                resources=[
                    "/docs/bug-hunting",
                    "/docs/responsible-disclosure"
                ],
                quiz_id="zero_day_quiz",
                order=5
            )
        ]
    )
]


def get_all_paths():
    """Get all learning paths"""
    return LEARNING_PATHS


def get_path_by_id(path_id: str):
    """Get specific learning path by ID"""
    for path in LEARNING_PATHS:
        if path.id == path_id:
            return path
    return None


def get_paths_by_level(level: str):
    """Get paths filtered by level"""
    return [path for path in LEARNING_PATHS if path.level == level]
