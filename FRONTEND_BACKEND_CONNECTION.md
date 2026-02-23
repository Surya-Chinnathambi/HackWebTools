# Frontend → Backend API Connection Guide

## ✅ All Frontend Services Updated

All frontend API services have been configured to connect to the **Python FastAPI backend** running on **port 8000**.

---

## Configuration Changes

### Environment Variables

**Updated Files:**
- `.env` - Development environment
- `.env.example` - Template for new setups

**Changes:**
```bash
# OLD (Node.js)
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws

# NEW (Python FastAPI)
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

---

## Updated Service Files

### 1. **BackendService.ts** ✅

**Changes:**
- Base URL: `http://localhost:5000/api` → `http://localhost:8000/api/v1`
- All endpoints prefixed with `/tools/` for security tools

**Updated Endpoints:**
```typescript
// CVE Endpoints
/cve/search → /tools/cve/search
/cve/recent → /tools/cve/recent

// Exploit Endpoints
/exploits/search → /tools/exploits/search

// SSL/TLS Endpoints
/ssl/check → /tools/ssl/check

// DNS Endpoints
/dns/lookup → /tools/dns/lookup (parameter: type → record_type)

// Subdomain Endpoints
/subdomain/enumerate → /tools/subdomain/enumerate

// Security Scanning
/scan/headers → /tools/scan/headers

// Threat Intelligence
/threat/ip → /tools/threat/ip
/threat/domain → /tools/threat/domain

// Report Generation
/report/generate → /tools/report/generate
```

### 2. **AnalyticsService.ts** ✅

**Changes:**
- Base URL: `http://localhost:3000` → `http://localhost:8000`
- Analytics endpoint: `/api/analytics/track` → `/api/v1/analytics/track`

### 3. **PaymentService.ts** ✅

**Changes:**
- Base URL: `http://localhost:3000` → `http://localhost:8000`

**Updated Endpoints:**
```typescript
/api/payments/create-checkout-session → /api/v1/payments/create-checkout-session
/api/payments/create-portal-session → /api/v1/payments/create-portal-session
/api/payments/subscription/{id} → /api/v1/payments/subscription/{id}
/api/payments/cancel-subscription → /api/v1/payments/cancel-subscription
```

### 4. **AdminDashboard.tsx** ✅

**Changes:**
- Analytics summary: `/api/analytics/summary` → `/api/v1/analytics/summary`
- Analytics funnel: `/api/analytics/funnel` → `/api/v1/analytics/funnel`

---

## API Endpoint Mapping

### Complete Endpoint List

| Category | Old Endpoint | New Python Endpoint | Status |
|----------|-------------|-------------------|--------|
| **CVE Database** |
| Search CVEs | `/cve/search` | `/api/v1/tools/cve/search` | ✅ |
| Recent CVEs | `/cve/recent` | `/api/v1/tools/cve/recent` | ✅ |
| **Exploit Database** |
| Search Exploits | `/exploits/search` | `/api/v1/tools/exploits/search` | ✅ |
| **DNS Tools** |
| DNS Lookup | `/dns/lookup` | `/api/v1/tools/dns/lookup` | ✅ |
| **SSL/TLS** |
| Check SSL | `/ssl/check` | `/api/v1/tools/ssl/check` | ✅ |
| **Subdomain Enumeration** |
| Enumerate | `/subdomain/enumerate` | `/api/v1/tools/subdomain/enumerate` | ✅ |
| **Security Scanner** |
| Scan Headers | `/scan/headers` | `/api/v1/tools/scan/headers` | ✅ |
| **Threat Intelligence** |
| Check IP | `/threat/ip` | `/api/v1/tools/threat/ip` | ✅ |
| Check Domain | `/threat/domain` | `/api/v1/tools/threat/domain` | ✅ |
| **Reports** |
| Generate Report | `/report/generate` | `/api/v1/tools/report/generate` | ✅ |
| **Analytics** |
| Track Event | `/api/analytics/track` | `/api/v1/analytics/track` | ✅ |
| Get Summary | `/api/analytics/summary` | `/api/v1/analytics/summary` | ✅ |
| Get Funnel | `/api/analytics/funnel` | `/api/v1/analytics/funnel` | ✅ |
| **Payments** |
| Create Checkout | `/api/payments/create-checkout-session` | `/api/v1/payments/create-checkout-session` | ✅ |
| Create Portal | `/api/payments/create-portal-session` | `/api/v1/payments/create-portal-session` | ✅ |
| **Learning Paths** |
| List Paths | `/api/v1/learning-paths` | `/api/v1/learning-paths` | ✅ |
| Enroll | `/api/v1/learning-paths/enroll` | `/api/v1/learning-paths/enroll` | ✅ |
| **Quizzes** |
| Get Categories | `/api/v1/quizzes/categories` | `/api/v1/quizzes/categories` | ✅ |
| Generate Quiz | `/api/v1/quizzes/generate/{category}` | `/api/v1/quizzes/generate/{category}` | ✅ |
| Submit Quiz | `/api/v1/quizzes/submit` | `/api/v1/quizzes/submit` | ✅ |
| Leaderboard | `/api/v1/quizzes/leaderboard/{category}` | `/api/v1/quizzes/leaderboard/{category}` | ✅ |

