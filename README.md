# BitcoinVillageX

> **Welcome to the Global Bitcoin Village**

A Bitcoin-only micro-economy where Villagers spend, receive, donate, trade services, and support each other using **BTC over Lightning** — the hardest money and the most powerful form of global value transfer.

## 🌍 Overview

BitcoinVillageX is a **Bitcoin-only utility village** — a place where people spend, receive, donate, trade services, and support each other with BTC only. It's more than an app; it's a **living Bitcoin economy** built around global Villagers and the **Verified Villager** trust system.

### Core Principles

- ✔ **Bitcoin-only transfers** — no fiat, no altcoins, no credit cards
- ✔ **Lightning payments** — instant sats, tiny fees, unstoppable payments
- ✔ **Low platform fee** — 2.5% commission on all transactions
- ✔ **Verified Villager** — identity verification via Verriff ($10 USD)
- ✔ **Mobile-first** — clean, conversion-focused design
- ✔ **Trust-driven** — built around the Verified Villager system

## ✨ Features

### 1. Crowdfunding & Donations
**Tagline:** Fund the future with sats — no banks, no limits.

Launch Bitcoin-only campaigns in minutes and receive donations instantly over Lightning. Platform fee: **2.5%** on funds raised.

### 2. Marketplace – Buy & Sell Goods
**Tagline:** Real goods. Real value. Real Bitcoin.

Buy and sell goods in a global Bitcoin marketplace. Every transaction settles instantly over Lightning with integrated escrow, proof of shipment/delivery, and dispute resolution.

**Key Features:**
- Non-custodial pending state (Village Escrow)
- Proof of shipment tools (tracking, photos, receipts)
- Proof of delivery tools (photos, confirmations)
- Local pickup mode with radius-based map
- Dispute workflow with admin review
- Reputation impact on trust scores

### 3. Services – Work for Bitcoin
**Tagline:** Turn your skills into sats.

Offer your skills or hire talented Villagers worldwide. Everything runs on Bitcoin over Lightning with milestone-based payments and completion workflows.

**Key Features:**
- Milestone-based payment system
- Completion workflow with dual confirmation
- Deliverable upload and review system
- Revision requests (max 2 default)
- Auto-completion for inactive buyers
- Dispute resolution with admin review

### 4. Bitcoin Bounties
**Tagline:** Put a price on any problem — pay solvers in sats.

Create bounties for bugs, lost items, research, or real-world challenges. Villagers compete to solve tasks and get rewarded in Lightning instantly.

### 5. Orukka Ring Store
**Tagline:** Order your Bitcoin payment ring directly from the village.

Purchase **Orukka Payment Ring** and **Orukka Business Ring** directly through the app. Payments processed via Bitcoin Lightning Network.

## 👥 User Capabilities

### For Users
- **Multiple signup options** — Google, email, or phone number
- Register & manage Lightning-based balances (Bitcoin balance on the app)
- Upgrade to **Verified Villager** status via Verriff verification ($10 USD fee)
- Send P2P payments instantly
- Pay merchants
- Donate to crowdfunding campaigns
- Search for products and services
- Post puzzles and bounties
- Order **Orukka Payment Ring** directly from the app
- Order **Orukka Business Ring** directly from the app
- Withdraw to Strike or Lightning
- Withdraw to Monesave App (allows users to spend fiat)

### For Merchants
- Accept Lightning/BTC instantly
- See transactions and balance
- Withdraw to fiat through Strike
- Withdraw to Monesave App (allows users to spend fiat)
- Deliver products and services
- Solve puzzles and bounties
- Spend BTC inside the ecosystem
- Create fundraising for their communities

### For Backend and Admin
- User creation and setup via Supabase
- Identity verification via Verriff API integration
- KYC details for higher limits
- Creation of wallets for users and balance storage
- Conversion to user currency based on Strike API
- Payments based on Bitcoin
- Platform fee deduction (2.5%) from all transactions
- Strike address payment for verification fees
- Transaction commission management (2.5% on all transactions)

## 🛠 Tech Stack

### Frontend
- **Web Application** — mobile-first, responsive design
- Modern web technologies (React/Vue/Angular or similar)

### Backend & Database
- **Supabase** — PostgreSQL database, authentication, and backend services
- **Supabase Auth** — user authentication and session management

### Authentication
- **Google Sign-In** — OAuth integration
- **Email/Password** — traditional authentication
- **Phone Number** — SMS-based authentication

