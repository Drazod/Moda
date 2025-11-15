# Implementation Checklist - Inventory Allocation Feature

## ✅ Completed

### Core Components
- [x] Created `FulfillmentOptions.jsx` component
  - [x] Ship to Home allocation logic
  - [x] Pick up at Store with 4 options (split, transfer, reduce, ship-all)
  - [x] Real-time inventory calculation
  - [x] Store selection UI
  - [x] ETA calculation for transfers
  - [x] Split shipment warnings

### Product Page Integration
- [x] Imported FulfillmentOptions component
- [x] Added fulfillment state management
  - [x] `showFulfillment` state
  - [x] `fulfillmentData` state
- [x] Updated button flow:
  - [x] "Choose Fulfillment Option" (primary)
  - [x] "Quick Add (Ship to Home)" (secondary)
  - [x] Out of stock handling
- [x] Added fulfillment panel with callbacks
- [x] Integrated toast notifications with context-aware messages
- [x] Conditional rendering (hide details when showing fulfillment)
- [x] Back navigation from fulfillment panel

### Documentation
- [x] Created comprehensive guide (`INVENTORY_ALLOCATION_GUIDE.md`)
  - [x] Component overview
  - [x] Fulfillment methods explained
  - [x] Data structure documentation
  - [x] API requirements
  - [x] Testing scenarios
  - [x] Troubleshooting guide
- [x] Created flow diagram (`ALLOCATION_FLOW_DIAGRAM.txt`)
  - [x] Visual user flow
  - [x] Algorithm pseudocode
  - [x] Data flow diagram

## 🔄 Pending Backend Integration

### API Endpoints to Verify
- [ ] **GET /clothes/:id** returns correct structure:
  ```json
  {
    "sizes": [
      {
        "label": "2XL",
        "totalQuantity": 7,
        "totalAllocated": 0,
        "available": 7,
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
            "address": "123 Nguyen Van Linh",
            "phone": "+84 28 1234 5678",
            "quantity": 3,
            "isActive": true
          }
        ]
      }
    ]
  }
  ```

- [ ] Verify branch fields include:
  - [ ] `branchCode` (string)
  - [ ] `branchName` (string)
  - [ ] `address` (string) - for pickup stores
  - [ ] `phone` (string) - for pickup stores
  - [ ] `quantity` (number) - stock at this branch
  - [ ] `isActive` (boolean) - can fulfill orders

### CartContext Updates
- [ ] Update CartContext to handle `fulfillment` field
- [ ] Modify `addToCart` signature to accept fulfillment metadata
- [ ] Update cart item structure:
  ```javascript
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
  ```

- [ ] Server sync for cart with fulfillment data
- [ ] Inventory reservation during checkout

## 🧪 Testing Needed

### Unit Tests
- [ ] Test `allocateForShipping` with various scenarios
  - [ ] Full warehouse stock
  - [ ] Split across warehouse + 1 store
  - [ ] Split across warehouse + multiple stores
  - [ ] Insufficient total stock
  - [ ] No warehouse stock (stores only)

- [ ] Test `allocateForPickup` with various scenarios
  - [ ] Full store stock
  - [ ] Partial store stock with warehouse backup
  - [ ] No store stock, transfer only
  - [ ] Insufficient total stock

- [ ] Test `getStoresWithInventory`
  - [ ] Filters out ONLINE-WH
  - [ ] Filters out inactive stores
  - [ ] Sorts by quantity descending

### Integration Tests
- [ ] Test product page flow:
  - [ ] Click "Choose Fulfillment Option" → shows panel
  - [ ] Click "Quick Add" → adds with default fulfillment
  - [ ] Select "Ship to Home" → shows allocation
  - [ ] Select "Pick up at Store" → shows store list
  - [ ] Select store → shows 4 options
  - [ ] Click option → adds to cart + toast

- [ ] Test edge cases:
  - [ ] Change quantity while fulfillment panel open
  - [ ] Change size while fulfillment panel open
  - [ ] Click "Back" from fulfillment panel
  - [ ] Out of stock handling
  - [ ] Zero inventory in all locations

### User Acceptance Testing
- [ ] UX flow feels natural
- [ ] Toast messages are clear and helpful
- [ ] Loading states work properly
- [ ] Mobile responsiveness
- [ ] Accessibility (keyboard navigation, screen readers)

## 🎨 UI/UX Enhancements (Optional)

- [ ] Add loading spinner during allocation calculation
- [ ] Animate panel transitions (slide in/out)
- [ ] Add icons to fulfillment options (📦, 🏪, ⏱️)
- [ ] Highlight recommended option
- [ ] Add "Why can't I get all items?" tooltip
- [ ] Show map/directions for selected store
- [ ] Add store hours display
- [ ] Implement "Save preferred store" feature

## 🚀 Performance Optimizations (Optional)

- [ ] Memoize allocation calculations with `useMemo`
- [ ] Debounce quantity changes
- [ ] Lazy load FulfillmentOptions component
- [ ] Cache store data from previous sessions
- [ ] Add loading states for smoother UX
- [ ] Optimize re-renders with `React.memo`

## 📊 Analytics (Optional)

- [ ] Track which fulfillment method users choose most
- [ ] Track "Quick Add" vs "Choose Fulfillment" usage
- [ ] Track split shipment acceptance rate
- [ ] Track transfer option usage
- [ ] Track quantity reduction due to availability

## 🔐 Security Considerations

- [ ] Validate inventory on server before confirming order
- [ ] Prevent inventory overselling with race conditions
- [ ] Add CSRF protection for cart API calls
- [ ] Rate limit allocation calculations if exposed via API
- [ ] Sanitize user inputs (quantity, size selection)

## 📱 Mobile Considerations

- [ ] Test on various screen sizes
- [ ] Ensure touch targets are large enough (44x44px minimum)
- [ ] Test store selection on mobile
- [ ] Verify fulfillment panel scrolling on mobile
- [ ] Test landscape orientation

## 🌐 Localization (Future)

- [ ] Extract all UI strings to language files
- [ ] Support VND and other currencies
- [ ] Date formatting for different locales
- [ ] Address formatting by country
- [ ] Phone number formatting

## 📈 Monitoring & Alerts

- [ ] Set up error tracking for allocation failures
- [ ] Monitor API response times for /clothes/:id
- [ ] Alert on high cart abandonment during fulfillment selection
- [ ] Track inventory sync issues
- [ ] Monitor split shipment complaints

## 🔧 Known Limitations

1. **ETA Calculation**: Currently simple (+3 days). Should integrate with actual logistics system.
2. **Store Hours**: Not validated. Can't prevent pickup selection when store is closed.
3. **Geolocation**: No auto-detect nearest store. User must manually select.
4. **Reservation**: No inventory hold during selection. Stock can be sold to others.
5. **Multi-item Cart**: Allocation is per-item, not optimized across entire cart.
6. **Real-time Updates**: No WebSocket for live inventory updates.

## 📝 Next Steps (Priority Order)

1. **HIGH**: Test with real backend API
   - Verify product response structure
   - Ensure branch data is complete
   - Test with actual inventory data

2. **HIGH**: Update CartContext
   - Accept fulfillment metadata
   - Sync to server with allocation info
   - Display fulfillment method in cart view

3. **MEDIUM**: Add loading states
   - Spinner during allocation calculation
   - Skeleton for store list loading

4. **MEDIUM**: Mobile testing & fixes
   - Test on iOS Safari, Android Chrome
   - Fix any layout issues
   - Improve touch interactions

5. **LOW**: Analytics integration
   - Track user behavior
   - Measure conversion impact
   - A/B test "Quick Add" vs "Choose Fulfillment"

6. **LOW**: Advanced features
   - Geolocation for nearest store
   - Store hours validation
   - Inventory reservation

## 🎯 Success Metrics

- [ ] Reduction in "out of stock" cart abandonment
- [ ] Increase in multi-source fulfillment orders
- [ ] High user satisfaction scores for fulfillment options
- [ ] Low customer service contacts about availability
- [ ] Smooth integration with existing checkout flow

---

**Status**: ✅ Frontend Implementation Complete  
**Next Milestone**: Backend Integration & Testing  
**Owner**: Development Team  
**Target Date**: TBD
