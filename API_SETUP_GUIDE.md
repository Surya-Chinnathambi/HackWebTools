# API Integration Setup Guide

## 🔑 How to Setup Your API Keys

This project now supports **5 major API integrations** to enhance security features. All APIs have **FREE tiers** available!

---

## 📋 Quick Start

### 1. **Add API Keys to Server**

Copy the `.env.example` to `.env` in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file and add your API keys:

```env
# Google Gemini AI API (FREE tier)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Shodan API (100 queries/month free)
SHODAN_API_KEY=your_actual_shodan_api_key_here

# NVD API (FREE - Optional, but recommended for better rate limits)
NVD_API_KEY=your_actual_nvd_api_key_here

# GitHub Personal Access Token (5000 requests/hour)
GITHUB_TOKEN=your_actual_github_token_here

# AbuseIPDB (1000 checks/day free)
ABUSEIPDB_API_KEY=your_actual_abuseipdb_api_key_here
```

### 2. **Start the Backend Server**

```bash
cd server
npm install
npm start
```

The server will start on `http://localhost:5000`

### 3. **Start the Frontend**

```bash
npm run dev
```

The app will start on `http://localhost:8080`

### 4. **Test Your APIs**

Visit **http://localhost:8080/api-settings** in your browser to:
- Enter your API keys
- Test each connection
- View connection status
- See API response data

---

## 🆓 How to Get FREE API Keys

### 1. **Google Gemini AI** (FREE)
- **URL**: https://makersuite.google.com/app/apikey
- **Limits**: 60 requests per minute (free tier)
- **Use**: AI-powered security analysis, threat intelligence insights
- **Steps**:
  1. Sign in with your Google account
  2. Click "Get API Key"
  3. Create a new API key
  4. Copy the key

### 2. **Shodan** (100 queries/month FREE)
- **URL**: https://account.shodan.io/register
- **Free Tier**: 100 search queries per month
- **Use**: Internet-connected device scanning, exposures, vulnerabilities
- **Steps**:
  1. Create a free account
  2. Go to "My Account"
  3. Copy your API key

### 3. **NVD (National Vulnerability Database)** (FREE)
- **URL**: https://nvd.nist.gov/developers/request-an-api-key
- **Free Without Key**: 5 requests per 30 seconds
- **Free With Key**: 50 requests per 30 seconds
- **Use**: CVE vulnerability information
- **Steps**:
  1. Enter your email
  2. Check your inbox for the API key
  3. The key is sent instantly

