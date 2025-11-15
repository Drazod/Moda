import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import axiosInstance from '../configs/axiosInstance';
import toast from 'react-hot-toast';
import { 
  IoPersonAdd, 
  IoCheckmarkCircle, 
  IoCloseCircle, 
  IoSearch,
  IoChatbubbleOutline,
  IoPersonRemoveOutline 
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#434237]">Friends</h1>
          <p className="text-gray-600 mt-2">Connect with friends and share your favorite products</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('friends')}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === 'friends'
                ? 'border-b-2 border-[#434237] text-[#434237]'
                : 'text-gray-500 hover:text-[#434237]'
            }`}
          >
            My Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 px-4 font-medium transition relative ${
              activeTab === 'requests'
                ? 'border-b-2 border-[#434237] text-[#434237]'
                : 'text-gray-500 hover:text-[#434237]'
            }`}
          >
            Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === 'search'
                ? 'border-b-2 border-[#434237] text-[#434237]'
                : 'text-gray-500 hover:text-[#434237]'
            }`}
          >
            Find Friends
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="flex gap-2 mb-6">
              <div className="flex-1 relative">
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#434237]"
                />
              </div>
              <button
                onClick={searchUsers}
                disabled={searchLoading}
                className="px-6 py-3 bg-[#727269] text-white rounded-lg hover:bg-[#353535] transition disabled:opacity-50"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((user) => (
                  <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#434237]">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    {!user.friendshipStatus && (
                      <button
                        onClick={() => sendFriendRequest(user.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#434237] text-white rounded-lg hover:bg-[#353535] transition"
                      >
                        <IoPersonAdd/>
                        Add Friend
                      </button>
                    )}
                    {user.friendshipStatus === 'pending' && (
                      <span className="text-sm text-gray-500">Request Sent</span>
                    )}
                    {user.friendshipStatus === 'friends' && (
                      <button
                        onClick={() => startChat(user.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <IoChatbubbleOutline />
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
              <div className="grid gap-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                        {request.requester?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#434237]">{request.requester?.name}</h3>
                        <p className="text-sm text-gray-500">{request.requester?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(request.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        <IoCheckmarkCircle />
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(request.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <IoCloseCircle />
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
              <div className="grid md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                    <div key={friend.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                          {friend?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#434237]">{friend?.name}</h3>
                          <p className="text-sm text-gray-500">{friend?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => startChat(friend.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          title="Send message"
                        >
                          <IoChatbubbleOutline />
                        </button>
                        <button
                          onClick={() => removeFriend(friend.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          title="Remove friend"
                        >
                          <IoPersonRemoveOutline />
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
                  className="mt-4 px-6 py-2 bg-[#434237] text-white rounded-lg hover:bg-[#353535] transition"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FriendsPage;
