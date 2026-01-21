@echo off
REM Clerk Integration - Quick Start Script for Windows

echo.
echo ======================================
echo Clerk Integration - Quick Start
echo ======================================
echo.

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo Checking MongoDB connection...
netstat -an | find "27017" >nul
if errorlevel 1 (
    echo WARNING: MongoDB might not be running on port 27017
    echo If you get connection errors, start MongoDB first
    echo.
)

REM Ask user for Clerk Secret Key
echo.
echo ======================================
echo Clerk Configuration
echo ======================================
echo.
echo Please follow these steps:
echo 1. Go to https://dashboard.clerk.com
echo 2. Click your application
echo 3. Go to API Keys
echo 4. Copy your SECRET KEY (starts with sk_test_)
echo.
set /p CLERK_KEY="Enter your Clerk Secret Key: "

if "%CLERK_KEY%"=="" (
    echo ERROR: Clerk Secret Key is required
    pause
    exit /b 1
)

REM Update .env file
echo Updating backend/.env...
(
    echo PORT=5000
    echo MONGODB_URI=mongodb://localhost:27017/jan-adhikar
    echo JWT_SECRET=Hello
    echo NODE_ENV=development
    echo.
    echo CLERK_SECRET_KEY=%CLERK_KEY%
    echo.
    echo EMAIL_USER=prathameshhegde1903@gmail.com
    echo EMAIL_PASS=your_app_password_here
    echo FEEDBACK_EMAIL=prathameshhegde1903@gmail.com
    echo FRONTEND_URL=http://localhost:5174
    echo.
    echo GOOGLE_CLIENT_ID=your_google_client_id
    echo GOOGLE_CLIENT_SECRET=your_google_client_secret
    echo GITHUB_CLIENT_ID=your_github_client_id
    echo GITHUB_CLIENT_SECRET=your_github_client_secret
    echo.
    echo TWILIO_ACCOUNT_SID=your_twilio_account_sid
    echo TWILIO_AUTH_TOKEN=your_twilio_auth_token
) > backend\.env

echo ✓ Updated backend/.env
echo.

REM Install dependencies if needed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✓ Backend dependencies installed
)

if not exist "jan-adhikar\jan-adhikar\node_modules" (
    echo Installing frontend dependencies...
    cd jan-adhikar\jan-adhikar
    call npm install
    cd ..\..
    echo ✓ Frontend dependencies installed
)

echo.
echo ======================================
echo Starting Servers
echo ======================================
echo.
echo NOTE: Two windows will open
echo - Window 1: Backend (port 5000)
echo - Window 2: Frontend (port 5174)
echo.
echo Wait for both to show "running" messages before testing
echo.
pause

REM Start backend in new window
echo Starting backend...
start cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting frontend...
start cmd /k "cd jan-adhikar\jan-adhikar && npm run dev"

REM Instructions
echo.
echo ======================================
echo Next Steps
echo ======================================
echo.
echo 1. Wait for both servers to start
echo    - Backend: "Server running on port 5000"
echo    - Frontend: "Local: http://localhost:5174"
echo.
echo 2. Open http://localhost:5174 in your browser
echo.
echo 3. Test signup:
echo    - Click "Get Started"
echo    - Select Role
echo    - Complete Clerk signup
echo    - Should redirect to dashboard
echo.
echo 4. If there are errors:
echo    - Check backend console window for errors
echo    - Check browser console (F12) for errors
echo    - Make sure MongoDB is running
echo.
echo ======================================
echo.
pause
