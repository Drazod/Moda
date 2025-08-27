import React from 'react';
import { IoPencil, IoTrashOutline } from 'react-icons/io5';

const DashPdMProductsTable = ({ onEditProduct }) => {
    const products = [
        { id: 1, name: 'Shirt', category: 'Shirt', dateAdded: 'May 25, 2023', stock: 1000 },
        { id: 2, name: 'T-Shirt', category: 'T-Shirt', dateAdded: 'Jun 20, 2023', stock: 1000 },
        // {/* To be continued  */}
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
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
                            <td className="py-4">{product.category}</td>
                            <td className="py-4">{product.dateAdded}</td>
                            <td className="py-4">{product.stock}</td>
                            <td className="py-4">

                                {/* Unify */}
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
        </div>
    );
};

export default DashPdMProductsTable;    