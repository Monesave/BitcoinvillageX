-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_verified ON profiles(is_verified_villager);
CREATE INDEX idx_profiles_reputation ON profiles(reputation_score DESC);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_related ON transactions(related_type, related_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Escrow indexes
CREATE INDEX idx_escrow_buyer ON escrow_accounts(buyer_id);
CREATE INDEX idx_escrow_seller ON escrow_accounts(seller_id);
CREATE INDEX idx_escrow_status ON escrow_accounts(status);
CREATE INDEX idx_escrow_auto_release ON escrow_accounts(auto_release_at) WHERE status = 'pending';

-- Marketplace indexes
CREATE INDEX idx_marketplace_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_active ON marketplace_listings(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_marketplace_listings_category ON marketplace_listings(category);
CREATE INDEX idx_marketplace_listings_created ON marketplace_listings(created_at DESC);
CREATE INDEX idx_marketplace_orders_buyer ON marketplace_orders(buyer_id);
CREATE INDEX idx_marketplace_orders_seller ON marketplace_orders(seller_id);
CREATE INDEX idx_marketplace_orders_status ON marketplace_orders(status);
CREATE INDEX idx_marketplace_orders_listing ON marketplace_orders(listing_id);

-- Services indexes
CREATE INDEX idx_service_listings_provider ON service_listings(provider_id);
CREATE INDEX idx_service_listings_active ON service_listings(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_service_contracts_buyer ON service_contracts(buyer_id);
CREATE INDEX idx_service_contracts_provider ON service_contracts(provider_id);
CREATE INDEX idx_service_contracts_status ON service_contracts(status);
CREATE INDEX idx_service_milestones_contract ON service_milestones(contract_id);
CREATE INDEX idx_service_milestones_status ON service_milestones(status);

-- Bounties indexes
CREATE INDEX idx_bounties_creator ON bounties(creator_id);
CREATE INDEX idx_bounties_status ON bounties(status);
CREATE INDEX idx_bounties_category ON bounties(category);
CREATE INDEX idx_bounties_deadline ON bounties(deadline) WHERE status = 'open';
CREATE INDEX idx_bounty_submissions_bounty ON bounty_submissions(bounty_id);
CREATE INDEX idx_bounty_submissions_solver ON bounty_submissions(solver_id);
CREATE INDEX idx_bounty_submissions_status ON bounty_submissions(status);

-- Campaigns indexes
CREATE INDEX idx_campaigns_creator ON campaigns(creator_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_featured ON campaigns(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_campaigns_deadline ON campaigns(deadline) WHERE status = 'active';
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);

-- Reviews indexes
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_related ON reviews(related_type, related_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Disputes indexes
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_initiator ON disputes(initiator_id);
CREATE INDEX idx_disputes_respondent ON disputes(respondent_id);
CREATE INDEX idx_disputes_related ON disputes(dispute_type, related_id);
CREATE INDEX idx_dispute_messages_dispute ON dispute_messages(dispute_id);

-- Verification indexes
CREATE INDEX idx_verifications_user ON verifications(user_id);
CREATE INDEX idx_verifications_status ON verifications(status);
CREATE INDEX idx_verifications_verriff ON verifications(verriff_session_id) WHERE verriff_session_id IS NOT NULL;

-- Wallet indexes
CREATE INDEX idx_wallet_connections_user ON wallet_connections(user_id);
CREATE INDEX idx_wallet_connections_active ON wallet_connections(is_active) WHERE is_active = TRUE;

