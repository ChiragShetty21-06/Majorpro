# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install MongoDB
- **Option A:** [Download MongoDB Community](https://www.mongodb.com/try/download/community)
- **Option B:** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud DB)

### 3. Start MongoDB
```bash
# If installed locally
mongod

# If using MongoDB Atlas, skip this step
```

### 4. Start Backend Server
```bash
# From backend folder
npm run dev
```
✅ Backend runs on `http://localhost:5000`

### 5. Start Frontend
```bash
# From jan-adhikar/jan-adhikar folder
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

### 6. Test Authentication
1. Open http://localhost:5173
2. Click **Register** in navigation
3. Create an account
4. Should redirect to home (logged in)
5. Try **Login** to test login flow

## 📝 API Endpoints

| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/auth/register` | `{firstName, lastName, email, password, passwordConfirm}` | No |
| POST | `/api/auth/login` | `{email, password}` | No |
| GET | `/api/auth/me` | - | Yes |
| POST | `/api/auth/logout` | - | Yes |
| GET | `/api/health` | - | No |

## 🔐 Token Usage

After login/register, token is automatically saved to localStorage:
```javascript
// Access token in code
const token = localStorage.getItem('token');

// User data
const user = JSON.parse(localStorage.getItem('user'));
```

## 🛠️ Common Commands

```bash
# Backend development
cd backend && npm run dev

# Frontend development
cd jan-adhikar/jan-adhikar && npm run dev

# Build frontend
npm run build

# View MongoDB
# Use MongoDB Compass or Atlas UI
```

## ⚙️ Environment Variables

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jan-adhikar
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 🐛 Debugging

**Check backend running:**
```bash
curl http://localhost:5000/api/health
```

**MongoDB connection issue:**
- Ensure `mongod` is running
- Check MongoDB URI in `.env`
- Try MongoDB Compass to test connection

**CORS errors:**
- Frontend and backend URLs must match
- Check `cors` config in `server.js`

**Clear auth data:**
```javascript
// In browser console
localStorage.clear()
```

## 📚 File Structure

```
backend/
├── server.js                    # Main app
├── package.json                 # Dependencies
├── .env                         # Config
├── config/database.js          # MongoDB setup
├── models/User.js              # User schema
├── controllers/authController.js # Auth logic
├── routes/authRoutes.js        # API routes
├── middleware/auth.js          # JWT verification
└── utils/auth.js               # JWT helpers

jan-adhikar/jan-adhikar/src/
├── app.jsx                      # Routes
├── Layout.jsx                   # Navigation
├── pages/
│   ├── Login.jsx               # Login form
│   └── Register.jsx            # Registration form
```

## ✨ Next: Customize!

- Modify user schema in `backend/models/User.js`
- Add more fields in registration form
- Add password reset functionality
- Add email verification
- Deploy to production

## 📞 Support

See `SETUP.md` for detailed documentation
