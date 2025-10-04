import React, { useEffect, useState } from "react";
import Sidebar from "../components/user/sidebar";
import axiosInstance from '../configs/axiosInstance';
import { FiExternalLink } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";
import RefundModal from "../components/user/refundModal";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refundHistory, setRefundHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'refunds'
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

  useEffect(() => {
    const fetchRefundHistory = async () => {
      if (activeTab === 'refunds') {
        try {
          const res = await axiosInstance.get('/user/refunds');
          if (Array.isArray(res.data?.refunds)) {
            setRefundHistory(res.data.refunds);
          }
        } catch (error) {
          console.error("Failed to fetch refund history:", error);
        }
      }
    };
    fetchRefundHistory();
  }, [activeTab]);

  const handleRefundRequest = (transaction) => {
    setSelectedTransaction(transaction);
    setShowRefundModal(true);
  };

  const onRefundSubmit = async (refundData) => {
    try {
      await axiosInstance.post('/user/refund-request', refundData);
      setShowRefundModal(false);
      setSelectedTransaction(null);
      // Refresh refund history
      setActiveTab('refunds');
    } catch (error) {
      console.error("Failed to submit refund request:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#e6dac4] font-Jsans">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Transaction History</h2>
          
          {/* Tab Navigation */}
          <div className="flex bg-[#BFAF92] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-[#434237] text-white' 
                  : 'text-[#434237] hover:bg-[#efe5d6]'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'refunds' 
                  ? 'bg-[#434237] text-white' 
                  : 'text-[#434237] hover:bg-[#efe5d6]'
              }`}
            >
              Refunds
            </button>
          </div>
        </div>
        <div className="bg-[#BFAF92] rounded-2xl shadow p-0 overflow-x-auto">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <>
              {/* Orders Header */}
              <div className="rounded-t-2xl bg-[#23211A] flex items-center px-6" style={{height:'48px'}}>
                <div className="w-[120px] text-white font-semibold text-lg">Order Id</div>
                <div className="flex-1 text-white font-semibold text-lg">Detail</div>
                <div className="w-[160px] text-white font-semibold text-lg">Date</div>
                <div className="w-[100px] text-white font-semibold text-lg">Time</div>
                <div className="w-[120px] text-white font-semibold text-lg">Price</div>
                <div className="w-[100px] text-white font-semibold text-lg">Action</div>
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
                <div className="w-[100px] text-right flex gap-2">
                  <button 
                    onClick={() => handleRefundRequest(tx)}
                    className="hover:text-[#434237] text-blue-600"
                    title="Request Refund"
                  >
                    <FiRefreshCw size={18} />
                  </button>
                  <button className="hover:text-[#434237]" title="View Details">
                    <FiExternalLink size={18} />
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
            </>
          )}

          {/* Refunds Tab */}
          {activeTab === 'refunds' && (
            <>
              {/* Refunds Header */}
              <div className="rounded-t-2xl bg-[#23211A] flex items-center px-6" style={{height:'48px'}}>
                <div className="w-[120px] text-white font-semibold text-lg">Refund ID</div>
                <div className="flex-1 text-white font-semibold text-lg">Item</div>
                <div className="w-[100px] text-white font-semibold text-lg">Quantity</div>
                <div className="w-[120px] text-white font-semibold text-lg">Amount</div>
                <div className="w-[100px] text-white font-semibold text-lg">Status</div>
                <div className="w-[160px] text-white font-semibold text-lg">Date</div>
              </div>
              <div className="px-6 pt-2 pb-4">
                {refundHistory.map((refund, idx) => (
                  <div key={refund.id || idx} className="flex items-center border-b border-[#e6dac4] py-3 hover:bg-[#efe5d6] transition">
                    <div className="w-[120px] font-semibold text-base text-[#fff]" style={{color:'#fff', fontWeight:600}}>#{refund.id}</div>
                    <div className="flex-1 text-base text-[#fff] opacity-80" style={{color:'#fff', opacity:0.8}}>{refund.item}</div>
                    <div className="w-[100px] text-base text-[#fff] opacity-80" style={{color:'#fff', opacity:0.8}}>{refund.quantity}</div>
                    <div className="w-[120px] text-base text-[#fff] opacity-80" style={{color:'#fff', opacity:0.8}}>
                      {refund.refundAmount?.toLocaleString('vi-VN')} VND
                    </div>
                    <div className="w-[100px] text-base">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        refund.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        refund.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        refund.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {refund.status}
                      </span>
                    </div>
                    <div className="w-[160px] text-base text-[#fff] opacity-80" style={{color:'#fff', opacity:0.8}}>
                      {new Date(refund.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {refundHistory.length === 0 && (
                  <div className="py-8 text-center text-gray-500">No refund requests found.</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Refund Modal */}
        {showRefundModal && (
          <RefundModal
            transaction={selectedTransaction}
            onClose={() => {
              setShowRefundModal(false);
              setSelectedTransaction(null);
            }}
            onSubmit={onRefundSubmit}
          />
        )}
      </div>
    </div>
  );
}
