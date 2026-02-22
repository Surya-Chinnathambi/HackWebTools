"""
Practice Labs Data
Complete lab definitions with challenges, flags, and learning objectives
"""
from app.models.lab import Lab, LabChallenge, LabType, LabDifficulty


# SQL Injection Lab
SQL_INJECTION_LAB = Lab(
    lab_id="sql-injection-basics",
    lab_type=LabType.SQL_INJECTION,
    title="SQL Injection: Authentication Bypass",
    description="Learn SQL injection by exploiting a vulnerable login system. Master authentication bypass, union-based attacks, and data extraction.",
    difficulty=LabDifficulty.BEGINNER,
    estimated_time=30,
    learning_objectives=[
        "Understand SQL injection vulnerabilities",
        "Bypass authentication using SQL injection",
        "Extract data using UNION SELECT",
        "Identify and exploit blind SQL injection",
        "Learn SQL injection prevention techniques"
    ],
    challenges=[
        LabChallenge(
            challenge_id="sqli-auth-bypass",
            title="Authentication Bypass",
            description="Use SQL injection to login as admin without knowing the password",
            flag="FLAG{sql_auth_bypass_success}",
            points=10,
            hints=[
                "Try using a single quote (') to break the SQL query",
                "SQL comments (--) can ignore the rest of the query",
                "The payload admin' OR '1'='1'-- works in the password field"
            ]
        ),
        LabChallenge(
            challenge_id="sqli-data-extraction",
            title="Data Extraction",
            description="Use UNION SELECT to extract hidden data from the database",
            flag="FLAG{union_select_master}",
            points=15,
            hints=[
                "UNION SELECT requires matching column count",
                "Use ORDER BY to determine column count",
                "Payload: ' UNION SELECT username,password,flag FROM secrets--"
            ]
        ),
        LabChallenge(
            challenge_id="sqli-blind",
            title="Blind SQL Injection",
            description="Extract data character by character using boolean-based blind SQLi",
            flag="FLAG{blind_sqli_ninja}",
            points=20,
            hints=[
                "Use SUBSTRING() to extract one character at a time",
                "Boolean conditions can leak information",
                "Payload: admin' AND SUBSTRING(password,1,1)='a'--"
            ]
        )
    ],
    total_points=45,
    resources=[
        "OWASP SQL Injection Guide",
        "PortSwigger SQL Injection Labs",
        "SQLMap Documentation"
    ]
)


# XSS Lab
XSS_LAB = Lab(
    lab_id="xss-playground",
    lab_type=LabType.XSS,
    title="Cross-Site Scripting (XSS) Playground",
    description="Master reflected, stored, and DOM-based XSS attacks. Learn to bypass filters and exploit real-world scenarios.",
    difficulty=LabDifficulty.BEGINNER,
    estimated_time=45,
    learning_objectives=[
        "Identify different types of XSS vulnerabilities",
        "Craft effective XSS payloads",
        "Bypass XSS filters and sanitization",
        "Understand DOM-based XSS exploitation",
        "Learn XSS prevention with CSP and encoding"
    ],
    challenges=[
        LabChallenge(
            challenge_id="xss-reflected",
            title="Reflected XSS",
            description="Find and exploit a reflected XSS vulnerability in the search feature",
            flag="FLAG{reflected_xss_found}",
            points=10,
            hints=[
                "User input is reflected in the page without encoding",
                "Try: <script>alert('XSS')</script>",
                "Check the search parameter in the URL"
            ]
        ),
        LabChallenge(
            challenge_id="xss-stored",
            title="Stored XSS",
            description="Inject a persistent XSS payload in the comment section",
            flag="FLAG{stored_xss_persistent}",
            points=15,
            hints=[
                "Comments are stored in database and displayed to all users",
                "Payload: <img src=x onerror=alert(document.cookie)>",
                "The payload executes every time the page loads"
            ]
        ),
        LabChallenge(
            challenge_id="xss-dom",
            title="DOM-based XSS",
            description="Exploit client-side JavaScript to achieve DOM XSS",
            flag="FLAG{dom_xss_expert}",
            points=15,
            hints=[
                "Check how JavaScript processes URL hash parameters",
                "innerHTML is used without sanitization",
                "Payload: #<img src=x onerror=alert('DOM_XSS')>"
            ]
        ),
        LabChallenge(
            challenge_id="xss-filter-bypass",
            title="Filter Bypass",
            description="Bypass the XSS filter using encoding and obfuscation",
            flag="FLAG{filter_bypass_master}",
            points=20,
            hints=[
                "Basic blacklist filters block <script> tags",
                "Try alternative tags: <img>, <svg>, <iframe>",
                "Event handlers: onerror, onload, onfocus",
                "Case variation: <ScRiPt> or <sCrIpT>"
            ]
        )
    ],
    total_points=60,
    resources=[
        "OWASP XSS Guide",
        "PortSwigger XSS Cheat Sheet",
        "PayloadsAllTheThings XSS"
    ]
)


# JWT Lab
JWT_LAB = Lab(
    lab_id="jwt-attacks",
    lab_type=LabType.JWT,
    title="JWT Token Manipulation",
    description="Learn to exploit JWT vulnerabilities including algorithm confusion, weak secrets, and claim manipulation.",
    difficulty=LabDifficulty.INTERMEDIATE,
    estimated_time=40,
    learning_objectives=[
        "Understand JWT structure and components",
        "Exploit algorithm confusion (alg=none)",
        "Crack weak JWT secrets",
        "Manipulate JWT claims for privilege escalation",
        "Implement secure JWT handling"
    ],
    challenges=[
        LabChallenge(
            challenge_id="jwt-alg-none",
            title="Algorithm None Attack",
            description="Bypass authentication by changing algorithm to 'none'",
            flag="FLAG{jwt_alg_none_bypass}",
            points=15,
            hints=[
                "JWT has three parts: header.payload.signature",
                "Change the 'alg' in header to 'none'",
                "Remove the signature (but keep the final dot)",
                "Base64-decode, modify, re-encode"
            ]
        ),
        LabChallenge(
            challenge_id="jwt-weak-secret",
            title="Weak Secret Cracking",
            description="Crack the JWT signing secret using a dictionary attack",
            flag="FLAG{jwt_secret_cracked}",
            points=20,
            hints=[
                "The secret is a common password",
                "Use hashcat or john for cracking",
                "Try common secrets: secret, secret123, password",
                "Once cracked, forge your own token"
            ]
        ),
        LabChallenge(
            challenge_id="jwt-claim-manipulation",
            title="Claim Manipulation",
            description="Escalate privileges by modifying JWT claims",
            flag="FLAG{jwt_admin_escalation}",
            points=20,
            hints=[
                "Decode the JWT to see current claims",
                "Change 'role': 'user' to 'role': 'admin'",
                "Re-sign with the cracked secret",
                "Send modified token in Authorization header"
            ]
        )
    ],
    total_points=55,
    resources=[
        "JWT.io Debugger",
        "OWASP JWT Cheat Sheet",
        "PortSwigger JWT Attacks"
    ]
)


# Command Injection Lab
COMMAND_INJECTION_LAB = Lab(
    lab_id="command-injection",
    lab_type=LabType.COMMAND_INJECTION,
    title="Command Injection & RCE",
    description="Exploit OS command injection vulnerabilities to achieve remote code execution. Learn to chain commands and exfiltrate data.",
    difficulty=LabDifficulty.INTERMEDIATE,
    estimated_time=35,
    learning_objectives=[
        "Identify command injection points",
        "Chain multiple OS commands",
        "Bypass input validation and filters",
        "Read sensitive files via command injection",
        "Understand command injection prevention"
    ],
    challenges=[
        LabChallenge(
            challenge_id="cmd-basic-injection",
            title="Basic Command Injection",
            description="Execute additional commands in the ping utility",
            flag="FLAG{command_injection_works}",
            points=10,
            hints=[
                "The ping command takes user input directly",
                "Use ; or && to chain commands",
                "Try: 127.0.0.1; whoami",
                "Or: 127.0.0.1 && ls -la"
            ]
        ),
        LabChallenge(
            challenge_id="cmd-file-read",
            title="File Read via Command Injection",
            description="Read the contents of /etc/passwd using command injection",
            flag="FLAG{file_read_success}",
            points=15,
            hints=[
                "Use cat command to read files",
                "Payload: ; cat /etc/passwd",
                "On Windows: && type C:\\Windows\\System32\\drivers\\etc\\hosts",
                "Look for the flag in the output"
            ]
        ),
        LabChallenge(
            challenge_id="cmd-filter-bypass",
            title="Filter Bypass",
            description="Bypass input filters to execute commands",
            flag="FLAG{filter_bypass_rce}",
            points=20,
            hints=[
                "Common filters block: ;, &, |, >, <",
                "Use newline characters: %0A",
                "Try backticks: `whoami`",
                "Or command substitution: $(whoami)",
                "Encode special chars: ; = %3B, & = %26"
            ]
        )
    ],
    total_points=45,
    resources=[
        "OWASP Command Injection",
        "PortSwigger OS Command Injection",
        "PayloadsAllTheThings Command Injection"
    ]
)


# Directory Traversal Lab
DIRECTORY_TRAVERSAL_LAB = Lab(
    lab_id="directory-traversal",
    lab_type=LabType.DIRECTORY_TRAVERSAL,
    title="Path Traversal & LFI",
    description="Master directory traversal attacks to read arbitrary files. Learn path manipulation, filter bypasses, and LFI exploitation.",
    difficulty=LabDifficulty.BEGINNER,
    estimated_time=30,
    learning_objectives=[
        "Understand path traversal vulnerabilities",
        "Use ../ sequences to access parent directories",
        "Bypass path traversal filters",
        "Read sensitive system files",
        "Learn secure file handling practices"
    ],
    challenges=[
        LabChallenge(
            challenge_id="traversal-basic",
            title="Basic Path Traversal",
            description="Access files outside the web root using ../",
            flag="FLAG{traversal_success}",
            points=10,
            hints=[
                "The file parameter loads images from /uploads/",
                "Use ../ to go up one directory",
                "Try: ../../../../etc/passwd",
                "On Windows: ../../../../Windows/System32/drivers/etc/hosts"
            ]
        ),
        LabChallenge(
            challenge_id="traversal-absolute",
            title="Absolute Path Bypass",
            description="Use absolute paths to bypass traversal protections",
            flag="FLAG{absolute_path_win}",
            points=15,
            hints=[
                "Some filters block ../ but allow absolute paths",
                "Try: /etc/passwd (Linux) or C:/Windows/win.ini (Windows)",
                "Full path: file=/etc/passwd",
                "The flag is in /etc/secret.txt"
            ]
        ),
        LabChallenge(
            challenge_id="traversal-encoding",
            title="Encoding Bypass",
            description="Bypass filters using URL encoding and double encoding",
            flag="FLAG{encoding_bypass_pro}",
            points=20,
            hints=[
                "Encode ../ as %2e%2e%2f or %2e%2e/",
                "Double encoding: %252e%252e%252f",
                "Try: ....// (filter strips single ../)",
                "Unicode encoding: ..%c0%af",
                "The flag is in a filtered location"
            ]
        )
    ],
    total_points=45,
    resources=[
        "OWASP Path Traversal",
        "PortSwigger Directory Traversal",
        "HackerOne Path Traversal Reports"
    ]
)


# All labs collection
ALL_LABS = [
    SQL_INJECTION_LAB,
    XSS_LAB,
    JWT_LAB,
    COMMAND_INJECTION_LAB,
    DIRECTORY_TRAVERSAL_LAB
]

# Lab lookup dictionary
LABS_BY_ID = {lab.lab_id: lab for lab in ALL_LABS}
LABS_BY_TYPE = {lab.lab_type: lab for lab in ALL_LABS}
