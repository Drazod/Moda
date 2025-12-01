import { useState, useRef, useEffect } from 'react';
import { IoClose, IoCamera, IoCloudUpload, IoDownload, IoRefresh, IoInformationCircleOutline } from 'react-icons/io5';
import Header from '../components/header';
import Footer from '../components/footer';
import {HiSparkles} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import axiosInstance from '../configs/axiosInstance';
import { useNavigate } from 'react-router-dom';
import featurepic from "../assets/homepage/featurepic.png";
import banner from  "../assets/tryon/tryonBanner.png";

const FittingRoom = () => {
    const navigate = useNavigate();
    const [userImage, setUserImage] = useState(null);
    const [userImageBlob, setUserImageBlob] = useState(null); // Store blob for upload
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [useCamera, setUseCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showGuide, setShowGuide] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const tryOnSectionRef = useRef(null);
    const uploadRef = useRef(null);
    const productListRef = useRef(null);
    const actionButtonsRef = useRef(null);

    const guideSteps = [
    {
        id: "upload",
        title: "Step 1 · Add your photo",
        description: "Upload a clear full-body photo or use your camera to take one.",
    },
    {
        id: "productList",
        title: "Step 2 · Pick a product",
        description: "Choose an item from the right panel. The selected one will be highlighted.",
    },
    {
        id: "actions",
        title: "Step 3 · Try it on",
        description: "Click “Try On This Product” to see the outfit on you.",
    },
        {
        id: "actions",
        title: "Step 4 · Result & Download",
        description: "You will see the final result and can download your outfit.",
    }
    ];

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const PAGE_SIZE = 6;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(products?.length / PAGE_SIZE);
    const paginatedProducts = products?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
useEffect(() => {
  if (!tryOnSectionRef.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowGuide(true);
          setCurrentStep(0);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(tryOnSectionRef.current);

  return () => observer.disconnect();
}, []);

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

const handleProductClick = (product) => {
    setSelectedProduct(product);
};
  
useEffect(() => {
    const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
        const res = await axiosInstance.get('/clothes/list');
        setProducts(res.data);
    } catch (err) {
        setError("Failed to load products.");
    } finally {
        setLoading(false);
    }
    };
    fetchProducts();
}, []);

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
    if (!userImage || !selectedProduct) {
    toast.error('Please upload your photo first');
    return;
    }

    if (!userImageBlob) {
    toast.error('Image data not available');
    return;
    }

    if (!selectedProduct.mainImg?.url) {
    toast.error('Product image not available');
    return;
    }

    setIsProcessing(true);
    
    try {
    // Send user image as file and product image as URL
    // Backend will fetch the product image to avoid CORS issues
    const formData = new FormData();
    formData.append('humanImage', userImageBlob, 'user-photo.jpg');
    formData.append('clothImageUrl', selectedProduct.mainImg.url);
    
    console.log('🚀 Sending virtual try-on request...');
    console.log('User image size:', userImageBlob.size, 'bytes');
    console.log('Product image URL:', selectedProduct.mainImg.url);
    
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
    <div className="relative-container noise-overlay min-h-screen flex flex-col">
        <Header/>
        {/* Hero Section */}
        <section className="relative mt-16 grid grid-cols-3 px-4 py-8 bg-[#E8DCC4] min-h-[90vh]  items-center justify-center overflow-hidden">
            {/* Background Images */}
            <div className=" max-h-[80vh] z-10">
                <img
                    src={banner}
                    alt="Fashion model left"
                    className="w-full h-auto object-cover grayscale"
                />
            </div>


            {/* Center Content */}
            <div className="relative z-20 text-center px-4 max-w-2xl">
                {/* Top Small Image Group */}
                <div className="mb-6 flex justify-center">
                    <img
                        src={featurepic}
                        alt="Fashion group"
                        className="w-80 h-32 object-cover rounded-sm shadow-lg"
                    />
                </div>

                {/* Main Title */}
                <h1 className="text-7xl font-bold text-[#434237] mb-2 tracking-tight">
                    VIRTUAL
                </h1>
                <h1 className="text-7xl font-bold text-[#434237] mb-8 tracking-widest" style={{ 
                    WebkitTextStroke: '2px #434237',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.1em'
                }}>
                    TRY-ON
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-[#434237] mb-8 tracking-wide uppercase">
                    EXPLORE STYLE WITHOUT BORDERS
                </p>

                {/* CTA Button */}
                <button
                    onClick={() => {
                        tryOnSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-black text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                >
                    TRY NOW
                </button>

                {/* Bottom Small Image */}
                <div className="mt-8 flex justify-center">
                    <img
                        src={featurepic}
                        alt="Fashion duo"
                        className="w-64 h-40 object-cover rounded-sm shadow-lg bg-[#FFB5B5]"
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 max-h-[80vh] overflow-hidden">
                {/* Column 1 - Scrolls Down */}
                <div className="flex flex-col gap-3 animate-scroll-down">
                    {[...products, ...products].slice(0, 12).map((product, idx) => (
                        <div
                            key={`col1-${idx}`}
                            onClick={() => handleProductClick(product)}
                            className={`cursor-pointer flex-shrink-0 ${
                                selectedProduct?._id === product._id
                                    ? 'border-2 border-[#434237]'
                                    : ''
                            }`}
                        >
                            <div className="relative bg-[#E8E4DC] overflow-hidden aspect-square ">
                                <img
                                    src={product.mainImg?.url || product.image || ''}
                                    alt={product.name}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Column 2 - Scrolls Up */}
                <div className="flex flex-col gap-3 animate-scroll-up">
                    {[...products, ...products].slice(3, 15).map((product, idx) => (
                        <div
                            key={`col2-${idx}`}
                            onClick={() => handleProductClick(product)}
                            className={`cursor-pointer flex-shrink-0 ${
                                selectedProduct?._id === product._id
                                    ? 'border-2 border-[#434237]'
                                    : ''
                            }`}
                        >
                            <div className="relative bg-[#E8E4DC] overflow-hidden aspect-square ">
                                <img
                                    src={product.mainImg?.url || product.image || ''}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Column 3 - Scrolls Down */}
                <div className="flex flex-col gap-3 animate-scroll-down-slow">
                    {[...products, ...products].slice(6, 18).map((product, idx) => (
                        <div
                            key={`col3-${idx}`}
                            onClick={() => handleProductClick(product)}
                            className={`cursor-pointer flex-shrink-0 ${
                                selectedProduct?._id === product._id
                                    ? 'border-2 border-[#434237]'
                                    : ''
                            }`}
                        >
                            <div className="relative bg-[#E8E4DC] overflow-hidden aspect-square ">
                                <img
                                    src={product.mainImg?.url || product.image || ''}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
            
        <div  ref={tryOnSectionRef} className="flex max-h-[80vh] px-4 py-8 gap-2">
            <div className="w-2/4  gap-6 border-t border-[#434237] pt-4 px-2">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-[#434237]">1. Upload Your Photo</h3>
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowGuide(prev => prev && currentStep === 0 ? false : true);
                                setCurrentStep(0);
                            }}
                            className="p-1 hover:bg-[#BFAF92]/20 rounded-full transition"
                            title="Show guide"
                        >
                            <IoInformationCircleOutline className="text-2xl text-[#BFAF92]" />
                        </button>
                        {showGuide && currentStep === 0 && (
                            <div className="absolute left-0 top-10 z-50 w-80 max-w-[90vw]">
                                <div className="bg-white border border-[#BFAF92] rounded-2xl shadow-xl p-4">
                                    <button
                                        onClick={() => setShowGuide(false)}
                                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <IoClose className="text-sm" />
                                    </button>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#BFAF92] text-white">
                                            <HiSparkles className="text-base" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            Virtual Try-On Guide
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-[#1D1A05] mb-1">
                                        {guideSteps[0].title}
                                    </h4>
                                    <p className="text-xs text-gray-700 mb-3">
                                        {guideSteps[0].description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setShowGuide(false)}
                                            className="text-xs text-gray-500 hover:underline"
                                        >
                                            Skip
                                        </button>
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#BFAF92] text-white hover:bg-[#a89d7e]"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {!userImage && !useCamera ? (
                // Upload/Camera Selection
                <div ref={uploadRef} className="grid grid-rows-1 md:grid-rows-2 gap-6">
                    {/* Upload Option */}
                    <div className=" grid grid-cols-2 gap-6">
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
                    <div
                        className="border-2 shrink max-h-[30vh] border-dashed border-[#BFAF92] rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-[#E8E4DC] transition"
                        >
                        <img 
                            src={selectedProduct?.mainImg?.url} 
                            alt={"Product"}
                            className="w-full h-auto object-contain max-h-[30vh]"
                        />
                    </div>
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
                <div className="max-h-[80vh] grid grid-rows-2 gap-6">
                    {/* Original Photo */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Your Photo</h3>
                        <div className="bg-black  max-h-[30vh] rounded-2xl overflow-hidden">
                            <img
                            src={userImage}
                            alt="Your photo"
                            className="w-full object-contain max-h-[30vh]"
                            />
                        </div>
                    </div>
                    <div className="border-2 max-h-[30vh] border-dashed border-[#BFAF92] rounded-2xl p-12 flex flex-col items-center justify-center hover:bg-[#E8E4DC] transition">
                        <img 
                            src={selectedProduct?.mainImg?.url} 
                            alt={"Product"}
                            className="w-full h-auto object-contain max-h-[30vh]"
                        />
                    </div>
                </div>
                )}
            </div>

            

            <div className="grow border-t border-[#434237] pt-4 px-2">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold text-[#434237]"> Result</h3>
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowGuide(prev => prev && currentStep === 3 ? false : true);
                                setCurrentStep(3);
                            }}
                            className="p-1 hover:bg-[#BFAF92]/20 rounded-full transition"
                            title="Show guide"
                        >
                            <IoInformationCircleOutline className="text-2xl text-[#BFAF92]" />
                        </button>
                        {showGuide && currentStep === 3 && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-10 z-50 w-80 max-w-[90vw]">
                                <div className="bg-white border border-[#BFAF92] rounded-2xl shadow-xl p-4">
                                    <button
                                        onClick={() => setShowGuide(false)}
                                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <IoClose className="text-sm" />
                                    </button>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#BFAF92] text-white">
                                            <HiSparkles className="text-base" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            Virtual Try-On Guide
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-[#1D1A05] mb-1">
                                        {guideSteps[3].title}
                                    </h4>
                                    <p className="text-xs text-gray-700 mb-3">
                                        {guideSteps[3].description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setCurrentStep(2)}
                                            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setShowGuide(false)}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#BFAF92] text-white hover:bg-[#a89d7e]"
                                        >
                                            Got it
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative max-h-screen bg-black rounded-2xl overflow-hidden">
                    {processedImage ? (
                    <img
                        src={processedImage}
                        alt="Try-on result"
                        className="w-auto"
                    />
                    
                    ) : (
                    <div className="border-2  border-dashed border-[#BFAF92] rounded-2xl p-12 flex flex-col items-center justify-center hover:bg-[#E8E4DC] transition">
                        <p className="text-gray-500">No result yet</p>
                    </div>
                    )}
                </div>
            </div>
            
            <div  ref={productListRef} className="w-1/4 border-t border-[#434237] pt-4 px-2">
                {/* Section Title */}
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold text-[#434237]">2. Select Product</h3>
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowGuide(prev => prev && currentStep === 1 ? false : true);
                                setCurrentStep(1);
                            }}
                            className="p-1 hover:bg-[#BFAF92]/20 rounded-full transition"
                            title="Show guide"
                        >
                            <IoInformationCircleOutline className="text-2xl text-[#BFAF92]" />
                        </button>
                        {showGuide && currentStep === 1 && (
                            <div className="absolute right-0 top-10 z-50 w-80 max-w-[90vw]">
                                <div className="bg-white border border-[#BFAF92] rounded-2xl shadow-xl p-4">
                                    <button
                                        onClick={() => setShowGuide(false)}
                                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <IoClose className="text-sm" />
                                    </button>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#BFAF92] text-white">
                                            <HiSparkles className="text-base" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            Virtual Try-On Guide
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-[#1D1A05] mb-1">
                                        {guideSteps[1].title}
                                    </h4>
                                    <p className="text-xs text-gray-700 mb-3">
                                        {guideSteps[1].description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setCurrentStep(0)}
                                            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            Back
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowGuide(false)}
                                                className="text-xs text-gray-500 hover:underline"
                                            >
                                                Skip
                                            </button>
                                            <button
                                                onClick={() => setCurrentStep(2)}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#BFAF92] text-white hover:bg-[#a89d7e]"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="border-[#BFAF92] border-4 grid grid-cols-2 rounded-2xl p-6 gap-4">
                    {loading ? (
                        <div className="col-span-2 text-center text-xl text-gray-500 py-12">Loading...</div>
                    ) : error ? (
                        <div className="col-span-2 text-center text-xl text-red-500 py-12">{error}</div>
                    ) : products.length === 0 ? (
                        <div className="col-span-2 text-center text-xl text-gray-400 py-12">No products found.</div>
                    ) : (
                        paginatedProducts.map((product) => (
                        <div
                            key={product.id}
                            className="cursor-pointer "
                        >
                            {/* Product Image */}
                            <div 
                            onClick={() => handleProductClick(product)}
                            className={`relative bg-[#E8E4DC]  overflow-hidden aspect-square ${
                                selectedProduct === product
                                    ? 'border-4 border-[#434237]'
                                    : 'border-0'
                                }`}
                            >
                                <img
                                    src={product.mainImg?.url || product.image || ''}
                                    alt={product.name}
                                    className="max-w-full h-auto object-cover transition-transform duration-300"
                                />
                            </div>

                            {/* Product Info */}
                            <div
                            onClick={() => navigate(`/product?id=${product.id}`)}
                            className="space-y-1">
                                <h3 className="text-sm font-normal text-gray-800 group-hover:underline">
                                    {product.name}
                                </h3>
                            </div>
                        </div>
                        ))
                    )}
                </div>
                
                {/* Pagination Dots */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-4 pb-3">
                        {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-2 h-2 rounded-full focus:outline-none transition-all duration-150 ${page === i + 1 ? 'bg-[#BFAF92] shadow' : 'bg-gray-400'}`}
                            aria-label={`Go to page ${i + 1}`}
                        >
                        </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
            
        {/* Action Buttons */}
        <div className="mt-6 px-4 pb-8">
            {/* Section Title */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-[#434237]">3. Try It On</h3>
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowGuide(prev => prev && currentStep === 2 ? false : true);
                            setCurrentStep(2);
                        }}
                        className="p-1 hover:bg-[#BFAF92]/20 rounded-full transition"
                        title="Show guide"
                    >
                        <IoInformationCircleOutline className="text-2xl text-[#BFAF92]" />
                    </button>
                    {showGuide && currentStep === 2 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-10 z-50 w-80 max-w-[90vw]">
                            <div className="bg-white border border-[#BFAF92] rounded-2xl shadow-xl p-4">
                                <button
                                    onClick={() => setShowGuide(false)}
                                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <IoClose className="text-sm" />
                                </button>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#BFAF92] text-white">
                                        <HiSparkles className="text-base" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Virtual Try-On Guide
                                    </span>
                                </div>
                                <h4 className="text-sm font-semibold text-[#1D1A05] mb-1">
                                    {guideSteps[2].title}
                                </h4>
                                <p className="text-xs text-gray-700 mb-3">
                                    {guideSteps[2].description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowGuide(false)}
                                            className="text-xs text-gray-500 hover:underline"
                                        >
                                            Skip
                                        </button>
                                        <button
                                            onClick={() => setCurrentStep(3)}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#BFAF92] text-white hover:bg-[#a89d7e]"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div ref={actionButtonsRef} className="flex gap-4 justify-center">
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
        </div>
            
        <div className="mt-2 p-6 font-Jsans">
            <h2 className="text-2xl mb-4">Tips for Best Results:</h2>
            <ul className="space-y-2 text-[#434237] text-sm font-light leading-relaxed">
              <li>• Stand against a plain background</li>
              <li>• Ensure good lighting (natural light works best)</li>
              <li>• Face the camera directly with arms at your sides</li>
              <li>• Wear fitted clothing for more accurate results</li>
              <li>• Full body photos work better than close-ups</li>
            </ul>
        </div>
        <Footer/>
    </div>

);
};

export default FittingRoom;
