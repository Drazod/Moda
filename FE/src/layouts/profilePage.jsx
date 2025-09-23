import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import Sidebar from "../components/user/sidebar";
import "../index.css";
import { useAuth } from "../context/AuthContext";
import NotificationCard from "../components/user/notificationCard";
import RecentOrdersCard from "../components/user/recentOrderCard";

import OrderStatusCard from "../components/user/orderStatusCard";

import axiosInstance from '../configs/axiosInstance';
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get('/user/transactions');
        if (Array.isArray(res.data?.transactions)) {
          setTransactions(res.data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchTransactions();
  }, []);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchData();
  }, []);
  return (
  <div className="flex flex-col md:flex-row min-h-screen relative-container noise-overlay font-Jsans">
    {/* Sidebar */}
    <Sidebar />
    <div className="flex-1 mb-10">
      {/* Main Content */}
      <div className="flex-1 my-10 mx-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Card */}
        <section className="z-10 col-span-1 bg-[#BFAF92] rounded-2xl shadow flex flex-col justify-between h-full">
          <div className="p-6">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/120"
                alt="Avatar"
                className="rounded-full border w-20 h-20 mr-4"
              />
              <div>
                <h2 className="text-2xl font-semibold">{profile?.name || "Guest"}</h2>
                <p className="text-gray-600">{profile?.email || "example@email.com"}</p>
              </div>
            </div>
            <div className="mt-4 text-[#1D1A05] flex justify-between">
              <p>Membership: {profile?.membership || "No membership"}</p>
            </div>
            <div className="mt-4 w-full bg-[#F2F2F2] rounded-full h-2.5">
              <div
                style={{ width: `${profile?.membershipProgress || 20}%` }}
                className="bg-[#434237] h-2.5 rounded-full"
              >
              </div>
            </div>
            <div className="mt-6 space-y-6">
              <h3 className="font-semibold text-2xl">Profile</h3>
              <p>Address: {profile?.address || "No address provided"}</p>
              <p>📞 {profile?.phone || "No phone number"}</p>
            </div>
          </div>

          {/* Log out button at the bottom */}
          <button
            onClick={handleLogout}
            className="bg-[#434237] text-[#FFFFFF] font-extralight text-2xl py-2 pl-6 rounded-b-2xl hover:bg-[#2f2e25] w-full h-14 flex items-center"
          >
            <BiLogOutCircle className="mr-2" /> Log out
          </button>
        </section>
        <NotificationCard />
      </div>
      <div className="flex-1 mx-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <RecentOrdersCard
          orders={transactions.map(tx => ({
            id: tx.orderId,
            date: (typeof tx.date === 'string' && tx.date.includes(',')) ? tx.date.split(',')[1].trim() : tx.date,
            price: tx.price,
          }))}
        />

        <OrderStatusCard
          items={[
            { id: "#1239", item: "Shirt, Jean", date: "10/12/2024", price: "200.000 VND", status: "prepare" },
            { id: "#1240", item: "Shirt, Jean", date: "11/12/2024", price: "200.000 VND", status: "ongoing" },
            { id: "#1241", item: "Shirt, Jean", date: "12/12/2024", price: "200.000 VND", status: "completed" },
          ]}
        />
      </div>
    </div>
  </div>
  );
}