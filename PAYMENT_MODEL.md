# Payment Model - BitcoinVillageX

## Overview

BitcoinVillageX uses a **Bitcoin-only payment model** with automatic platform fee deduction. All payments are processed through the Bitcoin Lightning Network via **Strike API**. Users create invoices from the app, and we use Strike API to generate Lightning invoices for payment.

## Platform Fee System

- **Fee Rate:** 2.5% on all transactions
- **Deduction Method:** Automatically deducted before payments are made
- **Applies To:**
  - Marketplace orders
  - Service contracts
  - Bounty awards
  - Donations to campaigns
  - Any payment made through the platform

### How It Works

1. User initiates a payment (e.g., buying a product, hiring a service)
2. Platform calculates 2.5% commission
3. Commission is deducted from the payment amount
4. Remaining amount (97.5%) goes to the recipient
5. Commission is tracked in the `transactions` table with `transaction_type = 'commission'`

## Verification Payments

### Verified Villager Status

- **Cost:** $10 USD (paid in Bitcoin)
- **Payment Method:** Direct payment to Strike address
- **Strike Address:** `orukka@strike.me`
- **Process:**
  1. User requests verification
  2. System generates Lightning invoice for $10 USD equivalent in BTC
  3. User pays directly to `orukka@strike.me` via Strike
  4. Payment is verified
  5. User completes Verriff identity verification
  6. Status updated to "Verified Villager"

### Database Schema

The `verifications` table tracks:
- `strike_payment_address` - Strike address for payment (default: orukka@strike.me)
- `payment_amount_usd` - Amount in USD (default: 10.00)
- `payment_amount_sats` - Amount in satoshis
- `lightning_invoice` - Lightning invoice if generated
- `lightning_payment_hash` - Payment hash for verification
- `payment_status` - Status of payment (pending, completed, failed)

## Orukka Ring Orders

- **Payment Method:** Bitcoin Lightning Network
- **No Stripe:** All ring orders are paid via Lightning
- **Process:**
  1. User selects ring type (Payment Ring or Business Ring)
  2. System calculates price in BTC/sats
  3. User pays via Lightning invoice
  4. Order is processed and shipped

## Invoice Creation Flow

### How Invoices Work

1. **User creates invoice from app:**
   - User specifies amount in sats
   - App calls backend API to create invoice

2. **Backend creates invoice via Strike API:**
   - Backend calls Strike API to create invoice for receiver (`orukka@strike.me`)
   - Strike API generates Lightning invoice (lnbc...)
   - Invoice is stored in database with Strike invoice ID

3. **User pays invoice:**
   - User receives Lightning invoice (lnbc...)
   - User pays using their Lightning wallet (Strike, Orukka, etc.)
   - System polls Strike API to check payment status

4. **Payment confirmed:**
   - When Strike API reports invoice as PAID
   - Funds are added to user's wallet balance
   - Transaction is marked as completed

## Transaction Flow

### Example: Marketplace Purchase

1. **Buyer places order:**
   - Product price: 100,000 sats
   - Platform fee (2.5%): 2,500 sats
   - Seller receives: 97,500 sats

2. **Payment processing:**
   - Buyer creates invoice for 100,000 sats via app
   - Backend creates Strike invoice and returns Lightning invoice
   - Buyer pays Lightning invoice using their wallet
   - Payment confirmed via Strike API
   - Funds enter escrow

3. **Escrow release:**
   - After delivery confirmation, escrow releases funds
   - Seller receives 97,500 sats
   - Platform receives 2,500 sats (commission)

## Benefits

✅ **Bitcoin-only** - No fiat intermediaries
✅ **Automatic fee calculation** - No manual processing needed
✅ **Transparent** - All fees visible in transaction history
✅ **Low fees** - 2.5% is competitive with traditional platforms
✅ **Instant settlement** - Lightning Network enables instant payments

## Implementation Notes

- Platform fees are calculated using the `calculateCommission()` function in `shared/src/utils/index.ts`
- All transactions are recorded in the `transactions` table
- Commission transactions are linked to the original payment via `related_id`
- Wallet balances are updated automatically via database triggers

