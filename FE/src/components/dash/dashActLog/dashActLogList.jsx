
import React, { useEffect, useState } from 'react';
import { IoPencil, IoTrashOutline, IoAddCircleOutline } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';

function groupLogsByDate(logs) {
    // Group logs by YYYY-MM-DD
    return logs.reduce((acc, log) => {
        const date = new Date(log.createdAt);
        const dateStr = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(log);
        return acc;
    }, {});
}

const DashActLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosInstance.get('/log');
            if (Array.isArray(res.data)) {
                setLogs(res.data);
            } else if (Array.isArray(res.data?.logs)) {
                setLogs(res.data.logs);
            } else {
                setLogs([]);
            }
        } catch (err) {
            setError('Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    const logDataByDate = groupLogsByDate(logs);

    // Guess icon by action string (edit, new, delete)
    const getLogIcon = (action) => {
        if (!action) return <div className="h-2.5 w-2.5 bg-gray-300 rounded-full"></div>;
        const a = action.toLowerCase();
        if (a.includes('edit') || a.includes('update')) return <IoPencil className="h-5 w-5 text-blue-500" />;
        if (a.includes('add') || a.includes('create')) return <IoAddCircleOutline className="h-5 w-5 text-green-500" />;
        if (a.includes('delete') || a.includes('remove')) return <IoTrashOutline className="h-5 w-5 text-red-500" />;
        return <div className="h-2.5 w-2.5 bg-gray-300 rounded-full"></div>;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full font-sans">
            {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : logs.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No activity logs found.</div>
            ) : (
                <div className="flow-root">
                    <ul className="-mb-8">
                        {Object.entries(logDataByDate).map(([date, logs], dateIndex) => (
                            <li key={date}>
                                <div className="relative pb-8">
                                    {/* Timeline */}
                                    {dateIndex !== Object.keys(logDataByDate).length - 1 && (
                                        <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    )}
                                    {/* Header */}
                                    <div className="relative flex items-center space-x-3">
                                        <div className="relative h-10 w-10 flex items-center justify-center">
                                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center ring-4 ring-white">
                                                {getLogIcon('date')}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">{date}</h3>
                                    </div>
                                    {/* Log */}
                                    <div className="ml-3 mt-4 space-y-6 pl-11">
                                        {logs.length > 0 ? (
                                            logs.map((log, logIndex) => (
                                                <div key={log.id || logIndex} className="relative flex items-start space-x-4">
                                                    {/* Icon */}
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white">
                                                        {getLogIcon(log.action)}
                                                    </div>
                                                    {/* Log */}
                                                    <div className="min-w-0 flex-1 pt-1.5">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-bold text-amber-800">{log.userName}</span>
                                                            <span className="italic text-blue-700"> (ID: {log.userId}) </span>
                                                            {log.action}
                                     
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-400">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="relative flex items-start space-x-4">
                                                <div className="flex h-10 w-10 items-center justify-center"></div>
                                                <div className="min-w-0 flex-1 pt-1.5">
                                                    <p className="text-sm text-gray-400 italic">No activity on this day.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="text-center mt-10">
                <button className="text-orange-600 font-semibold text-sm hover:underline">
                    Load more
                </button>
            </div>
        </div>
    );
};

export default DashActLogList;