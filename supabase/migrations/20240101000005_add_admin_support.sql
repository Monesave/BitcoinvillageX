-- ============================================================================
-- ADMIN SUPPORT
-- ============================================================================

-- Add is_admin column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = TRUE;

-- Update RLS policies to allow admins to update any profile
-- Drop policy if it exists first (to avoid errors on re-run)
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE POLICY "Admins can update any profile"
    ON profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- ============================================================================
-- SET INITIAL ADMIN USER
-- ============================================================================

-- Function to set admin by email
CREATE OR REPLACE FUNCTION set_admin_by_email(admin_email TEXT)
RETURNS VOID AS $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Find user by email in auth.users
    SELECT id INTO user_uuid
    FROM auth.users
    WHERE LOWER(email) = LOWER(admin_email)
    LIMIT 1;
    
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', admin_email;
    END IF;
    
    -- Update or create profile with admin flag
    INSERT INTO profiles (id, is_admin)
    VALUES (user_uuid, TRUE)
    ON CONFLICT (id) 
    DO UPDATE SET is_admin = TRUE;
    
    RAISE NOTICE 'Admin privileges granted to user % (%)', admin_email, user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set initial admin (will run when migration is executed)
-- If user doesn't exist yet, this will be ignored - run manually after user signs up
DO $$
BEGIN
    -- Try to set admin, but don't fail if user doesn't exist yet
    BEGIN
        PERFORM set_admin_by_email('mrpatrizio@gmail.com');
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Admin user mrpatrizio@gmail.com not found. Run set_admin_by_email(''mrpatrizio@gmail.com'') after user signs up.';
    END;
END $$;
