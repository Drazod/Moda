import React, { useEffect, useState } from "react";
import Sidebar from "../components/user/sidebar";
import axiosInstance from '../configs/axiosInstance';
import { FiExternalLink, FiRefreshCw, FiChevronDown, FiChevronRight, FiMessageSquare } from "react-icons/fi";
import RefundModal from "../components/user/refundModal";
import CommentModal from "../components/user/commentModal";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [page, setPage] = useState(0);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refundHistory, setRefundHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'refunds'
  const pageSize = 9;
  const pageCount = Math.ceil(groupedTransactions.length / pageSize);
  const pagedTransactions = groupedTransactions.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetch detailed transactions with individual items
        const res = await axiosInstance.get('/user/transactions');
        if (Array.isArray(res.data?.transactions)) {
          // Group transactions as orders with their items
          const orders = res.data.transactions.map(transaction => ({
            orderId: transaction.orderId,
            date: transaction.date,
            time: transaction.time,
            totalPrice: transaction.price,
            canRefundAny: transaction.canRefundAny,
            items: transaction.items.map(item => ({
              ...item,
              transactionId: transaction.orderId,
              orderId: transaction.orderId,
              date: transaction.date,
              time: transaction.time,
              id: item.transactionDetailId
            }))
          }));
          setTransactions(orders);
          setGroupedTransactions(orders);
        }
      } catch (error) {
        console.error("Failed to fetch transaction details:", error);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchRefundHistory = async () => {
      if (activeTab === 'refunds') {
        try {
          const res = await axiosInstance.get('/refund/history');
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

  const handleCommentRequest = (transaction) => {
    setSelectedTransaction(transaction);
    setShowCommentModal(true);
  };

  const handleCommentSubmit = async (commentData) => {
    try {
      // Use the correct transaction detail ID field

      const response = await axiosInstance.post('/comments/submit', commentData);
      
      // Backend returns success with message, not success field
      if (response.status === 201 && response.data.message) {
        console.log('Comment submitted successfully:', response.data);
        alert('Review submitted successfully!');
      } else {
        console.error('Comment submission failed:', response.data.message);
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Handle specific error responses
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while submitting your review. Please try again.');
      }
    } finally {
      setShowCommentModal(false);
      setSelectedTransaction(null);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const onRefundSubmit = async (refundData) => {
    try {
      await axiosInstance.post('/refund/request', refundData);
      setShowRefundModal(false);
      setSelectedTransaction(null);
      // Refresh transactions to show updated refund quantities
      const res = await axiosInstance.get('/user/transactions');
      if (Array.isArray(res.data?.transactions)) {
        const orders = res.data.transactions.map(transaction => ({
          orderId: transaction.orderId,
          date: transaction.date,
          time: transaction.time,
          totalPrice: transaction.price,
          canRefundAny: transaction.canRefundAny,
          items: transaction.items.map(item => ({
            ...item,
            transactionId: transaction.orderId,
            orderId: transaction.orderId,
            date: transaction.date,
            time: transaction.time,
            id: item.transactionDetailId
          }))
        }));
        setTransactions(orders);
        setGroupedTransactions(orders);
      }
      // Switch to refunds tab to show the new request
      setActiveTab('refunds');
    } catch (error) {
      console.error("Failed to submit refund request:", error);
      throw error; // Re-throw to let RefundModal handle the error display
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
              <div className="rounded-t-2xl bg-[#23211A] flex items-center " style={{height:'48px'}}>
                <div className="w-[50px] text-white font-semibold text-lg"></div>
                <div className="w-[100px] text-white font-semibold text-lg">Order</div>
                <div className="flex-1 text-white font-semibold text-lg">Items Summary</div>
                <div className="w-[120px] text-white font-semibold text-lg">Total Price</div>
                <div className="w-[100px] text-white font-semibold text-lg">Status</div>
                <div className="w-[100px] text-white font-semibold text-lg">Date</div>
              </div>
          <div className="">
            {pagedTransactions.map((order, idx) => {
              const isExpanded = expandedOrders.has(order.orderId);
              const itemCount = order.items.length;
              const itemsSummary = order.items.map(item => item.clothesName).join(', ');
              const truncatedSummary = itemsSummary.length > 50 ? itemsSummary.substring(0, 50) + '...' : itemsSummary;
              
              return (
                <div key={order.orderId || idx} className="border-b border-[#e6dac4]">
                  {/* Order Summary Row */}
                  <div className="flex items-center py-3 hover:bg-[#f5f1e8] transition">
                    <div className="w-[50px] flex justify-center">
                      <button
                        onClick={() => toggleOrderExpansion(order.orderId)}
                        className="text-[#434237] hover:text-[#2f2e25] transition-colors"
                        title={isExpanded ? 'Collapse items' : 'Expand items'}
                      >
                        {isExpanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                      </button>
                    </div>
                    <div className="w-[100px] font-semibold text-base text-[#434237]">
                      {order.orderId}
                    </div>
                    <div className="flex-1 text-base text-[#434237]">
                      <div className="font-medium">{truncatedSummary}</div>
                      <div className="text-xs text-gray-600">{itemCount} item{itemCount > 1 ? 's' : ''}</div>
                    </div>
                    <div className="w-[120px] font-bold text-base text-[#434237]">
                      {order.totalPrice}
                    </div>
                    <div className="w-[100px] text-base">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.items.every(item => item.state === 'COMPLETE') ? 'bg-green-100 text-green-800' :
                        order.items.some(item => item.state === 'SHIPPING') ? 'bg-blue-100 text-blue-800' :
                        order.items.some(item => item.state === 'ORDERED') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.items.every(item => item.state === 'COMPLETE') ? 'COMPLETE' :
                         order.items.some(item => item.state === 'SHIPPING') ? 'SHIPPING' :
                         order.items.some(item => item.state === 'ORDERED') ? 'ORDERED' : 'PENDING'}
                      </span>
                    </div>
                    <div className="w-[100px] text-base text-[#434237]">
                      <div className="text-sm">{order.date}</div>
                      <div className="text-xs text-gray-600">{order.time}</div>
                    </div>
                  </div>

                  {/* Expanded Items */}
                  {isExpanded && (
                    <div className="bg-[#f9f7f1] px-6 py-2">
                      <div className="text-xs font-semibold text-[#434237] mb-2 flex">
                        <div className="w-[50px]"></div>
                        <div className="w-[100px]">Item</div>
                        <div className="flex-1">Details</div>
                        <div className="w-[80px]">Qty</div>
                        <div className="w-[80px]">Refunded</div>
                        <div className="w-[120px]">Unit Price</div>
                        <div className="w-[100px]">Actions</div>
                      </div>
                      {order.items.map((item, itemIdx) => {
                        const quantity = item.originalQuantity || item.quantity || 0;
                        const availableForRefund = item.availableForRefund || (quantity - (item.refundedQuantity || 0));
                        const canRefund = item.canRefund || (availableForRefund > 0 && item.state === 'COMPLETE');
                        
                        return (
                          <div key={item.id || itemIdx} className="flex items-center py-2 text-sm">
                            <div className="w-[50px]"></div>
                            <div className="w-[100px] text-[#434237]">#{itemIdx + 1}</div>
                            <div className="flex-1 text-[#434237]">
                              <div className="font-medium">{item.clothesName || item.itemName || item.clothes?.name}</div>
                              {item.size && <div className="text-xs text-gray-600">Size: {item.size}</div>}
                              {item.color && <div className="text-xs text-gray-600">Color: {item.color}</div>}
                            </div>
                            <div className="w-[80px] text-[#434237]">
                              {quantity}
                            </div>
                            <div className="w-[80px] text-[#434237]">
                              {item.refundedQuantity || 0}
                            </div>
                            <div className="w-[120px] font-bold text-[#434237]">
                              {item.unitPrice || (item.price ? `${item.price.toLocaleString('vi-VN')} VND` : 'N/A')}
                            </div>
                            <div className="w-[130px] flex gap-2">
                              <button 
                                onClick={() => handleRefundRequest(item)}
                                disabled={!canRefund}
                                className={`${canRefund ? 'hover:text-[#434237] text-blue-600' : 'text-gray-400 cursor-not-allowed'}`}
                                title={canRefund ? `Refund up to ${availableForRefund} items` : 'Cannot refund this item'}
                              >
                                <FiRefreshCw size={16} />
                              </button>
                              {item.state === 'COMPLETE' && (
                                <button 
                                  onClick={() => handleCommentRequest(item)}
                                  className="hover:text-[#434237] text-green-600"
                                  title="Leave a review"
                                >
                                  <FiMessageSquare size={16} />
                                </button>
                              )}
                              <button className="hover:text-[#434237] text-gray-600" title="View Details">
                                <FiExternalLink size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {transactions.length === 0 && (
              <div className="py-8 text-center text-gray-500">No transactions found.</div>
            )}
            {/* Pagination dots (dynamic) */}
            {pageCount > 1 && (
              <div className="flex justify-center py-3">
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

        {/* Comment Modal */}
        {showCommentModal && (
          <CommentModal
            transaction={selectedTransaction}
            onClose={() => {
              setShowCommentModal(false);
              setSelectedTransaction(null);
            }}
            onSubmit={handleCommentSubmit}
          />
        )}
      </div>
    </div>
  );
}
