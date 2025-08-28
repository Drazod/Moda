import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DashUMTable from '../../components/dash/dashUM/dashUMTable';
import DashUMEditPopup from '../../components/dash/dashUM/dashUMEditPopup';

const DashUM_Main = () => {
  // state - popup open/close
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // state - edit user
  const [selectedUser, setSelectedUser] = useState(null);

  // open popup
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  // close popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };    

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">User manage</h2>
        <div className="flex items-center space-x-4">
            <button className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm">
                Last 30 days <FaChevronDown className="ml-2 text-xs" />
            </button>
            <button className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm">
                Ascending Id <FaChevronDown className="ml-2 text-xs" />
            </button>
            <button className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm">
                Status <FaChevronDown className="ml-2 text-xs" />
            </button>
        </div>
      </div>
      
      {/* Component table */}
      <DashUMTable onEditUser={handleEditUser} />

      {/* Render component popup */}
      {isPopupOpen && <DashUMEditPopup user={selectedUser} onClose={handleClosePopup} />}
    </>
  );
};

export default DashUM_Main;