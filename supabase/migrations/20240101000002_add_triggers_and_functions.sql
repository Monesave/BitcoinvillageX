-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create profile and wallet when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Villager')
    );
    
    INSERT INTO public.wallets (user_id)
    VALUES (NEW.id);
    
    INSERT INTO public.reputation_scores (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate reputation score
CREATE OR REPLACE FUNCTION calculate_reputation_score(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    avg_rating DECIMAL;
    total_reviews_count INTEGER;
BEGIN
    SELECT AVG(rating)::DECIMAL, COUNT(*) INTO avg_rating, total_reviews_count
    FROM reviews
    WHERE reviewee_id = user_uuid;
    
    RETURN COALESCE(avg_rating, 0.00);
END;
$$ LANGUAGE plpgsql;

-- Function to update reputation when review is created/updated
CREATE OR REPLACE FUNCTION update_reputation_on_review()
RETURNS TRIGGER AS $$
DECLARE
    new_score DECIMAL;
    positive_count INTEGER;
    negative_count INTEGER;
BEGIN
    -- Calculate new overall score
    new_score := calculate_reputation_score(NEW.reviewee_id);
    
    -- Count positive (4-5) and negative (1-2) reviews
    SELECT 
        COUNT(*) FILTER (WHERE rating >= 4),
        COUNT(*) FILTER (WHERE rating <= 2)
    INTO positive_count, negative_count
    FROM reviews
    WHERE reviewee_id = NEW.reviewee_id;
    
    -- Update reputation scores
    UPDATE reputation_scores
    SET 
        overall_score = new_score,
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = NEW.reviewee_id),
        positive_reviews = positive_count,
        negative_reviews = negative_count,
        updated_at = NOW()
    WHERE user_id = NEW.reviewee_id;
    
    -- Update profile reputation score
    UPDATE profiles
    SET reputation_score = new_score
    WHERE id = NEW.reviewee_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update campaign totals when donation is made
CREATE OR REPLACE FUNCTION update_campaign_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE campaigns
    SET 
        current_sats = current_sats + NEW.amount_sats,
        current_usd = COALESCE(current_usd, 0) + COALESCE(NEW.amount_usd, 0),
        updated_at = NOW()
    WHERE id = NEW.campaign_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update wallet balance on transaction
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Update wallet based on transaction type
        IF NEW.transaction_type = 'deposit' OR NEW.transaction_type = 'payment' THEN
            UPDATE wallets
            SET 
                balance_sats = balance_sats + NEW.net_amount_sats,
                total_earned_sats = total_earned_sats + NEW.net_amount_sats,
                updated_at = NOW()
            WHERE user_id = NEW.user_id;
        ELSIF NEW.transaction_type = 'withdrawal' THEN
            UPDATE wallets
            SET 
                balance_sats = balance_sats - NEW.amount_sats,
                total_spent_sats = total_spent_sats + NEW.amount_sats,
                updated_at = NOW()
            WHERE user_id = NEW.user_id;
        END IF;
        
        -- Update profile transaction count and volume
        UPDATE profiles
        SET 
            total_transactions = total_transactions + 1,
            total_volume_sats = total_volume_sats + NEW.amount_sats,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-create profile and wallet on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at on wallet changes
CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update reputation when review is created/updated
CREATE TRIGGER update_reputation_on_review_insert
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_reputation_on_review();

CREATE TRIGGER update_reputation_on_review_update
    AFTER UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_reputation_on_review();

-- Update campaign totals when donation is made
CREATE TRIGGER update_campaign_on_donation
    AFTER INSERT ON donations
    FOR EACH ROW EXECUTE FUNCTION update_campaign_totals();

-- Update wallet balance when transaction is completed
CREATE TRIGGER update_wallet_on_transaction
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();

-- Update updated_at on other tables
CREATE TRIGGER update_marketplace_listings_updated_at
    BEFORE UPDATE ON marketplace_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_orders_updated_at
    BEFORE UPDATE ON marketplace_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_listings_updated_at
    BEFORE UPDATE ON service_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bounties_updated_at
    BEFORE UPDATE ON bounties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verifications_updated_at
    BEFORE UPDATE ON verifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at
    BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orukka_orders_updated_at
    BEFORE UPDATE ON orukka_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

