import React, { useState, useEffect } from "react";
import "../index.css";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import CartModal from "../layouts/cart";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false); // ⬅️ add cart modal state
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prefer a safe display name
  const displayName = user?.name || user?.username || user?.email || "Profile";

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-[#BFAF92] grid ${
        isMobile ? "grid-cols-1" : "grid-cols-3"
      } items-center text-[22px] px-12 py-6 border-b border-[#434237] z-30 font-Jsans`}
    >
      {/* Left: CTA */}
      <div className="flex items-center space-x-6">
        <Link to="/store">
          <button
            className="text-white rounded-full py-2 px-4 bg-[#434237] hover:bg-gray-400 transition-colors duration-300"
            aria-label="Shop now"
          >
            shop now
          </button>
        </Link>
      </div>

      {/* Center: Brand */}
      {!isMobile && (
        <div className="flex justify-center">
          <Link to="/home">
            <h1 className="text-[40px] font-dancing font-semibold mr-6">
              Moda
            </h1>
          </Link>
        </div>
      )}

      {/* Right: Nav + User + Cart */}
      <div className="flex items-center font-light justify-end space-x-6 relative">
        <Link to="/home#story" className="hover:text-gray-600">
          our story
        </Link>
        <Link to="/home#contact" className="hover:text-gray-600">
          contact us
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="flex items-center space-x-2 hover:text-gray-600">
              <FaUserCircle className="text-xl" />
              <span className="text-base font-medium">{displayName}</span>
            </Link>
            <button
              onClick={logout}
              className="text-sm bg-[#E8F1F2] text-[#1D1A05] px-3 py-1 rounded hover:bg-[#D6E5E3] transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="flex items-center space-x-2 hover:text-gray-600">
            <FaUserCircle className="text-xl" />
            <span className="text-base font-medium">Login</span>
          </Link>
        )}

        <button
          onClick={() => setOpen(true)}
          className="p-1 -m-1"
          aria-label="Open cart"
          title="Cart"
        >
          <FaShoppingCart className="text-xl hover:text-gray-600" />
        </button>
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
