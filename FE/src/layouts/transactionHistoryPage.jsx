import React, { useEffect, useState } from "react";
import Sidebar from "../components/user/sidebar";
import axiosInstance from '../configs/axiosInstance';
import { FiExternalLink } from "react-icons/fi";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 7;
  const pageCount = Math.ceil(transactions.length / pageSize);
  const pagedTransactions = transactions.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get('/user/transactions');
        if (Array.isArray(res.data?.transactions)) {
          setTransactions(res.data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#e6dac4] font-Jsans">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">Order history</h2>
        <div className="bg-[#BFAF92] rounded-2xl shadow p-0 overflow-x-auto">
          {/* Custom styled header */}
          <div className="rounded-t-2xl bg-[#23211A] flex items-center px-6" style={{height:'48px'}}>
            <div className="w-[120px] text-white font-semibold text-lg">Order Id</div>
            <div className="flex-1 text-white font-semibold text-lg">Detail</div>
            <div className="w-[160px] text-white font-semibold text-lg">Date</div>
            <div className="w-[100px] text-white font-semibold text-lg">Time</div>
            <div className="w-[120px] text-white font-semibold text-lg">Price</div>
            <div className="w-[60px]"></div>
          </div>
          <div className="px-6 pt-2 pb-4">
            {pagedTransactions.map((tx, idx) => (
              <div key={tx.orderId || idx} className="flex items-center border-b border-[#e6dac4] py-3 hover:bg-[#efe5d6] transition">
                <div className="w-[120px] font-semibold text-base text-[#fff]" style={{color:'#fff', fontWeight:600}}>{tx.orderId}</div>
                <div className="flex-1 text-base text-[#fff] opacity-80" style={{color:'#fff', opacity:0.8}}>{tx.detail}</div>
                <div className="w-[160px] text-base text-[#fff] opacity-80" style={{color:'#fff', opacity:0.8}}>
                  {(typeof tx.date === 'string' && tx.date.includes(',')) ? tx.date.split(',')[1].trim() : tx.date}
                </div>
                <div className="w-[100px] text-base text-[#fff] opacity-80" style={{color:'#fff', opacity:0.8}}>{tx.time}</div>
                <div className="w-[120px] font-bold text-base text-[#fff]" style={{color:'#fff', fontWeight:700}}>
                  {tx.price && tx.price.split(' ').length > 1 ? (
                    <>
                      <span style={{fontWeight:700}}>{tx.price.split(' ')[0]}</span>
                      <br/>
                      <span style={{fontWeight:700}}>{tx.price.split(' ').slice(1).join(' ')}</span>
                    </>
                  ) : tx.price}
                </div>
                <div className="w-[60px] text-right">
                  <button className="hover:text-[#434237]">
                    <FiExternalLink size={22} />
                  </button>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-8 text-center text-gray-500">No transactions found.</div>
            )}
            {/* Pagination dots (dynamic) */}
            {pageCount > 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    className={`inline-block w-2 h-2 mx-1 rounded-full transition ${i === page ? 'bg-[#23211A]' : 'bg-[#fff] opacity-60'}`}
                    onClick={() => setPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
