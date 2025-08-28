import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const DashPdMTopSellingTable = () => {
    const products = [
        { name: 'Shirt', category: 'Shirt', lastBuyDate: 'May 25, 2023', quantity: 1000 },
        { name: 'T-Shirt', category: 'T-Shirt', lastBuyDate: 'Jun 20, 2023', quantity: 1000 },
        // {/* To be continued  */}
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">Top selling</h3>
                <div className="flex items-center space-x-4">
                    <button className="bg-gray-100 px-4 py-2 rounded-full text-sm">Last 30 days</button>
                    <button className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center">
                        Category <FaChevronDown className="ml-2 text-xs" />
                    </button>
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
                    {products.map((p, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            <td className="py-4">{p.name}</td>
                            <td className="py-4">{p.category}</td>
                            <td className="py-4">{p.lastBuyDate}</td>
                            <td className="py-4 text-right">{p.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashPdMTopSellingTable;