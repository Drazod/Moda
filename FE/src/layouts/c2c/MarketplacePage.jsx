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
  IoAddCircle,
  IoFilterOutline,
  IoPricetagOutline,
  IoArrowUpOutline
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
  const [taskbarExpanded, setTaskbarExpanded] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef(null);  // Reference for the input field

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
        response = await axiosInstance.get('/c2c/my-listings');
        setListings(response.data.data || response.data || []);
        setHasMore(false); // My listings returns all at once
      } else {
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
    <div className="flex h-screen bg-[#F5F1E8] font-Jsans">
      <SideNav />
      
      <div className="flex-1 overflow-y-auto">
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
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-[#BFAF92] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => handleViewListing(listing.id)}
                >
                  {/* Listing Content */}
                  <div className="px-4 pt-3 pb-2 flex justify-between items-center">
                    <span className="text-sm text-[#434237] font-medium">
                      {listing.seller?.name || 'Seller Name'}
                    </span>
                    <span className="text-sm text-[#434237]">
                      Reputation {listing.seller?.c2cReputation?.length || 0}
                    </span>
                  </div>
                  <div className="px-4 pb-4">
                    <span className="text-[#434237] text-4xl font-bold">
                      {listing.clothes?.name || 'Item Name'}
                    </span>
                    <div className="relative bg-[#BFAF92] rounded-xl overflow-hidden">
                      <img
                        src={listing.images?.[0]?.imageUrl || '/placeholder.jpg'}
                        alt={listing.clothes?.name || 'Item Name'}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <div className="text-[#434237]">Size: {listing.size?.label || 'N/A'}</div>
                        <div className="text-[#434237]">Condition: {listing.condition}</div>
                      </div>
                      <div className="bg-[#434237] text-white px-4 py-2 rounded-lg font-bold">
                        ₫{listing.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Floating Taskbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        {/* Filter Panel */}
        {showFilters && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 mb-2 w-80">
            <div className="space-y-4">
              {/* Tab Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTabChange('all')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'bg-[#2D2D2D] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Listings
                  </button>
                  <button
                    onClick={() => handleTabChange('my')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'my'
                        ? 'bg-[#2D2D2D] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    My Listings
                  </button>
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                >
                  <option value="">All Conditions</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    condition: '',
                    minPrice: '',
                    maxPrice: '',
                    sortBy: 'newest'
                  });
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Taskbar Buttons */}
        <div className={`bg-[#2D2D2D] text-white rounded-full shadow-lg flex items-center transition-all duration-300 ease-in-out ${
          searchExpanded ? 'pl-4 pr-3 py-2' : 'p-3'
        }`}>
          {/* Search Input - Expands from search icon position */}
          {searchExpanded ? (
            <input
              ref={inputRef}
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search listings..."
              className="w-64 px-4 py-2 rounded-full bg-white text-gray-900 border-none outline-none transition-all duration-300"
              autoFocus
              onBlur={() => {
                if (!filters.search) {
                  setSearchExpanded(false);
                }
              }}
            />
          ) : null}

          {/* Buttons */}
          <div className="flex items-center space-x-1">
            {/* Add Listing Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 hover:bg-[#3D3D3D] rounded-full transition-colors"
              title="Sell Item"
            >
              <IoAddCircle className="text-2xl" />
            </button>

            {/* Search Toggle Button - Only show when not expanded */}
            {!searchExpanded && (
              <button
                onClick={() => {
                  setSearchExpanded(true);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
                className="p-2 hover:bg-[#3D3D3D] rounded-full transition-colors"
                title="Search"
              >
                <IoSearchOutline className="text-2xl" />
              </button>
            )}

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors ${
                showFilters ? 'bg-[#3D3D3D]' : 'hover:bg-[#3D3D3D]'
              }`}
              title="Filters"
            >
              <IoFilterOutline className="text-2xl" />
            </button>
          </div>
        </div>
      </div>


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
    </div>
  );
};

export default MarketplacePage;
