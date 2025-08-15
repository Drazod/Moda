import React from 'react';

// To be continued
import { IoGridOutline, IoSettingsOutline, IoDocumentTextOutline, IoPeopleOutline, IoTimeOutline, IoBriefcaseOutline, IoEyeOutline } from 'react-icons/io5';

const SideNav = () => {
  const navItems = [
    { name: 'Dashboard', icon: <IoGridOutline />, active: true },
    { name: 'Products manage', icon: <IoBriefcaseOutline /> },
    { name: 'Order manage', icon: <IoDocumentTextOutline /> },
    { name: 'Activity log', icon: <IoTimeOutline /> },
    { name: 'Users', icon: <IoPeopleOutline /> },
    { name: 'Update notices', icon: <IoSettingsOutline /> },
  ];

  return (
    <div className="h-screen bg-[#E5DACE] w-64 p-6 flex flex-col">
      <h1 className="text-4xl font-dancing font-semibold mb-12">Moda</h1>
      
      <button className="flex items-center justify-center w-full bg-white text-black py-3 rounded-full shadow-md mb-10">
        <IoEyeOutline className="mr-2" />
        Review Web
      </button>

      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center p-3 rounded-full transition-colors ${
              item.active
                ? 'bg-white text-orange-500 font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="mr-4 text-xl">{item.icon}</div>
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;