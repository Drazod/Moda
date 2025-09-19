import React, { useEffect, useState } from 'react';
import { IoPencil, IoTrashOutline } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';

const DashPdMProductsTable = ({ onEditProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get('/clothes/list');
                setProducts(res.data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

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
                        {products.map((product) => (
                            <tr key={product.id} className="border-b last:border-b-0">
                                <td className="py-4">{product.name}</td>
                                <td className="py-4">{product.category?.name || '-'}</td>
                                <td className="py-4">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}</td>
                                <td className="py-4">{product.stock ?? '-'}</td>
                                <td className="py-4">
                                    <div className="flex justify-center items-center space-x-4">
                                        <IoPencil 
                                            onClick={() => onEditProduct(product)} 
                                            className="cursor-pointer text-green-500 hover:text-green-700 text-lg" 
                                        />
                                        <IoTrashOutline 
                                            className="cursor-pointer text-red-500 hover:text-red-700 text-lg" 
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashPdMProductsTable;