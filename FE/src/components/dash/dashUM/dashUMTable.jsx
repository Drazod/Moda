
import React, { useEffect, useState } from 'react';
import { IoPencil, IoTrashOutline, IoEyeOutline } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';

const DashUMTable = ({ onEditUser, filterDays, sortOrder, filterStatus }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosInstance.get('/admin/users');
            setUsers(res.data.users || []);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Filter/sort users
    let filteredUsers = [...users];
    // Filter by status
    if (filterStatus === 'verified') {
        filteredUsers = filteredUsers.filter(u => u.isVerified);
    }
    // Optionally filter by last 30 days (if user has createdAt field)
    if (filterDays && users.length && users[0].createdAt) {
        const cutoff = Date.now() - filterDays * 24 * 60 * 60 * 1000;
        filteredUsers = filteredUsers.filter(u => new Date(u.createdAt).getTime() >= cutoff);
    }
    // Sort by id
    filteredUsers.sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id);

    const getStatusClass = (isVerified) => {
        return isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="py-3 font-medium">User Id</th>
                            <th className="py-3 font-medium">Name</th>
                            <th className="py-3 font-medium">Role</th>
                            <th className="py-3 font-medium">Branch</th>
                            <th className="py-3 font-medium">Verified</th>
                            <th className="py-3 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b last:border-b-0">
                                <td className="py-4 font-semibold">{user.id}</td>
                                <td className="py-4">{user.name}</td>
                                <td className="py-4">{user.role}</td>
                                <td className="py-4">{user.managedBranch?.code || 'N/A'}</td>
                                <td>
                                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(user.isVerified)}`}>
                                        {user.isVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <div className="flex justify-center items-center space-x-4">
                                        <IoPencil 
                                            onClick={() => onEditUser(user)} 
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

export default DashUMTable;