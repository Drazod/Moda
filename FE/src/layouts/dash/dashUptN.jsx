import React, { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import DashUptNNoticesList from '../../components/dash/dashUptN/dashUptNNoticesList';
import DashUptNVouchersTable from '../../components/dash/dashUptN/dashUptNVouchersTable';
import DashUptNNoticeForm from '../../components/dash/dashUptN/dashUptNNoticeForm';
import DashUptNVoucherForm from '../../components/dash/dashUptN/dashUptNVoucherForm';

const DashUptN_Main = () => {
  const [popup, setPopup] = useState(null); // [null, 'addNotice', 'editNotice', 'addVoucher']
  const [selectedNotice, setSelectedNotice] = useState(null);

  const handleOpenEditNotice = (notice) => {
    setSelectedNotice(notice);
    setPopup('editNotice');
  };

  const handleClosePopup = () => setPopup(null);

  return (
    <>
      {/* notices */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Notices manage</h2>
        <button onClick={() => setPopup('addNotice')} className="bg-gray-200 px-4 py-2 rounded-full flex items-center text-sm font-medium">
          <IoAdd className="mr-2 text-lg" /> Add notice
        </button>
      </div>
      <DashUptNNoticesList onEditNotice={handleOpenEditNotice} />

      {/* vouchers */}
      <div className="flex items-center justify-between mt-12 mb-4">
        <h2 className="text-2xl font-semibold">Vouchers manage</h2>
        <button onClick={() => setPopup('addVoucher')} className="bg-gray-200 px-4 py-2 rounded-full flex items-center text-sm font-medium">
          <IoAdd className="mr-2 text-lg" /> Add voucher
        </button>
      </div>
      <DashUptNVouchersTable />

      {/* conditional */}
      {popup === 'addNotice' && <DashUptNNoticeForm mode="add" onClose={handleClosePopup} />}
      {popup === 'editNotice' && <DashUptNNoticeForm mode="edit" notice={selectedNotice} onClose={handleClosePopup} />}
      {popup === 'addVoucher' && <DashUptNVoucherForm onClose={handleClosePopup} />}
    </>
  );
};

export default DashUptN_Main;