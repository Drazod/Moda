# Race Condition Prevention - Test Documentation

## Overview
This project implements **transaction-level locking** to prevent race conditions during concurrent payment processing, specifically when multiple users attempt to purchase the same last item simultaneously.

## Implementation

### Location
- **Controller**: `src/controllers/vnpay.controller.ts`
- **Function**: `processPaymentTransaction()`
- **Cart Controller**: `src/controllers/cart.controller.ts` (stock validation in `placeOrder`)

### Key Features

1. **Pre-Payment Stock Validation** (`createPayment`)
   - Checks stock availability BEFORE creating VNPay payment URL
   - Returns clear error messages if stock is insufficient
   - Prevents unnecessary payment processing

2. **Serializable Transaction with Atomic Updates** (`handleReturn`)
   - Uses Prisma's `$transaction` with `Serializable` isolation level
   - Implements double-check pattern: validates stock at transaction start AND during update
   - Atomic decrement with condition: `quantity: { gte: item.quantity }`
   - Throws specific errors for stock depletion vs other issues

3. **Race Condition Protection**
   ```typescript
   await prisma.$transaction(async (tx) => {
     // 1. Lock and verify stock
     // 2. Create transaction record
     // 3. Decrement stock atomically
     // 4. Create shipping & transaction details
     // 5. Update cart state
   }, {
     isolationLevel: 'Serializable',
     maxWait: 5000,
     timeout: 10000
   });
   ```

## Testing

### Available Tests

#### 1. Manual Test Script (Recommended)
```powershell
npm run test:race
```

**Features:**
- ✅ Real-time console output showing transaction flow
- ✅ Simulates 2 users buying the same last item simultaneously
- ✅ Shows timing, success/failure, and stock validation
- ✅ Automatic cleanup
- ✅ Works reliably without memory issues

**Sample Output:**
```
🏁 Starting Race Condition Test...
📋 Setting up test data...
✅ Created User 1 (ID: 36)
✅ Created User 2 (ID: 37)
✅ Created Stock at branch with quantity: 1

⚡ Simulating concurrent payment processing...
  [User 1] Transaction started...
  [User 2] Transaction started...
  [User 1] Stock check: 1 available
  [User 2] Stock check: 1 available
  [User 1] Stock decremented successfully
  [User 1] ✅ Payment completed in 1698ms
  [User 2] ❌ Payment failed: Transaction failed due to write conflict (1379ms)

📊 TEST RESULTS
✅ User 1: SUCCESS (1698ms)
❌ User 2: FAILED - Transaction failed due to write conflict (1379ms)

🧪 ASSERTIONS
- Only 1 payment succeeded: ✅ PASS
- Only 1 payment failed: ✅ PASS
- Final stock is 0: ✅ PASS
- Only 1 transaction created: ✅ PASS

✅ ALL TESTS PASSED!
```

#### 2. Jest Test (Alternative)
```powershell
npm run test:race-jest -- --forceExit
```

**Note:** May experience memory issues with Jest. Use manual test for reliable results.

**Test File:** `src/test/vnpay-race-condition.test.ts`

## Test Scenarios

### Scenario 1: 2 Users, 1 Item
- **Setup**: Stock quantity = 1, 2 users with identical cart items
- **Execution**: Both users trigger payment processing simultaneously using `Promise.all()`
- **Expected Result**:
  - ✅ 1 payment succeeds
  - ❌ 1 payment fails with "Stock depleted" or "Insufficient stock" error
  - Final stock = 0 (not negative)
  - Only 1 transaction record created
  - Only 1 shipping record created
  - Only 1 cart marked as ORDERED

### Scenario 2: 3+ Users, 1 Item
- **Setup**: Stock quantity = 1, 3+ users with identical cart items
- **Execution**: All users trigger payment processing simultaneously
- **Expected Result**:
  - ✅ 1 payment succeeds
  - ❌ N-1 payments fail
  - Final stock = 0

