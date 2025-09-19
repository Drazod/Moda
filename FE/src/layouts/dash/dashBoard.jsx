import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../configs/axiosInstance';


// dashBoard's import
import DashBoardStat from '../../components/dash/dashBoard/dashBoardStat';
import DashBoardTopPd from '../../components/dash/dashBoard/dashBoardTopPd';
import DashBoardChart from '../../components/dash/dashBoard/dashBoardChart';
import DashBoardNotice from '../../components/dash/dashBoard/dashBoardNotice';

// dashBoard's icon
import { IoWalletOutline, IoBriefcaseOutline, IoTimeOutline, IoPeopleOutline } from 'react-icons/io5';
import { FaChevronDown } from 'react-icons/fa';

const fmtVND = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)
    : '—';

const changeLabel = (pct) => {
  if (pct == null) return '—';
  const v = Math.abs(pct).toFixed(1).replace(/\.0$/, '');
  return pct >= 0 ? `${v}% increase from previous period` : `${v}% decrease from previous period`;
};

const DashBoard_Main = () => {
  const [range, setRange] = useState('30d'); // '7d' | '30d' | '90d'
  const [openRange, setOpenRange] = useState(false);
  const [data, setData] = useState(null);       // response payload
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

useEffect(() => {
  let alive = true;
  let intervalId;

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await axiosInstance.get('/admin/overview', { params: { range } });
      if (alive) setData(data);
    } catch (e) {
      if (alive) setErr(e?.response?.data?.message || e?.message || 'Failed to load overview');
    } finally {
      if (alive) setLoading(false);
    }
  };
  fetchData();
  intervalId = setInterval(fetchData, 60000); // refresh every 60 seconds

  return () => {
    alive = false;
    clearInterval(intervalId);
  };
}, [range]);

  const overviewData = useMemo(() => {
    const k = data?.kpis;
    return [
      {
        key: 'revenue',
        title: 'Total revenue',
        value: fmtVND(k?.revenue?.total),
        change: changeLabel(k?.revenue?.changePct),
        changeType: (k?.revenue?.changePct ?? 0) >= 0 ? 'increase' : 'decrease',
        icon: <IoWalletOutline className="text-purple-500 text-2xl" />,
      },
      {
        key: 'products',
        title: 'Products',
        value: String(k?.products?.total ?? '—'),
        change: changeLabel(k?.products?.changePct),
        changeType: (k?.products?.changePct ?? 0) >= 0 ? 'increase' : 'decrease',
        icon: <IoBriefcaseOutline className="text-orange-500 text-2xl" />,
      },
      {
        key: 'time',
        title: 'Time spent',
        value: k?.timeSpentHrs != null ? `${k.timeSpentHrs} Hrs` : '—',
        change: '—',
        changeType: 'neutral',
        icon: <IoTimeOutline className="text-blue-500 text-2xl" />,
      },
      {
        key: 'customers',
        title: 'Customers',
        value: String(k?.customers?.total ?? '—'),
        change: changeLabel(k?.customers?.changePct),
        changeType: (k?.customers?.changePct ?? 0) >= 0 ? 'increase' : 'decrease',
        icon: <IoPeopleOutline className="text-yellow-500 text-2xl" />,
      },
    ];
  }, [data]);

  const rangeLabel = range === '7d' ? 'Last 7 days' : range === '90d' ? 'Last 90 days' : 'Last 30 days';

  return (
    <>
      {/* Overview */}
      <section>
        <div className="flex items-center justify-between mb-4 relative">
          <h2 className="text-2xl font-semibold">Overview</h2>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenRange((s) => !s)}
              className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center"
            >
              {rangeLabel} <FaChevronDown className="ml-2 text-xs" />
            </button>
            {openRange && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-md overflow-hidden z-10">
                {['7d', '30d', '90d'].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRange(r); setOpenRange(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${range === r ? 'font-semibold' : ''}`}
                  >
                    {r === '7d' ? 'Last 7 days' : r === '90d' ? 'Last 90 days' : 'Last 30 days'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {err && (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-3">
            {err}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
              ))
            : overviewData.map((item) => (
                <DashBoardStat
                  key={item.key}
                  title={item.title}
                  value={item.value}
                  change={item.change}
                  changeType={item.changeType}
                  icon={item.icon}
                />
              ))}
        </div>
      </section>

      {/* Main content */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        {/* Top selling products */}
        <DashBoardTopPd items={data?.topSellingProducts || []} loading={loading} />

        {/* If your chart needs series data, pass props here.
           The overview API doesn't return timeseries; you can show revenue total or fetch another endpoint. */}
        <DashBoardChart loading={loading} status={data?.webStatus} />
      </div>

      <DashBoardNotice />
    </>
  );
};

export default DashBoard_Main;
