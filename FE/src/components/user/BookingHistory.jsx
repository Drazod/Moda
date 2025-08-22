import React from "react";

const BookingHistory = ({ bookings = [], onEdit }) => {
  return (
    <section className="col-span-3 mt-10 mx-4 bg-[#4A6FA5] p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4 text-white">Booking History</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex justify-between items-center bg-[#E8F1F2] px-4 py-3 rounded-lg shadow text-[#1D1A05]"
          >
            <span className="font-bold">#{booking.scheduleId}</span>
            <span>{booking.room?.name}</span>
            <span>{new Date(booking.date).toLocaleDateString()}</span>
            <span>{new Date(booking.start).toLocaleTimeString()}</span>
            <span>{new Date(booking.end).toLocaleTimeString()}</span>
            <button
              onClick={() => onEdit(booking)}
              className="text-gray-700 hover:text-[#1D1A05]"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookingHistory;
