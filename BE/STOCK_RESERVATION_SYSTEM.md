# VNPay Payment with Automatic Refund System

## Problem Statement

**Race Condition Issue:** When multiple users attempt to purchase the same item simultaneously with limited stock, the following problem can occur:

1. User A checks stock → Stock available (1 item)
2. User B checks stock → Stock available (1 item)
3. Both users proceed to payment
4. User A pays successfully → Stock decremented to 0
5. User B pays successfully → **Stock goes negative OR payment succeeds but no stock available**

**Critical Issue:** If we lock stock AFTER payment, the user has already paid money but cannot receive the order.

## Solution: Automatic Refund on Stock Depletion

Since you've reverted the reservation system, we implement automatic refunds when race conditions cause stock depletion AFTER payment.

### Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Pay" → createPayment()                          │
│    ✓ Pre-validate stock availability                            │
│    ✓ Generate VNPay payment URL                                 │
│    ✗ If stock insufficient → Reject before payment              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. User redirected to VNPay                                     │
│    → User enters payment details                                │
│    → VNPay processes payment                                    │
│    ⚠️ Race window: Stock could be depleted by other user        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. VNPay redirects back → handleReturn()                        │
│                                                                  │
│    Payment Success (responseCode = '00'):                       │
│    ├─ Try to create order with Serializable transaction         │
│    │                                                             │
│    ├─ SUCCESS CASE:                                             │
│    │  ✓ Stock available                                         │
│    │  ✓ Stock decremented atomically                            │
│    │  ✓ Transaction record created                              │
│    │  ✓ Order fulfilled                                         │
│    │                                                             │
│    └─ RACE CONDITION CASE:                                      │
│       ❌ Stock depleted by concurrent transaction               │
│       ✓ Automatic refund initiated via VNPay API                │
│       ✓ User redirected to error page with refund status        │
│       ✓ Money returned to user within 7-15 days                 │
└─────────────────────────────────────────────────────────────────┘
```

## VNPay Refund API Implementation

### Refund Request Parameters

According to VNPay API specification:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| vnp_RequestId | String[1,32] | Yes | Unique request ID (no duplicates in same day) |
| vnp_Version | String[1,8] | Yes | API version: "2.1.0" |
| vnp_Command | String[1,16] | Yes | Command: "refund" |
| vnp_TmnCode | String[8] | Yes | Merchant code |
| vnp_TransactionType | String | Yes | "02" = Full refund, "03" = Partial refund |
| vnp_TxnRef | String[1,100] | Yes | Original transaction reference (orderId) |
| vnp_Amount | Number[1,12] | Yes | Refund amount (in smallest currency unit) |
| vnp_OrderInfo | String[1,255] | Yes | Refund reason/description |
| vnp_TransactionNo | String[1,15] | Optional | VNPay transaction number |
| vnp_TransactionDate | String[14] | Yes | Original payment date (yyyyMMddHHmmss) |
| vnp_CreateBy | String[1,245] | Yes | User who initiated refund |
| vnp_CreateDate | String[14] | Yes | Refund request date (yyyyMMddHHmmss) |
| vnp_IpAddr | String[7,45] | Yes | Server IP address |
| vnp_SecureHash | String[32,256] | Yes | HMAC-SHA512 signature |

### Secure Hash Generation

```typescript
// Build data string with pipe separator
const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|` +
             `${vnp_TransactionType}|${vnp_TxnRef}|${vnp_Amount}|${vnp_TransactionNo}|` +
             `${vnp_TransactionDate}|${vnp_CreateBy}|${vnp_CreateDate}|` +
             `${vnp_IpAddr}|${vnp_OrderInfo}`;

// Generate HMAC-SHA512 hash
const hmac = crypto.createHmac('sha512', hashSecret);
const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');
```

## Code Implementation

### 1. Automatic Refund on Stock Depletion

```typescript
// In handleReturn() when stock depleted error occurs
if (err.message.includes('Stock depleted')) {
  try {
    await processRefund({
      orderId,
      amount,
      txnRef: orderId.toString(),
      transactionNo: vnp_Params['vnp_TransactionNo'],
      transactionDate: vnp_Params['vnp_PayDate'],
      reason: `Stock depleted: ${err.message}`,
      createdBy: 'System-AutoRefund'
    });
    
    return res.redirect('/payment-error?refund=processing');
  } catch (refundErr) {
    return res.redirect('/payment-error?refund=failed');
  }
}
```

### 2. Manual Refund Endpoint (Admin)

```bash
POST /vnpay/refund
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "orderId": 123,
  "txnRef": "123",
  "transactionNo": "14512345",
  "transactionDate": "20251209143000",
  "reason": "Customer request"
}
```

## Race Condition Timeline

### Scenario: 2 Users Buy Item with Stock = 1

| Time | User A | User B | Stock | Database |
|------|--------|--------|-------|----------|
| T0   | Initial state | - | 1 | Normal |
| T1   | Clicks "Pay" | - | 1 | Normal |
| T2   | Stock check OK | - | 1 | Normal |
| T3   | Redirected to VNPay | Clicks "Pay" | 1 | Normal |
| T4   | - | Stock check OK | 1 | Normal |
| T5   | Pays at VNPay ✅ | Redirected to VNPay | 1 | Normal |
| T6   | Returns → handleReturn() | - | 1 | Normal |
| T7   | Transaction START | - | 1 | LOCKED |
| T8   | Stock check OK | - | 1 | LOCKED |
| T9   | Stock decremented | - | 0 | LOCKED |
| T10  | Transaction COMMIT | - | 0 | UNLOCKED |
| T11  | Order created ✅ | Pays at VNPay ✅ | 0 | Normal |
| T12  | - | Returns → handleReturn() | 0 | Normal |
| T13  | - | Transaction START | 0 | LOCKED |
| T14  | - | ❌ Stock check FAILS (0 < 1) | 0 | LOCKED |
| T15  | - | Transaction ROLLBACK | 0 | UNLOCKED |
| T16  | - | 🔄 Refund initiated | 0 | Normal |
| T17  | - | Refund request sent to VNPay | 0 | Normal |
| T18  | - | User sees refund message | 0 | Normal |

**Result:**
- ✅ User A: Order fulfilled, stock decremented
- ❌ User B: Payment made BUT stock unavailable
- 🔄 User B: Automatic refund initiated
- 💰 User B: Money returned within 7-15 days

## Error Handling & User Experience

### Frontend Error Messages

```typescript
// Payment error page should handle these query params
const params = new URLSearchParams(window.location.search);
const message = params.get('message');
const refund = params.get('refund');

if (message === 'StockDepleted') {
  if (refund === 'processing') {
    // Show: "Sorry, the item is out of stock. We've initiated a refund. 
    //        Your money will be returned within 7-15 business days."
  } else if (refund === 'failed') {
    // Show: "Stock depleted and automatic refund failed. 
    //        Please contact customer support with order ID: XXX"
  }
}
```

### Refund Status Tracking

Since VNPay refund is asynchronous, you should:

1. **Immediate Response:** Show user that refund is being processed
2. **Email Notification:** Send confirmation email about refund
3. **Status Page:** Allow user to check refund status
4. **Admin Dashboard:** Track all refund requests and their status

## Production Considerations

### 1. VNPay Refund Response Codes

| Code | Description | Action |
|------|-------------|--------|
| 00 | Success | Refund approved, money will be returned |
| 02 | Merchant not exist | Check vnp_TmnCode |
| 03 | Invalid data | Check request parameters |
| 91 | Transaction not found | Verify vnp_TxnRef and vnp_TransactionNo |
| 93 | Invalid amount | Amount exceeds original payment |
| 94 | Duplicate request | vnp_RequestId already used today |
| 95 | Refund not allowed | Transaction too old or already refunded |
| 99 | Unknown error | Retry or contact VNPay support |

### 2. Refund Limits

- **Time Limit:** Refunds typically allowed within 90-180 days of payment
- **Amount Limit:** Cannot exceed original payment amount
- **Frequency:** Cannot refund same transaction multiple times (check before calling API)

### 3. Monitoring & Alerts

Track these metrics:

```typescript
// Metrics to monitor
- Race condition frequency (stock depleted after payment)
- Automatic refund success rate
- Refund failures requiring manual intervention
- Average time to complete refund
- Customer complaints about refunds
```

### 4. Database Logging (TODO)

Create a dedicated table to track VNPay refunds:

```sql
CREATE TABLE vnpay_refund_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  txn_ref VARCHAR(100) NOT NULL,
  transaction_no VARCHAR(15),
  request_id VARCHAR(32) NOT NULL,
  status VARCHAR(20), -- PENDING, SUCCESS, FAILED, ERROR
  reason TEXT,
  created_by VARCHAR(245),
  vnpay_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Customer Support Integration

When refund occurs:

1. Create support ticket automatically
2. Send email to customer with:
   - Apology for inconvenience
   - Refund amount and expected timeline
   - Support contact information
   - Alternative product suggestions
3. Flag order in admin dashboard for follow-up

## Testing

### Test Automatic Refund

1. **Setup:**
   ```sql
   UPDATE Stock SET quantity = 1 WHERE id = <test_item>;
   ```

2. **Execute:**
   - Open 2 browser windows (different sessions)
   - Both users add item to cart
   - Both proceed to payment simultaneously
   - Both complete payment at VNPay

3. **Expected Result:**
   - First user: Order created successfully
   - Second user: Sees "Stock depleted, refund processing" message
   - Check logs for refund API call

### Test Manual Refund

```bash
# As admin user
curl -X POST http://localhost:4000/vnpay/refund \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 123,
    "txnRef": "123",
    "transactionNo": "14512345",
    "transactionDate": "20251209143000",
    "reason": "Customer request - wrong size"
  }'
