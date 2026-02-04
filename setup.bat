@echo off
REM HackWebTools - Quick Start Script for Windows

echo.
echo 🚀 Starting HackWebTools Full-Stack Setup...
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install
cd ..

echo.
echo ✅ Dependencies installed!
echo.

REM Check for .env files
if not exist ".env" (
    echo ⚠️  Frontend .env not found. Creating from template...
    copy .env.example .env
    echo ✅ Created .env file. Please configure VITE_API_URL if needed.
)

if not exist "server\.env" (
    echo ⚠️  Backend .env not found. Creating from template...
    copy server\.env.example server\.env
    echo ✅ Created server\.env file.
    echo.
    echo 🔑 IMPORTANT: Add your FREE API keys to server\.env
    echo    Get keys from:
    echo    - NVD API: https://nvd.nist.gov/developers/request-an-api-key
    echo    - GitHub Token: https://github.com/settings/tokens
    echo    - VirusTotal: https://www.virustotal.com/gui/join-us
    echo    - See DEPLOYMENT_GUIDE.md for more
    echo.
)

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo.
echo 1. Configure API keys in server\.env (optional but recommended)
echo.
echo 2. Start the backend server:
echo    cd server
echo    npm run dev
echo.
echo 3. In a new terminal, start the frontend:
echo    npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
echo 📚 Read DEPLOYMENT_GUIDE.md for production deployment to Render (FREE)
echo.
pause
