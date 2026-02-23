"""
Security Tools API Routes
/api/v1/tools endpoints for CVE, DNS, Exploits, Scanning, SSL, Threat Intelligence
"""
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import httpx
import os
import re
import socket
import ssl
import certifi
from urllib.parse import urlparse

router = APIRouter(prefix="/tools", tags=["Security Tools"])


# Request/Response Models
class CVESearchRequest(BaseModel):
    keyword: str
    results_per_page: int = 20
    start_index: int = 0


class ExploitSearchRequest(BaseModel):
    query: str
    page: int = 1
    limit: int = 20


class HeaderScanRequest(BaseModel):
    url: HttpUrl


class IPThreatRequest(BaseModel):
    ip: str


class DomainThreatRequest(BaseModel):
    domain: str


class ReportGenerateRequest(BaseModel):
    projectName: str
    findings: List[Dict[str, Any]] = []
    executiveSummary: Optional[str] = None
    scope: Optional[str] = None


# ========== CVE ENDPOINTS ==========

@router.get("/cve/search")
async def search_cves(
    keyword: str = Query(..., description="Keyword to search for"),
    results_per_page: int = Query(20, ge=1, le=100),
    start_index: int = Query(0, ge=0)
):
    """
    Search for CVEs using NVD API
    
    - **keyword**: Search term (e.g., "apache", "linux kernel")
    - **results_per_page**: Number of results (1-100)
    - **start_index**: Pagination offset
    
    Rate limit: 5 requests/30s without API key, 50 requests/30s with key
    """
    try:
        nvd_api_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
        
        params = {
            "keywordSearch": keyword,
            "resultsPerPage": results_per_page,
            "startIndex": start_index
        }
        
        headers = {}
        if os.getenv("NVD_API_KEY"):
            headers["apiKey"] = os.getenv("NVD_API_KEY")
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(nvd_api_url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
        
        # Parse CVE data
        cves = []
        for item in data.get("vulnerabilities", []):
            cve = item.get("cve", {})
            
            # Get CVSS metrics
            metrics = None
            if cve.get("metrics", {}).get("cvssMetricV31"):
                metrics = cve["metrics"]["cvssMetricV31"][0]
            elif cve.get("metrics", {}).get("cvssMetricV2"):
                metrics = cve["metrics"]["cvssMetricV2"][0]
            
            cvss_data = None
            if metrics:
                cvss_data = {
                    "version": metrics["cvssData"]["version"],
                    "score": metrics["cvssData"]["baseScore"],
                    "severity": metrics["cvssData"].get("baseSeverity") or metrics.get("baseSeverity"),
                    "vector": metrics["cvssData"]["vectorString"]
                }
            
            # Get English description
            description = "No description"
            for desc in cve.get("descriptions", []):
                if desc.get("lang") == "en":
                    description = desc.get("value", "No description")
                    break
            
            # Get references
            references = []
            for ref in cve.get("references", []):
                references.append({
                    "url": ref.get("url"),
                    "source": ref.get("source")
                })
            
            cves.append({
                "id": cve.get("id"),
                "description": description,
                "published": cve.get("published"),
                "last_modified": cve.get("lastModified"),
                "cvss": cvss_data,
                "references": references
            })
        
        return {
            "total": data.get("totalResults", 0),
            "results": cves,
            "start_index": start_index,
            "results_per_page": results_per_page
        }
    
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail={"error": "Rate limit exceeded. Wait 30 seconds.", "retry_after": 30}
            )
        raise HTTPException(status_code=500, detail=f"NVD API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CVE search failed: {str(e)}")


