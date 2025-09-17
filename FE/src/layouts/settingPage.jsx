import React, { useState } from 'react';
import { CiSettings, CiUser, CiLock, CiGlobe} from "react-icons/ci";
import InformationForm from '../components/user/setting/information';
import PrivacyForm from '../components/user/setting/privacy';
import Support from '../components/user/setting/support';
import Footer from '../components/footer';
import Sidebar from '../components/user/sidebar';
import "../index.css";
import { useGetProfileQuery } from "../configs/authentication/profileSlice";

function Settings() {
  const { data: profile } = useGetProfileQuery();

  const [activeTab, setActiveTab] = useState('Profile');

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative-container noise-overlay font-Jsans">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content Area */}
      <div className="z-10 flex w-full my-10 mx-4 bg-[#BFAF92]  text-black rounded-3xl ">
        <aside className="w-1/4 bg-[#BFAF92]  p-6 flex flex-col rounded-l-3xl">
          <h2 className="flex text-3xl text-left mb-6 items-center font-semibold">
            <CiSettings size={43} className="mr-3" />Setting
          </h2>
          <ul className="w-full">
            <li
              className={`py-3 px-4 ${activeTab === 'Profile' ? 'bg-white text-black font-semibold' : 'hover:bg-white'} rounded-lg cursor-pointer mb-3`}
              onClick={() => setActiveTab('Profile')}
            >
              <CiUser size={20} className="inline mr-2" /> Account Details
            </li>
            <li
              className={`py-3 px-4 ${activeTab === 'Privacy' ? 'bg-white text-black font-semibold' : 'hover:bg-white'} rounded-lg cursor-pointer mb-3`}
              onClick={() => setActiveTab('Privacy')}
            >
              <CiLock size={20} className="inline mr-2" /> Privacy
            </li>
            <li
              className={`py-3 px-4 ${activeTab === 'Language' ? 'bg-white text-black font-semibold' : 'hover:bg-white'} rounded-lg cursor-pointer mb-3`}
              onClick={() => setActiveTab('Language')}
            >
              <CiGlobe size={20} className="inline mr-2" /> Language & Regional
            </li>
            <li
              className={`py-3 px-4 ${activeTab === 'Support' ? 'bg-white text-black font-semibold' : 'hover:bg-white'} rounded-lg cursor-pointer`}
              onClick={() => setActiveTab('Support')}
            >
              <div className="inline mr-2" /> Support
            </li>
          </ul>
        </aside>
          {activeTab === 'Profile' && <InformationForm />}
          {activeTab === 'Privacy' && <PrivacyForm/>}
          {activeTab === 'Language' && <div>Language & Regional Settings Content</div>}
          {activeTab === 'Support' && <Support/>}
      </div>
    </div>
  );
}

export default Settings;
