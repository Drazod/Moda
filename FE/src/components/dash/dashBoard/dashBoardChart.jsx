import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

function clampPct(n) {
  const x = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, x));
}

const DashBoardChart = ({ loading = false, status }) => {
  // Expected shape from API:
  // status = { webLoadPct: number|null, totalConnects: number|null, customersActiveInRange: number|null, guests: number|null }
  const webLoad = clampPct(status?.webLoadPct ?? 0);
  const totalConnects = status?.totalConnects ?? 0;
  const customers = status?.customersActiveInRange ?? 0;
  const guests = status?.guests ?? Math.max(0, totalConnects - customers);

  // Simple gauge using conic-gradient
  const gaugeBg = {
    background: `conic-gradient(#22c55e ${webLoad}%, #e5e7eb ${webLoad}% 100%)`,
  };

  return (
    <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">Web status</h3>
        <button className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center">
          All <FaChevronDown className="ml-2 text-xs" />
        </button>
      </div>

      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-gray-100 animate-pulse mb-4" />
          <div className="h-6 w-24 bg-gray-100 animate-pulse rounded mb-6" />
          <div className="w-full flex justify-around mt-4">
            {[1,2,3].map(i => (
              <div key={i} className="text-center">
                <div className="h-7 w-10 bg-gray-100 animate-pulse rounded mx-auto mb-1" />
                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center">
          {/* Gauge */}
          <div
            className="relative w-36 h-36 rounded-full grid place-items-center"
            style={gaugeBg}
            aria-label="Web load gauge"
          >
            <div className="absolute inset-2 rounded-full bg-white" />
            <div className="relative text-center">
              <p className="text-5xl font-bold leading-none">{Math.round(webLoad)}%</p>
              <p className="text-gray-500">web-load</p>
            </div>
          </div>

          {/* Stats */}
          <div className="w-full flex justify-around mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalConnects.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Total connects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{customers.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{guests.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Guest</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardChart;
