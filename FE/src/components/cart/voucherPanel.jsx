import React from "react";
import discountImg from "../../assets/cart/discount.png";

export default function VoucherPanel({ onClose, onApply }) {
  const vouchers = [
    { id: "NEW50", title: "New Customer", subtitle: "Save 50%", img: discountImg },
    { id: "ANNIV50", title: "Anniversary 1st", subtitle: "Save 50%", img: discountImg },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[10000] bg-black/40" onClick={onClose} />
      <div
        className="absolute left-1/2 top-1/2 z-[10001] w-[min(500px,96vw)] -translate-x-1/2 -translate-y-1/2 overflow-auto  shadow-2xl ring-1 ring-black/10"
        style={{ background: "#E6DAC4" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h4 className="text-[22px] font-bold text-[#353535]">Available vouchers</h4>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-black/10 hover:bg-black/20"
          >
            ✕
          </button>
        </div>

        <div className="px-3 pb-3">
          {vouchers.map((v, i) => (
            <div key={v.id} className="flex items-center gap-3 py-3">
              <img src={v.img} alt="" className="h-20 w-20 object-contain" />
              <div className="min-w-0 flex-1">
                <p className="text-[20px] font-semibold text-[#353535] truncate">{v.title}</p>
                <p className="text-[18px] font-medium text-[#353535]">{v.subtitle}</p>
              </div>
              <button
                onClick={() => onApply(v.id)}
                className="rounded-full border border-black/30 px-4 py-1 text-[20px] font-medium hover:bg-black/10"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
