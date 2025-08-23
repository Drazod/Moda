import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const DashBoardChart = () => {
  return (
    <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">Web status</h3>
        <button className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center">
          All <FaChevronDown className="ml-2 text-xs" />
        </button>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Placeholder*/}
        <div className="text-center my-6">
          <p className="text-5xl font-bold">72%</p>
          <p className="text-gray-500">web-load</p>
          <p className="text-sm mt-4 italic text-gray-400">(Biểu đồ dạng cung sẽ hiển thị ở đây)</p>
        </div>
        <div className="w-full flex justify-around mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold">61</p>
            <p className="text-gray-500 text-sm">Total connects</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">26</p>
            <p className="text-gray-500 text-sm">Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">35</p>
            <p className="text-gray-500 text-sm">Guest</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardChart;