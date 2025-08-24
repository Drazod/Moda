import React from "react";

// simple step icon
function Step({ active, label, children }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
      <div
        className={`grid h-10 w-12 place-items-center rounded-md border
          ${active ? "bg-white/70 border-black/30" : "bg-white/30 border-black/10"}`}
      >
        {children}
      </div>
      <span className={`text-sm ${active ? "text-[#2f2f2f] font-semibold" : "text-[#2f2f2f]/70"}`}>
        {label}
      </span>
    </div>
  );
}

// status: "prepare" | "ongoing" | "completed"
export default function OrderStatusCard({ items = [] }) {
  return (
    <section className="col-span-2 z-10">
        <div className="flex items-center justify-between px-1 md:px-2 mb-2">
            <h3 className="text-lg font-semibold">Current order status</h3>
        </div>
        <section
            className="col-span-2 rounded-2xl shadow z-10"
            style={{ background: "#BFAF92" }}
            >
            <div className="space-y-3 px-5 pb-5 pt-3">
                {items.map((o) => {
                const status = o.status || "prepare";
                return (
                    <div
                    key={o.id}
                    className="rounded-xl border border-black/10 bg-white/40 px-4 py-3"
                    >
                    {/* header row */}
                    <div className="grid grid-cols-5 items-center text-sm gap-2">
                        <span className="font-semibold">{o.id}</span>
                        <span>{o.item}</span>
                        <span>{o.date}</span>
                        <span>{o.price}</span>
                        <button className="grid h-6 w-6 place-items-center rounded-full border border-black/20">▾</button>
                    </div>
    
                    {/* steps */}
                    <div className="mt-3 flex items-center justify-between px-2">
                        <Step active={status === "prepare"}>
                        {/* box icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M4 7h16l-2 12H6L4 7Z" stroke="#2f2f2f" />
                            <path d="M4 7l8 5 8-5" stroke="#2f2f2f" />
                        </svg>
                        </Step>

                        <Step active={status === "ongoing"} label="On going">
                        {/* truck icon */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" stroke="#2f2f2f" />
                            <circle cx="7" cy="18" r="2" stroke="#2f2f2f" />
                            <circle cx="18" cy="18" r="2" stroke="#2f2f2f" />
                        </svg>
                        </Step>

                        <Step active={status === "completed"} label="Completed">
                        {/* flag icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 21V4m0 0h9l-2 3 2 3H6" stroke="#2f2f2f" />
                        </svg>
                        </Step>
                    </div>
                    </div>
                );
                })}
            </div>
        </section>
    </section>

  );
}
