import React from 'react';

// To be continued
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = ({ icon, title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';
  const ChangeIcon = isIncrease ? FaArrowUp : FaArrowDown;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500">{title}</span>
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-2">{value}</h2>
        <div className={`flex items-center text-sm ${changeColor}`}>
          <ChangeIcon className="mr-1" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;