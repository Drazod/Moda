import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const DashOMTable = () => {
    const orders = [
        { id: 1234, customer: 'Nguyen Van A', date: 'Sep 17, 2024', status: 'Completed', price: '200.000' },
        { id: 1235, customer: 'Nguyen Van A', date: 'Sep 18, 2024', status: 'Completed', price: '200.000' },
        { id: 1236, customer: 'Nguyen Van A', date: 'Sep 19, 2024', status: 'Completed', price: '200.000' },
        { id: 1237, customer: 'Nguyen Van A', date: 'Sep 20, 2024', status: 'Completed', price: '200.000' },
        { id: 1238, customer: 'Nguyen Van A', date: 'Sep 21, 2024', status: 'Completed', price: '200.000' },
        { id: 1239, customer: 'Nguyen Van A', date: 'Dec 10, 2024', status: 'Prepared', price: '200.000' },
        { id: 1240, customer: 'Nguyen Van A', date: 'Dec 11, 2024', status: 'On going', price: '200.000' },
        { id: 1241, customer: 'Nguyen Van A', date: 'Dec 12, 2024', status: 'On going', price: '200.000' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-700';
            case 'Prepared':
                return 'bg-yellow-100 text-yellow-700';
            case 'On going':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            {/* Filter */}
            <div className="flex justify-end space-x-4 mb-4">
                <button className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center">
                    Ascending Id <FaChevronDown className="ml-2 text-xs" />
                </button>
                <button className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center">
                    Status <FaChevronDown className="ml-2 text-xs" />
                </button>
            </div>

            {/* Table */}
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-3 font-medium">Order Id</th>
                        <th className="py-3 font-medium">Customer name</th>
                        <th className="py-3 font-medium">Date</th>
                        <th className="py-3 font-medium">Status</th>
                        <th className="py-3 font-medium text-right">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b last:border-b-0">
                            <td className="py-4 font-semibold">{order.id}</td>
                            <td className="py-4">{order.customer}</td>
                            <td className="py-4">{order.date}</td>
                            <td className="py-4">
                                <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="py-4 text-right">{order.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 text-gray-600">
                <span>&lt;&lt;</span>
                <span className="mx-4 px-3 py-1 bg-orange-100 text-orange-600 rounded-md">1</span>
                <span>&gt;&gt;</span>
            </div>
        </div>
    );
};

export default DashOMTable;