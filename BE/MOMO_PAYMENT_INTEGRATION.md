# MoMo Payment Integration

## Overview

MoMo (Mobile Money) payment integration for the e-commerce platform, supporting wallet-based payments with stock validation and race condition protection.

## Configuration

**File:** `src/controllers/momo.controller.ts`

```typescript
const MoMoConfig = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  apiUrl: 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: 'http://localhost:4000/momo/payment-return',
  ipnUrl: 'http://localhost:4000/momo/payment-notify',
};
```

**Note:** These are test credentials. Update with production credentials before going live.

## API Endpoints

### 1. Create Payment
**POST** `/momo/create-payment`

**Authentication:** Required

**Request Body:**
```json
{
  "orderId": 123,
  "amount": 50000,
  "orderType": "clothing",
  "address": "123 Main St, District 1, HCMC",
  "couponCode": "SALE2024",
  "pointsUsed": 100
}
```

**Response (Success):**
```json
{
  "paymentUrl": "https://test-payment.momo.vn/...",
  "requestId": "MOMO1733835600000"
}
```

**Response (Error):**
```json
{
  "message": "Insufficient stock for item. Total available: 5, Requested: 10",
  "clothesId": 456,
  "sizeId": 789
}
```

### 2. Payment Return (User Redirect)
**GET** `/momo/payment-return`

**Authentication:** Not required (MoMo callback)

**Query Parameters:**
- `partnerCode`: "MOMO"
- `orderId`: Order/Cart ID
- `requestId`: Unique request ID
- `amount`: Payment amount
- `resultCode`: 0 = success, other = error
- `transId`: MoMo transaction ID
- `signature`: HMAC-SHA256 signature
- `message`: Result message
- etc.

**Redirects:**
- Success: `http://localhost:5173/payment-success?orderId=123&pointsUsed=100`
- Failed: `http://localhost:5173/payment-failed?orderId=123&errorCode=1006`
- Error: `http://localhost:5173/payment-error?message=StockDepleted`

### 3. Payment Notify (IPN Webhook)
**POST** `/momo/payment-notify`

**Authentication:** Not required (MoMo server-to-server callback)

**Request Body:** Same as payment return

**Response:** `204 No Content`

## Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Pay with MoMo" → Frontend                       │
│    POST /momo/create-payment                                    │
│    ✓ Validate stock across all branches                        │
│    ✓ Create signature (HMAC-SHA256)                            │
│    ✓ Send request to MoMo API                                   │
│    ✓ Return payUrl to frontend                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. User redirected to MoMo app/website                          │
│    → User authenticates with MoMo                               │
│    → User confirms payment                                      │
│    → MoMo processes transaction                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. MoMo sends IPN (webhook) → /momo/payment-notify             │
│    → Verify signature                                           │
│    → Log payment result                                         │
│    → Return 204 No Content                                      │
│    (Asynchronous, more reliable)                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. User redirected back → /momo/payment-return                 │
│                                                                  │
│    Success (resultCode = 0):                                    │
│    ✓ Verify signature                                           │
│    ✓ Start Serializable transaction                             │
│    ✓ Check stock across branches                                │
│    ✓ Decrement stock atomically                                 │
│    ✓ Create transaction record                                  │
│    ✓ Create shipping record                                     │
│    ✓ Update cart state to ORDERED                               │
│    ✓ Process coupon & points                                    │
│    ✓ Redirect to success page                                   │
│                                                                  │
│    Failure (resultCode != 0):                                   │
│    ✓ Redirect to failure page                                   │
│                                                                  │
│    Stock Depleted (after payment):                              │
│    ❌ User already paid but stock unavailable                   │
│    ⚠️ Manual refund required (contact MoMo support)             │
└─────────────────────────────────────────────────────────────────┘
```

## Signature Generation

MoMo uses **HMAC-SHA256** for signature verification.

### Payment Request Signature

```typescript
const rawSignature = 
  `accessKey=${accessKey}` +
  `&amount=${amount}` +
  `&extraData=${extraData}` +
  `&ipnUrl=${ipnUrl}` +
  `&orderId=${orderId}` +
  `&orderInfo=${orderInfo}` +
  `&partnerCode=${partnerCode}` +
  `&redirectUrl=${redirectUrl}` +
  `&requestId=${requestId}` +
  `&requestType=${requestType}`;

