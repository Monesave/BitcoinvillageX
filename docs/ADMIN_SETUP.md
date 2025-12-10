# Admin & Village Council Setup

## Overview

This document explains the admin and Village Council role system in BitcoinVillageX.

## Roles

### Admin
- **Primary Admin**: `mrpatrizio@gmail.com` (set in database)
- **Permissions**:
  - Approve/reject Village Council member applications
  - Moderate all content (marketplace listings, services, bounties, campaigns)
  - Ban/unban users
  - View all platform statistics
  - Manage all Village Council members

### Village Council
- **Selection**: Only admins can nominate and approve Village Council members
- **Permissions**:
  - Approve/reject marketplace listings
  - Approve/reject service listings
  - Resolve disputes between members
  - Vote on bans, rewards, and crowdfunding assistance
  - Propose rewards for contributing members
  - Provide assistance to crowdfunding campaigns

## Database Setup

### Step 1: Run All Migrations

Run migrations in order (they run automatically if using Supabase CLI):

```bash
# Using Supabase CLI
supabase db push

# Or manually in SQL Editor:
# 1. 20240101000000_initial_schema.sql
# 2. 20240101000001_add_indexes.sql
# 3. 20240101000002_add_triggers_and_functions.sql
# 4. 20240101000003_add_rls_policies.sql
# 5. 20240101000004_add_village_council.sql
# 6. 20240101000005_add_admin_support.sql (NEW)
# 7. 20240101000006_add_item_approval_status.sql (NEW)
```

### Step 2: Set Up Admin User

**Option A: Admin User Already Signed Up**

Run in Supabase SQL Editor:

```sql
-- Set mrpatrizio@gmail.com as admin
SELECT set_admin_by_email('mrpatrizio@gmail.com');

-- Verify admin was set
SELECT 
    u.email,
    p.is_admin,
    p.username,
    p.display_name
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE LOWER(u.email) = 'mrpatrizio@gmail.com';
```

**Option B: Admin User Not Yet Signed Up**

1. Have `mrpatrizio@gmail.com` sign up for an account
2. After signup, run the SQL above

**Option C: Using Script**

Run the setup script:

```bash
# In Supabase SQL Editor, paste contents of:
scripts/setup-admin.sql
```

### Step 3: Verify Setup

```sql
-- Check admin user
SELECT 
    u.email,
    p.is_admin,
    p.created_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.is_admin = TRUE;

-- Should show mrpatrizio@gmail.com with is_admin = true
```

## API Endpoints

### Admin Endpoints (Require Admin)

```
POST   /api/admin/council/nominate          - Nominate user for council
GET    /api/admin/council/applications      - Get council applications
POST   /api/admin/council/applications/:id/review  - Approve/reject council member
POST   /api/admin/council/members/:id/deactivate   - Deactivate council member
POST   /api/admin/moderate                  - Moderate any content
GET    /api/admin/users                     - Get all users
POST   /api/admin/users/:id/ban             - Ban user
```

### Council Endpoints (Require Council Member)

```
GET    /api/council/approvals/pending       - Get pending item approvals
POST   /api/council/marketplace/:id/approve - Approve/reject marketplace listing
POST   /api/council/services/:id/approve    - Approve/reject service listing
GET    /api/council/disputes                - Get open disputes
POST   /api/council/disputes/:id/resolve    - Resolve dispute
POST   /api/council/proposals               - Create proposal
POST   /api/council/proposals/:id/vote      - Vote on proposal
POST   /api/council/rewards                 - Create reward proposal
POST   /api/council/assistance              - Create assistance proposal
```

## Workflow Examples

### 1. Approving a Village Council Member (Admin Only)

1. Admin nominates user:
   ```http
   POST /api/admin/council/nominate
   {
     "userId": "user-uuid-here",
     "notes": "Highly contributing member"
   }
   ```

2. Admin reviews and approves:
   ```http
   POST /api/admin/council/applications/{application-id}/review
   {
     "action": "approve",
     "termStartDate": "2024-01-01T00:00:00Z",
     "termEndDate": "2024-12-31T23:59:59Z",
     "notes": "Approved for one-year term"
   }
   ```

### 2. Approving a Marketplace Listing (Council Member)

```http
POST /api/council/marketplace/{listing-id}/approve
{
  "action": "approve",
  "notes": "Listing meets community standards"
}
```

### 3. Resolving a Dispute (Council Member)

```http
POST /api/council/disputes/{dispute-id}/resolve
{
  "action": "approve",
  "resolution": "Seller provided valid proof of delivery",
  "winnerId": "seller-uuid",
  "notes": "Dispute resolved in favor of seller"
}
```

## Item Approval Flow

### Marketplace/Service Listings

1. **Villager creates listing** → `approval_status = 'pending'`
2. **Council member reviews** → Gets list via `/api/council/approvals/pending`
3. **Council member approves/rejects** → Updates status and activates listing
4. **Approved listings** → Visible to all villagers
5. **Rejected listings** → Hidden, seller can see rejection reason

### Disputes

1. **Dispute created** → `status = 'open'`
2. **Council reviews** → Gets list via `/api/council/disputes`
3. **Council resolves** → Sets status and creates resolution record
4. **Resolution applied** → Escrow released based on resolution

## Admin Check Implementation

Admin middleware checks in order:
1. `profiles.is_admin = TRUE` (database column - primary)
2. User metadata `is_admin` or `role: admin` (fallback)
3. Environment variable `ADMIN_EMAILS` (fallback)

**Recommended**: Use database `is_admin` column (set via migration).

## Troubleshooting

### Admin Not Working

```sql
-- Check if admin flag is set
SELECT id, email, is_admin 
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE LOWER(u.email) = 'mrpatrizio@gmail.com';

-- If is_admin is FALSE, set it:
UPDATE profiles 
SET is_admin = TRUE 
WHERE id = (SELECT id FROM auth.users WHERE LOWER(email) = 'mrpatrizio@gmail.com');
```

### Council Member Can't Approve Items

```sql
-- Check council member status
SELECT cm.*, p.username, p.display_name
FROM council_members cm
JOIN profiles p ON p.id = cm.user_id
WHERE cm.user_id = 'council-member-uuid';

-- Status should be 'active'
-- If not, update:
UPDATE council_members
SET status = 'active'
WHERE user_id = 'council-member-uuid';
```

### Items Not Showing as Pending

```sql
-- Check pending items
SELECT COUNT(*) as pending_marketplace
FROM marketplace_listings
WHERE approval_status = 'pending';

SELECT COUNT(*) as pending_services
FROM service_listings
WHERE approval_status = 'pending';
```

## Security Notes

- Admin powers are restricted to admin-only endpoints
- Council member powers are restricted to council-only endpoints
- All actions are logged in `admin_actions` table
- RLS policies prevent unauthorized database access
- Middleware enforces role checks before controller execution

---

**Last Updated**: After migration 20240101000006
**Admin Email**: mrpatrizio@gmail.com

