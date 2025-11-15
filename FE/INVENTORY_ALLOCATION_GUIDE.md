# Inventory Allocation & Fulfillment Options Guide

## Overview
This system provides smart inventory allocation for e-commerce checkout, offering customers flexible fulfillment options based on real-time stock availability across distribution centers and retail stores.

## Components

### 1. FulfillmentOptions Component
**Location**: `src/components/FulfillmentOptions.jsx`

**Purpose**: Interactive UI component that calculates and displays fulfillment options based on:
- Selected product size
- Requested quantity
- Available inventory across branches
- User's fulfillment preference (Ship to Home vs Pick up at Store)

**Key Features**:
- **Real-time allocation calculation** - Dynamically calculates how orders will be fulfilled
- **Multi-source fulfillment** - Can ship from warehouse + stores simultaneously
- **Smart recommendations** - Suggests best fulfillment method based on availability
- **Split shipment handling** - Warns when items may arrive in multiple packages
- **Transfer ETA calculation** - Shows when items can be available for pickup after transfer

---

## Fulfillment Methods

### Method 1: Ship to Home
**Priority**: Warehouse first, then stores

**Allocation Logic**:
```javascript
allocateForShipping(warehouse, stores) {
  1. Allocate from ONLINE-WH (distribution center) first
  2. If shortage remains, allocate from stores with highest inventory
  3. Sort stores by quantity (descending) for optimal allocation
  4. Track total shipments and warn if split delivery
}
```

**Example Scenarios**:

**Scenario A: Full from Warehouse**
```
User wants: 5 items
Warehouse: 10 available
Result: Ship 5 from warehouse ✓
```

**Scenario B: Split Shipment**
```
User wants: 7 items
Warehouse: 4 available
Store A: 2 available
Store B: 1 available
Result: 
- Ship 4 from warehouse
- Ship 2 from Store A
- Ship 1 from Store B
Warning: "Items may arrive in 3 separate shipments"
```

**Scenario C: Insufficient Stock**
```
User wants: 10 items
Warehouse: 4 available
Store A: 3 available
Result:
- Only 7 available total
- Show error: "Only 7 available. Please reduce quantity to 7."
```

---

### Method 2: Pick up at Store
**Priority**: Selected store first, then show alternatives

**Allocation Logic**:
```javascript
allocateForPickup(store, warehouse) {
  1. Check selected store inventory
  2. Calculate shortage (if any)
  3. Generate 4 fulfillment choices:
     a) Split: Pickup available now + ship remainder
     b) Transfer: Pickup all later (after warehouse transfer)
     c) Reduce: Pickup available quantity only
     d) Ship all: Change to home delivery instead
}
```

**Example Scenarios**:

**Scenario A: Full Stock at Store**
```
User wants: 3 items
Store HCM-Q7: 5 available
Choices:
✓ Pick up 3 today (reduce quantity option also shows 5)
✓ Ship all to home instead
```

**Scenario B: Partial Stock - Split Option**
```
User wants: 5 items
Store HCM-Q7: 2 available
Warehouse: 10 available
Choices:
✓ Pick up 2 today + ship 3 to home (SPLIT)
✓ Pick up all 5 later (ETA: Fri Nov 14 - after transfer)
✓ Pick up 2 today (reduce quantity)
✓ Ship all 5 to home instead
```

**Scenario C: No Stock - Transfer Only**
```
User wants: 5 items
Store HCM-Q7: 0 available
Warehouse: 8 available
Choices:
✓ Pick up all 5 later (ETA: Fri Nov 14 - after transfer)
✓ Ship all 5 to home instead
```

**Scenario D: Insufficient Total Stock**
```
User wants: 10 items
Store HCM-Q7: 2 available
Warehouse: 3 available
Choices:
✓ Pick up 2 today + ship 3 to home (only 5 total)
✗ Transfer option disabled (can't fulfill 10)
✓ Pick up 2 today (reduce quantity)
✓ Ship 5 to home instead (but user wants 10)
Error shown: Need 5 more items
```

---

## Data Structure

### Product API Response
```json
{
  "id": 123,
  "name": "Classic T-Shirt",
  "sizes": [
    {
      "id": 456,
      "label": "2XL",
      "totalQuantity": 7,        // Total across all branches
      "totalAllocated": 7,       // Already allocated/reserved
      "available": 0,            // Available for new orders
      "branches": [
        {
          "branchId": 1,
          "branchCode": "ONLINE-WH",
          "branchName": "Online Warehouse",
          "quantity": 4,
          "isActive": true
        },
        {
          "branchId": 2,
          "branchCode": "HCM-Q7",
          "branchName": "Saigon District 7",
          "address": "123 Nguyen Van Linh, Q7, HCMC",
          "phone": "+84 28 1234 5678",
          "quantity": 3,
          "isActive": true
        }
      ]
    }
  ]
}
```

