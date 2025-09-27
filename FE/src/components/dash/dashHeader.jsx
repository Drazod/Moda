import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaBell } from 'react-icons/fa';
import adminAvatar from '../../assets/dash/dashUser/dashUser_Logo.jpg';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const DashHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="Search for anything..." 
          className="w-80 px-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="p-3 bg-white rounded-full shadow-sm cursor-pointer">
          <FaBell className="text-gray-600 text-xl" />
        </div>

        <div ref={dropdownRef} className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="flex items-center space-x-3 bg-white p-2 rounded-full shadow-sm cursor-pointer"
          >
            <img 
              src={adminAvatar}
              alt="Zod Father" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{user?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Role'}</p>
            </div>
            <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
              <a href="/dash-board/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="/dash-board/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              {user?.role === 'host' && (
                <a href="/dash-board/create-admin" className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100">Create Admin</a>
              )}
              <div className="border-t my-1"></div>
              <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashHeader;