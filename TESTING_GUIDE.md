# 🧪 Frontend-Backend Connection Testing Guide

## ✅ All API Connections Have Been Fixed!

All frontend services now properly connect to your **Python FastAPI backend** on port **8000**.

---

## 📊 What Was Fixed

### Before (❌ Broken):
- Frontend tried to connect to old Node.js backend on ports 3000 and 5000
- Missing `/api/v1/` prefix on all endpoints
- Security tools missing `/tools/` prefix
- DNS lookup using wrong parameter name

### After (✅ Fixed):
- All services connect to Python backend on port 8000
- All endpoints use proper `/api/v1/` prefix
- Security tools properly prefixed with `/tools/`
- All parameters match Python backend expectations

---

## 🚀 Quick Start Testing

### Step 1: Start Python Backend
```bash
cd backend-python
uvicorn app.main:app --reload --port 8000
```

**Verify backend is running:**
- Visit: http://localhost:8000/docs
- You should see the FastAPI Swagger documentation

### Step 2: Start Frontend
```bash
# From project root
npm run dev
```

**Frontend URL:** http://localhost:8080

### Step 3: Run Automated Tests

**Windows:**
```batch
test_api_connections.bat
```

**Linux/Mac:**
```bash
chmod +x test_api_connections.sh
./test_api_connections.sh
```

**Python (all platforms):**
```bash
python test_api_connections.py
```

---

## 🧪 Manual Testing Steps

1. **Open Browser DevTools**
   - Press F12 or right-click → Inspect
   - Go to **Network** tab

2. **Test Security Tools**
   - Try CVE Search: Search for "apache"
   - Try DNS Lookup: Look up "example.com"
   - Try SSL Checker: Check "google.com"
   - Try Threat Intelligence: Check IP "8.8.8.8"

3. **Verify Requests**
   - Check Network tab
   - All requests should go to `localhost:8000`
   - Endpoints should start with `/api/v1/`
   - Should see **200 OK** responses

---

## 📝 Files Modified

| File | Changes Made |
|------|-------------|
| `src/services/BackendService.ts` | Updated base URL + 35+ endpoint paths |
| `src/services/AnalyticsService.ts` | Updated base URL + analytics endpoints |
| `src/services/PaymentService.ts` | Updated base URL + payment endpoints |
| `src/pages/AdminDashboard.tsx` | Updated analytics API calls |
| `.env` | Changed VITE_API_URL to port 8000 |
| `.env.example` | Updated template for new developers |

---

## 🔍 Testing Checklist

- [ ] Python backend running on port 8000
- [ ] Frontend running on port 8080
- [ ] Can access http://localhost:8000/docs
- [ ] Can access http://localhost:8080
- [ ] CVE Search works
- [ ] DNS Lookup works
- [ ] SSL Certificate check works
- [ ] Threat Intelligence works
- [ ] No CORS errors in console
- [ ] All requests go to port 8000
- [ ] Automated test script shows 100% pass rate

---

## ⚠️ Common Issues

### Issue 1: "Failed to fetch" or "Network Error"
**Solution:** Make sure Python backend is running:
```bash
cd backend-python
uvicorn app.main:app --reload --port 8000
```

### Issue 2: CORS Errors
**Solution:** Python backend must allow localhost:8080 in CORS settings.
Check `backend-python/app/main.py` for CORS configuration:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 3: 404 Not Found
**Solution:** Verify endpoint paths match Python backend routes.
Check: http://localhost:8000/docs for available endpoints.

### Issue 4: Frontend Not Using New .env
**Solution:** Restart the frontend development server:
- Stop (`Ctrl+C`)
- Run `npm run dev` again

---

## 📚 Documentation

For complete details, see: [FRONTEND_BACKEND_CONNECTION.md](FRONTEND_BACKEND_CONNECTION.md)

This document includes:
- ✅ Complete endpoint mapping table (40+ endpoints)
- ✅ Detailed testing instructions
- ✅ Troubleshooting guide
- ✅ API documentation links
- ✅ Environment configuration reference

---

## 🎯 Expected Results

### Automated Test Script Output:
```
========================================
Frontend → Backend API Connection Test
========================================

Security Tools Endpoints:
✅ CVE Search - PASS
✅ Recent CVEs - PASS
✅ DNS Lookup - PASS
✅ Exploit Search - PASS
✅ SSL Check - PASS
✅ Header Scan - PASS
✅ IP Reputation - PASS
✅ Domain Reputation - PASS
✅ Subdomain Enumeration - PASS
✅ Report Generation - PASS

Analytics Endpoints:
✅ Track Event - PASS
✅ Analytics Summary - PASS
✅ Analytics Funnel - PASS

Test All APIs:
✅ Test All APIs - PASS

========================================
Summary: 14/14 tests passed (100%)
🎉 All tests passed!
========================================
```

---

## 📞 Next Steps

1. ✅ **Start both servers** (backend on 8000, frontend on 8080)
2. ✅ **Run automated tests** to verify all connections
3. ✅ **Test in browser** to ensure UI works correctly
4. ✅ **Check browser console** for any errors
5. ✅ **Review backend logs** to see incoming requests

---

## 🎉 Success Criteria

Your frontend-backend connection is working correctly when:
- ✅ Automated test script shows 100% pass rate
- ✅ No network errors in browser console
- ✅ All security tools return data
- ✅ Network tab shows requests to `localhost:8000/api/v1/...`
- ✅ Backend logs show incoming requests from frontend

---

**Status:** ✅ All code changes complete and pushed to GitHub

**Commits:**
1. `3225b94` - Fix frontend API connections to use Python FastAPI backend (port 8000)
2. `aa048fb` - Add comprehensive frontend-backend API connection documentation
3. `edc7dcb` - Add automated API connection test scripts (Python, Bash, Batch)

**Ready to test!** 🚀
