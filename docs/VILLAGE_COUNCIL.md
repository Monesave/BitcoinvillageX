# Village Council System

## Overview

The Village Council is a governance system that allows trusted community members to participate in decision-making processes for the BitcoinVillageX platform. Council members are selected and approved by Admins, and work together to:

1. **Moderation**: Vote on banning/unbanning members
2. **Recognition**: Provide rewards to contributing members
3. **Support**: Assist members via crowdfunding campaigns

## Council Member Management

### Becoming a Council Member

1. Users must be selected/nominated by Admins
2. Admins review applications and approve/reject them
3. Approved members are assigned a term (optional start/end dates)
4. Council members can have active, inactive, or pending status

### Admin Functions

Admins have full control over council membership:

- **View Applications**: See all council member applications with user details
- **Approve/Reject**: Approve or reject council member applications
- **Set Terms**: Define term start and end dates for council members
- **Deactivate**: Remove active council members if needed

### API Endpoints (Admin Only)

```
GET    /api/admin/council/applications          - Get all council applications
POST   /api/admin/council/applications/:id/review - Approve/reject application
POST   /api/admin/council/members/:id/deactivate  - Deactivate council member
```

## Council Proposals & Voting System

### Proposal Types

1. **Ban/Unban**: Vote on banning or unbanning members
2. **Reward**: Propose rewards for contributing members
3. **Crowdfunding Assistance**: Propose assistance for crowdfunding campaigns

### Voting Process

1. Council member creates a proposal
2. Other council members vote (yes/no/abstain)
3. Proposal requires minimum votes (default: 3 votes)
4. Proposal needs votes required for approval (default: 3 yes votes)
5. Once approved, action is executed (e.g., reward paid, ban applied)

### Proposal Status

- `open`: Proposal created, waiting for votes
- `voting`: Active voting in progress
- `approved`: Proposal approved and action executed
- `rejected`: Proposal rejected (too many no votes or deadline passed)
- `closed`: Proposal manually closed

### API Endpoints (Council Members)

```
POST   /api/council/proposals                   - Create proposal
GET    /api/council/proposals                   - Get all proposals
GET    /api/council/proposals/:id               - Get proposal details
POST   /api/council/proposals/:id/vote          - Vote on proposal
```

## Council Rewards

Council members can propose rewards for members who contribute significantly to the village:

- **Purpose**: Recognize and incentivize valuable contributions
- **Process**: Council member proposes → Council votes → Admin approves → Reward paid
- **Amount**: Specified in sats, deducted from platform funds

### API Endpoints (Council Members)

```
POST   /api/council/rewards                     - Create reward proposal
GET    /api/council/rewards                     - Get all rewards
```

## Crowdfunding Assistance

Council can help members in need via crowdfunding campaigns:

### Assistance Types

1. **Donation**: Direct financial donation to campaign
2. **Feature**: Feature the campaign prominently
3. **Promotion**: Promote the campaign through official channels

### Process

1. Council member identifies a campaign needing assistance
2. Council member creates assistance proposal
3. Council votes on the proposal
4. If approved, admin reviews and executes (e.g., makes donation, features campaign)

### API Endpoints (Council Members)

```
POST   /api/council/assistance                  - Create assistance proposal
GET    /api/council/assistance                  - Get all assistance records
```

## Access Control

### Council Member Access

- All council endpoints require authentication
- Council members must have `active` status
- Council members must not have expired terms (if term_end_date is set)

### Middleware

- `requireCouncilMember`: Requires active council membership
- `optionalCouncilMember`: Optional check, doesn't fail if not a council member

## Database Schema

### Tables

1. **council_members**: Council membership records
2. **council_proposals**: Proposals for voting
3. **council_votes**: Individual votes on proposals
4. **council_rewards**: Reward proposals and records
5. **council_crowdfunding_assistance**: Assistance proposals and records

### Key Relationships

- Council members link to user profiles
- Proposals link to target entities (users, campaigns, etc.)
- Votes link to proposals and council members
- Rewards link to proposals and recipients
- Assistance links to proposals and campaigns

## Workflow Examples

### Banning a Member

1. Council member creates a "ban" proposal targeting the user
2. Council members vote on the proposal
3. If approved (minimum yes votes), admin reviews and executes ban
4. Ban is recorded in moderation logs

### Rewarding a Contributor

1. Council member creates a "reward" proposal with recipient and amount
2. Council votes on the proposal
3. If approved, admin reviews and approves the reward
4. Reward transaction is created and funds are transferred to recipient

### Assisting a Campaign

1. Council member identifies a campaign needing help
2. Council member creates "crowdfunding_assistance" proposal
3. Council votes on assistance type and amount (if donation)
4. If approved, admin reviews and executes assistance
5. Campaign receives donation, feature, or promotion

## Configuration

### Default Voting Requirements

- **Minimum Votes Required**: 3 (configurable per proposal)
- **Votes Required for Approval**: 3 (configurable per proposal)
- **Voting Deadline**: Optional, can be set per proposal

### Term Limits

Council members can have:
- Fixed terms with start and end dates
- Open-ended terms (no end date)
- Terms managed by admins

## Security & Privacy

- All council actions are logged in admin_actions table
- Vote history is visible to council members and admins
- Proposal details are public (except sensitive information)
- Council member identities are public (part of transparency)

## Future Enhancements

Potential future features:
- Council member nomination by community
- Automatic reward distribution upon approval
- Integration with reputation system for automatic rewards
- Council member elections/terms
- Proposal categories and priorities
- Notification system for proposals and votes

