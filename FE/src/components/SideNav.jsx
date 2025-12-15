import React, { useState,useEffect } from 'react';
import "../index.css";
import { Link, useLocation } from 'react-router-dom';
import { 
  IoHomeOutline, 
  IoSearchOutline, 
  IoCompassOutline, 
  IoPaperPlaneOutline,
  IoBagCheckOutline,
  IoPersonCircleOutline,
  IoMenuOutline,
  IoShirtOutline,
  IoPersonAddOutline,
  IoStorefrontOutline
} from 'react-icons/io5';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const SideNav = ({ onCartOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isCollapsed, setIsCollapsed] = useState();
  const cartCount = items.reduce((sum, it) => sum + (it.qty || 0), 0);
  
  useEffect(() => {
    setIsCollapsed(location.pathname !== '/friends');
  }, [location.pathname]);

  const navItems = [
    { icon: IoHomeOutline, label: 'Home', path: '/home' },
    { icon: IoSearchOutline, label: 'Search', path: '/store' },
    { icon: IoCompassOutline, label: 'Explore', path: '/explore' },
    { icon: IoStorefrontOutline, label: 'Marketplace', path: '/marketplace' },
    // { icon: IoFilmOutline, label: 'Reels', path: '/store' },
    { icon: IoPaperPlaneOutline, label: 'Messages', path: '/chat' },
    { icon: IoBagCheckOutline, label: 'Trading', path: '/marketplace/my-trades' },
    { icon: IoShirtOutline, label: 'Shop', path: '/store' },
    { icon: IoPersonAddOutline, label: 'Friends', path: '/friends' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-[#E6DAC4] flex flex-col py-8 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-20 px-3' : 'w-64 px-3'
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => {
        if (location.pathname !== '/friends') {
          setIsCollapsed(true);
        }
      }}
    >
      {/* Logo */}
      <Link to="/home" className="px-3 mb-10 text-center">
        {isCollapsed ? (
          <h1 className="text-2xl font-dancing font-semibold text-[#434237]">M</h1>
        ) : (
          <h1 className="text-3xl font-dancing font-semibold text-[#434237]">Moda</h1>
        )}
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'font-semibold' 
                  : 'hover:bg-gray-100'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="text-2xl" />
              {!isCollapsed && <span className="text-base">{item.label}</span>}
            </Link>
          );
        })}

        {/* Cart Button */}
        <button
          onClick={onCartOpen}
          className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors w-full relative ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Cart' : ''}
        >
          <FaShoppingCart className="text-2xl" />
          {!isCollapsed && <span className="text-base">Cart</span>}
          {cartCount > 0 && (
            <span className={`absolute ${isCollapsed ? 'left-8 top-2' : 'left-8 top-2'} min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-semibold leading-[18px] text-center`}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>

        {/* Profile */}
        {user ? (
          <Link
            to="/profile"
            className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
              location.pathname === '/profile' 
                ? 'font-semibold' 
                : 'hover:bg-gray-100'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? (user?.name || 'Profile') : ''}
          >
            <IoPersonCircleOutline className="text-2xl" />
            {!isCollapsed && <span className="text-base">{user?.name || 'Profile'}</span>}
          </Link>
        ) : (
          <Link
            to="/login"
            className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Login' : ''}
          >
            <IoPersonCircleOutline className="text-2xl" />
            {!isCollapsed && <span className="text-base">Login</span>}
          </Link>
        )}
      </nav>

      {/* More Menu */}
      <div className="border-t border-gray-200 pt-4">
        <button 
          className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'More' : ''}
        >
          <IoMenuOutline className="text-2xl" />
          {!isCollapsed && <span className="text-base">More</span>}
        </button>
      </div>
    </div>
  );
};

export default SideNav;
