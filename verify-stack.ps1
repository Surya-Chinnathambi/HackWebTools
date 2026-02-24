#!/usr/bin/env pwsh
# Full Stack Verification Script
# Tests HackWebTools Frontend + Backend + MongoDB

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "  HackWebTools Full Stack Verification" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

$errors = @()
$warnings = @()

# Test 1: MongoDB Container
Write-Host "[1/6] Checking MongoDB container..." -ForegroundColor Yellow
try {
    $mongo = docker ps --filter "name=mongodb-hackwebtools" --format "{{.Status}}"
    if ($mongo -match "Up") {
        Write-Host "  ✅ MongoDB is running" -ForegroundColor Green
    } else {
        $errors += "MongoDB container not running"
        Write-Host "  ❌ MongoDB container not running" -ForegroundColor Red
    }
} catch {
    $errors += "Docker not available: $_"
    Write-Host "  ❌ Docker not available" -ForegroundColor Red
}

# Test 2: Backend Running
Write-Host "`n[2/6] Checking backend server..." -ForegroundColor Yellow
try {
    $backendStatus = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/api-test/health" -TimeoutSec 3
    Write-Host "  ✅ Backend is running" -ForegroundColor Green
} catch {
    $errors += "Backend not responding on port 8000"
    Write-Host "  ❌ Backend not responding" -ForegroundColor Red
}

# Test 3: Verify Correct Backend
Write-Host "`n[3/6] Verifying HackWebTools API..." -ForegroundColor Yellow
try {
    $openapi = Invoke-RestMethod -Uri "http://localhost:8000/openapi.json" -TimeoutSec 3
    if ($openapi.info.title -eq "HackWebTools API") {
        Write-Host "  ✅ Correct backend (HackWebTools)" -ForegroundColor Green
    } else {
        $errors += "Wrong backend running: $($openapi.info.title)"
        Write-Host "  ❌ Wrong backend: $($openapi.info.title)" -ForegroundColor Red
    }
} catch {
    $errors += "Cannot verify backend identity"
    Write-Host "  ❌ Cannot verify backend" -ForegroundColor Red
}

# Test 4: Learning Paths API
Write-Host "`n[4/6] Testing Learning Paths API..." -ForegroundColor Yellow
try {
    $lpResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/learning-paths" -TimeoutSec 3
    Write-Host "  ✅ Learning Paths API responding" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "  ⚠️  Learning Paths requires authentication (expected)" -ForegroundColor Cyan
    } else {
        $warnings += "Learning Paths API issue: $($_.Exception.Message)"
        Write-Host "  ⚠️  Learning Paths API: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test 5: Quiz API
Write-Host "`n[5/6] Testing Quiz Arena API..." -ForegroundColor Yellow
try {
    $quizResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/quizzes/categories" -TimeoutSec 3
    Write-Host "  ✅ Quiz Arena API responding" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "  ⚠️  Quiz Arena requires authentication (expected)" -ForegroundColor Cyan
    } else {
        $warnings += "Quiz API issue: $($_.Exception.Message)"
        Write-Host "  ⚠️  Quiz API: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test 6: Frontend Running
Write-Host "`n[6/6] Checking frontend server..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:8081" -UseBasicParsing -TimeoutSec 3
    if ($frontend.StatusCode -eq 200) {
        Write-Host "  ✅ Frontend is running (port 8081)" -ForegroundColor Green
    } else {
        $warnings += "Frontend returned status: $($frontend.StatusCode)"
        Write-Host "  ⚠️  Frontend status: $($frontend.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    $errors += "Frontend not responding on port 8081"
    Write-Host "  ❌ Frontend not responding" -ForegroundColor Red
}

# Summary
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "`n✅ ALL TESTS PASSED - Platform is fully operational!" -ForegroundColor Green
    Write-Host "`nAccess the platform:" -ForegroundColor Cyan
    Write-Host "  Frontend:  http://localhost:8081" -ForegroundColor White
    Write-Host "  Backend:   http://localhost:8000/api/docs" -ForegroundColor White
    Write-Host "  MongoDB:   mongodb://localhost:27017/hackwebtools" -ForegroundColor White
} elseif ($errors.Count -eq 0) {
    Write-Host "`n⚠️  Platform is operational with warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  - $warning" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ Platform has critical errors:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    if ($warnings.Count -gt 0) {
        Write-Host "`nWarnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  - $warning" -ForegroundColor Yellow
        }
    }
    Write-Host "`nTroubleshooting:" -ForegroundColor Cyan
    Write-Host "  1. Start MongoDB:  docker start mongodb-hackwebtools" -ForegroundColor White
    Write-Host "  2. Start Backend:  cd backend-python && uvicorn main:app --reload --port 8000" -ForegroundColor White
    Write-Host "  3. Start Frontend: npm run dev" -ForegroundColor White
    Write-Host "  4. Check logs for detailed error messages" -ForegroundColor White
}

Write-Host "`n"
