import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const DashPdMStockUpdate = ({ product, onClose }) => {
    // ============================================================================
    // HOOKS & STATE
    // ============================================================================
    const { user } = useAuth();
    const branchCode = user?.managedBranch?.code;
    const [loading, setLoading] = useState(false);

    // Calculate available quantity from ONLINE-WH branch only
    const calculateMaxAvailable = (size) => {
        if (!size.branches || !Array.isArray(size.branches)) {
            return size.totalQuantity || 0;
        }
        const onlineWarehouse = size.branches.find(branch => branch.branchCode === 'ONLINE-WH');
        return onlineWarehouse?.quantity || 0;
    };

    const [sizes, setSizes] = useState(
        product?.sizes?.map(size => ({
            label: size.label,
            sizeId: size.id,
            currentBranchQty: size.quantity || 0,
            maxAvailable: calculateMaxAvailable(size),
            addQuantity: 0
        })) || []
    );

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    const getSelectedItems = () => sizes.filter(s => s.addQuantity > 0);

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================
    const handleQuantityChange = (index, value) => {
        const newSizes = [...sizes];
        const numValue = parseInt(value) || 0;
        
        if (numValue > newSizes[index].maxAvailable) {
            toast.error(`Cannot add more than ${newSizes[index].maxAvailable} items for size ${newSizes[index].label}`);
            return;
        }
        
        newSizes[index].addQuantity = Math.max(0, numValue);
        setSizes(newSizes);
    };

    const handleFocus = (index) => {
        const newSizes = [...sizes];
        if (newSizes[index].addQuantity === 0) {
            newSizes[index].addQuantity = '';
        }
        setSizes(newSizes);
    };

    const handleBlur = (index) => {
        const newSizes = [...sizes];
        if (newSizes[index].addQuantity === '' || newSizes[index].addQuantity === null) {
            newSizes[index].addQuantity = 0;
        }
        setSizes(newSizes);
    };

    const handleReset = () => {
        setSizes(
            product?.sizes?.map(size => ({
                label: size.label,
                sizeId: size.id,
                currentBranchQty: size.quantity || 0,
                maxAvailable: calculateMaxAvailable(size),
                addQuantity: 0
            })) || []
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!branchCode) {
            toast.error('You are not assigned to any branch');
            return;
        }

        const sizesToAdd = getSelectedItems().map(s => ({
            label: s.label,
            quantity: s.addQuantity
        }));

        if (sizesToAdd.length === 0) {
            toast.error('Please add at least one size with quantity > 0');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.post(`/clothes/${product.id}/add-to-branch`, {
                branchCode,
                sizes: sizesToAdd
            });
            toast.success('Stock added to branch successfully');
            onClose();
            window.location.reload();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to add stock to branch');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    if (!product) return null;

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
                
                <h2 className="text-2xl font-bold mb-2">Add Stock to Branch</h2>
                <p className="text-gray-600 mb-6">
                    Product: <span className="font-semibold">{product.name}</span>
                    {branchCode && <span className="ml-4">Branch: <span className="font-semibold">{branchCode}</span></span>}
                </p>

                {!branchCode ? (
                    <div className="text-center text-red-500 py-8">
                        You are not assigned to any branch. Please contact the administrator.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg">
                                <h3 className="font-semibold mb-4">Available Sizes</h3>
                                {sizes.map((size, index) => (
                                    <div key={size.label} className="grid grid-cols-3 gap-4 items-center mb-3 pb-3 border-b last:border-b-0">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Size {size.label}</label>
                                            <div className="text-xs text-gray-500">ONLINE-WH: {size.maxAvailable}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 block mb-1">Current Branch</label>
                                            <div className="px-3 py-2 bg-gray-100 rounded-lg text-center font-semibold">
                                                {size.currentBranchQty}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 block mb-1">Add to Branch</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max={size.maxAvailable}
                                                value={size.addQuantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                onFocus={() => handleFocus(index)}
                                                onBlur={() => handleBlur(index)}
                                                className="w-full p-2 rounded-lg bg-[#E5DACE] border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
                                <div className="space-y-1 text-sm">
                                    {getSelectedItems().map(size => (
                                        <div key={size.label} className="flex justify-between">
                                            <span>Size {size.label}:</span>
                                            <span className="font-semibold">{size.addQuantity} items</span>
                                        </div>
                                    ))}
                                    {getSelectedItems().length === 0 && (
                                        <div className="text-gray-500">No items selected</div>
                                    )}
                                </div>
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
                                {loading ? 'Adding...' : 'Add to Branch'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DashPdMStockUpdate;
