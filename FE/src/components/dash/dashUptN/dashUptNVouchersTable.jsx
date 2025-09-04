import React from 'react';

const DashUptNVouchersTable = () => {
    const vouchers = [
        { id: 1, value: '50%', dateEnd: 'May 25, 2023', stock: 1000 },
        { id: 2, value: '20%', dateEnd: 'Jun 20, 2023', stock: 1000 },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-3 font-medium">Id</th>
                        <th className="py-3 font-medium">Discount value</th>
                        <th className="py-3 font-medium">Date end</th>
                        <th className="py-3 font-medium text-right">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {vouchers.map((v) => (
                        <tr key={v.id} className="border-b last:border-b-0">
                            <td className="py-4">{v.id}</td>
                            <td className="py-4">{v.value}</td>
                            <td className="py-4">{v.dateEnd}</td>
                            <td className="py-4 text-right">{v.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashUptNVouchersTable;