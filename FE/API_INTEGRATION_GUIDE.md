# API Integration Guide - Cart with Fulfillment

## Updated API Endpoint

### POST /cart/item

**Purpose**: Add item to cart with fulfillment information

**Request Body**:
```json
{
  "cakeId": 5,
  "sizeId": 10,
  "quantity": 2,
  "fulfillmentMethod": "ship",
  "sourceBranchId": 1,
  "allocationNote": "Ships from warehouse"
}
```

**Field Descriptions**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cakeId` | number | Yes | Product ID (ClothesId) |
| `sizeId` | number | Yes | Selected size ID |
| `quantity` | number | Yes | Quantity to add |
| `fulfillmentMethod` | string | No | "ship" or "pickup" |
| `sourceBranchId` | number | No | Primary branch ID for fulfillment |
| `allocationNote` | string | No | Human-readable allocation details |

---

## Frontend Changes

### 1. CartContext Updated

**File**: `src/context/CartContext.jsx`

**Changes**:
- ✅ Updated `mapCartItems()` to include fulfillment fields
- ✅ Modified sync endpoint from `/cart/add` to `/cart/item`
- ✅ Added fulfillment fields to API payload
- ✅ Updated `addToCart()` to accept and store fulfillment data

**New Cart Item Structure**:
```javascript
{
  id: 5,                              // Product ID
  cartId: 123,                        // Cart ID
  cartItemId: 456,                    // Cart item ID
  name: "Classic T-Shirt",
  price: 299000,
  qty: 2,
  image: "https://...",
  sizeId: 10,
  label: "2XL",
  selectedColor: "Blue",
  selectedSize: "2XL",
  // New fields ↓
  fulfillmentMethod: "ship",          // or "pickup" or null
  sourceBranchId: 1,                  // Primary branch ID
  allocationNote: "Ships from warehouse" // Details for display
}
```

### 2. Product Page Updated

**File**: `src/layouts/productPage.jsx`

**Changes**:
- ✅ Converts complex fulfillment data to API format
- ✅ Extracts primary source branch ID
- ✅ Generates allocation note from fulfillment details

**Transformation Logic**:

**Ship to Home**:
```javascript
// Input (from FulfillmentOptions)
{
  method: "ship",
  allocation: {
    items: [
      { branchId: 1, location: "Online Warehouse", quantity: 4 },
      { branchId: 2, location: "Saigon Q7", quantity: 3 }
    ]
  }
}

// Output (to API)
{
  fulfillment: {
    method: "ship",
    sourceBranchId: 1,                              // First source
    allocationNote: "4 from Online Warehouse, 3 from Saigon Q7"
  }
}
```

**Pick up at Store**:
```javascript
// Input (from FulfillmentOptions)
{
  method: "pickup",
  store: { branchId: 2, name: "Saigon Q7" },
  option: { 
    id: "split", 
    label: "Pick up 3 today + ship 4 to home" 
  }
}

// Output (to API)
{
  fulfillment: {
    method: "pickup",
    sourceBranchId: 2,                              // Store branch ID
    allocationNote: "Pick up 3 today + ship 4 to home"
  }
}
```

### 3. FulfillmentOptions Updated

**File**: `src/components/FulfillmentOptions.jsx`

**Changes**:
- ✅ Added `branchId` to allocation items
- ✅ Added `branchId` to store object in pickup options

**Updated Allocation Structure**:
```javascript
// Ship allocation now includes branchId
{
  items: [
    {
      source: 'warehouse',
      branchId: 1,              // ← NEW
      branchCode: 'ONLINE-WH',
      location: 'Online Warehouse',
      quantity: 4,
      shipmentNote: 'Ships from warehouse'
    }
  ]
}

// Pickup store now includes branchId
{
  store: {
    branchId: 2,                // ← NEW
    name: 'Saigon District 7',
    code: 'HCM-Q7',
    address: '...',
    phone: '...'
  }
}
```

---

## API Request Examples

### Example 1: Ship to Home (Single Source)
```json
POST /cart/item
{
  "cakeId": 123,
  "sizeId": 456,
  "quantity": 5,
  "fulfillmentMethod": "ship",
  "sourceBranchId": 1,
  "allocationNote": "5 from Online Warehouse"
}
```

### Example 2: Ship to Home (Split Shipment)
```json
POST /cart/item
{
  "cakeId": 123,
  "sizeId": 456,
  "quantity": 7,
  "fulfillmentMethod": "ship",
  "sourceBranchId": 1,
  "allocationNote": "4 from Online Warehouse, 3 from Saigon Q7"
}
```

### Example 3: Pick up at Store
```json
POST /cart/item
{
  "cakeId": 123,
  "sizeId": 456,
  "quantity": 3,
  "fulfillmentMethod": "pickup",
  "sourceBranchId": 2,
  "allocationNote": "Pick up 3 today"
}
```

### Example 4: Pick up - Split Option
```json
POST /cart/item
{
  "cakeId": 123,
  "sizeId": 456,
  "quantity": 7,
  "fulfillmentMethod": "pickup",
  "sourceBranchId": 2,
  "allocationNote": "Pick up 3 today + ship 4 to home"
}
```

### Example 5: Quick Add (Default)
```json
POST /cart/item
{
  "cakeId": 123,
  "sizeId": 456,
  "quantity": 2,
  "fulfillmentMethod": "ship"
  // No sourceBranchId or allocationNote
}
```

---

## Backend Requirements

### Database Schema

**CartItem Table Updates** (suggested):
```sql
ALTER TABLE CartItems ADD COLUMN fulfillmentMethod VARCHAR(50);
ALTER TABLE CartItems ADD COLUMN sourceBranchId INT;
ALTER TABLE CartItems ADD COLUMN allocationNote TEXT;

-- Optional: Foreign key constraint
ALTER TABLE CartItems 
  ADD CONSTRAINT fk_source_branch 
  FOREIGN KEY (sourceBranchId) REFERENCES Branches(id);
```

### API Response Format

**GET /cart/view** should return:
```json
{
  "cartItems": [
    {
      "id": 456,
      "cartId": 123,
      "ClothesId": 5,
      "quantity": 2,
      "sizeId": 10,
      "selectedColor": "Blue",
      "selectedSize": "2XL",
      "fulfillmentMethod": "ship",
      "sourceBranchId": 1,
      "allocationNote": "Ships from warehouse",
      "Clothes": {
        "name": "Classic T-Shirt",
        "price": 299000,
        "mainImg": { "url": "https://..." }
      },
      "Size": {
        "label": "2XL"
      }
    }
  ]
}
```

### Business Logic (Backend)

**On Cart Item Add**:
1. Accept optional `fulfillmentMethod`, `sourceBranchId`, `allocationNote`
2. Validate `sourceBranchId` exists in Branches table (if provided)
3. Store fulfillment data with cart item
4. Return updated cart

**On Checkout**:
1. Read fulfillment data for each cart item
2. Create orders with proper source allocation
3. If `allocationNote` contains multiple sources, create multiple order line items
4. Reserve inventory at source branches

**Inventory Validation**:
```javascript
// Example validation logic
if (fulfillmentMethod === 'ship') {
  // Verify sourceBranchId has enough stock
  const branch = await Branch.findByPk(sourceBranchId);
  const stock = await getStock(cakeId, sizeId, sourceBranchId);
  
  if (stock < quantity) {
    return res.status(400).json({ 
      error: 'Insufficient stock at source branch' 
    });
  }
}
```

---

## Migration Strategy

### Phase 1: Backward Compatibility (Current)
- ✅ Accept fulfillment fields as **optional**
- ✅ Existing carts without fulfillment data still work
- ✅ New carts include fulfillment metadata

### Phase 2: Enhanced Checkout
- Use fulfillment data to create orders
- Show fulfillment details in order confirmation
- Generate picking lists by source branch

### Phase 3: Advanced Features
- Inventory reservation during cart session
- Real-time stock updates
- Automated warehouse transfer orders
- Store fulfillment capacity limits

---

## Testing Checklist

### Frontend Tests
- [ ] Cart sync sends correct API payload
- [ ] Fulfillment data persists across page refreshes
- [ ] Multiple cart items with different fulfillment methods
- [ ] Update quantity preserves fulfillment data
- [ ] Remove item works correctly
- [ ] Quick add sends minimal payload

### Backend Tests
- [ ] POST /cart/item accepts all fields
- [ ] GET /cart/view returns fulfillment data
- [ ] Null/undefined fulfillment fields handled
- [ ] Invalid sourceBranchId rejected
- [ ] Database constraints enforced
- [ ] Concurrent cart updates handled

### Integration Tests
- [ ] Full checkout flow with fulfillment
- [ ] Split shipment order creation
- [ ] Pickup order creation
- [ ] Inventory reservation
- [ ] Order confirmation email includes fulfillment details

---

## Error Handling

### Frontend
```javascript
// CartContext already has try/catch, but you can add specific handling:
try {
  await axiosInstance.post("/cart/item", payload);
} catch (error) {
  if (error.response?.status === 400) {
    toast.error('Insufficient stock at selected location');
  } else {
    toast.error('Failed to add to cart');
  }
}
```

### Backend
```javascript
// Suggested error responses
if (!sourceBranchId) {
  return res.status(400).json({
    error: 'sourceBranchId required when fulfillmentMethod is provided'
  });
}

if (fulfillmentMethod && !['ship', 'pickup'].includes(fulfillmentMethod)) {
  return res.status(400).json({
    error: 'fulfillmentMethod must be "ship" or "pickup"'
  });
}
```

---

## Monitoring & Analytics

### Metrics to Track
1. **Fulfillment Method Distribution**
   - % Ship to Home
   - % Pick up at Store
   - % Quick Add (default)

2. **Split Shipment Rate**
   - How often orders need multiple sources
   - Average sources per order

3. **Source Branch Utilization**
   - Which branches fulfill most orders
   - Store vs warehouse fulfillment ratio

4. **Cart Abandonment by Fulfillment**
   - Correlation between fulfillment complexity and abandonment
   - A/B test impact of fulfillment options

### Database Queries for Analytics
```sql
-- Fulfillment method breakdown
SELECT 
  fulfillmentMethod,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM CartItems
WHERE createdAt > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY fulfillmentMethod;

-- Top fulfillment branches
SELECT 
  b.branchName,
  COUNT(*) as orders_fulfilled,
  SUM(ci.quantity) as items_fulfilled
FROM CartItems ci
JOIN Branches b ON ci.sourceBranchId = b.id
WHERE ci.createdAt > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY b.branchName
ORDER BY orders_fulfilled DESC
LIMIT 10;
```

---

## Troubleshooting

### Issue: Fulfillment data not saving
**Check**:
1. Backend accepts fulfillment fields (check API logs)
2. Database columns exist
3. CartContext sync logic runs (check console logs)

### Issue: Wrong branch ID sent
**Check**:
1. FulfillmentOptions includes `branchId` in allocation
2. productPage correctly extracts `branchId` from first item
3. Backend response includes `branchId` for each branch

### Issue: Allocation note too long
**Solution**: Truncate or store detailed allocation in separate table
```javascript
// Frontend truncation
const maxLength = 255;
if (allocationNote.length > maxLength) {
  allocationNote = allocationNote.substring(0, maxLength - 3) + '...';
}
```

---

## Next Steps

1. **Backend Implementation**
   - [ ] Update CartItem model with new fields
   - [ ] Modify `/cart/item` endpoint to accept fulfillment data
   - [ ] Update `/cart/view` to return fulfillment data
   - [ ] Add validation for sourceBranchId

2. **Testing**
   - [ ] Test with Postman/Insomnia
   - [ ] Verify data persistence
   - [ ] Test edge cases

3. **Deployment**
   - [ ] Run database migration
   - [ ] Deploy backend changes
   - [ ] Deploy frontend changes (already complete)
   - [ ] Monitor error logs

4. **Documentation**
   - [ ] Update API documentation
   - [ ] Add fulfillment flow to user guide
   - [ ] Create admin documentation for order processing

---

**Status**: ✅ Frontend Complete, Backend Integration Pending  
**Last Updated**: November 14, 2025  
**Version**: 2.0.0
