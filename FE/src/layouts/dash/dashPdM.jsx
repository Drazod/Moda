import React, { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import DashPdMTopSellingTable from '../../components/dash/dashPdM/dashPdMTopSellingTable';
import DashPdMProductsTable from '../../components/dash/dashPdM/dashPdMProductsTable';
import DashPdMProductForm from '../../components/dash/dashPdM/dashPdMProductForm';

const DashPdM_Main = () => {
    const [popupMode, setPopupMode] = useState(null); // null, 'add', 'edit'
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleOpenAddPopup = () => {
        setPopupMode('add');
        setSelectedProduct(null);
    };
    
    const handleOpenEditPopup = (product) => {
        setPopupMode('edit');
        setSelectedProduct(product);
    };

    const handleClosePopup = () => {
        setPopupMode(null);
    };

    return (
        <>
        <DashPdMTopSellingTable />

        {/* Unify */}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Products manage</h2>
            <button 
                onClick={handleOpenAddPopup} 
                className="bg-gray-200 px-4 py-2 rounded-full flex items-center text-sm font-medium hover:bg-gray-300"
            >
                <IoAdd className="mr-2 text-lg" /> Add products
            </button>
      </div>

        <DashPdMProductsTable onEditProduct={handleOpenEditPopup} />

        {/* popup */}
        {popupMode && (
            <DashPdMProductForm 
            mode={popupMode}
            product={selectedProduct}
            onClose={handleClosePopup}
            />
        )}
        </>
    );
};

export default DashPdM_Main;