```

## API Endpoints

### 1. Create Payment
```
POST /vnpay/create-payment
Auth: Required
Body: { orderId, amount, orderType, language, bankCode, address, couponCode, pointsUsed }
```

### 2. Payment Return (Callback)
```
GET /vnpay/payment-return?vnp_*=...
Auth: Not required (VNPay callback)
```

### 3. Manual Refund
```
POST /vnpay/refund
Auth: Required (Admin only recommended)
Body: { orderId, txnRef, transactionNo, transactionDate, reason }
```

## Advantages & Disadvantages

### Advantages
- ✅ Automatic refund protects customers
- ✅ No manual intervention needed for common case
- ✅ Maintains customer trust
- ✅ Complies with payment regulations

### Disadvantages
- ❌ Refund takes 7-15 days (VNPay processing time)
- ❌ Customer still has bad experience (paid but no order)
- ❌ Refund might fail, requiring manual intervention
- ❌ Doesn't prevent race condition, only mitigates damage

## Better Alternative: Stock Reservation

For better UX, consider implementing the reservation system:
- Reserve stock BEFORE payment
- Release if payment fails/times out
- Confirm reservation on successful payment
- **Advantage:** User never pays if stock unavailable
- **See:** `STOCK_RESERVATION_SYSTEM.md` (if implemented)

## Conclusion

This implementation provides automatic refunds when race conditions cause stock depletion after payment. While not ideal (customer still pays then gets refunded), it's better than taking money without providing the order. The refund is automatic, logged, and transparent to the customer.

## Problem Statement

**Previous Issue:** Race condition during checkout where multiple users could oversell inventory.

**Critical Flaw in Previous Solution:** 
- We locked stock in `handleReturn()` (AFTER user paid)
- If stock depleted, user paid but couldn't get the order
- User loses money → Very bad UX!

## New Solution: Reserve-Before-Payment

### Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Pay" → createPayment()                          │
│    ✓ Lock stock with Serializable transaction                  │
│    ✓ Decrement stock immediately (RESERVE)                      │
│    ✓ Set cart state = PENDING                                   │
│    ✓ Generate VNPay payment URL                                 │
│    ✗ If stock insufficient → Reject before payment              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. User redirected to VNPay                                     │
│    → User enters payment details                                │
│    → VNPay processes payment                                    │
│    (Stock already reserved, no race condition possible)         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. VNPay redirects back → handleReturn()                        │
│                                                                  │
│    SUCCESS (responseCode = '00'):                               │
│    ✓ Create Transaction record                                  │
│    ✓ Create Shipping record                                     │
│    ✓ Create Transaction details                                 │
│    ✓ Set cart state = ORDERED (confirm reservation)             │
│                                                                  │
│    FAILURE (responseCode != '00'):                              │
│    ✓ Restore reserved stock (increment back)                    │
│    ✓ Reset cart state = PENDING                                 │
│    ✓ User can retry payment                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Key Implementation Details

### 1. Stock Reservation (createPayment)

```typescript
await prisma.$transaction(async (tx) => {
  // Atomic decrement with condition check
  const updatedStock = await tx.stock.updateMany({
    where: {
      branchId: branchId,
      sizeId: item.sizeId,
      quantity: { gte: item.quantity } // ← Ensures sufficient stock
    },
    data: {
      quantity: { decrement: item.quantity } // ← Reserve immediately
    }
  });
  
  if (updatedStock.count === 0) {
    throw new Error('Insufficient stock'); // ← Reject BEFORE payment
  }
}, {
  isolationLevel: 'Serializable' // ← Prevents race conditions
});
```

### 2. Stock Restoration (handleReturn - on failure)

```typescript
const restoreReservedStock = async (orderId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (cart.state !== 'PENDING') return; // Only restore PENDING carts

  await prisma.$transaction(async (tx) => {
    for (const item of cart.items) {
      // Increment stock back
      await tx.stock.updateMany({
        where: { branchId, sizeId },
        data: { quantity: { increment: item.quantity } }
      });
    }
    
    // Reset cart for retry
    await tx.cart.update({
      where: { id: orderId },
      data: { state: 'PENDING' }
    });
  });
};
```

## Race Condition Prevention

### Scenario: 2 Users Buy Item with Stock = 1

**Timeline:**

| Time | User A | User B | Stock |
|------|--------|--------|-------|
| T0   | Initial state | - | 1 |
| T1   | Clicks "Pay" → Lock acquired | - | 1 |
| T2   | Stock decremented | - | 0 |
| T3   | Cart state = PENDING | - | 0 |
| T4   | Payment URL generated | Clicks "Pay" → Wait for lock | 0 |
| T5   | Redirected to VNPay | Still waiting... | 0 |
| T6   | - | ❌ Stock check fails (0 < 1) | 0 |
| T7   | - | Error: "Insufficient stock" | 0 |
| T8   | Pays at VNPay ✅ | Cannot proceed | 0 |
| T9   | Returns to site | - | 0 |
| T10  | Transaction created | - | 0 |
| T11  | Cart state = ORDERED | - | 0 |

**Result:** ✅ Only User A can pay. User B rejected BEFORE payment.

## Cart State Lifecycle

```
PENDING
   ↓
   ↓ (User clicks Pay → Stock reserved)
   ↓
