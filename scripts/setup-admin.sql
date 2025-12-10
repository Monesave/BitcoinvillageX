-- ============================================================================
-- SET UP ADMIN USER
-- ============================================================================
-- Run this script in Supabase SQL Editor after running migrations
-- and after the admin user has signed up

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

