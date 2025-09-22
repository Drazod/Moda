import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useLocation } from "react-router-dom";
import axiosInstance from "../configs/axiosInstance";
import gallery5 from "../assets/productdetail/product-image_detail1.png";
import gallery6 from "../assets/productdetail/product-image_detail2.png";

import { useCart } from "../context/CartContext";


const ProductDetail = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Prepare image URLs array: first is mainImg, then extraImgs
  const imageUrls = [
    product?.mainImg?.url,
    ...(product?.extraImgs ? product.extraImgs.map(img => img.url) : [])
  ].filter(Boolean);

  useEffect(() => {
    if (!productId) {
      setError("No product id provided");
      setLoading(false);
      return;
    }
    setLoading(true);
    axiosInstance.get(`/clothes/${productId}`)
      .then(res => {
        setProduct(res.data);
        // Set default color and size if available
        if (res.data.colors && res.data.colors.length > 0) setSelectedColor(res.data.colors[0]);
        if (res.data.sizes && res.data.sizes.length > 0) setSelectedSize(res.data.sizes[0].label || res.data.sizes[0]);
        setError(null);
      })
      .catch(err => {
        setError("Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleNextImage = () => {
    if (!imageUrls.length) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    if (!imageUrls.length) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  // Placeholder for suggested products (could fetch from API)
  const suggestedProducts = [
    { name: "Cotton Polo Shirt", image: "/products/polo1.jpg" },
    { name: "Summer Chino Shorts", image: "/products/shorts1.jpg" },
    { name: "Linen Casual Pants", image: "/products/pants1.jpg" },
    { name: "Leather Sandals", image: "/products/sandals1.jpg" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl">Loading product...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl text-red-500">{error}</span>
      </div>
    );
  }
  if (!product) {
    return null;
  }

  // Parse sizes/features if needed
  let sizes = [];
  if (Array.isArray(product.sizes)) {
    if (typeof product.sizes[0] === "string") {
      sizes = product.sizes;
    } else if (typeof product.sizes[0] === "object" && product.sizes[0].label) {
      sizes = product.sizes.map(s => s.label);
    }
  }
  let colors = product.colors || [];

  return (
    <div className="relative-container noise-overlay min-h-screen flex flex-col">
      <Header />
      <div className="pt-40 text-gray-800 font-sans">
        {/* Breadcrumbs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 px-12 mx-auto">
          {/* Left: Product Images */}
          <div className="lg:col-span-2">
            <div className="relative w-full flex items-center justify-center">
              {/* Main Image */}
              <img
                src={imageUrls[currentImageIndex]}
                alt="Product Main"
                className="w-[80%] h-auto object-contain"
              />
              {/* Left Arrow */}
              <button
                onClick={handlePrevImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-4 hover:text-gray-500 text-black text-5xl z-10"
              >
                {"<"}
              </button>
              {/* Right Arrow */}
              <button
                onClick={handleNextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 hover:text-gray-500 text-black text-5xl z-10"
              >
                {">"}
              </button>
            </div>
            <div className="flex ml-16 space-x-4 mt-4">
              {product.extraImgs && product.extraImgs.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`Thumbnail ${index+1}`}
                  className="h-[150px] w-auto cursor-pointer border border-gray-300 hover:border-black"
                  onClick={() => setCurrentImageIndex(index + 1)}
                />
              ))}
            </div>
          </div>
          {/* Right: Product Details */}
          <div className="font-Jsans text-[#353535]">
            <nav className="text-gray-500 text-sm mb-4">
              <a href="/" className="hover:underline">Home</a> /
              <a href="/store" className="hover:underline"> Store</a> /
              <span className="text-black">{product.name}</span>
            </nav>
            <h1 className="text-4xl text-black font-bold">{product.name}</h1>
            <p className="text-4xl text-black  mt-4">${product.price ? product.price.toFixed(2) : "N/A"}</p>
            {/* Tabs */}
            <div className="flex mt-4 border-b border-gray-300">
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "description"
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Product Description
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "materials"
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("materials")}
              >
                Materials
              </button>
            </div>
            {/* Tab Content */}
            {activeTab === "description" && (
              <p className="mt-4 ">{product.description}</p>
            )}
            {activeTab === "materials" && (
              <p className="mt-4 ">{product.material || "High-quality materials, ethically sourced."}</p>
            )}
            {/* Product Color Selection */}
            {colors.length > 0 && (
              <div className="mt-4">
                <p className="text-black font-semibold">Product color: <span >{selectedColor}</span></p>
                <p className="mt-2 font-light">Select a color</p>
                <div className="flex space-x-10 mt-2">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 cursor-pointer ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Product Size Selection */}
            {sizes.length > 0 && (
              <div className="mt-4">
                <p className="text-black font-semibold">Product size</p>
                <div className="flex space-x-14 mt-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border font-Jsans text-xl text-center bg-[#F5F5F5]/50 rounded cursor-pointer ${
                        selectedSize === size ? "border-black/50 font-bold bg-[#F5F5F5]" : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Add to Cart Button */}
            <button
              className={`mt-6 py-3 px-6 w-full rounded-lg transition text-white
                ${(() => {
                  // Per-size quantity check
                  if (Array.isArray(product.sizes) && typeof product.sizes[0] === "object" && product.sizes[0].label) {
                    const found = product.sizes.find(s => s.label === selectedSize);
                    if (found && typeof found.quantity === "number" && found.quantity === 0) return 'bg-gray-400';
                  }
                  if (typeof product.quantity === "number" && product.quantity === 0) return 'bg-gray-400';
                  if (typeof product.stock === "number" && product.stock === 0) return 'bg-gray-400';
                  return 'bg-black hover:bg-gray-800';
                })()}`}
              disabled={(() => {
                // Per-size quantity check
                if (Array.isArray(product.sizes) && typeof product.sizes[0] === "object" && product.sizes[0].label) {
                  const found = product.sizes.find(s => s.label === selectedSize);
                  if (found && typeof found.quantity === "number") return found.quantity === 0;
                }
                // Global stock check
                if (typeof product.quantity === "number") return product.quantity === 0;
                if (typeof product.stock === "number") return product.stock === 0;
                return false;
              })()}
              title={(() => {
                if (Array.isArray(product.sizes) && typeof product.sizes[0] === "object" && product.sizes[0].label) {
                  const found = product.sizes.find(s => s.label === selectedSize);
                  if (found && typeof found.quantity === "number" && found.quantity === 0) return "Out of stock for this size";
                }
                if (typeof product.quantity === "number" && product.quantity === 0) return "Out of stock";
                if (typeof product.stock === "number" && product.stock === 0) return "Out of stock";
                return undefined;
              })()}
              onClick={() => {
                // Find sizeId if available
                let sizeId = undefined;
                if (Array.isArray(product.sizes)) {
                  if (typeof product.sizes[0] === "object" && product.sizes[0].label) {
                    const found = product.sizes.find(s => s.label === selectedSize);
                    if (found && found.id) sizeId = found.id;
                  }
                }
                addToCart(product, {
                  selectedColor,
                  selectedSize,
                  sizeId,
                  qty: 1,
                });
              }}
            >
              {(() => {
                if (Array.isArray(product.sizes) && typeof product.sizes[0] === "object" && product.sizes[0].label) {
                  const found = product.sizes.find(s => s.label === selectedSize);
                  if (found && typeof found.quantity === "number" && found.quantity === 0) return "Out of stock";
                }
                if (typeof product.quantity === "number" && product.quantity === 0) return "Out of stock";
                if (typeof product.stock === "number" && product.stock === 0) return "Out of stock";
                return "Add to cart";
              })()}
            </button>
          </div>
        </div>
        {/* Bottom Section: Design, Quality, Sustainability */}
        {product.details && (
          <div className="border-t border-[#434237] mt-20 mx-8" style={{ borderTopWidth: "0.5px" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-48 mt-20 px-20 mx-auto">
              {Object.keys(product.details).map((key) => (
                <div key={key} className="text-left">
                  <h3 className="font-Jsans font-extralight text-base">{key.toUpperCase()}</h3>
                  <h3 className="mt-2 font-Jsans text-xl text-[#434237]">{product.details[key].title}</h3>
                  <p className="mt-2 font-Jsans font-light text-base text-[#353535]">{product.details[key].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <section className="mt-20 px-8 ">
          {/* More About Section */}
          <div className="text-center mx-auto">
            <h2 className="text-2xl mb-4 font-Jsans text-[#353535]">More about this product</h2>
            <p className="font-Jsans font-light text-base text-[#434237] leading-loose">
              {product.information || "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."}
            </p>
          </div>
          {/* Side-by-side Images */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-10">
            <img src={gallery5} alt="Front View" className="" />
            <img src={gallery6} alt="Back View" className="" />
          </div>
        </section>
        <section className="mt-20 px-8 mx-auto">
          {/* Rating Summary */}
          <div className="flex items-center text-lg">
            <span className="text-4xl font-kaisei text-[#434237] tracking-wide">5.0</span>
            <div className="text-[#434237] mx-2">
              {"★★★★★".split("").map((_, i) => (
                <span key={i} className="text-3xl">★</span>
              ))}
            </div>
            <span className="pt-2 text-2xl font-Jsans font-light text-[#353535]">| 15 reviews</span>
          </div>
          {/* Reviews */}
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="ml-16 py-20 border-b border-[#434237] font-Jsans text-xl">
              <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr] gap-4 items-justify-start">
                <div>
                  <p className=" text-2xl text-[#353535]">Ricky Ng.</p>
                  <p className="text-sm font-light text-[#353535]">Verified Buyer</p>
                </div>
                <div className="ml-32">
                  <div className="flex items-center mb-2">
                    <span className="text-[#434237]  text-base">
                      {"★★★★★".split("").map((_, i) => (
                        <span key={i} className="text-xl">★</span>
                      ))}
                    </span>
                    <span className="text-[#434237] text-xl ml-2">Perfect essential</span>
                  </div>
                  <p className="text-[#353535] font-light max-w-[90%]">
                    This is an amazing staple for my wardrobe. So soft and effortless, lightweight but warm.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
        {/* You May Also Like */}
        <section className="mt-20 px-8 font-Jsans text-[#353535]">
          <h2 className="text-2xl font-semibold text-center mx-auto mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map((item, index) => (
              <div key={index} className="text-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-auto object-cover rounded-lg mb-2"
                />
                <p className="text-xl ">{item.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
