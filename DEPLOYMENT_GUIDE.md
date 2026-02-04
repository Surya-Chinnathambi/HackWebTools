# 🚀 FREE Deployment Guide - HackWebTools with Real Backend

## Overview
Deploy HackWebTools with a **REAL backend** using **100% FREE services**:
- ✅ **Frontend**: Netlify (already deployed)
- ✅ **Backend**: Render.com (750 hours/month FREE)
- ✅ **Database**: MongoDB Atlas (512MB FREE) or Run without DB
- ✅ **APIs**: All APIs have free tiers (see below)

**Total Cost: $0/month** 🎉

---

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Render account (sign up at https://render.com)
3. ✅ MongoDB Atlas account (optional - https://cloud.mongodb.com)

---

## 🔧 Step 1: Get FREE API Keys (15 minutes)

### Required (Core Functionality)

#### 1. NVD API Key (CVE Database)
- **Free Tier**: Unlimited CVEs, 50 requests per 30 seconds
- **Sign Up**: https://nvd.nist.gov/developers/request-an-api-key
- **Steps**:
  1. Fill out form with your email
  2. Check email for API key
  3. Copy key to notepad
- **Without key**: Still works, but limited to 5 requests per 30 seconds

#### 2. GitHub Personal Access Token (Exploit Search)
- **Free Tier**: 5,000 requests/hour
- **Sign Up**: https://github.com/settings/tokens
- **Steps**:
  1. Click "Generate new token (classic)"
  2. Name: `HackWebTools Backend`
  3. Select scopes: `public_repo`, `read:org`
  4. Generate and copy token
- **Without token**: Works but limited to 60 requests/hour

### Optional (Enhanced Features)

#### 3. VirusTotal API Key (Malware/Threat Scanning)
- **Free Tier**: 4 requests/minute, 500/day
- **Sign Up**: https://www.virustotal.com/gui/join-us
- **Steps**:
  1. Create account
  2. Go to Profile → API Key
  3. Copy API key

#### 4. Shodan API Key (Host Intelligence)
- **Free Tier**: 100 queries/month
- **Sign Up**: https://account.shodan.io/register
- **Steps**:
  1. Create account
  2. Go to Account → API Key
  3. Copy API key

#### 5. SecurityTrails API Key (Subdomain Enumeration)
- **Free Tier**: 50 API calls/month
- **Sign Up**: https://securitytrails.com/app/signup
- **Steps**:
  1. Create account
  2. Go to API → Generate Key
  3. Copy API key

#### 6. AbuseIPDB API Key (IP Reputation)
- **Free Tier**: 1,000 checks/day
- **Sign Up**: https://www.abuseipdb.com/register
- **Steps**:
  1. Create account
  2. Go to API → Generate Key
  3. Copy API key

---

## 🗄️ Step 2: Setup Database (Optional - 10 minutes)

### Option A: MongoDB Atlas (Recommended)

1. **Create Account**: https://cloud.mongodb.com/
2. **Create Cluster**:
   - Choose **FREE M0 Sandbox** (512MB)
   - Select region closest to your backend
   - Cluster name: `hackwebtools`
3. **Create User**:
   - Database Access → Add New User
   - Username: `hackwebtools`
   - Password: Generate strong password
   - Permissions: Read & Write to any database
4. **Whitelist IPs**:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - (For production, use specific IPs)
5. **Get Connection String**:
   - Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://hackwebtools:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hackwebtools?retryWrites=true&w=majority`

### Option B: No Database
Backend works without database! Uses localStorage fallback.
Simply skip this step and don't set `MONGODB_URI` environment variable.

---

## 🖥️ Step 3: Deploy Backend to Render (15 minutes)

### 3.1 Push Code to GitHub

```bash
# If not already pushed
git add .
git commit -m "Add backend API with real security testing"
git push origin main
```

### 3.2 Create Render Web Service

1. **Go to Render**: https://dashboard.render.com
2. **Click**: New → Web Service
3. **Connect Repository**:
   - Click "Connect GitHub"
   - Select your `HackWebTools` repository
4. **Configure Service**:
   - **Name**: `hackwebtools-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: `Free`

### 3.3 Add Environment Variables

In the "Environment" tab, add these variables:

```env
# Required
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hackingtoolsinfo.netlify.app

# Database (optional)
MONGODB_URI=mongodb+srv://hackwebtools:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hackwebtools

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_randomly_generated_secret_here

# API Keys (add the ones you obtained)
NVD_API_KEY=your_nvd_api_key
GITHUB_TOKEN=your_github_token
VIRUSTOTAL_API_KEY=your_virustotal_key
SHODAN_API_KEY=your_shodan_key
SECURITYTRAILS_API_KEY=your_securitytrails_key
ABUSEIPDB_API_KEY=your_abuseipdb_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Your backend will be live at: `https://hackwebtools-backend.onrender.com`

### 3.5 Test Backend

Visit: `https://hackwebtools-backend.onrender.com/health`

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-04T...",
  "uptime": 123.45,
  "environment": "production"
}
```

---

## 🌐 Step 4: Update Frontend to Use Real Backend (5 minutes)

### 4.1 Update Environment Variables

Create `.env` file in your project root:

```bash
# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=https://hackwebtools-backend.onrender.com/api
VITE_WS_URL=wss://hackwebtools-backend.onrender.com/ws
```

### 4.2 Update Netlify Environment Variables

1. Go to Netlify Dashboard → Your Site
2. Site settings → Environment variables
3. Add:
   - `VITE_API_URL` = `https://hackwebtools-backend.onrender.com/api`
   - `VITE_WS_URL` = `wss://hackwebtools-backend.onrender.com/ws`

### 4.3 Redeploy Frontend

```bash
# Commit environment config
git add .env.example
git commit -m "Configure production backend URL"
git push origin main
```

Netlify will auto-deploy (2-3 minutes).

---

## ✅ Step 5: Verify Everything Works

### Test Each Feature:

1. **CVE Search**: Go to Dashboard → Search for "sql injection"
   - Should show REAL CVEs from NVD database
   
2. **Exploit Search**: Search for any CVE (e.g., CVE-2024-1234)
   - Should show GitHub repositories

3. **SSL Checker**: Test any domain (e.g., google.com)
   - Should show certificate details

4. **Subdomain Enum**: Test any domain
   - Should find subdomains from crt.sh

5. **Header Scanner**: Test any URL
   - Should analyze security headers

6. **Threat Intel**: Check any IP or domain
   - Should show reputation (if API keys configured)

---

## 📊 What's Now REAL vs Simulated

### ✅ NOW REAL:
- ✅ CVE Database (NVD API) - Live vulnerabilities
- ✅ Exploit Search (GitHub API) - Real exploit code
- ✅ SSL/TLS Analysis - Actual certificate checking
- ✅ DNS Lookups - Real DNS queries
- ✅ Subdomain Enumeration - crt.sh, HackerTarget, SecurityTrails
- ✅ HTTP Header Analysis - Real HTTP requests
- ✅ Threat Intelligence - IP/Domain reputation checking
- ✅ WebSocket - Real-time updates
- ✅ WHOIS Lookups - Domain registration info

### ⚠️ Still Simulated (Requires Native Tools):
- Port Scanning (needs nmap on server)
- Hash Cracking (needs hashcat on server)
- Network Packet Analysis (needs tcpdump/wireshark)

### 💡 To Make Everything Real:
Deploy backend on VPS (DigitalOcean/Linode) and install native tools.
This FREE deployment focuses on web-based security testing.

---

## 🔍 Backend API Examples

### Test with cURL:

```bash
# Health check
curl https://hackwebtools-backend.onrender.com/health

# Search CVEs
curl "https://hackwebtools-backend.onrender.com/api/cve/search?keyword=sql&resultsPerPage=5"

# Check SSL certificate
curl "https://hackwebtools-backend.onrender.com/api/ssl/check?hostname=google.com"

# Enumerate subdomains
curl "https://hackwebtools-backend.onrender.com/api/subdomain/enumerate?domain=example.com"

# Scan headers
curl -X POST https://hackwebtools-backend.onrender.com/api/scan/headers \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

---

## 🚨 Important Notes

### Render Free Tier Limitations:
- ⚠️ **Sleeps after 15 minutes** of inactivity
- ⏱️ **Cold start**: First request takes 30-60 seconds
- ✅ **750 hours/month** = Always on if only 1 service
- 💡 **Solution**: Keep-alive ping every 10 minutes

### API Rate Limits:
| API | Free Limit | What Happens When Exceeded |
|-----|-----------|---------------------------|
| NVD | 50 req/30sec | Wait 30 seconds |
| GitHub | 5000 req/hour | Wait 1 hour |
| VirusTotal | 4 req/min | Wait 1 minute |
| Shodan | 100 req/month | Upgrade or wait next month |
| crt.sh | Unlimited | - |
| HackerTarget | ~100/day | Use other sources |

### MongoDB Atlas:
- ⚠️ **Free tier expires after 90 days** (need to recreate)
- ✅ **512MB** storage is enough for 100k+ scans
- 💡 **Alternative**: Use Supabase PostgreSQL (never expires)

---

## 🎯 Cost Breakdown

| Service | Free Tier | Paid Tier | What You Get |
|---------|-----------|-----------|--------------|
| **Render** | 750 hrs/mo | $7/mo | Backend API hosting |
| **Netlify** | Unlimited | - | Frontend hosting |
| **MongoDB** | 512MB | $9/mo | Database |
| **NVD API** | Unlimited | - | CVE database |
| **GitHub API** | 5000/hr | - | Exploit search |
| **crt.sh** | Unlimited | - | Subdomain enum |
| **SSL Labs** | Unlimited | - | SSL analysis |
| **HackerTarget** | 100/day | - | Subdomain enum |

**Total FREE**: All features work!  
**Total with upgrades**: $16/month for unlimited usage

---

## 🔧 Troubleshooting

### Backend Won't Start:
1. Check Render logs: Dashboard → Logs tab
2. Verify environment variables are set
3. Make sure `cd server && npm start` is start command

### Frontend Can't Connect:
1. Check backend health: Visit `/health` endpoint
2. Verify `VITE_API_URL` in Netlify environment variables
3. Check CORS settings in backend `index.js`

### API Returning Errors:
1. Check if API keys are valid
2. Verify you're not hitting rate limits
3. Test API directly with cURL

### MongoDB Connection Failed:
1. Verify connection string is correct
2. Check if IP whitelist includes 0.0.0.0/0
3. Confirm database user has correct permissions

---

## 🎉 You're Done!

Your HackWebTools now has:
- ✅ Real CVE database with 200,000+ vulnerabilities
- ✅ Live exploit search from GitHub
- ✅ Actual SSL/TLS certificate analysis
- ✅ Real subdomain enumeration
- ✅ Working threat intelligence
- ✅ WebSocket real-time updates
- ✅ Professional API backend

**Next Steps:**
1. Test all features thoroughly
2. Add more API integrations as needed
3. Implement user authentication
4. Add scan history with MongoDB
5. Create professional PDF reports

**Need Help?**
- Backend logs: Render Dashboard → Logs
- Frontend logs: Browser DevTools → Console
- API docs: Visit `/api` endpoint
