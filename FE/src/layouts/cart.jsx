import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import VoucherPanel from "../components/cart/voucherPanel";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../configs/axiosInstance";
import { NavLink } from "react-router-dom";
import momo from "../assets/cart/momo.png";
import vnpay from "../assets/cart/vnpay.svg";
import FulfillmentOptions from "../components/FulfillmentOptions";
import { IoStorefront, IoHome } from 'react-icons/io5';
import toast from 'react-hot-toast';

const bg = "#E6DAC4";
const fieldBg = "#CDC2AF";
const railBg = "#BFAF92";
const darkBtn = "#434237";

const formatVND = (v) =>
  (Number(v) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND";

export default function CartModal({ open, onClose }) {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================
  const { items, removeFromCart, updateQty } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    message: "",
    payment: "",
  });
  const [pointsToUse, setPointsToUse] = useState(0);
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [editingFulfillment, setEditingFulfillment] = useState(null); // cartItemId being edited
  const [cartId, setCartId] = useState(undefined);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const availablePoints = user?.points || 0;
  const totalQty = items.reduce((sum, it) => sum + (it.qty ?? 0), 0);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (it.price ?? 0) * (it.qty ?? 0), 0),
    [items]
  );

  const totalAfterVoucher = useMemo(() => {
    if (!voucherDiscount) return subtotal;
    if (voucherDiscount < 1) return Math.max(subtotal * (1 - voucherDiscount), 0);
    return Math.max((subtotal * (100 - voucherDiscount)) / 100, 0);
  }, [subtotal, voucherDiscount]);

  const maxPointsAllowed = Math.floor(totalAfterVoucher * 0.5);
  const maxUsablePoints = Math.min(availablePoints, maxPointsAllowed, Math.floor(totalAfterVoucher));
  const pointsUsed = Math.min(pointsToUse, maxUsablePoints);
  const total = Math.max(totalAfterVoucher - pointsUsed, 0);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  useEffect(() => {
    if ((open || open === undefined) && user) {
      setForm((f) => ({
        ...f,
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
      }));
    }
  }, [open, user]);

  // Fetch cart ID when modal opens or items change
  useEffect(() => {
    if ((open || open === undefined) && items.length > 0) {
      // First try to get cartId from items
      const itemCartId = items[0]?.cartId;
      if (itemCartId) {
        setCartId(itemCartId);
      } else if (user) {
        // If no cartId in items, fetch user's cart
        axiosInstance.get('/cart')
          .then(res => {
            const userCart = res.data?.data || res.data;
            if (userCart?.cartId) {
              setCartId(userCart.cartId);
            }
          })
          .catch(err => {
            console.error('Failed to fetch cart:', err);
          });
      }
    }
  }, [open, items, user]);

  useEffect(() => {
    setPointsToUse((p) => Math.min(Math.max(0, p), maxUsablePoints));
  }, [maxUsablePoints]);

  // ============================================================================
  // QUANTITY HELPERS
  // ============================================================================
  const getMinQty = (item) => item?.minQty ?? 1;

  const getMaxQty = (item) => {
    if (item?.sizeId && item?.sizeStock) return item.sizeStock;
    return item?.maxQty;
  };

  const getAllowedQtyForSize = (item) => {
    try {
      const cartSizeQuantities = JSON.parse(localStorage.getItem("cartSizeQuantities") || "{}");
      return cartSizeQuantities[item.id]?.[item.sizeId];
    } catch {
      return undefined;
    }
  };

  const getTotalQtyForSize = (item) => {
    return items
      .filter((it) => it.id === item.id && it.sizeId === item.sizeId)
      .reduce((sum, it) => sum + it.qty, 0);
  };

  const canIncrement = (item) => {
    const maxQty = getMaxQty(item);
    const allowedQty = getAllowedQtyForSize(item);
    const totalQtyForSize = getTotalQtyForSize(item);

    if (typeof allowedQty === "number" && totalQtyForSize >= allowedQty) return false;
    if (typeof maxQty === "number" && item.qty >= maxQty) return false;
    return true;
  };

  // ============================================================================
  // CART ACTIONS
  // ============================================================================
  const inc = (cartItemId) => {
    const item = items.find((it) => it.cartItemId === cartItemId);
    if (!item) return;

    const allowedQty = getAllowedQtyForSize(item);
    const totalQtyForSize = getTotalQtyForSize(item);
    const maxQty = getMaxQty(item);

    if (typeof allowedQty === "number" && totalQtyForSize >= allowedQty) {
      alert(`You cannot add more than ${allowedQty} for this size.`);
      return;
    }
    if (typeof maxQty === "number" && item.qty >= maxQty) {
      alert(`Only ${maxQty} left in stock for this size.`);
      return;
    }

    updateQty(cartItemId, item.qty + 1);
  };

  const dec = (cartItemId) => {
    const item = items.find((it) => it.cartItemId === cartItemId);
    if (!item) return;
    if (item.qty > getMinQty(item)) {
      updateQty(cartItemId, item.qty - 1);
    }
  };

  const removeItem = (id, color, size, cartItemId) => {
    removeFromCart(id, color, size, cartItemId);
  };

  // ============================================================================
  // FORM & PAYMENT HANDLERS
  // ============================================================================
  const handleForm = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCheckout = () => {
    if (!cartId) {
      alert("No cart ID found. Please add items to cart.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const endpoint = selectedPaymentMethod === "MOMO" 
        ? "/momo/create-payment" 
        : "/vnpay/create-payment";

      const res = await axiosInstance.post(endpoint, {
        orderId: cartId,
        amount: total,
        orderType: "other",
        language: "vn",
        address: form.address,
        couponCode: selectedVoucher,
        pointsUsed: pointsUsed,
      });
      
      const paymentUrl = res.data.paymentUrl || res.data.payUrl;
      window.location.href = paymentUrl;
    } catch (err) {
      alert("Failed to initiate payment. Please try again.");
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  if (!open && open !== undefined) return null;

  return (
    <div className="fixed inset-0 z-[100] font-Jsans">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="absolute left-1/2 top-1/2 w-[min(1000px,96vw)] -translate-x-1/2 -translate-y-1/2 shadow-2xl ring-1 ring-black/10"
        style={{ background: bg }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <h3 className="text-2xl font-medium tracking-[0.02em] text-[#353535]">
            Your cart <span className="opacity-40">({totalQty})</span>
          </h3>
          {onClose ? (
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-black/15 text-[#3a3936] hover:bg-black/25"
              aria-label="Close"
            >
              ✕
            </button>
          ) : (
            <a
              href="/home"
              className="grid h-8 w-8 place-items-center rounded-full bg-black/15 text-[#3a3936] hover:bg-black/25"
              aria-label="Go to Home"
            >
              ✕
            </a>
          )}
        </div>

        {/* body */}
        <div className="grid grid-cols-1 gap-10 px-6 pb-6 pt-4 lg:grid-cols-[1fr_1fr]">
          {/* LEFT – items list */}
          <div className="space-y-4 font-medium text-base overflow-y-auto" style={{ maxHeight: "400px" }}>
            {items.map((it, i) => {
              const key = (it.cartItemId ?? it.id) + "-" + (it.sizeId ?? "");
              const imgSrc = it.image || it.imageUrl || it?.Clothes?.mainImg?.url || "/placeholder.png";
              const sizeLabel = it.selectedSize || it.label || it?.Size?.label || "";

              return (
                <div key={key} className="pb-2">
                  <div className="grid grid-cols-[80px_1fr_auto] items-center gap-2">
                    <img src={imgSrc} alt={it.name || "Product"} className="h-20 w-20 rounded object-cover" />
                    <div>
                      <p className=" leading-snug ">{it.name}</p>
                      {sizeLabel && <div className="text-xs text-gray-500">Size: {sizeLabel}</div>}
                      {it.selectedColor && <div className="text-xs text-gray-500">Color: {it.selectedColor}</div>}
                    </div>

                    <button
                      onClick={() => removeItem(it.id, it.selectedColor, it.selectedSize, it.cartItemId)}
                      className="ml-auto h-8 w-8 rounded-full hover:bg-black/10 "
                      aria-label="Remove"
                      title="Remove"
                    >
                      🗑
                    </button>

                    {/* price & qty line */}
                    <div className="col-start-2">
                      <p>{formatVND(it.price)}</p>
                    </div>
                    <div className="col-start-3 flex items-center justify-end">
                      <div className="flex items-center rounded-full border border-black/20 bg-[#efe5d6] px-2">
                        <button
                          onClick={() => dec(it.cartItemId)}
                          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/10"
                          aria-label="Decrease"
                          disabled={it.qty <= getMinQty(it)}
                          style={it.qty <= getMinQty(it) ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                        >
                          –
                        </button>
                        <div className="w-9 text-center">{it.qty}</div>
                        <button
                          onClick={() => inc(it.cartItemId)}
                          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/10"
                          aria-label="Increase"
                          disabled={!canIncrement(it)}
                          style={!canIncrement(it) ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {i !== items.length - 1 && <div className="mt-4 h-px w-full bg-black/15" />}

                  {/* Fulfillment & Offers */}
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
                    {/* Fulfillment Info */}
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium">Fulfillment:</span>
                      <button
                        onClick={() => setEditingFulfillment(it.cartItemId)}
                        className="inline-flex items-center gap-2 rounded-md border border-black/20 bg-[#CDC2AF] px-3 py-1 hover:bg-white/70"
                      >
                        {it.fulfillmentMethod === 'pickup' ? (
                          <>
                            <IoStorefront className="text-sm" />
                            Pickup: {it.pickupBranchName || 'Select store'}
                          </>
                        ) : (
                          <>
                            <IoHome className="text-sm" />
                            Ship: {it.sourceBranchName || 'Warehouse'}
                          </>
                        )}
                        <span className="ml-1 text-xs opacity-50">✎</span>
                      </button>
                    </div>

                    <div className="h-7 w-px bg-black/20" />

                    {/* Voucher Selection */}
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium">Offers:</span>
                      <button
                        onClick={() => setShowVouchers(true)}
                        className="inline-flex items-center gap-2 rounded-md border border-black/20 bg-[#CDC2AF] px-3 py-1 hover:bg-white/70"
                      >
                        {selectedVoucher ? (
                          <>
                            {selectedVoucher} <span className="text-xs opacity-70">(applied)</span>
                          </>
                        ) : (
                          <>
                            Find voucher <span className="translate-x-[2px]">⟶</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
              );
            })}

            {/* payment / offers row */}
  
          </div>

          {/* RIGHT – form */}
          <div className="space-y-4 text-base font-medium">
            <div className="space-y-1">
              <label className="">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleForm}
                className="h-12 w-full rounded-xl px-4 outline-none shadow-inner ring-1 ring-black/15"
                style={{ background: fieldBg }}
                placeholder=""
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
              <div className="space-y-1">
                <label className="">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleForm}
                  className="h-12 w-full rounded-xl px-4 outline-none shadow-inner ring-1 ring-black/15"
                  style={{ background: fieldBg }}
                />
              </div>
              <div className="space-y-1">
                <label className="">Phone number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleForm}
                  className="h-12 w-full rounded-xl px-4 outline-none ring-1 shadow-inner ring-black/15"
                  style={{ background: fieldBg }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleForm}
                rows={7}
                className="w-full rounded-xl p-4 outline-none ring-1 shadow-inner ring-black/15"
                style={{ background: fieldBg }}
              />
            </div>
          </div>
        </div>

            {/* Footer Rail - Price Summary & Payment */}
            <div className="relative mx-5 mb-5 pt-4 overflow-hidden" style={{ background: railBg }}>
              {/* Default View - Price Summary */}
              <div className={`transition-transform duration-500 ease-in-out ${showPaymentModal ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                <div className="mx-1 p-4">
                    <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                        <span className="font-medium">Sub Total</span>
                        <span className="font-semibold">{formatVND(subtotal)}</span>
                    </div>

                    {voucherDiscount ? (
                    <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                        <span className="font-medium">After Voucher</span>
                        <span className="font-semibold">{formatVND(totalAfterVoucher)}</span>
                    </div>
                    ) : null}

                    <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                        <span className="font-medium">Available Points</span>
                        <span className="font-semibold">{availablePoints}</span>
                    </div>

                    <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                        <span className="font-medium">Use Points</span>
                        <input
                            type="number"
                            min={0}
                            max={maxUsablePoints}
                            value={pointsToUse}
                            onChange={(e) => {
                            let val = parseInt(e.target.value, 10);
                            if (isNaN(val) || val < 0) val = 0;
                            if (val > maxUsablePoints) val = maxUsablePoints;
                            setPointsToUse(val);
                            }}
                            className="w-24 px-2 py-1 rounded border border-gray-300 text-right"
                            style={{ background: fieldBg }}
                        />
                    </div>

                    <div className="mb-1 flex items-center justify-between text-[12px] text-gray-600">
                        <span className="font-light">
                            Max: {formatVND(Math.floor(totalAfterVoucher * 0.5))} (50% of price)
                        </span>
                        <span />
                    </div>

                    {pointsUsed > 0 && (
                    <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                        <span className="font-medium">Points Used</span>
                        <span className="font-semibold">- {formatVND(pointsUsed)}</span>
                    </div>
                    )}
                    <div className="mb-3 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                        <span className="font-medium">Total to Pay</span>
                        <span className="font-semibold">{formatVND(total)}</span>
                    </div>
                    <div className="flex gap-4">
                        <NavLink to="/store" className="text-center flex-1 rounded-full border border-black/30 bg-[#CDC2AF] py-3 text-[15px] font-medium text-[#2f2f2f] hover:bg-black/10">
                            Continue Shopping
                        </NavLink>
                        <button
                            className="flex-1 rounded-full py-3 text-[15px] font-semibold text-white hover:opacity-95"
                            style={{ background: darkBtn }}
                            onClick={handleCheckout}
                        >
                            Check Out
                        </button>
                    </div>
                    <p className="mt-3 text-center text-[11px] text-black/60">
                    By selecting "Check Out" you are agreeing to our{" "}
                        <a href="#" className="underline">
                            Terms & Conditions
                        </a>
                    </p>
                </div>
              </div>
              {/* Payment Methods View - Slides in from right */}
              <div className={`absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out ${showPaymentModal ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                <div className="mx-1 p-4 space-y-2">
                  <p className="text-base font-semibold text-[#2f2f2f] mb-2">Select Payment Method</p>
                    
                  {/* MoMo Payment Option */}
                  <button
                    onClick={() => setSelectedPaymentMethod("MOMO")}
                    className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                      selectedPaymentMethod === "MOMO"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-300 hover:border-pink-300"
                    }`}
                  >
                    <img src={momo} alt="MoMo" className="w-12 h-12 object-contain" />
                    <div className="text-left">
                      <div className="font-semibold text-[#2f2f2f] text-sm">MoMo E-Wallet</div>
                      <div className="text-xs text-gray-600">Pay with MoMo app</div>
                    </div>
                  </button>

                  {/* VNPay Payment Option */}
                  <button
                    onClick={() => setSelectedPaymentMethod("VNPAY")}
                    className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                      selectedPaymentMethod === "VNPAY"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <img src={vnpay} alt="VNPay" className="w-12 h-12 object-contain" />
                    <div className="text-left">
                      <div className="font-semibold text-[#2f2f2f] text-sm">VNPay</div>
                      <div className="text-xs text-gray-600">Pay with VNPay gateway</div>
                    </div>
                  </button>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pb-4">
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setSelectedPaymentMethod("");
                      }}
                      className="flex-1 rounded-full border border-black/30 bg-[#CDC2AF] py-3 text-[14px] font-medium text-[#2f2f2f] hover:bg-black/10"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={!selectedPaymentMethod}
                      className="flex-1 rounded-full py-3 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: darkBtn }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {showVouchers && (
        <VoucherPanel
          onClose={() => setShowVouchers(false)}
          onApply={(couponCode, discount) => {
            setSelectedVoucher(couponCode);
            setVoucherDiscount(discount);
            setShowVouchers(false);
          }}
        />
      )}

      {editingFulfillment && <FulfillmentEditor 
        cartItemId={editingFulfillment}
        items={items}
        onClose={() => setEditingFulfillment(null)}
      />}
    </div>
  );
}

// ============================================================================
// FULFILLMENT EDITOR COMPONENT
// ============================================================================
function FulfillmentEditor({ cartItemId, items, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const item = items.find(it => it.cartItemId === cartItemId);

  useEffect(() => {
    if (!item?.id) return;

    axiosInstance.get(`/clothes/${item.id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load product data');
        onClose();
      });
  }, [item?.id]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110]">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        
        <h3 className="text-xl font-bold mb-4">
          Update Fulfillment: {item.name}
        </h3>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : product ? (
          <FulfillmentOptions
            product={product}
            selectedSize={item.selectedSize || item.label}
            requestedQty={item.qty}
            onSelect={(fulfillmentChoice) => {
              const fulfillmentPayload = { method: fulfillmentChoice.method };
              
              if (fulfillmentChoice.method === 'ship') {
                const primarySource = fulfillmentChoice.allocation?.items?.[0];
                if (primarySource) {
                  fulfillmentPayload.sourceBranchId = primarySource.branchId || null;
                  fulfillmentPayload.allocationNote = fulfillmentChoice.allocation.items
                    .map(i => `${i.quantity} from ${i.location}`)
                    .join(', ');
                }
              } else if (fulfillmentChoice.method === 'pickup') {
                fulfillmentPayload.pickupBranchId = fulfillmentChoice.store?.branchId || null;
                fulfillmentPayload.allocationNote = fulfillmentChoice.option?.label || 'Pickup at store';
              }

              axiosInstance.post('/cart/add', {
                cartItemId: item.cartItemId,
                cakeId: item.id,
                sizeId: item.sizeId,
                quantity: item.qty,
                ...fulfillmentPayload
              }).then(() => {
                toast.success('Fulfillment method updated!');
                onClose();
                window.location.reload();
              }).catch(() => {
                toast.error('Failed to update fulfillment method');
              });
            }}
          />
        ) : (
          <div className="text-center text-red-500 py-8">Failed to load product</div>
        )}
      </div>
    </div>
  );
}