## How It Prevents Race Conditions

### Timeline Example (2 users, 1 item)
```
Time    User A              User B
────────────────────────────────────────
0ms     START TRANSACTION   (waiting)
        🔒 LOCKS stock row
        
1ms                         START TRANSACTION
                            ⏳ WAITS for lock
                            
2ms     Check: stock >= 1? ✅
        Decrement: 1 → 0 ✅
        COMMIT & UNLOCK 🔓
        
3ms                         🔒 Gets lock
                            Check: stock >= 1? ❌
                            ROLLBACK
                            Error: "Stock depleted"
```

### Database Isolation Levels

| Database | Lock Mechanism | Behavior |
|----------|----------------|----------|
| **MySQL** | Row-level lock (SELECT FOR UPDATE) | User B waits (max 5s), then proceeds when A finishes |
| **PostgreSQL** | Serializable snapshot isolation | User B gets serialization error if conflict detected |
| **SQLite** | Database-level lock | Only one write transaction at a time |

All databases **guarantee no overselling** with the `Serializable` isolation level.

## Error Handling

### Stock-Related Errors
```typescript
if (err.message.includes('Insufficient stock')) {
  return res.redirect(`/payment-error?message=OutOfStock&details=${encodeURIComponent(err.message)}`);
}
if (err.message.includes('Stock depleted')) {
  return res.redirect(`/payment-error?message=StockDepleted&details=${encodeURIComponent(err.message)}`);
}
```

### Frontend Error Handling
When a user's payment fails due to stock depletion:
1. User is redirected to error page with specific message
2. Frontend should offer alternative products or notify about refund
3. VNPay payment was already processed → consider automatic refund API

## Production Considerations

### Performance
- Transaction timeout: 10 seconds
- Max wait for lock acquisition: 5 seconds
- These settings balance between user experience and system stability

### Refunds
For users who paid but couldn't complete the order due to stock depletion:
```typescript
// Option 1: Automatic refund
if (err.message.includes('Stock depleted')) {
  await refundVNPayTransaction(vnp_Params['vnp_TransactionNo']);
  return res.redirect('/payment-error?message=OutOfStock&refund=processing');
}

// Option 2: Manual refund notification
await prisma.refundRequest.create({
  data: {
    userId, transactionNo, amount,
    reason: 'Stock depleted during checkout'
  }
});
```

### Monitoring
Key metrics to monitor:
- Failed transactions due to stock depletion (indicates high demand)
- Average transaction lock wait time
- Transaction timeout/deadlock frequency

## Files Modified

1. `src/controllers/vnpay.controller.ts`
   - Added `processPaymentTransaction()` exported function
   - Implemented serializable transaction isolation
   - Added stock validation before payment

2. `src/controllers/cart.controller.ts`
   - Added stock validation in `placeOrder()`

3. `src/test/race-condition-manual.ts`
   - Standalone test script for race condition simulation

4. `src/test/vnpay-race-condition.test.ts`
   - Jest test suite (alternative to manual script)

5. `package.json`
   - Added `test:race` script
   - Added `test:race-jest` script

## Running Tests

### Quick Test
```powershell
npm run test:race
```

### With Detailed Output
```powershell
npx ts-node src/test/race-condition-manual.ts
```

### Expected Test Duration
- Setup: ~500ms
- Concurrent execution: ~2000ms
- Cleanup: ~500ms
- **Total: ~3 seconds**

## Success Criteria

✅ **Test passes when:**
- Exactly 1 payment succeeds
- Exactly N-1 payments fail (where N = number of concurrent users)
- Final stock quantity = 0 (never negative)
- Only 1 database transaction created
- Only 1 shipping record created
- Only 1 cart marked as ORDERED

## References

- [Prisma Transactions Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Database Isolation Levels](https://en.wikipedia.org/wiki/Isolation_(database_systems))
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis)

---

**Last Updated:** December 9, 2025
**Status:** ✅ All tests passing
