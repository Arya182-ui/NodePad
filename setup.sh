#!/bin/bash

# NodePad Setup Script
# This script helps you set up NodePad quickly

echo "🚀 NodePad Setup Script"
echo "======================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js v16 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION detected"
echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
if [ ! -f "package.json" ]; then
    echo "❌ server/package.json not found"
    exit 1
fi
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
echo "✅ Server dependencies installed"
echo ""

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
if [ ! -f "package.json" ]; then
    echo "❌ client/package.json not found"
    exit 1
fi
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
echo "✅ Client dependencies installed"
echo ""

cd ..

# Check for environment files
echo "🔍 Checking environment files..."

if [ ! -f "server/.env" ]; then
    echo "⚠️  server/.env not found"
    echo "Creating from server/.env.example..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env"
    echo "⚠️  Please edit server/.env with your credentials"
    ENV_SETUP_NEEDED=true
fi

if [ ! -f "client/.env" ]; then
    echo "⚠️  client/.env not found"
    echo "Creating from client/.env.example..."
    cp client/.env.example client/.env
    echo "✅ Created client/.env"
fi

echo ""
echo "✅ Setup complete!"
echo ""

if [ "$ENV_SETUP_NEEDED" = true ]; then
    echo "⚠️  IMPORTANT: Configure your environment variables"
    echo ""
    echo "1. Get Firebase credentials:"
    echo "   - Visit https://console.firebase.google.com/"
    echo "   - Create project → Settings → Service Accounts"
    echo "   - Generate new private key"
    echo ""
    echo "2. Get Cloudinary credentials:"
    echo "   - Visit https://cloudinary.com/"
    echo "   - Sign up → Dashboard → Copy credentials"
    echo ""
    echo "3. Edit server/.env with your credentials"
    echo ""
fi

echo "📚 Next steps:"
echo ""
echo "1. Configure environment variables (if needed)"
echo "   Edit: server/.env"
echo ""
echo "2. Start the backend server:"
echo "   cd server && npm run dev"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   cd client && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For detailed instructions, see docs/QUICKSTART.md"
echo ""
echo "Happy coding! 🎉"