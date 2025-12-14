import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../../components/SideNav';
import CartModal from '../cart';
import axiosInstance from '../../configs/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  IoHeartOutline,
  IoHeart,
  IoShareSocialOutline,
  IoFlagOutline,
  IoChatbubbleOutline,
  IoStarOutline,
  IoStar
} from 'react-icons/io5';

const ListingDetailPage = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchListingDetail();
  }, [listingId]);

  const fetchListingDetail = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/c2c/listings/${listingId}`);
      setListing(response.data.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing details');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeListing = async () => {
    try {
      await axiosInstance.post(`/c2c/listings/${listingId}/like`);
      setListing(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
      }));
    } catch (error) {
      console.error('Error liking listing:', error);
      toast.error('Failed to like listing');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to buy');
      navigate('/login');
      return;
    }

    if (listing.sellerId === user.id) {
      toast.error('You cannot buy your own listing');
      return;
    }

    // Prompt for delivery address
    const deliveryAddress = prompt('Please enter your delivery address:');
    if (!deliveryAddress || !deliveryAddress.trim()) {
      toast.error('Delivery address is required');
      return;
    }

    try {
      const response = await axiosInstance.post('/c2c/trades', {
        listingId: listing.id,
        paymentMethod: 'CASH_ON_DELIVERY',
        deliveryMethod: 'SHIP',
        deliveryAddress: deliveryAddress.trim(),
        buyerNotes: 'Cash on Delivery - Please contact before shipping'
      });
      
      toast.success('Trade initiated successfully! Pay cash when you receive the item.');
      // Handle both response.data.data and response.data patterns
      const tradeId = response.data?.data?.id || response.data?.id;
      navigate(`/marketplace/trades/${tradeId}`);
    } catch (error) {
      console.error('Error initiating trade:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate trade');
    }
  };

  const handleMakeOffer = () => {
    // TODO: Open offer modal
    toast.info('Make offer feature coming soon!');
  };

  const handleContactSeller = () => {
    if (!user) {
      toast.error('Please login to contact seller');
      navigate('/login');
      return;
    }
    navigate(`/chat?userId=${listing.sellerId}`);
  };

  const handleReportListing = () => {
    // TODO: Open report modal
    toast.info('Report feature coming soon!');
  };

  const handleShareListing = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen text-[#353535]">
        <SideNav />
        <div className="flex-1 ml-20 flex items-center justify-center">
          <span className="text-xl">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen text-[#353535]">
      <SideNav />
      
      <div className="flex-1 ml-20 overflow-y-auto relative-container noise-overlay">
        <div className="pt-20 text-gray-800 font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 px-12 mx-auto">
          {/* LEFT – Images (2 columns) */}
          <div className="lg:col-span-2">
            {/* Back to Marketplace */}
            <button
              onClick={() => navigate('/marketplace')}
              className="text-[#353535] hover:text-black text-sm mb-4 font-Jsans flex items-center gap-1 hover:underline"
            >
              ← Back to Marketplace
            </button>

            <div className="relative w-full flex items-center justify-center">
              <img
                src={listing?.images?.[currentImageIndex]?.imageUrl || '/placeholder.jpg'}
                alt={listing?.clothes?.name}
                className="w-auto max-h-[70vh] object-contain"
              />

              {/* Chevron buttons */}
              {listing?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                               h-10 w-10 flex items-center justify-center rounded-full
                               text-[#353535] hover:text-black transition"
                  >
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <button
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                               h-10 w-10 flex items-center justify-center rounded-full
                               text-[#353535] hover:text-black transition"
                  >
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {listing?.images?.length > 1 && (
              <div className="flex ml-16 space-x-4 mt-4">
                {listing.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image.imageUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-[150px] w-auto cursor-pointer border border-gray-300 hover:border-black"
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT – Details */}
          <div className="font-Jsans text-[#353535]">
            <h1 className="text-4xl text-black font-bold">{listing?.clothes?.name}</h1>
            <p className="text-4xl text-black mt-4">₫{listing?.price?.toLocaleString() || '0'}</p>

            {/* Condition & Category Tags */}
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-[#F5F5F5] text-[#353535] rounded text-sm font-medium border border-gray-300">
                {listing?.condition}
              </span>
              {listing?.clothes?.category && (
                <span className="px-3 py-1 bg-[#F5F5F5] text-[#434237] rounded text-sm font-medium border border-gray-300">
                  {typeof listing.clothes.category === 'object' ? listing.clothes.category.name : listing.clothes.category}
                </span>
              )}
              {listing?.size && (
                <span className="px-3 py-1 bg-[#F5F5F5] text-[#434237] rounded text-sm font-medium border border-gray-300">
                  Size: {listing.size.label}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-Jsans font-semibold text-lg text-black mb-2">Description</h3>
              <p className="font-Jsans font-light text-base text-[#353535] leading-relaxed whitespace-pre-wrap">
                {listing?.description}
              </p>
            </div>

            {/* Posted Info */}
            <div className="mt-4 text-sm text-gray-500 font-light">
              Posted {new Date(listing?.createdAt).toLocaleDateString()} • {listing?.viewCount || 0} views • {listing?.likeCount || 0} likes
            </div>

            {/* Action Buttons */}
            {listing?.status === 'ACTIVE' && listing?.sellerId !== user?.id && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-6 rounded-lg transition text-white bg-[#434237] hover:bg-[#353535] font-medium"
                >
                  Buy Now (COD)
                </button>
                <button
                  onClick={handleMakeOffer}
                  className="w-full py-3 px-6 rounded-lg transition text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium"
                >
                  Make Offer
                </button>
              </div>
            )}

            {/* Secondary Actions */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={handleContactSeller}
                className="flex-1 px-4 py-2 bg-[#efe5d6] rounded-lg hover:bg-[#e5dbc9] transition-colors flex items-center justify-center gap-2 text-[#353535]"
              >
                <IoChatbubbleOutline size={20} />
                <span className="font-medium">Contact Seller</span>
              </button>
              <button
                onClick={handleLikeListing}
                className="px-4 py-2 bg-[#efe5d6] rounded-lg hover:bg-[#e5dbc9] transition-colors text-red-500"
              >
                {listing?.isLiked ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
              </button>
              <button
                onClick={handleShareListing}
                className="px-4 py-2 bg-[#efe5d6] rounded-lg hover:bg-[#e5dbc9] transition-colors text-[#353535]"
              >
                <IoShareSocialOutline size={20} />
              </button>
              <button
                onClick={handleReportListing}
                className="px-4 py-2 bg-[#efe5d6] rounded-lg hover:bg-[#e5dbc9] transition-colors text-[#353535]"
              >
                <IoFlagOutline size={20} />
              </button>
            </div>

            {/* Seller Information */}
            {listing?.seller && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h3 className="font-Jsans font-semibold text-lg text-black mb-4">Seller Information</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-[#efe5d6] flex items-center justify-center text-2xl font-bold text-[#434237]">
                    {listing.seller.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#353535]">{listing.seller.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(listing.seller.c2cReputation?.length || 0)
                              ? "text-[#434237]"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 font-light">Reputation</p>
                    <p className="font-medium text-[#434237]">{listing.seller.c2cReputation?.length || 0} Reviews</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-light">Member Since</p>
                    <p className="font-medium text-[#434237]">{new Date(listing.seller.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </div>
  );
};

export default ListingDetailPage;
