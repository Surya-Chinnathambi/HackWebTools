import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    BookOpen,
    Shield,
    Network,
    Code,
    Lock,
    Terminal,
    Bug,
    AlertTriangle,
    Filter,
    Target
} from "lucide-react";

interface GlossaryTerm {
    term: string;
    definition: string;
    category: "Tools" | "Vulnerabilities" | "Techniques" | "Networking" | "Cryptography" | "General" | "Protocols" | "Defense";
    relatedTerms?: string[];
    acronym?: string;
}

const glossaryTerms: GlossaryTerm[] = [
    // A
    {
        term: "API",
        acronym: "Application Programming Interface",
        definition: "A set of protocols and tools for building software applications. APIs define how software components should interact, allowing different applications to communicate with each other.",
        category: "General",
        relatedTerms: ["REST", "SOAP", "GraphQL"]
    },
    {
        term: "APT",
        acronym: "Advanced Persistent Threat",
        definition: "A prolonged and targeted cyberattack where an intruder gains access to a network and remains undetected for an extended period. Often state-sponsored attacks targeting governments or large corporations.",
        category: "Techniques",
        relatedTerms: ["Backdoor", "Zero-Day", "C&C"]
    },
    {
        term: "Arbitrary Code Execution",
        definition: "A vulnerability that allows an attacker to run any code of their choosing on a target system. This is one of the most severe types of vulnerabilities as it gives complete control.",
        category: "Vulnerabilities",
        relatedTerms: ["RCE", "Shell", "Exploit"]
    },
    {
        term: "ARP",
        acronym: "Address Resolution Protocol",
        definition: "A protocol used to map IP addresses to MAC addresses on a local network. Can be exploited via ARP spoofing/poisoning attacks.",
        category: "Networking",
        relatedTerms: ["ARP Spoofing", "MAC Address", "MITM"]
    },
    {
        term: "ARP Spoofing",
        definition: "An attack where an attacker sends fake ARP messages to link their MAC address with the IP address of a legitimate device, allowing them to intercept network traffic.",
        category: "Techniques",
        relatedTerms: ["ARP", "MITM", "Packet Sniffing"]
    },
    {
        term: "Authentication",
        definition: "The process of verifying the identity of a user, device, or system. Common methods include passwords, biometrics, tokens, and multi-factor authentication.",
        category: "General",
        relatedTerms: ["Authorization", "MFA", "SSO"]
    },
    {
        term: "Authorization",
        definition: "The process of determining what permissions an authenticated user has. Defines what resources they can access and what actions they can perform.",
        category: "General",
        relatedTerms: ["Authentication", "Access Control", "RBAC"]
    },
    // B
    {
        term: "Backdoor",
        definition: "A hidden method of bypassing normal authentication to gain access to a system. Can be intentionally placed by developers or maliciously installed by attackers.",
        category: "Techniques",
        relatedTerms: ["Trojan", "RAT", "Persistence"]
    },
    {
        term: "Base64",
        definition: "An encoding scheme that converts binary data into ASCII text format. Commonly used to encode data in URLs, cookies, and to obfuscate payloads (not encryption!).",
        category: "General",
        relatedTerms: ["Encoding", "URL Encoding", "Obfuscation"]
    },
    {
        term: "Bcrypt",
        definition: "A password hashing function designed to be slow and computationally expensive, making it resistant to brute-force attacks. Uses salting and adaptive hashing.",
        category: "Cryptography",
        relatedTerms: ["Hashing", "Argon2", "PBKDF2", "Salt"]
    },
    {
        term: "Bind Shell",
        definition: "A type of shell where the target machine opens a listening port and waits for the attacker to connect. Compare to reverse shell.",
        category: "Techniques",
        relatedTerms: ["Reverse Shell", "Shell", "Netcat"]
    },
    {
        term: "Blue Team",
        definition: "The defensive side in cybersecurity exercises. Responsible for defending systems, monitoring for threats, responding to incidents, and implementing security controls.",
        category: "Defense",
        relatedTerms: ["Red Team", "Purple Team", "SOC", "Incident Response"]
    },
    {
        term: "Boolean-Based Blind SQL Injection",
        definition: "A type of SQL injection where the attacker infers information by observing true/false responses from the application, without seeing direct output.",
        category: "Techniques",
        relatedTerms: ["SQL Injection", "Blind SQLi", "Time-Based SQLi"]
    },
    {
        term: "Botnet",
        definition: "A network of compromised computers (bots/zombies) controlled remotely by an attacker. Used for DDoS attacks, spam, cryptocurrency mining, or credential stuffing.",
        category: "Techniques",
        relatedTerms: ["DDoS", "C&C", "Malware", "Zombie"]
    },
    {
        term: "Brute Force",
        definition: "An attack method that tries every possible combination of characters to guess passwords, encryption keys, or other credentials. Effective against weak passwords.",
        category: "Techniques",
        relatedTerms: ["Dictionary Attack", "Credential Stuffing", "Hydra", "Hashcat"]
    },
    {
        term: "Buffer Overflow",
        definition: "A vulnerability where more data is written to a buffer than it can hold, overwriting adjacent memory. Can lead to arbitrary code execution or system crashes.",
        category: "Vulnerabilities",
        relatedTerms: ["Stack Overflow", "Heap Overflow", "Memory Corruption"]
    },
    {
        term: "Bug Bounty",
        definition: "A program where organizations reward security researchers for finding and reporting vulnerabilities. Rewards range from $50 to $100,000+ depending on severity.",
        category: "General",
        relatedTerms: ["HackerOne", "Bugcrowd", "Responsible Disclosure"]
    },
    {
        term: "Burp Suite",
        definition: "A popular web application security testing tool. Includes proxy, scanner, intruder, repeater, and other modules for finding vulnerabilities in web apps.",
        category: "Tools",
        relatedTerms: ["OWASP ZAP", "Proxy", "Web Testing"]
    },
    // C
    {
        term: "C&C",
        acronym: "Command and Control",
        definition: "A server used by attackers to control compromised systems (bots). Sends commands to malware and receives stolen data.",
        category: "Techniques",
        relatedTerms: ["Botnet", "RAT", "APT"]
    },
    {
        term: "Certificate",
        definition: "A digital document that verifies the identity of a website or entity. Contains public key and is signed by a Certificate Authority (CA).",
        category: "Cryptography",
        relatedTerms: ["SSL/TLS", "CA", "Public Key Infrastructure"]
    },
    {
        term: "CIA Triad",
        definition: "The three core principles of information security: Confidentiality (data privacy), Integrity (data accuracy), and Availability (system uptime).",
        category: "General",
        relatedTerms: ["Security Principles", "Confidentiality", "Integrity"]
    },
    {
        term: "CORS",
        acronym: "Cross-Origin Resource Sharing",
        definition: "A security feature that controls which origins can access resources on a web server. Misconfigured CORS can allow unauthorized cross-domain requests.",
        category: "Protocols",
        relatedTerms: ["Same-Origin Policy", "XSS", "CSRF"]
    },
    {
        term: "Credential Stuffing",
        definition: "An attack using leaked username/password pairs from one breach to try accessing accounts on other services. Works because users reuse passwords.",
        category: "Techniques",
        relatedTerms: ["Brute Force", "Password Reuse", "Data Breach"]
    },
    {
        term: "CSRF",
        acronym: "Cross-Site Request Forgery",
        definition: "An attack that tricks a victim into performing unwanted actions on a web application where they're authenticated. Exploits trust that a site has in the user's browser.",
        category: "Vulnerabilities",
        relatedTerms: ["XSS", "CORS", "Token", "Same-Site Cookie"]
    },
    {
        term: "CTF",
        acronym: "Capture The Flag",
        definition: "A cybersecurity competition where participants solve challenges to find hidden 'flags' (strings). Common categories: web, binary, crypto, forensics, reverse engineering.",
        category: "General",
        relatedTerms: ["HackTheBox", "TryHackMe", "PicoCTF"]
    },
    {
        term: "CVE",
        acronym: "Common Vulnerabilities and Exposures",
        definition: "A standardized identifier for publicly known security vulnerabilities. Format: CVE-YEAR-NUMBER (e.g., CVE-2021-44228 for Log4Shell).",
        category: "General",
        relatedTerms: ["CVSS", "NVD", "Vulnerability"]
    },
    {
        term: "CVSS",
        acronym: "Common Vulnerability Scoring System",
        definition: "A standardized way to rate vulnerability severity from 0-10. Scores 9-10 are Critical, 7-8.9 are High, 4-6.9 are Medium, 0.1-3.9 are Low.",
        category: "General",
        relatedTerms: ["CVE", "Severity", "Risk Assessment"]
    },
    // D
    {
        term: "Dark Web",
        definition: "Parts of the internet not indexed by search engines and requiring special software (like Tor) to access. Used for both legitimate privacy and illegal activities.",
        category: "General",
        relatedTerms: ["Tor", "Onion Routing", "Deep Web"]
    },
    {
        term: "DDoS",
        acronym: "Distributed Denial of Service",
        definition: "An attack that floods a target system with traffic from multiple sources, overwhelming it and making it unavailable to legitimate users.",
        category: "Techniques",
        relatedTerms: ["DoS", "Botnet", "Amplification Attack"]
    },
    {
        term: "Dictionary Attack",
        definition: "A type of brute force attack using a list of common passwords (dictionary) rather than trying all possible combinations. Much faster than pure brute force.",
        category: "Techniques",
        relatedTerms: ["Brute Force", "Wordlist", "Rockyou.txt"]
    },
    {
        term: "DNS",
        acronym: "Domain Name System",
        definition: "The internet's phone book - translates human-readable domain names (google.com) into IP addresses (142.250.80.46).",
        category: "Networking",
        relatedTerms: ["DNS Spoofing", "Subdomain", "nslookup"]
    },
    {
        term: "DNS Spoofing",
        definition: "An attack that redirects DNS queries to malicious IP addresses, sending victims to fake websites. Also called DNS poisoning.",
        category: "Techniques",
        relatedTerms: ["DNS", "Phishing", "Cache Poisoning"]
    },
    {
        term: "DOM-Based XSS",
        definition: "A type of XSS where the vulnerability exists in client-side JavaScript code that processes user input without proper sanitization.",
        category: "Vulnerabilities",
        relatedTerms: ["XSS", "Reflected XSS", "Stored XSS"]
    },
    // E
    {
        term: "EDR",
        acronym: "Endpoint Detection and Response",
        definition: "Security software that monitors endpoints (computers, servers, mobile devices) for suspicious activity and responds to threats in real-time.",
        category: "Defense",
        relatedTerms: ["Antivirus", "SIEM", "Blue Team"]
    },
    {
        term: "Encoding",
        definition: "Converting data from one format to another (e.g., Base64, URL encoding, HTML entity encoding). Not the same as encryption - easily reversible.",
        category: "General",
        relatedTerms: ["Base64", "URL Encoding", "Encryption"]
    },
    {
        term: "Encryption",
        definition: "Converting data into a scrambled format that requires a key to decrypt. Protects confidentiality. Types: symmetric (AES) and asymmetric (RSA).",
        category: "Cryptography",
        relatedTerms: ["Decryption", "AES", "RSA", "Key"]
    },
    {
        term: "Enumeration",
        definition: "The process of gathering information about a target system, such as usernames, network shares, services running, and software versions.",
        category: "Techniques",
        relatedTerms: ["Reconnaissance", "Footprinting", "Scanning"]
    },
    {
        term: "Escalation",
        definition: "Short for privilege escalation - gaining higher-level permissions than initially granted. Goal is often to obtain root/admin access.",
        category: "Techniques",
        relatedTerms: ["Privilege Escalation", "Root", "Admin"]
    },
    {
        term: "Exploit",
        definition: "A piece of software, code, or technique that takes advantage of a vulnerability to cause unintended behavior. The weapon that uses the vulnerability.",
        category: "General",
        relatedTerms: ["Vulnerability", "Payload", "Proof of Concept"]
    },
    // F
    {
        term: "Firewall",
        definition: "A network security device that monitors and controls incoming/outgoing traffic based on predefined rules. Acts as a barrier between trusted and untrusted networks.",
        category: "Defense",
        relatedTerms: ["WAF", "IDS", "IPS", "Network Security"]
    },
    {
        term: "Footprinting",
        definition: "The first phase of reconnaissance - collecting as much information as possible about a target before attempting an attack.",
        category: "Techniques",
        relatedTerms: ["Reconnaissance", "OSINT", "Enumeration"]
    },
    {
        term: "Fuzzing",
        definition: "An automated testing technique that sends malformed, random, or unexpected data to inputs to find bugs, crashes, or security vulnerabilities.",
        category: "Techniques",
        relatedTerms: ["AFL", "Burp Intruder", "Testing"]
    },
    // G
    {
        term: "GDPR",
        acronym: "General Data Protection Regulation",
        definition: "European Union data protection law that regulates how organizations collect, process, and store personal data. Violations can result in fines up to €20M or 4% of revenue.",
        category: "General",
        relatedTerms: ["Compliance", "Privacy", "PII"]
    },
    {
        term: "Gray Hat",
        definition: "A hacker who falls between ethical (white hat) and malicious (black hat). May break laws but without malicious intent, often to improve security.",
        category: "General",
        relatedTerms: ["White Hat", "Black Hat", "Ethical Hacking"]
    },
    // H
    {
        term: "Hash",
        definition: "A one-way cryptographic function that converts data into a fixed-size string. Used for password storage, integrity checking, and digital signatures. Cannot be reversed.",
        category: "Cryptography",
        relatedTerms: ["MD5", "SHA256", "Bcrypt", "Salt"]
    },
    {
        term: "Hashcat",
        definition: "A powerful password cracking tool that uses GPUs to crack hashed passwords at billions of attempts per second. Supports 300+ hash types.",
        category: "Tools",
        relatedTerms: ["John the Ripper", "Password Cracking", "GPU"]
    },
    {
        term: "HIPAA",
        acronym: "Health Insurance Portability and Accountability Act",
        definition: "US law that protects patient medical records and health information. Violations can result in fines from $100 to $50,000 per violation.",
        category: "General",
        relatedTerms: ["Compliance", "Healthcare", "PHI"]
    },
    {
        term: "Honeypot",
        definition: "A decoy system designed to attract attackers and study their techniques. Helps detect attacks and gather threat intelligence without risking real systems.",
        category: "Defense",
        relatedTerms: ["Deception", "Threat Intelligence", "Blue Team"]
    },
    {
        term: "HTTPS",
        acronym: "Hypertext Transfer Protocol Secure",
        definition: "The secure version of HTTP, encrypted using SSL/TLS. Protects data in transit from eavesdropping and tampering. Look for the padlock icon.",
        category: "Protocols",
        relatedTerms: ["HTTP", "SSL/TLS", "Certificate"]
    },
    {
        term: "Hydra",
        definition: "A fast network login cracker that supports many protocols (SSH, FTP, HTTP, SMB, etc.). Used for brute force and dictionary attacks.",
        category: "Tools",
        relatedTerms: ["Brute Force", "Medusa", "Credential Stuffing"]
    },
    // I
    {
        term: "IDOR",
        acronym: "Insecure Direct Object Reference",
        definition: "A vulnerability where an attacker can access objects (files, database records) by modifying parameters like IDs in URLs. Example: /user/123 → /user/124",
        category: "Vulnerabilities",
        relatedTerms: ["Broken Access Control", "Authorization", "OWASP"]
    },
    {
        term: "IDS",
        acronym: "Intrusion Detection System",
        definition: "A monitoring system that detects suspicious activity or policy violations. Alerts security teams but doesn't block traffic (unlike IPS).",
        category: "Defense",
        relatedTerms: ["IPS", "Snort", "Suricata", "SIEM"]
    },
    {
        term: "Injection",
        definition: "A vulnerability where untrusted data is sent to an interpreter as part of a command or query. Types: SQL injection, command injection, LDAP injection, etc.",
        category: "Vulnerabilities",
        relatedTerms: ["SQL Injection", "Command Injection", "OWASP"]
    },
    {
        term: "IPS",
        acronym: "Intrusion Prevention System",
        definition: "Similar to IDS but actively blocks detected threats in real-time. Sits inline with network traffic and can drop malicious packets.",
        category: "Defense",
        relatedTerms: ["IDS", "Firewall", "WAF"]
    },
    // J
    {
        term: "John the Ripper",
        definition: "A popular open-source password cracking tool. Supports many hash types and uses dictionary, brute force, and hybrid attacks.",
        category: "Tools",
        relatedTerms: ["Hashcat", "Password Cracking", "Hash"]
    },
    {
        term: "JWT",
        acronym: "JSON Web Token",
        definition: "A compact token format used for authentication. Contains encoded JSON data and a signature. Common vulnerabilities: weak secrets, algorithm confusion, no signature verification.",
        category: "Protocols",
        relatedTerms: ["Authentication", "Token", "Session"]
    },
    // K
    {
        term: "Kali Linux",
        definition: "A Debian-based Linux distribution designed for penetration testing and security auditing. Pre-installed with 600+ security tools.",
        category: "Tools",
        relatedTerms: ["Parrot OS", "BlackArch", "Penetration Testing"]
    },
    {
        term: "Keylogger",
        definition: "Malware or hardware that records every keystroke typed on a computer, capturing passwords, credit cards, messages, etc.",
        category: "Techniques",
        relatedTerms: ["Spyware", "Malware", "RAT"]
    },
    // L
    {
        term: "Lateral Movement",
        definition: "After initial compromise, moving through a network to access additional systems. Goal is to reach high-value targets like domain controllers or databases.",
        category: "Techniques",
        relatedTerms: ["Privilege Escalation", "Pivoting", "APT"]
    },
    {
        term: "LFI",
        acronym: "Local File Inclusion",
        definition: "A vulnerability that allows attackers to include files from the local server, often leading to source code disclosure or remote code execution.",
        category: "Vulnerabilities",
        relatedTerms: ["RFI", "Path Traversal", "File Inclusion"]
    },
    {
        term: "Log4Shell",
        definition: "CVE-2021-44228 - A critical RCE vulnerability in Apache Log4j library (CVSS 10.0). One of the most severe vulnerabilities ever discovered, affecting millions of systems.",
        category: "Vulnerabilities",
        relatedTerms: ["CVE", "RCE", "Java"]
    },
    // M
    {
        term: "MAC Address",
        acronym: "Media Access Control Address",
        definition: "A unique identifier assigned to network interfaces. Format: 00:1A:2B:3C:4D:5E. Can be spoofed for anonymity or to bypass MAC filtering.",
        category: "Networking",
        relatedTerms: ["ARP", "Network Interface", "Spoofing"]
    },
    {
        term: "Malware",
        definition: "Malicious software designed to harm, exploit, or compromise systems. Types: viruses, worms, trojans, ransomware, spyware, rootkits.",
        category: "General",
        relatedTerms: ["Virus", "Ransomware", "Trojan", "Worm"]
    },
    {
        term: "Man-in-the-Middle",
        definition: "An attack where the attacker secretly intercepts and relays communication between two parties. Can read, modify, or inject data into the conversation.",
        category: "Techniques",
        relatedTerms: ["ARP Spoofing", "MITM", "Eavesdropping"]
    },
    {
        term: "MD5",
        definition: "A cryptographic hash function producing 128-bit (32 character hex) hashes. Considered broken - DO NOT use for passwords or security. Collisions can be generated.",
        category: "Cryptography",
        relatedTerms: ["SHA1", "Hash", "Bcrypt"]
    },
    {
        term: "Metasploit",
        definition: "A penetration testing framework containing thousands of exploits, payloads, and auxiliary modules. The industry standard for exploit development.",
        category: "Tools",
        relatedTerms: ["Exploit", "Payload", "Meterpreter"]
    },
    {
        term: "Meterpreter",
        definition: "An advanced payload in Metasploit that provides an interactive shell with many features: file operations, network pivoting, privilege escalation, screenshot capture.",
        category: "Tools",
        relatedTerms: ["Metasploit", "Payload", "Shell"]
    },
    {
        term: "MFA",
        acronym: "Multi-Factor Authentication",
        definition: "Security method requiring two or more verification factors (something you know, have, or are). Examples: password + SMS code, password + fingerprint.",
        category: "Defense",
        relatedTerms: ["2FA", "Authentication", "TOTP"]
    },
    {
        term: "MITM",
        acronym: "Man-in-the-Middle",
        definition: "See Man-in-the-Middle attack.",
        category: "Techniques",
        relatedTerms: ["Man-in-the-Middle", "ARP Spoofing", "Eavesdropping"]
    },
    {
        term: "MITRE ATT&CK",
        definition: "A knowledge base of adversary tactics and techniques based on real-world observations. Used for threat modeling and defense planning. 14 tactics, 200+ techniques.",
        category: "General",
        relatedTerms: ["Threat Intelligence", "TTPs", "Blue Team"]
    },
    // N
    {
        term: "Netcat",
        definition: "A networking utility for reading/writing data across network connections using TCP/UDP. Called the 'Swiss Army knife' of networking. Used for shells, file transfers, port scanning.",
        category: "Tools",
        relatedTerms: ["Shell", "Reverse Shell", "Bind Shell"]
    },
    {
        term: "Nikto",
        definition: "An open-source web server scanner that tests for dangerous files, outdated software versions, and common misconfigurations. Fast but noisy.",
        category: "Tools",
        relatedTerms: ["Web Scanning", "Nmap", "OWASP ZAP"]
    },
    {
        term: "Nmap",
        definition: "Network Mapper - the industry standard port scanner. Discovers hosts, services, operating systems, and vulnerabilities. Essential tool for reconnaissance.",
        category: "Tools",
        relatedTerms: ["Port Scanning", "Reconnaissance", "Masscan"]
    },
    {
        term: "NoSQL Injection",
        definition: "Injection attacks against NoSQL databases like MongoDB, CouchDB. Different syntax than SQL injection but same concept - untrusted data in queries.",
        category: "Vulnerabilities",
        relatedTerms: ["SQL Injection", "MongoDB", "Injection"]
    },
    // O
    {
        term: "Obfuscation",
        definition: "Making code or data deliberately difficult to understand. Used to hide malicious code from detection or to protect intellectual property.",
        category: "Techniques",
        relatedTerms: ["Encoding", "Evasion", "Packing"]
    },
    {
        term: "OSCP",
        acronym: "Offensive Security Certified Professional",
        definition: "A highly respected hands-on penetration testing certification. 24-hour practical exam where you must compromise systems to pass. 'Try Harder' motto.",
        category: "General",
        relatedTerms: ["Certification", "Penetration Testing", "OSCE"]
    },
    {
        term: "OSINT",
        acronym: "Open Source Intelligence",
        definition: "Information gathering from publicly available sources: social media, websites, public records, news, etc. Legal and passive reconnaissance.",
        category: "Techniques",
        relatedTerms: ["Reconnaissance", "Footprinting", "HUMINT"]
    },
    {
        term: "OWASP",
        acronym: "Open Web Application Security Project",
        definition: "A nonprofit foundation focused on improving software security. Best known for the OWASP Top 10 list of critical web application vulnerabilities.",
        category: "General",
        relatedTerms: ["OWASP Top 10", "Web Security", "OWASP ZAP"]
    },
    {
        term: "OWASP Top 10",
        definition: "A list of the 10 most critical web application security risks, updated every 3-4 years. Essential knowledge for web developers and security professionals.",
        category: "General",
        relatedTerms: ["OWASP", "Web Security", "Vulnerabilities"]
    },
    // P
    {
        term: "Packet Sniffing",
        definition: "Capturing and analyzing network traffic to extract information like passwords, emails, or sensitive data. Tools: Wireshark, tcpdump.",
        category: "Techniques",
        relatedTerms: ["Wireshark", "Network Analysis", "MITM"]
    },
    {
        term: "Path Traversal",
        definition: "A vulnerability allowing attackers to access files outside the intended directory by manipulating file paths (e.g., ../../etc/passwd).",
        category: "Vulnerabilities",
        relatedTerms: ["LFI", "Directory Traversal", "File Inclusion"]
    },
    {
        term: "Payload",
        definition: "The malicious code or action delivered by an exploit. Examples: reverse shell, keylogger, ransomware, data exfiltration script.",
        category: "General",
        relatedTerms: ["Exploit", "Shell", "Malware"]
    },
    {
        term: "Penetration Testing",
        definition: "Authorized simulated cyberattack on a system to find exploitable vulnerabilities. Goal is to identify weaknesses before malicious hackers do.",
        category: "General",
        relatedTerms: ["Pentesting", "Ethical Hacking", "Red Team"]
    },
    {
        term: "Persistence",
        definition: "Techniques used by attackers to maintain access to a compromised system across reboots and credential changes. Methods: backdoors, scheduled tasks, registry keys.",
        category: "Techniques",
        relatedTerms: ["Backdoor", "Implant", "APT"]
    },
    {
        term: "Phishing",
        definition: "Social engineering attack using fake emails, websites, or messages to trick victims into revealing credentials or downloading malware.",
        category: "Techniques",
        relatedTerms: ["Spear Phishing", "Social Engineering", "Credential Theft"]
    },
    {
        term: "PII",
        acronym: "Personally Identifiable Information",
        definition: "Data that can identify a specific individual: name, SSN, email, phone, address, IP address, biometrics. Subject to privacy regulations.",
        category: "General",
        relatedTerms: ["GDPR", "Privacy", "Data Protection"]
    },
    {
        term: "Pivoting",
        definition: "Using a compromised system as a stepping stone to attack other systems on the internal network. Essential for lateral movement.",
        category: "Techniques",
        relatedTerms: ["Lateral Movement", "Tunneling", "Port Forwarding"]
    },
    {
        term: "PoC",
        acronym: "Proof of Concept",
        definition: "Code or demonstration that proves a vulnerability exists and is exploitable, without causing actual harm. Used for responsible disclosure.",
        category: "General",
        relatedTerms: ["Exploit", "CVE", "Bug Bounty"]
    },
    {
        term: "Port",
        definition: "A numbered endpoint for network communication (0-65535). Common: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL), 3389 (RDP).",
        category: "Networking",
        relatedTerms: ["Port Scanning", "Service", "Protocol"]
    },
    {
        term: "Privilege Escalation",
        definition: "Exploiting a vulnerability to gain higher-level permissions. Vertical: user to admin. Horizontal: access another user's account.",
        category: "Techniques",
        relatedTerms: ["Root", "Admin", "Escalation"]
    },
    {
        term: "Purple Team",
        definition: "A collaborative approach where red team (attackers) and blue team (defenders) work together to improve security posture.",
        category: "Defense",
        relatedTerms: ["Red Team", "Blue Team", "Security Exercises"]
    },
    // R
    {
        term: "Rainbow Table",
        definition: "A precomputed table of hash values used to quickly crack password hashes. Defeated by salting hashes.",
        category: "Cryptography",
        relatedTerms: ["Hash", "Salt", "Password Cracking"]
    },
    {
        term: "Ransomware",
        definition: "Malware that encrypts victim's files and demands payment (usually cryptocurrency) for decryption. Average ransom: $100k-$1M for businesses.",
        category: "Techniques",
        relatedTerms: ["Malware", "Encryption", "Extortion"]
    },
    {
        term: "RAT",
        acronym: "Remote Access Trojan",
        definition: "Malware that gives attackers full remote control of a compromised system. Features: keylogging, webcam access, file theft, command execution.",
        category: "Techniques",
        relatedTerms: ["Trojan", "Backdoor", "C&C"]
    },
    {
        term: "RBAC",
        acronym: "Role-Based Access Control",
        definition: "An access control model where permissions are assigned to roles, and users are assigned to roles. Simplifies permission management.",
        category: "General",
        relatedTerms: ["Authorization", "Access Control", "Permissions"]
    },
    {
        term: "RCE",
        acronym: "Remote Code Execution",
        definition: "A vulnerability allowing an attacker to execute arbitrary code on a remote system. One of the most severe vulnerability types (CVSS 9-10).",
        category: "Vulnerabilities",
        relatedTerms: ["Arbitrary Code Execution", "Shell", "Exploit"]
    },
    {
        term: "Reconnaissance",
        definition: "The information gathering phase before an attack. Two types: passive (OSINT, no target interaction) and active (port scanning, enumeration).",
        category: "Techniques",
        relatedTerms: ["Footprinting", "OSINT", "Enumeration"]
    },
    {
        term: "Red Team",
        definition: "The offensive side in security exercises. Simulates real-world attackers to test an organization's defenses and identify weaknesses.",
        category: "General",
        relatedTerms: ["Blue Team", "Purple Team", "Penetration Testing"]
    },
    {
        term: "Reflected XSS",
        definition: "A type of XSS where malicious script is reflected off a web server in the response. Requires victim to click a malicious link.",
        category: "Vulnerabilities",
        relatedTerms: ["XSS", "Stored XSS", "DOM-Based XSS"]
    },
    {
        term: "Reverse Engineering",
        definition: "Analyzing software or systems to understand how they work, often by examining compiled binaries. Used for malware analysis and finding vulnerabilities.",
        category: "Techniques",
        relatedTerms: ["Disassembly", "Decompilation", "IDA Pro"]
    },
    {
        term: "Reverse Shell",
        definition: "A shell where the target machine initiates a connection back to the attacker's machine. Bypasses firewall restrictions better than bind shells.",
        category: "Techniques",
        relatedTerms: ["Bind Shell", "Shell", "Netcat", "Payload"]
    },
    {
        term: "RFI",
        acronym: "Remote File Inclusion",
        definition: "A vulnerability that allows attackers to include files from remote servers, typically leading to code execution.",
        category: "Vulnerabilities",
        relatedTerms: ["LFI", "File Inclusion", "RCE"]
    },
    {
        term: "Rootkit",
        definition: "Malware designed to hide its presence and provide persistent privileged access. Often modifies operating system kernel. Very difficult to detect and remove.",
        category: "Techniques",
        relatedTerms: ["Malware", "Persistence", "Stealth"]
    },
    {
        term: "RSA",
        definition: "An asymmetric encryption algorithm using key pairs (public/private). Named after inventors Rivest, Shamir, Adleman. Used for secure key exchange and digital signatures.",
        category: "Cryptography",
        relatedTerms: ["Encryption", "Public Key", "Private Key"]
    },
    // S
    {
        term: "Salt",
        definition: "Random data added to passwords before hashing to prevent rainbow table attacks. Each password gets a unique salt, making precomputed attacks infeasible.",
        category: "Cryptography",
        relatedTerms: ["Hash", "Bcrypt", "Rainbow Table"]
    },
    {
        term: "Same-Origin Policy",
        definition: "A browser security mechanism that restricts scripts from one origin (domain) from accessing data from another origin. Prevents many attacks but sometimes bypassed.",
        category: "Protocols",
        relatedTerms: ["CORS", "XSS", "Web Security"]
    },
    {
        term: "Sandbox",
        definition: "An isolated environment for running untrusted code or analyzing malware without risking the host system. Used for testing and security analysis.",
        category: "Defense",
        relatedTerms: ["Virtual Machine", "Malware Analysis", "Isolation"]
    },
    {
        term: "Session",
        definition: "A way to maintain user state across HTTP requests. Typically uses cookies or tokens. Vulnerable to hijacking, fixation, and theft.",
        category: "Protocols",
        relatedTerms: ["Cookie", "Token", "Authentication"]
    },
    {
        term: "SHA256",
        definition: "A cryptographic hash function producing 256-bit hashes. Part of SHA-2 family. Widely used and considered secure (unlike MD5/SHA1). Bitcoin uses SHA256.",
        category: "Cryptography",
        relatedTerms: ["Hash", "SHA1", "Cryptography"]
    },
    {
        term: "Shell",
        definition: "A command-line interface for interacting with an operating system. In hacking context: gaining shell access means you can execute commands on the target.",
        category: "General",
        relatedTerms: ["Reverse Shell", "Web Shell", "Bash"]
    },
    {
        term: "Shodan",
        definition: "A search engine for internet-connected devices: webcams, routers, industrial systems, databases. Shows what devices are exposed online. Called 'Google for hackers'.",
        category: "Tools",
        relatedTerms: ["Reconnaissance", "IoT", "Search Engine"]
    },
    {
        term: "SIEM",
        acronym: "Security Information and Event Management",
        definition: "Software that aggregates and analyzes security data from multiple sources to detect threats. Examples: Splunk, ELK Stack, QRadar.",
        category: "Defense",
        relatedTerms: ["Log Analysis", "SOC", "Threat Detection"]
    },
    {
        term: "Social Engineering",
        definition: "Manipulating people into divulging confidential information or performing actions. Often more effective than technical attacks. Types: phishing, pretexting, baiting.",
        category: "Techniques",
        relatedTerms: ["Phishing", "Pretexting", "Human Factor"]
    },
    {
        term: "SOC",
        acronym: "Security Operations Center",
        definition: "A team and facility that monitors, detects, analyzes, and responds to cybersecurity incidents 24/7. Staffed by security analysts using SIEM and other tools.",
        category: "Defense",
        relatedTerms: ["SIEM", "Blue Team", "Incident Response"]
    },
    {
        term: "SQL Injection",
        definition: "Injecting malicious SQL code into application queries, allowing attackers to bypass authentication, extract data, or modify databases. OWASP Top 10 vulnerability.",
        category: "Vulnerabilities",
        relatedTerms: ["Injection", "SQLMap", "OWASP"]
    },
    {
        term: "SQLMap",
        definition: "An automated SQL injection tool that detects and exploits SQL injection vulnerabilities. Can dump databases, crack passwords, and execute OS commands.",
        category: "Tools",
        relatedTerms: ["SQL Injection", "Database", "Exploitation"]
    },
    {
        term: "SSH",
        acronym: "Secure Shell",
        definition: "An encrypted protocol for secure remote access to systems. Uses port 22 by default. Replaced insecure Telnet. Key-based authentication more secure than passwords.",
        category: "Protocols",
        relatedTerms: ["Remote Access", "Encryption", "Port 22"]
    },
    {
        term: "SSL/TLS",
        definition: "Protocols that encrypt communication between clients and servers. SSL is deprecated, use TLS 1.2 or 1.3. HTTPS = HTTP over TLS.",
        category: "Cryptography",
        relatedTerms: ["HTTPS", "Certificate", "Encryption"]
    },
    {
        term: "SSRF",
        acronym: "Server-Side Request Forgery",
        definition: "An attack where an attacker tricks a server into making requests to internal systems. Can access cloud metadata services, internal APIs, or databases.",
        category: "Vulnerabilities",
        relatedTerms: ["OWASP", "Cloud Metadata", "Internal Network"]
    },
    {
        term: "Stored XSS",
        definition: "A type of XSS where malicious script is permanently stored on the target server (database, forum, comment). Affects all users who view the infected page.",
        category: "Vulnerabilities",
        relatedTerms: ["XSS", "Reflected XSS", "Persistent XSS"]
    },
    {
        term: "Subdomain",
        definition: "A subdivision of a domain (e.g., blog.example.com is a subdomain of example.com). Often have different security configurations and may be vulnerable.",
        category: "Networking",
        relatedTerms: ["DNS", "Domain", "Subdomain Enumeration"]
    },
    // T
    {
        term: "Threat Intelligence",
        definition: "Information about threats, threat actors, tactics, and indicators of compromise (IoCs). Used to predict and prevent attacks.",
        category: "Defense",
        relatedTerms: ["MITRE ATT&CK", "IoC", "Threat Hunting"]
    },
    {
        term: "Token",
        definition: "A string representing authentication credentials. Types: session tokens, API tokens, JWT, OAuth tokens. Must be protected from theft.",
        category: "General",
        relatedTerms: ["JWT", "Session", "Authentication"]
    },
    {
        term: "Tor",
        acronym: "The Onion Router",
        definition: "A network that anonymizes internet traffic by routing it through multiple encrypted relays. Used to access the dark web and maintain privacy.",
        category: "Tools",
        relatedTerms: ["Dark Web", "Privacy", "Anonymity"]
    },
    {
        term: "Trojan",
        definition: "Malware disguised as legitimate software. Named after the Greek myth. Often delivers other payloads like RATs, ransomware, or keyloggers.",
        category: "Techniques",
        relatedTerms: ["Malware", "RAT", "Backdoor"]
    },
    {
        term: "TTPs",
        acronym: "Tactics, Techniques, and Procedures",
        definition: "Patterns of behavior by threat actors. Tactics = why, Techniques = how, Procedures = specific implementation. Core concept in MITRE ATT&CK.",
        category: "General",
        relatedTerms: ["MITRE ATT&CK", "Threat Intelligence", "IOC"]
    },
    // U
    {
        term: "URL Encoding",
        definition: "Converting special characters in URLs to percent-encoded format (e.g., space → %20, < → %3C). Used to bypass filters or inject payloads.",
        category: "Techniques",
        relatedTerms: ["Encoding", "Bypass", "Obfuscation"]
    },
    // V
    {
        term: "VAPT",
        acronym: "Vulnerability Assessment and Penetration Testing",
        definition: "Combined approach: vulnerability assessment identifies weaknesses, penetration testing exploits them to measure real impact.",
        category: "General",
        relatedTerms: ["Penetration Testing", "Vulnerability Scanning", "Security Audit"]
    },
    {
        term: "Virtual Machine",
        definition: "An emulated computer system running inside another computer. Used for safe malware analysis, pentesting practice, and isolating vulnerable systems.",
        category: "General",
        relatedTerms: ["Sandbox", "VMware", "VirtualBox"]
    },
    {
        term: "VPN",
        acronym: "Virtual Private Network",
        definition: "Encrypts internet connection and routes traffic through a remote server. Hides IP address and protects from eavesdropping on public WiFi.",
        category: "Defense",
        relatedTerms: ["Encryption", "Privacy", "Tunneling"]
    },
    {
        term: "Vulnerability",
        definition: "A weakness in a system that can be exploited to compromise security. The flaw itself, not the attack. Rated by CVSS score (0-10).",
        category: "General",
        relatedTerms: ["Exploit", "CVE", "CVSS"]
    },
    // W
    {
        term: "WAF",
        acronym: "Web Application Firewall",
        definition: "A firewall that filters, monitors, and blocks HTTP traffic to/from web applications. Protects against OWASP Top 10 and zero-day attacks.",
        category: "Defense",
        relatedTerms: ["Firewall", "Web Security", "ModSecurity"]
    },
    {
        term: "Web Shell",
        definition: "A script (PHP, ASP, JSP) uploaded to a web server that provides command execution through a web interface. Used to maintain persistence.",
        category: "Techniques",
        relatedTerms: ["Shell", "Backdoor", "File Upload"]
    },
    {
        term: "White Hat",
        definition: "An ethical hacker who uses their skills to improve security legally. Works with permission, follows responsible disclosure, and aims to protect systems.",
        category: "General",
        relatedTerms: ["Ethical Hacking", "Black Hat", "Gray Hat"]
    },
    {
        term: "Wireshark",
        definition: "The world's most popular network protocol analyzer. Captures and interactively analyzes network traffic. Essential tool for packet analysis and troubleshooting.",
        category: "Tools",
        relatedTerms: ["Packet Sniffing", "tcpdump", "Network Analysis"]
    },
    {
        term: "Worm",
        definition: "Self-replicating malware that spreads automatically across networks without user interaction. Famous examples: WannaCry, Morris Worm, Conficker.",
        category: "Techniques",
        relatedTerms: ["Malware", "Virus", "Ransomware"]
    },
    // X
    {
        term: "XSS",
        acronym: "Cross-Site Scripting",
        definition: "Injecting malicious JavaScript into web pages viewed by other users. Types: reflected, stored, DOM-based. Used to steal cookies, session tokens, or credentials.",
        category: "Vulnerabilities",
        relatedTerms: ["Injection", "JavaScript", "OWASP"]
    },
    // Z
    {
        term: "Zero-Day",
        definition: "A vulnerability unknown to the software vendor or public. Zero days for a patch to exist. Often sold for $50k-$1M+ on black markets or used by nation-states.",
        category: "Vulnerabilities",
        relatedTerms: ["CVE", "APT", "Exploit"]
    },
    {
        term: "Zombie",
        definition: "A compromised computer controlled remotely as part of a botnet. Owner is usually unaware their machine is being used for attacks.",
        category: "Techniques",
        relatedTerms: ["Botnet", "C&C", "DDoS"]
    }
];

