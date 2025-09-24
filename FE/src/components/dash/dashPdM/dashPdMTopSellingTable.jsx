import React, { useEffect, useMemo, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../../../configs/axiosInstance';

function fmtDate(input) {
    if (!input) return '—';
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    }).format(d);
}

const DashPdMTopSellingTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get('/report/products-sales');
                setProducts(res.data || []);
            } catch (err) {
                setError('Failed to load top selling products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Build category list from products
    const categories = useMemo(() => {
        const set = new Set(
            products.map((i) => (i.category?.name ? i.category.name : 'Uncategorized'))
        );
        return ['All', ...Array.from(set).sort()];
    }, [products]);

    // Filter and sort products
    const filtered = useMemo(() => {
        const rows = category === 'All'
            ? products
            : products.filter(
                    (i) => (i.category?.name || 'Uncategorized') === category
                );
        // Sort by totalSold/order count desc
        return [...rows].sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0));
    }, [products, category]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full mb-8">
            <div className="flex justify-between items-center mb-4 relative">
                <h3 className="font-bold text-xl">Top selling products</h3>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen((s) => !s)}
                        className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
                    >
                        {category} <FaChevronDown className="ml-2 text-xs" />
                    </button>
                    {open && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-md overflow-hidden z-10">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => {
                                        setCategory(c);
                                        setOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                        category === c ? 'font-semibold' : ''
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-3 font-medium">Name</th>
                        <th className="py-3 font-medium">Category</th>
                        <th className="py-3 font-medium">Last buy date</th>
                        <th className="py-3 font-medium text-right">Total sold</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-b last:border-b-0">
                                <td className="py-4">
                                    <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
                                </td>
                                <td className="py-4">
                                    <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                                </td>
                                <td className="py-4">
                                    <div className="h-4 w-28 bg-gray-100 animate-pulse rounded" />
                                </td>
                                <td className="py-4 text-right">
                                    <div className="h-4 w-16 bg-gray-100 animate-pulse rounded ml-auto" />
                                </td>
                            </tr>
                        ))
                    ) : error ? (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-red-500">
                                {error}
                            </td>
                        </tr>
                    ) : filtered.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-500">
                                No products found for this filter.
                            </td>
                        </tr>
                    ) : (
                        filtered.map((p) => (
                            <tr key={p.id ?? `${p.name}-${p.category?.name}`}
                                    className="border-b last:border-b-0">
                                <td className="py-4">{p.name}</td>
                                <td className="py-4">{p.category?.name || 'Uncategorized'}</td>
                                <td className="py-4">{fmtDate(p.lastBuyDate)}</td>
                                <td className="py-4 text-right">{(p.totalSold ?? 0).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DashPdMTopSellingTable;