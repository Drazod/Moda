import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../configs/axiosInstance';
import { IoPencil, IoTrashOutline } from 'react-icons/io5';

const DashUptNVouchersTable = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ couponCode: '', description: '', discount: '', expiryDate: '', stock: '' });
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosInstance.get('/coupon/admin-list');
            setCoupons(res.data.coupons || []);
        } catch (err) {
            setError('Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (coupon) => {
        setEditingId(coupon.id);
        setForm({
            couponCode: coupon.couponCode,
            description: coupon.description,
            discount: coupon.discount,
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 10) : '',
            stock: coupon.stock,
        });
        setIsActive(coupon.isActive);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/coupon/${editingId}`, {
                ...form,
                discount: Number(form.discount),
                stock: Number(form.stock),
                isActive,
                expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
            });
            setEditingId(null);
            setForm({ couponCode: '', description: '', discount: '', expiryDate: '', stock: '' });
            fetchCoupons();
        } catch {
            alert('Failed to update coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        try {
            await axiosInstance.delete(`/coupon/${id}`);
            fetchCoupons();
        } catch {
            alert('Failed to delete coupon');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            {/* Edit Form (inline) */}
            {editingId && (
                <form onSubmit={handleUpdate} className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                    <input name="couponCode" value={form.couponCode} onChange={e => setForm(f => ({ ...f, couponCode: e.target.value }))} placeholder="Code" className="border px-2 py-1 rounded" required />
                    <input name="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="border px-2 py-1 rounded" />
                    <input name="discount" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} placeholder="Discount" type="number" className="border px-2 py-1 rounded" required />
                    <input name="expiryDate" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} placeholder="Expiry Date" type="date" className="border px-2 py-1 rounded" required />
                    <input name="stock" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="Stock" type="number" className="border px-2 py-1 rounded" required />
                    <label className="flex items-center gap-1 text-xs">
                        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Active
                    </label>
                    <button type="submit" className="bg-orange-500 text-white px-3 py-1 rounded">Update</button>
                    <button type="button" className="ml-2 text-xs text-gray-500 underline" onClick={() => { setEditingId(null); setForm({ couponCode: '', description: '', discount: '', expiryDate: '', stock: '' }); }}>
                        Cancel
                    </button>
                </form>
            )}
            {/* Table */}
            {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="py-3 font-medium">Id</th>
                            <th className="py-3 font-medium">Code</th>
                            <th className="py-3 font-medium">Description</th>
                            <th className="py-3 font-medium">Discount</th>
                            <th className="py-3 font-medium">Expiry</th>
                            <th className="py-3 font-medium text-right">Stock</th>
                            <th className="py-3 font-medium text-right">Active</th>
                            <th className="py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((c) => (
                            <tr key={c.id} className="border-b last:border-b-0">
                                <td className="py-4">{c.id}</td>
                                <td className="py-4">{c.couponCode}</td>
                                <td className="py-4">{c.description}</td>
                                <td className="py-4">{c.discount}</td>
                                <td className="py-4">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : ''}</td>
                                <td className="py-4 text-right">{c.stock}</td>
                                <td className="py-4 text-right">{c.isActive ? 'Yes' : 'No'}</td>
                                <td className="py-4 text-right">
                                    <button className="cursor-pointer text-green-500 hover:text-green-700 text-lg mr-2" onClick={() => handleEdit(c)}><IoPencil /></button>
                                    <button className="cursor-pointer text-red-500 hover:text-red-700 text-lg" onClick={() => handleDelete(c.id)}><IoTrashOutline /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashUptNVouchersTable;