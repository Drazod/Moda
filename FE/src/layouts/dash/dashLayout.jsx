import React from 'react';
import { Outlet } from 'react-router-dom';
import DashSideNav from '../../components/dash/dashSideNav';
import DashHeader from '../../components/dash/dashHeader';
import usePresenceHeartbeat from '../../hooks/usePresenceHeartbeat';

const DashLayout = () => {
  usePresenceHeartbeat(20000);
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F3EC] font-karla">
      <DashSideNav />

      {/* Update */}
      <div className="flex-1 flex flex-col overflow-hidden p-8 gap-y-8">
        <DashHeader />
        
        {/* Update */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashLayout;