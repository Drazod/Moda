import React, { useState } from "react";

// simple step icon
function Step({ active, label, children, color }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
      <div
        className={`grid h-10 w-12 place-items-center rounded-md border transition-all duration-200
          ${active ? `bg-white border-${color}` : "bg-white/30 border-black/10"}`}
      >
        {children}
      </div>
      <span className={`text-sm ${active ? `text-${color} font-semibold` : "text-[#2f2f2f]/70"}`}>
        {label}
      </span>
    </div>
  );
}

// status: "prepare" | "ongoing" | "completed"
function OrderStatusCard({ items = [] }) {
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paginatedItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // Map status to pretty label and color
  const statusMap = {
    prepare: { label: "ORDERED", color: "green-600" },
    ongoing: { label: "SHIPPING", color: "gray-700" },
    completed: { label: "COMPLETED", color: "black" },
  };
  const [minimized, setMinimized] = useState({});

  const toggleMinimize = (id) => {
    setMinimized((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
          {paginatedItems.map((o) => {
            const status = o.status || "prepare";
            const pretty = statusMap[status] || statusMap.prepare;
            const isMin = minimized[o.id];
            return (
              <div
                key={o.id}
                className="rounded-xl border border-black/10 bg-white/40 px-4 py-3"
              >
                {/* header row */}
                <div className="grid text-[#060606] font-medium font-Jsans grid-cols-[1fr_1fr_1fr_1fr_auto] items-center text-sm gap-2">
                  <span >{o.id}</span>
                  <span>{o.item}</span>
                  <span>{o.date}</span>
                  <span>{o.price}</span>
                  <div className="flex justify-end">
                    <button
                      className="grid h-6 w-6 place-items-center rounded-full border border-black/20 transition-transform duration-200"
                      onClick={() => toggleMinimize(o.id)}
                      aria-label={isMin ? "Expand" : "Minimize"}
                    >
                      <svg
                        className={isMin ? "rotate-180" : ""}
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path d="M5 8l5 5 5-5" stroke="#2f2f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* steps row */}
                {!isMin && (
                  <div className="mt-3 flex items-center justify-between px-2">
                    <Step active={status === "ORDERED"} label={<span className="text-green-600">Prepare</span>} color="green-600">
                      {/* box icon */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7h16l-2 12H6L4 7Z" stroke="#2f2f2f" />
                        <path d="M4 7l8 5 8-5" stroke="#2f2f2f" />
                      </svg>
                    </Step>
                    <Step active={status === "SHIPPING"} label={<span className="text-gray-700">On going</span>} color="gray-700">
                      {/* truck icon */}
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" stroke="#2f2f2f" />
                        <circle cx="7" cy="18" r="2" stroke="#2f2f2f" />
                        <circle cx="18" cy="18" r="2" stroke="#2f2f2f" />
                      </svg>
                    </Step>
                    <Step active={status === "COMPLETED"} label={<span className="text-black">Completed</span>} color="black">
                      {/* flag icon */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M6 21V4m0 0h9l-2 3 2 3H6" stroke="#2f2f2f" />
                      </svg>
                    </Step>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Dot-style pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-[-8px]">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-2 h-2 rounded-full focus:outline-none transition-all duration-150 ${page === i + 1 ? 'border-2 border-black bg-white shadow' : 'bg-white/60'} flex items-center justify-center`}
                aria-label={`Go to page ${i + 1}`}
              >
                {/* Empty for dot, border for active */}
              </button>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
export default OrderStatusCard;
