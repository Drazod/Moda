import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../../components/SideNav';
import CartModal from '../cart';
import axiosInstance from '../../configs/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  IoCartOutline,
  IoStorefrontOutline,
  IoTimeOutline,
  IoCashOutline,
  IoChevronForward
} from 'react-icons/io5';

const MyTradesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'buying', 'selling'
  const [statusFilter, setStatusFilter] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, [activeTab, statusFilter]);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (activeTab === 'buying') {
        params.role = 'buyer';
      } else if (activeTab === 'selling') {
        params.role = 'seller';
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await axiosInstance.get('/c2c/my-trades', { params });
      setTrades(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast.error('Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      INITIATED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Initiated' },
      PAYMENT_PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Payment Pending' },
      PAYMENT_CONFIRMED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Payment Confirmed' },
      SHIPPING: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipping' },
      DELIVERED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Delivered' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelled' },
      DISPUTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Disputed' }
    };

    return configs[status] || configs.INITIATED;
  };

  const getRoleIcon = (role) => {
    return role === 'buyer' ? (
      <IoCartOutline className="text-blue-500" size={20} />
    ) : (
      <IoStorefrontOutline className="text-green-500" size={20} />
    );
  };

  const getUserRole = (trade) => {
    return trade.buyerId === user?.id ? 'buyer' : 'seller';
  };

  const getActionRequired = (trade, userRole) => {
    const statusActions = {
      'INITIATED': userRole === 'buyer' ? 'Submit payment proof' : null,
      'PAYMENT_PENDING': userRole === 'seller' ? 'Confirm payment received' : null,
      'PAYMENT_CONFIRMED': userRole === 'seller' ? 'Mark as shipped' : null,
      'SHIPPING': userRole === 'buyer' ? 'Confirm delivery received' : null,
      'DELIVERED': userRole === 'buyer' ? 'Complete trade or open dispute' : null
    };
    return statusActions[trade.status] || null;
  };

  return (
    <div className="flex h-screen bg-[#F5F1E8]">
      <SideNav />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#E6DAC4] shadow-md z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-[#2D2D2D] mb-4">My Trades</h1>

            {/* Role Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { value: 'all', label: 'All Trades' },
                { value: 'buying', label: 'Buying' },
                { value: 'selling', label: 'Selling' }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.value
                      ? 'bg-[#2D2D2D] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                { value: 'all', label: 'All Status' },
                { value: 'INITIATED', label: 'Initiated' },
                { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
                { value: 'SHIPPING', label: 'Shipping' },
                { value: 'DELIVERED', label: 'Delivered' },
                { value: 'COMPLETED', label: 'Completed' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    statusFilter === status.value
                      ? 'bg-white text-[#2D2D2D] border-2 border-[#2D2D2D]'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trades List */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D]"></div>
            </div>
          ) : trades.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No trades found</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-6 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#3D3D3D] transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {trades.map((trade) => {
                const userRole = getUserRole(trade);
                const statusConfig = getStatusConfig(trade.status);

                return (
                  <div
                    key={trade.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/marketplace/trades/${trade.id}`)}
                  >
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(userRole)}
                          <span className="font-medium text-sm text-gray-600 capitalize">
                            {userRole === 'buyer' ? 'Buying from' : 'Selling to'}
                          </span>
                          <span className="font-semibold">
                            {userRole === 'buyer' ? trade.seller?.name : trade.buyer?.name}
                          </span>
                        </div>
                        <span className={`px-3 py-1 ${statusConfig.bg} ${statusConfig.text} rounded-full text-sm font-medium`}>
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Trade Content */}
                      <div className="flex gap-4">
                        {/* Listing Image */}
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={trade.listing?.images?.[0]?.imageUrl || '/placeholder.jpg'}
                            alt={trade.listing?.clothes?.name || trade.listing?.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Trade Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#2D2D2D] mb-1">
                            {trade.listing?.clothes?.name || trade.listing?.title || 'Item'}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <span className="flex items-center gap-1 font-bold text-[#2D2D2D]">
                              <IoCashOutline size={18} />
                              ₫{(trade.agreedPrice || trade.offeredPrice)?.toLocaleString()}
                            </span>
                            <span className="text-gray-500">
                              Trade #{String(trade.id).substring(0, 8)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <IoTimeOutline size={16} />
                            <span>
                              {new Date(trade.createdAt).toLocaleDateString()} at{' '}
                              {new Date(trade.createdAt).toLocaleTimeString()}
                            </span>
                          </div>

                          {/* Payment Method */}
                          {trade.paymentMethod && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">
                                Payment: <span className="font-medium">{trade.paymentMethod}</span>
                              </span>
                            </div>
                          )}

                          {/* Action Required */}
                          {(() => {
                            const action = getActionRequired(trade, userRole);
                            return action && (
                              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm font-medium text-yellow-800">
                                  ⚠️ {action}
                                </p>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center">
                          <IoChevronForward className="text-gray-400" size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </div>
  );
};

export default MyTradesPage;
