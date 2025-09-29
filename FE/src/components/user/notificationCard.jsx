

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axiosInstance from '../../configs/axiosInstance';

const API_URL = "/notice"; // Relative to axiosInstance baseURL
const SOCKET_URL = "https://moda-production.up.railway.app"; // Replace with your actual Socket URL

const NotificationCard = ({ userId, page }) => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const params = {};
        if (userId) params.userId = userId;
        if (page) params.page = page;
        axiosInstance
            .get(API_URL, { params })
            .then((res) => setNotices(Array.isArray(res.data) ? res.data : (res.data.notices || [])))
            .catch(() => {});

        const socket = io(SOCKET_URL, {
            query: { userId },
            transports: ["websocket"],
        });
        socket.on("new-notice", (notice) => {
            // Show if for this user OR for this page
            const isForUser = !notice.userId || String(notice.userId) === String(userId);
            const isForPage = Array.isArray(notice.pages) && notice.pages.includes(page);
            if (isForUser || isForPage) {
                setNotices((prev) => [notice, ...prev]);
            }
        });

        socket.on("remove-notice", (noticeId) => {
            setNotices((prev) => prev.filter((n) => n.id !== noticeId));
        });
        return () => socket.disconnect();
    }, [userId, page]);

    return (
        <section className="col-span-2 bg-[#BFAF92] rounded-2xl p-6 shadow-md z-10">
            <h2 className="text-lg font-semibold mb-4">Notification</h2>
            <div className="space-y-6 text-base text-[#1D1A05] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/60 dark:[&::-webkit-scrollbar-track]:bg-neutral-700/50 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500/60">
                {notices.length === 0 ? (
                    <div className="text-sm text-gray-500">No notifications yet.</div>
                ) : (
                    notices.map((notice, idx) => (
                        <React.Fragment key={notice.id}>
                            <div>
                                <p className="font-semibold">{notice.title}</p>
                                {notice.subtitle && (
                                    <p className="text-sm text-[#696F8C]">| {notice.subtitle}</p>
                                )}
                                <p className="mt-1 text-sm">
                                    <span dangerouslySetInnerHTML={{ __html: notice.content }} />
                                </p>
                                <p className="text-[#696F8C] text-xs">{notice.createdAt ? new Date(notice.createdAt).toLocaleString() : ""}</p>
                            </div>
                            {idx !== notices.length - 1 && <hr />}
                        </React.Fragment>
                    ))
                )}
            </div>
        </section>
    );
};

export default NotificationCard;
