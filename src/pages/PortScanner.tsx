import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Network,
    AlertTriangle,
    Wifi,
    WifiOff,
    Search,
    Server,
    Shield,
    Zap,
    Activity,
    Globe,
    Clock
} from "lucide-react";

interface Port {
    port: number;
    protocol: "tcp" | "udp";
    state: "open" | "closed" | "filtered";
    service: string;
    version?: string;
    banner?: string;
}

interface ScanResult {
    host: string;
    ip: string;
    status: "online" | "offline";
    ports: Port[];
    os?: string;
    timestamp: string;
    scanDuration: number;
}

interface ServiceInfo {
    name: string;
    description: string;
    risk: "critical" | "high" | "medium" | "low";
}

interface CommonPort {
    port: number;
    service: string;
    protocol: "tcp" | "udp";
    risk: "critical" | "high" | "medium" | "low";
}

const commonPorts: CommonPort[] = [
    { port: 21, service: "FTP", protocol: "tcp", risk: "medium" },
    { port: 22, service: "SSH", protocol: "tcp", risk: "low" },
    { port: 23, service: "Telnet", protocol: "tcp", risk: "critical" },
    { port: 25, service: "SMTP", protocol: "tcp", risk: "medium" },
    { port: 53, service: "DNS", protocol: "udp", risk: "low" },
    { port: 80, service: "HTTP", protocol: "tcp", risk: "low" },
    { port: 110, service: "POP3", protocol: "tcp", risk: "medium" },
    { port: 143, service: "IMAP", protocol: "tcp", risk: "medium" },
    { port: 443, service: "HTTPS", protocol: "tcp", risk: "low" },
    { port: 445, service: "SMB", protocol: "tcp", risk: "high" },
    { port: 3306, service: "MySQL", protocol: "tcp", risk: "high" },
    { port: 3389, service: "RDP", protocol: "tcp", risk: "high" },
    { port: 5432, service: "PostgreSQL", protocol: "tcp", risk: "high" },
    { port: 5900, service: "VNC", protocol: "tcp", risk: "high" },
    { port: 6379, service: "Redis", protocol: "tcp", risk: "high" },
    { port: 8080, service: "HTTP-Proxy", protocol: "tcp", risk: "medium" },
    { port: 8443, service: "HTTPS-Alt", protocol: "tcp", risk: "medium" },
    { port: 27017, service: "MongoDB", protocol: "tcp", risk: "high" }
];

const serviceDescriptions: Record<string, ServiceInfo> = {
    "FTP": {
        name: "File Transfer Protocol",
        description: "Used for transferring files between client and server. Often misconfigured with anonymous access.",
        risk: "medium"
    },
    "SSH": {
        name: "Secure Shell",
        description: "Encrypted remote login service. Check for weak credentials and outdated versions.",
        risk: "low"
    },
    "Telnet": {
        name: "Telnet Protocol",
        description: "⚠️ CRITICAL: Unencrypted remote login! All data transmitted in plaintext including passwords.",
        risk: "critical"
    },
    "HTTP": {
        name: "Hypertext Transfer Protocol",
        description: "Web server. Check for unencrypted data transmission and web vulnerabilities.",
        risk: "low"
    },
    "HTTPS": {
        name: "HTTP Secure",
        description: "Encrypted web traffic. Verify SSL/TLS configuration and certificate validity.",
        risk: "low"
    },
    "SMB": {
        name: "Server Message Block",
        description: "File and printer sharing protocol. Vulnerable to EternalBlue and other SMB exploits.",
        risk: "high"
    },
    "RDP": {
        name: "Remote Desktop Protocol",
        description: "Windows remote desktop access. Common target for brute force attacks.",
        risk: "high"
    },
    "MySQL": {
        name: "MySQL Database",
        description: "Database server. Should not be exposed to internet. Check for default credentials.",
        risk: "high"
    },
    "PostgreSQL": {
        name: "PostgreSQL Database",
        description: "Database server. Verify authentication requirements and network exposure.",
        risk: "high"
    },
    "MongoDB": {
        name: "MongoDB Database",
        description: "NoSQL database. Often found with no authentication enabled by default.",
        risk: "high"
    },
    "Redis": {
        name: "Redis Cache",
        description: "In-memory database. Frequently exposed without authentication.",
        risk: "high"
    }
};

const PortScanner = () => {
    const [target, setTarget] = useState("192.168.1.1");
    const [scanType, setScanType] = useState<"quick" | "common" | "full" | "custom">("common");
    const [customPorts, setCustomPorts] = useState("80,443,8080");
    const [scanResults, setScanResults] = useState<ScanResult[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [enableServiceDetection, setEnableServiceDetection] = useState(true);
    const [enableOSDetection, setEnableOSDetection] = useState(false);

    const getPortRange = (): number[] => {
        switch (scanType) {
            case "quick":
                return [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3389, 8080];
            case "common":
                return commonPorts.map(p => p.port);
            case "full":
                // Simulate full scan with top 100 ports
                return Array.from({ length: 100 }, (_, i) => i + 1);
            case "custom":
                return customPorts.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p) && p > 0 && p <= 65535);
            default:
                return [];
        }
    };

    const simulatePortScan = async (host: string, port: number): Promise<Port> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

        const portInfo = commonPorts.find(p => p.port === port);
        const isOpen = Math.random() > 0.7; // 30% chance of being open

        if (isOpen && portInfo) {
            const versions = [
                "OpenSSH 8.2p1",
                "Apache httpd 2.4.41",
                "nginx 1.18.0",
                "Microsoft ftpd",
                "MySQL 5.7.31",
                "PostgreSQL 12.4",
                "Microsoft Terminal Services",
                "MongoDB 4.4.1"
            ];

            return {
                port: port,
                protocol: portInfo.protocol,
                state: "open",
                service: portInfo.service,
                version: enableServiceDetection ? versions[Math.floor(Math.random() * versions.length)] : undefined,
                banner: enableServiceDetection ? `220 ${portInfo.service} Server Ready` : undefined
            };
        } else if (Math.random() > 0.5) {
            return {
                port: port,
                protocol: "tcp",
                state: "closed",
                service: portInfo?.service || "unknown"
            };
        } else {
            return {
                port: port,
                protocol: "tcp",
                state: "filtered",
                service: portInfo?.service || "unknown"
            };
        }
    };

    const runScan = async () => {
        if (!target) {
            alert("Please enter a target host or IP address");
            return;
        }

        setIsScanning(true);
        setScanProgress(0);

        const startTime = Date.now();
        const portsToScan = getPortRange();
        const scannedPorts: Port[] = [];

        for (let i = 0; i < portsToScan.length; i++) {
            const portResult = await simulatePortScan(target, portsToScan[i]);
            if (portResult.state === "open") {
                scannedPorts.push(portResult);
            }
            setScanProgress(((i + 1) / portsToScan.length) * 100);
        }

        const endTime = Date.now();
        const scanDuration = (endTime - startTime) / 1000;

        // Simulate OS detection
        const osOptions = [
            "Linux 5.4.0-x86_64",
            "Windows Server 2019",
            "Ubuntu 20.04 LTS",
            "CentOS 8",
            "macOS 11.0",
            "Debian GNU/Linux 10"
        ];

        const result: ScanResult = {
            host: target,
            ip: target.match(/^\d+\.\d+\.\d+\.\d+$/) ? target : `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
            status: scannedPorts.length > 0 ? "online" : "offline",
            ports: scannedPorts,
            os: enableOSDetection ? osOptions[Math.floor(Math.random() * osOptions.length)] : undefined,
            timestamp: new Date().toISOString(),
            scanDuration
        };

        setScanResults([result, ...scanResults]);
        setIsScanning(false);
    };

    const getStateColor = (state: Port["state"]) => {
        switch (state) {
            case "open":
                return "text-green-600 bg-green-50 border-green-200";
            case "closed":
                return "text-gray-600 bg-gray-50 border-gray-200";
            case "filtered":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "critical":
                return "text-red-600 bg-red-50 border-red-200";
            case "high":
                return "text-orange-600 bg-orange-50 border-orange-200";
            case "medium":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "low":
                return "text-blue-600 bg-blue-50 border-blue-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const exportResults = () => {
        if (scanResults.length === 0) return;

        const exportData = JSON.stringify(scanResults, null, 2);
        const blob = new Blob([exportData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `port-scan-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const totalOpenPorts = scanResults.reduce((acc, result) => acc + result.ports.length, 0);
    const criticalServices = scanResults.reduce((acc, result) => {
        return acc + result.ports.filter(p => {
            const portInfo = commonPorts.find(cp => cp.port === p.port);
            return portInfo?.risk === "critical" || portInfo?.risk === "high";
        }).length;
    }, 0);

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Network className="h-8 w-8 text-primary" />
                    Network Port Scanner
                </h1>
                <p className="text-muted-foreground">
                    Discover open ports and identify running services on target systems
                </p>
            </div>

            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    ⚠️ <strong>Legal Notice:</strong> Only scan networks and systems you own or have explicit authorization to test.
                    Unauthorized port scanning may violate laws and network policies. This is a simulated educational tool.
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="scanner" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="scanner">
                        <Search className="h-4 w-4 mr-2" />
                        Port Scanner
                    </TabsTrigger>
                    <TabsTrigger value="results">
                        <Activity className="h-4 w-4 mr-2" />
                        Results ({scanResults.length})
                    </TabsTrigger>
                    <TabsTrigger value="services">
                        <Server className="h-4 w-4 mr-2" />
                        Service Info
                    </TabsTrigger>
                </TabsList>

                {/* Scanner Tab */}
                <TabsContent value="scanner" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configure Scan</CardTitle>
                            <CardDescription>
                                Set target and scan parameters
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="target">Target Host or IP Address</Label>
                                <Input
                                    id="target"
                                    placeholder="192.168.1.1 or example.com"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scan-type">Scan Type</Label>
                                <Select value={scanType} onValueChange={(value: any) => setScanType(value)}>
                                    <SelectTrigger id="scan-type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="quick">
                                            Quick Scan (12 most common ports)
                                        </SelectItem>
                                        <SelectItem value="common">
                                            Common Ports (Top 18 services)
                                        </SelectItem>
                                        <SelectItem value="full">
                                            Full Scan (Top 100 ports)
                                        </SelectItem>
                                        <SelectItem value="custom">
                                            Custom Port Range
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {scanType === "custom" && (
                                <div className="space-y-2">
                                    <Label htmlFor="custom-ports">Custom Ports (comma-separated)</Label>
                                    <Input
                                        id="custom-ports"
                                        placeholder="80,443,8080,3306"
                                        value={customPorts}
                                        onChange={(e) => setCustomPorts(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter port numbers separated by commas (e.g., 80,443,8080)
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="text-sm font-medium">Advanced Options</h4>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="service-detection">Service Version Detection</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Identify service versions and banners
                                        </p>
                                    </div>
                                    <Switch
                                        id="service-detection"
                                        checked={enableServiceDetection}
                                        onCheckedChange={setEnableServiceDetection}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="os-detection">OS Detection</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Attempt to identify target operating system
                                        </p>
                                    </div>
                                    <Switch
                                        id="os-detection"
                                        checked={enableOSDetection}
                                        onCheckedChange={setEnableOSDetection}
                                    />
                                </div>
                            </div>

                            {isScanning && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Scanning ports...</span>
                                        <span className="font-medium">{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-primary rounded-full h-2 transition-all duration-300"
                                            style={{ width: `${scanProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={runScan}
                                disabled={isScanning}
                                className="w-full"
                                size="lg"
                            >
                                {isScanning ? (
                                    <>
                                        <Activity className="h-4 w-4 mr-2 animate-pulse" />
                                        Scanning... {Math.round(scanProgress)}%
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4 mr-2" />
                                        Start Port Scan
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {scanResults.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Scan Statistics</CardTitle>
                                    <Button onClick={exportResults} variant="outline" size="sm">
                                        Export Results
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-primary">{scanResults.length}</div>
                                        <div className="text-sm text-muted-foreground">Hosts Scanned</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{totalOpenPorts}</div>
                                        <div className="text-sm text-muted-foreground">Open Ports</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{criticalServices}</div>
                                        <div className="text-sm text-muted-foreground">High Risk</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {scanResults[0]?.scanDuration.toFixed(2)}s
                                        </div>
                                        <div className="text-sm text-muted-foreground">Last Scan Time</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results" className="space-y-4">
                    {scanResults.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No scan results yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Run a port scan to see results here
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        scanResults.map((result, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {result.status === "online" ? (
                                                    <Wifi className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <WifiOff className="h-5 w-5 text-gray-400" />
                                                )}
                                                {result.host}
                                            </CardTitle>
                                            <CardDescription>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1">
                                                        <Globe className="h-3 w-3" />
                                                        {result.ip}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(result.timestamp).toLocaleString()}
                                                    </span>
                                                    <span>
                                                        Scan time: {result.scanDuration.toFixed(2)}s
                                                    </span>
                                                </div>
                                            </CardDescription>
                                        </div>
                                        <Badge className={result.status === "online" ? "bg-green-600" : "bg-gray-400"}>
                                            {result.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {result.os && (
                                        <Alert>
                                            <Server className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Detected OS:</strong> {result.os}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {result.ports.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-4">
                                            No open ports found
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Open Ports ({result.ports.length})</h4>
                                            <div className="grid gap-2">
                                                {result.ports.map((port, portIndex) => {
                                                    const portInfo = commonPorts.find(p => p.port === port.port);
                                                    const serviceInfo = serviceDescriptions[port.service];

                                                    return (
                                                        <div
                                                            key={portIndex}
                                                            className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono font-bold text-lg">{port.port}</span>
                                                                    <Badge className={getStateColor(port.state)}>
                                                                        {port.state}
                                                                    </Badge>
                                                                    <Badge variant="outline">
                                                                        {port.protocol.toUpperCase()}
                                                                    </Badge>
                                                                </div>
                                                                {portInfo && (
                                                                    <Badge className={getRiskColor(portInfo.risk)}>
                                                                        {portInfo.risk.toUpperCase()}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="space-y-1 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Server className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium">{port.service}</span>
                                                                    {port.version && (
                                                                        <span className="text-muted-foreground">- {port.version}</span>
                                                                    )}
                                                                </div>

                                                                {serviceInfo && (
                                                                    <p className="text-muted-foreground ml-6">
                                                                        {serviceInfo.description}
                                                                    </p>
                                                                )}

                                                                {port.banner && (
                                                                    <div className="ml-6 p-2 bg-muted rounded text-xs font-mono mt-2">
                                                                        {port.banner}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Common Services & Ports</CardTitle>
                            <CardDescription>
                                Reference guide for commonly scanned network services
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                {commonPorts.map((port) => {
                                    const serviceInfo = serviceDescriptions[port.service];

                                    return (
                                        <div key={port.port} className="p-4 border rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl font-mono font-bold">{port.port}</div>
                                                    <div>
                                                        <div className="font-medium">{port.service}</div>
                                                        {serviceInfo && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {serviceInfo.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant="outline">{port.protocol.toUpperCase()}</Badge>
                                                    <Badge className={getRiskColor(port.risk)}>
                                                        {port.risk.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {serviceInfo && (
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    {serviceInfo.description}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PortScanner;
