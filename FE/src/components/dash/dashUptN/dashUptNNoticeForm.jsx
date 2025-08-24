import React from 'react';
import { IoClose, IoCloudUploadOutline } from 'react-icons/io5';

const DashUptNNoticeForm = ({ mode, notice, onClose }) => {
    const isEditMode = mode === 'edit';
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl"><IoClose /></button>
                <h2 className="text-2xl font-bold mb-6 text-center">{isEditMode ? 'Edit notice' : 'Add new notice'}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <input type="text" placeholder="title..." defaultValue={isEditMode ? notice.title : ''} className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Image</label>
                        <div className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] flex items-center justify-center border-2 border-dashed"><IoCloudUploadOutline className="text-2xl text-gray-500"/></div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Content</label>
                        <textarea rows="4" placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Page</label>
                        <select className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]">
                            <option>Welcome Page</option>
                            <option>Home Page</option>
                            <option>Others</option>
                        </select>
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

export default DashUptNNoticeForm;