### Payment & Verification
- **Bitcoin Lightning Network** — for instant Bitcoin payments
- **Platform Fee Deduction** — 2.5% commission automatically deducted from all transactions
- **Strike Address** — direct payment to `orukka@strike.me` for Verified Villager verification ($10 USD)
- **Verriff API** — identity verification for Verified Villager status
- **Strike API** — for currency conversion and fiat withdrawals

### Wallet Integrations
- [Strike](https://www.strike.me)
- [Orukka](https://www.orukka.com)
- [Orukka Business](https://www.orukkabusiness.com)
- [Orukka P2P](https://www.orukkaP2P.com)
- [Monesave](https://www.monesave.com)

### Additional Services
- **Orukka Payment Ring** — order directly from the app
- **Orukka Business Ring** — order directly from the app

## 🏛️ Village Council: Trust, Reviews & Safety

A global Bitcoin-only community protected by transparency.

**Features:**
- ⭐ Ratings & reviews
- 🛡️ Moderation by the Village Council
- 🧭 Villager reputation history
- ⚖️ Dispute processes for Marketplace, Services & Bounties

Trust emerges from the Villagers themselves, supported by an active council and visible reputation signals.

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0 (>= 20.0.0 recommended for Supabase)
- **npm** >= 9.0.0
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- A Lightning wallet (Strike, Orukka, or compatible) - optional for initial signup
- Google account, email, or phone number for registration

### Quick Setup

1. **Set up Supabase Database:**
   ```bash
   # See detailed instructions in docs/SUPABASE_SETUP.md
   # For local development:
   ./scripts/setup-supabase.sh
   ```

2. **Clone the repository:**
```bash
git clone [repository-url]
cd BitcoinvillageX
```

2. **Install root dependencies:**
```bash
npm install
```

3. **Set up Supabase:**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your credentials from Project Settings > API
   - Run database migrations (see Database Setup below)

4. **Set up Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```
   See [frontend/README.md](./frontend/README.md) for detailed frontend setup.

5. **Set up Backend** (when ready):
```bash
cd backend
npm install
# Configure backend environment variables
npm run dev
```

### Environment Variables

#### Frontend (.env in frontend directory)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:3000
VITE_STRIKE_VERIFICATION_ADDRESS=orukka@strike.me
```

#### Backend (.env in backend directory - when implemented)
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payment & Verification
STRIKE_VERIFICATION_ADDRESS=orukka@strike.me
VERRIFF_API_KEY=your_verriff_api_key
VERRIFF_VERIFICATION_FEE=10.00

# Lightning & Bitcoin (via Strike API)
STRIKE_API_KEY=your_strike_api_key
STRIKE_API_URL=https://api.strike.me
STRIKE_RECEIVER_HANDLE=orukka@strike.me

# Platform Settings
PLATFORM_FEE=2.5
NODE_ENV=development
PORT=3000

# Wallet Integrations
WALLET_INTEGRATIONS=strike,orukka,monesave
```

### Database Setup

1. **Initialize Supabase locally (optional):**
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Run migrations
supabase db reset
```

2. **Or apply migrations to your Supabase project:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration files from `supabase/migrations/` in order:
     - `20240101000000_initial_schema.sql`
     - `20240101000001_add_indexes.sql`
     - `20240101000002_add_triggers_and_functions.sql`
     - `20240101000003_add_rls_policies.sql`

### Running the Application

**Development mode:**
```bash
# From root directory - runs both frontend and backend
npm run dev

# Or run separately:
# Frontend
cd frontend && npm run dev

# Backend (when implemented)
cd backend && npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📖 Usage

### Creating Your Villager Profile

1. **Sign up** using one of the following methods:
   - Google account
   - Email and password
   - Phone number (SMS verification)
2. Create your Villager Profile
3. **Upgrade to Verified Villager** (optional):
   - Pay $10 USD verification fee directly to Strike address: `orukka@strike.me`
   - Complete identity verification through Verriff API
   - Get enhanced trust badge and higher transaction limits
4. Connect your Lightning wallet
5. Start earning, spending, and trading with Bitcoin

### Ordering Orukka Rings

1. Navigate to the Orukka section in the app
2. Choose between **Orukka Payment Ring** or **Orukka Business Ring**
3. Complete purchase using Bitcoin Lightning Network
4. Rings will be shipped to your registered address

### Using the Marketplace

1. Browse or list items
2. Place order and pay via Lightning (funds enter Village Escrow)
3. Seller ships and uploads proof of shipment
4. Buyer confirms delivery → sats released automatically
5. Disputes can be opened for admin review if needed

### Offering Services

1. Create a service listing
2. Set up milestone-based payments
3. Complete work and upload deliverables
4. Buyer reviews and approves → sats release
5. Request revisions or open disputes as needed

### Creating Bounties

1. Post a bounty with Bitcoin reward
2. Villagers compete to solve
3. Winner receives Lightning payment instantly

## 🔧 Configuration

### Environment Variables

#### Supabase Configuration
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key

#### Authentication
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret

#### Payment & Verification
- `STRIKE_VERIFICATION_ADDRESS` — Strike address for verification payments (default: orukka@strike.me)
- `VERRIFF_API_KEY` — Verriff API key for identity verification
- `VERRIFF_VERIFICATION_FEE` — Verification fee amount (default: 10.00 USD)

#### Lightning & Bitcoin
- `LIGHTNING_NODE_URL` — Lightning node connection
- `STRIKE_API_KEY` — Strike API credentials for currency conversion

#### Platform Settings
- `PLATFORM_FEE` — Platform commission percentage (default: 2.5%)
- `WALLET_INTEGRATIONS` — Wallet provider configurations

### Wallet Setup

Configure integrations with:
- Strike
- Orukka ecosystem (Orukka, Orukka Business, Orukka P2P)
- Monesave

## 📁 Project Structure

```
BitcoinvillageX/
├── frontend/                          # Web application (mobile-first)
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── common/              # Buttons, inputs, modals
│   │   │   ├── marketplace/         # Marketplace components
│   │   │   ├── services/            # Services components
│   │   │   ├── bounties/            # Bounties components
│   │   │   ├── crowdfunding/        # Campaign components
│   │   │   ├── profile/             # User profile components
│   │   │   └── admin/               # Admin components
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Bounties.tsx
│   │   │   ├── Crowdfunding.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Orders.tsx
│   │   │   └── Admin.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useWallet.ts
│   │   │   ├── useLightning.ts
│   │   │   └── useTransactions.ts
│   │   ├── services/                # API service layers
│   │   │   ├── api.ts
│   │   │   ├── supabase.ts
│   │   │   ├── lightning.ts
│   │   │   └── verriff.ts
│   │   ├── store/                   # State management
│   │   │   ├── authStore.ts
│   │   │   ├── walletStore.ts
│   │   │   └── appStore.ts
│   │   ├── utils/                   # Utility functions
│   │   ├── types/                   # TypeScript types
│   │   ├── styles/                  # Global styles
│   │   └── App.tsx
│   ├── public/                      # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                          # API and business logic
│   ├── src/
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── marketplace.routes.ts
│   │   │   ├── services.routes.ts
│   │   │   ├── bounties.routes.ts
│   │   │   ├── crowdfunding.routes.ts
│   │   │   ├── payments.routes.ts
│   │   │   ├── wallet.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── controllers/             # Route controllers
│   │   ├── services/                # Business logic
│   │   │   ├── lightning.service.ts
│   │   │   ├── escrow.service.ts
│   │   │   ├── commission.service.ts
│   │   │   └── notification.service.ts
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── utils/                   # Utility functions
│   │   └── server.ts
│   └── package.json
│
├── supabase/                         # Supabase configuration
│   ├── migrations/                  # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_indexes.sql
│   │   └── 003_add_triggers.sql
│   ├── functions/                   # Edge functions
│   │   ├── process-payment/
│   │   ├── handle-escrow/
│   │   ├── send-notification/
│   │   └── verify-identity/
│   ├── config.toml                  # Supabase config
│   └── seed.sql                     # Seed data
│
├── shared/                           # Shared code between frontend/backend
│   ├── types/                       # Shared TypeScript types
│   ├── constants/                   # Shared constants
│   └── utils/                       # Shared utilities
│
├── docs/                             # Documentation
│   ├── api/                         # API documentation
│   ├── database/                    # Database documentation
│   └── deployment/                  # Deployment guides
│
├── tests/                            # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/                          # Utility scripts
│   ├── seed-db.ts
│   ├── migrate.ts
│   └── deploy.sh
│
├── .github/                          # GitHub workflows
│   └── workflows/
│
├── .env.example                      # Environment variables template
├── .gitignore
├── package.json                      # Root package.json (monorepo)
├── README.md
└── LICENSE
```

## 🗄️ Database Schema

### Core User Tables

```sql
-- Extends Supabase auth.users
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

-- User wallet balances
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

-- Connected external wallets
CREATE TABLE wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_type VARCHAR(50) NOT NULL, -- 'strike', 'orukka', 'monesave', etc.
  wallet_address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);
```

### Verification & KYC

```sql
-- Verriff verification records
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verriff_session_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL, -- 'pending', 'approved', 'rejected', 'expired'
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

-- KYC documents for higher limits
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(50), -- 'passport', 'drivers_license', 'id_card'
  document_url TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Transactions

```sql
-- All Bitcoin transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'payment', 'withdrawal', 'deposit', 'escrow', 'commission'
  related_type VARCHAR(50), -- 'marketplace_order', 'service_contract', 'bounty', 'donation', 'p2p'
  related_id UUID,
  amount_sats BIGINT NOT NULL,
  commission_sats BIGINT DEFAULT 0,
  net_amount_sats BIGINT NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'cancelled'
  lightning_invoice TEXT,
  lightning_payment_hash VARCHAR(255),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Escrow accounts for pending transactions
CREATE TABLE escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  amount_sats BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'released', 'refunded', 'disputed'
  auto_release_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Marketplace

```sql
-- Marketplace product listings
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
  condition VARCHAR(50), -- 'new', 'used', 'refurbished'
  shipping_method VARCHAR(50), -- 'standard', 'express', 'local_pickup'
  shipping_cost_sats BIGINT DEFAULT 0,
  location VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  radius_km INTEGER, -- For local pickup
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace orders
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
  status VARCHAR(50) DEFAULT 'pending_payment', -- 'pending_payment', 'paid', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed'
  auto_release_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proof of shipment
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

-- Proof of delivery
CREATE TABLE order_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  delivery_photos TEXT[],
  delivery_confirmation_screenshot TEXT,
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_by_buyer BOOLEAN DEFAULT FALSE
);
```

### Services

```sql
-- Service listings
CREATE TABLE service_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  base_price_sats BIGINT NOT NULL,
  price_type VARCHAR(50), -- 'fixed', 'hourly', 'milestone'
  delivery_time_days INTEGER,
  revision_limit INTEGER DEFAULT 2,
  images TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service contracts
CREATE TABLE service_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES service_listings(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES profiles(id),
  total_price_sats BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'completed', 'cancelled', 'disputed'
  auto_complete_days INTEGER DEFAULT 14,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service milestones
CREATE TABLE service_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES service_contracts(id) ON DELETE CASCADE,
  milestone_number INTEGER NOT NULL,
  title VARCHAR(255),
  description TEXT,
  amount_sats BIGINT NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  escrow_id UUID REFERENCES escrow_accounts(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'approved', 'rejected'
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
);

-- Service deliverables
CREATE TABLE service_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES service_milestones(id) ON DELETE CASCADE,
  file_url TEXT,
  file_name VARCHAR(255),
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service revisions
CREATE TABLE service_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES service_milestones(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  request_notes TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

### Bounties

```sql
-- Bounty listings
CREATE TABLE bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'bug', 'lost_item', 'research', 'challenge'
  reward_sats BIGINT NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  escrow_id UUID REFERENCES escrow_accounts(id),
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
  max_solvers INTEGER DEFAULT 1,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bounty submissions
CREATE TABLE bounty_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  solver_id UUID NOT NULL REFERENCES profiles(id),
  submission_text TEXT,
  submission_files TEXT[],
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Bounty awards
CREATE TABLE bounty_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id),
  submission_id UUID NOT NULL REFERENCES bounty_submissions(id),
  solver_id UUID NOT NULL REFERENCES profiles(id),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  reward_sats BIGINT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Crowdfunding

```sql
-- Crowdfunding campaigns
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
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'cancelled', 'ended'
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations to campaigns
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
```

### Products (Orukka Rings)

```sql
-- Orukka ring orders
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
```

### Reviews & Trust

```sql
-- Reviews and ratings
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  related_type VARCHAR(50) NOT NULL, -- 'marketplace_order', 'service_contract', 'bounty'
  related_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reviewer_id, reviewee_id, related_type, related_id)
);

-- Reputation scores (computed)
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
```

### Disputes

```sql
-- Disputes
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_type VARCHAR(50) NOT NULL, -- 'marketplace_order', 'service_contract', 'bounty'
  related_id UUID NOT NULL,
  initiator_id UUID NOT NULL REFERENCES profiles(id),
  respondent_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'under_review', 'resolved', 'closed'
  resolution_type VARCHAR(50), -- 'refund', 'release', 'split', 'dismissed'
  resolution_amount_sats BIGINT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute messages/evidence
CREATE TABLE dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT,
  attachments TEXT[],
  is_admin_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute resolutions
CREATE TABLE dispute_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE UNIQUE,
  resolved_by UUID NOT NULL REFERENCES profiles(id),
  resolution_notes TEXT,
  transaction_id UUID REFERENCES transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Admin & Moderation

```sql
-- Admin actions log
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

-- Moderation logs
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES profiles(id),
  content_type VARCHAR(50) NOT NULL, -- 'listing', 'review', 'comment', 'profile'
  content_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'approved', 'rejected', 'flagged', 'removed'
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_verified ON profiles(is_verified_villager);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_marketplace_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_active ON marketplace_listings(is_active);
CREATE INDEX idx_marketplace_orders_buyer ON marketplace_orders(buyer_id);
CREATE INDEX idx_marketplace_orders_seller ON marketplace_orders(seller_id);
CREATE INDEX idx_service_listings_provider ON service_listings(provider_id);
CREATE INDEX idx_service_contracts_buyer ON service_contracts(buyer_id);
CREATE INDEX idx_bounties_creator ON bounties(creator_id);
CREATE INDEX idx_bounties_status ON bounties(status);
CREATE INDEX idx_campaigns_creator ON campaigns(creator_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_disputes_status ON disputes(status);
```

### Triggers & Functions

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate reputation score
CREATE OR REPLACE FUNCTION calculate_reputation_score(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    avg_rating DECIMAL;
    total_reviews_count INTEGER;
BEGIN
    SELECT AVG(rating), COUNT(*) INTO avg_rating, total_reviews_count
    FROM reviews
    WHERE reviewee_id = user_uuid;
    
    RETURN COALESCE(avg_rating, 0.00);
END;
$$ LANGUAGE plpgsql;
```

## 🔌 API Documentation

[API documentation details to be added]

### Key Endpoints

#### Authentication
- User registration (Google, email, phone)
- User login and session management
- Password reset
- Phone number verification

#### User Management
- Profile creation and management
- Verified Villager verification (Verriff integration)
- KYC submission and status

#### Payments
- Lightning payment processing
- Platform fee deduction (2.5% commission) from all transactions
- Strike address payment for verification fees
- Transaction commission calculation and tracking
- Wallet withdrawals

#### Marketplace & Services
- Marketplace operations (listings, orders, escrow)
- Service management (milestones, deliverables)
- Bounty creation and completion

#### Products
- Orukka Payment Ring orders
- Orukka Business Ring orders

#### Utilities
- Currency conversion (via Strike API)
- Wallet integrations

## 🤝 Contributing

We welcome contributions from the Bitcoin community! Please see our contributing guidelines for more information.

## 📄 License

[License information to be added]

## 📞 Contact

**BitcoinVillageX is owned by Coceca Ltd.**

For inquiries, please contact us through the app or visit our website.

## 🙏 Acknowledgments

**Powered by:**

- [Orukka](https://www.orukka.com)
- [Orukka Business](https://www.orukkabusiness.com)
- [Orukka P2P](https://www.orukkaP2P.com)
- [Monesave](https://www.monesave.com)
- [Strike](https://www.strike.me)

## 📊 Project Status

### ✅ Completed

- [x] Project structure and configuration
- [x] Database schema design and migrations
- [x] Supabase setup and configuration
- [x] Frontend React/TypeScript setup
- [x] Authentication UI (Google, Email)
- [x] Basic page structure and routing
- [x] State management (Zustand)
- [x] Payment model design (Bitcoin-only, 2.5% platform fee)
- [x] Documentation

### ⏭️ In Progress / TODO

- [ ] Backend API setup (Express/TypeScript)
- [ ] Authentication implementation (Supabase integration)
- [ ] User profile management
- [ ] Wallet integration
- [ ] Lightning payment processing
- [ ] Marketplace listings and orders
- [ ] Service listings and milestone payments
- [ ] Bounty system
- [ ] Crowdfunding campaigns
- [x] Verriff verification integration
- [x] Strike payment for verification (USD 10.00)
- [ ] Platform fee deduction system (2.5%)
- [ ] Dispute resolution system
- [ ] Admin panel and moderation tools
- [x] Village Council system (voting, rewards, crowdfunding assistance)
- [ ] Orukka ring ordering

### 📝 Notes

- Frontend is ready for UI testing (see `frontend/README.md`)
- Database migrations are ready to run
- Payment model is Bitcoin-only with automatic fee deduction
- All Stripe dependencies have been removed

---

> **Ready to Change Your Life with Bitcoin?**  
> Step into a world where you earn, spend, donate, support, and grow using **Bitcoin only** — a money system built for freedom, dignity, and global opportunity.

**Join the Village — Start Living on Bitcoin Today** 🧡
