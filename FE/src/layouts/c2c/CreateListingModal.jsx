import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../configs/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  IoImageOutline,
  IoCloseCircle,
  IoClose,
  IoCloudUploadOutline,
  IoSearchOutline,
  IoShirtOutline
} from 'react-icons/io5';
import { HiSparkles } from 'react-icons/hi2';

const CreateListingModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  // Inventory
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);

  const [formData, setFormData] = useState({
    clothesId: null,
    sizeId: null,
    description: '',
    price: '',
    condition: 'LIKE_NEW'
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // Fetch user inventory
  useEffect(() => {
    const fetchInventory = async () => {
      setLoadingInventory(true);
      try {
        const response = await axiosInstance.get('/inventory/');
        const inventoryData = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setInventory(inventoryData);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error('Failed to load inventory');
      } finally {
        setLoadingInventory(false);
      }
    };

    fetchInventory();
  }, []);

  // Select an inventory item
  const handleSelectInventoryItem = (item) => {
    setSelectedInventoryItem(item);
    setSelectedClothing(item.clothes);
    setFormData(prev => ({ 
      ...prev, 
      clothesId: item.clothesId,
      sizeId: item.sizeId
    }));
    // Set the available size based on the inventory item
    if (item.size) {
      setAvailableSizes([item.size]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + uploadedImages.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clothesId) {
      toast.error('Please select a clothing item from the store');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setUploading(true);

    try {
      if (imageFiles.length === 0) {
        toast.error('Please upload at least one image');
        setUploading(false);
        return;
      }
      if (imageFiles.length > 5) {
        toast.error('Maximum 5 images allowed');
        setUploading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('clothesId', formData.clothesId);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      
      if (formData.sizeId) {
        formDataToSend.append('sizeId', formData.sizeId);
      }
      
      imageFiles.forEach(img => formDataToSend.append('images', img));

      const response = await axiosInstance.post('/c2c/listings', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Listing created successfully!');
      onSuccess();
      navigate(`/marketplace/listing/${response.data.data.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-[#2D2D2D]">Create New Listing</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4">
          <p className="text-gray-600 mb-6">
            List a clothing item from your inventory for resale. Select the item, set your price, and describe the condition.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Inventory Item */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Select from Your Inventory *</h3>
              
              {!selectedClothing ? (
                <>
                  {loadingInventory ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D2D2D]"></div>
                    </div>
                  ) : inventory.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                      <div className="grid grid-cols-6 gap-4">
                        {inventory.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectInventoryItem(item)}
                            className="flex flex-col items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-[#2D2D2D] hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-full aspect-square overflow-hidden rounded-md">
                              <img
                                src={item.clothes?.mainImg?.url || ''}
                                alt={item.clothes?.name || 'Item'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-center text-gray-700 font-medium line-clamp-2">
                              {item.clothes?.name}
                            </p>
                            {item.size && (
                              <span className="text-xs text-gray-500">
                                Size: {item.size.label}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <IoShirtOutline size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No items in your inventory</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-4 p-4 border border-green-500 bg-green-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#2D2D2D]">{selectedClothing.name}</h4>
                    <p className="text-sm text-gray-600">
                      Store Price: ₫{selectedClothing.price?.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInventoryItem(null);
                      setSelectedClothing(null);
                      setAvailableSizes([]);
                      setFormData(prev => ({ ...prev, clothesId: null, sizeId: null }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IoCloseCircle size={32} />
                  </button>
                </div>
              )}
            </div>

            {/* Size Selection */}
            {selectedClothing && availableSizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Size (Optional)</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, sizeId: null }))}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                      !formData.sizeId
                        ? 'border-[#2D2D2D] bg-[#2D2D2D] text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Any Size
                  </button>
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, sizeId: size.id }))}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        formData.sizeId === size.id
                          ? 'border-[#2D2D2D] bg-[#2D2D2D] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Images Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Photos *</h3>
              
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full"
                    >
                      <IoCloseCircle size={24} />
                    </button>
                  </div>
                ))}

                {uploadedImages.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2D2D2D] transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <IoImageOutline size={28} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Add</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              <p className="text-xs text-gray-500 mt-2">
                {uploadedImages.length}/10 photos • First photo will be the cover image
              </p>
            </div>

            {/* Condition & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                >
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Price (₫) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the item's condition..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]"
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000</p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#3D3D3D] transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <IoCloudUploadOutline size={20} />
                    <span>Create Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingModal;
