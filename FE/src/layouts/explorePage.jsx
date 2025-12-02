import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';
import CartModal from './cart';
import axiosInstance from '../configs/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  IoHeartOutline,
  IoHeart,
  IoChatbubbleOutline,
  IoBookmarkOutline,
  IoBookmark,
  IoPaperPlaneOutline,
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoAddCircle,
  IoImageOutline,
  IoLocationOutline,
  IoCloudUploadOutline
} from 'react-icons/io5';

const ExplorePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    caption: '',
    location: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const observerRef = useRef();
  const lastPostRef = useRef();

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    // Intersection Observer for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/posts/feed', {
        params: { page, limit: 20 }
      });
      
      const newPosts = response.data.posts || [];
      
      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 20);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}/comments`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handlePostClick = (post) => {
    // Normalize post data to have imageUrls array
    const normalizedPost = {
      ...post,
      imageUrls: post.images?.map(img => img.imageUrl) || post.imageUrls || [],
      likesCount: post._count?.likes ?? post.likesCount ?? 0,
      commentsCount: post._count?.comments ?? post.commentsCount ?? 0
    };
    setSelectedPost(normalizedPost);
    setCurrentImageIndex(0);
    fetchComments(post.id);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setCurrentImageIndex(0);
    setComments([]);
    setComment('');
  };

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    try {
      const post = posts.find(p => p.id === postId);
      const isLiked = post?.isLiked;

      if (isLiked) {
        await axiosInstance.delete(`/posts/${postId}/like`);
      } else {
        await axiosInstance.post(`/posts/${postId}/like`);
      }

      // Update local state
      setPosts(prev =>
        prev.map(p => {
          if (p.id === postId) {
            const currentLikes = p._count?.likes ?? p.likesCount ?? 0;
            return {
              ...p,
              isLiked: !isLiked,
              likesCount: isLiked ? currentLikes - 1 : currentLikes + 1,
              _count: p._count ? { ...p._count, likes: isLiked ? currentLikes - 1 : currentLikes + 1 } : undefined
            };
          }
          return p;
        })
      );

      if (selectedPost?.id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          isLiked: !isLiked,
          likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1
        }));
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !selectedPost) return;

    try {
      const response = await axiosInstance.post(`/posts/${selectedPost.id}/comments`, {
        content: comment.trim()
      });

      const newComment = response.data.comment || response.data;
      setComments(prev => [...prev, newComment]);
      setComment('');
      
      // Update comment count
      setPosts(prev =>
        prev.map(p => {
          if (p.id === selectedPost.id) {
            const currentComments = p._count?.comments ?? p.commentsCount ?? 0;
            return {
              ...p,
              commentsCount: currentComments + 1,
              _count: p._count ? { ...p._count, comments: currentComments + 1 } : undefined
            };
          }
          return p;
        })
      );
      
      setSelectedPost(prev => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1
      }));
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex < selectedPost.imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (uploadedImages.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newPreviews]);
    setImageFiles(prev => [...prev, ...files]);
    
    toast.success(`${files.length} image${files.length > 1 ? 's' : ''} added!`);
  };

  const removeImage = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(uploadedImages[index]);
    
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setUploading(true);
    try {
      // Create FormData and append all fields
      const formData = new FormData();
      formData.append('caption', newPost.caption);
      if (newPost.location) {
        formData.append('location', newPost.location);
      }
      
      // Append all image files
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axiosInstance.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const createdPost = response.data.post || response.data;
      
      // Add new post to the beginning of the list
      setPosts(prev => [createdPost, ...prev]);
      
      // Clean up object URLs
      uploadedImages.forEach(url => URL.revokeObjectURL(url));
      
      // Reset form
      setNewPost({ caption: '', location: '' });
      setUploadedImages([]);
      setImageFiles([]);
      setShowCreatePost(false);
      
      toast.success('Post created successfully! 🎉');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  const closeCreatePost = () => {
    // Clean up object URLs
    uploadedImages.forEach(url => URL.revokeObjectURL(url));
    
    setShowCreatePost(false);
    setNewPost({ caption: '', location: '' });
    setUploadedImages([]);
    setImageFiles([]);
  };

  return (
    <div className="flex h-screen relative-container">
      <SideNav onCartOpen={() => setCartOpen(true)} />

      <div className="flex-1 ml-20 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-6">Explore</h1>

          {/* Grid Layout */}
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post, index) => {
              const isLastPost = index === posts.length - 1;
              
              return (
                <div
                  key={post.id}
                  ref={isLastPost ? lastPostRef : null}
                  onClick={() => handlePostClick(post)}
                  className="relative aspect-square bg-gray-200 cursor-pointer group overflow-hidden"
                >
                  <img
                    src={post.images?.[0]?.imageUrl || post.imageUrls?.[0]}
                    alt={post.caption || 'Post'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <IoHeart className="text-2xl" />
                      <span>{post._count?.likes ?? post.likesCount ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <IoChatbubbleOutline className="text-2xl" />
                      <span>{post._count?.comments ?? post.commentsCount ?? 0}</span>
                    </div>
                  </div>

                  {/* Multiple images indicator */}
                  {(post.images?.length > 1 || post.imageUrls?.length > 1) && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📷</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#BFAF92]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#BFAF92] hover:bg-[#a89d7e] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
        title="Create Post"
      >
        <IoAddCircle className="text-4xl" />
      </button>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeCreatePost}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Create New Post</h2>
              <button onClick={closeCreatePost} className="p-2 hover:bg-gray-100 rounded-full">
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePost} className="flex flex-col max-h-[calc(90vh-60px)]">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Image Upload Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Images {uploadedImages.length > 0 && `(${uploadedImages.length}/10)`}
                  </label>
                  
                  {uploadedImages.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-[#BFAF92] hover:bg-gray-50 transition"
                    >
                      <IoCloudUploadOutline className="text-6xl text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium mb-1">Click to upload images</p>
                      <p className="text-sm text-gray-500">Maximum 10 images (JPG, PNG)</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative aspect-square group">
                            <img
                              src={img}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <IoClose className="text-white text-lg" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {uploadedImages.length < 10 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#BFAF92] hover:bg-gray-50 transition flex items-center justify-center gap-2"
                        >
                          <IoImageOutline className="text-xl" />
                          <span>Add More Images</span>
                        </button>
                      )}
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Caption */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Caption
                  </label>
                  <textarea
                    value={newPost.caption}
                    onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Write a caption..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFAF92] resize-none"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Location (Optional)
                  </label>
                  <div className="relative">
                    <IoLocationOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      value={newPost.location}
                      onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Add location"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFAF92]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50 flex gap-3">
                <button
                  type="button"
                  onClick={closeCreatePost}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || uploadedImages.length === 0}
                  className="flex-1 px-6 py-3 bg-[#BFAF92] hover:bg-[#a89d7e] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {uploading ? 'Posting...' : 'Share Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={closeModal}>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
          >
            <IoClose />
          </button>

          <div className="w-full max-w-6xl h-[90vh] flex bg-black" onClick={(e) => e.stopPropagation()}>
            {/* Left - Image */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
              <img
                src={selectedPost.imageUrls?.[currentImageIndex]}
                alt={selectedPost.caption || 'Post'}
                className="max-w-full max-h-full object-contain"
              />

              {/* Image Navigation */}
              {selectedPost.imageUrls?.length > 1 && (
                <>
                  {currentImageIndex > 0 && (
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                    >
                      <IoChevronBack className="text-xl" />
                    </button>
                  )}
                  {currentImageIndex < selectedPost.imageUrls.length - 1 && (
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                    >
                      <IoChevronForward className="text-xl" />
                    </button>
                  )}
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {selectedPost.imageUrls.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right - Details */}
            <div className="w-96 bg-white flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {selectedPost.user?.avatar?.url ? (
                    <img
                      src={selectedPost.user.avatar.url}
                      alt={selectedPost.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold">{selectedPost.user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{selectedPost.user?.name}</h3>
                  {selectedPost.location && (
                    <p className="text-xs text-gray-500">{selectedPost.location}</p>
                  )}
                </div>
              </div>

              {/* Caption & Comments */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Caption */}
                {selectedPost.caption && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      {selectedPost.user?.avatar?.url ? (
                        <img
                          src={selectedPost.user.avatar.url}
                          alt={selectedPost.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold">{selectedPost.user?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold mr-2">{selectedPost.user?.name}</span>
                        {selectedPost.caption}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(selectedPost.createdAt)}</p>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      {comment.user?.avatar?.url ? (
                        <img
                          src={comment.user.avatar.url}
                          alt={comment.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold">{comment.user?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold mr-2">{comment.user?.name}</span>
                        {comment.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(comment.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t">
                <div className="flex items-center justify-between p-3">
                  <div className="flex gap-4">
                    <button onClick={(e) => handleLike(selectedPost.id, e)}>
                      {selectedPost.isLiked ? (
                        <IoHeart className="text-2xl text-red-500" />
                      ) : (
                        <IoHeartOutline className="text-2xl" />
                      )}
                    </button>
                    <button>
                      <IoChatbubbleOutline className="text-2xl" />
                    </button>
                    <button>
                      <IoPaperPlaneOutline className="text-2xl" />
                    </button>
                  </div>
                  <button>
                    <IoBookmarkOutline className="text-2xl" />
                  </button>
                </div>

                <div className="px-3 pb-2">
                  <p className="font-semibold text-sm">{selectedPost.likesCount || 0} likes</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(selectedPost.createdAt)}</p>
                </div>

                {/* Comment Input */}
                <form onSubmit={handleComment} className="border-t p-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 outline-none text-sm"
                  />
                  {comment.trim() && (
                    <button type="submit" className="text-[#BFAF92] font-semibold text-sm">
                      Post
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ExplorePage;
