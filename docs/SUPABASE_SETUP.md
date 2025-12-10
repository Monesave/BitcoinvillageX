# Supabase Database & Authentication Setup Guide

This guide walks you through setting up your Supabase database and configuring authentication for BitcoinVillageX.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install for local development (optional but recommended)
3. **Node.js**: v18+ installed

## Option 1: Production/Cloud Setup (Recommended for Deployment)

### Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: `bitcoinvillagex`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start

### Step 2: Run Database Migrations

You can run migrations using either:
- **Supabase Dashboard SQL Editor** (easiest for first setup)
- **Supabase CLI** (better for ongoing development)

#### Method A: Using Supabase Dashboard

1. Go to your project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Run each migration file **in order**:

**Migration 1: Initial Schema**
```sql
-- Copy and paste entire contents of:
-- supabase/migrations/20240101000000_initial_schema.sql
```
Execute → ✅

**Migration 2: Indexes**
```sql
-- Copy and paste entire contents of:
-- supabase/migrations/20240101000001_add_indexes.sql
```
Execute → ✅

**Migration 3: Triggers and Functions**
```sql
-- Copy and paste entire contents of:
-- supabase/migrations/20240101000002_add_triggers_and_functions.sql
```
Execute → ✅

**Migration 4: RLS Policies**
```sql
-- Copy and paste entire contents of:
-- supabase/migrations/20240101000003_add_rls_policies.sql
```
Execute → ✅

**Migration 5: Village Council**
```sql
-- Copy and paste entire contents of:
-- supabase/migrations/20240101000004_add_village_council.sql
```
Execute → ✅

#### Method B: Using Supabase CLI (Recommended)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   # or
   brew install supabase/tap/supabase  # macOS
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   cd /Users/patrickenin/Desktop/BitcoinvillageX
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Supabase Dashboard → Settings → General)

4. **Push migrations:**
   ```bash
   supabase db push
   ```
   This will run all migrations in order automatically.

### Step 3: Configure Authentication Providers

#### 3.1 Enable Email/Password Authentication

1. Go to **Authentication** → **Providers** (left sidebar)
2. **Email** provider should be enabled by default
3. Configure settings:
   - ✅ **Enable email provider**: ON
   - ✅ **Enable sign up**: ON
   - ✅ **Confirm email**: OFF (for easier testing, enable in production)
   - ✅ **Secure email change**: ON

#### 3.2 Enable Phone Authentication (Optional)

1. Go to **Authentication** → **Providers**
2. Click **Phone**
3. Configure:
   - ✅ **Enable phone provider**: ON
   - ⚠️ **Requires SMS provider** (Twilio, MessageBird, etc.)
   - For testing without SMS: Use test OTP mapping (see config.toml)

#### 3.3 Configure Google OAuth

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs:
     ```
     https://[your-project-ref].supabase.co/auth/v1/callback
     ```
     (Replace `[your-project-ref]` with your actual Supabase project reference)
   - Copy **Client ID** and **Client Secret**

2. **Configure in Supabase:**
   - Go to **Authentication** → **Providers** → **Google**
   - ✅ **Enable Google provider**: ON
   - Paste **Client ID**
   - Paste **Client Secret**
   - Click **Save**

3. **Verify Redirect URLs:**
   - Go to **Authentication** → **URL Configuration**
   - **Site URL**: `http://localhost:5173` (dev) or `https://yourdomain.com` (prod)
   - **Redirect URLs**: Add:
     ```
     http://localhost:5173/dashboard
     http://localhost:5173/**
     https://yourdomain.com/dashboard
     https://yourdomain.com/**
     ```

### Step 4: Set Up Environment Variables

Copy your Supabase credentials:

1. Go to **Settings** → **API** (left sidebar)
2. Copy the following:

**Frontend (.env file in `frontend/` folder):**
```env
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Backend (.env file in `backend/` folder):**
```env
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
FRONTEND_URL=http://localhost:5173
```

**Important:**
- `anon-key`: Public key (safe for frontend)
- `service-role-key`: Secret key (ONLY for backend, never expose!)

### Step 5: Verify Database Setup

Run this query in **SQL Editor** to verify tables were created:

```sql
SELECT 
    schemaname,
    tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

