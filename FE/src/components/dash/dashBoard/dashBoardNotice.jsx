import React from 'react';

const DashBoardNotice = () => {
    const notices = [
        { text: 'Explore exlusive styles without boundaries', status: 'Active' },
        { text: 'Clothes your sprite of Fashion', status: 'Disable' },
        { text: 'Style up SEASON without breaking the bank!', status: 'Disable' },
        { text: 'Interactive fashion app project', status: 'Disable' },
        { text: 'Hello new friends', status: 'Disable' },
    ];

    const getStatusClass = (status) => {
        return status === 'Active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700';
    };

    return (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-xl mb-4">Notice</h3>
            {/* Tabs */}
            <div className="flex space-x-6 border-b mb-4">
                <button className="py-2 border-b-2 border-orange-500 font-semibold">All <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">10</span></button>
                <button className="py-2 text-gray-500">Welcome Page</button>
                <button className="py-2 text-gray-500">Homepage <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">05</span></button>
                <button className="py-2 text-gray-500">Links <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">30</span></button>
            </div>

            {/* Notice List */}
            <div className="space-y-2">
                {notices.map((notice, index) => (
                    <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                        <p>{notice.text}</p>
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(notice.status)}`}>
                                {notice.status}
                            </span>
                            <button className="bg-gray-100 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashBoardNotice;