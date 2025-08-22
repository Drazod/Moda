import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Sidebar from "../components/user/sidebar";
import "../index.css";
import { useAuth } from "../context/AuthContext";
import EditBookingPopup from "../components/user/editbookingPopUp";
import WeeklyCalendar from "../components/user/WeeklyCalendar";
import BookingHistory from "../components/user/BookingHistory";
import UserApproval from "../components/user/UserApproval";
import RoomListEditor from "../components/user/RoomEditor";
import AllRoomTimetable from "../components/user/AllRoomTimetable";
import axiosInstance from '../configs/axiosInstance';
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  // const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

const handleEditBooking = (roomIdOrBooking, maybeScheduleId) => {
  if (typeof roomIdOrBooking === "object") {
    setSelectedBooking(roomIdOrBooking);
  } else {
    setSelectedBooking({ roomId: roomIdOrBooking, scheduleId: maybeScheduleId });
  }
  setEditPopupOpen(true);
};


  const closeEditPopup = () => {
    setEditPopupOpen(false);
    setSelectedBooking(null);
  };

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
  <div className="flex flex-col md:flex-row min-h-screen bg-[#D6E5E3] text-[#1D1A05] font-sans">
    {/* Sidebar */}
    <Sidebar />
    <div className="flex-1 mb-10">
      {/* Main Content */}
      <div className="flex-1 my-10 mx-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Card */}
        <section className="col-span-1 bg-[#4A6FA5] rounded-2xl shadow flex flex-col justify-between h-full">
          <div className="p-6">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Avatar"
                className="rounded-full w-20 h-20 mr-4"
              />
              <div>
                <h2 className="text-2xl font-semibold">{profile?.user.name || "Guest"}</h2>
                <p className="text-gray-600">{profile?.user.role}</p>
              </div>
            </div>
            <div className="mt-4 text-[#1D1A05] flex justify-between">
              <p>ID</p>
              <p className="text-gray-600">{profile?.user._id}</p>
            </div>

            <div className="mt-6 space-y-6">
              <h3 className="font-semibold text-2xl">Profile</h3>
              <p>Address: {profile?.user.address || "No address provided"}</p>
              <p>📞 {profile?.user.phone || "No phone number"}</p>
            </div>
          </div>

          {/* Log out button at the bottom */}
          <button
            onClick={handleLogout}
            className="bg-[#E8F1F2] text-[#1D1A05] py-2 px-4 rounded-b-2xl hover:bg-[#E09891] w-full h-14 flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" /> Log out
          </button>
        </section>
       

        {profile?.user.role === "lecturer" ? (
          <WeeklyCalendar />
        ) : profile?.user.role === "staff" ? (
          <RoomListEditor  />
        ) : null}
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-10">
      {profile?.user.role === "lecturer" ? (
        <BookingHistory
          bookings={profile?.user.bookings || []}
          onEdit={handleEditBooking}
        />
      ) : profile?.user.role === "staff" ? (
        <>
          <AllRoomTimetable onEdit={handleEditBooking}/>
          <UserApproval />
        </>
      ) : null}
      </div>


      <EditBookingPopup
        show={editPopupOpen}
        booking={selectedBooking}
        onClose={closeEditPopup}
        onUpdated={() => window.location.reload()}
      />
    </div>
  </div>
  );
}