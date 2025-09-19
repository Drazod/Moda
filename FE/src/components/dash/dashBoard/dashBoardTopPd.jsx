import React, { useMemo, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

function fmtDate(input) {
  if (!input) return '—';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
}

const DashBoardTopPd = ({ items = [], loading = false }) => {
  // items shape expected from API:
  // { id, name, category, lastBuyDate, orderQuantity }

  const categories = useMemo(() => {
    const set = new Set(
      items.map((i) => (i.category ? i.category : 'Uncategorized'))
    );
    return ['All', ...Array.from(set).sort()];
  }, [items]);

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const rows = category === 'All'
      ? items
      : items.filter(
          (i) => (i.category || 'Uncategorized') === category
        );

    // ensure deterministic order (desc by orderQuantity)
    return [...rows].sort((a, b) => (b.orderQuantity ?? 0) - (a.orderQuantity ?? 0));
  }, [items, category]);

  return (
    <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4 relative">
        <h3 className="font-bold text-xl">Top selling products</h3>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
          >
            {category} <FaChevronDown className="ml-2 text-xs" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-md overflow-hidden z-10">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    category === c ? 'font-semibold' : ''
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-3 font-medium">Name</th>
            <th className="py-3 font-medium">Category</th>
            <th className="py-3 font-medium">Last buy date</th>
            <th className="py-3 font-medium text-right">Order quantity</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            // skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="py-4">
                  <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
                </td>
                <td className="py-4">
                  <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                </td>
                <td className="py-4">
                  <div className="h-4 w-28 bg-gray-100 animate-pulse rounded" />
                </td>
                <td className="py-4 text-right">
                  <div className="h-4 w-16 bg-gray-100 animate-pulse rounded ml-auto" />
                </td>
              </tr>
            ))
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-500">
                No products found for this filter.
              </td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr key={p.id ?? `${p.name}-${p.category}`} className="border-b last:border-b-0">
                <td className="py-4">{p.name}</td>
                <td className="py-4">{p.category || 'Uncategorized'}</td>
                <td className="py-4">{fmtDate(p.lastBuyDate)}</td>
                <td className="py-4 text-right">
                  {(p.orderQuantity ?? 0).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DashBoardTopPd;
