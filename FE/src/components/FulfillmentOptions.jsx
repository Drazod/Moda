import React, { useState, useEffect } from 'react';
import { IoStorefront, IoHome, IoInformationCircle } from 'react-icons/io5';

/**
 * FulfillmentOptions Component
 * Handles inventory allocation and fulfillment method selection
 * 
 * @param {Object} product - Product details with sizes and branch inventory
 * @param {string} selectedSize - Currently selected size label
 * @param {number} requestedQty - Quantity user wants to purchase
 * @param {Function} onSelect - Callback when fulfillment option is selected
 */
const FulfillmentOptions = ({ product, selectedSize, requestedQty, onSelect }) => {
  // ============================================================================
  // STATE
  // ============================================================================
  const [fulfillmentMethod, setFulfillmentMethod] = useState('ship');
  const [selectedStore, setSelectedStore] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [pickupOptions, setPickupOptions] = useState(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  useEffect(() => {
    if (!product || !selectedSize || !requestedQty) return;
    calculateAllocation();
  }, [product, selectedSize, requestedQty, fulfillmentMethod, selectedStore]);

  // ============================================================================
  // ALLOCATION LOGIC
  // ============================================================================
  const calculateAllocation = () => {
    const sizeData = product.sizes?.find(s => s.label === selectedSize);
    if (!sizeData) return;

    const branches = sizeData.branches || [];
    const onlineWarehouse = branches.find(b => b.branchCode === 'ONLINE-WH');
    const stores = branches.filter(b => b.branchCode !== 'ONLINE-WH' && b.isActive);

    if (fulfillmentMethod === 'ship') {
      allocateForShipping(onlineWarehouse, stores);
    } else if (fulfillmentMethod === 'pickup' && selectedStore) {
      allocateForPickup(selectedStore, onlineWarehouse);
    }
  };

  const allocateForShipping = (warehouse, stores) => {
    const warehouseQty = warehouse?.quantity || 0;
    let remaining = requestedQty - warehouseQty;
    
    const result = {
      method: 'ship',
      items: [],
      complete: warehouseQty >= requestedQty,
      totalAvailable: warehouseQty + stores.reduce((sum, s) => sum + (s.quantity || 0), 0)
    };

    // Allocate from warehouse first
    if (warehouseQty > 0) {
      result.items.push({
        source: 'warehouse',
        branchId: warehouse.branchId,
        branchCode: warehouse.branchCode,
        location: warehouse.branchName,
        quantity: Math.min(warehouseQty, requestedQty),
        shipmentNote: 'Ships from warehouse'
      });
    }

    // Allocate from stores if needed
    if (remaining > 0) {
      const availableStores = stores
        .filter(s => s.quantity > 0)
        .sort((a, b) => b.quantity - a.quantity);

      for (const store of availableStores) {
        if (remaining <= 0) break;
        
        const fromStore = Math.min(store.quantity, remaining);
        result.items.push({
          source: 'store',
          branchId: store.branchId,
          location: store.branchName,
          branchCode: store.branchCode,
          quantity: fromStore,
          shipmentNote: 'Ships from store (may arrive separately)'
        });
        remaining -= fromStore;
      }

      result.complete = remaining <= 0;
      result.needsTransfer = !result.complete;
    }

    setAllocation(result);
  };

  const allocateForPickup = (store, warehouse) => {
    const storeQty = store.quantity || 0;
    const warehouseQty = warehouse?.quantity || 0;
    const shortage = requestedQty - storeQty;

    const options = {
      method: 'pickup',
      store: {
        branchId: store.branchId,
        name: store.branchName,
        code: store.branchCode,
        address: store.address,
        phone: store.phone
      },
      available: storeQty,
      shortage: shortage > 0 ? shortage : 0,
      choices: []
    };

    // Build pickup options based on availability
    if (shortage > 0 && warehouseQty > 0) {
      options.choices.push({
        id: 'split',
        label: `Pick up ${storeQty} today + ship ${Math.min(shortage, warehouseQty)} to home`,
        description: 'Split fulfillment: Partial pickup, remainder ships',
        pickupQty: storeQty,
        shipQty: Math.min(shortage, warehouseQty),
        available: storeQty + warehouseQty >= requestedQty
      });
    }

    if (shortage > 0 && warehouseQty >= shortage) {
      const eta = new Date();
      eta.setDate(eta.getDate() + 3);
      options.choices.push({
        id: 'transfer',
        label: `Pick up all ${requestedQty} later`,
        description: `Transfer from warehouse. ETA: ${eta.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`,
        pickupQty: requestedQty,
        shipQty: 0,
        needsTransfer: true,
        eta: eta.toISOString(),
        available: true
      });
    }

    if (storeQty > 0) {
      options.choices.push({
        id: 'reduce',
        label: `Pick up ${storeQty} today (reduce quantity)`,
        description: 'Immediate pickup with reduced quantity',
        pickupQty: storeQty,
        shipQty: 0,
        available: true
      });
    }

    if (warehouseQty >= requestedQty) {
      options.choices.push({
        id: 'ship-all',
        label: 'Ship all to home instead',
        description: 'Order will be shipped from warehouse',
        pickupQty: 0,
        shipQty: requestedQty,
        available: true
      });
    }

    setPickupOptions(options);
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  const getStoresWithInventory = () => {
    const sizeData = product.sizes?.find(s => s.label === selectedSize);
    if (!sizeData) return [];
    
    return (sizeData.branches || [])
      .filter(b => b.branchCode !== 'ONLINE-WH' && b.isActive && b.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity);
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleMethodChange = (method) => {
    setFulfillmentMethod(method);
    if (method === 'ship') {
      setSelectedStore(null);
      setPickupOptions(null);
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };

  const handlePickupOptionSelect = (option) => {
    onSelect?.({
      method: 'pickup',
      store: pickupOptions.store,
      option: option,
      totalQty: requestedQty
    });
  };

  const handleShipConfirm = () => {
    onSelect?.({
      method: 'ship',
      allocation: allocation,
      totalQty: requestedQty
    });
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const stores = getStoresWithInventory();

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-[#434237] text-[#F5F5F5] border border-gray-200 rounded-lg p-6 mt-6 ">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <IoInformationCircle className="mr-2 text-[#]" />
        Fulfillment Options
      </h3>

      {/* Method Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleMethodChange('ship')}
          className={`p-4 border rounded-lg transition ${
            fulfillmentMethod === 'ship'
              ? 'border-[#434237] bg-[#BFAF92]'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <IoHome className={`text-2xl  mx-auto mb-2 ${fulfillmentMethod === 'ship' ? 'text-black' : 'text-white'}`} />
          <div className={`font-medium ${fulfillmentMethod === 'ship' ? 'text-black' : 'text-white'}`}>Ship to Home</div>
          <div className="text-xs text-white">Delivery in 3-5 days</div>
        </button>

        <button
          onClick={() => handleMethodChange('pickup')}
          className={`p-4 border rounded-lg transition ${
            fulfillmentMethod === 'pickup'
              ? 'border-[#434237] bg-[#BFAF92]'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <IoStorefront className={`text-2xl mx-auto mb-2 ${fulfillmentMethod === 'pickup' ? 'text-black' : 'text-white'}`} />
          <div className={`font-medium ${fulfillmentMethod === 'pickup' ? 'text-black' : 'text-white'}`}>Pick up at Store</div>
          <div className="text-xs ">{stores.length} stores available</div>
        </button>
      </div>

      {/* Ship to Home */}
      {fulfillmentMethod === 'ship' && allocation && (
        <div className="bg-[#BFAF92] p-4 rounded-lg">
          <h4 className="font-semibold text-black mb-3">Shipping Details</h4>
          
          {allocation.items.map((item, idx) => (
            <div key={idx} className="mb-2 flex justify-between items-center text-sm">
              <div>
                <span className="font-medium">{item.quantity} items</span> from {item.location}
              </div>
              <span className="text-gray-600 text-xs">{item.shipmentNote}</span>
            </div>
          ))}

          {allocation.items.length > 1 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⚠️ Items may arrive in {allocation.items.length} separate shipments
            </div>
          )}

          {!allocation.complete && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
              ⚠️ Only {allocation.totalAvailable} available. Please reduce quantity to {allocation.totalAvailable}.
            </div>
          )}

          {allocation.complete && (
            <button
              onClick={handleShipConfirm}
              className="mt-4 w-full bg-[#000000] text-white py-2 rounded-lg hover:bg-[#333333] transition"
            >
              Confirm Shipping
            </button>
          )}
        </div>
      )}

      {/* Pick up at Store */}
      {fulfillmentMethod === 'pickup' && !selectedStore && (
        <div>
          <h4 className="font-semibold mb-3">Select a Store</h4>
          {stores.length === 0 ? (
            <div className=" text-center text-gray-500 py-4">
              No stores have this item in stock. Please choose shipping instead.
            </div>
          ) : (
            <div className="space-y-2">
              {stores.map((store) => (
                <button
                  key={store.branchId}
                  onClick={() => handleStoreSelect(store)}
                  className="bg-[#BFAF92] w-full text-left p-3  rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-black">{store.branchName}</div>
                      <div className="text-sm text-gray-600">{store.address}</div>
                      {store.phone && (
                        <div className="text-xs text-gray-500">📞 {store.phone}</div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {store.quantity} in stock
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pickup Options */}
      {fulfillmentMethod === 'pickup' && selectedStore && pickupOptions && (
        <div className="bg-[#BFAF92] p-4 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-black">{pickupOptions.store.name}</h4>
              <div className="text-sm text-gray-600">{pickupOptions.store.address}</div>
            </div>
            <button
              onClick={() => setSelectedStore(null)}
              className="text-sm text-white hover:underline"
            >
              Change store
            </button>
          </div>

          <div className="mb-4 p-2 bg-[#434343] rounded text-sm">
            Available now: <strong>{pickupOptions.available}</strong> items at this store.
            {pickupOptions.shortage > 0 && (
              <span className="text-orange-600"> Need {pickupOptions.shortage} more.</span>
            )}
          </div>

          <h5 className="font-semibold mb-2">Choose an option:</h5>
          <div className="space-y-2">
            {pickupOptions.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handlePickupOptionSelect(choice)}
                disabled={!choice.available}
                className={`w-full text-left p-3 border rounded-lg transition ${
                  choice.available
                    ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="font-medium">{choice.label}</div>
                <div className="text-sm text-gray-600">{choice.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FulfillmentOptions;
