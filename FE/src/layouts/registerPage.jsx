import React, { useState } from "react";
import axiosInstance from "../configs/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Logo */}
      <a href="/" className="w-1/2 bg-[#4A6FA5] items-center flex justify-center">
        <button className="flex items-center space-x-2 justify-center">
          <img src="/assets/hcmut-logo.svg" alt="Logo" className="h-20 mb-4" />
          <h1 className="text-4xl font-bold text-[#D6E5E3]">SCAMS</h1>
        </button>
      </a>

      {/* Right side - Form */}
      <div className="w-1/2 bg-[#E8F1F2] flex flex-col justify-center items-center px-20">
        <div className="w-full max-w-sm">
          <h2 className="text-4xl font-bold text-[#4A6FA5] mb-1">
            | <span className="text-[#1D1A05]">Hello new friend</span>
          </h2>
          <p className="text-lg text-gray-500 mb-6">
            Already have an account? <a href="/login" className="text-[#E09891]">Click here</a>
          </p>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 px-4 py-3 rounded bg-gray-100 text-sm focus:outline-none"
          />

          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded bg-gray-100 text-sm focus:outline-none"
          />

          <div className="relative mb-4">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded bg-gray-100 text-sm focus:outline-none"
            />
            <span className="absolute right-4 top-3.5 text-gray-400 cursor-pointer">👁️</span>
          </div>

          <div className="mb-6">
            <label htmlFor="role" className="block mb-1 text-sm font-medium">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-gray-100 text-sm focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded text-white font-semibold bg-gradient-to-r from-[#4A6FA5] to-[#D6E5E3] shadow-md"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;