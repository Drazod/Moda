import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '../components/dash/dashSideNav';
import DashBoardHeader from '../components/dash/dashHeader';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F3EC] font-karla">
      {/* To be continued  */}
      <SideNav />

      {/* To be continued  */}
      <main className="flex-1 p-8 overflow-auto">
        {/* To be continued  */}
        <DashBoardHeader />

        {/* To be continued  */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;