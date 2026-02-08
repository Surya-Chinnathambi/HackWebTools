import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Check, 
    X, 
    Loader2, 
    Key, 
    Eye, 
    EyeOff,
    RefreshCw,
    ExternalLink,
    ShieldCheck,
    Globe,
    Database,
    Code
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIConfig {
    name: string;
    key: string;
    envName: string;
    icon: any;
    color: string;
    url: string;
    description: string;
    freeUrl: string;
}

interface APIStatus {
    success: boolean;
    message: string;
    service: string;
    data?: any;
    error?: string;
}

const API_CONFIGS: APIConfig[] = [
    {
        name: "Gemini AI",
        key: "gemini",
        envName: "GEMINI_API_KEY",
        icon: Code,
        color: "text-blue-500",
        url: "https://makersuite.google.com/app/apikey",
        description: "Google's Gemini AI for security analysis and insights",
        freeUrl: "https://makersuite.google.com/app/apikey"
    },
    {
        name: "Shodan",
        key: "shodan",
        envName: "SHODAN_API_KEY",
        icon: Globe,
        color: "text-red-500",
        url: "https://account.shodan.io/register",
        description: "Internet-connected device search engine (100 queries/month free)",
        freeUrl: "https://account.shodan.io/register"
    },
    {
        name: "NVD",
        key: "nvd",
        envName: "NVD_API_KEY",
        icon: ShieldCheck,
        color: "text-green-500",
        url: "https://nvd.nist.gov/developers/request-an-api-key",
        description: "National Vulnerability Database for CVE information",
        freeUrl: "https://nvd.nist.gov/developers/request-an-api-key"
    },
    {
        name: "GitHub",
        key: "github",
        envName: "GITHUB_TOKEN",
        icon: Database,
        color: "text-purple-500",
        url: "https://github.com/settings/tokens",
        description: "GitHub personal access token (5000 requests/hour)",
        freeUrl: "https://github.com/settings/tokens"
    },
    {
        name: "AbuseIPDB",
        key: "abuseipdb",
        envName: "ABUSEIPDB_API_KEY",
        icon: ShieldCheck,
        color: "text-orange-500",
        url: "https://www.abuseipdb.com/register",
        description: "IP reputation and abuse reports (1000 checks/day free)",
        freeUrl: "https://www.abuseipdb.com/register"
    }
];

const APISettings = () => {
    const { toast } = useToast();
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
    const [testResults, setTestResults] = useState<Record<string, APIStatus>>({});
    const [testing, setTesting] = useState<Record<string, boolean>>({});
    const [testingAll, setTestingAll] = useState(false);

    // Load API keys from localStorage on mount
    useEffect(() => {
        const savedKeys: Record<string, string> = {};
        API_CONFIGS.forEach(config => {
            const saved = localStorage.getItem(`api_key_${config.key}`);
            if (saved) {
                savedKeys[config.key] = saved;
            }
        });
        setApiKeys(savedKeys);
    }, []);

    const handleKeyChange = (key: string, value: string) => {
        setApiKeys(prev => ({ ...prev, [key]: value }));
    };

    const saveKey = (key: string) => {
        const value = apiKeys[key];
        if (value) {
            localStorage.setItem(`api_key_${key}`, value);
            toast({
                title: "API Key Saved",
                description: `${API_CONFIGS.find(c => c.key === key)?.name} key saved locally`,
            });
        }
    };

    const toggleShowKey = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const testAPI = async (key: string) => {
        setTesting(prev => ({ ...prev, [key]: true }));
        
        try {
            const apiKey = apiKeys[key];
            const endpoint = key === "github" ? "token" : "apiKey";
            const paramName = key === "github" ? "token" : "apiKey";
            
            const url = apiKey 
                ? `http://localhost:5000/api/integrations/test/${key}?${paramName}=${apiKey}`
                : `http://localhost:5000/api/integrations/test/${key}`;

            const response = await fetch(url);
            const result = await response.json();

            setTestResults(prev => ({ ...prev, [key]: result }));

            toast({
                title: result.success ? "Connection Successful" : "Connection Failed",
                description: result.message,
                variant: result.success ? "default" : "destructive",
            });
        } catch (error) {
            const errorResult = {
                success: false,
                message: error instanceof Error ? error.message : "Network error",
                service: API_CONFIGS.find(c => c.key === key)?.name || key
            };
            
            setTestResults(prev => ({ ...prev, [key]: errorResult }));
            
            toast({
                title: "Test Failed",
                description: errorResult.message,
                variant: "destructive",
            });
        } finally {
            setTesting(prev => ({ ...prev, [key]: false }));
        }
    };

    const testAllAPIs = async () => {
        setTestingAll(true);
        
        try {
            const response = await fetch('http://localhost:5000/api/integrations/test/all');
            const data = await response.json();

            const resultsMap: Record<string, APIStatus> = {};
            data.results.forEach((result: APIStatus) => {
                const config = API_CONFIGS.find(c => c.name === result.service);
                if (config) {
                    resultsMap[config.key] = result;
                }
            });

            setTestResults(resultsMap);

            toast({
                title: "API Tests Complete",
                description: `${data.connected}/${data.total} APIs connected successfully`,
                variant: data.connected === data.total ? "default" : "destructive",
            });
        } catch (error) {
            toast({
                title: "Test Failed",
                description: error instanceof Error ? error.message : "Network error",
                variant: "destructive",
            });
        } finally {
            setTestingAll(false);
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">API Integrations</h1>
                        <p className="text-muted-foreground">
                            Configure and test your API keys for enhanced features
                        </p>
                    </div>
                    <Button
                        onClick={testAllAPIs}
                        disabled={testingAll}
                        size="lg"
                        className="gap-2"
                    >
                        {testingAll ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Testing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4" />
                                Test All APIs
                            </>
                        )}
                    </Button>
                </div>

                <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            How to Use
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            1. Click the links to get your free API keys from each service
                        </p>
                        <p className="text-sm text-muted-foreground">
                            2. Paste your API keys in the input fields below
                        </p>
                        <p className="text-sm text-muted-foreground">
                            3. Click "Save & Test" to verify each connection
                        </p>
                        <p className="text-sm text-muted-foreground">
                            4. Keys are stored locally in your browser for security
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    {API_CONFIGS.map((config, index) => {
                        const Icon = config.icon;
                        const result = testResults[config.key];
                        const isConfigured = !!apiKeys[config.key];

                        return (
                            <motion.div
                                key={config.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${config.color}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <CardTitle className="flex items-center gap-2">
                                                        {config.name}
                                                        {result && (
                                                            <Badge variant={result.success ? "default" : "destructive"}>
                                                                {result.success ? (
                                                                    <><Check className="h-3 w-3 mr-1" /> Connected</>
                                                                ) : (
                                                                    <><X className="h-3 w-3 mr-1" /> Failed</>
                                                                )}
                                                            </Badge>
                                                        )}
                                                    </CardTitle>
                                                    <CardDescription>{config.description}</CardDescription>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <a href={config.freeUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                    Get API Key
                                                </a>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <Input
                                                    type={showKeys[config.key] ? "text" : "password"}
                                                    placeholder={`Enter your ${config.name} API key`}
                                                    value={apiKeys[config.key] || ""}
                                                    onChange={(e) => handleKeyChange(config.key, e.target.value)}
                                                    className="pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full"
                                                    onClick={() => toggleShowKey(config.key)}
                                                >
                                                    {showKeys[config.key] ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    saveKey(config.key);
                                                    testAPI(config.key);
                                                }}
                                                disabled={!apiKeys[config.key] || testing[config.key]}
                                            >
                                                {testing[config.key] ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    "Save & Test"
                                                )}
                                            </Button>
                                        </div>

                                        {result && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className={`p-4 rounded-lg ${
                                                    result.success
                                                        ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                                                        : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                                                }`}
                                            >
                                                <p className={`font-medium ${result.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                                                    {result.message}
                                                </p>
                                                {result.data && (
                                                    <pre className="mt-2 text-xs opacity-70 overflow-auto">
                                                        {JSON.stringify(result.data, null, 2)}
                                                    </pre>
                                                )}
                                            </motion.div>
                                        )}

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {config.envName}
                                            </code>
                                            <span>•</span>
                                            <span>{isConfigured ? "Configured" : "Not configured"}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default APISettings;
