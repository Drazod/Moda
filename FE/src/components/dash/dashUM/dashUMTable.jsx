import React from 'react';
import { IoPencil, IoTrashOutline, IoEyeOutline } from 'react-icons/io5';

const DashUMTable = ({ onEditUser }) => {
    const users = [
        { id: 1234, name: 'Nguyen Van A', lastOnline: '1 minutes ago', status: 'Online' },
        { id: 1235, name: 'Nguyen Van B', lastOnline: '1 days ago', status: 'Deleted' },
        { id: 1236, name: 'Nguyen Van C', lastOnline: '1 minutes ago', status: 'Online' },
        { id: 1237, name: 'Nguyen Van D', lastOnline: 'Mar 12, 2024', status: 'Offline' },
        { id: 1238, name: 'Nguyen Van E', lastOnline: 'Mar 15, 2023', status: 'Offline' },
        { id: 1239, name: 'Nguyen Van E', lastOnline: 'Jan 16, 2023', status: 'Offline' },
        { id: 1240, name: 'Nguyen Van E', lastOnline: 'Feb 17, 2024', status: 'Offline' },
        { id: 1241, name: 'Nguyen Van E', lastOnline: 'April 15, 2024', status: 'Offline' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Online': return 'bg-green-100 text-green-700';
            case 'Deleted': return 'bg-yellow-100 text-yellow-700';
            case 'Offline': return 'bg-gray-200 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-3 font-medium">User Id</th>
                        <th className="py-3 font-medium">Customer name</th>
                        <th className="py-3 font-medium">Last online</th>
                        <th className="py-3 font-medium">Status</th>
                        <th className="py-3 font-medium text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b last:border-b-0">
                            <td className="py-4 font-semibold">{user.id}</td>
                            <td className="py-4">{user.name}</td>
                            <td className="py-4">{user.lastOnline}</td>
                            <td>
                                <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(user.status)}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="py-4">
                                <div className="flex justify-center items-center space-x-4">
                                    <IoEyeOutline className="cursor-pointer text-gray-500 hover:text-blue-500" />
                                    <IoPencil onClick={() => onEditUser(user)} className="cursor-pointer text-gray-500 hover:text-green-500" />
                                    <IoTrashOutline className="cursor-pointer text-gray-500 hover:text-red-500" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashUMTable;