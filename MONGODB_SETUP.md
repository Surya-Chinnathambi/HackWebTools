# 🍃 MongoDB Local Setup Guide

## Installation Status

MongoDB is currently being installed via winget. Please wait for the installation to complete.

---

## After Installation

### 1. Restart Your Terminal
Close and reopen PowerShell/Terminal to refresh the PATH environment variable.

### 2. Verify Installation
```powershell
mongod --version
```

### 3. Create Data Directory
MongoDB needs a directory to store data:
```powershell
# Create MongoDB data directory
New-Item -ItemType Directory -Force -Path "C:\data\db"
```

### 4. Start MongoDB Server

**Option A: Start as Windows Service (Recommended)**
```powershell
# Start MongoDB service
net start MongoDB
```

**Option B: Start Manually (for testing)**
```powershell
# Start MongoDB in a separate terminal
mongod --dbpath "C:\data\db"
```

### 5. Verify MongoDB is Running
```powershell
# Connect to MongoDB shell
mongosh
```

Or test the connection:
```powershell
# Should return connection info
mongosh --eval "db.version()"
```

---

## Configuration for HackWebTools Backend

Your `.env` file has been updated with:
```env
MONGODB_URI=mongodb://localhost:27017/hackwebtools
DATABASE_NAME=hackwebtools
```

---

## Start Your Backend Server

Once MongoDB is running:
```powershell
cd backend-python
uvicorn main:app --reload --port 8000
```

Visit: **http://localhost:8000/docs** to see API documentation!

---

## Common Commands

| Command | Description |
|---------|-------------|
| `net start MongoDB` | Start MongoDB service |
| `net stop MongoDB` | Stop MongoDB service |
| `mongosh` | Connect to MongoDB shell |
| `mongosh --eval "show dbs"` | List all databases |

---

## Troubleshooting

### MongoDB Service Not Starting
```powershell
# Check service status
Get-Service MongoDB

# If not installed as service, start manually
mongod --dbpath "C:\data\db"
```

### Can't Connect to MongoDB
1. Make sure MongoDB service is running
2. Check if port 27017 is not blocked by firewall
3. Verify data directory exists: `C:\data\db`

### Permission Issues
Run PowerShell as Administrator:
```powershell
# Right-click PowerShell → Run as Administrator
New-Item -ItemType Directory -Force -Path "C:\data\db"
```

---

## Alternative: Use MongoDB Atlas (Cloud)

If you prefer a cloud database instead:

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster (512 MB free tier)
3. Get your connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackwebtools?retryWrites=true&w=majority
   ```

---

## Quick Test

Once MongoDB is running, test the connection:

```powershell
# Test Python connection
python -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017/'); print('✅ Connected to MongoDB:', client.server_info()['version'])"
```

---

**Status:** ⏳ MongoDB installation in progress...

After installation completes:
1. ✅ Close and reopen your terminal
2. ✅ Create data directory: `C:\data\db`
3. ✅ Start MongoDB service: `net start MongoDB`
4. ✅ Start backend: `cd backend-python && uvicorn main:app --reload --port 8000`
