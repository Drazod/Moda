import React from 'react';
import { IoClose, IoCalendarOutline } from 'react-icons/io5';

const DashUMEditPopup = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            {/* Popup */}
            <div className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800">
                    <IoClose />
                </button>
                
                <h2 className="text-2xl font-bold mb-6">User #{user.id}</h2>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {/* Column */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <input type="text" defaultValue={user.name} className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Points</label>
                        <input type="text" defaultValue="1000" className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-600">D.O.B</label>
                        <input type="text" defaultValue="17/02/2003" className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        <IoCalendarOutline className="absolute right-3 top-10 text-gray-500" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <input type="text" defaultValue="090909090" className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <input type="email" defaultValue="nguyenvan@gmail.com" className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600">Address</label>
                        <input type="text" defaultValue="Ho Chi Minh, Viet Nam" className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button className="px-8 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600">Reset</button>
                    <button className="px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-black">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default DashUMEditPopup;