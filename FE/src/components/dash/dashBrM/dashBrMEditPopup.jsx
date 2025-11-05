import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';
import toast from 'react-hot-toast';

const DashBrMEditPopup = ({ branch, onClose }) => {
    // Parse existing hours
    const parseHours = (hoursString) => {
        if (!hoursString) {
            return {
                weekdayStart: '9:00 AM',
                weekdayEnd: '9:00 PM',
                weekendStart: '10:00 AM',
                weekendEnd: '10:00 PM'
            };
        }
        
        try {
            // Example: "Mon-Fri: 9:00 AM - 9:00 PM, Sat-Sun: 10:00 AM - 10:00 PM"
            const parts = hoursString.split(',').map(p => p.trim());
            const weekdayPart = parts[0]?.split(':')[1]?.trim() || '';
            const weekendPart = parts[1]?.split(':')[1]?.trim() || '';
            
            const [wdStart, wdEnd] = weekdayPart.split('-').map(t => t.trim());
            const [weStart, weEnd] = weekendPart.split('-').map(t => t.trim());
            
            return {
                weekdayStart: wdStart || '9:00 AM',
                weekdayEnd: wdEnd || '9:00 PM',
                weekendStart: weStart || '10:00 AM',
                weekendEnd: weEnd || '10:00 PM'
            };
        } catch (e) {
            return {
                weekdayStart: '9:00 AM',
                weekdayEnd: '9:00 PM',
                weekendStart: '10:00 AM',
                weekendEnd: '10:00 PM'
            };
        }
    };

    const initialHours = parseHours(branch?.hours);

    const [formData, setFormData] = useState({
        name: branch?.name || '',
        address: branch?.address || '',
        phone: branch?.phone || '',
        code: branch?.code || '',
        isActive: branch?.isActive ?? true,
    });
    const [loading, setLoading] = useState(false);

    // Hours configuration
    const [weekdayStart, setWeekdayStart] = useState(initialHours.weekdayStart);
    const [weekdayEnd, setWeekdayEnd] = useState(initialHours.weekdayEnd);
    const [weekendStart, setWeekendStart] = useState(initialHours.weekendStart);
    const [weekendEnd, setWeekendEnd] = useState(initialHours.weekendEnd);

    // Generate time options
    const generateTimeOptions = () => {
        const times = [];
        const periods = ['AM', 'PM'];
        for (let period of periods) {
            for (let hour = (period === 'AM' ? 12 : 1); hour <= (period === 'AM' ? 11 : 12); hour++) {
                times.push(`${hour}:00 ${period}`);
                times.push(`${hour}:30 ${period}`);
            }
        }
        // Reorder to start from 12:00 AM
        const amTimes = times.filter(t => t.includes('AM'));
        const pmTimes = times.filter(t => t.includes('PM'));
        return [...amTimes, ...pmTimes];
    };

    const timeOptions = generateTimeOptions();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Branch name is required');
            return;
        }

        // Format hours string
        const hoursString = `Mon-Fri: ${weekdayStart} - ${weekdayEnd}, Sat-Sun: ${weekendStart} - ${weekendEnd}`;

        try {
            setLoading(true);
            await axiosInstance.put(`/admin/branches/${branch.id}`, {
                ...formData,
                hours: hoursString
            });
            toast.success('Branch updated successfully');
            onClose();
            // Trigger refresh in parent component
            window.location.reload();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update branch');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: branch?.name || '',
            address: branch?.address || '',
            phone: branch?.phone || '',
            code: branch?.code || '',
            isActive: branch?.isActive ?? true,
        });
        setWeekdayStart(initialHours.weekdayStart);
        setWeekdayEnd(initialHours.weekdayEnd);
        setWeekendStart(initialHours.weekendStart);
        setWeekendEnd(initialHours.weekendEnd);
    };

    if (!branch) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
                    disabled={loading}
                >
                    <IoClose />
                </button>
                
                <h2 className="text-2xl font-bold mb-6">Edit Branch #{branch.id}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {/* Branch Name */}
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-600">Branch Name *</label>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                                required
                            />
                        </div>

                        {/* Address */}
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

                        {/* Phone */}
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

                        {/* Branch Code */}
                        <div>
                            <label className="text-sm font-medium text-gray-600">Branch Code</label>
                            <input 
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        {/* Hours */}
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-600 mb-2 block">Operating Hours</label>
                            
                            {/* Weekdays */}
                            <div className="mb-4 p-4 bg-white rounded-lg">
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Monday - Friday</label>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={weekdayStart}
                                        onChange={(e) => setWeekdayStart(e.target.value)}
                                        className="flex-1 p-2 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        {timeOptions.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    <span className="text-gray-600 font-medium">to</span>
                                    <select
                                        value={weekdayEnd}
                                        onChange={(e) => setWeekdayEnd(e.target.value)}
                                        className="flex-1 p-2 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        {timeOptions.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Weekends */}
                            <div className="p-4 bg-white rounded-lg">
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Saturday - Sunday</label>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={weekendStart}
                                        onChange={(e) => setWeekendStart(e.target.value)}
                                        className="flex-1 p-2 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        {timeOptions.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    <span className="text-gray-600 font-medium">to</span>
                                    <select
                                        value={weekendEnd}
                                        onChange={(e) => setWeekendEnd(e.target.value)}
                                        className="flex-1 p-2 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        {timeOptions.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-600">
                                Preview: Mon-Fri: {weekdayStart} - {weekdayEnd}, Sat-Sun: {weekendStart} - {weekendEnd}
                            </div>
                        </div>

                        {/* Active Status */}
                        <div className="col-span-2 flex items-center">
                            <input 
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-orange-500 focus:ring-orange-400 rounded"
                                id="isActive"
                            />
                            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-600">
                                Branch is Active
                            </label>
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

export default DashBrMEditPopup;
