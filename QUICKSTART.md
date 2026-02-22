# 🚀 Quick Start Guide - Python Backend

## Prerequisites
- Python 3.9+ installed
- MongoDB Atlas account (free tier)
- Google Cloud account for OAuth (optional)
- SendGrid account (free 100 emails/day)
- Stripe account (test mode)

---

## Step-by-Step Setup

### 1️⃣ **Install Python Backend**

```bash
cd backend-python
python -m venv venv
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 2️⃣ **Configure Environment Variables**

Create `.env` file from template:
```bash
cp .env.example .env
```

**Required configurations:**

#### MongoDB Atlas (Free Tier)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (512 MB)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string
6. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackwebtools
   ```

#### JWT Secret Key
Generate secure key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
Update `.env`:
```
JWT_SECRET_KEY=your_generated_key_here
SESSION_SECRET=your_generated_key_here
```

#### SendGrid (Optional but recommended)
1. Sign up at [sendgrid.com](https://sendgrid.com/pricing/) - Free tier
2. Create API key in Settings > API Keys
3. Update `.env`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
   FROM_EMAIL=noreply@suryachinnathambi.tech
   ```

#### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5173/auth/google/callback`
6. Update `.env`:
   ```
   GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=xxxxx
   ```

#### Stripe (Optional for payments)
1. Sign up at [stripe.com](https://stripe.com)
2. Get test API keys from Dashboard > Developers > API keys
3. Create products and prices:
   - Pro: $19/month
   - Enterprise: $49/month
4. Copy price IDs (start with `price_`)
5. Update `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_PRO_PRICE_ID=price_xxxxx
   STRIPE_ENTERPRISE_PRICE_ID=price_xxxxx
   ```

### 3️⃣ **Run the Server**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     🚀 Starting HackWebTools Backend...
INFO:     ✅ MongoDB connected
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 4️⃣ **Test the API**

**Option A: Open Swagger UI**
- Navigate to: http://localhost:8000/api/docs
- Interactive API documentation
- Test endpoints directly in browser

**Option B: Use curl**
```bash
# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "Test1234"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=test@example.com&password=Test1234'
```

**Option C: Health Check**
```bash
curl http://localhost:8000/health
```

---

## 🔥 Quick Tips

### Minimal Setup (Skip Optional Services)
You can start with just MongoDB:
1. Only configure `MONGODB_URI` and `JWT_SECRET_KEY`
2. Comment out SendGrid/Google/Stripe code if needed
3. Email verification will be skipped
4. OAuth login won't work
5. Payments won't work

Basic `.env` for testing:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hackwebtools
JWT_SECRET_KEY=your_32_char_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
ENVIRONMENT=development
DEBUG=True
```

### Using Docker (Alternative)
```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Run:
```bash
docker build -t hackwebtools-backend .
docker run -p 8000:8000 --env-file .env hackwebtools-backend
```

### MongoDB Local Instance (Alternative to Atlas)
If you prefer local MongoDB:
```bash
# Install MongoDB locally
# Then update .env:
MONGODB_URI=mongodb://localhost:27017/hackwebtools
```

---

## 📊 Verify Setup

### 1. Check Health Endpoint
```bash
curl http://localhost:8000/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00",
  "environment": "development"
}
```

### 2. Check API Docs
Open browser: http://localhost:8000/api/docs

You should see all endpoints organized by tags:
- Authentication (8 endpoints)
- Users (11 endpoints)
- Payments (7 endpoints)

### 3. Test Registration Flow
1. Register user → Get user object
2. Check email for verification link (if SendGrid configured)
3. Login → Get access token
4. Use token to access `/api/v1/users/me`

---

## 🐛 Troubleshooting

### Error: "Could not connect to MongoDB"
- Check MongoDB URI format
- Verify network whitelist (0.0.0.0/0)
- Ensure database user has read/write permissions

### Error: "Module not found"
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Error: "Port 8000 already in use"
```bash
# Use different port
uvicorn main:app --reload --port 8001
```

### SendGrid emails not sending
- Verify API key is correct
- Check SendGrid dashboard for errors
- Ensure sender email is verified
- Free tier limit: 100 emails/day

### CORS errors in frontend
Update `.env`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🚀 Deploy to Production

### Option 1: Render.com (Recommended)
1. Push code to GitHub
2. Create account on [render.com](https://render.com)
3. New Web Service → Connect repository
4. Settings:
   - Environment: Python 3
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`
6. Deploy!

Free tier includes:
- 750 hours/month
- Automatic HTTPS
- Custom domain support

### Option 2: Railway.app
```bash
railway login
railway init
railway up
```

### Option 3: Heroku
```bash
heroku create hackwebtools-api
git push heroku main
heroku config:set MONGODB_URI=your_uri
```

---

## 📝 Next Steps

1. ✅ Backend is running
2. Update frontend to call Python API
3. Test full authentication flow
4. Start Phase 2: Learning Paths
5. Build Telegram bot (Phase 7)

---

## 🆘 Need Help?

- Check [BACKEND_STATUS.md](BACKEND_STATUS.md) for full documentation
- Read [README.md](backend-python/README.md) for architecture details
- Test endpoints at http://localhost:8000/api/docs
- Check logs for error messages

**Contact**: surya@suryachinnathambi.tech
