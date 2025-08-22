import React from "react";
import { CiSettings, CiUser, CiReceipt,CiHome } from "react-icons/ci";

const Sidebar = () => {
  return (
    <aside className=" md:w-1/12 max-h bg-gradient-to-tl ml-4 my-10 from-[#4A6FA5] to-[#D6E5E3] rounded-3xl py-4 flex flex-col items-center">
        <a href="/home">
            <button className="hover:text-[#4A6FA5] flex items-center">
            <CiHome size={30} />
            </button>
        </a>

        <h1 className="text-xs mt-2 font-dancing font-semibold">SCAMS</h1>
        <nav className="w-full flex flex-col items-center border-white border-t-2 space-y-14 mt-4 py-10">
            <a href="/profile">
                <button className="hover:text-[#4A6FA5] flex">
                    <CiUser size={40} />
                </button>
            </a>
            {/* <a href="/setting">
                <button className="hover:text-[#4A6FA5] flex">
                    <CiSettings size={43} />
                </button>
            </a> */}

          {/* <button className="hover:text-pink-800 flex">
            <CiReceipt size={43} />
          </button> */}
        </nav>

        {/* <div className="mt-auto mb-4">
          <img
            src="https://via.placeholder.com/50"
            alt="User"
            className="rounded-full w-12 h-12 mx-auto"
          />
        </div> */}
      </aside>
  );
};

export default Sidebar;
