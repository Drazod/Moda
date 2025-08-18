import React, { useMemo, useState } from "react";
import VoucherPanel from "../components/cart/voucherPanel";

const bg = "#E6DAC4";          // modal bg
const fieldBg = "#CDC2AF";      // input bg
const railBg = "#BFAF92";       // subtotal rail
const darkBtn = "#434237";      // checkout button

export default function CartModal({ open, onClose }) {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Vegan Chocolate Chip Cookie Dough",
      price: 12.99,
      qty: 1,
      image: "/images/demo/cookie1.png",
    },
    {
      id: 2,
      name: "Vegan Peanut Butter Cookie Dough",
      price: 11.05,
      qty: 2,
      image: "/images/demo/cookie2.png",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    message: "",
    payment: "store",
  });
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );

  const inc = (id) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );

  const dec = (id) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const handleForm = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] font-Jsans">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* sheet */}
      <div
        className="absolute left-1/2 top-1/2 w-[min(1000px,96vw)] -translate-x-1/2 -translate-y-1/2 shadow-2xl ring-1 ring-black/10"
        style={{ background: bg }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <h3 className="text-2xl font-medium tracking-[0.02em] text-[#353535]">
            Your cart <span className="opacity-40">(3)</span>
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-black/15 text-[#3a3936] hover:bg-black/25"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="grid grid-cols-1 gap-10 px-6 pb-6 pt-4 lg:grid-cols-[1fr_1fr]">
          {/* LEFT – items list */}
          <div className="space-y-4 font-medium text-base">
            {items.map((it, i) => (
              <div key={it.id} className="pb-2">
                <div className="grid grid-cols-[80px_1fr_auto] items-center gap-2">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div>
                    <p className=" leading-snug ">
                      {it.name}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(it.id)}
                    className="ml-auto h-8 w-8 rounded-full hover:bg-black/10 "
                    aria-label="Remove"
                    title="Remove"
                  >
                    🗑
                  </button>

                  {/* price & qty line */}
                  <div className="col-start-2">
                    <p className="">
                      ${it.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="col-start-3 flex items-center justify-end">
                    <div className="flex items-center rounded-full border border-black/20 bg-[#efe5d6] px-2">
                      <button
                        onClick={() => dec(it.id)}
                        className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/10"
                        aria-label="Decrease"
                      >
                        –
                      </button>
                      <div className="w-9 text-center">{it.qty}</div>
                      <button
                        onClick={() => inc(it.id)}
                        className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/10"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* divider */}
                {i !== items.length - 1 && (
                  <div className="mt-4 h-px w-full bg-black/15" />
                )}
              </div>
            ))}

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
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                    ▾
                  </span>
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
        <div
          className="mx-5 mb-5 pt-4"
          style={{ background: railBg }}
        >
          <div className="mx-1 p-4">
            <div className="mb-3 flex items-center justify-between text-[15px] text-[#2f2f2f]">
              <span className="font-medium">Sub Total</span>
              <span className="font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 rounded-full border border-black/30 bg-[#CDC2AF] py-3 text-[15px] font-medium text-[#2f2f2f] hover:bg-black/10">
                Continue Shopping
              </button>
              <button
                className="flex-1 rounded-full py-3 text-[15px] font-semibold text-white hover:opacity-95"
                style={{ background: darkBtn }}
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
        onApply={(voucherName) => {
          setSelectedVoucher(voucherName);   // 👈 store voucher name
          setShowVouchers(false);
        }}
      />
    )}
    </div>
  );
}
