#!/bin/bash
# Quick setup script for Clerk backend integration

echo "🔐 Clerk Backend Integration Setup"
echo "===================================="
echo ""

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Creating template..."
    cat > backend/.env << 'EOF'
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jan-adhikar?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=development
PORT=5000

# Add Clerk Secret Key below
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_KEY_HERE
EOF
    echo "✅ Created backend/.env template"
    echo "⚠️  Please edit backend/.env and add your Clerk Secret Key!"
fi

# Check if frontend .env.local exists
if [ ! -f "jan-adhikar/jan-adhikar/.env.local" ]; then
    echo "⚠️  frontend .env.local not found. Creating template..."
    mkdir -p jan-adhikar/jan-adhikar
    cat > jan-adhikar/jan-adhikar/.env.local << 'EOF'
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_PUBLISHABLE_KEY_HERE
EOF
    echo "✅ Created frontend .env.local template"
    echo "⚠️  Please edit and add your Clerk Publishable Key!"
fi

echo ""
echo "📋 Next steps:"
echo "1. Get your Clerk API keys from https://dashboard.clerk.com"
echo "2. Add CLERK_SECRET_KEY to backend/.env"
echo "3. Add VITE_CLERK_PUBLISHABLE_KEY to jan-adhikar/jan-adhikar/.env.local"
echo "4. Restart both backend and frontend servers"
echo ""
echo "✅ Setup complete!"
