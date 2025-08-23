import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DashOMTable from '../../components/dash/dashOM/dashOMTable';

const DashOM_Main = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Order manage</h2>
        <button className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm">
          Last 30 days <FaChevronDown className="ml-2 text-xs" />
        </button>
      </div>
      
      <DashOMTable />
    </>
  );
};

export default DashOM_Main;