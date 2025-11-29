import React, { useState, useRef, useEffect } from 'react';
import { IoClose, IoCamera, IoCloudUpload, IoDownload, IoRefresh } from 'react-icons/io5';
import {HiSparkles} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import axiosInstance from '../configs/axiosInstance';

const VirtualTryOn = ({ product, onClose }) => {
  const [userImage, setUserImage] = useState(null);
  const [userImageBlob, setUserImageBlob] = useState(null); // Store blob for upload
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1280, 
          height: 720,
          facingMode: 'user' 
        } 
      });
      setStream(mediaStream);
      setUseCamera(true);
    } catch (error) {
      toast.error('Failed to access camera. Please check permissions.');
      console.error('Camera error:', error);
    }
  };

  // Update video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current && useCamera) {
      videoRef.current.srcObject = stream;
      // Ensure video plays
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [stream, useCamera]);

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      toast.error('Camera not ready');
      return;
    }
    
    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error('Please wait for camera to initialize');
      return;
    }
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Failed to capture photo');
        return;
      }
      
      const url = URL.createObjectURL(blob);
      setUserImage(url);
      setUserImageBlob(blob); // Store blob for API upload
      stopCamera();
      toast.success('Photo captured!');
    }, 'image/jpeg', 0.95);
  };

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Store both the file and the preview URL
      setUserImageBlob(file);
      handleImageUpload(file);
    }
  };

  // Process uploaded image
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUserImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Virtual try-on processing
  const processVirtualTryOn = async () => {
    if (!userImage || !product) {
      toast.error('Please upload your photo first');
      return;
    }

    if (!userImageBlob) {
      toast.error('Image data not available');
      return;
    }

    if (!product.mainImg?.url) {
      toast.error('Product image not available');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Send user image as file and product image as URL
      // Backend will fetch the product image to avoid CORS issues
      const formData = new FormData();
      formData.append('humanImage', userImageBlob, 'user-photo.jpg');
      formData.append('clothImageUrl', product.mainImg.url);
      
      console.log('🚀 Sending virtual try-on request...');
      console.log('User image size:', userImageBlob.size, 'bytes');
      console.log('Product image URL:', product.mainImg.url);
      
      // Call your backend API
      const response = await axiosInstance.post('/virtual-tryon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 300 seconds timeout for AI processing
      });
      
      console.log('✅ Response received:', response.data);
      
      // Get base64 image from response
      const { imageBase64 } = response.data;
      
      if (!imageBase64) {
        throw new Error('No result image received from server');
      }
      
      // Convert base64 to displayable image
      const resultImageUrl = `data:image/png;base64,${imageBase64}`;
      setProcessedImage(resultImageUrl);
      
      toast.success('Virtual try-on complete! 🎉');
    } catch (error) {
      console.error('❌ Virtual try-on error:', error);
      
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.error || 'Invalid request. Please try again.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Processing timeout. Please try again.');
      } else if (error.message?.includes('fetch')) {
        toast.error('Failed to load product image. Please try again.');
      } else {
        toast.error('Failed to process virtual try-on. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Download result
  const downloadResult = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `virtual-tryon-${product?.name || 'result'}.jpg`;
    link.click();
    toast.success('Image downloaded!');
  };

  // Reset
  const reset = () => {
    setUserImage(null);
    setUserImageBlob(null);
    setProcessedImage(null);
    stopCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#F5F3EF] rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#F5F3EF] border-b border-[#BFAF92] p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#1D1A05]">Virtual Try-On</h2>
            {product && (
              <p className="text-sm text-gray-600 mt-1">Try on: {product.name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#E8E4DC] rounded-full transition"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!userImage && !useCamera ? (
            // Upload/Camera Selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Option */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#BFAF92] rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-[#E8E4DC] transition"
              >
                <IoCloudUpload className="text-6xl text-[#BFAF92] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Photo</h3>
                <p className="text-sm text-gray-600 text-center">
                  Click to select a photo from your device
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Supported: JPG, PNG (Max 10MB)
                </p>
              </div>

              {/* Camera Option */}
              <div
                onClick={startCamera}
                className="border-2 border-dashed border-[#BFAF92] rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-[#E8E4DC] transition"
              >
                <IoCamera className="text-6xl text-[#BFAF92] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Take Photo</h3>
                <p className="text-sm text-gray-600 text-center">
                  Use your camera to take a photo
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Stand in good lighting for best results
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : useCamera ? (
            // Camera View
            <div className="space-y-6">
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={capturePhoto}
                  className="px-8 py-3 bg-[#BFAF92] text-white rounded-full hover:bg-[#a89d7e] transition font-semibold"
                >
                  <IoCamera className="inline mr-2" />
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-8 py-3 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Try-On Processing View
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Photo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Photo</h3>
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <img
                    src={userImage}
                    alt="Your photo"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Result or Product Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {processedImage ? 'Virtual Try-On Result' : 'Product'}
                </h3>
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Try-on result"
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="aspect-square flex items-center justify-center">
                      {product?.mainImg?.url ? (
                        <img
                          src={product.mainImg.url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white text-center p-8">
                          <p>Product image will appear here</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {userImage && !useCamera && (
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {!processedImage ? (
                <>
                  <button
                    onClick={processVirtualTryOn}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-[#BFAF92] text-white rounded-full hover:bg-[#a89d7e] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <HiSparkles className="text-xl" />
                        Try On This Product
                      </>
                    )}
                  </button>
                  <button
                    onClick={reset}
                    className="px-8 py-3 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition font-semibold"
                  >
                    <IoRefresh className="inline mr-2" />
                    Upload New Photo
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={downloadResult}
                    className="px-8 py-3 bg-[#BFAF92] text-white rounded-full hover:bg-[#a89d7e] transition font-semibold"
                  >
                    <IoDownload className="inline mr-2" />
                    Download Result
                  </button>
                  <button
                    onClick={reset}
                    className="px-8 py-3 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition font-semibold"
                  >
                    <IoRefresh className="inline mr-2" />
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 bg-[#E8E4DC] rounded-2xl p-6">
            <h4 className="font-semibold mb-3 text-[#1D1A05]">Tips for Best Results:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Stand against a plain background</li>
              <li>• Ensure good lighting (natural light works best)</li>
              <li>• Face the camera directly with arms at your sides</li>
              <li>• Wear fitted clothing for more accurate results</li>
              <li>• Full body photos work better than close-ups</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
