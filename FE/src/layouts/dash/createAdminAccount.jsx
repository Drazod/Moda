import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../configs/axiosInstance';

const CreateAdminAccount = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  if (user?.role !== 'HOST') {
    return <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow text-red-500">Only host can create admin accounts.</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axiosInstance.post('/admin/create-admin', form);
      setSuccess('Admin account created successfully!');
      setForm({ name: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      setError('Failed to create admin account');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">Create Admin Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full p-3 rounded-lg bg-gray-100" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" className="mt-1 w-full p-3 rounded-lg bg-gray-100" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" className="mt-1 w-full p-3 rounded-lg bg-gray-100" required />
        </div>
        <button type="submit" className="mt-6 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold">Create Admin</button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default CreateAdminAccount;
