# 🛡️ HackWebTools - Professional Security Testing Platform

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://hackingtoolsinfo.netlify.app/)

> **Comprehensive web-based penetration testing toolkit with REAL security testing capabilities powered by FREE APIs.**

🔗 **Live Application**: https://hackingtoolsinfo.netlify.app/  
🔗
📚 **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🚀 What's New: REAL Backend Integration!

This project now includes a **fully functional backend API** that provides:

✅ **Real CVE Database** - Live vulnerability data from NVD API (200,000+ CVEs)  
✅ **Exploit Search** - GitHub repository search for exploit code  
✅ **SSL/TLS Analysis** - Actual certificate checking & SSL Labs integration  
✅ **DNS Tools** - Real DNS lookups, WHOIS, reverse DNS  
✅ **Subdomain Enumeration** - Certificate transparency logs (crt.sh), HackerTarget, SecurityTrails  
✅ **Security Header Scanner** - HTTP header analysis  
✅ **Threat Intelligence** - IP/Domain reputation via VirusTotal, AbuseIPDB, Shodan  
✅ **WebSocket Support** - Real-time updates and notifications  
✅ **100% FREE** - All services use free tiers (Render, MongoDB Atlas, free APIs)

---

## 📋 Features

### 🎯 Security Tools (700+ Documented)
- Comprehensive tool database with detailed documentation
- Categories: Information Gathering, Vulnerability Analysis, Web Apps, Password Attacks, etc.
- Installation guides, usage examples, and GitHub links

### 🔐 Real Security Testing
- **CVE Database**: Search 200,000+ vulnerabilities with CVSS scores
- **Exploit Search**: Find POC exploits from GitHub
- **SSL Checker**: Certificate expiry, cipher strength, SSL Labs grade
- **DNS Analyzer**: A/AAAA/MX/TXT/NS records, SPF/DMARC validation
- **Subdomain Enum**: Discover subdomains via multiple sources
- **Header Scanner**: Check security headers (HSTS, CSP, X-Frame-Options)
- **Threat Intel**: IP/Domain reputation and malware scanning

### 📚 Learning Hub
- 30-day structured cybersecurity roadmap
- Git mastery training (20+ commands, workflows, exercises)
- YouTube channels, podcasts, books, courses
- OWASP Top 10 interactive lab
- Security fundamentals (CIA Triad, VAPT methodology)

### 🛠️ Practical Tools
- Payload library (100,000+ XSS, SQLi, fuzzing payloads)
- Wordlist generator with 12 mutation types
- Reverse shell generator (20+ languages)
- Encoder/Decoder (Base64, URL, HTML, JWT, Hash)
- Report generator with professional templates
- Port scanner with service detection
- Hash cracker (dictionary, brute force, rainbow tables)

### 📊 Dashboard & Analytics
- Security metrics and scoring
- Vulnerability tracking by severity
- Compliance status (OWASP, ISO 27001, PCI-DSS)
- Threat intelligence feed
- Recent activity timeline

---

## 🏗️ Architecture

### Frontend Stack
- **React 18** + TypeScript
- **Vite** - Lightning fast dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing

### Backend Stack (NEW!)
- **Node.js** + Express
- **WebSocket** - Real-time communication
- **MongoDB** - Optional persistence (free tier)
- **Axios** - HTTP client
- **Helmet** - Security middleware
- **Rate Limiting** - DDoS protection

### Free APIs Integrated
| API | Purpose | Free Tier |
|-----|---------|-----------|
| **NVD** | CVE database | 50 req/30sec |
| **GitHub** | Exploit search | 5,000 req/hour |
| **VirusTotal** | Malware scanning | 4 req/min |
| **Shodan** | Host intelligence | 100 req/month |
| **SecurityTrails** | Subdomain enum | 50 req/month |
| **AbuseIPDB** | IP reputation | 1,000 req/day |
| **crt.sh** | Certificate transparency | Unlimited |
| **SSL Labs** | SSL analysis | Unlimited |
| **HackerTarget** | Network tools | 100 req/day |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & npm
- (Optional) MongoDB Atlas account
- (Optional) API keys for enhanced features

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/HackWebTools.git
cd HackWebTools
```

### 2. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Configure Environment

**Frontend** (.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws
```

**Backend** (server/.env):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string_optional
JWT_SECRET=your_secret_key

# Optional API keys (get from DEPLOYMENT_GUIDE.md)
NVD_API_KEY=your_key
GITHUB_TOKEN=your_token
VIRUSTOTAL_API_KEY=your_key
SHODAN_API_KEY=your_key
SECURITYTRAILS_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
```

### 4. Run Development Servers

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

Visit: http://localhost:5173

---

## 🌐 Deployment (100% FREE)

Deploy both frontend and backend for **$0/month**:

1. **Frontend**: Netlify (Already deployed)
2. **Backend**: Render.com (750 hours/month free)
3. **Database**: MongoDB Atlas (512MB free)

📚 **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Quick Deploy to Render**:
1. Push code to GitHub
2. Create Web Service on Render
3. Connect repository
4. Build: `cd server && npm install`
5. Start: `cd server && npm start`
6. Add environment variables
7. Deploy! (3-5 minutes)

---

## 📖 Documentation

- 📄 [Deployment Guide](DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- 📄 [Backend README](server/README.md) - API documentation
- 📄 [Phase 1 Complete](PHASE1_COMPLETE.md) - Initial features
- 📄 [Phase 2 Complete](PHASE2_COMPLETE.md) - Advanced tools
- 📄 [Phase 3 Complete](PHASE3_COMPLETE.md) - Professional features

---

## 🎯 Project Structure

```
HackWebTools/
├── src/                      # Frontend React application
│   ├── components/           # Reusable UI components
│   ├── pages/                # 23 page components
│   ├── services/             # API clients & backend integration
│   ├── utils/                # Helper functions
│   └── types/                # TypeScript definitions
├── server/                   # Backend API (NEW!)
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   │   ├── cve.js       # CVE database
│   │   │   ├── exploits.js  # Exploit search
│   │   │   ├── ssl.js       # SSL/TLS analysis
│   │   │   ├── dns.js       # DNS tools
│   │   │   ├── subdomain.js # Subdomain enumeration
│   │   │   ├── scan.js      # Security scanning
│   │   │   ├── threat.js    # Threat intelligence
│   │   │   ├── auth.js      # Authentication
│   │   │   └── report.js    # Report generation
│   │   ├── config/          # Database & WebSocket config
│   │   └── index.js         # Main server file
│   └── package.json
├── public/
│   └── assets/payloads/     # 100k+ security payloads
├── DEPLOYMENT_GUIDE.md      # Complete deployment instructions
└── README.md                # This file
```

---

## 🔧 Technologies

### Frontend
- Vite 5.4
- React 18.3
- TypeScript 5.5
- Tailwind CSS 3.4
- shadcn/ui
- Framer Motion 12
- React Router 6

### Backend
- Node.js 18+
- Express 4.18
- WebSocket (ws)
- MongoDB (Mongoose)
- Axios
- Helmet (Security)
- Rate Limiting

---

## 🎓 Educational Purpose

**⚠️ IMPORTANT DISCLAIMER**: This tool is designed for:
- ✅ Educational purposes
- ✅ Authorized security testing
- ✅ Learning cybersecurity concepts
- ✅ Practicing ethical hacking skills

**❌ DO NOT USE FOR**:
- Unauthorized access to systems
- Malicious activities
- Testing systems without permission
- Any illegal activities

**Always obtain written permission before testing any system you don't own.**

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

MIT License - Free for educational use

---

## 🌟 Acknowledgments

- NVD for CVE database
- Exploit-DB for vulnerability research
- OWASP for security standards
- All free API providers
- Open source security community

---

## 📧 Support

- 🐛 [Report Issues](https://github.com/yourusername/HackWebTools/issues)
- 💬 [Discussions](https://github.com/yourusername/HackWebTools/discussions)
- 📧 Email: your.email@example.com

---

**Made with ❤️ for the cybersecurity community**
