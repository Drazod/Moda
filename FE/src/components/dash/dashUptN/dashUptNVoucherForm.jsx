import React, { useState } from 'react';
import { IoClose, IoCloudUploadOutline } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';

const DashUptNVoucherForm = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({
        couponCode: '',
        description: '',
        discount: '',
        expiryDate: '',
        stock: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setForm({ couponCode: '', description: '', discount: '', expiryDate: '', stock: '' });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axiosInstance.post('/coupon', {
                ...form,
                discount: parseFloat(form.discount),
                stock: Number(form.stock),
                expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
            });
            handleReset();
            if (onCreated) onCreated();
            if (onClose) onClose();
        } catch (err) {
            setError('Failed to create voucher');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-3xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl"><IoClose /></button>
                <h2 className="text-2xl font-bold mb-6 text-center">Add new voucher</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <label className="text-sm font-medium">Code</label>
                            <input name="couponCode" value={form.couponCode} onChange={handleChange} type="text" placeholder="Voucher code..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" required />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Stock</label>
                            <input name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="1000..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm font-medium">Discount</label>
                                <input name="discount" value={form.discount} onChange={handleChange} type="number" placeholder="10..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Expiry Date</label>
                                <input name="expiryDate" value={form.expiryDate} onChange={handleChange} type="date" className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" required />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows="4" placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>
                        </div>
                    </div>
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button" onClick={handleReset} className="px-8 py-3 rounded-lg bg-red-500 text-white font-semibold">Reset</button>
                        <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold">{loading ? 'Creating...' : 'Confirm'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DashUptNVoucherForm;