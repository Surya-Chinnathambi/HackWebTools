import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

interface CommandHistory {
    command: string;
    output: string;
}

const VirtualTerminal = () => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<CommandHistory[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const simulateCommand = (cmd: string): string => {
        const trimmedCmd = cmd.trim().toLowerCase();

        // Help command
        if (trimmedCmd === "help") {
            return `Available commands:
  nmap      - Network scanner
  sqlmap    - SQL injection tool
  nikto     - Web server scanner
  gobuster  - Directory/file brute forcer
  theharvester - Email/subdomain harvester
  help      - Show this help message
  clear     - Clear terminal

Example: nmap -sV 192.168.1.1`;
        }

        // Clear command
        if (trimmedCmd === "clear") {
            setHistory([]);
            return "";
        }

        // Nmap simulation
        if (trimmedCmd.startsWith("nmap")) {
            const target = trimmedCmd.includes("192.168.1") ? "192.168.1.1" : "target";
            return `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${target}
Host is up (0.00043s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.2p1 Ubuntu
80/tcp   open  http        Apache httpd 2.4.41
443/tcp  open  ssl/http    Apache httpd 2.4.41
3306/tcp open  mysql       MySQL 5.7.33

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.45 seconds`;
        }

        // SQLMap simulation
        if (trimmedCmd.startsWith("sqlmap")) {
            return `        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.8.1#stable}
|_ -| . [']     | .'| . |
|___|_  ["]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] starting @ 14:23:45 /2026/

[14:23:45] [INFO] testing connection to the target URL
[14:23:46] [INFO] checking if the target is protected by some kind of WAF/IPS
[14:23:46] [INFO] testing if the target URL content is stable
[14:23:47] [INFO] target URL content is stable
[14:23:47] [INFO] testing if GET parameter 'id' is dynamic
[14:23:47] [WARNING] GET parameter 'id' does not appear to be dynamic
[14:23:48] [INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable (possible DBMS: 'MySQL')
[14:23:48] [INFO] testing for SQL injection on GET parameter 'id'
it looks like the back-end DBMS is 'MySQL'. Do you want to skip test payloads specific for other DBMSes? [Y/n] Y
[14:23:49] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[14:23:50] [INFO] GET parameter 'id' appears to be 'AND boolean-based blind - WHERE or HAVING clause' injectable 
[14:23:51] [INFO] testing 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)'
[14:23:51] [INFO] GET parameter 'id' is 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)' injectable 
[14:23:52] [INFO] testing 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)'
[14:23:52] [INFO] GET parameter 'id' appears to be 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)' injectable 
GET parameter 'id' is vulnerable. Do you want to keep testing the others (if any)? [y/N] N
sqlmap identified the following injection point(s) with a total of 45 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 5821=5821

    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: id=1 AND (SELECT 1234 FROM(SELECT COUNT(*),CONCAT(0x7178706b71,(SELECT (ELT(1234=1234,1))),0x7176787071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: id=1 AND (SELECT 1234 FROM (SELECT(SLEEP(5)))XXXX)
---
[14:23:53] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Apache 2.4.41
back-end DBMS: MySQL >= 5.0
[14:23:53] [INFO] fetched data logged to text files under '/root/.local/share/sqlmap/output/vulnerable-site.com'

[*] ending @ 14:23:53 /2026/`;
        }

        // Nikto simulation
        if (trimmedCmd.startsWith("nikto")) {
            const target = trimmedCmd.match(/http[s]?:\/\/[^\s]+/)?.[0] || "http://target.com";
            return `- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          192.168.1.1
+ Target Hostname:    ${target}
+ Target Port:        80
+ Start Time:         2026-02-05 14:25:01 (GMT0)
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type.
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Apache/2.4.41 appears to be outdated (current is at least Apache/2.4.54). Apache 2.2.34 is the EOL for the 2.x branch.
+ Server may leak inodes via ETags, header found with file /, inode: 2c3e, size: 5c8a9d6c0e0c0, mtime: gzip
+ Allowed HTTP Methods: GET, POST, OPTIONS, HEAD 
+ OSVDB-3233: /icons/README: Apache default file found.
+ OSVDB-3092: /admin/: This might be interesting...
+ OSVDB-3092: /admin/login.php: Admin login page/section found.
+ OSVDB-3268: /css/: Directory indexing found.
+ OSVDB-3092: /phpmyadmin/: phpMyAdmin directory found
+ 8908 requests: 0 error(s) and 11 item(s) reported on remote host
+ End Time:           2026-02-05 14:27:42 (GMT0) (161 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested`;
        }

        // Gobuster simulation
        if (trimmedCmd.startsWith("gobuster")) {
            return `===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://target.com
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.htaccess            (Status: 403) [Size: 277]
/.hta                 (Status: 403) [Size: 277]
/.htpasswd            (Status: 403) [Size: 277]
/admin                (Status: 301) [Size: 312] [--> http://target.com/admin/]
/api                  (Status: 301) [Size: 310] [--> http://target.com/api/]
/assets               (Status: 301) [Size: 313] [--> http://target.com/assets/]
/backup               (Status: 301) [Size: 313] [--> http://target.com/backup/]
/config               (Status: 301) [Size: 313] [--> http://target.com/config/]
/css                  (Status: 301) [Size: 310] [--> http://target.com/css/]
/db                   (Status: 301) [Size: 309] [--> http://target.com/db/]
/images               (Status: 301) [Size: 313] [--> http://target.com/images/]
/index.php            (Status: 200) [Size: 10918]
/js                   (Status: 301) [Size: 309] [--> http://target.com/js/]
/login                (Status: 200) [Size: 1523]
/upload               (Status: 301) [Size: 313] [--> http://target.com/upload/]
/uploads              (Status: 301) [Size: 314] [--> http://target.com/uploads/]
Progress: 4614 / 4615 (99.98%)
===============================================================
Finished
===============================================================`;
        }

        // theHarvester simulation
        if (trimmedCmd.startsWith("theharvester") || trimmedCmd.startsWith("harvester")) {
            return `*******************************************************************
*  _   _                                            _             *
* | |_| |__   ___    /\\  /\\__ _ _ ____   _____  ___| |_ ___ _ __  *
* | __|  _ \\ / _ \\  / /_/ / _\` | '__\\ \\ / / _ \\/ __| __/ _ \\ '__| *
* | |_| | | |  __/ / __  / (_| | |   \\ V /  __/\\__ \\ ||  __/ |    *
*  \\__|_| |_|\\___| \\/ /_/ \\__,_|_|    \\_/ \\___||___/\\__\\___|_|    *
*                                                                   *
* theHarvester 4.5.1                                                *
* Coded by Christian Martorella                                     *
* Edge-Security Research                                            *
* cmartorella@edge-security.com                                     *
*                                                                   *
*******************************************************************

[*] Target: example.com

[*] Searching in Google:
    Searching 0 results.
    Searching 100 results.

[*] Hosts found: 12
---------------------
admin.example.com
api.example.com
blog.example.com
dev.example.com
mail.example.com
shop.example.com
staging.example.com
support.example.com
test.example.com
vpn.example.com
webmail.example.com
www.example.com

[*] IPs found: 4
------------------
192.168.1.1
192.168.1.2
192.168.1.10
192.168.1.20

[*] Emails found: 7
------------------
admin@example.com
contact@example.com
info@example.com
security@example.com
support@example.com
sales@example.com
webmaster@example.com`;
        }

        // Unknown command
        return `bash: ${cmd}: command not found
Type 'help' to see available commands`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const output = simulateCommand(input);

        if (input.trim().toLowerCase() !== "clear") {
            setHistory([...history, { command: input, output }]);
        }

        setCommandHistory([...commandHistory, input]);
        setHistoryIndex(-1);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
            setHistoryIndex(newIndex);
            setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
            setHistoryIndex(newIndex);
            setInput(newIndex === -1 ? "" : commandHistory[commandHistory.length - 1 - newIndex]);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-slate-900 rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                <Terminal className="h-4 w-4 text-green-500" />
                <span className="text-sm text-slate-300 font-mono">kali@hackwebtools:~</span>
            </div>

            <div
                ref={terminalRef}
                className="bg-slate-950 p-4 rounded-b-lg font-mono text-sm h-[600px] overflow-y-auto"
                onClick={() => inputRef.current?.focus()}
            >
                {/* Welcome message */}
                <div className="text-green-500 mb-4">
                    <p>┌──(kali㉿hackwebtools)-[~]</p>
                    <p>└─$ Welcome to HackWebTools Virtual Terminal</p>
                    <p className="text-slate-400 mt-2">Type 'help' to see available commands</p>
                </div>

                {/* Command history */}
                {history.map((item, idx) => (
                    <div key={idx} className="mb-4">
                        <div className="flex items-start gap-2 text-green-500">
                            <span className="flex-shrink-0">┌──(kali㉿hackwebtools)-[~]</span>
                        </div>
                        <div className="flex items-start gap-2 text-green-500">
                            <span className="flex-shrink-0">└─$</span>
                            <span className="text-slate-300">{item.command}</span>
                        </div>
                        {item.output && (
                            <pre className="text-slate-400 mt-2 whitespace-pre-wrap leading-relaxed">
                                {item.output}
                            </pre>
                        )}
                    </div>
                ))}

                {/* Input prompt */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                    <div className="text-green-500">
                        <span>┌──(kali㉿hackwebtools)-[~]</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                        <span className="flex-shrink-0">└─$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent border-none outline-none text-slate-300 font-mono"
                            autoFocus
                            spellCheck={false}
                            aria-label="Terminal command input"
                            placeholder="Type 'help' for available commands"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VirtualTerminal;
