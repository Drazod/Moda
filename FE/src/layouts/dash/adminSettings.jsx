import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Change Password</label>
          <input type="password" className="mt-1 w-full p-3 rounded-lg bg-gray-100" placeholder="New password" />
        </div>
        <div>
          <label className="block text-sm font-medium">Notification Preferences</label>
          <select className="mt-1 w-full p-3 rounded-lg bg-gray-100">
            <option>Email only</option>
            <option>SMS only</option>
            <option>Email & SMS</option>
          </select>
        </div>
        <button className="mt-6 px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold">Save Settings</button>
      </div>
    </div>
  );
};

export default AdminSettings;