const signature = crypto.createHmac('sha256', secretKey)
  .update(rawSignature)
  .digest('hex');
```

### Payment Return/IPN Signature

```typescript
const rawSignature = 
  `accessKey=${accessKey}` +
  `&amount=${amount}` +
  `&extraData=${extraData}` +
  `&message=${message}` +
  `&orderId=${orderId}` +
  `&orderInfo=${orderInfo}` +
  `&orderType=${orderType}` +
  `&partnerCode=${partnerCode}` +
  `&payType=${payType}` +
  `&requestId=${requestId}` +
  `&responseTime=${responseTime}` +
  `&resultCode=${resultCode}` +
  `&transId=${transId}`;

const signature = crypto.createHmac('sha256', secretKey)
  .update(rawSignature)
  .digest('hex');
```

**Important:** Parameters must be in exact alphabetical order!

## Stock Management

### Pre-Payment Validation

Before creating payment URL:
```typescript
// Check total stock across ALL branches
const totalAvailable = item.Size.stocks.reduce((sum, stock) => 
  sum + stock.quantity, 0
);

if (totalAvailable < item.quantity) {
  // Reject payment request
  return res.status(400).json({ message: "Insufficient stock" });
}
```

### Post-Payment Stock Allocation

After successful payment:
```typescript
// Allocate stock from multiple branches
const availableStocks = item.Size.stocks
  .filter(s => s.quantity > 0)
  .sort((a, b) => b.quantity - a.quantity); // Prefer branches with more stock

let remaining = item.quantity;

for (const stock of availableStocks) {
  const toDecrement = Math.min(stock.quantity, remaining);
  
  // Atomic decrement with Serializable transaction
  await tx.stock.updateMany({
    where: {
      branchId: stock.branchId,
      sizeId: item.sizeId,
      quantity: { gte: toDecrement }
    },
    data: {
      quantity: { decrement: toDecrement }
    }
  });
  
  remaining -= toDecrement;
}
```

## Race Condition Protection

### Serializable Transaction Isolation

```typescript
await prisma.$transaction(async (tx) => {
  // All stock checks and updates happen atomically
  // No other transaction can interfere
}, {
  isolationLevel: 'Serializable',
  maxWait: 5000,
  timeout: 10000
});
```

### Atomic Updates with Condition Checks

```typescript
const updatedStock = await tx.stock.updateMany({
  where: {
    branchId: branchId,
    sizeId: sizeId,
    quantity: { gte: toDecrement } // ← Only update if sufficient stock
  },
  data: {
    quantity: { decrement: toDecrement }
  }
});

if (updatedStock.count === 0) {
  throw new Error('Stock depleted'); // Another transaction took the stock
}
```

## Error Handling

### Stock Depletion After Payment

**Problem:** User paid via MoMo but stock was depleted by concurrent transaction.

**Current Solution:** Manual refund required
```typescript
if (err.message.includes('Stock depleted')) {
  console.error('Stock depleted after payment - manual refund required');
  return res.redirect('/payment-error?message=StockDepleted&refund=contact-support');
}
```

**Future Enhancement:** Implement MoMo refund API (if available)

### Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Success | Process order |
| 9000 | Transaction confirmed | Process order |
| 1006 | User canceled | Show canceled message |
| 1001 | Transaction failed | Show error message |
| 99 | Unknown error | Contact support |

## Testing

### Test Flow

1. **Create Test Order:**
   ```bash
   POST http://localhost:4000/momo/create-payment
   {
     "orderId": 1,
     "amount": 50000,
     "address": "Test Address"
   }
   ```

2. **Get Payment URL:**
   ```json
   {
     "paymentUrl": "https://test-payment.momo.vn/..."
   }
   ```

3. **Test Payment:**
   - Open `paymentUrl` in browser
   - Use MoMo test account credentials
   - Complete payment

4. **Verify Callbacks:**
   - Check IPN webhook: `/momo/payment-notify`
   - Check user redirect: `/momo/payment-return`

### Test Credentials

**MoMo Test Environment:**
- URL: `https://test-payment.momo.vn`
- Test phone: Provided by MoMo
- Test OTP: Provided by MoMo

**Note:** Request test credentials from MoMo support.

### Race Condition Testing

```bash
# Simulate 2 concurrent payments for same item (stock = 1)
# Terminal 1:
curl -X POST http://localhost:4000/momo/create-payment \
  -H "Authorization: Bearer TOKEN1" \
  -d '{"orderId": 1, "amount": 50000}'

# Terminal 2 (immediately after):
curl -X POST http://localhost:4000/momo/create-payment \
  -H "Authorization: Bearer TOKEN2" \
  -d '{"orderId": 2, "amount": 50000}'

# Expected: Both can create payment URLs (stock check passes)
# Both complete payment on MoMo
# First to return: Order created, stock decremented
# Second to return: Error "Stock depleted", needs manual refund
```

## Production Considerations

### 1. Update Configuration

```typescript
const MoMoConfig = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  apiUrl: 'https://payment.momo.vn/v2/gateway/api/create', // Production URL
  redirectUrl: process.env.MOMO_REDIRECT_URL,
  ipnUrl: process.env.MOMO_IPN_URL,
};
```

### 2. IPN Endpoint Security

- Use HTTPS for IPN endpoint
- Verify IP whitelist (MoMo server IPs)
- Always verify signature
- Return 204 quickly (< 5 seconds)

### 3. Webhook Reliability

- IPN is more reliable than user redirect
- User might close browser before redirect
- Always process payment in IPN handler
- User redirect is just for UX (showing success message)

### 4. Refund Process

**Manual Refund (Current):**
1. User reports issue
2. Admin verifies payment and stock status
3. Contact MoMo support for refund
4. Process takes 7-15 business days

**Automatic Refund (Future):**
- Implement MoMo refund API (if available)
- Similar to VNPay refund implementation

### 5. Monitoring

Track these metrics:
- Payment success rate
- Stock depletion after payment frequency
- Average payment processing time
- IPN delivery success rate
- User bounce rate (leave before completing payment)

### 6. Logging

```typescript
// Log all MoMo interactions
console.log('MoMo Payment Request:', {
  orderId,
  amount,
  requestId,
  timestamp: new Date()
});

console.log('MoMo IPN Received:', {
  orderId,
  resultCode,
  transId,
  timestamp: new Date()
});
```

## Comparison: MoMo vs VNPay

| Feature | MoMo | VNPay |
|---------|------|-------|
| Signature | HMAC-SHA256 | HMAC-SHA512 |
| Payment URL | JSON API | Query String |
| IPN Support | ✅ Yes | ✅ Yes |
| Refund API | ⚠️ Limited | ✅ Full API |
| Market Share | High (Vietnam mobile) | High (Vietnam cards) |
| Integration | Easier | More complex |
| Test Env | Good | Good |

## Troubleshooting

### Issue: Invalid Signature

**Cause:** Parameters not in correct order or encoding issues

**Fix:**
```typescript
// Ensure parameters are in EXACT alphabetical order
// Use raw values, no additional encoding
const rawSignature = 
  `accessKey=${accessKey}` + // ← Alphabetical order
  `&amount=${amount}` +
  `&extraData=${extraData}` +
  // ... etc
```

### Issue: IPN Not Received

**Cause:** Firewall, localhost not accessible, HTTPS required

**Fix:**
- Use public URL with HTTPS
- Use ngrok for local testing: `ngrok http 4000`
- Update `ipnUrl` to ngrok URL

### Issue: Payment Succeeds but Order Not Created

**Cause:** Database error, stock depleted, transaction timeout

**Fix:**
- Check server logs for errors
- Verify database connection
- Increase transaction timeout
- Implement retry logic in IPN handler

### Issue: User Paid but Stock Unavailable

**Cause:** Race condition - concurrent payments

**Fix:**
- Current: Manual refund via MoMo support
- Future: Implement automatic refund API
- Consider stock reservation system (reserve before payment)

## Next Steps

- [ ] Test with MoMo sandbox environment
- [ ] Request production credentials from MoMo
- [ ] Implement MoMo refund API (if available)
- [ ] Add webhook retry logic for failed IPN
- [ ] Implement payment status polling (fallback if IPN fails)
- [ ] Add admin dashboard for payment monitoring
- [ ] Consider stock reservation before payment
- [ ] Load testing for race conditions

## References

- [MoMo Developer Documentation](https://developers.momo.vn/#/docs/en/aiov2/)
- MoMo Test Environment: `https://test-payment.momo.vn`
- Support: Contact MoMo business team

---

**Last Updated:** December 10, 2025
