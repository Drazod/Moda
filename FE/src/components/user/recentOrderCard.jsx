import React, { useState } from "react";

export default function RecentOrdersCard({ orders = [] }) {
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="col-span-1 z-10">
     {/* Header above card */}
      <div className="flex items-center justify-between px-1 md:px-2 mb-2">
        <h3 className="text-lg font-semibold">Recently order</h3>
        <a href="/transactions" className="text-sm font-medium text-[#7f76c2]">show full</a>
      </div>

      {/* Card box */}
      <section
        className="rounded-2xl shadow "
        style={{ background: "#BFAF92" }}
      >
        <div className="px-5 pb-5 pt-3">
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-y-3 text-base text-[#1D1A05]">
            <span className="font-semibold">Order Id</span>
            <span className="font-semibold">Date</span>
            <span className="font-semibold">Price</span>

            {paginatedOrders.map((o) => (
              <React.Fragment key={o.id}>
                <span className="text-[#7f76c2]">{o.id}</span>
                <span className="text-[#2f2f2f]/80">{o.date}</span>
                <span className="text-[#2f2f2f]/80">{o.price}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Dot-style pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pb-3">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-2 h-2 rounded-full focus:outline-none transition-all duration-150 ${page === i + 1 ? ' bg-white shadow' : 'bg-white/60'} flex items-center justify-center`}
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