import React, { useState, useEffect } from "react";
import "../index.css";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { IoPersonAdd, IoChatbubble, IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartModal from "../layouts/cart";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, it) => sum + (it.qty || 0), 0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        setScrolled(rootElement.scrollTop > 50);
      }
    };
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.addEventListener("scroll", handleScroll);
      return () => rootElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery);
      // For now, just log the search query
      // You can navigate to a search results page or filter products
    }
  };

  const closeSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  const displayName = user?.name || user?.username || user?.email || "Profile";

  return (
    <header
      className={`fixed top-0 left-0 w-full grid ${
        isMobile ? "grid-cols-1" : "grid-cols-5"
      } items-center text-[20px] px-12 py-2 z-30 font-Jsans transition-all duration-300 ${
        scrolled ? "bg-[#BFAF92] text-black" : "bg-transparent text-black"
      }`}
    >
      {/* Center: Brand */}
      {!isMobile && (
        <div className="flex ">
          <Link to="/">
            <h1 className="text-[40px] font-dancing font-semibold mr-6">Moda</h1>
          </Link>
        </div>
      )}

      {/* Left: CTA */}
      <div className="flex items-center space-x-6 col-span-2">
        <Link to="/store">
          <button
            className="hover:text-gray-600 rounded-full py-2 px-4 transition-colors duration-300"
            aria-label="Shop now"
          >
            Shop
          </button>
        </Link>
        <Link to="/home#story" className="hover:text-gray-600">
          Feature
        </Link>
        <Link to="/home#contact" className="hover:text-gray-600">
          Contact 
        </Link>
        <Link to="/fitting-room" className="hover:text-gray-600">
          Virtual Try-on 
        </Link>
      </div>
      <div className="flex items-center space-x-6 col-span-1">
        <Link to="/friends" className="hover:text-gray-600" title="Friends">
          Social
        </Link>
        
        {/* Expandable Search */}
        <div className="relative">
          {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-2 hover:text-gray-600 cursor-pointer transition-all"
            >
              <IoSearchOutline className="text-xl" />
              <span>Search</span>
            </button>
          ) : (
            <form onSubmit={handleSearch} className="flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    closeSearch();
                  }
                }}
                placeholder="Search clothes or keywords..."
                autoFocus
                className="w-64 pl-4 pr-10 py-2 rounded-full bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BFAF92] transition-all duration-300 shadow-md"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <IoCloseCircle className="text-xl" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right: Nav + User + Cart */}
      <div className="flex items-center font-light space-x-6 col-span-1 justify-end">
        {user ? (
          <>
            <Link to="/profile" className="flex items-center space-x-2 hover:text-gray-600">
              <FaUserCircle className="text-xl" />
              <span className="text-base font-medium">{displayName}</span>
            </Link>
            {/* <button
              onClick={logout}
              className="text-sm bg-[#E8F1F2] text-[#1D1A05] px-3 py-1 rounded hover:bg-[#D6E5E3] transition"
            >
              Logout
            </button> */}
          </>
        ) : (
          <Link to="/login" className="flex items-center space-x-2 hover:text-gray-600">
            <FaUserCircle className="text-xl" />
            <span className="text-base font-medium">Login</span>
          </Link>
        )}

        {/* Cart button + badge */}
        <button
          onClick={() => setOpen(true)}
          className="relative p-1 -m-1"
          aria-label="Open cart"
          title="Cart"
          type="button"
        >
          <FaShoppingCart className="text-xl hover:text-gray-600" />

          {/* Badge */}
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1
                         rounded-full bg-black text-white text-[11px]
                         font-semibold leading-[18px] text-center"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
        <Link to="/chat" className="hover:text-gray-600" title="Messages">
          <IoChatbubble className="text-2xl" />
        </Link>
        <CartModal open={open} onClose={() => setOpen(false)} />
      </div>

      {isMobile && (
        <div className="flex justify-center mt-4">
          <Link to="/home">
            <h1 className="text-[30px] font-dancing font-semibold">Moda</h1>
          </Link>
        </div>
      )}
    </header>
  );
}
