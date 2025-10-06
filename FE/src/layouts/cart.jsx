import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import VoucherPanel from "../components/cart/voucherPanel";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../configs/axiosInstance";

const bg = "#E6DAC4";
const fieldBg = "#CDC2AF";
const railBg = "#BFAF92";
const darkBtn = "#434237";

const formatVND = (v) =>
  (Number(v) || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  }) + " VND";

export default function CartModal({ open, onClose }) {
  const { items, removeFromCart, updateQty } = useCart();
  const { user } = useAuth();
  // Points logic
  const [pointsToUse, setPointsToUse] = useState(0);
  const availablePoints = user?.points || 0;
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    message: "",
    payment: "store",
  });
  
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

  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(null);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (it.price ?? 0) * (it.qty ?? 0), 0),
    [items]
  );

  // Find cartId from items if present (assumes all items have same cartId)
  const cartId = items.length > 0 && items[0].cartId ? items[0].cartId : undefined;


  // Calculate total after voucher
  const totalAfterVoucher = useMemo(() => {
    if (!voucherDiscount) return subtotal;
    if (voucherDiscount < 1) return subtotal * (1 - voucherDiscount);
    return Math.max((subtotal * (100 - voucherDiscount)) / 100, 0);
  }, [subtotal, voucherDiscount]);

  // Calculate total after points
  const maxUsablePoints = Math.min(availablePoints, Math.floor(totalAfterVoucher));
  const pointsUsed = Math.min(pointsToUse, maxUsablePoints);
  const total = Math.max(totalAfterVoucher - pointsUsed, 0);

  const handleCheckout = async () => {
    if (!cartId) {
      alert("No cart ID found. Please add items to cart.");
      return;
    }
    try {
      const res = await axiosInstance.post("/vnpay/create-payment", {
        orderId: cartId,
        amount: total,
        orderType: "other",
        language: "vn",
        address: form.address,
        couponCode: selectedVoucher,
        pointsUsed: pointsUsed,
      });
      const paymentUrl = res.data.paymentUrl;
      window.location.href = paymentUrl;
    } catch (err) {
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const getMinQty = (item) => (item?.minQty ? item.minQty : 1);
  const getMaxQty = (item) => {
    if (item?.sizeId && item?.sizeStock) return item.sizeStock;
    if (item?.maxQty) return item.maxQty;
    return undefined;
  };

  const inc = (cartItemId) => {
    const item = items.find((it) => it.cartItemId === cartItemId);
    if (!item) return;
    const minQty = getMinQty(item);
    const maxQty = getMaxQty(item);

    // localStorage limit theo size
    let allowedQty;
    let totalQtyForThisSize = 0;
    try {
      const cartSizeQuantities = JSON.parse(localStorage.getItem("cartSizeQuantities")) || {};
      if (item.id && item.sizeId && cartSizeQuantities[item.id] && typeof cartSizeQuantities[item.id][item.sizeId] === "number") {
        allowedQty = cartSizeQuantities[item.id][item.sizeId];
      }
      totalQtyForThisSize = items
        .filter((it) => it.id === item.id && it.sizeId === item.sizeId)
        .reduce((sum, it) => sum + it.qty, 0);
    } catch {}

    if (typeof allowedQty === "number" && totalQtyForThisSize >= allowedQty) {
      alert(`You cannot add more than ${allowedQty} for this size.`);
      return;
    }
    if (typeof maxQty === "number" && item.qty >= maxQty) {
      alert(`Only ${maxQty} left in stock for this size.`);
      return;
    }
    if (item.qty < minQty) {
      alert(`Minimum quantity required is ${minQty}`);
      return;
    }
    updateQty(cartItemId, item.qty + 1);
  };

  const dec = (cartItemId) => {
    const item = items.find((it) => it.cartItemId === cartItemId);
    if (!item) return;
    const minQty = getMinQty(item);
    if (item.qty > minQty) updateQty(cartItemId, item.qty - 1);
  };

  const removeItem = (id, color, size, cartItemId) => {
    removeFromCart(id, color, size, cartItemId);
  };

  const handleForm = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  if (!open && open !== undefined) return null;

  const totalQty = items.reduce((sum, it) => sum + (it.qty ?? 0), 0);

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
                          disabled={(() => {
                            const maxQty = getMaxQty(it);
                            let allowedQty;
                            let totalQtyForThisSize = 0;
                            try {
                              const cartSizeQuantities = JSON.parse(localStorage.getItem("cartSizeQuantities")) || {};
                              if (it.id && it.sizeId && cartSizeQuantities[it.id] && typeof cartSizeQuantities[it.id][it.sizeId] === "number") {
                                allowedQty = cartSizeQuantities[it.id][it.sizeId];
                              }
                              totalQtyForThisSize = items
                                .filter((itm) => itm.id === it.id && itm.sizeId === it.sizeId)
                                .reduce((sum, itm) => sum + itm.qty, 0);
                            } catch {}
                            if (typeof allowedQty === "number" && totalQtyForThisSize >= allowedQty) return true;
                            if (typeof maxQty === "number" && it.qty >= maxQty) return true;
                            return false;
                          })()}
                          style={(() => {
                            const maxQty = getMaxQty(it);
                            let allowedQty;
                            let totalQtyForThisSize = 0;
                            try {
                              const cartSizeQuantities = JSON.parse(localStorage.getItem("cartSizeQuantities")) || {};
                              if (it.id && it.sizeId && cartSizeQuantities[it.id] && typeof cartSizeQuantities[it.id][it.sizeId] === "number") {
                                allowedQty = cartSizeQuantities[it.id][it.sizeId];
                              }
                              totalQtyForThisSize = items
                                .filter((itm) => itm.id === it.id && itm.sizeId === it.sizeId)
                                .reduce((sum, itm) => sum + itm.qty, 0);
                            } catch {}
                            if (
                              (typeof allowedQty === "number" && totalQtyForThisSize >= allowedQty) ||
                              (typeof maxQty === "number" && it.qty >= maxQty)
                            ) {
                              return { opacity: 0.5, cursor: "not-allowed" };
                            }
                            return {};
                          })()}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  {i !== items.length - 1 && <div className="mt-4 h-px w-full bg-black/15" />}
                </div>
              );
            })}

            {/* payment / offers row */}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-3 ">
                <span className="text-base font-medium">Payment:</span>
                <div className="relative">
                  <select
                    name="payment"
                    value={form.payment}
                    onChange={handleForm}
                    className="h-8 rounded-md border border-black/20 bg-[#CDC2AF] px-3 pr-6"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  >
                    <option value="store">Take at store</option>
                    <option value="card">Card</option>
                    <option value="cod">Cash on delivery</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">▾</span>
                </div>
              </div>

              <div className="h-7 w-px text-sm bg-black/20" />

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

        {/* footer rail */}
        <div className="mx-5 mb-5 pt-4" style={{ background: railBg }}>
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
                onChange={e => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 0) val = 0;
                  if (val > maxUsablePoints) val = maxUsablePoints;
                  setPointsToUse(val);
                }}
                className="w-24 px-2 py-1 rounded border border-gray-300 text-right"
                style={{ background: fieldBg }}
              />
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
              <button className="flex-1 rounded-full border border-black/30 bg-[#CDC2AF] py-3 text-[15px] font-medium text-[#2f2f2f] hover:bg-black/10">
                Continue Shopping
              </button>
              <button
                className="flex-1 rounded-full py-3 text-[15px] font-semibold text-white hover:opacity-95"
                style={{ background: darkBtn }}
                onClick={handleCheckout}
              >
                Check Out
              </button>
            </div>

            <p className="mt-3 text-center text-[11px] text-black/60">
              By selecting “Check Out” you are agreeing to our{" "}
              <a href="#" className="underline">
                Terms & Conditions
              </a>
            </p>
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
    </div>
  );
}
