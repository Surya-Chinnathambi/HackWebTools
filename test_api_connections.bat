@echo off
setlocal enabledelayedexpansion

REM API Connection Test Script for Windows
REM Quick test of frontend-to-backend API endpoints

set BASE_URL=http://localhost:8000/api/v1
set passed=0
set failed=0

echo ==========================================
echo Frontend -^> Backend API Connection Test
echo Testing endpoints at: %BASE_URL%
echo ==========================================
echo.

echo Security Tools Endpoints:
echo ----------------------------------------

call :test_endpoint "GET" "/tools/cve/search?keyword=apache&resultsPerPage=5" "CVE Search"
call :test_endpoint "GET" "/tools/cve/recent?days=7" "Recent CVEs"
call :test_endpoint "GET" "/tools/dns/lookup?domain=example.com&record_type=A" "DNS Lookup"
call :test_endpoint "GET" "/tools/exploits/search?query=apache&page=1" "Exploit Search"
call :test_endpoint "GET" "/tools/ssl/check?hostname=google.com" "SSL Check"
call :test_endpoint "POST" "/tools/scan/headers" "Header Scan"
call :test_endpoint "POST" "/tools/threat/ip" "IP Reputation"
call :test_endpoint "POST" "/tools/threat/domain" "Domain Reputation"
call :test_endpoint "GET" "/tools/subdomain/enumerate?domain=example.com&sources=crtsh" "Subdomain Enum"
call :test_endpoint "POST" "/tools/report/generate" "Report Generation"

echo.
echo Analytics Endpoints:
echo ----------------------------------------

call :test_endpoint "POST" "/analytics/track" "Track Event"
call :test_endpoint "GET" "/analytics/summary" "Analytics Summary"
call :test_endpoint "GET" "/analytics/funnel" "Analytics Funnel"

echo.
echo API Testing Endpoints:
echo ----------------------------------------

call :test_endpoint "GET" "/api-test/test/all" "Test All APIs"

echo.
echo ==========================================
echo Test Summary
echo ==========================================

set /a total=passed+failed
if !total! equ 0 set total=1
set /a percentage=(passed*100)/total

echo Total Tests: !total!
echo Passed: !passed!
echo Failed: !failed!
echo Success Rate: !percentage!%%
echo.

if !percentage! equ 100 (
    echo [32m All tests passed! Frontend is properly connected to backend.[0m
) else if !percentage! geq 80 (
    echo [33m Most tests passed. Check failed endpoints.[0m
) else (
    echo [31m Many tests failed. Verify backend is running on port 8000.[0m
    echo.
    echo To start backend:
    echo   cd backend-python
    echo   uvicorn app.main:app --reload --port 8000
)

echo.
pause
exit /b

:test_endpoint
set method=%~1
set endpoint=%~2
set description=%~3

echo | set /p="Testing: %description%... "

curl -s -o nul -w "%%{http_code}" "%BASE_URL%%endpoint%" > temp_code.txt 2>nul
set /p response=<temp_code.txt
del temp_code.txt 2>nul

if "%response%"=="200" (
    echo [32mPASS[0m
    set /a passed+=1
) else (
    echo [31mFAIL (HTTP %response%)[0m
    set /a failed+=1
)

exit /b
