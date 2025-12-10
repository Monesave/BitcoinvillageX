# Database Migrations

This directory contains SQL migration files for the BitcoinVillageX database schema.

## Migration Files

Migrations are run in alphabetical/numerical order based on their filename prefix:

1. `20240101000000_initial_schema.sql` - Initial database schema
2. `20240101000001_add_indexes.sql` - Database indexes
3. `20240101000002_add_triggers_and_functions.sql` - Triggers and functions
4. `20240101000003_add_rls_policies.sql` - Row Level Security policies
5. `20240101000004_add_village_council.sql` - Village Council features
6. `20240101000005_add_admin_support.sql` - Admin support features
7. `20240101000006_add_item_approval_status.sql` - Item approval system
8. `20240101000007_add_location_to_services.sql` - Location and country fields

## Running Migrations

### Option 1: Using the Migration Script (Recommended)

Run the provided script from the project root:

```bash
# Interactive mode (will ask for local or remote)
./supabase/migrations/run-migrations.sh

# Or specify mode directly
./supabase/migrations/run-migrations.sh --local    # For local development
./supabase/migrations/run-migrations.sh --remote   # For production/staging
```

### Option 2: Using Supabase CLI Directly

#### For Local Development

```bash
# Start local Supabase (if not already running)
supabase start

# Reset database and apply all migrations
supabase db reset

# Or apply new migrations only
supabase migration up
```

#### For Remote/Production

```bash
# Link your project (first time only)
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations to remote
supabase db push

# Or apply specific migration
supabase migration up
```

### Option 3: Using Supabase Dashboard

If you prefer to run migrations manually through the Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

#### For Fresh Setup (First Time)

If this is a new database setup, run **ALL** migrations in this exact order:

1. **`20240101000000_initial_schema.sql`** - Copy entire file contents and run
2. **`20240101000001_add_indexes.sql`** - Copy entire file contents and run
3. **`20240101000002_add_triggers_and_functions.sql`** - Copy entire file contents and run
4. **`20240101000003_add_rls_policies.sql`** - Copy entire file contents and run
5. **`20240101000004_add_village_council.sql`** - Copy entire file contents and run
6. **`20240101000005_add_admin_support.sql`** - Copy entire file contents and run
7. **`20240101000006_add_item_approval_status.sql`** - Copy entire file contents and run
8. **`20240101000007_add_location_to_services.sql`** - Copy entire file contents and run

**Important:** Run them one at a time, in order. Wait for each to complete before running the next.

#### For Existing Database (Adding New Migrations)

If you've already run some migrations:

1. Check which migrations have been applied:
   - Go to **Database** → **Migrations** in Supabase Dashboard
   - Or check the `supabase_migrations.schema_migrations` table
2. Only run the migration files that haven't been applied yet
3. Run them in order (by filename prefix)

**Example:** If you've already run migrations 1-6, only run:
- `20240101000007_add_location_to_services.sql`

#### Quick Reference: All Migration Files

```
supabase/migrations/
├── 20240101000000_initial_schema.sql              (Run first)
├── 20240101000001_add_indexes.sql                 (Run second)
├── 20240101000002_add_triggers_and_functions.sql  (Run third)
├── 20240101000003_add_rls_policies.sql            (Run fourth)
├── 20240101000004_add_village_council.sql         (Run fifth)
├── 20240101000005_add_admin_support.sql           (Run sixth)
├── 20240101000006_add_item_approval_status.sql    (Run seventh)
└── 20240101000007_add_location_to_services.sql    (Run eighth)
```

**Note:** Always run migrations in numerical order (by filename prefix). Each migration builds on the previous ones.

## Creating New Migrations

To create a new migration:

```bash
# Using Supabase CLI
supabase migration new migration_name

# This creates a new file: YYYYMMDDHHMMSS_migration_name.sql
```

Then edit the file and add your SQL statements.

## Migration Best Practices

1. **Always test locally first** - Run migrations on local Supabase before pushing to production
2. **Use IF NOT EXISTS** - Prevents errors if migration is run multiple times
3. **Add indexes** - Consider performance when adding new columns
4. **Update RLS policies** - If adding new tables, add appropriate RLS policies
5. **Backup before production** - Always backup your production database before running migrations
6. **Run in order** - Migrations must be run in the order specified by filename

## Troubleshooting

### Migration fails with "relation already exists"

This usually means the migration was partially applied. You can:
- Check which migrations have been applied in Supabase Dashboard → Database → Migrations
- Manually fix the migration file to use `IF NOT EXISTS` clauses
- Or reset the database (⚠️ **WARNING**: This deletes all data in local development)

### Migration fails with "permission denied"

- For local: Ensure Supabase is running (`supabase start`)
- For remote: Ensure you're linked to the correct project and have proper permissions

### Need to rollback a migration

Supabase doesn't have built-in rollback. You'll need to:
1. Create a new migration that reverses the changes
2. Or manually fix the database in Supabase Dashboard

## Migration Status

Check which migrations have been applied:

```bash
# Local
supabase migration list

# Remote (after linking)
supabase db remote commit
```

## Additional Resources

- [Supabase Migration Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- See `docs/SUPABASE_SETUP.md` for detailed setup instructions

