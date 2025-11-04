#!/bin/bash

# BlogHub Setup & Verification Script
# This script helps you set up and verify your BlogHub application

set -e  # Exit on error

echo "🚀 BlogHub Setup & Verification"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  Please edit .env.local and add your database credentials"
    echo "Choose one of these options:"
    echo ""
    echo "1️⃣  Neon (FREE, fastest): https://neon.tech"
    echo "   DATABASE_URL=\"postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require\""
    echo ""
    echo "2️⃣  Local PostgreSQL:"
    echo "   brew install postgresql@16"
    echo "   brew services start postgresql@16"
    echo "   createdb blogging_platform"
    echo "   DATABASE_URL=\"postgresql://postgres:@localhost:5432/blogging_platform\""
    echo ""
    echo "After updating .env.local, run this script again."
    exit 1
fi

# Check if DATABASE_URL is set and not a placeholder
source .env.local
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set in .env.local"
    exit 1
fi

if [[ "$DATABASE_URL" == *"user:password"* ]] || [[ "$DATABASE_URL" == *"localhost"* ]]; then
    echo "⚠️  DATABASE_URL appears to be a placeholder or local"
    echo "Current: $DATABASE_URL"
    echo ""
    echo "If you're using local PostgreSQL, make sure it's running:"
    echo "  brew services start postgresql@16"
    echo ""
    echo "If you're using Neon/Supabase, update .env.local with your real connection string"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Environment configuration found"
echo ""

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Test database connection
echo "🔍 Testing database connection..."
if npm run db:test 2>&1 | grep -q "Database connection successful"; then
    echo "✅ Database connection successful!"
    echo ""
else
    echo "❌ Database connection failed!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check your DATABASE_URL in .env.local"
    echo "2. If using local PostgreSQL: brew services start postgresql@16"
    echo "3. If using Neon: Verify connection string from dashboard"
    echo "4. See MISSING_CONNECTIONS.md for detailed help"
    exit 1
fi

# Push database schema
echo "🗄️  Setting up database schema..."
if npm run db:push 2>&1; then
    echo "✅ Database schema created"
    echo ""
else
    echo "⚠️  Database schema setup had issues"
    echo "Continuing anyway..."
    echo ""
fi

# Seed database (optional)
echo "🌱 Would you like to seed the database with sample data?"
echo "   (This adds example blog posts and categories)"
read -p "Seed database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    if npm run db:seed; then
        echo "✅ Database seeded with sample data"
        echo ""
    else
        echo "⚠️  Seeding failed (may already have data)"
        echo ""
    fi
fi

# Build check
echo "🔨 Verifying build..."
if npm run build > /tmp/build.log 2>&1; then
    echo "✅ Build successful"
    echo ""
else
    echo "❌ Build failed"
    echo "Check /tmp/build.log for details"
    exit 1
fi

echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "🎉 Your BlogHub is ready to launch!"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Start development server:"
echo "   npm run dev"
echo ""
echo "2️⃣  Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "3️⃣  Test the app:"
echo "   • Homepage: http://localhost:3000"
echo "   • Blog: http://localhost:3000/blog"
echo "   • Dashboard: http://localhost:3000/dashboard"
echo "   • Create Post: http://localhost:3000/dashboard/new"
echo ""
echo "📚 Documentation:"
echo "   • MISSING_CONNECTIONS.md - Connection troubleshooting"
echo "   • GETTING_STARTED.md - Complete guide"
echo "   • NEON_QUICK_SETUP.md - Quick database setup"
echo ""
echo "🆘 Having issues?"
echo "   Run: npm run db:test (to test database)"
echo "   Check: MISSING_CONNECTIONS.md"
echo ""
