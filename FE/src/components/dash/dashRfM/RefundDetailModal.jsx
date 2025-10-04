import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axiosInstance from '../../../configs/axiosInstance';

const RefundDetailModal = ({ refund, onClose, onUpdate }) => {
    const [status, setStatus] = useState(refund.status);
    const [adminNote, setAdminNote] = useState(refund.adminNote || '');
    const [loading, setLoading] = useState(false);

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'APPROVED':
                return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'REJECTED':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'COMPLETED':
                return 'bg-green-100 text-green-700 border-green-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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

    const handleUpdateRefund = async () => {
        if (status === refund.status && adminNote === (refund.adminNote || '')) {
            onClose();
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.put(`/refund/admin/process/${refund.id}`, {
                status,
                adminNote
            });

            const updatedRefund = {
                ...refund,
                status,
                adminNote,
                updatedAt: new Date().toISOString()
            };

            onUpdate(updatedRefund);
            alert('Refund updated successfully');
        } catch (err) {
            alert('Failed to update refund');
            console.error('Update refund error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Refund Request Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Refund Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Refund ID</label>
                            <p className="text-lg font-semibold">#{refund.id}</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-600">Current Status</label>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(refund.status)}`}>
                                {refund.status}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Request Date</label>
                            <p className="text-gray-800">{formatDate(refund.createdAt)}</p>
                        </div>

                        {refund.updatedAt !== refund.createdAt && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                <p className="text-gray-800">{formatDate(refund.updatedAt)}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Customer</label>
                            <p className="text-gray-800 font-medium">{refund.user?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{refund.user?.email}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Refund Amount</label>
                            <p className="text-lg font-semibold text-green-600">{formatPrice(refund.refundAmount)}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Points to Return</label>
                            <p className="text-gray-800">{refund.pointsReturned || 0} points</p>
                        </div>
                    </div>
                </div>

                {/* Item Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Item Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Product Name</label>
                            <p className="text-gray-800">{refund.transactionDetail?.clothes?.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Size</label>
                            <p className="text-gray-800">{refund.transactionDetail?.size?.label}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Quantity to Refund</label>
                            <p className="text-gray-800">{refund.quantity}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Original Order</label>
                            <p className="text-gray-800">#{refund.transactionDetail?.transaction?.id}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Reason */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-600">Customer's Reason</label>
                    <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-gray-800">{refund.reason || 'No reason provided'}</p>
                    </div>
                </div>

                {/* Admin Controls */}
                <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Admin Actions</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Update Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                <option value="PENDING">Pending Review</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Admin Notes
                            </label>
                            <textarea
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                rows="4"
                                placeholder="Add notes about this refund decision..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateRefund}
                            disabled={loading || (status === refund.status && adminNote === (refund.adminNote || ''))}
                            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Refund'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundDetailModal;