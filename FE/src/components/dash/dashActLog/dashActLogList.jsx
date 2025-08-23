import React from 'react';
import { IoPencil, IoTrashOutline, IoAddCircleOutline } from 'react-icons/io5';

const DashActLogList = () => {
    // Dữ liệu giả được cập nhật chính xác theo yêu cầu của bạn
    const logDataByDate = {
        "Today, 23 May 2025": [
            {
                type: 'new', // 'new' cho hành động 'add'
                user: 'Zod',
                role: 'Admin1',
                action: 'had added new product',
                target: 'Basic Heavy Weight T-shirt',
                id: '123',
                time: '12:50',
            },
            {
                type: 'delete',
                user: 'Lam',
                role: 'Admin2',
                action: 'had deleted product',
                target: 'Camo Short',
                id: '456',
                time: '11:40',
            }
        ],
        "Yesterday, 22 May 2025": [
            {
                type: 'edit', // 'edit' cho hành động 'update'
                user: 'Zinh',
                role: 'Admin3',
                action: 'had updated a notice',
                target: 'Summer Sale',
                id: '789',
                time: '16:45',
            },
            {
                type: 'new',
                user: 'Lam',
                role: 'Admin2',
                action: 'had added voucher',
                target: '50%',
                id: 'abc',
                time: '11:40',
            },
            {
                type: 'delete',
                user: 'Zod',
                role: 'Admin1',
                action: 'had deleted user',
                target: 'Minh',
                id: 'xyz',
                time: '12:50',
            }
        ],
        "21 May 2025": [], // Nhóm ngày không có hoạt động
        "13 May 2025": []  // Nhóm ngày không có hoạt động
    };

    // Hàm helper để chọn icon và màu sắc
    const getLogIcon = (type) => {
        switch (type) {
            case 'edit':
                return <IoPencil className="h-5 w-5 text-blue-500" />;
            case 'new':
                return <IoAddCircleOutline className="h-5 w-5 text-green-500" />;
            case 'delete':
                return <IoTrashOutline className="h-5 w-5 text-red-500" />;
            default:
                // Icon mặc định cho các nhóm ngày
                return <div className="h-2.5 w-2.5 bg-gray-300 rounded-full"></div>;
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full font-sans">
            <div className="flow-root">
                <ul className="-mb-8">
                    {Object.entries(logDataByDate).map(([date, logs], dateIndex) => (
                        <li key={date}>
                            <div className="relative pb-8">
                                {/* Đường kẻ dọc timeline */}
                                {dateIndex !== Object.keys(logDataByDate).length - 1 && (
                                    <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                )}
                                
                                {/* Header của nhóm ngày */}
                                <div className="relative flex items-center space-x-3">
                                    <div className="relative h-10 w-10 flex items-center justify-center">
                                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center ring-4 ring-white">
                                            {getLogIcon('date')}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-800">{date}</h3>
                                </div>

                                {/* Danh sách các log trong ngày */}
                                <div className="ml-3 mt-4 space-y-6 pl-11">
                                    {logs.length > 0 ? (
                                        logs.map((log, logIndex) => (
                                            <div key={logIndex} className="relative flex items-start space-x-4">
                                                {/* Icon cho từng hành động */}
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white">
                                                    {getLogIcon(log.type)}
                                                </div>
                                                
                                                {/* Nội dung log */}
                                                <div className="min-w-0 flex-1 pt-1.5">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-bold text-amber-800">{log.user}</span>
                                                        <span className="italic"> ({log.role}) </span>
                                                        {log.action}
                                                        <span className="font-bold text-orange-600"> {log.target} </span>
                                                        <span className="italic">(id={log.id})</span>
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400">{log.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Hiển thị nếu không có log trong ngày
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
            <div className="text-center mt-10">
                <button className="text-orange-600 font-semibold text-sm hover:underline">
                    Load more
                </button>
            </div>
        </div>
    );
};

export default DashActLogList;