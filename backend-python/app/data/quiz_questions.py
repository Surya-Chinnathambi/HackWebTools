"""
Quiz Questions Database
"""

from app.models.quiz import QuizQuestion, QuestionType, QuizDifficulty

# Nmap Quiz Questions
NMAP_QUESTIONS = [
    QuizQuestion(
        id="nmap_q1",
        question="Which Nmap flag performs a SYN scan (stealth scan)?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["-sT", "-sS", "-sU", "-sA"],
        correct_answer="1",
        explanation="-sS performs a SYN scan, which doesn't complete the TCP handshake, making it stealthier than -sT (connect scan).",
        difficulty=QuizDifficulty.EASY,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q2",
        question="What does the -O flag do in Nmap?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["Scan UDP ports", "OS detection", "Output to file", "Omit ping"],
        correct_answer="1",
        explanation="-O enables OS detection based on TCP/IP stack fingerprinting.",
        difficulty=QuizDifficulty.EASY,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q3",
        question="A SYN scan is completely undetectable by firewalls and IDS.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="False",
        explanation="SYN scans can still be detected by modern IDS/IPS systems. It's 'stealthier' but not undetectable.",
        difficulty=QuizDifficulty.MEDIUM,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q4",
        question="Which command scans the top 1000 ports on target 192.168.1.1?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "nmap 192.168.1.1",
            "nmap -p- 192.168.1.1",
            "nmap -F 192.168.1.1",
            "nmap --top-ports 100 192.168.1.1"
        ],
        correct_answer="0",
        explanation="By default, Nmap scans the top 1000 most common ports.",
        difficulty=QuizDifficulty.EASY,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q5",
        question="What does the -A flag combine?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Only version detection",
            "OS detection, version detection, script scanning, traceroute",
            "Aggressive timing only",
            "All port scan"
        ],
        correct_answer="1",
        explanation="-A enables aggressive scanning including OS detection (-O), version detection (-sV), script scanning (-sC), and traceroute.",
        difficulty=QuizDifficulty.MEDIUM,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q6",
        question="NSE scripts are written in which language?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["Python", "Lua", "Bash", "C"],
        correct_answer="1",
        explanation="Nmap Scripting Engine (NSE) scripts are written in Lua.",
        difficulty=QuizDifficulty.MEDIUM,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q7",
        question="Which scan type is best for scanning UDP services?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["-sS", "-sT", "-sU", "-sF"],
        correct_answer="2",
        explanation="-sU performs UDP scanning. UDP scans are slower than TCP scans.",
        difficulty=QuizDifficulty.EASY,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q8",
        question="The -Pn flag skips host discovery and assumes the host is up.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="-Pn (no ping) treats all hosts as online and skips host discovery.",
        difficulty=QuizDifficulty.EASY,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q9",
        question="Which timing template is the fastest but most detectable?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["-T0 (Paranoid)", "-T3 (Normal)", "-T5 (Insane)", "-T1 (Sneaky)"],
        correct_answer="2",
        explanation="-T5 (Insane) is the fastest timing template but also the noisiest and most likely to be detected.",
        difficulty=QuizDifficulty.MEDIUM,
        category="nmap",
        points=10
    ),
    QuizQuestion(
        id="nmap_q10",
        question="What command saves output in all three formats (normal, XML, grepable)?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["-oA filename", "-o filename", "-oN -oX -oG filename", "--all-formats filename"],
        correct_answer="0",
        explanation="-oA filename saves scan results in normal (-oN), XML (-oX), and grepable (-oG) formats.",
        difficulty=QuizDifficulty.MEDIUM,
        category="nmap",
        points=10
    ),
]

# SQL Injection Quiz Questions
SQLI_QUESTIONS = [
    QuizQuestion(
        id="sqli_q1",
        question="Which SQL comment syntax works in MySQL?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["//", "/* */", "#", "All of the above"],
        correct_answer="3",
        explanation="MySQL supports //, /* */, and # for comments. -- (with space) also works.",
        difficulty=QuizDifficulty.EASY,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q2",
        question="What does UNION SELECT require?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Same number of columns",
            "Same data types",
            "Both A and B",
            "Neither A nor B"
        ],
        correct_answer="2",
        explanation="UNION SELECT requires the same number of columns and compatible data types in both SELECT statements.",
        difficulty=QuizDifficulty.MEDIUM,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q3",
        question="Prepared statements with parameterized queries prevent SQL injection.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="Prepared statements separate SQL code from data, making SQL injection impossible when used correctly.",
        difficulty=QuizDifficulty.EASY,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q4",
        question="Which payload tests for blind SQLi with time delay?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "' OR 1=1--",
            "' UNION SELECT NULL--",
            "' AND SLEEP(5)--",
            "' DROP TABLE users--"
        ],
        correct_answer="2",
        explanation="SLEEP(5) or similar time-delay functions help detect blind SQLi by observing response time.",
        difficulty=QuizDifficulty.MEDIUM,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q5",
        question="What does this payload attempt: ' OR '1'='1?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Authentication bypass",
            "Data extraction",
            "Database deletion",
            "Privilege escalation"
        ],
        correct_answer="0",
        explanation="This classic payload makes the WHERE clause always true, potentially bypassing authentication.",
        difficulty=QuizDifficulty.EASY,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q6",
        question="Second-order SQL injection occurs during data retrieval, not insertion.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="Second-order SQLi happens when malicious input is stored safely but later used unsafely in a query.",
        difficulty=QuizDifficulty.HARD,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q7",
        question="Which function extracts database name in MySQL?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["db_name()", "DATABASE()", "current_db()", "getdb()"],
        correct_answer="1",
        explanation="DATABASE() returns the current database name in MySQL.",
        difficulty=QuizDifficulty.MEDIUM,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q8",
        question="What's the purpose of ORDER BY in SQLi enumeration?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Sort results",
            "Determine number of columns",
            "Extract data",
            "Bypass WAF"
        ],
        correct_answer="1",
        explanation="ORDER BY N is used to enumerate columns by incrementing N until an error occurs.",
        difficulty=QuizDifficulty.MEDIUM,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q9",
        question="SQLmap can automatically detect and exploit SQL injection.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="SQLmap is an automated tool that detects and exploits SQL injection vulnerabilities.",
        difficulty=QuizDifficulty.EASY,
        category="sqli",
        points=10
    ),
    QuizQuestion(
        id="sqli_q10",
        question="Which is the most dangerous SQL injection type?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Error-based",
            "Boolean-based blind",
            "Out-of-band",
            "All are equally dangerous"
        ],
        correct_answer="3",
        explanation="All SQLi types can lead to data breaches. The danger depends on database permissions and configuration.",
        difficulty=QuizDifficulty.HARD,
        category="sqli",
        points=10
    ),
]

# XSS Quiz Questions
XSS_QUESTIONS = [
    QuizQuestion(
        id="xss_q1",
        question="Which XSS type is stored in the database?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["Reflected XSS", "Stored XSS", "DOM XSS", "Blind XSS"],
        correct_answer="1",
        explanation="Stored (persistent) XSS is saved in the database and executed when other users view the content.",
        difficulty=QuizDifficulty.EASY,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q2",
        question="What does this payload do: <script>alert(document.cookie)</script>?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Delete cookies",
            "Display cookies in alert",
            "Send cookies to attacker",
            "Encrypt cookies"
        ],
        correct_answer="1",
        explanation="This basic XSS payload displays the cookies in an alert box, useful for testing XSS.",
        difficulty=QuizDifficulty.EASY,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q3",
        question="Content Security Policy (CSP) can prevent XSS attacks.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="CSP is a security header that restricts which scripts can execute, significantly reducing XSS risk.",
        difficulty=QuizDifficulty.MEDIUM,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q4",
        question="DOM-based XSS occurs where?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Server-side",
            "Database",
            "Client-side JavaScript",
            "HTTP headers"
        ],
        correct_answer="2",
        explanation="DOM XSS happens entirely in the browser when JavaScript unsafely manipulates the DOM.",
        difficulty=QuizDifficulty.MEDIUM,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q5",
        question="Which encoding helps prevent XSS?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "HTML entity encoding",
            "Base64 encoding",
            "MD5 hashing",
            "ASCII encoding"
        ],
        correct_answer="0",
        explanation="HTML entity encoding converts special characters (<, >, etc.) to safe entities, preventing script execution.",
        difficulty=QuizDifficulty.MEDIUM,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q6",
        question="httpOnly cookies can be accessed via JavaScript.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="False",
        explanation="httpOnly flag prevents JavaScript from accessing cookies, protecting against XSS cookie theft.",
        difficulty=QuizDifficulty.EASY,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q7",
        question="Which is a valid XSS bypass for filtered <script>?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "<img src=x onerror=alert(1)>",
            "<SCRIPT>alert(1)</SCRIPT>",
            "<scr<script>ipt>alert(1)</script>",
            "All of the above"
        ],
        correct_answer="3",
        explanation="All are common XSS bypass techniques: img events, case variation, and tag nesting.",
        difficulty=QuizDifficulty.HARD,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q8",
        question="Reflected XSS payload is executed immediately without storing.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="Reflected XSS requires the victim to click a malicious link and executes immediately without persistence.",
        difficulty=QuizDifficulty.EASY,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q9",
        question="Which header helps prevent XSS?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "X-Frame-Options",
            "X-XSS-Protection",
            "Strict-Transport-Security",
            "Access-Control-Allow-Origin"
        ],
        correct_answer="1",
        explanation="X-XSS-Protection enables browser's built-in XSS filter (though CSP is now preferred).",
        difficulty=QuizDifficulty.MEDIUM,
        category="xss",
        points=10
    ),
    QuizQuestion(
        id="xss_q10",
        question="What's the most dangerous impact of XSS?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Session hijacking",
            "Keylogging",
            "Phishing",
            "All equally dangerous"
        ],
        correct_answer="3",
        explanation="XSS enables session theft, keylogging, phishing, and more. Impact depends on the context.",
        difficulty=QuizDifficulty.MEDIUM,
        category="xss",
        points=10
    ),
]

# Burp Suite Questions
BURP_QUESTIONS = [
    QuizQuestion(
        id="burp_q1",
        question="What is Burp Suite primarily used for?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Network scanning",
            "Web application security testing",
            "Password cracking",
            "Mobile app testing"
        ],
        correct_answer="1",
        explanation="Burp Suite is the leading web application security testing tool.",
        difficulty=QuizDifficulty.EASY,
        category="burp",
        points=10
    ),
    QuizQuestion(
        id="burp_q2",
        question="Which Burp tool intercepts and modifies HTTP requests?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["Scanner", "Proxy", "Intruder", "Repeater"],
        correct_answer="1",
        explanation="Burp Proxy intercepts traffic between browser and server for inspection and modification.",
        difficulty=QuizDifficulty.EASY,
        category="burp",
        points=10
    ),
    QuizQuestion(
        id="burp_q3",
        question="Burp Intruder is used for automated attacks like brute forcing.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="Intruder automates customized attacks including brute forcing, fuzzing, and enumeration.",
        difficulty=QuizDifficulty.EASY,
        category="burp",
        points=10
    ),
    QuizQuestion(
        id="burp_q4",
        question="Which attack type tries all permutations in Burp Intruder?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["Sniper", "Battering ram", "Pitchfork", "Cluster bomb"],
        correct_answer="3",
        explanation="Cluster bomb tries all combinations of payloads across multiple positions.",
        difficulty=QuizDifficulty.MEDIUM,
        category="burp",
        points=10
    ),
    QuizQuestion(
        id="burp_q5",
        question="Burp Repeater is used for manual modification and resubmission of requests.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="Repeater allows manual testing by modifying and resending individual requests.",
        difficulty=QuizDifficulty.EASY,
        category="burp",
        points=10
    ),
]

# Metasploit Questions
METASPLOIT_QUESTIONS = [
    QuizQuestion(
        id="msf_q1",
        question="What is Metasploit primarily used for?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=[
            "Antivirus scanning",
            "Exploitation framework",
            "Password manager",
            "Firewall"
        ],
        correct_answer="1",
        explanation="Metasploit is a penetration testing framework for developing and executing exploits.",
        difficulty=QuizDifficulty.EASY,
        category="metasploit",
        points=10
    ),
    QuizQuestion(
        id="msf_q2",
        question="Which command starts the Metasploit console?",
        question_type=QuestionType.MULTIPLE_CHOICE,
        options=["metasploit", "msfconsole", "msf", "exploit"],
        correct_answer="1",
        explanation="msfconsole launches the interactive Metasploit console.",
        difficulty=QuizDifficulty.EASY,
        category="metasploit",
        points=10
    ),
    QuizQuestion(
        id="msf_q3",
        question="Meterpreter is a payload that runs in memory without touching disk.",
        question_type=QuestionType.TRUE_FALSE,
        options=["True", "False"],
        correct_answer="True",
        explanation="Meterpreter is a fileless, memory-resident payload that's harder to detect.",
        difficulty=QuizDifficulty.MEDIUM,
        category="metasploit",
        points=10
    ),
]

ALL_QUESTIONS = {
    "nmap": NMAP_QUESTIONS,
    "sqli": SQLI_QUESTIONS,
    "xss": XSS_QUESTIONS,
    "burp": BURP_QUESTIONS,
    "metasploit": METASPLOIT_QUESTIONS
}


def get_questions_by_category(category: str, limit: int = 10):
    """Get random questions from a category"""
    import random
    questions = ALL_QUESTIONS.get(category, [])
    if len(questions) <= limit:
        return questions
    return random.sample(questions, limit)


def get_all_categories():
    """Get list of available quiz categories"""
    return list(ALL_QUESTIONS.keys())
