-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE USER TABLES
-- ============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(100),
  is_verified_villager BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMPTZ,
  reputation_score DECIMAL(5,2) DEFAULT 0.00,
  total_transactions INTEGER DEFAULT 0,
  total_volume_sats BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets table
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance_sats BIGINT DEFAULT 0,
  pending_balance_sats BIGINT DEFAULT 0,
  escrow_balance_sats BIGINT DEFAULT 0,
  total_earned_sats BIGINT DEFAULT 0,
  total_spent_sats BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Wallet connections table
CREATE TABLE wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_type VARCHAR(50) NOT NULL,
  wallet_address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- ============================================================================
-- VERIFICATION & KYC
-- ============================================================================

-- Verifications table
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verriff_session_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  strike_payment_address VARCHAR(255) DEFAULT 'orukka@strike.me',
  payment_amount_usd DECIMAL(10,2) DEFAULT 10.00,
  payment_amount_sats BIGINT,
  lightning_invoice TEXT,
  lightning_payment_hash VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  verification_data JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC documents table
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(50),
  document_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRANSACTIONS
-- ============================================================================

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL,
  related_type VARCHAR(50),
  related_id UUID,
  amount_sats BIGINT NOT NULL,
  commission_sats BIGINT DEFAULT 0,
  net_amount_sats BIGINT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  lightning_invoice TEXT,
  lightning_payment_hash VARCHAR(255),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Escrow accounts table
CREATE TABLE escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  amount_sats BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  auto_release_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MARKETPLACE
-- ============================================================================

-- Marketplace listings table
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price_sats BIGINT NOT NULL,
  currency VARCHAR(10) DEFAULT 'BTC',
  price_usd DECIMAL(10,2),
  images TEXT[],
  condition VARCHAR(50),
  shipping_method VARCHAR(50),
  shipping_cost_sats BIGINT DEFAULT 0,
  location VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  radius_km INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace orders table
CREATE TABLE marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  escrow_id UUID NOT NULL REFERENCES escrow_accounts(id),
  quantity INTEGER DEFAULT 1,
  total_price_sats BIGINT NOT NULL,
  shipping_address JSONB,
  shipping_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending_payment',
  auto_release_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order shipments table
CREATE TABLE order_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  tracking_number VARCHAR(255),
  carrier VARCHAR(100),
  shipment_photos TEXT[],
  receipt_photo TEXT,
  shipped_at TIMESTAMPTZ DEFAULT NOW(),
  estimated_delivery TIMESTAMPTZ
);

-- Order deliveries table
CREATE TABLE order_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  delivery_photos TEXT[],
  delivery_confirmation_screenshot TEXT,
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_by_buyer BOOLEAN DEFAULT FALSE
);

-- ============================================================================
-- SERVICES
-- ============================================================================

-- Service listings table
CREATE TABLE service_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  base_price_sats BIGINT NOT NULL,
  price_type VARCHAR(50),
  delivery_time_days INTEGER,
  revision_limit INTEGER DEFAULT 2,
  images TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service contracts table
CREATE TABLE service_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES service_listings(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES profiles(id),
  total_price_sats BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  auto_complete_days INTEGER DEFAULT 14,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service milestones table
CREATE TABLE service_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES service_contracts(id) ON DELETE CASCADE,
  milestone_number INTEGER NOT NULL,
  title VARCHAR(255),
  description TEXT,
  amount_sats BIGINT NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  escrow_id UUID REFERENCES escrow_accounts(id),
  status VARCHAR(50) DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
);

-- Service deliverables table
CREATE TABLE service_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES service_milestones(id) ON DELETE CASCADE,
  file_url TEXT,
  file_name VARCHAR(255),
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service revisions table
CREATE TABLE service_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES service_milestones(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  request_notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- BOUNTIES
-- ============================================================================

-- Bounties table
CREATE TABLE bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  reward_sats BIGINT NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  escrow_id UUID REFERENCES escrow_accounts(id),
  status VARCHAR(50) DEFAULT 'open',
  max_solvers INTEGER DEFAULT 1,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bounty submissions table
CREATE TABLE bounty_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  solver_id UUID NOT NULL REFERENCES profiles(id),
  submission_text TEXT,
  submission_files TEXT[],
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Bounty awards table
CREATE TABLE bounty_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id),
  submission_id UUID NOT NULL REFERENCES bounty_submissions(id),
  solver_id UUID NOT NULL REFERENCES profiles(id),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  reward_sats BIGINT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CROWDFUNDING
-- ============================================================================

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  goal_sats BIGINT NOT NULL,
  current_sats BIGINT DEFAULT 0,
  goal_usd DECIMAL(10,2),
  current_usd DECIMAL(10,2),
  images TEXT[],
  video_url TEXT,
  deadline TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES profiles(id),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  amount_sats BIGINT NOT NULL,
  amount_usd DECIMAL(10,2),
  is_anonymous BOOLEAN DEFAULT FALSE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRODUCTS (ORUKKA RINGS)
-- ============================================================================

-- Orukka orders table
CREATE TABLE orukka_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ring_type VARCHAR(50) NOT NULL, -- 'payment_ring', 'business_ring'
  transaction_id UUID REFERENCES transactions(id),
  amount_usd DECIMAL(10,2) NOT NULL,
  amount_sats BIGINT NOT NULL,
  lightning_invoice TEXT,
  lightning_payment_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
  shipping_address JSONB NOT NULL,
  tracking_number VARCHAR(255),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REVIEWS & TRUST
-- ============================================================================

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  related_type VARCHAR(50) NOT NULL,
  related_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reviewer_id, reviewee_id, related_type, related_id)
);

-- Reputation scores table
CREATE TABLE reputation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  overall_score DECIMAL(5,2) DEFAULT 0.00,
  marketplace_score DECIMAL(5,2) DEFAULT 0.00,
  services_score DECIMAL(5,2) DEFAULT 0.00,
  bounties_score DECIMAL(5,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  positive_reviews INTEGER DEFAULT 0,
  negative_reviews INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DISPUTES
-- ============================================================================

-- Disputes table
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_type VARCHAR(50) NOT NULL,
  related_id UUID NOT NULL,
  initiator_id UUID NOT NULL REFERENCES profiles(id),
  respondent_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  resolution_type VARCHAR(50),
  resolution_amount_sats BIGINT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute messages table
CREATE TABLE dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT,
  attachments TEXT[],
  is_admin_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute resolutions table
CREATE TABLE dispute_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE UNIQUE,
  resolved_by UUID NOT NULL REFERENCES profiles(id),
  resolution_notes TEXT,
  transaction_id UUID REFERENCES transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ADMIN & MODERATION
-- ============================================================================

-- Admin actions table
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action_type VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation logs table
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES profiles(id),
  content_type VARCHAR(50) NOT NULL,
  content_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

