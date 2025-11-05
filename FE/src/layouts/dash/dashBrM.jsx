import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DashBrMTable from '../../components/dash/dashBrM/dashBrMTable';
import DashBrMEditPopup from '../../components/dash/dashBrM/dashBrMEditPopup';
import DashBrMAddPopup from '../../components/dash/dashBrM/dashBrMAddPopup';

const DashBrM_Main = () => {
  // state - popup open/close
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  // state - edit branch
  const [selectedBranch, setSelectedBranch] = useState(null);

  // filter/sort state
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // open edit popup
  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setIsEditPopupOpen(true);
  };

  // close edit popup
  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedBranch(null);
  };

  // open add popup
  const handleAddBranch = () => {
    setIsAddPopupOpen(true);
  };

  // close add popup
  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Branch manage</h2>
        <div className="flex items-center space-x-4">
          <button 
            className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm hover:bg-orange-600 transition-colors"
            onClick={handleAddBranch}
          >
            Add new branch
          </button>
          <button 
            className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm" 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? 'Ascending Id' : 'Descending Id'} <FaChevronDown className="ml-2 text-xs" />
          </button>
          <button 
            className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm"
            onClick={() => {
              if (filterStatus === 'all') setFilterStatus('active');
              else if (filterStatus === 'active') setFilterStatus('inactive');
              else setFilterStatus('all');
            }}
          >
            {filterStatus === 'all' ? 'All Status' : filterStatus === 'active' ? 'Active' : 'Inactive'} 
            <FaChevronDown className="ml-2 text-xs" />
          </button>
        </div>
      </div>
      
      {/* Component table */}
      <DashBrMTable
        onEditBranch={handleEditBranch}
        sortOrder={sortOrder}
        filterStatus={filterStatus}
      />
      
      {/* Edit Popup */}
      {isEditPopupOpen && selectedBranch && (
        <DashBrMEditPopup
          branch={selectedBranch}
          onClose={handleCloseEditPopup}
        />
      )}

      {/* Add Popup */}
      {isAddPopupOpen && (
        <DashBrMAddPopup
          onClose={handleCloseAddPopup}
        />
      )}
    </>
  );
};

export default DashBrM_Main;
