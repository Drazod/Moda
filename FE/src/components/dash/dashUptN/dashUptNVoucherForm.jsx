import React from 'react';
import { IoClose, IoCloudUploadOutline } from 'react-icons/io5';

const DashUptNVoucherForm = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-3xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl"><IoClose /></button>
                <h2 className="text-2xl font-bold mb-6 text-center">Add new voucher</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input type="text" placeholder="product name..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Image</label>
                        <div className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] flex items-center justify-center border-2 border-dashed"><IoCloudUploadOutline className="text-2xl"/></div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Quantity</label>
                        <input type="text" placeholder="1000..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <select className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]">
                                <option>Percent</option>
                                <option>Flat</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Value</label>
                            <input type="text" placeholder="10..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea rows="4" placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button className="px-8 py-3 rounded-lg bg-red-500 text-white font-semibold">Reset</button>
                    <button className="px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default DashUptNVoucherForm;