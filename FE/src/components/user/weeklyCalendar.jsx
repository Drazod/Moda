import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosInstance";

const WeeklyCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setBookings(res.data.user.bookings || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
    };

    fetchBookings();
  }, []);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7) + weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const formatDate = (date) =>
    date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <section className="col-span-2 bg-[#4A6FA5] text-[#1D1A05] rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Weekly Timetable</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="bg-white text-[#4A6FA5] px-2 py-1 rounded shadow">
            ◀ Previous
          </button>
          <span className="font-semibold text-white">
            {formatDate(startOfWeek)} – {formatDate(new Date(endOfWeek.getTime() - 1))}
          </span>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="bg-white text-[#4A6FA5] px-2 py-1 rounded shadow">
            Next ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 ml-10">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
          <div key={day} className="font-bold text-center">{day}</div>
        ))}
      </div>

      <div className="relative border rounded overflow-hidden" style={{ height: "470px" }}>
        <div className="absolute left-0 bg-[#E8F1F2] top-0 w-14 h-full border-r border-gray-200">
          {Array.from({ length: 11 }).map((_, i) => {
            const hour = 8 + i;
            return (
              <div key={hour} className="h-[45px] text-xs text-right pr-1 font-semibold">
                {hour}:00
              </div>
            );
          })}
        </div>

        <div className="ml-14 bg-[#E8F1F2] flex h-full">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIdx) => (
            <div key={day} className="flex-1 relative border-l border-gray-200">
              {bookings
                .filter(b => {
                  const d = new Date(b.start);
                  return (
                    d >= startOfWeek &&
                    d < endOfWeek &&
                    ((d.getDay() + 6) % 7) === dayIdx
                  );
                })
                .map((b, i) => {
                  const start = new Date(b.start);
                  const end = new Date(b.end);
                  const top = ((start.getHours() + start.getMinutes() / 60) - 8) * 45;
                  const height = ((end - start) / 1000 / 60) * 0.75;

                  return (
                    <div
                      key={i}
                      className="absolute left-1 right-1 bg-[#E09891] text-white text-xs rounded px-1 py-0.5 shadow"
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      {b.room?.name || "Room"} <br />
                      {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                      {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyCalendar;
