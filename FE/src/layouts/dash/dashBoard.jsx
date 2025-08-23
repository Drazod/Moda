import React from 'react';

// dashBoard's import
import DashBoardStat from '../../components/dash/dashBoard/dashBoardStat';
import DashBoardTopPd from '../../components/dash/dashBoard/dashBoardTopPd';
import DashBoardChart from '../../components/dash/dashBoard/dashBoardChart';
import DashBoardNotice from '../../components/dash/dashBoard/dashBoardNotice';

// dashBoard's icon
import { IoWalletOutline, IoBriefcaseOutline, IoTimeOutline, IoPeopleOutline } from 'react-icons/io5';
import { FaChevronDown } from 'react-icons/fa';

// dashBoard
const DashBoard = () => {
  const overviewData = [
    {
      title: 'Total revenue',
      value: 'VND 53.009.890',
      change: '12% increase from last month',
      changeType: 'increase',
      icon: <IoWalletOutline className="text-purple-500 text-2xl" />,
    },
    {
      title: 'Products',
      value: '1000',
      change: '10% decrease from last month',
      changeType: 'decrease',
      icon: <IoBriefcaseOutline className="text-orange-500 text-2xl" />,
    },
    {
      title: 'Time spent',
      value: '1022 Hrs',
      change: '8% increase from last month',
      changeType: 'increase',
      icon: <IoTimeOutline className="text-blue-500 text-2xl" />,
    },
    {
      title: 'Customers',
      value: '100',
      change: '2% increase from last month',
      changeType: 'increase',
      icon: <IoPeopleOutline className="text-yellow-500 text-2xl" />,
    },
  ];

  return (
    <>
      {/* Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <button className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
            Last 30 days <FaChevronDown className="ml-2 text-xs" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewData.map((data, index) => (
            <DashBoardStat
              key={index}
              title={data.title}
              value={data.value}
              change={data.change}
              changeType={data.changeType}
              icon={data.icon}
            />
          ))}
        </div>
      </section>

      {/* Main content */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <DashBoardTopPd />
        <DashBoardChart />
      </div>
      <DashBoardNotice />
    </>
  );
};

export default DashBoard;