const Glossary = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedLetter, setSelectedLetter] = useState<string>("All");

    const categories = ["All", "Tools", "Vulnerabilities", "Techniques", "Networking", "Cryptography", "General", "Protocols", "Defense"];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const filteredTerms = useMemo(() => {
        return glossaryTerms.filter(term => {
            const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                term.acronym?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === "All" || term.category === selectedCategory;

            const matchesLetter = selectedLetter === "All" ||
                term.term.toUpperCase().startsWith(selectedLetter);

            return matchesSearch && matchesCategory && matchesLetter;
        }).sort((a, b) => a.term.localeCompare(b.term));
    }, [searchTerm, selectedCategory, selectedLetter]);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Tools": return Terminal;
            case "Vulnerabilities": return Bug;
            case "Techniques": return Target;
            case "Networking": return Network;
            case "Cryptography": return Lock;
            case "Defense": return Shield;
            case "Protocols": return Code;
            default: return BookOpen;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Tools": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200";
            case "Vulnerabilities": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200";
            case "Techniques": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200";
            case "Networking": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200";
            case "Cryptography": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200";
            case "Defense": return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200";
            case "Protocols": return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200";
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold">Cybersecurity Glossary</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    200+ essential cybersecurity terms, acronyms, and definitions
                </p>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search & Filter
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search terms, definitions, or acronyms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Filter by Category</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const Icon = getCategoryIcon(category);
                                return (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className="text-xs"
                                    >
                                        <Icon className="h-3 w-3 mr-1" />
                                        {category}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Alphabet Navigation */}
                    <div>
                        <span className="text-sm font-medium mb-2 block">Jump to Letter</span>
                        <div className="flex flex-wrap gap-1">
                            <Button
                                variant={selectedLetter === "All" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedLetter("All")}
                                className="w-10 h-10 p-0"
                            >
                                All
                            </Button>
                            {alphabet.map((letter) => (
                                <Button
                                    key={letter}
                                    variant={selectedLetter === letter ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedLetter(letter)}
                                    className="w-10 h-10 p-0"
                                >
                                    {letter}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-muted-foreground">
                        Showing {filteredTerms.length} of {glossaryTerms.length} terms
                    </div>
                </CardContent>
            </Card>

            {/* Terms List */}
            <div className="space-y-3">
                {filteredTerms.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No terms found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filters
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTerms.map((term, index) => {
                        const Icon = getCategoryIcon(term.category);
                        return (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CardTitle className="text-xl">{term.term}</CardTitle>
                                                {term.acronym && (
                                                    <Badge variant="outline" className="text-xs font-normal">
                                                        {term.acronym}
                                                    </Badge>
                                                )}
                                            </div>
                                            <Badge className={`text-xs ${getCategoryColor(term.category)}`}>
                                                <Icon className="h-3 w-3 mr-1" />
                                                {term.category}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {term.definition}
                                    </p>
                                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                                        <div>
                                            <span className="text-sm font-medium mr-2">Related:</span>
                                            <div className="inline-flex flex-wrap gap-1">
                                                {term.relatedTerms.map((related, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {related}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Glossary;