You should see tables like:
- `profiles`
- `wallets`
- `transactions`
- `marketplace_listings`
- `service_listings`
- `bounties`
- `campaigns`
- `verifications`
- `council_members`
- etc.

### Step 6: Test User Creation

Test that triggers work correctly:

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password
4. Click **Create User**

**Verify:**
- User should be created in `auth.users`
- Profile should be auto-created in `profiles` table
- Wallet should be auto-created in `wallets` table
- Reputation score should be auto-created

Run this query to check:
```sql
SELECT 
    u.id,
    u.email,
    p.username,
    p.display_name,
    w.balance_sats
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN wallets w ON w.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 5;
```

## Option 2: Local Development Setup

For local development with Supabase:

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
# or
brew install supabase/tap/supabase  # macOS
```

### Step 2: Initialize Supabase Locally

```bash
cd /Users/patrickenin/Desktop/BitcoinvillageX
supabase init
```

This creates a local Supabase instance.

### Step 3: Start Local Supabase

```bash
supabase start
```

This will:
- Start PostgreSQL database
- Start Supabase Studio (UI)
- Show connection strings and API keys

**Note the output** - it will show:
- API URL: `http://localhost:54321`
- anon key: `eyJ...`
- service_role key: `eyJ...`

### Step 4: Run Migrations Locally

```bash
supabase db reset
```

This runs all migrations from `supabase/migrations/` folder.

### Step 5: Configure Local Environment

**Frontend (.env):**
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

**Backend (.env):**
```env
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
FRONTEND_URL=http://localhost:5173
```

### Step 6: Configure OAuth for Local Development

1. Open Supabase Studio: `http://localhost:54323`
2. Go to **Authentication** → **Providers**
3. Configure Google OAuth (see Step 3.3 above)
   - Use same redirect URI but with `localhost`:
   ```
   http://localhost:54321/auth/v1/callback
   ```

### Step 7: Stop Local Supabase

```bash
supabase stop
```

To start again:
```bash
supabase start
```

## Useful Supabase CLI Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (runs all migrations)
supabase db reset

# Create new migration
supabase migration new migration_name

# Apply migrations to remote
supabase db push

# Pull remote schema changes
supabase db pull

# Generate TypeScript types
supabase gen types typescript --local > frontend/src/types/database.types.ts

# View logs
supabase logs

# Open Supabase Studio
open http://localhost:54323  # macOS
```

## Verification Checklist

After setup, verify:

- [ ] All migrations ran successfully
- [ ] Tables created (profiles, wallets, transactions, etc.)
- [ ] Triggers installed (auto-create profile/wallet on signup)
- [ ] RLS policies active
- [ ] Email authentication enabled
- [ ] Google OAuth configured
- [ ] Redirect URLs configured
- [ ] Environment variables set
- [ ] Test user creation works (profile + wallet auto-created)

## Troubleshooting

### Migration Errors

**Error: "relation already exists"**
- Tables already created - skip that migration or drop tables first
- Use `supabase db reset` for clean slate

**Error: "permission denied"**
- Need to use service role key for migrations
- Or run via Supabase Dashboard SQL Editor (uses admin privileges)

### OAuth Not Working

**"Redirect URI mismatch"**
- Verify redirect URI exactly matches in Google Console and Supabase
- Check for trailing slashes, http vs https
- Add both `http://localhost:5173/**` and `https://yourdomain.com/**`

**"Provider not enabled"**
- Go to Authentication → Providers
- Ensure provider is toggled ON
- Verify credentials are correct

### Trigger Not Firing

**Profile not created on signup:**
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Manually test function
SELECT handle_new_user();
```

**Fix:** Re-run migration `20240101000002_add_triggers_and_functions.sql`

## Next Steps

1. ✅ Database setup complete
2. ✅ Authentication configured
3. ⏭️ Configure Stripe API keys (for payments)
4. ⏭️ Configure Veriff API keys (for verification)
5. ⏭️ Set up environment variables in deployment platform
6. ⏭️ Test full authentication flow
7. ⏭️ Deploy application

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need Help?** Check the main [README.md](../README.md) or review migration files in `supabase/migrations/`

