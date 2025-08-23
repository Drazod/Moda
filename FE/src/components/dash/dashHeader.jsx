import React from 'react';
import { FaChevronDown, FaBell } from 'react-icons/fa';

const DashHeader = () => {
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="Search for anything..." 
          className="w-80 px-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="p-3 bg-white rounded-full shadow-sm cursor-pointer">
          <FaBell className="text-gray-600 text-xl" />
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-full shadow-sm cursor-pointer">
          <img 
            src="https://via.placeholder.com/40"
            alt="User Avatar" 
            className="w-10 h-10 rounded-full" 
          />
          <div>
            <p className="font-semibold text-sm">Alex meian</p>
            <p className="text-xs text-gray-500">Product manager</p>
          </div>
          <FaChevronDown className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default DashHeader;