### Fulfillment Selection Output (Ship to Home)
```json
{
  "method": "ship",
  "allocation": {
    "complete": true,
    "totalAvailable": 7,
    "items": [
      {
        "source": "warehouse",
        "location": "Online Warehouse",
        "quantity": 4,
        "shipmentNote": "Ships from warehouse"
      },
      {
        "source": "store",
        "location": "Saigon District 7",
        "branchCode": "HCM-Q7",
        "quantity": 3,
        "shipmentNote": "Ships from store (may arrive separately)"
      }
    ],
    "needsTransfer": false
  },
  "totalQty": 7
}
```

### Fulfillment Selection Output (Pick up at Store - Split)
```json
{
  "method": "pickup",
  "store": {
    "name": "Saigon District 7",
    "code": "HCM-Q7",
    "address": "123 Nguyen Van Linh, Q7, HCMC",
    "phone": "+84 28 1234 5678"
  },
  "option": {
    "id": "split",
    "label": "Pick up 3 today + ship 4 to home",
    "description": "Split fulfillment: Partial pickup, remainder ships",
    "pickupQty": 3,
    "shipQty": 4,
    "available": true
  },
  "totalQty": 7
}
```

---

## Integration with Cart

### Updated addToCart Call
```javascript
// Before (simple)
addToCart(product, {
  selectedColor: "Blue",
  selectedSize: "2XL",
  sizeId: 456,
  qty: 7
});

// After (with fulfillment metadata)
addToCart(product, {
  selectedColor: "Blue",
  selectedSize: "2XL",
  sizeId: 456,
  qty: 7,
  fulfillment: {
    method: "ship",
    allocation: { /* as shown above */ }
  }
});
```

### CartContext Requirements
The CartContext should handle the new `fulfillment` field:

```javascript
// In CartContext or cart slice
{
  items: [
    {
      productId: 123,
      name: "Classic T-Shirt",
      color: "Blue",
      size: "2XL",
      sizeId: 456,
      quantity: 7,
      price: 299000,
      fulfillment: {
        method: "ship",
        allocation: { /* ... */ }
      }
    }
  ]
}
```

---

## UI Flow

### Product Page Flow

1. **Initial State**
   - User selects size and quantity
   - Two buttons shown:
     - "Choose Fulfillment Option" (primary)
     - "Quick Add (Ship to Home)" (secondary, default)

2. **Fulfillment Selection Mode**
   - Click "Choose Fulfillment Option"
   - Product details hide
   - FulfillmentOptions component shows
   - User chooses: Ship to Home OR Pick up at Store

3. **Ship to Home Path**
   - Component calculates allocation automatically
   - Shows breakdown: "4 from warehouse + 3 from Store A"
   - Warns if split shipment
   - User clicks "Confirm Shipping"
   - Item added to cart with allocation metadata
   - Toast: "Added to cart! Ships from: Online Warehouse, Saigon District 7"

4. **Pick up at Store Path**
   - Shows list of stores with inventory
   - User selects store (e.g., "Saigon District 7 - 3 in stock")
   - Shows availability: "Available now: 3 items. Need 4 more."
   - Shows 4 choices:
     - ✓ Pick up 3 today + ship 4 to home
     - ✓ Pick up all 7 later (ETA: Fri Nov 14)
     - ✓ Pick up 3 today (reduce quantity)
     - ✓ Ship all 7 to home instead
   - User selects option
   - Item added to cart with fulfillment metadata
   - Toast: "Added! Pickup 3 + Ship 4"

5. **Back to Product**
   - User can click "← Back to product"
   - Fulfillment component hides
   - Product details show again

---

## Key Functions

### `allocateForShipping(warehouse, stores)`
Allocates inventory for home delivery, prioritizing warehouse then stores.

**Returns**: Allocation object with sources and quantities

### `allocateForPickup(store, warehouse)`
Generates pickup options based on store and warehouse availability.

**Returns**: Options object with 4 fulfillment choices

### `getStoresWithInventory()`
Filters and sorts stores that have the selected size in stock.

**Returns**: Array of stores with quantity > 0, sorted by quantity desc

### `handleMethodChange(method)`
Switches between "ship" and "pickup" modes, resets state.

### `handleStoreSelect(store)`
User selected a specific store for pickup.

### `handlePickupOptionSelect(option)`
User confirmed a pickup option, triggers onSelect callback.

### `handleShipConfirm()`
User confirmed shipping allocation, triggers onSelect callback.

---

## Toast Notifications

Success messages vary by fulfillment choice:

| Scenario | Toast Message |
|----------|--------------|
| Quick Add (default) | "Added to cart! Default: Ship to Home" |
| Ship (single source) | "Added to cart! Ships from: Online Warehouse" |
| Ship (multi-source) | "Added to cart! Ships from: Online Warehouse, Saigon District 7" |
| Pickup - Split | "Added! Pickup 3 + Ship 4" |
| Pickup - Transfer | "Added! Will be ready for pickup on 11/14/2024" |
| Pickup - Reduce | "Added 3 items for pickup today" |
| Pickup - Ship all | "Added to cart! Will ship to home" |

---

## Future Enhancements

