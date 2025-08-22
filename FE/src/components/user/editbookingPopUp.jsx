import React, { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import axiosInstance from "../../configs/axiosInstance";
import "react-datepicker/dist/react-datepicker.css";

const EditBookingPopup = ({ show, booking, onClose, onUpdated }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  console.log("Booking:", booking);
  useEffect(() => {
    if (booking) {
      setSelectedDate(new Date(booking.date));
      setStartTime(new Date(booking.start));
      setEndTime(new Date(booking.end));
    }
  }, [booking]);
  const handleSubmit = async ()  => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const startStr = startTime.toTimeString().slice(0, 5); // e.g., "10:30"
      const endStr = endTime.toTimeString().slice(0, 5); 
      console.log(dateStr, startStr, endStr);
      await axiosInstance.put(`/rooms/${booking.room._id}/${booking.scheduleId}/schedule`, {
        date: dateStr,
        start: startStr,
        end: endStr
      });
      alert("Schedule updated successfully!");
      onUpdated(); // refresh profile
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-[#1D1A05]">
        <h3 className="text-xl font-bold mb-4">Edit Booking</h3>
        <label className="block mb-2">Start Time</label>
        <DatePicker
          selected={startTime}
          onChange={(date) => setStartTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Start"
          dateFormat="h:mm aa"
          className="w-full p-2 border rounded mb-4"
        />
        <label className="block mb-2">End Time</label>
        <DatePicker
          selected={endTime}
          onChange={(date) => setEndTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="End"
          dateFormat="h:mm aa"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingPopup;
