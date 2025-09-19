import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../../../configs/axiosInstance';

const DashPdMTopSellingTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get('/clothes/list');
                // Sort by quantity/order count if available, else fallback to id
                const sorted = [...res.data].sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0));
                setProducts(sorted.slice(0, 10)); // Top 10
            } catch (err) {
                setError('Failed to load top selling products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

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
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
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
                            <tr key={p.id || i} className="border-b last:border-b-0">
                                <td className="py-4">{p.name}</td>
                                <td className="py-4">{p.category?.name || '-'}</td>
                                <td className="py-4">{p.lastBuyDate ? new Date(p.lastBuyDate).toLocaleDateString() : '-'}</td>
                                <td className="py-4 text-right">{p.quantity ?? '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashPdMTopSellingTable;