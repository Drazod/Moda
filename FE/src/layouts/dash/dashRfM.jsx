import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DashRfMTable from '../../components/dash/dashRfM/dashRfMTable';

const DashRfM_Main = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Refund Management</h2>
        <button className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm">
          All refund requests <FaChevronDown className="ml-2 text-xs" />
        </button>
      </div>
      
      <DashRfMTable />
    </>
  );
};

export default DashRfM_Main;