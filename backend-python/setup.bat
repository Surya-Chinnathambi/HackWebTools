@echo off
echo ========================================
echo HackWebTools Python Backend Setup
echo ========================================
echo.

:: Check Python installation
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

:: Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created.
    echo.
)

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

:: Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

:: Copy .env.example to .env if not exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file with your configuration
    echo - MongoDB connection string
    echo - JWT secret key (generate with: python -c "import secrets; print(secrets.token_hex(32))")
    echo - Google OAuth credentials
    echo - SendGrid API key
    echo - Stripe API keys
    echo.
)

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Run: python main.py
echo 3. API will be available at http://localhost:8000
echo 4. API docs at http://localhost:8000/api/docs
echo.
echo To activate virtual environment in the future:
echo   venv\Scripts\activate.bat
echo.
pause
