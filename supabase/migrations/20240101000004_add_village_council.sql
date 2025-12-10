-- ============================================================================
-- VILLAGE COUNCIL
-- ============================================================================

-- Council members table
CREATE TABLE council_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'inactive', 'rejected'
  approved_by UUID REFERENCES profiles(id), -- Admin who approved
  approved_at TIMESTAMPTZ,
  term_start_date TIMESTAMPTZ,
  term_end_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Council votes table (for voting on bans, rewards, etc.)
CREATE TABLE council_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  council_member_id UUID NOT NULL REFERENCES council_members(id) ON DELETE CASCADE,
  vote_type VARCHAR(50) NOT NULL, -- 'ban', 'unban', 'reward', 'crowdfunding_assistance'
  target_type VARCHAR(50) NOT NULL, -- 'user', 'campaign', etc.
  target_id UUID NOT NULL,
  vote VARCHAR(10) NOT NULL, -- 'yes', 'no', 'abstain'
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(council_member_id, vote_type, target_type, target_id)
);

-- Council proposals table (items for council to vote on)
CREATE TABLE council_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_type VARCHAR(50) NOT NULL, -- 'ban', 'unban', 'reward', 'crowdfunding_assistance'
  target_type VARCHAR(50) NOT NULL,
  target_id UUID NOT NULL,
  proposed_by UUID REFERENCES profiles(id), -- Can be admin or council member
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'voting', 'approved', 'rejected', 'closed'
  description TEXT NOT NULL,
  metadata JSONB,
  voting_deadline TIMESTAMPTZ,
  min_votes_required INTEGER DEFAULT 3,
  votes_required_for_approval INTEGER DEFAULT 3,
  yes_votes INTEGER DEFAULT 0,
  no_votes INTEGER DEFAULT 0,
  abstain_votes INTEGER DEFAULT 0,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Council rewards table (rewards given to contributing members)
CREATE TABLE council_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES council_proposals(id),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  amount_sats BIGINT NOT NULL,
  reason TEXT NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'cancelled'
  approved_by UUID REFERENCES profiles(id), -- Admin who approved
  created_by UUID NOT NULL REFERENCES profiles(id), -- Council member who created
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Council crowdfunding assistance table (help for members via crowdfunding)
CREATE TABLE council_crowdfunding_assistance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES council_proposals(id),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  assistance_type VARCHAR(50) NOT NULL, -- 'donation', 'feature', 'promotion'
  amount_sats BIGINT, -- For donation type
  transaction_id UUID REFERENCES transactions(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'completed', 'cancelled'
  notes TEXT,
  approved_by UUID REFERENCES profiles(id), -- Admin who approved
  created_by UUID NOT NULL REFERENCES profiles(id), -- Council member who created
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_council_members_user ON council_members(user_id);
CREATE INDEX idx_council_members_status ON council_members(status);
CREATE INDEX idx_council_votes_member ON council_votes(council_member_id);
CREATE INDEX idx_council_votes_proposal ON council_votes(vote_type, target_type, target_id);
CREATE INDEX idx_council_proposals_status ON council_proposals(status);
CREATE INDEX idx_council_proposals_type ON council_proposals(proposal_type, target_type);
CREATE INDEX idx_council_rewards_recipient ON council_rewards(recipient_id);
CREATE INDEX idx_council_rewards_status ON council_rewards(status);
CREATE INDEX idx_council_assistance_campaign ON council_crowdfunding_assistance(campaign_id);
CREATE INDEX idx_council_assistance_status ON council_crowdfunding_assistance(status);

-- Triggers
CREATE TRIGGER update_council_members_updated_at
    BEFORE UPDATE ON council_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_council_proposals_updated_at
    BEFORE UPDATE ON council_proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE council_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_crowdfunding_assistance ENABLE ROW LEVEL SECURITY;

-- Council members are viewable by everyone
CREATE POLICY "Council members are viewable by everyone"
    ON council_members FOR SELECT
    USING (true);

-- Only admins can create/update council member applications
CREATE POLICY "Admins can manage council members"
    ON council_members FOR INSERT
    WITH CHECK (true); -- Admin check happens in application logic

CREATE POLICY "Admins can update council members"
    ON council_members FOR UPDATE
    USING (true); -- Admin check happens in application logic

-- Council votes are viewable by council members and admins
CREATE POLICY "Council votes are viewable by council members"
    ON council_votes FOR SELECT
    USING (true); -- Council member check happens in application logic

-- Council members can create votes
CREATE POLICY "Council members can vote"
    ON council_votes FOR INSERT
    WITH CHECK (true); -- Council member check happens in application logic

-- Proposals are viewable by everyone
CREATE POLICY "Proposals are viewable by everyone"
    ON council_proposals FOR SELECT
    USING (true);

-- Admins and council members can create proposals
CREATE POLICY "Admins and council members can create proposals"
    ON council_proposals FOR INSERT
    WITH CHECK (true); -- Check happens in application logic

-- Council rewards are viewable by admins and council members
CREATE POLICY "Council rewards are viewable by admins and council members"
    ON council_rewards FOR SELECT
    USING (true); -- Check happens in application logic

-- Council members can create reward proposals
CREATE POLICY "Council members can create rewards"
    ON council_rewards FOR INSERT
    WITH CHECK (true); -- Council member check happens in application logic

-- Council assistance is viewable by admins and council members
CREATE POLICY "Council assistance is viewable by admins and council members"
    ON council_crowdfunding_assistance FOR SELECT
    USING (true); -- Check happens in application logic

-- Council members can create assistance proposals
CREATE POLICY "Council members can create assistance"
    ON council_crowdfunding_assistance FOR INSERT
    WITH CHECK (true); -- Council member check happens in application logic

