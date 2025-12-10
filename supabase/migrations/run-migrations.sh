#!/bin/bash

# BitcoinVillageX - Database Migration Script
# This script runs database migrations for Supabase (local or remote)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 BitcoinVillageX - Database Migration Script${NC}"
echo "=============================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed.${NC}"
    echo "   Install it with:"
    echo "   - npm install -g supabase"
    echo "   - brew install supabase/tap/supabase  (macOS)"
    echo "   - Or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI found${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "supabase/migrations" ]; then
    echo -e "${RED}❌ Error: supabase/migrations directory not found${NC}"
    echo "   Please run this script from the project root directory"
    exit 1
fi

# Determine if running locally or remote
MODE=""
if [ "$1" == "--local" ] || [ "$1" == "-l" ]; then
    MODE="local"
elif [ "$1" == "--remote" ] || [ "$1" == "-r" ]; then
    MODE="remote"
else
    echo "Select migration target:"
    echo "  1) Local Supabase (development)"
    echo "  2) Remote Supabase (production/staging)"
    read -p "Enter choice [1-2]: " choice
    
    case $choice in
        1) MODE="local" ;;
        2) MODE="remote" ;;
        *) 
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
fi

echo ""
echo -e "${BLUE}📋 Migration Mode: ${MODE}${NC}"
echo ""

# List migration files
echo -e "${BLUE}📄 Migration files to run:${NC}"
MIGRATION_FILES=$(ls -1 supabase/migrations/*.sql 2>/dev/null | grep -v ".gitkeep" | sort)
if [ -z "$MIGRATION_FILES" ]; then
    echo -e "${YELLOW}⚠️  No migration files found${NC}"
    exit 0
fi

for file in $MIGRATION_FILES; do
    filename=$(basename "$file")
    echo "  - $filename"
done
echo ""

# Confirm before proceeding
read -p "Continue with migration? [y/N]: " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Migration cancelled${NC}"
    exit 0
fi

echo ""

# Run migrations based on mode
if [ "$MODE" == "local" ]; then
    echo -e "${BLUE}🔄 Running migrations on LOCAL Supabase...${NC}"
    echo ""
    
    # Check if local Supabase is running
    if ! supabase status &> /dev/null; then
        echo -e "${YELLOW}⚠️  Local Supabase is not running${NC}"
        echo "   Starting Supabase..."
        supabase start
        echo ""
    fi
    
    # Reset database to apply all migrations
    echo -e "${BLUE}📊 Applying migrations...${NC}"
    supabase db reset
    
    echo ""
    echo -e "${GREEN}✅ Local migrations completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📍 Local Supabase URLs:${NC}"
    supabase status | grep -E "(API URL|Studio|anon key|service_role key)" || true
    
elif [ "$MODE" == "remote" ]; then
    echo -e "${BLUE}🔄 Running migrations on REMOTE Supabase...${NC}"
    echo ""
    
    # Check if project is linked
    if [ ! -f ".supabase/config.toml" ] && [ ! -f "supabase/.temp/project-ref" ]; then
        echo -e "${YELLOW}⚠️  Project not linked to remote Supabase${NC}"
        echo ""
        echo "To link your project:"
        echo "  1. Get your project reference from Supabase Dashboard"
        echo "  2. Run: supabase link --project-ref YOUR_PROJECT_REF"
        echo ""
        read -p "Do you want to link now? [y/N]: " link_confirm
        if [[ $link_confirm =~ ^[Yy]$ ]]; then
            read -p "Enter your project reference: " project_ref
            supabase link --project-ref "$project_ref"
        else
            echo -e "${YELLOW}Migration cancelled. Please link your project first.${NC}"
            exit 0
        fi
        echo ""
    fi
    
    # Push migrations to remote
    echo -e "${BLUE}📊 Pushing migrations to remote...${NC}"
    echo -e "${YELLOW}⚠️  This will modify your production/staging database!${NC}"
    echo ""
    
    read -p "Are you sure you want to continue? [y/N]: " final_confirm
    if [[ ! $final_confirm =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Migration cancelled${NC}"
        exit 0
    fi
    
    echo ""
    supabase db push
    
    echo ""
    echo -e "${GREEN}✅ Remote migrations completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📍 Check your Supabase Dashboard for changes${NC}"
fi

echo ""
echo -e "${GREEN}✨ Migration process complete!${NC}"
echo ""
echo -e "${BLUE}📚 Next steps:${NC}"
echo "  - Verify changes in Supabase Studio/Dashboard"
echo "  - Test your application"
echo "  - Check migration logs if needed"
echo ""

