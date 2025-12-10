import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../../../configs/axiosInstance'; // Adjust path if needed
import CustomStatusDropdown from './CustomStatusDropDown';

const STATUS_OPTIONS = ["ORDERED", "SHIPPING", "COMPLETE"];


const STATUS_FILTERS = ["ALL", ...STATUS_OPTIONS];

const DashOMTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [statusFilterIdx, setStatusFilterIdx] = useState(0); // 0 = ALL
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/order/admin-list');
            if (Array.isArray(res.data?.orders)) {
                // Flatten orders into individual transaction details
                const flattenedOrders = res.data.orders.flatMap(order => 
                    (order.items || []).map(item => ({
                        orderId: order.orderId,
                        transactionDetailId: item.transactionDetailId,
                        customerName: order.customerName,
                        customerEmail: order.customerEmail,
                        item: `${item.clothesName} (${item.size})`,
                        quantity: item.originalQuantity,
                        unitPrice: item.unitPrice,
                        date: order.date,
                        time: order.time,
                        status: item.state,
                        method: order.method,
                        shippingAddress: item.shippingAddress,
                        refundStatus: item.refundStatus,
                    }))
                );
                setOrders(flattenedOrders);
            }
        } catch (err) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETE':
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

    const handleStatusChange = async (transactionDetailId, newStatus) => {
        try {
            await axiosInstance.put(`/shipping/${transactionDetailId}/state`, {
                transactionDetailId,
                state: newStatus,
            });
            setOrders((prev) =>
                prev.map((order) =>
                    order.transactionDetailId === transactionDetailId ? { ...order, status: newStatus } : order
                )
            );
            setEditingStatusId(null);
        } catch {
            alert('Failed to update status');
        }
    };

    // Filtering, searching, and sorting logic
    let filteredOrders = orders;
    const currentStatusFilter = STATUS_FILTERS[statusFilterIdx];
    if (currentStatusFilter !== "ALL") {
        filteredOrders = filteredOrders.filter((o) => o.status === currentStatusFilter);
    }
    if (search.trim() !== "") {
        const s = search.trim().toLowerCase();
        filteredOrders = filteredOrders.filter((o) =>
            o.orderId.toString().includes(s) ||
            (o.customerName && o.customerName.toLowerCase().includes(s)) ||
            (o.item && o.item.toLowerCase().includes(s))
        );
    }
    filteredOrders = [...filteredOrders].sort((a, b) => sortAsc ? a.transactionDetailId - b.transactionDetailId : b.transactionDetailId - a.transactionDetailId);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <input
                    type="text"
                    className="border px-3 py-2 rounded-md text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Search by Order Id or Customer Name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex justify-end space-x-4 mt-2 sm:mt-0">
                    <button
                        className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
                        onClick={() => setSortAsc((asc) => !asc)}
                    >
                        {sortAsc ? "Ascending Id" : "Descending Id"} <FaChevronDown className="ml-2 text-xs" />
                    </button>
                    <button
                        className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
                        onClick={() => setStatusFilterIdx((idx) => (idx + 1) % STATUS_FILTERS.length)}
                    >
                        Status: {currentStatusFilter} <FaChevronDown className="ml-2 text-xs" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-3 font-medium">Order Id</th>
                        <th className="py-3 font-medium">Item</th>
                        <th className="py-3 font-medium">Customer</th>
                        <th className="py-3 font-medium">Date</th>
                        <th className="py-3 font-medium">Status</th>
                        <th className="py-3 font-medium text-right">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-400">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-red-500">{error}</td>
                        </tr>
                    ) : filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-400">No orders found.</td>
                        </tr>
                    ) : (
                        filteredOrders.map((order) => (
                            <tr key={order.transactionDetailId} className="border-b last:border-b-0">
                                <td className="py-4 font-semibold">{order.orderId}</td>
                                <td className="py-4">{order.item} x{order.quantity}</td>
                                <td className="py-4">{order.customerName}</td>
                                <td className="py-4">{formatDate(order.date)}</td>
                                <td className="py-4">
                                    {editingStatusId === order.transactionDetailId ? (
                                    <CustomStatusDropdown
                                    value={order.status}
                                    options={STATUS_OPTIONS}
                                    onChange={(newStatus) => handleStatusChange(order.transactionDetailId, newStatus)}
                                    onBlur={() => setEditingStatusId(null)}
                                    getStatusClass={getStatusClass}
                                    />
                                    ) : (
                                        <span
                                            className={`px-3 py-1 text-sm rounded-full cursor-pointer ${getStatusClass(order.status)}`}
                                            onClick={() => setEditingStatusId(order.transactionDetailId)}
                                            title="Click to change status"
                                        >
                                            {order.status}
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 text-right">{formatPrice(order.unitPrice)}</td>
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