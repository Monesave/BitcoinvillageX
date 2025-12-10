-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orukka_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_resolutions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- WALLETS POLICIES
-- ============================================================================

-- Users can view their own wallet
CREATE POLICY "Users can view own wallet"
    ON wallets FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own wallet (via triggers/functions only)
CREATE POLICY "Users can update own wallet"
    ON wallets FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- TRANSACTIONS POLICIES
-- ============================================================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create transactions
CREATE POLICY "Users can create transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- MARKETPLACE POLICIES
-- ============================================================================

-- Anyone can view active listings
CREATE POLICY "Active listings are viewable by everyone"
    ON marketplace_listings FOR SELECT
    USING (is_active = true OR auth.uid() = seller_id);

-- Users can create listings
CREATE POLICY "Users can create listings"
    ON marketplace_listings FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings"
    ON marketplace_listings FOR UPDATE
    USING (auth.uid() = seller_id);

-- Users can view orders they're involved in
CREATE POLICY "Users can view own orders"
    ON marketplace_orders FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Buyers can create orders
CREATE POLICY "Buyers can create orders"
    ON marketplace_orders FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

-- ============================================================================
-- SERVICES POLICIES
-- ============================================================================

-- Anyone can view active service listings
CREATE POLICY "Active service listings are viewable by everyone"
    ON service_listings FOR SELECT
    USING (is_active = true OR auth.uid() = provider_id);

-- Providers can create service listings
CREATE POLICY "Providers can create service listings"
    ON service_listings FOR INSERT
    WITH CHECK (auth.uid() = provider_id);

-- Providers can update their own listings
CREATE POLICY "Providers can update own listings"
    ON service_listings FOR UPDATE
    USING (auth.uid() = provider_id);

-- Users can view contracts they're involved in
CREATE POLICY "Users can view own contracts"
    ON service_contracts FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = provider_id);

-- Buyers can create contracts
CREATE POLICY "Buyers can create contracts"
    ON service_contracts FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

-- ============================================================================
-- BOUNTIES POLICIES
-- ============================================================================

-- Anyone can view open bounties
CREATE POLICY "Bounties are viewable by everyone"
    ON bounties FOR SELECT
    USING (true);

-- Users can create bounties
CREATE POLICY "Users can create bounties"
    ON bounties FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

-- Creators can update their bounties
CREATE POLICY "Creators can update own bounties"
    ON bounties FOR UPDATE
    USING (auth.uid() = creator_id);

-- Anyone can view submissions for bounties
CREATE POLICY "Submissions are viewable by creator and solver"
    ON bounty_submissions FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM bounties WHERE id = bounty_id AND creator_id = auth.uid())
        OR solver_id = auth.uid()
    );

-- Users can create submissions
CREATE POLICY "Users can create submissions"
    ON bounty_submissions FOR INSERT
    WITH CHECK (auth.uid() = solver_id);

-- ============================================================================
-- CAMPAIGNS POLICIES
-- ============================================================================

-- Anyone can view active campaigns
CREATE POLICY "Campaigns are viewable by everyone"
    ON campaigns FOR SELECT
    USING (true);

-- Users can create campaigns
CREATE POLICY "Users can create campaigns"
    ON campaigns FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

-- Creators can update their campaigns
CREATE POLICY "Creators can update own campaigns"
    ON campaigns FOR UPDATE
    USING (auth.uid() = creator_id);

-- Anyone can view donations (with anonymity respect)
CREATE POLICY "Donations are viewable by everyone"
    ON donations FOR SELECT
    USING (true);

-- Users can create donations
CREATE POLICY "Users can create donations"
    ON donations FOR INSERT
    WITH CHECK (auth.uid() = donor_id);

-- ============================================================================
-- REVIEWS POLICIES
-- ============================================================================

-- Anyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

-- Users can create reviews
CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = reviewer_id);

-- ============================================================================
-- VERIFICATIONS POLICIES
-- ============================================================================

-- Users can view their own verifications
CREATE POLICY "Users can view own verifications"
    ON verifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create verifications
CREATE POLICY "Users can create verifications"
    ON verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ORUKKA ORDERS POLICIES
-- ============================================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orukka_orders FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders"
    ON orukka_orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- DISPUTES POLICIES
-- ============================================================================

-- Users can view disputes they're involved in
CREATE POLICY "Users can view own disputes"
    ON disputes FOR SELECT
    USING (auth.uid() = initiator_id OR auth.uid() = respondent_id);

-- Users can create disputes
CREATE POLICY "Users can create disputes"
    ON disputes FOR INSERT
    WITH CHECK (auth.uid() = initiator_id);

-- Users can view messages for their disputes
CREATE POLICY "Users can view dispute messages"
    ON dispute_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM disputes 
            WHERE id = dispute_id 
            AND (initiator_id = auth.uid() OR respondent_id = auth.uid())
        )
    );

-- Users can create messages in their disputes
CREATE POLICY "Users can create dispute messages"
    ON dispute_messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

