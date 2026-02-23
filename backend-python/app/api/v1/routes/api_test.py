"""
API Testing Routes
Test connections to third-party APIs (Gemini, Shodan, NVD, GitHub, AbuseIPDB, VirusTotal)
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import httpx
import os

router = APIRouter(prefix="/api-test", tags=["API Testing"])


class GeminiAnalyzeRequest(BaseModel):
    prompt: str
    apiKey: Optional[str] = None


class ShodanSearchRequest(BaseModel):
    query: str
    apiKey: Optional[str] = None


# ========== TEST ALL APIS ==========

@router.get("/test/all")
async def test_all_apis():
    """
    Test all API connections
    
    Returns summary of all API connection status
    """
    try:
        results = []
        
        # Test each API
        apis_to_test = [
            ("Gemini AI", test_gemini_api),
            ("Shodan", test_shodan_api),
            ("NVD", test_nvd_api),
            ("GitHub", test_github_api),
            ("AbuseIPDB", test_abuseipdb_api),
            ("VirusTotal", test_virustotal_api)
        ]
        
        for api_name, test_func in apis_to_test:
            try:
                result = await test_func()
                results.append(result)
            except Exception as e:
                results.append({
                    "success": False,
                    "service": api_name,
                    "message": str(e),
                    "error": "TEST_FAILED"
                })
        
        summary = {
            "total": len(results),
            "connected": len([r for r in results if r.get("success")]),
            "failed": len([r for r in results if not r.get("success")]),
            "results": results
        }
        
        return summary
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API testing failed: {str(e)}")


# ========== INDIVIDUAL API TESTS ==========

@router.get("/test/gemini")
async def test_gemini_endpoint(apiKey: Optional[str] = Query(None)):
    """Test Gemini AI API connection"""
    try:
        result = await test_gemini_api(apiKey)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test/shodan")
async def test_shodan_endpoint(apiKey: Optional[str] = Query(None)):
    """Test Shodan API connection"""
    try:
        result = await test_shodan_api(apiKey)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test/nvd")
async def test_nvd_endpoint(apiKey: Optional[str] = Query(None)):
    """Test NVD API connection"""
    try:
        result = await test_nvd_api(apiKey)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test/github")
async def test_github_endpoint(token: Optional[str] = Query(None)):
    """Test GitHub API connection"""
    try:
        result = await test_github_api(token)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test/abuseipdb")
async def test_abuseipdb_endpoint(apiKey: Optional[str] = Query(None)):
    """Test AbuseIPDB API connection"""
    try:
        result = await test_abuseipdb_api(apiKey)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test/virustotal")
async def test_virustotal_endpoint(apiKey: Optional[str] = Query(None)):
    """Test VirusTotal API connection"""
    try:
        result = await test_virustotal_api(apiKey)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== GEMINI AI ==========

@router.post("/gemini/analyze")
async def gemini_analyze(request: GeminiAnalyzeRequest):
    """
    Use Gemini AI for analysis
    
    - **prompt**: Text prompt for analysis
    - **apiKey**: Optional Gemini API key
    """
    try:
        if not request.prompt:
            raise HTTPException(status_code=400, detail="Prompt is required")
        
        api_key = request.apiKey or os.getenv("GEMINI_API_KEY")
        
        if not api_key or api_key == "your_gemini_api_key":
            return {
                "success": False,
                "message": "Gemini API key not configured",
                "error": "MISSING_API_KEY"
            }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}",
                json={
                    "contents": [{
                        "parts": [{
                            "text": request.prompt
                        }]
                    }]
                },
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            data = response.json()
        
        if data.get("candidates"):
            return {
                "success": True,
                "response": data["candidates"][0]["content"]["parts"][0]["text"],
                "model": "gemini-pro"
            }
        
        return {
            "success": False,
            "message": "Invalid response from Gemini API"
        }
    
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== SHODAN ==========

@router.get("/shodan/search")
async def shodan_search(
    query: str = Query(..., description="Search query"),
    apiKey: Optional[str] = Query(None)
):
    """
    Query Shodan search engine
    
    - **query**: Search query (e.g., "apache", "port:22")
    - **apiKey**: Optional Shodan API key
    """
    try:
        api_key = apiKey or os.getenv("SHODAN_API_KEY")
        
        if not api_key or api_key == "your_shodan_api_key":
            return {
                "success": False,
                "message": "Shodan API key not configured",
                "error": "MISSING_API_KEY"
            }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"https://api.shodan.io/shodan/host/search?key={api_key}&query={query}"
            )
            response.raise_for_status()
            data = response.json()
        
        return {
            "success": True,
            "total": data.get("total", 0),
            "results": data.get("matches", [])[:10]  # First 10 results
        }
    
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=500, detail=f"Shodan API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== API TEST HELPERS ==========

async def test_gemini_api(api_key: Optional[str] = None) -> Dict:
    """Test Gemini AI API"""
    try:
        key = api_key or os.getenv("GEMINI_API_KEY")
        
        if not key or key == "your_gemini_api_key":
            return {
                "success": False,
                "message": "Gemini API key not configured",
                "service": "Gemini AI"
            }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={key}",
                json={
                    "contents": [{
                        "parts": [{
                            "text": "Say 'API connected successfully' in exactly 3 words."
                        }]
                    }]
                },
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            data = response.json()
        
        if data.get("candidates"):
            return {
                "success": True,
                "message": "Gemini API connected successfully",
                "service": "Gemini AI",
                "data": {
                    "model": "gemini-pro",
                    "response": data["candidates"][0]["content"]["parts"][0]["text"]
                }
            }
        
        return {
            "success": False,
            "message": "Invalid response from Gemini API",
            "service": "Gemini AI"
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "service": "Gemini AI",
            "error": "NETWORK_ERROR"
        }


async def test_shodan_api(api_key: Optional[str] = None) -> Dict:
    """Test Shodan API"""
    try:
        key = api_key or os.getenv("SHODAN_API_KEY")
        
        if not key or key == "your_shodan_api_key":
            return {
                "success": False,
                "message": "Shodan API key not configured",
                "service": "Shodan"
            }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"https://api.shodan.io/api-info?key={key}")
            response.raise_for_status()
            data = response.json()
        
        return {
            "success": True,
            "message": "Shodan API connected successfully",
            "service": "Shodan",
            "data": {
                "plan": data.get("plan"),
                "query_credits": data.get("query_credits"),
                "scan_credits": data.get("scan_credits")
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "service": "Shodan",
            "error": "NETWORK_ERROR"
        }


async def test_nvd_api(api_key: Optional[str] = None) -> Dict:
    """Test NVD API"""
    try:
        key = api_key or os.getenv("NVD_API_KEY")
        
        headers = {}
        if key and key != "your_nvd_api_key_optional":
            headers["apiKey"] = key
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=1",
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
        
        return {
            "success": True,
            "message": "NVD API connected successfully",
            "service": "NVD",
            "data": {
                "totalResults": data.get("totalResults"),
                "resultsPerPage": data.get("resultsPerPage"),
                "withApiKey": bool(key and key != "your_nvd_api_key_optional")
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "service": "NVD",
            "error": "NETWORK_ERROR"
        }


async def test_github_api(token: Optional[str] = None) -> Dict:
    """Test GitHub API"""
    try:
        tok = token or os.getenv("GITHUB_TOKEN")
        
        if not tok or tok == "your_github_personal_access_token":
            return {
                "success": False,
                "message": "GitHub token not configured",
                "service": "GitHub"
            }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"token {tok}",
                    "Accept": "application/vnd.github.v3+json"
                }
            )
            response.raise_for_status()
            data = response.json()
        
        return {
            "success": True,
            "message": "GitHub API connected successfully",
            "service": "GitHub",
            "data": {
                "username": data.get("login"),
                "name": data.get("name"),
                "public_repos": data.get("public_repos")
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "service": "GitHub",
            "error": "NETWORK_ERROR"
        }


async def test_abuseipdb_api(api_key: Optional[str] = None) -> Dict:
    """Test AbuseIPDB API"""
    try:
        key = api_key or os.getenv("ABUSEIPDB_API_KEY")
        
        if not key or key == "your_abuseipdb_api_key":
            return {
                "success": False,
                "message": "AbuseIPDB API key not configured",
                "service": "AbuseIPDB"
            }
        
        # Test with Google DNS (safe IP)
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.abuseipdb.com/api/v2/check",
                headers={"Key": key, "Accept": "application/json"},
                params={"ipAddress": "8.8.8.8", "maxAgeInDays": 90}
            )
            response.raise_for_status()
            data = response.json()
        
        return {
            "success": True,
            "message": "AbuseIPDB API connected successfully",
            "service": "AbuseIPDB",
            "data": {
                "testIP": "8.8.8.8",
                "abuseScore": data["data"]["abuseConfidenceScore"]
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "service": "AbuseIPDB",
            "error": "NETWORK_ERROR"
        }


async def test_virustotal_api(api_key: Optional[str] = None) -> Dict:
    """Test VirusTotal API"""
    try:
        key = api_key or os.getenv("VIRUSTOTAL_API_KEY")
        
        if not key or key == "your_virustotal_api_key":
            return {
                "success": False,
                "message": "VirusTotal API key not configured",
                "service": "VirusTotal"
            }
        
        # Test with google.com (safe domain)
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://www.virustotal.com/api/v3/domains/google.com",
                headers={"x-apikey": key}
            )
            response.raise_for_status()
            data = response.json()
        
        return {
            "success": True,
            "message": "VirusTotal API connected successfully",
            "service": "VirusTotal",
            "data": {
                "testDomain": "google.com",
                "reputation": data["data"]["attributes"].get("reputation", 0)
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "service": "VirusTotal",
            "error": "NETWORK_ERROR"
        }
