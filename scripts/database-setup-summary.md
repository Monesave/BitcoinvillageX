# Database Setup Summary

## Migrations to Run

Run these migrations **in order** in Supabase:

1. ✅ `20240101000000_initial_schema.sql` - Core database schema
2. ✅ `20240101000001_add_indexes.sql` - Performance indexes
3. ✅ `20240101000002_add_triggers_and_functions.sql` - Auto-create profile/wallet on signup
4. ✅ `20240101000003_add_rls_policies.sql` - Row Level Security policies
5. ✅ `20240101000004_add_village_council.sql` - Village Council tables
6. ✅ `20240101000005_add_admin_support.sql` - **NEW** Admin support (is_admin column)
7. ✅ `20240101000006_add_item_approval_status.sql` - **NEW** Item approval status

## Quick Setup Script

### Option 1: Using Supabase CLI (Recommended)

```bash
cd /Users/patrickenin/Desktop/BitcoinvillageX

# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Run each migration file in order (copy/paste contents)
3. Execute each one

## Set Up Admin User

After migrations are run and user has signed up:

```sql
-- In Supabase SQL Editor
SELECT set_admin_by_email('mrpatrizio@gmail.com');

-- Verify it worked
SELECT 
    u.email,
    p.is_admin,
    p.username
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE LOWER(u.email) = 'mrpatrizio@gmail.com';
```

Or use the script: `scripts/setup-admin.sql`

## Verify Setup

```sql
-- Check admin
SELECT email, is_admin FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE is_admin = TRUE;

-- Check council tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'council%';

-- Check approval status columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('marketplace_listings', 'service_listings')
AND column_name LIKE 'approval%';
```

## What Changed

### Admin System
- ✅ Added `is_admin` column to `profiles` table
- ✅ Created `set_admin_by_email()` function
- ✅ Updated admin middleware to check database `is_admin` column
- ✅ Set `mrpatrizio@gmail.com` as admin

### Village Council Permissions
- ✅ Only admins can approve/reject council member applications
- ✅ Council members can approve/reject marketplace listings
- ✅ Council members can approve/reject service listings
- ✅ Council members can resolve disputes

### Item Approval
- ✅ Added `approval_status` to marketplace_listings
- ✅ Added `approval_status` to service_listings
- ✅ Added `approved_by` and `approval_notes` columns
- ✅ New listings default to `approval_status = 'pending'`

---

**Next Steps:**
1. Run migrations
2. Set admin user
3. Test admin endpoints
4. Nominate first council member
5. Test council approval endpoints

