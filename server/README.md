# HackWebTools Backend

Real security testing API backend built with Node.js/Express and FREE APIs.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your FREE API keys (optional but recommended)
```

### 3. Get FREE API Keys (Optional)

| Service | Free Tier | Sign Up Link |
|---------|-----------|--------------|
| **NVD API** | Unlimited (with key: 50 req/30sec) | https://nvd.nist.gov/developers/request-an-api-key |
| **VirusTotal** | 4 requests/minute | https://www.virustotal.com/gui/join-us |
| **GitHub** | 5000 requests/hour | https://github.com/settings/tokens |
| **Shodan** | 100 queries/month | https://account.shodan.io/register |
| **SecurityTrails** | 50 requests/month | https://securitytrails.com/app/signup |
| **AbuseIPDB** | 1000 checks/day | https://www.abuseipdb.com/register |

### 4. Run Development Server
```bash
npm run dev
```

### 5. Run Production Server
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### CVE Database (NVD)
- `GET /api/cve/search?keyword=sql` - Search CVEs
- `GET /api/cve/recent?days=7` - Recent CVEs
- `GET /api/cve/:cveId` - CVE details

### Exploit Search
- `GET /api/exploits/search?query=wordpress` - Search exploits
- `GET /api/exploits/cve/:cveId` - Find exploits for CVE
- `GET /api/exploits/trending` - Trending exploits

### SSL/TLS Analysis
- `GET /api/ssl/check?hostname=example.com` - Check SSL certificate
- `GET /api/ssl/analyze?hostname=example.com` - SSL Labs analysis
- `GET /api/ssl/certs?domain=example.com` - Certificate transparency logs

### DNS Tools
- `GET /api/dns/lookup?domain=example.com&type=A` - DNS lookup
- `GET /api/dns/reverse?ip=8.8.8.8` - Reverse DNS
- `GET /api/dns/whois?domain=example.com` - WHOIS lookup
- `GET /api/dns/comprehensive?domain=example.com` - Full DNS analysis

### Subdomain Enumeration
- `GET /api/subdomain/enumerate?domain=example.com` - Find subdomains
- `POST /api/subdomain/bruteforce` - Brute force subdomains

### Security Scanning
- `POST /api/scan/headers` - Analyze HTTP security headers
- `POST /api/scan/xss` - Test for XSS vulnerabilities

### Threat Intelligence
- `POST /api/threat/ip` - Check IP reputation (AbuseIPDB)
- `POST /api/threat/domain` - Check domain reputation (VirusTotal)
- `POST /api/threat/url` - Scan URL for threats
- `GET /api/threat/shodan/:ip` - Shodan host lookup

### Reports
- `POST /api/report/generate` - Generate JSON report
- `POST /api/report/pdf` - Generate PDF report (placeholder)

## 🔧 Deploy to Render (FREE)

### 1. Create Render Account
Visit https://render.com and sign up (FREE tier: 750 hours/month)

### 2. Deploy Backend
1. Push code to GitHub
2. Go to Render Dashboard → New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Name**: hackwebtools-backend
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: Free

### 3. Add Environment Variables in Render
Go to Environment tab and add:
```
NODE_ENV=production
FRONTEND_URL=https://hackingtoolsinfo.netlify.app
MONGODB_URI=mongodb+srv://...
NVD_API_KEY=your_key
VIRUSTOTAL_API_KEY=your_key
GITHUB_TOKEN=your_token
SHODAN_API_KEY=your_key
SECURITYTRAILS_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
JWT_SECRET=your_secret
```

### 4. Deploy
Click "Create Web Service" and wait for deployment (3-5 minutes)

Your backend will be live at: `https://hackwebtools-backend.onrender.com`

## 🗄️ Database Setup (FREE Options)

### Option 1: MongoDB Atlas (Recommended)
1. Visit https://cloud.mongodb.com
2. Create FREE cluster (512MB storage)
3. Get connection string
4. Add to `.env`: `MONGODB_URI=mongodb+srv://...`

### Option 2: Supabase PostgreSQL
1. Visit https://supabase.com
2. Create FREE project (500MB storage)
3. Get connection string
4. Use with Prisma/TypeORM

### Option 3: No Database
Backend works without database! Uses localStorage fallback.

## 🔌 WebSocket Support

WebSocket server runs on `/ws` path for real-time features:
```javascript
const ws = new WebSocket('ws://localhost:5000/ws');
ws.onmessage = (event) => console.log(event.data);
```

## 📦 Features

✅ **Real CVE Data** - Live CVE database from NVD  
✅ **Exploit Search** - GitHub exploit repositories  
✅ **SSL/TLS Analysis** - Certificate checking & SSL Labs integration  
✅ **DNS Tools** - Comprehensive DNS analysis & WHOIS  
✅ **Subdomain Enum** - crt.sh, HackerTarget, SecurityTrails  
✅ **Header Security** - HTTP security header analysis  
✅ **Threat Intel** - IP/Domain reputation checking  
✅ **WebSocket** - Real-time updates  
✅ **Rate Limiting** - Protection against abuse  
✅ **CORS Enabled** - Frontend integration ready  

## 🔐 Security Notes

- All API keys should be kept secret
- Use HTTPS in production
- Implement authentication for sensitive endpoints
- Rate limiting is enabled by default
- Never expose .env file

## 📄 License

MIT License - Free to use for educational purposes