@router.get("/cve/recent")
async def get_recent_cves(
    days: int = Query(7, ge=1, le=120, description="Number of days to look back"),
    results_per_page: int = Query(20, ge=1, le=100)
):
    """
    Get recently published CVEs
    
    - **days**: Look back period (1-120 days)
    - **results_per_page**: Number of results (1-100)
    """
    try:
        pub_end_date = datetime.utcnow()
        pub_start_date = pub_end_date - timedelta(days=days)
        
        nvd_api_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
        
        params = {
            "pubStartDate": pub_start_date.isoformat(),
            "pubEndDate": pub_end_date.isoformat(),
            "resultsPerPage": results_per_page
        }
        
        headers = {}
        if os.getenv("NVD_API_KEY"):
            headers["apiKey"] = os.getenv("NVD_API_KEY")
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(nvd_api_url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
        
        cves = []
        for item in data.get("vulnerabilities", []):
            cve = item.get("cve", {})
            
            # Get highest CVSS score
            metrics = None
            if cve.get("metrics", {}).get("cvssMetricV31"):
                metrics = cve["metrics"]["cvssMetricV31"][0]
            elif cve.get("metrics", {}).get("cvssMetricV2"):
                metrics = cve["metrics"]["cvssMetricV2"][0]
            
            cvss_score = metrics["cvssData"]["baseScore"] if metrics else None
            cvss_severity = (metrics["cvssData"].get("baseSeverity") or 
                           metrics.get("baseSeverity")) if metrics else "UNKNOWN"
            
            description = "No description"
            for desc in cve.get("descriptions", []):
                if desc.get("lang") == "en":
                    description = desc.get("value", "No description")
                    break
            
            cves.append({
                "id": cve.get("id"),
                "description": description[:200] + "..." if len(description) > 200 else description,
                "published": cve.get("published"),
                "cvss_score": cvss_score,
                "severity": cvss_severity
            })
        
        return {
            "days": days,
            "total": len(cves),
            "cves": cves
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recent CVEs: {str(e)}")


# ========== DNS ENDPOINTS ==========

@router.get("/dns/lookup")
async def dns_lookup(
    domain: str = Query(..., description="Domain to lookup"),
    record_type: str = Query("A", description="Record type: A, AAAA, MX, TXT, NS, CNAME")
):
    """
    Perform DNS lookup
    
    - **domain**: Domain name to query
    - **record_type**: A, AAAA, MX, TXT, NS, CNAME
    """
    try:
        # Clean domain
        domain = domain.strip().lower()
        domain = re.sub(r'^https?://', '', domain)
        domain = domain.split('/')[0].split(':')[0]
        
        # Validate domain format
        if not re.match(r'^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$', domain):
            raise HTTPException(status_code=400, detail="Invalid domain format")
        
        record_type = record_type.upper()
        records = []
        
        if record_type == "A":
            records = socket.getaddrinfo(domain, None, socket.AF_INET)
            records = list(set([r[4][0] for r in records]))
        
        elif record_type == "AAAA":
            try:
                records = socket.getaddrinfo(domain, None, socket.AF_INET6)
                records = list(set([r[4][0] for r in records]))
            except:
                records = []
        
        elif record_type == "MX":
            import dns.resolver
            answers = dns.resolver.resolve(domain, 'MX')
            records = [{"priority": rdata.preference, "exchange": str(rdata.exchange)} for rdata in answers]
        
        elif record_type in ["TXT", "NS", "CNAME"]:
            import dns.resolver
            answers = dns.resolver.resolve(domain, record_type)
            records = [str(rdata) for rdata in answers]
        
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported record type: {record_type}")
        
        return {
            "domain": domain,
            "type": record_type,
            "records": records
        }
    
    except socket.gaierror:
        raise HTTPException(status_code=404, detail=f"Domain not found: {domain}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DNS lookup failed: {str(e)}")


# ========== EXPLOIT DATABASE ENDPOINTS ==========

@router.get("/exploits/search")
async def search_exploits(
    query: str = Query(..., description="Search query"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Search for exploits on GitHub
    
    - **query**: CVE ID or exploit keyword
    - **page**: Page number
    - **limit**: Results per page (1-100)
    """
    try:
        github_api = "https://api.github.com/search/repositories"
        
        params = {
            "q": f"{query} exploit OR {query} poc",
            "sort": "stars",
            "order": "desc",
            "per_page": limit,
            "page": page
        }
        
        headers = {"Accept": "application/vnd.github.v3+json"}
        if os.getenv("GITHUB_TOKEN"):
            headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(github_api, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
        
        exploits = []
        for item in data.get("items", []):
            exploits.append({
                "title": item["name"],
                "description": item["description"],
                "url": item["html_url"],
                "language": item["language"],
                "stars": item["stargazers_count"],
                "updated": item["updated_at"],
                "author": item["owner"]["login"]
            })
        
        return {
            "query": query,
            "total": data.get("total_count", 0),
            "results": exploits,
            "page": page,
            "limit": limit
        }
    
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded")
        raise HTTPException(status_code=500, detail=f"GitHub API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Exploit search failed: {str(e)}")


# ========== SECURITY SCANNING ENDPOINTS ==========

@router.post("/scan/headers")
async def scan_headers(request: HeaderScanRequest):
    """
    Scan HTTP security headers
    
    Checks for: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, etc.
    Returns security score (0-100) and recommendations
    """
    try:
        url = str(request.url)
        
        # Validate URL
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            raise HTTPException(status_code=400, detail="Invalid URL format")
        
        # Basic SSRF protection
        if parsed.hostname in ['localhost', '127.0.0.1', '0.0.0.0'] or parsed.hostname.startswith('192.168.') or parsed.hostname.startswith('10.'):
            raise HTTPException(status_code=400, detail="Private IP addresses not allowed")
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            response = await client.get(url)
        
        headers = dict(response.headers)
        
        # Security headers to check
        security_headers = {
            "strict-transport-security": headers.get("strict-transport-security"),
            "content-security-policy": headers.get("content-security-policy"),
            "x-frame-options": headers.get("x-frame-options"),
            "x-content-type-options": headers.get("x-content-type-options"),
            "x-xss-protection": headers.get("x-xss-protection"),
            "referrer-policy": headers.get("referrer-policy"),
            "permissions-policy": headers.get("permissions-policy")
        }
        
        # Scoring
        scores = {
            "strict-transport-security": 20 if security_headers["strict-transport-security"] else 0,
            "content-security-policy": 20 if security_headers["content-security-policy"] else 0,
            "x-frame-options": 15 if security_headers["x-frame-options"] else 0,
            "x-content-type-options": 15 if security_headers["x-content-type-options"] else 0,
            "x-xss-protection": 10 if security_headers["x-xss-protection"] else 0,
            "referrer-policy": 10 if security_headers["referrer-policy"] else 0,
            "permissions-policy": 10 if security_headers["permissions-policy"] else 0
        }
        
        total_score = sum(scores.values())
        
        # Generate findings
        findings = []
        if not security_headers["strict-transport-security"]:
            findings.append({
                "severity": "high",
                "header": "Strict-Transport-Security",
                "issue": "HSTS header missing - vulnerable to downgrade attacks",
                "recommendation": "Add: Strict-Transport-Security: max-age=31536000; includeSubDomains"
            })
        
        if not security_headers["content-security-policy"]:
            findings.append({
                "severity": "high",
                "header": "Content-Security-Policy",
                "issue": "CSP header missing - vulnerable to XSS attacks",
                "recommendation": "Implement a strict Content-Security-Policy"
            })
        
        if not security_headers["x-frame-options"]:
            findings.append({
                "severity": "medium",
                "header": "X-Frame-Options",
                "issue": "Clickjacking protection missing",
                "recommendation": "Add: X-Frame-Options: DENY or SAMEORIGIN"
            })
        
        if not security_headers["x-content-type-options"]:
            findings.append({
                "severity": "medium",
                "header": "X-Content-Type-Options",
                "issue": "MIME-type sniffing enabled",
                "recommendation": "Add: X-Content-Type-Options: nosniff"
            })
        
        # Grade calculation
        if total_score >= 80:
            grade = "A"
        elif total_score >= 60:
            grade = "B"
        elif total_score >= 40:
            grade = "C"
        elif total_score >= 20:
            grade = "D"
        else:
            grade = "F"
        
        return {
            "url": url,
            "score": total_score,
            "grade": grade,
            "headers": security_headers,
            "findings": findings,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch URL: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Header scan failed: {str(e)}")


# ========== SSL CERTIFICATE ENDPOINTS ==========

@router.get("/ssl/check")
async def check_ssl(
    hostname: str = Query(..., description="Hostname to check"),
    port: int = Query(443, description="Port number")
):
    """
    Check SSL/TLS certificate information
    
    - **hostname**: Domain name (without protocol)
    - **port**: Port number (default: 443)
    """
    try:
        # Clean hostname
        hostname = hostname.replace("https://", "").replace("http://", "")
        hostname = hostname.split("/")[0].split(":")[0]
        
        # Get certificate
        context = ssl.create_default_context(cafile=certifi.where())
        conn = context.wrap_socket(
            socket.socket(socket.AF_INET),
            server_hostname=hostname
        )
        conn.settimeout(5.0)
        conn.connect((hostname, port))
        cert = conn.getpeercert()
        conn.close()
        
        # Parse certificate
        valid_from = datetime.strptime(cert["notBefore"], "%b %d %H:%M:%S %Y %Z")
        valid_to = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
        
        days_remaining = (valid_to - datetime.utcnow()).days
        
        # Risk level
        if days_remaining < 0:
            risk_level = "critical"
        elif days_remaining < 7:
            risk_level = "high"
        elif days_remaining < 30:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        warnings = []
        if days_remaining < 30:
            warnings.append(f"Certificate expires in {days_remaining} days")
        if days_remaining < 0:
            warnings.append("Certificate has expired!")
        
        # Get issuer and subject
        issuer = dict(x[0] for x in cert.get("issuer", []))
        subject = dict(x[0] for x in cert.get("subject", []))
        
        return {
            "hostname": hostname,
            "port": port,
            "valid": days_remaining >= 0,
            "days_remaining": days_remaining,
            "valid_from": valid_from.isoformat(),
            "valid_to": valid_to.isoformat(),
            "issuer": issuer.get("organizationName", issuer.get("commonName", "Unknown")),
            "subject": subject.get("commonName", "Unknown"),
            "risk_level": risk_level,
            "warnings": warnings
        }
    
    except socket.gaierror:
        raise HTTPException(status_code=404, detail=f"Hostname not found: {hostname}")
    except ssl.SSLError as e:
        raise HTTPException(status_code=500, detail=f"SSL error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SSL check failed: {str(e)}")


# ========== THREAT INTELLIGENCE ENDPOINTS ==========

@router.post("/threat/ip")
async def check_ip_threat(request: IPThreatRequest):
    """
    Check IP reputation using AbuseIPDB
    
    Requires ABUSEIPDB_API_KEY environment variable
    Free tier: 1000 checks/day
    """
    try:
        if not os.getenv("ABUSEIPDB_API_KEY"):
            return {
                "ip": request.ip,
                "note": "AbuseIPDB API key not configured",
                "recommendation": "Add ABUSEIPDB_API_KEY to .env file"
            }
        
        api_url = "https://api.abuseipdb.com/api/v2/check"
        
        headers = {
            "Key": os.getenv("ABUSEIPDB_API_KEY"),
            "Accept": "application/json"
        }
        
        params = {
            "ipAddress": request.ip,
            "maxAgeInDays": 90,
            "verbose": True
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(api_url, headers=headers, params=params)
            response.raise_for_status()
            result = response.json()
        
        data = result["data"]
        abuse_score = data["abuseConfidenceScore"]
        
        # Determine risk level
        if abuse_score > 75:
            risk = "critical"
        elif abuse_score > 50:
            risk = "high"
        elif abuse_score > 25:
            risk = "medium"
        else:
            risk = "low"
        
        return {
            "ip": request.ip,
            "abuse_score": abuse_score,
            "total_reports": data["totalReports"],
            "num_distinct_users": data["numDistinctUsers"],
            "last_reported_at": data.get("lastReportedAt"),
            "is_whitelisted": data.get("isWhitelisted", False),
            "is_tor": data.get("isTor", False),
            "country": data.get("countryCode"),
            "usage_type": data.get("usageType"),
            "isp": data.get("isp"),
            "domain": data.get("domain"),
            "risk": risk
        }
    
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=500, detail=f"AbuseIPDB API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IP threat check failed: {str(e)}")


@router.post("/threat/domain")
async def check_domain_threat(request: DomainThreatRequest):
    """
    Check domain reputation using VirusTotal
    
    Requires VIRUSTOTAL_API_KEY environment variable
    Free tier: 4 requests/minute
    """
    try:
        if not os.getenv("VIRUSTOTAL_API_KEY"):
            return {
                "domain": request.domain,
                "note": "VirusTotal API key not configured",
                "recommendation": "Add VIRUSTOTAL_API_KEY to .env file"
            }
        
        # Clean domain
        domain = request.domain.replace("https://", "").replace("http://", "")
        domain = domain.split("/")[0].split(":")[0]
        
        api_url = f"https://www.virustotal.com/api/v3/domains/{domain}"
        
        headers = {
            "x-apikey": os.getenv("VIRUSTOTAL_API_KEY")
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(api_url, headers=headers)
            response.raise_for_status()
            result = response.json()
        
        data = result["data"]["attributes"]
        stats = data["last_analysis_stats"]
        
        total_checks = sum(stats.values())
        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)
        
        # Calculate reputation score
        if total_checks > 0:
            threat_percentage = ((malicious + suspicious) / total_checks) * 100
        else:
            threat_percentage = 0
        
        # Determine risk
        if threat_percentage > 50:
            risk = "critical"
        elif threat_percentage > 25:
            risk = "high"
        elif threat_percentage > 10:
            risk = "medium"
        else:
            risk = "low"
        
        return {
            "domain": domain,
            "malicious": malicious,
            "suspicious": suspicious,
            "harmless": stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0),
            "total_checks": total_checks,
            "threat_percentage": round(threat_percentage, 2),
            "risk": risk,
            "reputation": data.get("reputation", 0),
            "categories": data.get("categories", {}),
            "last_analysis_date": data.get("last_analysis_date")
        }
    
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            raise HTTPException(status_code=429, detail="VirusTotal rate limit exceeded (4 req/min)")
        raise HTTPException(status_code=500, detail=f"VirusTotal API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Domain threat check failed: {str(e)}")


# ========== SUBDOMAIN ENUMERATION ENDPOINTS ==========

@router.get("/subdomain/enumerate")
async def enumerate_subdomains(
    domain: str = Query(..., description="Domain to enumerate"),
    sources: str = Query("crtsh,hackertarget", description="Comma-separated sources")
):
    """
    Enumerate subdomains using multiple free sources
    
    - **domain**: Target domain (e.g., example.com)
    - **sources**: crtsh, hackertarget, securitytrails (comma-separated)
    
    Sources:
    - crt.sh: Certificate Transparency Logs (always free)
    - HackerTarget: Free API (limited)
    - SecurityTrails: Requires API key (SECURITYTRAILS_API_KEY)
    """
    try:
        # Clean domain
        clean_domain = domain.replace("https://", "").replace("http://", "")
        clean_domain = clean_domain.split("/")[0].split(":")[0]
        
        requested_sources = [s.strip() for s in sources.split(",")]
        all_subdomains = set()
        source_results = {}
        
        # Source 1: crt.sh (Certificate Transparency Logs)
        if "crtsh" in requested_sources:
            try:
                crtsh_subs = await get_crtsh_subdomains(clean_domain)
                all_subdomains.update(crtsh_subs)
                source_results["crtsh"] = {
                    "count": len(crtsh_subs),
                    "subdomains": sorted(list(crtsh_subs))[:20]  # First 20 for preview
                }
            except Exception as e:
                source_results["crtsh"] = {"error": str(e)}
        
        # Source 2: HackerTarget
        if "hackertarget" in requested_sources:
            try:
                hackertarget_subs = await get_hackertarget_subdomains(clean_domain)
                all_subdomains.update(hackertarget_subs)
                source_results["hackertarget"] = {
                    "count": len(hackertarget_subs),
                    "subdomains": sorted(list(hackertarget_subs))[:20]
                }
            except Exception as e:
                source_results["hackertarget"] = {"error": str(e)}
        
        # Source 3: SecurityTrails (requires API key)
        if "securitytrails" in requested_sources:
            if os.getenv("SECURITYTRAILS_API_KEY"):
                try:
                    securitytrails_subs = await get_securitytrails_subdomains(clean_domain)
                    all_subdomains.update(securitytrails_subs)
                    source_results["securitytrails"] = {
                        "count": len(securitytrails_subs),
                        "subdomains": sorted(list(securitytrails_subs))
                    }
                except Exception as e:
                    source_results["securitytrails"] = {"error": str(e)}
            else:
                source_results["securitytrails"] = {
                    "error": "SECURITYTRAILS_API_KEY not configured"
                }
        
        unique_subdomains = sorted(list(all_subdomains))
        
        return {
            "domain": clean_domain,
            "totalSubdomains": len(unique_subdomains),
            "subdomains": unique_subdomains,
            "sources": source_results,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Subdomain enumeration failed: {str(e)}")


async def get_crtsh_subdomains(domain: str) -> set:
    """Get subdomains from crt.sh Certificate Transparency Logs"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://crt.sh/",
                params={"q": f"%.{domain}", "output": "json"}
            )
            response.raise_for_status()
            data = response.json()
        
        subdomains = set()
        for cert in data:
            names = cert.get("name_value", "").split("\n")
            for name in names:
                cleaned = name.strip().lower()
                if cleaned.endswith(domain) and "*" not in cleaned:
                    subdomains.add(cleaned)
        
        return subdomains
    
    except Exception as e:
        print(f"crt.sh error: {e}")
        return set()


async def get_hackertarget_subdomains(domain: str) -> set:
    """Get subdomains from HackerTarget API"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"https://api.hackertarget.com/hostsearch/?q={domain}"
            )
            response.raise_for_status()
            text = response.text
        
        if "error" in text.lower():
            raise Exception("HackerTarget API error or rate limit")
        
        subdomains = set()
        for line in text.split("\n"):
            if "," in line:
                subdomain = line.split(",")[0].strip().lower()
                if subdomain and subdomain.endswith(domain):
                    subdomains.add(subdomain)
        
        return subdomains
    
    except Exception as e:
        print(f"HackerTarget error: {e}")
        return set()


async def get_securitytrails_subdomains(domain: str) -> set:
    """Get subdomains from SecurityTrails API"""
    try:
        api_key = os.getenv("SECURITYTRAILS_API_KEY")
        if not api_key:
            return set()
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"https://api.securitytrails.com/v1/domain/{domain}/subdomains",
                headers={"APIKEY": api_key}
            )
            response.raise_for_status()
            data = response.json()
        
        subdomains = set()
        for sub in data.get("subdomains", []):
            subdomains.add(f"{sub}.{domain}")
        
        return subdomains
    
    except Exception as e:
        print(f"SecurityTrails error: {e}")
        return set()


# ========== REPORT GENERATION ENDPOINTS ==========

@router.post("/report/generate")
async def generate_report(request: ReportGenerateRequest):
    """
    Generate security assessment report
    
    - **projectName**: Name of the security assessment project
    - **findings**: List of security findings
    - **executiveSummary**: Optional executive summary
    - **scope**: Optional scope description
    """
    try:
        findings = request.findings or []
        
        # Calculate statistics
        stats = {
            "critical": len([f for f in findings if f.get("severity") == "critical"]),
            "high": len([f for f in findings if f.get("severity") == "high"]),
            "medium": len([f for f in findings if f.get("severity") == "medium"]),
            "low": len([f for f in findings if f.get("severity") == "low"]),
            "total": len(findings)
        }
        
        # Add IDs to findings
        findings_with_ids = [
            {"id": idx + 1, **finding}
            for idx, finding in enumerate(findings)
        ]
        
        report = {
            "metadata": {
                "projectName": request.projectName,
                "generatedAt": datetime.utcnow().isoformat(),
                "version": "1.0"
            },
            "executiveSummary": request.executiveSummary or "Security assessment completed",
            "scope": request.scope or "Full application security testing",
            "statistics": stats,
            "findings": findings_with_ids,
            "recommendations": [
                "Address all critical and high severity findings immediately",
                "Implement security headers",
                "Enable HTTPS with strong TLS configuration",
                "Regular security testing and code reviews",
                "Keep all dependencies up to date"
            ]
        }
        
        return report
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


@router.post("/report/pdf")
async def generate_pdf_report():
    """
    Generate PDF report (placeholder for future implementation)
    
    Note: Implement with reportlab or weasyprint for actual PDF generation
    """
    return {
        "message": "PDF export endpoint",
        "note": "Implement with reportlab or weasyprint library",
        "recommendation": "Use reportlab for server-side PDF generation"
    }
