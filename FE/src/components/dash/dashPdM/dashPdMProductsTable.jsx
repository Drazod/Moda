import React, { useEffect, useState } from 'react';
import { IoPencil, IoTrashOutline, IoAddCircleOutline } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const DashPdMProductsTable = ({ onEditProduct, onUpdateStock, isHost }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {};
                
                // Add branchCode for admin users
                if (!isHost && user?.managedBranch?.code) {
                    params.branchCode = user.managedBranch.code;
                }
                
                const res = await axiosInstance.get('/clothes/list', { params });
                if (user.managedBranch.code) {
                setProducts(res.data.clothes);
                console.log(res.data.clothes);
                }
                else {
                setProducts(res.data);
                }
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [isHost, user]);

    const handleDelete = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        try {
            await axiosInstance.delete(`/clothes/${productId}`);
            toast.success('Product deleted successfully');
            // Refresh the list
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="py-3 font-medium">Name</th>
                            <th className="py-3 font-medium">Category</th>
                            <th className="py-3 font-medium">Date added</th>
                            <th className="py-3 font-medium">Stock</th>
                            <th className="py-3 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const stock = Array.isArray(product.sizes)
                                ? product.sizes.reduce((sum, s) => sum + (s.quantity || 0), 0)
                                : '-';
                            return (
                                <tr key={product.id} className="border-b last:border-b-0">
                                    <td className="py-4">{product.name}</td>
                                    <td className="py-4">{product.category?.name || '-'}</td>
                                    <td className="py-4">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}</td>
                                    <td className="py-4">{stock}</td>
                                    <td className="py-4">
                                        <div className="flex justify-center items-center space-x-4">
                                            {isHost ? (
                                                <>
                                                    <IoPencil 
                                                        onClick={() => onEditProduct(product)} 
                                                        className="cursor-pointer text-green-500 hover:text-green-700 text-lg" 
                                                        title="Edit product"
                                                    />
                                                    <IoTrashOutline 
                                                        onClick={() => handleDelete(product.id)}
                                                        className="cursor-pointer text-red-500 hover:text-red-700 text-lg" 
                                                        title="Delete product"
                                                    />
                                                </>
                                            ) : (
                                                <IoAddCircleOutline 
                                                    onClick={() => onUpdateStock(product)} 
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700 text-2xl" 
                                                    title="Add stock to branch"
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashPdMProductsTable;