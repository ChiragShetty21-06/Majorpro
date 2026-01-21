# Jan Adhikar - Authentication System Setup

This guide explains how to set up and run the authentication system with Node.js, Express, MongoDB, and React.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed locally or MongoDB Atlas account)
- npm or yarn

## Project Structure

```
Major project/
├── backend/                 # Express server
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── controllers/
│   │   └── authController.js  # Auth logic
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   ├── models/
│   │   └── User.js         # User schema
│   ├── routes/
│   │   └── authRoutes.js   # Auth routes
│   ├── utils/
│   │   └── auth.js         # JWT utilities
│   ├── .env                # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js           # Express app
└── jan-adhikar/
    └── jan-adhikar/        # React frontend
        └── src/
            ├── pages/
            │   ├── Login.jsx      # Login page
            │   └── Register.jsx   # Registration page
            ├── Layout.jsx         # Updated with auth nav
            └── app.jsx            # Updated routes
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jan-adhikar
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jan-adhikar
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (no local setup needed)

### 4. Start the Backend Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

**API Endpoints:**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)
- `POST /api/auth/logout` - Logout user (requires auth token)
- `GET /api/health` - Health check

## Frontend Setup

### 1. Install Additional Dependencies

```bash
cd jan-adhikar/jan-adhikar
npm install axios
```

### 2. Update Frontend Config

The frontend is already configured to:
- Use `http://localhost:5000` for API calls
- Store JWT tokens in localStorage
- Display login/register in navigation
- Show user info when logged in

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

### Registration
- First name, last name, email, password
- Password confirmation validation
- Automatic JWT token generation
- Error handling for duplicate emails

### Login
- Email and password authentication
- JWT token generation
- User information storage in localStorage

### Protected Routes
- JWT middleware validates tokens
- Tokens stored in Authorization header
- Automatic token refresh capability (can be added)

## API Request Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Notes

1. **Never commit `.env`** - Add to `.gitignore` (already done)
2. **Change JWT_SECRET** in production
3. **Use HTTPS** in production
4. **Enable CORS properly** - Currently allows `localhost:5173`
5. **Hash passwords** - Already implemented with bcryptjs
6. **Rate limiting** - Consider adding for production

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For Atlas: Verify IP whitelist and credentials

### CORS Error
- Backend: Frontend URL must match `origin` in `server.js`
- Frontend: API URL must be correct in `.jsx` files

### Token Issues
- Clear localStorage: `localStorage.clear()`
- Check token expiration (7 days)
- Verify JWT_SECRET matches between login/auth

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

## Next Steps

1. **Email Verification** - Add email confirmation
2. **Password Reset** - Implement forgot password flow
3. **Social Login** - Add Google/GitHub OAuth
4. **Refresh Tokens** - Implement token rotation
5. **User Roles** - Add permission system
6. **Rate Limiting** - Protect against abuse
7. **Input Validation** - Add more robust validation
8. **Database Indexing** - Optimize queries

## Production Deployment

### Backend (Heroku/Railway)
1. Update `.env` with production MongoDB URI
2. Set `NODE_ENV=production`
3. Change `JWT_SECRET` to strong random string
4. Update CORS origin to frontend URL
5. Deploy using `git push` or CLI

### Frontend (Vercel/Netlify)
1. Update API base URL to production backend
2. Build: `npm run build`
3. Deploy static files
4. Set environment variables in deployment platform

## Support

For issues or questions, check:
- MongoDB documentation: https://docs.mongodb.com
- Express docs: https://expressjs.com
- React docs: https://react.dev
- JWT info: https://jwt.io
