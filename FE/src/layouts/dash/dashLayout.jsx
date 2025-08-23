import React from 'react';
import { Outlet } from 'react-router-dom';
import DashSideNav from '../../components/dash/dashSideNav'; // Đã đổi tên file
import DashHeader from '../../components/dash/dashHeader'; // Đã đổi tên file

const DashLayout = () => {
  return (
    // 1. Cố định toàn bộ layout bằng chiều cao màn hình và ẩn thanh cuộn của trình duyệt
    <div className="flex h-screen overflow-hidden bg-[#F7F3EC] font-karla">
      
      {/* 2. SideNav sẽ chiếm không gian cố định bên trái */}
      <DashSideNav />

      {/* 3. Khu vực chính (header + content) sẽ là một flex container dọc */}
      <div className="flex-1 flex flex-col overflow-hidden p-8">
        
        {/* 4. Header sẽ nằm ở trên cùng, không bị cuộn */}
          <DashHeader />

        {/* 5. Vùng nội dung chính sẽ lấp đầy phần còn lại và có thanh cuộn riêng */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashLayout;