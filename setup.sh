#!/bin/bash

# HackWebTools - Quick Start Script
echo "🚀 Starting HackWebTools Full-Stack Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

echo ""
echo "✅ Dependencies installed!"
echo ""

# Check for .env files
if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env not found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file. Please configure VITE_API_URL if needed."
fi

if [ ! -f "server/.env" ]; then
    echo "⚠️  Backend .env not found. Creating from template..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env file."
    echo ""
    echo "🔑 IMPORTANT: Add your FREE API keys to server/.env"
    echo "   Get keys from:"
    echo "   - NVD API: https://nvd.nist.gov/developers/request-an-api-key"
    echo "   - GitHub Token: https://github.com/settings/tokens"
    echo "   - VirusTotal: https://www.virustotal.com/gui/join-us"
    echo "   - See DEPLOYMENT_GUIDE.md for more"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Configure API keys in server/.env (optional but recommended)"
echo ""
echo "2. Start the backend server:"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "📚 Read DEPLOYMENT_GUIDE.md for production deployment to Render (FREE)"
echo ""
