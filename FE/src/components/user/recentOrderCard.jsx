import React from "react";

export default function RecentOrdersCard({ orders = [] }) {
  return (
    <section className="col-span-1 z-10">
     {/* Header above card */}
      <div className="flex items-center justify-between px-1 md:px-2 mb-2">
        <h3 className="text-lg font-semibold">Recently order</h3>
        <button className="text-sm font-medium text-[#7f76c2]">show full</button>
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

            {orders.map((o) => (
              <React.Fragment key={o.id}>
                <span className="text-[#7f76c2]">{o.id}</span>
                <span className="text-[#2f2f2f]/80">{o.date}</span>
                <span className="text-[#2f2f2f]/80">{o.price}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
