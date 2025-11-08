import React, { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import DashPdMTopSellingTable from '../../components/dash/dashPdM/dashPdMTopSellingTable';
import DashPdMProductsTable from '../../components/dash/dashPdM/dashPdMProductsTable';
import DashPdMProductForm from '../../components/dash/dashPdM/dashPdMProductForm';
import DashPdMStockUpdate from '../../components/dash/dashPdM/dashPdMStockUpdate';
import { useAuth } from '../../context/AuthContext';

const DashPdM_Main = () => {
    const { user } = useAuth();
    const isHost = user?.role === 'HOST';
    
    const [popupMode, setPopupMode] = useState(null); // null, 'add', 'edit', 'stock'
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleOpenAddPopup = () => {
        setPopupMode('add');
        setSelectedProduct(null);
    };
    
    const handleOpenEditPopup = (product) => {
        setPopupMode('edit');
        setSelectedProduct(product);
    };

    const handleOpenStockPopup = (product) => {
        setPopupMode('stock');
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
            {isHost && (
                <button 
                    onClick={handleOpenAddPopup} 
                    className="bg-gray-200 px-4 py-2 rounded-full flex items-center text-sm font-medium hover:bg-gray-300"
                >
                    <IoAdd className="mr-2 text-lg" /> Add products
                </button>
            )}
      </div>

        <DashPdMProductsTable 
            onEditProduct={isHost ? handleOpenEditPopup : null}
            onUpdateStock={!isHost ? handleOpenStockPopup : null}
            isHost={isHost}
        />

        {/* popup */}
        {popupMode === 'add' && isHost && (
            <DashPdMProductForm 
                mode="add"
                product={null}
                onClose={handleClosePopup}
            />
        )}
        
        {popupMode === 'edit' && isHost && (
            <DashPdMProductForm 
                mode="edit"
                product={selectedProduct}
                onClose={handleClosePopup}
            />
        )}

        {popupMode === 'stock' && !isHost && (
            <DashPdMStockUpdate
                product={selectedProduct}
                onClose={handleClosePopup}
            />
        )}
        </>
    );
};

export default DashPdM_Main;