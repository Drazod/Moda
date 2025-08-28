import React from 'react';
import { IoClose, IoCloudUploadOutline, IoAdd } from 'react-icons/io5';

const DashPdMProductForm = ({ mode, product, onClose }) => {
    const isEditMode = mode === 'edit';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-4xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"><IoClose /></button>
                <h2 className="text-2xl font-bold mb-6 text-center">{isEditMode ? 'Edit products' : 'Add new product'}</h2>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {/* left col */}
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input type="text" placeholder="product name..." defaultValue={isEditMode ? product.name : ''} className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />

                        <label className="mt-4 block text-sm font-medium">Category</label>
                        <select className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]">
                            <option>Shirt</option>
                            <option>T-Shirt</option>
                        </select>

                        <label className="mt-4 block text-sm font-medium">Description</label>
                        <textarea rows="4" placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>

                        <label className="mt-4 block text-sm font-medium">Feature</label>
                        <div className="p-3 rounded-lg bg-[#E5DACE] space-y-2">
                             {/* mock */}
                            <div className="flex items-center justify-between bg-white p-2 rounded"><span>Airy & Warm</span><IoClose/></div>
                            <div className="flex items-center justify-between bg-white p-2 rounded"><span>Mode in ABC</span><IoClose/></div>
                        </div>
                        <button className="mt-2 w-full flex items-center justify-center p-2 rounded-lg border-2 border-dashed border-gray-400 text-gray-500"><IoAdd/></button>
                    </div>

                    {/* right col */}
                    <div>
                        <label className="text-sm font-medium">Image</label>
                        <div className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] flex items-center justify-center border-2 border-dashed">
                            <IoCloudUploadOutline className="text-2xl text-gray-500"/>
                        </div>

                        <label className="mt-4 block text-sm font-medium">Size</label>
                        <div className="grid grid-cols-5 gap-2 mt-1">
                            {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                                <div key={size} className="rounded-lg bg-[#E5DACE] p-2 text-center">
                                    <p className="font-semibold">{size}</p>
                                    <input type="text" placeholder="stock" className="w-full text-xs text-center bg-white rounded mt-1"/>
                                </div>
                            ))}
                        </div>

                        <label className="mt-4 block text-sm font-medium">Materials</label>
                        <textarea rows="4" placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>

                        <label className="mt-4 block text-sm font-medium">Information</label>
                        <textarea rows="4" placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button className={`px-8 py-3 rounded-lg text-white font-semibold ${isEditMode ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 hover:bg-gray-500'}`}>
                        {isEditMode ? 'Disable' : 'Reset'}
                    </button>
                    <button className="px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-black">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default DashPdMProductForm;