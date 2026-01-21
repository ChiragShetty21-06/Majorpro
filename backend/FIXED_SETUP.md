# 🚀 Fixed Setup Instructions

## Issues Fixed

✅ Updated `jsonwebtoken` from `^9.1.2` to `^9.0.0` (compatible version)
✅ Fixed middleware import path from `./auth.js` to `../utils/auth.js`
✅ MongoDB data directory issue resolved

---

## Step 1: Clean Install Backend

```bash
cd backend

# Remove old modules
rm -r node_modules package-lock.json

# Install fresh
npm install
```

**Expected:** Shows "added XXX packages"

---

## Step 2: Create MongoDB Data Directory

**Option A: Local MongoDB**

```bash
# Windows PowerShell
mkdir C:\data\db

# Then start MongoDB
mongod
```

If you get an error about the data directory, MongoDB needs it to exist first.

**Option B: MongoDB Atlas (Cloud - Recommended)**

Skip MongoDB setup and use cloud:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jan-adhikar
```

---

## Step 3: Start Backend

```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
```

If you see errors, check:
- MongoDB is running (mongod terminal)
- Port 5000 is free
- `.env` file has correct settings

---

## Step 4: Start Frontend (New Terminal)

```bash
cd jan-adhikar/jan-adhikar
npm run dev
```

**Expected Output:**
```
Local: http://localhost:5173
```

---

## Step 5: Test Registration

1. Open http://localhost:5173
2. Click "Register"
3. Fill form with any data
4. Click "Create Account"

**Success:** Redirects to home, shows "Welcome, [name]" ✅

---

## MongoDB Setup Detailed

### For Windows Local MongoDB:

1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Create data directory:
   ```bash
   mkdir C:\data\db
   ```
4. Start in PowerShell:
   ```bash
   mongod
   ```
5. Leave running in background

### For macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

### For Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

---

## Quick Troubleshooting

| Error | Fix |
|-------|-----|
| `Module not found` | Run `npm install` in backend |
| `Port 5000 in use` | Kill process: `netstat -ano \| findstr :5000` |
| `MongoDB connection error` | Start `mongod` in new terminal |
| `Data directory not found` | Create `C:\data\db` first |
| `Cannot find module 'jsonwebtoken'` | Run `npm install` again |

---

## ✅ Ready to Go!

Once both terminals show running:
- Backend: `Server running on port 5000`
- Frontend: `Local: http://localhost:5173`

Open browser to http://localhost:5173 and start using!

---

## Next Steps

1. Read `QUICKSTART.md` for features overview
2. Read `SETUP.md` for detailed information
3. Read `API_DOCUMENTATION.md` for API details
4. Check `TESTING_GUIDE.md` for test cases

All documentation files are in the project root.
