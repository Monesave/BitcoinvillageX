#!/bin/bash

# BitcoinVillageX - Supabase Setup Script
# This script helps set up Supabase for local development

set -e

echo "🚀 BitcoinVillageX - Supabase Setup"
echo "===================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "   Install it with: npm install -g supabase"
    echo "   Or: brew install supabase/tap/supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if already initialized
if [ ! -f "supabase/config.toml" ]; then
    echo "📦 Initializing Supabase..."
    supabase init
    echo "✅ Supabase initialized"
else
    echo "✅ Supabase already initialized"
fi

echo ""
echo "🔧 Starting Supabase (this may take a minute)..."
supabase start

echo ""
echo "📊 Supabase is running!"
echo ""
echo "📍 Important URLs:"
echo "   - Studio UI: http://localhost:54323"
echo "   - API URL: http://localhost:54321"
echo ""
echo "📝 Environment Variables (add to your .env files):"
echo ""
echo "Frontend (.env):"
echo "   VITE_SUPABASE_URL=http://localhost:54321"
echo "   VITE_SUPABASE_ANON_KEY=$(supabase status | grep 'anon key' | awk '{print $3}')"
echo ""
echo "Backend (.env):"
echo "   SUPABASE_URL=http://localhost:54321"
echo "   SUPABASE_SERVICE_ROLE_KEY=$(supabase status | grep 'service_role key' | awk '{print $3}')"
echo ""
echo "✅ Database migrations will run automatically"
echo ""
echo "🔐 Next steps:"
echo "   1. Configure OAuth providers in Supabase Studio"
echo "   2. Add environment variables to your .env files"
echo "   3. Start your frontend and backend servers"
echo ""
echo "📚 See docs/SUPABASE_SETUP.md for detailed instructions"

