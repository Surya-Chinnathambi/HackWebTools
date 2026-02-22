# HackWebTools Python Backend

FastAPI backend for HackWebTools cybersecurity learning platform with MongoDB, JWT authentication, and comprehensive progress tracking.

## Features

- 🔐 **JWT Authentication** - Secure token-based auth with access & refresh tokens
- 🌐 **Google OAuth** - Sign in with Google integration
- 📧 **Email Service** - SendGrid integration for verification & password reset
- 📊 **Progress Tracking** - Track tools, quizzes, challenges, courses, and learning paths
- 🏆 **Gamification** - Points, streaks, certificates, and leaderboards
- 💳 **Stripe Integration** - Subscription management (Free, Pro, Enterprise)
- 🚀 **Fast & Async** - Built with FastAPI and Motor (async MongoDB)

## Tech Stack

- **Framework**: FastAPI 0.104+
- **Database**: MongoDB Atlas (Motor async driver)
- **Authentication**: python-jose (JWT), Google OAuth2
- **Email**: SendGrid
- **Payment**: Stripe
- **Validation**: Pydantic v2

## Setup

### 1. Install Dependencies

```bash
cd backend-python
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URL` - MongoDB Atlas connection string
- `SECRET_KEY` - JWT secret (generate with `openssl rand -hex 32`)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `SENDGRID_API_KEY` - SendGrid API key
- `STRIPE_SECRET_KEY` - Stripe secret key

### 3. Run Development Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/api/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/api/redoc

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /register` - Register new user
- `POST /login` - Login with email/password
- `POST /google` - Google OAuth login
- `POST /refresh` - Refresh access token
- `POST /verify-email` - Verify email with token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /logout` - Logout (clear cookies)

### Users (`/api/v1/users`)

- `GET /me` - Get current user profile
- `PUT /me` - Update profile
- `GET /me/stats` - Get user statistics
- `GET /me/dashboard` - Get dashboard data
- `POST /me/progress/page-read` - Mark page as read
- `POST /me/progress/tool-completed` - Mark tool completed
- `POST /me/progress/quiz-score` - Record quiz score
- `POST /me/progress/challenge-completed` - Complete challenge
- `GET /me/progress/streak` - Get current streak
- `GET /me/progress/history` - Get learning history
- `GET /{user_id}/public-profile` - Get public profile

## Project Structure

```
backend-python/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py       # API router aggregation
│   │       └── routes/
│   │           ├── auth.py       # Authentication endpoints
│   │           └── users.py      # User endpoints
│   ├── core/
│   │   ├── config.py             # Settings (Pydantic)
│   │   ├── database.py           # MongoDB connection
│   │   └── security.py           # JWT & password utils
│   ├── middleware/
│   │   └── auth.py               # JWT middleware
│   ├── models/
│   │   └── user.py               # User model & schemas
│   └── services/
│       ├── email.py              # SendGrid service
│       └── user_service.py       # User CRUD operations
```

## MongoDB Collections

### `users`

```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "full_name": "John Doe",
  "hashed_password": "bcrypt_hash",
  "is_verified": true,
  "is_active": true,
  "is_admin": false,
  "google_id": "optional_google_id",
  "oauth_provider": "google",
  "profile_picture": "url",
  "progress": {
    "tools_completed": ["nmap", "sqlmap"],
    "pages_read": ["/docs/nmap"],
    "quizzes_attempted": {"nmap_quiz": 85},
    "challenges_completed": ["port_scan_challenge"],
    "courses_enrolled": ["web_security"],
    "learning_paths": {"beginner": 75},
    "total_points": 350,
    "last_activity": "2024-01-15T10:00:00"
  },
  "stats": {
    "tools_learned": 15,
    "quizzes_passed": 8,
    "challenges_solved": 5,
    "total_study_time": 7200,
    "certificates_earned": 2,
    "current_streak": 7,
    "longest_streak": 14
  },
  "subscription": {
    "tier": "pro",
    "stripe_customer_id": "cus_xxx",
    "stripe_subscription_id": "sub_xxx",
    "status": "active",
    "current_period_end": "2024-02-15T00:00:00"
  },
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-15T10:00:00",
  "last_login": "2024-01-15T09:00:00"
}
```

## Authentication Flow

### Email/Password Registration
1. User submits email + password
2. Server creates user with hashed password
3. Verification email sent with 24hr token
4. User clicks link → email verified
5. User can now login

### Google OAuth
1. User clicks "Sign in with Google"
2. Frontend gets Google credential token
3. Backend verifies token with Google
4. Create/update user account
5. Return JWT tokens

### Token Management
- **Access Token**: 30 minutes, used for API requests
- **Refresh Token**: 7 days, stored in HTTP-only cookie
- Refresh endpoint provides new tokens

## Progress Tracking

### Points System
- Page read: +5 points
- Tool completed: +10 points
- Quiz passed (70%+): Score as points (0-100)
- Challenge completed: +50 points (varies)

### Streaks
- Streak increments on daily activity
- Breaks if no activity for 2+ days
- Tracks current & longest streak

## Deployment

### Render.com (Backend)
1. Connect GitHub repo
2. Set environment: Python 3.11
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`

### Environment Variables (Production)
```
ENVIRONMENT=production
MONGODB_URL=mongodb+srv://...
SECRET_KEY=your_secret_key
FRONTEND_URL=https://hacktools.suryachinnathambi.tech
GOOGLE_CLIENT_ID=...
SENDGRID_API_KEY=...
STRIPE_SECRET_KEY=...
```

## Development

### Run Tests
```bash
pytest
```

### Format Code
```bash
black .
```

### Lint
```bash
flake8 .
```

## Cost Breakdown

- **MongoDB Atlas**: Free tier (512MB)
- **SendGrid**: Free tier (100 emails/day)
- **Render**: Free tier ($0) or Starter ($7/month)
- **Stripe**: Transaction fees only (2.9% + $0.30)

**Total**: $0-7/month

## Next Steps

- [ ] Add rate limiting middleware
- [ ] Implement learning paths API
- [ ] Add quiz generation system
- [ ] Create certificate generation
- [ ] Build Telegram bot integration
- [ ] Add admin analytics endpoints
- [ ] Implement file upload (S3/Cloudinary)
- [ ] Add caching (Redis)

## Support

For issues or questions, contact: surya@suryachinnathambi.tech
