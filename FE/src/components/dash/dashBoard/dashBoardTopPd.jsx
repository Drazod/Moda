import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const DashBoardTopPd = () => {
  
  // To be continued
  const products = [
    { name: 'Shirt', category: 'Shirt', lastBuyDate: 'May 25, 2023', quantity: 1000 },
    { name: 'T-Shirt', category: 'T-Shirt', lastBuyDate: 'Jun 20, 2023', quantity: 1000 },
    { name: 'Short', category: 'Short', lastBuyDate: 'July 13, 2023', quantity: 1000 },
    { name: 'Jeans', category: 'Jeans', lastBuyDate: 'Dec 20, 2023', quantity: 1000 },
    { name: 'Jacket', category: 'Jacket', lastBuyDate: 'Mar 15, 2024', quantity: 1000 },
  ];

  return (
    <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">Top selling products</h3>
        <button className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center">
          Category <FaChevronDown className="ml-2 text-xs" />
        </button>
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
          {products.map((product, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="py-4">{product.name}</td>
              <td className="py-4">{product.category}</td>
              <td className="py-4">{product.lastBuyDate}</td>
              <td className="py-4 text-right">{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashBoardTopPd;