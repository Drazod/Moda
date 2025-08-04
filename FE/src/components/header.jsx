import React, { useState, useEffect } from "react";
import "../index.css";
import { FaUserCircle, FaShoppingCart, FaGift } from "react-icons/fa";
// import CartModal from "../layouts/cart";

export default function Header() {
  // const [showCart, setShowCart] = useState(false);
  console.log("Welcome Page");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full bg-[#BFAF92] grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} items-center text-[22px] px-12 py-6 border-b border-[#434237] z-20 font-Jsans`}>
      <div className="flex items-center space-x-6">
        <a href="/store">
          <button className=" text-white rounded-full py-2 px-4 bg-[#434237] hover:bg-gray-400 transition-colors duration-300 z-20">
            shop now
          </button>
        </a>
      </div>

      {!isMobile && (
        <div className="flex justify-center">
          <a href="/home">
            <h1 className="text-[40px] font-dancing font-semibold mr-6">
              Moda
            </h1>
          </a>
        </div>
      )}

      <div className="flex items-center font-light justify-end space-x-6 relative">
        <a href="/home#contact" className="hover:text-gray-600">
          our story
        </a>
        <a href="/home#contact" className="hover:text-gray-600">
          contact us
        </a>
        
        {/* <a href={memberData ? "/profile" : "/login"} className="flex items-center space-x-2"> */}
        <a className="flex items-center space-x-2">
          <FaUserCircle className="text-xl hover:text-gray-600" />
            <span className="text-base font-medium">Login</span>
        </a>

        {/* <FaShoppingCart onClick={() => setShowCart(true)} className="text-xl hover:text-gray-600" />
        <CartModal showCart={showCart} setShowCart={setShowCart} /> */}
        <FaShoppingCart className="text-xl hover:text-gray-600" />
      </div>

      {isMobile && (
        <div className="flex justify-center mt-4">
          <a href="/home">
            <h1 className="text-[30px] font-dancing font-semibold">
              Moda
            </h1>
          </a>
        </div>
      )}
    </header>
  );
}
