import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <div className="mt-1 p-3 rounded-lg bg-gray-100">{user?.name || 'Unknown'}</div>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <div className="mt-1 p-3 rounded-lg bg-gray-100">{user?.email || 'Unknown'}</div>
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <div className="mt-1 p-3 rounded-lg bg-gray-100">{user?.role || 'Unknown'}</div>
        </div>
        <div>
          <label className="block text-sm font-medium">Verified</label>
          <div className="mt-1 p-3 rounded-lg bg-gray-100">{user?.isVerified ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