---

## Testing Frontend → Backend Connection

### 1. Start Python Backend

```bash
cd backend-python
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Verify backend is running:**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health (if implemented)

### 2. Start Frontend

```bash
# In project root
npm install
npm run dev
```

**Frontend will run on:**
- http://localhost:8080

### 3. Test API Connections

#### Method 1: Browser DevTools
1. Open frontend in browser (http://localhost:8080)
2. Open DevTools (F12)
3. Go to Network tab
4. Use any security tool (CVE search, DNS lookup, etc.)
5. Check Network tab for API calls to `localhost:8000`

#### Method 2: Manual API Tests

**Test CVE Search:**
```bash
curl "http://localhost:8000/api/v1/tools/cve/search?keyword=apache&resultsPerPage=5"
```

**Test DNS Lookup:**
```bash
curl "http://localhost:8000/api/v1/tools/dns/lookup?domain=example.com&record_type=A"
```

**Test SSL Check:**
```bash
curl "http://localhost:8000/api/v1/tools/ssl/check?hostname=google.com"
```

**Test Threat Intelligence:**
```bash
curl -X POST http://localhost:8000/api/v1/tools/threat/ip \
  -H "Content-Type: application/json" \
  -d '{"ip": "8.8.8.8"}'
```

**Test Analytics:**
```bash
curl -X POST http://localhost:8000/api/v1/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "page_view",
    "userId": "test123",
    "tier": "free",
    "eventData": {"page": "/dashboard"}
  }'
```

#### Method 3: Frontend Pages to Test

| Page | What to Test | Expected Behavior |
|------|-------------|-------------------|
| `/exploitdb` | Search for exploits | Shows GitHub repos |
| `/cve` | Search CVEs | Shows NVD results |
| `/port-scanner` | Check SSL cert | Shows certificate info |
| `/threat-intel` | Check IP reputation | Shows AbuseIPDB/VirusTotal data |
| `/learning-paths` | View learning paths | Shows 3 career paths |
| `/quizzes` | Take a quiz | Shows quiz questions |
| `/admin` | View analytics | Shows metrics dashboard |

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch" / CORS Error

**Symptoms:**
```
Access to fetch at 'http://localhost:8000/api/v1/...' from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Solution:**
Check Python backend CORS configuration in `backend-python/app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 2: 404 Not Found

**Symptoms:**
```
GET http://localhost:8000/api/cve/search 404 (Not Found)
```

**Cause:** Using old endpoint paths without `/v1/` prefix

**Solution:** Updated automatically in this commit

### Issue 3: Connection Refused

**Symptoms:**
```
Failed to fetch: net::ERR_CONNECTION_REFUSED
```

**Cause:** Python backend not running

**Solution:**
```bash
cd backend-python
uvicorn app.main:app --reload --port 8000
```

### Issue 4: Wrong Port

**Symptoms:**
- Frontend tries to connect to port 3000 or 5000

**Cause:** Old `.env` file or cached environment

**Solution:**
1. Delete `.env`
2. Copy from `.env.example`
3. Restart frontend dev server

```bash
rm .env
cp .env.example .env
npm run dev
```

---

## Environment Variable Reference

### Development (.env)
```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### Production (.env.production)
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws
```

---

## API Response Format

All Python backend endpoints follow this format:

### Success Response:
```json
{
  "data": { ... },
  "timestamp": "2024-02-23T10:30:00Z"
}
```

### Error Response:
```json
{
  "detail": "Error message here",
  "status_code": 400
}
```

---

## WebSocket Connection (Future)

**Not yet implemented in Python backend**

When implemented:
```typescript
import { wsClient } from '@/services/BackendService';

// Connect
wsClient.connect();

// Subscribe to threat feed
wsClient.subscribe('threat-feed');

// Listen for events
wsClient.on('threat-update', (data) => {
  console.log('New threat:', data);
});
```

---

## Verification Checklist

- [x] Updated `BackendService.ts` to port 8000
- [x] Updated `AnalyticsService.ts` to port 8000
- [x] Updated `PaymentService.ts` to port 8000
- [x] Updated `AdminDashboard.tsx` analytics endpoints
- [x] Updated `.env` to port 8000
- [x] Updated `.env.example` to port 8000
- [x] All security tool endpoints use `/tools/` prefix
- [x] All API calls use `/api/v1/` prefix
- [ ] Tested all endpoints manually
- [ ] Verified CORS is working
- [ ] Confirmed WebSocket connection (when implemented)

---

## Next Steps

1. **Start Backend:**
   ```bash
   cd backend-python
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Features:**
   - Visit http://localhost:8080
   - Try CVE search
   - Try DNS lookup
   - Try SSL check
   - Check browser console for errors

4. **Monitor Traffic:**
   - Open DevTools → Network
   - Filter: `localhost:8000`
   - Verify all calls go to Python backend

---

## API Documentation

**Interactive API Docs:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

**Test endpoints directly in Swagger UI before using in frontend**

---

**Status**: ✅ All frontend services connected to Python backend
**Commit**: 3225b94
**Last Updated**: 2024-02-23