PENDING (stock reserved)
   ↓
   ├─→ Payment Success → ORDERED (stock confirmed)
   └─→ Payment Failure → PENDING (stock restored)
```

## Error Handling

### 1. Insufficient Stock (Before Payment)
- **When:** In `createPayment()` before generating payment URL
- **Response:** 400 Bad Request with stock details
- **Stock State:** Unchanged (no reservation made)
- **User Action:** Cannot proceed to payment

### 2. Payment Failed (After Payment Initiated)
- **When:** VNPay returns error code (responseCode != '00')
- **Response:** Redirect to `/payment-failed`
- **Stock State:** Restored (increment back)
- **User Action:** Can retry payment

### 3. Invalid Signature
- **When:** VNPay signature verification fails
- **Response:** Redirect to `/payment-error`
- **Stock State:** Unchanged (no restoration needed)
- **User Action:** Contact support

## Production Considerations

### 1. Payment Timeout Handling

**Problem:** User reserves stock but never completes payment
**Solution:** Implement background job to restore abandoned reservations

```typescript
// Cron job: Run every 30 minutes
const releaseExpiredReservations = async () => {
  const expiredCarts = await prisma.cart.findMany({
    where: {
      state: 'PENDING',
      updatedAt: { lt: new Date(Date.now() - 15 * 60 * 1000) } // 15 min
    }
  });

  for (const cart of expiredCarts) {
    await restoreReservedStock(cart.id);
  }
};
```

### 2. VNPay Webhook

**Current:** Relies on user returning to site
**Better:** Implement IPN (Instant Payment Notification) webhook
- VNPay calls your server directly when payment completes
- More reliable than user redirect
- Handles cases where user closes browser

### 3. Monitoring Metrics

Track these metrics:
- **Reservation Success Rate:** % of reservations that complete payment
- **Stock Restoration Rate:** % of reservations that get restored
- **Average Reservation Time:** Time between reserve and confirm
- **Concurrent Reservation Conflicts:** How often users hit "insufficient stock"

### 4. Database Indexes

Ensure indexes exist for performance:
```sql
CREATE INDEX idx_cart_state_updated 
ON Cart(state, updatedAt);

CREATE INDEX idx_stock_branch_size 
ON Stock(branchId, sizeId);
```

## Testing

### Manual Test: Race Condition

1. Set item stock = 1
2. Open 2 browser windows (different sessions)
3. Both users add item to cart
4. Both click "Pay" simultaneously
5. **Expected:** Only 1 gets payment URL, other gets error

### Automated Test

```bash
# Run race condition test
npm run test:race
```

## Advantages vs Previous Solution

| Aspect | Old (Lock After Payment) | New (Reserve Before Payment) |
|--------|-------------------------|------------------------------|
| Race Condition | ❌ Still vulnerable | ✅ Fully prevented |
| User Paid But No Stock | ❌ Possible | ✅ Impossible |
| Stock Accuracy | ❌ Can go negative | ✅ Always accurate |
| User Experience | ❌ Poor (paid but failed) | ✅ Good (fail before payment) |
| Refund Needed | ❌ Yes | ✅ No |
| Complexity | Medium | Medium |

## Conclusion

The new system **reserves stock BEFORE payment**, ensuring users never pay for unavailable items. Race conditions are prevented at the reservation stage, not at fulfillment, resulting in better UX and data integrity.
