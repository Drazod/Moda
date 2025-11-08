import React, { useEffect, useState } from 'react';
import { IoPencil, IoTrashOutline, IoLocationOutline } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';
import toast from 'react-hot-toast';

const DashBrMTable = ({ onEditBranch, sortOrder, filterStatus }) => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosInstance.get('/branch');
            setBranches(res.data.branches || []);
        } catch (err) {
            setError('Failed to fetch branches');
            toast.error('Failed to fetch branches');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (branchId) => {
        if (!confirm('Are you sure you want to delete this branch?')) return;
        
        try {
            await axiosInstance.delete(`/branche/${branchId}`);
            toast.success('Branch deleted successfully');
            fetchBranches(); // Refresh list
        } catch (err) {
            toast.error('Failed to delete branch');
        }
    };

    // Filter/sort branches
    let filteredBranches = [...branches];
    
    // Filter by status
    if (filterStatus === 'active') {
        filteredBranches = filteredBranches.filter(b => b.isActive);
    } else if (filterStatus === 'inactive') {
        filteredBranches = filteredBranches.filter(b => !b.isActive);
    }
    
    // Sort by id
    filteredBranches.sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id);

    const getStatusClass = (isActive) => {
        return isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : filteredBranches.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No branches found</div>
            ) : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="py-3 font-medium">Branch Id</th>
                            <th className="py-3 font-medium">Code</th>
                            <th className="py-3 font-medium">Name</th>
                            <th className="py-3 font-medium">Address</th>
                            <th className="py-3 font-medium">Phone</th>
                            <th className="py-3 font-medium">Status</th>
                            <th className="py-3 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBranches.map((branch) => (
                            <tr key={branch.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                <td className="py-4 font-semibold">{branch.id}</td>
                                <td className="py-4">{branch.code || 'N/A'}</td>
                                <td className="py-4">
                                    <div className="flex items-center">
                                        <IoLocationOutline className="mr-2 text-orange-500" />
                                        {branch.name}
                                    </div>
                                </td>
                                <td className="py-4 text-sm text-gray-600">{branch.address || 'N/A'}</td>
                                <td className="py-4 text-sm">{branch.phone || 'N/A'}</td>
                                <td className="py-4">
                                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(branch.isActive)}`}>
                                        {branch.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <div className="flex justify-center items-center space-x-4">
                                        <IoPencil 
                                            onClick={() => onEditBranch(branch)} 
                                            className="cursor-pointer text-green-500 hover:text-green-700 text-lg" 
                                            title="Edit branch"
                                        />
                                        <IoTrashOutline 
                                            onClick={() => handleDelete(branch.id)}
                                            className="cursor-pointer text-red-500 hover:text-red-700 text-lg" 
                                            title="Delete branch"
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

export default DashBrMTable;
