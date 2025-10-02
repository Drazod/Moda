import React, { useEffect, useState } from 'react';
import { IoPencil } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';

const DashUptNNoticesList = ({ onEditNotice }) => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosInstance.get('/notice/admin');
            console.log(res.data);
            // Ensure notices is always an array
            let data = res.data;
            if (!Array.isArray(data)) {
                if (data && Array.isArray(data.notices)) {
                    data = data.notices;
                } else {
                    data = [];
                }
            }
            setNotices(data);
        } catch (err) {
            setError('Failed to fetch notices');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (state) => state ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

    // Toggle state handler
    const handleToggleState = async (notice) => {
        try {
            await axiosInstance.put(`/notice/${notice.id}/state`, { state: !notice.state });
            fetchNotices();
        } catch (err) {
            alert('Failed to update state');
        }
    };

    return (
        <div className="space-y-2">
            {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : notices.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No notices found.</div>
            ) : (
                notices.map((notice) => (
                    <div key={notice.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <p>{notice.title}</p>
                        <div className="flex items-center space-x-4">
                            <span
                                className={`px-3 py-1 text-sm rounded-full cursor-pointer ${getStatusClass(notice.state)}`}
                                title="Click to toggle state"
                                onClick={() => handleToggleState(notice)}
                            >
                                {notice.state ? 'Enable' : 'Disable'}
                            </span>
                            <IoPencil 
                                onClick={() => onEditNotice(notice)} 
                                className="cursor-pointer text-green-500 hover:text-green-700 text-lg"
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default DashUptNNoticesList;