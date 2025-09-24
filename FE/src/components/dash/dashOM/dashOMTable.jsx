import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../../../configs/axiosInstance'; // Adjust path if needed

const STATUS_OPTIONS = ["ORDERED", "SHIPPING", "COMPLETE"];

const DashOMTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStatusId, setEditingStatusId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/order/admin-list');
            if (Array.isArray(res.data?.orders)) {
                setOrders(res.data.orders);
            }
        } catch (err) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-700';
            case 'ORDERED':
                return 'bg-yellow-100 text-yellow-700';
            case 'SHIPPING':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toLocaleString('vi-VN');
        }
        return price;
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/shipping/${orderId}/state`, {
                orderId,
                state: newStatus,
            });
            setOrders((prev) =>
                prev.map((order) =>
                    order.orderId === orderId ? { ...order, status: newStatus } : order
                )
            );
            setEditingStatusId(null);
        } catch {
            alert('Failed to update status');
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
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-red-500">{error}</td>
                        </tr>
                    ) : orders.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-400">No orders found.</td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.orderId} className="border-b last:border-b-0">
                                <td className="py-4 font-semibold">#{order.orderId}</td>
                                <td className="py-4">{order.customerName}</td>
                                <td className="py-4">{formatDate(order.date)}</td>
                                <td className="py-4">
                                    {editingStatusId === order.orderId ? (
                                        <select
                                            className="px-3 py-1 text-sm rounded-full border"
                                            value={order.status}
                                            onChange={e => handleStatusChange(order.orderId, e.target.value)}
                                            onBlur={() => setEditingStatusId(null)}
                                            autoFocus
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span
                                            className={`px-3 py-1 text-sm rounded-full cursor-pointer ${getStatusClass(order.status)}`}
                                            onClick={() => setEditingStatusId(order.orderId)}
                                            title="Click to change status"
                                        >
                                            {order.status}
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 text-right">{formatPrice(order.price)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            
            {/* Pagination (static for now) */}
            <div className="flex justify-center items-center mt-6 text-gray-600">
                <span>&lt;&lt;</span>
                <span className="mx-4 px-3 py-1 bg-orange-100 text-orange-600 rounded-md">1</span>
                <span>&gt;&gt;</span>
            </div>
        </div>
    );
};

export default DashOMTable;