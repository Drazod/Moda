import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../../components/SideNav';
import CartModal from '../cart';
import CreateListingModal from './CreateListingModal';
import axiosInstance from '../../configs/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  IoSearchOutline,
  IoAddCircle
} from 'react-icons/io5';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });
  const observerRef = useRef();
  const lastListingRef = useRef();

  useEffect(() => {
    fetchListings();
  }, [page, filters, activeTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (lastListingRef.current) {
      observer.observe(lastListingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let response;
      
      if (activeTab === 'my') {
        // My listings - no params needed, uses authenticated user ID
        response = await axiosInstance.get('/c2c/my-listings');
        setListings(response.data.data || response.data || []);
        setHasMore(false); // My listings returns all at once
      } else {
        // All listings - use search and filter params
        const params = {
          page,
          limit: 20,
          ...(filters.search && { search: filters.search }),
          ...(filters.condition && { condition: filters.condition }),
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice })
        };

        response = await axiosInstance.get('/c2c/listings', { params });
        
        const newListings = response.data.data || response.data || [];
        
        if (page === 1) {
          setListings(newListings);
        } else {
          setListings(prev => [...prev, ...newListings]);
        }
        
        setHasMore(newListings.length === 20);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setListings([]);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    setPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleViewListing = (listingId) => {
    navigate(`/marketplace/listing/${listingId}`);
  };

  return (
    <div className="flex h-screen bg-[#F5F1E8]">
      <SideNav />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#E6DAC4] shadow-md z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-[#2D2D2D] mb-4">Marketplace</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => handleTabChange('all')}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white text-[#2D2D2D] shadow-md'
                    : 'bg-[#D5C9B1] text-gray-600 hover:bg-[#C9BDA5]'
                }`}
              >
                All Listing
              </button>
              <button
                onClick={() => handleTabChange('my')}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${
                  activeTab === 'my'
                    ? 'bg-white text-[#2D2D2D] shadow-md'
                    : 'bg-[#D5C9B1] text-gray-600 hover:bg-[#C9BDA5]'
                }`}
              >
                My listing
              </button>
            </div>

            {/* Search Area */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder={activeTab === 'my' ? "Search your listings..." : "Search listings..."}
                    value={filters.search}
                    onChange={handleSearchChange}
                    disabled={activeTab === 'my'}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D2D2D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                >
                  <option value="">All Conditions</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                />

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low</option>
                  <option value="price_high">Price: High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {loading && page === 1 ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D]"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">
                {activeTab === 'my' ? "You don't have any listings yet" : "No listings found"}
              </p>
              <button
                onClick={() => navigate('/marketplace/create')}
                className="px-6 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#3D3D3D] transition-colors"
              >
                Create First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <div
                  key={listing.id}
                  ref={index === listings.length - 1 ? lastListingRef : null}
                  className="bg-[#E8DDD5] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => handleViewListing(listing.id)}
                >
                  {/* Seller Info Header */}
                  <div className="px-4 pt-3 pb-2 flex justify-between items-center">
                    <span className="text-sm text-[#6B5B95] font-medium">
                      {listing.seller?.name || 'Seller Name'}
                    </span>
                    <span className="text-sm text-[#6B5B95]">
                      Reputation {listing.seller?.c2cReputation?.length || 0}
                    </span>
                  </div>

                  {/* Image Section with Item Label and Name */}
                  <div className="px-4 pb-4">
                    <div className="mb-2">
                      {/* First Half of Name */}
                      <span className="text-[#6B5B95] text-4xl font-bold">
                        {(() => {
                          const name = listing.clothes?.name || 'Item Name';
                          const words = name.split(' ');
                          const halfIndex = Math.ceil(words.length / 2);
                          return words.slice(0, halfIndex).join(' ');
                        })()}
                      </span>
                    </div>
                    
                    {/* Image Container with Top-Right Notch */}
                    <div className="relative bg-white rounded-xl overflow-hidden">
                      <img
                        src={listing.images?.[0]?.imageUrl || listing.clothes?.mainImage || '/placeholder.jpg'}
                        alt={listing.clothes?.name || listing.title}
                        className="w-full h-64 object-cover"
                      />
                      
                      {/* Top-Right Notch with Second Half of Name */}
                      <div className="absolute top-0 right-0 w-3/5 h-1/5 bg-[#E8DDD5] flex items-center justify-center px-4" 
                           style={{ borderBottomLeftRadius: '20px' }}>
                        <span className="text-[#6B5B95] font-bold text-center leading-tight"
                              style={{ 
                                fontSize: 'clamp(1rem, 3vw, 2rem)',
                                wordBreak: 'break-word'
                              }}>
                          {(() => {
                            const name = listing.clothes?.name || 'Item Name';
                            const words = name.split(' ');
                            const halfIndex = Math.ceil(words.length / 2);
                            return words.slice(halfIndex).join(' ');
                          })()}
                        </span>
                      </div>
                      
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <div className="text-[#6B5B95]">Size: {listing.size?.label || 'N/A'}</div>
                        <div className="text-[#6B5B95]">Condition: {listing.condition}</div>
                      </div>
                      <div className="bg-[#6B5B95] text-white px-4 py-2 rounded-lg font-bold">
                        ₫{listing.price.toLocaleString()}
                      </div>
                    </div>

                    {listing.status !== 'ACTIVE' && (
                      <div className="mt-2">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {listing.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && page > 1 && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D2D2D]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Sell Item Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 bg-[#2D2D2D] text-white p-4 rounded-full shadow-lg hover:bg-[#3D3D3D] transition z-50"
        title="Sell Item"
      >
        <IoAddCircle className="text-3xl" />
      </button>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <CreateListingModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchListings();
          }}
        />
      )}

      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </div>
  );
};

export default MarketplacePage;
