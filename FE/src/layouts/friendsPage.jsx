import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';
import CartModal from './cart';
import axiosInstance from '../configs/axiosInstance';
import toast from 'react-hot-toast';
import { 
  IoPersonAdd, 
  IoCheckmarkCircle, 
  IoCloseCircle, 
  IoSearch,
  IoChatbubbleOutline,
  IoPersonRemoveOutline,
  IoPaperPlaneOutline
} from 'react-icons/io5';

const FriendsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'search'
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  useEffect(() => {
    if (activeTab === 'friends') {
      fetchFriends();
    } else if (activeTab === 'requests') {
      fetchPendingRequests();
    }
  }, [activeTab]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/friendship/friends');
      setFriends(response.data.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/friendship/requests');
      setPendingRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axiosInstance.get('/friendship/search', {
        params: { query: searchQuery }
      });
      setSearchResults(response.data.users || []);
      console.log(searchResults);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axiosInstance.post('/friendship/request', { addresseeId: userId });
      toast.success('Friend request sent!');
      searchUsers(); // Refresh search results
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const acceptRequest = async (friendshipId) => {
    try {
      await axiosInstance.put(`/friendship/accept/${friendshipId}`);
      toast.success('Friend request accepted!');
      fetchPendingRequests();
      fetchFriends();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const rejectRequest = async (friendshipId) => {
    try {
      await axiosInstance.delete(`/friendship/reject/${friendshipId}`);
      toast.success('Friend request rejected');
      fetchPendingRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const removeFriend = async (friendshipId) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;

    try {
      await axiosInstance.delete(`/friendship/remove/${friendshipId}`);
      toast.success('Friend removed');
      fetchFriends();
    } catch (error) {
      toast.error('Failed to remove friend');
    }
  };

  const startChat = (friendId) => {
    navigate(`/chat?friendId=${friendId}`);
  };

  return (
    <div className="flex min-h-screen relative-container font-Jsans">
      {/* Side Navigation */}
      <SideNav onCartOpen={() => setCartOpen(true)} />

      {/* Main Content */}
      <div className="flex w-full ml-64 ">
        {/* Top Section with Search */}
        <div className='xl:w-3/4'>
        <div className="noise-overlay px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-normal">Friends</h1>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setActiveTab('search');
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                placeholder="Search friends..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 py-6">
          {/* Tabs */}
          <div className="flex gap-8 mb-6 ">
            <button
              onClick={() => setActiveTab('friends')}
              className={`pb-3 font-medium text-sm transition ${
                activeTab === 'friends'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              My Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 font-medium text-sm transition relative ${
                activeTab === 'requests'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Requests
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            {searchResults.length > 0 ? (
              <div className="grid gap-4 max-w-2xl">
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{user.name}</h3>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    {!user.friendshipStatus && (
                      <button
                        onClick={() => sendFriendRequest(user.id)}
                        className="px-4 py-1.5 bg-[#434237] text-white text-sm font-medium rounded-lg hover:bg-[#5a594f] transition"
                      >
                        Follow
                      </button>
                    )}
                    {user.friendshipStatus === 'pending' && (
                      <span className="text-xs text-gray-500 px-4 py-1.5 bg-gray-100 rounded-lg">Requested</span>
                    )}
                    {user.friendshipStatus === 'friends' && (
                      <button
                        onClick={() => startChat(user.id)}
                        className="px-4 py-1.5 bg-gray-200 text-black text-sm font-medium rounded-lg hover:bg-gray-300 transition"
                      >
                        Message
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : searchQuery && !searchLoading ? (
              <div className="text-center py-12 text-gray-500">
                No users found matching "{searchQuery}"
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Search for friends by name or email
              </div>
            )}
          </div>
        )}

        {/* Pending Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : pendingRequests.length > 0 ? (
              <div className="grid gap-4 max-w-2xl">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
                        {request.requester?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{request.requester?.name}</h3>
                        <p className="text-xs text-gray-500">{request.requester?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(request.id)}
                        className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(request.id)}
                        className="px-4 py-1.5 bg-gray-200 text-black text-sm font-medium rounded-lg hover:bg-gray-300 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No pending friend requests
              </div>
            )}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : friends.length > 0 ? (
              <div className="grid gap-4 max-w-2xl">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
                        {friend?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{friend?.name}</h3>
                        <p className="text-xs text-gray-500">{friend?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => startChat(friend.id)}
                        className="px-4 py-1.5 bg-gray-200 text-black text-sm font-medium rounded-lg hover:bg-gray-300 transition"
                        title="Send message"
                      >
                        Message
                      </button>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                        title="Remove friend"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>You don't have any friends yet</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="mt-4 px-6 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>
        )}
        </div>
        </div>

        {/* Suggested Users Section (Right Side) */}
        <div className="w-1/4 h-screen  p-6 overflow-y-auto hidden xl:block">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500">Suggested for you</h2>
              <button className="text-xs font-semibold text-black">See All</button>
            </div>
            
            {/* Suggested users would go here - using friends as placeholder */}
            <div className="space-y-4">
              {friends.slice(0, 5).map((friend) => (
                <div key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                      {friend?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs">{friend?.name}</h3>
                      <p className="text-xs text-gray-400">Suggested</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Popup Button (Bottom Right) */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition z-50"
        title="Messages"
      >
        <IoPaperPlaneOutline className="text-2xl" />
      </button>

      {/* Cart Modal */}
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default FriendsPage;
