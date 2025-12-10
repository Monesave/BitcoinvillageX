# Villager Verification System

## Overview

Every Villager on BitcoinVillageX can request verification to receive a verification badge on their profile. Verification costs **USD 10.00** (paid in Bitcoin via Lightning Network) and uses **Verriff** for identity verification.

## Verification Process

### Step 1: Request Verification
1. Villager requests verification through the app
2. System creates a Veriff verification session
3. System generates a Lightning invoice for USD 10.00
4. Verification record is created with `pending` status

### Step 2: Payment
1. Villager pays the Lightning invoice (USD 10.00 equivalent in BTC)
2. System checks payment status
3. Once payment is confirmed, Villager proceeds to Veriff verification

### Step 3: Identity Verification
1. Villager is redirected to Veriff verification flow
2. Villager completes identity verification (ID document, selfie, etc.)
3. Veriff processes the verification
4. Veriff sends webhook callback when verification is complete

### Step 4: Badge Activation
1. System receives Veriff webhook callback
2. Verification status is updated to `approved`
3. Villager's profile is updated with `is_verified_villager = true`
4. Verification badge appears on Villager's profile

## API Endpoints

### Request Verification
```
POST /api/verification/request
```
- **Auth**: Required
- **Body**: None
- **Response**: Verification session URL, payment invoice

### Check Payment Status
```
GET /api/verification/payment/:paymentHash/status
```
- **Auth**: Required
- **Params**: `paymentHash` - Lightning payment hash
- **Response**: Payment status, Veriff URL (if paid)

### Get Verification Status
```
GET /api/verification/status
```
- **Auth**: Required
- **Response**: Current verification status, verified badge status

### Veriff Webhook
```
POST /api/verification/webhook
```
- **Auth**: None (uses signature verification)
- **Headers**: `X-Signature` - Webhook signature
- **Body**: Veriff webhook payload
- **Response**: Success confirmation

## Configuration

### Environment Variables

```env
# Veriff API Configuration
VERIFF_API_KEY=your_veriff_api_key
VERIFF_API_URL=https://stationapi.veriff.com/v1  # Configurable endpoint
VERIFF_CALLBACK_URL=https://yourapp.com/verification/callback
VERIFF_WEBHOOK_SECRET=your_webhook_secret

# Strike API (for payment processing)
STRIKE_API_KEY=your_strike_api_key
STRIKE_RECEIVER_HANDLE=orukka@strike.me
```

### Verification Cost
- **Amount**: USD 10.00
- **Payment Method**: Bitcoin Lightning Network
- **Conversion**: USD amount converted to sats using current BTC/USD rate
- **Recipient**: Platform (for verification processing)

## Database Schema

### Verifications Table
- `user_id` - Villager ID
- `verriff_session_id` - Veriff session identifier
- `status` - Verification status (pending, approved, rejected, expired)
- `payment_amount_usd` - USD 10.00
- `payment_amount_sats` - Amount in satoshis (calculated)
- `lightning_invoice` - Lightning invoice for payment
- `lightning_payment_hash` - Payment hash for tracking
- `payment_status` - Payment status (pending, completed, failed)
- `verification_data` - Veriff verification response data
- `verified_at` - Timestamp when verification was completed

### Profile Updates
When verification is approved:
- `is_verified_villager` → `true`
- `verification_date` → Current timestamp
- Verification badge appears on profile

## Veriff Integration

### API Endpoints Used

1. **Create Session**: `POST /v1/sessions`
   - Creates a new verification session
   - Returns session URL for Villager to complete verification

2. **Get Status**: `GET /v1/sessions/:sessionId`
   - Checks current verification status
   - Used for polling verification status

3. **Get Decision**: `GET /v1/sessions/:sessionId/decision`
   - Gets final verification decision
   - Used when verification is complete

### Webhook Events

Veriff sends webhooks for:
- `verification.created` - Verification session created
- `verification.status.changed` - Verification status updated
- `verification.decision` - Verification decision made

### Webhook Security

Webhooks are verified using HMAC-SHA256 signature:
- Signature in `X-Signature` header
- Calculated using `VERIFF_WEBHOOK_SECRET`
- Ensures webhook authenticity

## Verification Status Flow

```
pending (payment) 
  → pending (veriff) 
    → approved ✅ (badge activated)
    → rejected ❌ (no badge)
    → expired ⏱️ (can retry)
```

## Error Handling

### Common Issues

1. **Payment Failed**
   - Verification remains in `pending` status
   - Villager can retry payment
   - New invoice generated if needed

2. **Veriff API Error**
   - Verification record created
   - System will retry or allow manual retry
   - Logs error for debugging

3. **Verification Rejected**
   - Status set to `rejected`
   - Villager can request new verification (new payment required)
   - Previous payment is not refunded

## User Experience

### Villager Flow

1. **Request Verification**
   - Villager clicks "Get Verified" on profile
   - System shows USD 10.00 fee
   - Villager confirms and proceeds

2. **Make Payment**
   - Lightning invoice displayed
   - Villager pays via Lightning wallet
   - Payment confirmation shown

3. **Complete Verification**
   - Redirected to Veriff
   - Completes identity verification
   - Returns to app

4. **Verification Badge**
   - Badge appears on profile
   - Shows "Verified Villager" status
   - Visible in listings and transactions

## Notes

- Verification fee is non-refundable
- Each verification attempt requires a new payment
- Verification badge is permanent once approved
- Multiple verification attempts are allowed (with payment)
- Veriff sessions expire after a set time (typically 24 hours)

## References

- [Veriff API Documentation](https://www.veriff.com/for-developers/)
- [Veriff Technical Guides](https://devdocs.veriff.com/docs/technical-guides)
- Veriff API Base URL: `https://stationapi.veriff.com` (configurable via `VERIFF_API_URL`)