1. **Geolocation**: Auto-select nearest store based on user location
2. **Store Hours**: Show "Closes in 2 hours" warnings
3. **Real-time Inventory**: WebSocket updates for live stock changes
4. **Reservation**: Hold inventory for 15 minutes during checkout
5. **Multi-item Optimization**: Smart allocation across entire cart
6. **Store Capacity**: Consider store fulfillment capacity limits
7. **Shipping Cost**: Calculate and display shipping fees per source
8. **Delivery Dates**: Show specific ETAs based on courier services

---

## Testing Scenarios

### Test Case 1: Ship - Full Warehouse Stock
- Product: Has 10 in warehouse, 0 in stores
- User wants: 5
- Expected: Ship 5 from warehouse, no warnings

### Test Case 2: Ship - Split Across 3 Locations
- Product: 2 in warehouse, 3 in Store A, 2 in Store B
- User wants: 7
- Expected: Show "2 from warehouse + 3 from Store A + 2 from Store B", warn about 3 shipments

### Test Case 3: Pickup - Full Store Stock
- Product: 8 in Store A
- User wants: 5
- Expected: Show pickup options, allow reduce to 8 or ship all

### Test Case 4: Pickup - Partial with Transfer
- Product: 2 in Store A, 10 in warehouse
- User wants: 5
- Expected: Show split (2+3), transfer (ETA 3 days), reduce (2), ship (5)

### Test Case 5: Insufficient Total Stock
- Product: 3 in warehouse, 2 in Store A
- User wants: 10
- Expected: Show error "Only 5 available. Please reduce quantity to 5."

### Test Case 6: No Store Stock
- Product: 10 in warehouse, 0 in all stores
- User selects: Pickup method
- Expected: Show "No stores have this item in stock. Please choose shipping instead."

---

## API Requirements

### Required Endpoints

**GET /clothes/:id**
- Returns product with sizes array
- Each size includes branches array with quantities
- Branches include isActive flag

**POST /cart/add** (or handled in CartContext)
- Accepts fulfillment metadata
- Server validates inventory still available
- Reserves/allocates stock

**GET /admin/branches** (existing)
- Returns all branch locations
- Includes address, phone, hours

### Expected Branch Fields
```javascript
{
  branchId: number,
  branchCode: string,      // "ONLINE-WH", "HCM-Q7", etc.
  branchName: string,      // Display name
  address: string,         // For pickup instructions
  phone: string,           // For customer contact
  quantity: number,        // Stock at this branch for this size
  isActive: boolean        // Can fulfill orders
}
```

---

## Styling Notes

- Uses TailwindCSS utility classes
- Blue (#3B82F6) for primary actions
- Gray for secondary/disabled states
- Yellow for warnings (split shipments)
- Red for errors (insufficient stock)
- Green for success/available indicators
- Icons from `react-icons/io5`:
  - IoHome: Ship to Home
  - IoStorefront: Pick up at Store
  - IoInformationCircle: Fulfillment info

---

## Performance Considerations

1. **Memoization**: Consider useMemo for allocation calculations
2. **Debounce**: If quantity changes rapidly, debounce recalculations
3. **Lazy Loading**: Only fetch store details when pickup mode selected
4. **Caching**: Cache branch data (already fetched for dropdowns)
5. **Optimistic UI**: Show allocation immediately, validate server-side

---

## Accessibility

- All buttons have proper labels
- Disabled states clearly indicated
- Keyboard navigation supported
- Screen reader friendly (semantic HTML)
- Color not sole indicator (icons + text)

---

## Browser Compatibility

- Requires ES6+ (arrow functions, destructuring)
- Uses modern array methods (find, filter, map, reduce)
- Date formatting via toLocaleDateString
- Compatible with: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Maintenance

**When to Update This Component**:
- New fulfillment methods added (e.g., "Express Delivery", "Same-Day")
- Business rules change (e.g., warehouse priority changes)
- API response structure changes
- New branch types added (e.g., "POP-UP-STORE")
- ETA calculation logic needs refinement

**Code Locations to Check**:
- `FulfillmentOptions.jsx` - Main component logic
- `productPage.jsx` - Integration and callbacks
- `CartContext.tsx` - Cart state management
- `axiosInstance.ts` - API calls

---

## Support & Troubleshooting

**Common Issues**:

1. **"No stores available" shown incorrectly**
   - Check: branches array exists and has isActive=true
   - Check: ONLINE-WH filtered out correctly

2. **Split shipment not showing**
   - Check: Multiple branches have quantity > 0
   - Check: Requested qty exceeds single source

3. **Transfer ETA wrong**
   - Check: Date calculation (+3 days from today)
   - Check: Timezone handling

4. **Allocation calculation wrong**
   - Check: totalQuantity vs available vs quantity per branch
   - Check: Math.min logic in allocation loops

**Debug Mode**:
```javascript
// Add to component for debugging
useEffect(() => {
  console.log('Allocation Debug:', {
    method: fulfillmentMethod,
    selectedSize,
    requestedQty,
    allocation,
    pickupOptions
  });
}, [fulfillmentMethod, selectedSize, requestedQty, allocation, pickupOptions]);
```

---

**Last Updated**: 2024-11-10  
**Version**: 1.0.0  
**Author**: GitHub Copilot
