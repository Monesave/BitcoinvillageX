-- ============================================================================
-- ADD APPROVAL STATUS TO LISTINGS
-- ============================================================================

-- Add approval_status to marketplace_listings
ALTER TABLE marketplace_listings
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending'; -- 'pending', 'approved', 'rejected'

-- Add approval_status to service_listings  
ALTER TABLE service_listings
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending'; -- 'pending', 'approved', 'rejected'

-- Add approved_by columns to track who approved/rejected
ALTER TABLE marketplace_listings
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id);

ALTER TABLE service_listings
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id);

-- Add approval notes
ALTER TABLE marketplace_listings
ADD COLUMN IF NOT EXISTS approval_notes TEXT;

ALTER TABLE service_listings
ADD COLUMN IF NOT EXISTS approval_notes TEXT;

-- Only show approved listings by default (unless user is admin/council)
-- This will be enforced via RLS policies and application logic

