import React, { useState, useEffect } from 'react';
import { IoClose, IoCalendarOutline } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';
import toast from 'react-hot-toast';

const DashUMEditPopup = ({ user, onClose }) => {
    function toDateInputValue(value) {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        // YYYY-MM-DD
        return d.toISOString().slice(0, 10);
        }
    const [formData, setFormData] = useState({
        name: user?.name || '',
        points: user?.points || 0,
        phone: user?.phone || '',
        email: user?.email || '',
        address: user?.address || '',
        managedBranchId: user?.managedBranch?.id || '',
    });
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);
    const [loadingBranches, setLoadingBranches] = useState(true);

    // Fetch branches on component mount
    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            setLoadingBranches(true);
            const res = await axiosInstance.get('/branch/list');
            setBranches(res.data || []);
        } catch (err) {
            toast.error('Failed to fetch branches');
        } finally {
            setLoadingBranches(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!formData.email.trim()) {
            toast.error('Email is required');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.put(`/admin/user/${user.id}`, formData);
            toast.success('User updated successfully');
            onClose();
            // Trigger refresh in parent component
            window.location.reload();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: user?.name || '',
            points: user?.points || 0,
            birthdate: user?.birthdate || '',
            phone: user?.phone || '',
            email: user?.email || '',
            address: user?.address || '',
            managedBranchId: user?.managedBranch?.id || '',
        });
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            {/* Popup */}
            <div className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
                    disabled={loading}
                >
                    <IoClose />
                </button>
                
                <h2 className="text-2xl font-bold mb-6">User #{user.id}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {/* Column */}
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name *</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Points</label>
                            <input 
                                type="number" 
                                name="points"
                                value={formData.points}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" 
                            />
                        </div>
  
                        <div>
                            <label className="text-sm font-medium text-gray-600">Phone</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email *</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                required
                            />
                        </div>
                        {user.role == 'ADMIN'?(
                         <div>
                            <label className="text-sm font-medium text-gray-600">Managed Branch</label>
                            {loadingBranches ? (
                                <div className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] text-gray-500">
                                    Loading branches...
                                </div>
                            ) : (
                                <select
                                    name="managedBranchId"
                                    value={formData.managedBranchId}
                                    onChange={handleChange}
                                    className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                                >
                                    <option value="">No Branch</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.code} - {branch.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        ): null
                        }
                       
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-600">Address</label>
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <button 
                            type="button"
                            onClick={handleReset}
                            className="px-8 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50"
                            disabled={loading}
                        >
                            Reset
                        </button>
                        <button 
                            type="submit"
                            className="px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-black disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DashUMEditPopup;