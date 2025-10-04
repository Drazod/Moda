import React from 'react';
import { useLocation, Link } from 'react-router-dom'; // useLocation & Link
// Import icon
import { IoGridOutline, IoSettingsOutline, IoDocumentTextOutline, IoPeopleOutline, IoTimeOutline, IoBriefcaseOutline, IoEyeOutline, IoReturnDownBackOutline } from 'react-icons/io5';

const DashSideNav = () => {
  const location = useLocation(); // URL

  const navItems = [
    { name: 'Dashboard', path: '/dash-board', icon: <IoGridOutline /> },
    { name: 'Products manage', path: '/dash-board/products-manage', icon: <IoBriefcaseOutline /> },
    { name: 'Order manage', path: '/dash-board/order-manage', icon: <IoDocumentTextOutline /> },
    { name: 'Refund manage', path: '/dash-board/refund-manage', icon: <IoReturnDownBackOutline /> },
    { name: 'Activity log', path: '/dash-board/activity-log', icon: <IoTimeOutline /> },
    { name: 'Users manage', path: '/dash-board/users-manage', icon: <IoPeopleOutline /> },
    { name: 'Update notices', path: '/dash-board/update-notices', icon: <IoSettingsOutline /> },
  ];

  return (
    <div className="h-screen bg-[#E5DACE] items-center w-65 p-12 flex-col hidden md:flex">
      <h1 className="text-4xl font-dancing font-semibold mb-9">Moda</h1>
      
      {/* <button className="flex items-center justify-center w-full bg-white text-black py-3 rounded-full shadow-md mb-10">
        <IoEyeOutline className="mr-2" />
        Review Web
      </button> */}

      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link // Unload Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-full transition-colors ${
                isActive
                  ? 'bg-white text-orange-500 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="mr-4 text-xl">{item.icon}</div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashSideNav;