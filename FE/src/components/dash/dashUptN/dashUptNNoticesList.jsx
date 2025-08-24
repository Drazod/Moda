import React from 'react';
import { IoPencil } from 'react-icons/io5';

const DashUptNNoticesList = ({ onEditNotice }) => {
    const notices = [
        { id: 1, title: 'Explore exlusive styles without boundaries', status: 'Active' },
        { id: 2, title: 'Clothes your sprite of Fashion', status: 'Disable' },
        { id: 3, title: 'Style up SEASON without breaking the bank!', status: 'Disable' },
    ];

    const getStatusClass = (status) => status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

    return (
        <div className="space-y-2">
            {notices.map((notice) => (
                <div key={notice.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <p>{notice.title}</p>
                    <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(notice.status)}`}>{notice.status}</span>
                        <IoPencil onClick={() => onEditNotice(notice)} className="cursor-pointer text-gray-500 hover:text-green-500"/>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashUptNNoticesList;