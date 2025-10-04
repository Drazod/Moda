import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../../configs/axiosInstance';
import RefundDetailModal from './RefundDetailModal';

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];
const STATUS_FILTERS = ["ALL", ...STATUS_OPTIONS];

const DashRfMTable = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [sortAsc, setSortAsc] = useState(false); // Show newest first
    const [statusFilterIdx, setStatusFilterIdx] = useState(0); // 0 = ALL
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchRefunds();
    }, []);

    const fetchRefunds = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/refund/admin/all');
            if (Array.isArray(res.data?.refunds)) {
                setRefunds(res.data.refunds);
            }
        } catch (err) {
            setError('Failed to fetch refund requests');
            console.error('Fetch refunds error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700';
            case 'APPROVED':
                return 'bg-blue-100 text-blue-700';
            case 'REJECTED':
                return 'bg-red-100 text-red-700';
            case 'COMPLETED':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toLocaleString('vi-VN') + ' VND';
        }
        return price;
    };

    const handleQuickAction = async (refundId, action, note = '') => {
        try {
            await axiosInstance.put(`/refund/admin/process/${refundId}`, {
                status: action,
                adminNote: note
            });
            
            // Update local state
            setRefunds(prev => prev.map(refund => 
                refund.id === refundId 
                    ? { ...refund, status: action, adminNote: note, updatedAt: new Date().toISOString() }
                    : refund
            ));
            
            alert(`Refund ${action.toLowerCase()} successfully`);
        } catch (err) {
            alert('Failed to update refund status');
            console.error('Update refund error:', err);
        }
    };

    const handleViewDetails = (refund) => {
        setSelectedRefund(refund);
        setShowDetailModal(true);
    };

    // Filtering, searching, and sorting logic
    let filteredRefunds = refunds;
    const currentStatusFilter = STATUS_FILTERS[statusFilterIdx];
    if (currentStatusFilter !== "ALL") {
        filteredRefunds = filteredRefunds.filter((r) => r.status === currentStatusFilter);
    }
    if (search.trim() !== "") {
        const s = search.trim().toLowerCase();
        filteredRefunds = filteredRefunds.filter((r) =>
            r.id.toString().includes(s) ||
            (r.user?.name && r.user.name.toLowerCase().includes(s)) ||
            (r.user?.email && r.user.email.toLowerCase().includes(s)) ||
            (r.transactionDetail?.clothes?.name && r.transactionDetail.clothes.name.toLowerCase().includes(s))
        );
    }
    
    filteredRefunds = [...filteredRefunds].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <input
                    type="text"
                    className="border px-3 py-2 rounded-md text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Search by Refund ID, Customer, or Item..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex justify-end space-x-4 mt-2 sm:mt-0">
                    <button
                        className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
                        onClick={() => fetchRefunds()}
                        title="Refresh data"
                    >
                        Refresh
                    </button>
                    <button
                        className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
                        onClick={() => setSortAsc((asc) => !asc)}
                    >
                        {sortAsc ? "Oldest First" : "Newest First"} <FaChevronDown className="ml-2 text-xs" />
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
                        <th className="py-3 font-medium">Refund ID</th>
                        <th className="py-3 font-medium">Customer</th>
                        <th className="py-3 font-medium">Item</th>
                        <th className="py-3 font-medium">Quantity</th>
                        <th className="py-3 font-medium">Amount</th>
                        <th className="py-3 font-medium">Status</th>
                        <th className="py-3 font-medium">Date</th>
                        <th className="py-3 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={8} className="py-8 text-center text-gray-400">Loading refund requests...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={8} className="py-8 text-center text-red-500">{error}</td>
                        </tr>
                    ) : filteredRefunds.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="py-8 text-center text-gray-400">No refund requests found.</td>
                        </tr>
                    ) : (
                        filteredRefunds.map((refund) => (
                            <tr key={refund.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                <td className="py-4 font-semibold">#{refund.id}</td>
                                <td className="py-4">
                                    <div>
                                        <div className="font-medium">{refund.user?.name || 'N/A'}</div>
                                        <div className="text-xs text-gray-500">{refund.user?.email}</div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div>
                                        <div className="font-medium">{refund.transactionDetail?.clothes?.name}</div>
                                        <div className="text-xs text-gray-500">
                                            Size: {refund.transactionDetail?.size?.label} | 
                                            Order: #{refund.transactionDetail?.transaction?.id}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">{refund.quantity}</td>
                                <td className="py-4 font-semibold">{formatPrice(refund.refundAmount)}</td>
                                <td className="py-4">
                                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(refund.status)}`}>
                                        {refund.status}
                                    </span>
                                </td>
                                <td className="py-4 text-sm">{formatDate(refund.createdAt)}</td>
                                <td className="py-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleViewDetails(refund)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye size={14} />
                                        </button>
                                        {refund.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleQuickAction(refund.id, 'APPROVED', 'Quick approval')}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                                    title="Quick Approve"
                                                >
                                                    <FaCheck size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleQuickAction(refund.id, 'REJECTED', 'Quick rejection')}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                                    title="Quick Reject"
                                                >
                                                    <FaTimes size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            
            {/* Summary */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                <span>Showing {filteredRefunds.length} refund requests</span>
                <div className="flex gap-4">
                    <span>Pending: {refunds.filter(r => r.status === 'PENDING').length}</span>
                    <span>Approved: {refunds.filter(r => r.status === 'APPROVED').length}</span>
                    <span>Rejected: {refunds.filter(r => r.status === 'REJECTED').length}</span>
                    <span>Completed: {refunds.filter(r => r.status === 'COMPLETED').length}</span>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedRefund && (
                <RefundDetailModal
                    refund={selectedRefund}
                    onClose={() => setShowDetailModal(false)}
                    onUpdate={(updatedRefund) => {
                        setRefunds(prev => prev.map(r => 
                            r.id === updatedRefund.id ? updatedRefund : r
                        ));
                        setShowDetailModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default DashRfMTable;