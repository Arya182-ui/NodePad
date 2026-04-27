@echo off
REM NodePad Setup Script for Windows
REM This script helps you set up NodePad quickly

echo.
echo 🚀 NodePad Setup Script
echo =======================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js v16 or higher from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% detected
echo.

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
if not exist "package.json" (
    echo ❌ server/package.json not found
    exit /b 1
)
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install server dependencies
    exit /b 1
)
echo ✅ Server dependencies installed
echo.

REM Install client dependencies
echo 📦 Installing client dependencies...
cd ..\client
if not exist "package.json" (
    echo ❌ client/package.json not found
    exit /b 1
)
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install client dependencies
    exit /b 1
)
echo ✅ Client dependencies installed
echo.

cd ..

REM Check for environment files
echo 🔍 Checking environment files...

if not exist "server\.env" (
    echo ⚠️  server\.env not found
    echo Creating from server\.env.example...
    copy server\.env.example server\.env >nul
    echo ✅ Created server\.env
    echo ⚠️  Please edit server\.env with your credentials
    set ENV_SETUP_NEEDED=true
)

if not exist "client\.env" (
    echo ⚠️  client\.env not found
    echo Creating from client\.env.example...
    copy client\.env.example client\.env >nul
    echo ✅ Created client\.env
)

echo.
echo ✅ Setup complete!
echo.

if defined ENV_SETUP_NEEDED (
    echo ⚠️  IMPORTANT: Configure your environment variables
    echo.
    echo 1. Get Firebase credentials:
    echo    - Visit https://console.firebase.google.com/
    echo    - Create project → Settings → Service Accounts
    echo    - Generate new private key
    echo.
    echo 2. Get Cloudinary credentials:
    echo    - Visit https://cloudinary.com/
    echo    - Sign up → Dashboard → Copy credentials
    echo.
    echo 3. Edit server\.env with your credentials
    echo.
)

echo 📚 Next steps:
echo.
echo 1. Configure environment variables (if needed^)
echo    Edit: server\.env
echo.
echo 2. Start the backend server:
echo    cd server ^&^& npm run dev
echo.
echo 3. Start the frontend (in a new terminal^):
echo    cd client ^&^& npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📖 For detailed instructions, see docs\QUICKSTART.md
echo.
echo Happy coding! 🎉
echo.

pause