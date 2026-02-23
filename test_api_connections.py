#!/usr/bin/env python3
"""
API Connection Test Script
Tests all frontend-to-backend API endpoints to verify connectivity
"""

import requests
import json
from colorama import init, Fore, Style

init(autoreset=True)

BASE_URL = "http://localhost:8000/api/v1"

def test_endpoint(method, endpoint, data=None, description=""):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10)
        else:
            return False, "Unsupported method"
        
        if response.status_code == 200:
            print(f"{Fore.GREEN}✅ {description}")
            print(f"   {method} {endpoint}")
            return True, response.json()
        else:
            print(f"{Fore.RED}❌ {description}")
            print(f"   {method} {endpoint}")
            print(f"   Status: {response.status_code}")
            print(f"   Error: {response.text[:100]}")
            return False, None
            
    except requests.exceptions.ConnectionError:
        print(f"{Fore.RED}❌ {description}")
        print(f"   {method} {endpoint}")
        print(f"   Error: Connection refused - Is the backend running?")
        return False, None
    except Exception as e:
        print(f"{Fore.RED}❌ {description}")
        print(f"   {method} {endpoint}")
        print(f"   Error: {str(e)}")
        return False, None

def main():
    print(f"\n{Fore.CYAN}{'=' * 60}")
    print(f"{Fore.CYAN}Frontend → Backend API Connection Test")
    print(f"{Fore.CYAN}Testing endpoints at: {BASE_URL}")
    print(f"{Fore.CYAN}{'=' * 60}\n")
    
    results = []
    
    # Test Security Tools Endpoints
    print(f"{Fore.YELLOW}Security Tools Endpoints:")
    print("-" * 60)
    
    # CVE Search
    success, _ = test_endpoint(
        "GET", 
        "/tools/cve/search?keyword=apache&resultsPerPage=5",
        description="CVE Search"
    )
    results.append(("CVE Search", success))
    
    # Recent CVEs
    success, _ = test_endpoint(
        "GET",
        "/tools/cve/recent?days=7",
        description="Recent CVEs"
    )
    results.append(("Recent CVEs", success))
    
    # DNS Lookup
    success, _ = test_endpoint(
        "GET",
        "/tools/dns/lookup?domain=example.com&record_type=A",
        description="DNS Lookup"
    )
    results.append(("DNS Lookup", success))
    
    # Exploit Search
    success, _ = test_endpoint(
        "GET",
        "/tools/exploits/search?query=apache&page=1&limit=10",
        description="Exploit Search"
    )
    results.append(("Exploit Search", success))
    
    # SSL Check
    success, _ = test_endpoint(
        "GET",
        "/tools/ssl/check?hostname=google.com&port=443",
        description="SSL Certificate Check"
    )
    results.append(("SSL Check", success))
    
    # Security Header Scan
    success, _ = test_endpoint(
        "POST",
        "/tools/scan/headers",
        data={"url": "https://example.com"},
        description="Security Header Scan"
    )
    results.append(("Header Scan", success))
    
    # IP Reputation
    success, _ = test_endpoint(
        "POST",
        "/tools/threat/ip",
        data={"ip": "8.8.8.8"},
        description="IP Reputation Check"
    )
    results.append(("IP Reputation", success))
    
    # Domain Reputation
    success, _ = test_endpoint(
        "POST",
        "/tools/threat/domain",
        data={"domain": "google.com"},
        description="Domain Reputation Check"
    )
    results.append(("Domain Reputation", success))
    
    # Subdomain Enumeration
    success, _ = test_endpoint(
        "GET",
        "/tools/subdomain/enumerate?domain=example.com&sources=crtsh",
        description="Subdomain Enumeration"
    )
    results.append(("Subdomain Enum", success))
    
    # Report Generation
    success, _ = test_endpoint(
        "POST",
        "/tools/report/generate",
        data={
            "projectName": "Test Report",
            "findings": [
                {"severity": "high", "title": "Test Finding"}
            ]
        },
        description="Report Generation"
    )
    results.append(("Report Generation", success))
    
    print()
    
    # Test Analytics Endpoints
    print(f"{Fore.YELLOW}Analytics Endpoints:")
    print("-" * 60)
    
    # Track Event
    success, _ = test_endpoint(
        "POST",
        "/analytics/track",
        data={
            "eventName": "test_event",
            "userId": "test123",
            "tier": "free"
        },
        description="Analytics Event Tracking"
    )
    results.append(("Event Tracking", success))
    
    # Get Summary
    success, _ = test_endpoint(
        "GET",
        "/analytics/summary",
        description="Analytics Summary"
    )
    results.append(("Analytics Summary", success))
    
    # Get Funnel
    success, _ = test_endpoint(
        "GET",
        "/analytics/funnel",
        description="Analytics Funnel"
    )
    results.append(("Analytics Funnel", success))
    
    print()
    
    # Test API Testing Endpoints
    print(f"{Fore.YELLOW}API Testing Endpoints:")
    print("-" * 60)
    
    # Test All APIs
    success, _ = test_endpoint(
        "GET",
        "/api-test/test/all",
        description="Test All API Connections"
    )
    results.append(("Test All APIs", success))
    
    print()
    
    # Summary
    print(f"{Fore.CYAN}{'=' * 60}")
    print(f"{Fore.CYAN}Test Summary")
    print(f"{Fore.CYAN}{'=' * 60}\n")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"Total Tests: {total}")
    print(f"{Fore.GREEN}Passed: {passed}")
    print(f"{Fore.RED}Failed: {total - passed}")
    print(f"Success Rate: {percentage:.1f}%\n")
    
    if percentage == 100:
        print(f"{Fore.GREEN}🎉 All tests passed! Frontend is properly connected to backend.")
    elif percentage >= 80:
        print(f"{Fore.YELLOW}⚠️  Most tests passed. Check failed endpoints.")
    else:
        print(f"{Fore.RED}❌ Many tests failed. Verify backend is running on port 8000.")
        print(f"\n{Fore.YELLOW}To start backend:")
        print(f"  cd backend-python")
        print(f"  uvicorn app.main:app --reload --port 8000")
    
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Test interrupted by user.")
    except Exception as e:
        print(f"\n{Fore.RED}Unexpected error: {e}")
