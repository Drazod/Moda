# Quick Reference - Inventory Allocation Feature

## 🎯 What This Does
Intelligent checkout UX that shows customers exactly how their order will be fulfilled based on real-time inventory across warehouse and stores.

## 📁 Files Modified/Created

### Created
- `src/components/FulfillmentOptions.jsx` - Main allocation component
- `INVENTORY_ALLOCATION_GUIDE.md` - Complete documentation
- `ALLOCATION_FLOW_DIAGRAM.txt` - Visual flow diagrams
- `IMPLEMENTATION_CHECKLIST.md` - Todo list

### Modified
- `src/layouts/productPage.jsx` - Integrated fulfillment options

## 🎨 UI Components

### Product Page Buttons (Before Selection)
```jsx
// Primary action - shows fulfillment options
<button onClick={() => setShowFulfillment(true)}>
  Choose Fulfillment Option
</button>

// Secondary action - quick add with defaults
<button onClick={handleQuickAdd}>
  Quick Add (Ship to Home)
</button>
```

### Fulfillment Options Panel
```jsx
<FulfillmentOptions
  product={product}           // Full product object with sizes.branches
  selectedSize="2XL"          // Current size selection
  requestedQty={7}            // How many user wants
  onSelect={(choice) => {     // Callback with allocation data
    addToCart(product, {
      ...options,
      fulfillment: choice
    });
  }}
/>
```

## 📊 Data Structures

### Input: Product with Inventory
```javascript
{
  id: 123,
  sizes: [
    {
      label: "2XL",
      totalQuantity: 7,
      branches: [
        {
          branchCode: "ONLINE-WH",  // Distribution center
          branchName: "Online Warehouse",
          quantity: 4,
          isActive: true
        },
        {
          branchCode: "HCM-Q7",     // Retail store
          branchName: "Saigon District 7",
          address: "123 Nguyen Van Linh, Q7, HCMC",
          phone: "+84 28 1234 5678",
          quantity: 3,
          isActive: true
        }
      ]
    }
  ]
}
```

### Output: Ship to Home
```javascript
{
  method: "ship",
  allocation: {
    complete: true,
    totalAvailable: 7,
    items: [
      { source: "warehouse", location: "Online Warehouse", quantity: 4 },
      { source: "store", location: "Saigon Q7", branchCode: "HCM-Q7", quantity: 3 }
    ],
    needsTransfer: false
  },
  totalQty: 7
}
```

### Output: Pick up at Store
```javascript
{
  method: "pickup",
  store: {
    name: "Saigon District 7",
    code: "HCM-Q7",
    address: "123 Nguyen Van Linh, Q7, HCMC",
    phone: "+84 28 1234 5678"
  },
  option: {
    id: "split",                // or "transfer", "reduce", "ship-all"
    label: "Pick up 3 today + ship 4 to home",
    pickupQty: 3,
    shipQty: 4,
    available: true
  },
  totalQty: 7
}
```

## 🔧 Key Functions

### allocateForShipping(warehouse, stores)
**Purpose**: Calculate how to fulfill a ship-to-home order  
**Priority**: Warehouse first, then stores with most stock  
**Returns**: Allocation object with sources and quantities

**Example**:
```javascript
// Input: Want 7, warehouse has 4, stores have [3, 2]
// Output: 4 from warehouse + 3 from store1 (ignore store2)
```

### allocateForPickup(store, warehouse)
**Purpose**: Generate pickup options for selected store  
**Returns**: 4 choices (split, transfer, reduce, ship-all)

**Example**:
```javascript
// Input: Want 7, store has 3, warehouse has 10
// Output: 
// 1. Pickup 3 + Ship 4 (split)
// 2. Pickup 7 later (after transfer, ETA +3 days)
// 3. Pickup 3 today (reduce quantity)
// 4. Ship all 7 instead
```

## 🎬 User Flows

### Flow 1: Quick Add (Default)
```
User: [Quick Add (Ship to Home)]
  ↓
System: addToCart({ fulfillment: { method: 'ship' } })
  ↓
Toast: "Added to cart! Default: Ship to Home"
```

### Flow 2: Ship to Home (Custom)
```
User: [Choose Fulfillment Option]
  ↓
User: [🏠 Ship to Home]
  ↓
System: Shows "4 from warehouse + 3 from Store A"
         "⚠️ May arrive in 2 packages"
  ↓
User: [Confirm Shipping]
  ↓
System: addToCart({ fulfillment: { method: 'ship', allocation: {...} } })
  ↓
Toast: "Ships from: Online Warehouse, Saigon Q7"
```

### Flow 3: Pick up at Store
```
User: [Choose Fulfillment Option]
  ↓
User: [🏪 Pick up at Store]
  ↓
System: Shows list of stores with inventory
  ↓
User: Selects "Saigon Q7 - 3 in stock"
  ↓
System: Shows "Available: 3, Need: 4 more"
         + 4 options
  ↓
User: Selects "Pick up 3 + Ship 4"
  ↓
System: addToCart({ fulfillment: { method: 'pickup', option: {...} } })
  ↓
Toast: "Added! Pickup 3 + Ship 4"
```

## 🚨 Edge Cases

| Scenario | Behavior |
|----------|----------|
| **Out of stock** | Show "Out of stock" button (disabled) |
| **Exact stock match** | Single source, no warnings |
| **Split needed** | Show "⚠️ May arrive in N packages" |
| **Insufficient total** | Show "Only X available. Reduce quantity to X." |
| **No store stock** | Pickup mode shows "No stores available" message |
| **Qty changes during selection** | Recalculates allocation automatically |
| **Size changes during selection** | Recalculates allocation automatically |

## 🧪 Quick Test Commands

```javascript
// Test allocation with console logs
const testData = {
  sizes: [
    {
      label: "2XL",
      branches: [
        { branchCode: "ONLINE-WH", quantity: 4 },
        { branchCode: "HCM-Q7", quantity: 3, address: "123 Main St" }
      ]
    }
  ]
};

// Test scenarios:
// 1. Want 5 → Should get 4 warehouse + 1 store
// 2. Want 10 → Should show error (only 7 available)
// 3. Want 3 → Should get all from warehouse
```

## 📋 Checklist for New Developers

- [ ] Read `INVENTORY_ALLOCATION_GUIDE.md`
- [ ] Review `FulfillmentOptions.jsx` component
- [ ] Understand two allocation algorithms
- [ ] Test with backend API (verify response structure)
- [ ] Check CartContext handles `fulfillment` field
- [ ] Verify toast notifications work
- [ ] Test mobile responsiveness
- [ ] Add error boundary if needed

## 🐛 Common Issues & Fixes

### Issue: "No stores available" shown incorrectly
**Fix**: Check branches array filters out `ONLINE-WH` and checks `isActive` flag

### Issue: Allocation calculation wrong
**Fix**: Verify `totalQuantity` vs `quantity` per branch. Check Math.min logic.

### Issue: Transfer ETA is wrong date
**Fix**: Check timezone handling in `new Date()` + 3 days calculation

### Issue: Split shipment warning not showing
**Fix**: Ensure allocation.items.length > 1 triggers warning

## 💡 Tips

1. **Debug Mode**: Add console.logs in `useEffect` to see allocation changes
2. **Mock Data**: Use test product with known quantities for development
3. **API Structure**: Backend must return `branches` array with `quantity` per location
4. **Performance**: Consider `useMemo` for allocation calculations if slow
5. **Accessibility**: Test keyboard navigation through options

## 🔗 Related Code

- **Cart Integration**: `src/context/CartContext.tsx`
- **Product API**: `src/configs/axiosInstance.ts`
- **Branch Management**: `src/layouts/dash/dashBrM.jsx`
- **Stock Updates**: `src/components/dash/dashPdM/dashPdMStockUpdate.jsx`

## 📞 Support

- See `INVENTORY_ALLOCATION_GUIDE.md` for detailed documentation
- Check `ALLOCATION_FLOW_DIAGRAM.txt` for visual diagrams
- Review `IMPLEMENTATION_CHECKLIST.md` for todo items

---

**Quick Start**: Open `productPage.jsx`, find the fulfillment buttons section, trace through `FulfillmentOptions` component to understand flow.