### 4. **GitHub Personal Access Token** (5000 requests/hour FREE)
- **URL**: https://github.com/settings/tokens
- **Free Tier**: 5000 requests per hour
- **Use**: Exploit database searches, security advisories
- **Steps**:
  1. Click "Generate new token" → "Generate new token (classic)"
  2. Give it a name (e.g., "HackWebTools")
  3. Select scopes: `public_repo` (minimum)
  4. Click "Generate token"
  5. **Copy the token immediately** (you won't see it again!)

### 5. **AbuseIPDB** (1000 checks/day FREE)
- **URL**: https://www.abuseipdb.com/register
- **Free Tier**: 1000 IP checks per day
- **Use**: IP reputation checking, abuse reports
- **Steps**:
  1. Create a free account
  2. Go to your account settings
  3. Generate API key under "API" tab

---

## 🧪 Testing Your Setup

### Method 1: Use the Web Interface

1. Navigate to **API Settings** in the navigation menu
2. Paste your API keys into the respective fields
3. Click **"Save & Test"** for each API
4. View connection status and response data

### Method 2: Use Curl Commands

Test each API directly:

```bash
# Test all APIs at once
curl http://localhost:5000/api/integrations/test/all

# Test individual APIs
curl http://localhost:5000/api/integrations/test/gemini
curl http://localhost:5000/api/integrations/test/shodan
curl http://localhost:5000/api/integrations/test/nvd
curl http://localhost:5000/api/integrations/test/github
curl http://localhost:5000/api/integrations/test/abuseipdb
```

### Method 3: Test with Custom Keys (Without Adding to .env)

```bash
# Test with a custom API key
curl "http://localhost:5000/api/integrations/test/gemini?apiKey=YOUR_KEY_HERE"
```

---

## ✨ What Each API Provides

| API | Feature | Use Case |
|-----|---------|----------|
| **Gemini AI** | AI analysis | Security insights, vulnerability explanations, threat analysis |
| **Shodan** | Device search | Find exposed services, IoT devices, open ports |
| **NVD** | CVE database | Detailed vulnerability information, CVSS scores |
| **GitHub** | Repository data | Exploit searches, security advisories, PoC code |
| **AbuseIPDB** | IP reputation | Check if IP is malicious, view abuse reports |

---

## 🔒 Security Notes

- **Frontend Storage**: API keys entered in the web interface are stored in **browser localStorage** only
- **Server Storage**: Keys in `.env` file are **NOT committed to git** (`.env` is in `.gitignore`)
- **Recommendation**: Use the web interface for testing, use `.env` for production
- **Rate Limits**: All APIs have rate limits - check each service's documentation

---

## 📊 API Endpoints Available

### Test Endpoints
- `GET /api/integrations/test/all` - Test all configured APIs
- `GET /api/integrations/test/gemini` - Test Gemini AI
- `GET /api/integrations/test/shodan` - Test Shodan
- `GET /api/integrations/test/nvd` - Test NVD
- `GET /api/integrations/test/github` - Test GitHub
- `GET /api/integrations/test/abuseipdb` - Test AbuseIPDB

### Usage Endpoints
- `POST /api/integrations/gemini/analyze` - Analyze text with Gemini
- `GET /api/integrations/shodan/search?query=apache` - Search Shodan
- `GET /api/integrations/abuseipdb/check?ip=1.2.3.4` - Check IP reputation

---

## 🎯 Example Usage

### Example 1: Analyze Security Threat with Gemini

```bash
curl -X POST http://localhost:5000/api/integrations/gemini/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain SQL injection vulnerability and how to prevent it"
  }'
```

### Example 2: Search Shodan for Exposed MongoDB

```bash
curl "http://localhost:5000/api/integrations/shodan/search?query=mongodb"
```

### Example 3: Check IP Reputation

```bash
curl "http://localhost:5000/api/integrations/abuseipdb/check?ip=8.8.8.8"
```

---

## 🐛 Troubleshooting

### "API Key not configured" Error
- Make sure you've added the key to `server/.env` file
- Or, test with custom key using query parameter: `?apiKey=YOUR_KEY`

### "Network Error"
- Ensure the backend server is running on port 5000
- Check if you have internet connectivity
- Verify firewall isn't blocking the requests

### "Rate Limit Exceeded"
- You've exceeded the free tier limits
- Wait for the rate limit to reset
- Consider upgrading to paid tier if needed

### Connection Timeout
- Some APIs (like NVD) can be slow
- Increase timeout in your requests
- Try again later if service is down

---

## 📝 Environment File Example

Here's a complete `server/.env` file with all keys:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# MongoDB (Optional)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackwebtools

# JWT Secret
JWT_SECRET=your_random_secret_key_here

# API Keys (Add your actual keys below)
GEMINI_API_KEY=AIzaSy...
SHODAN_API_KEY=YOUR_KEY_HERE
NVD_API_KEY=YOUR_KEY_HERE
GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
ABUSEIPDB_API_KEY=YOUR_KEY_HERE

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Next Steps

1. **Get your API keys** from the links provided above
2. **Add them to** `server/.env` file
3. **Restart the server** if it's already running
4. **Visit** http://localhost:8080/api-settings to test
5. **Start using** the enhanced security features!

---

## 💡 Tips

- Start with **NVD** and **GitHub** - they're easiest to setup
- **Gemini AI** provides powerful security insights
- **Shodan** requires credits even on free tier for some features
- **AbuseIPDB** is great for checking suspicious IPs
- Store keys securely and never commit them to git
- Use environment variables for production deployments

---

## 📞 Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify API keys are correct
3. Test individual APIs using curl
4. Check API service status pages

Happy hacking! 🔐
