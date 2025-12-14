import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../../components/SideNav';
import CartModal from '../cart';
import axiosInstance from '../../configs/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  IoChevronBack,
  IoCashOutline,
  IoLocationOutline,
  IoSendOutline,
  IoCheckmarkDone,
  IoTimeOutline,
  IoImageOutline,
  IoWarningOutline,
  IoShieldCheckmarkOutline,
  IoChatbubbleOutline
} from 'react-icons/io5';

// Trade status configurations
const STATUS_CONFIGS = {
  INITIATED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Initiated' },
  PAYMENT_PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Payment Pending' },
  PAYMENT_CONFIRMED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Payment Confirmed' },
  SHIPPING: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipping' },
  DELIVERED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Delivered' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelled' },
  DISPUTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Disputed' }
};

// Trade lifecycle progression
const STATUS_FLOW = ['INITIATED', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'SHIPPING', 'DELIVERED', 'COMPLETED'];

// Action prompts for each role and status
const ACTION_PROMPTS = {
  buyer: {
    INITIATED: 'Submit payment proof to proceed',
    PAYMENT_PENDING: 'Waiting for seller to confirm payment',
    PAYMENT_CONFIRMED: 'Waiting for seller to ship',
    SHIPPING: 'Confirm when you receive the item',
    DELIVERED: 'Complete the trade or open dispute'
  },
  seller: {
    INITIATED: 'Waiting for buyer to submit payment',
    PAYMENT_PENDING: 'Confirm payment received',
    PAYMENT_CONFIRMED: 'Mark as shipped when sent',
    SHIPPING: 'Waiting for buyer to confirm delivery',
    DELIVERED: 'Waiting for buyer to complete'
  }
};

const TradeDetailPage = () => {
  const navigate = useNavigate();
  const { tradeId } = useParams();
  const { user } = useAuth();
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTradeDetail();
    fetchMessages();
  }, [tradeId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTradeDetail = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/c2c/trades/${tradeId}`);
      // Handle both response.data and response.data.data patterns
      setTrade(response.data?.data || response.data);
    } catch (error) {
      console.error('Error fetching trade:', error);
      toast.error(error.response?.data?.message || 'Failed to load trade details');
      navigate('/marketplace/my-trades');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(`/c2c/trades/${tradeId}/messages`);
      const messagesData = response.data?.messages || response.data?.data || response.data;
      // Ensure we always set an array
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Don't show error toast for messages, just log it
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await axiosInstance.post(`/c2c/trades/${tradeId}/messages`, {
        content: newMessage
      });
      
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handlePaymentAction = async (file) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('paymentProof', file);
      }
      
      const response = await axiosInstance.post(`/c2c/trades/${tradeId}/submit-payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Payment proof submitted successfully');
      fetchTradeDetail();
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit payment proof');
    }
  };

  const handleConfirmPayment = async () => {
    try {
      await axiosInstance.post(`/c2c/trades/${tradeId}/confirm-payment`);
      toast.success('Payment confirmed');
      fetchTradeDetail();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Failed to confirm payment');
    }
  };

  const handleUpdateShipping = async (trackingNumber) => {
    try {
      await axiosInstance.post(`/c2c/trades/${tradeId}/ship`, { trackingNumber });
      toast.success('Item marked as shipped');
      fetchTradeDetail();
    } catch (error) {
      console.error('Error marking as shipped:', error);
      toast.error('Failed to mark as shipped');
    }
  };

  const handleConfirmDelivery = async () => {
    if (!confirm('Have you received the item in good condition?')) return;

    try {
      await axiosInstance.post(`/c2c/trades/${tradeId}/confirm-delivery`);
      toast.success('Delivery confirmed');
      fetchTradeDetail();
    } catch (error) {
      console.error('Error confirming delivery:', error);
      toast.error('Failed to confirm delivery');
    }
  };

  const handleCompleteTrade = async () => {
    try {
      await axiosInstance.post(`/c2c/trades/${tradeId}/complete`);
      toast.success('Trade completed successfully!');
      fetchTradeDetail();
    } catch (error) {
      console.error('Error completing trade:', error);
      toast.error('Failed to complete trade');
    }
  };

  const handleCancelTrade = async () => {
    const reason = prompt('Please provide a reason for cancelling this trade:');
    if (!reason || !reason.trim()) return;

    try {
      await axiosInstance.post(`/c2c/trades/${tradeId}/cancel`, { reason });
      toast.success('Trade cancelled');
      fetchTradeDetail();
    } catch (error) {
      console.error('Error cancelling trade:', error);
      toast.error('Failed to cancel trade');
    }
  };

  const handleDisputeTrade = async () => {
    const reason = prompt('Please provide a reason for the dispute:');
    if (!reason) return;

    try {
      await axiosInstance.post(`/c2c/trades/${tradeId}/dispute`, { reason });
      toast.success('Dispute filed successfully');
      fetchTradeDetail();
    } catch (error) {
      console.error('Error filing dispute:', error);
      toast.error('Failed to file dispute');
    }
  };

  const getUserRole = () => {
    return trade?.buyerId === user?.id ? 'buyer' : 'seller';
  };

  const getStatusConfig = (status) => {
    return STATUS_CONFIGS[status] || STATUS_CONFIGS.INITIATED;
  };

  const getStatusTimeline = () => {
    const currentIndex = STATUS_FLOW.indexOf(trade?.status);
    
    return (
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4">Trade Progress</h3>
        <div className="relative">
          {STATUS_FLOW.map((status, index) => {
            const config = getStatusConfig(status);
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={status} className="flex items-start mb-4 last:mb-0">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? config.bg + ' ' + config.text : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-opacity-30 ' + config.bg : ''}`}
                  >
                    {isCompleted && <IoCheckmarkDone size={16} />}
                    {!isCompleted && <div className="w-2 h-2 rounded-full bg-gray-400" />}
                  </div>
                  {index < STATUS_FLOW.length - 1 && (
                    <div
                      className={`w-0.5 h-8 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {config.label}
                  </p>
                  {isCurrent && ACTION_PROMPTS[userRole]?.[status] && (
                    <p className="text-xs text-gray-600 mt-1">
                      {ACTION_PROMPTS[userRole][status]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen text-[#353535]">
        <SideNav />
        <div className="flex-1 ml-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D]"></div>
        </div>
      </div>
    );
  }

  const userRole = getUserRole();
  const statusConfig = getStatusConfig(trade?.status);

  return (
    <div className="flex h-screen text-[#353535]">
      <SideNav />
      
      <div className="flex-1 ml-20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#E6DAC4] shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/marketplace/my-trades')}
              className="flex items-center gap-2 text-[#2D2D2D] hover:text-[#3D3D3D] transition-colors"
            >
              <IoChevronBack size={24} />
              <span>Back to My Trades</span>
            </button>
            <span className={`px-4 py-2 ${statusConfig.bg} ${statusConfig.text} rounded-full text-sm font-medium`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Trade Details */}
          <div className="w-96 border-r-[0.1px] border-[#BFAF92] bg-white overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Listing Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Item Details</h3>
                <div className="space-y-3">
                  <img
                    src={trade?.listing?.images?.[0]?.imageUrl || '/placeholder.jpg'}
                    alt={trade?.listing?.clothes?.name || trade?.listing?.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <h4 className="font-semibold text-[#2D2D2D]">
                    {trade?.listing?.clothes?.name || trade?.listing?.title || 'Item'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <IoCashOutline size={20} className="text-green-600" />
                    <span className="text-2xl font-bold text-[#2D2D2D]">
                      ₫{(trade?.agreedPrice || trade?.offeredPrice)?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="border-t pt-4">
                {getStatusTimeline()}
              </div>

              {/* Trade Participants */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Trade Participants</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Seller</p>
                    <p className="font-semibold">{trade?.seller?.name || trade?.sellerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Buyer</p>
                    <p className="font-semibold">{trade?.buyer?.name || trade?.buyerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">You are</p>
                    <p className="font-semibold capitalize">{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {trade?.paymentMethod && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3">Payment</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Method</p>
                      <p className="font-semibold">
                        {trade.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery (COD)' : trade.paymentMethod}
                      </p>
                    </div>
                    {trade.paymentProof && (
                      <div>
                        <p className="text-sm text-gray-600">Payment Proof</p>
                        <img 
                          src={trade.paymentProof} 
                          alt="Payment proof" 
                          className="w-32 h-32 object-cover rounded-lg mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              {trade?.deliveryMethod && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3">Delivery</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Method</p>
                      <p className="font-semibold">
                        {trade.deliveryMethod === 'SHIP' ? 'Shipping' : trade.deliveryMethod}
                      </p>
                    </div>
                    {trade.trackingNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-mono text-sm">{trade.trackingNumber}</p>
                      </div>
                    )}
                    {trade.deliveryAddress && (
                      <div>
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="text-sm">{trade.deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-4 space-y-2">
                {/* Buyer Actions */}
                {userRole === 'buyer' && trade?.status === 'INITIATED' && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Upload Payment Proof:</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (confirm('Submit this payment proof?')) {
                            handlePaymentAction(file);
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <p className="text-xs text-gray-500">Upload proof of payment (screenshot, receipt, etc.)</p>
                  </div>
                )}

                {userRole === 'buyer' && trade?.status === 'SHIPPING' && (
                  <button
                    onClick={handleConfirmDelivery}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <IoCheckmarkDone size={20} />
                    Confirm Delivery Received
                  </button>
                )}

                {userRole === 'buyer' && trade?.status === 'DELIVERED' && (
                  <div className="space-y-2">
                    {trade.autoCompleteAt && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                        <p className="text-sm text-yellow-800">
                          ⏰ Auto-complete in: {Math.max(0, Math.ceil((new Date(trade.autoCompleteAt) - new Date()) / (1000 * 60 * 60 * 24)))} days
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleCompleteTrade}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <IoCheckmarkDone size={20} />
                      Complete Trade
                    </button>
                  </div>
                )}

                {/* Seller Actions */}
                {userRole === 'seller' && trade?.status === 'PAYMENT_PENDING' && (
                  <button
                    onClick={handleConfirmPayment}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <IoCheckmarkDone size={20} />
                    Confirm Payment Received
                  </button>
                )}

                {userRole === 'seller' && trade?.status === 'PAYMENT_CONFIRMED' && (
                  <button
                    onClick={() => {
                      const tracking = prompt('Enter tracking number (optional):');
                      handleUpdateShipping(tracking || '');
                    }}
                    className="w-full px-4 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#3D3D3D] transition-colors"
                  >
                    Mark as Shipped
                  </button>
                )}

                {/* Common Actions */}
                {['INITIATED', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED'].includes(trade?.status) && (
                  <button
                    onClick={handleCancelTrade}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel Trade
                  </button>
                )}

                {['SHIPPING', 'DELIVERED'].includes(trade?.status) && (
                  <button
                    onClick={handleDisputeTrade}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <IoWarningOutline size={20} />
                    Open Dispute
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Chat */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b-[0.1px] border-[#BFAF92]">
              <h3 className="font-semibold text-lg">
                Chat with {userRole === 'buyer' ? (trade?.seller?.name || trade?.sellerName) : (trade?.buyer?.name || trade?.buyerName)}
              </h3>
              <p className="text-sm text-gray-500">
                Discuss trade details and arrange delivery
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <IoChatbubbleOutline size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-[#2D2D2D] text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <IoTimeOutline size={12} />
                          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t-[0.1px] border-[#BFAF92]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                  disabled={sending || trade?.status === 'COMPLETED' || trade?.status === 'CANCELLED'}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim() || trade?.status === 'COMPLETED' || trade?.status === 'CANCELLED'}
                  className="px-6 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#3D3D3D] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <IoSendOutline size={20} />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </div>
  );
};

export default TradeDetailPage;
