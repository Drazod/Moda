import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../configs/axiosInstance';

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { currentPassword, newPassword, confirmPassword } = formData;

    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    
    // Enforce strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(newPassword)) {
      setError("New password must be at least 8 characters, include uppercase, lowercase, and a number.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    
    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.put("/auth/changePass", {
        oldPassword: currentPassword,
        newPassword,
      });

      setSuccess("Password updated successfully. You will be logged out.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update password.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
      
      {/* Change Password Section */}
      <form onSubmit={handlePasswordChange} className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Change Password</h3>
        
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        
        <div>
          <label className="block text-sm font-medium">Current Password</label>
          <input 
            type="password" 
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="mt-1 w-full p-3 rounded-lg bg-gray-100" 
            placeholder="Enter current password" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input 
            type="password" 
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="mt-1 w-full p-3 rounded-lg bg-gray-100" 
            placeholder="Enter new password" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Confirm New Password</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 w-full p-3 rounded-lg bg-gray-100" 
            placeholder="Confirm new password" 
          />
        </div>
        
        <button 
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Updating..." : "Change Password"}
        </button>
      </form>

      {/* Other Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Notification Preferences</label>
          <select className="mt-1 w-full p-3 rounded-lg bg-gray-100">
            <option>Email only</option>
            <option>SMS only</option>
            <option>Email & SMS</option>
          </select>
        </div>
        <button className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold">Save Preferences</button>
      </div>
    </div>
  );
};

export default AdminSettings;
