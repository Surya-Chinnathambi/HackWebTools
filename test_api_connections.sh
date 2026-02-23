#!/bin/bash

# API Connection Test Script
# Quick test of frontend-to-backend API endpoints

BASE_URL="http://localhost:8000/api/v1"

echo "=========================================="
echo "Frontend → Backend API Connection Test"
echo "Testing endpoints at: $BASE_URL"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -ne "Testing: $description... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi
    
    if [ "$response" == "200" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ FAIL (HTTP $response)${NC}"
        ((failed++))
    fi
}

echo "Security Tools Endpoints:"
echo "----------------------------------------"

test_endpoint "GET" "/tools/cve/search?keyword=apache&resultsPerPage=5" "CVE Search"
test_endpoint "GET" "/tools/cve/recent?days=7" "Recent CVEs"
test_endpoint "GET" "/tools/dns/lookup?domain=example.com&record_type=A" "DNS Lookup"
test_endpoint "GET" "/tools/exploits/search?query=apache&page=1" "Exploit Search"
test_endpoint "GET" "/tools/ssl/check?hostname=google.com" "SSL Check"
test_endpoint "POST" "/tools/scan/headers" "Header Scan" '{"url":"https://example.com"}'
test_endpoint "POST" "/tools/threat/ip" "IP Reputation" '{"ip":"8.8.8.8"}'
test_endpoint "POST" "/tools/threat/domain" "Domain Reputation" '{"domain":"google.com"}'
test_endpoint "GET" "/tools/subdomain/enumerate?domain=example.com&sources=crtsh" "Subdomain Enum"
test_endpoint "POST" "/tools/report/generate" "Report Gen" '{"projectName":"Test"}'

echo ""
echo "Analytics Endpoints:"
echo "----------------------------------------"

test_endpoint "POST" "/analytics/track" "Track Event" '{"eventName":"test","userId":"123"}'
test_endpoint "GET" "/analytics/summary" "Analytics Summary"
test_endpoint "GET" "/analytics/funnel" "Analytics Funnel"

echo ""
echo "API Testing Endpoints:"
echo "----------------------------------------"

test_endpoint "GET" "/api-test/test/all" "Test All APIs"

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="

total=$((passed + failed))
percentage=$((passed * 100 / total))

echo "Total Tests: $total"
echo -e "${GREEN}Passed: $passed${NC}"
echo -e "${RED}Failed: $failed${NC}"
echo "Success Rate: $percentage%"
echo ""

if [ $percentage -eq 100 ]; then
    echo -e "${GREEN}🎉 All tests passed! Frontend is properly connected to backend.${NC}"
elif [ $percentage -ge 80 ]; then
    echo -e "${YELLOW}⚠️  Most tests passed. Check failed endpoints.${NC}"
else
    echo -e "${RED}❌ Many tests failed. Verify backend is running on port 8000.${NC}"
    echo ""
    echo -e "${YELLOW}To start backend:${NC}"
    echo "  cd backend-python"
    echo "  uvicorn app.main:app --reload --port 8000"
fi

echo ""
