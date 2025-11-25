import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header"; // Assuming you have a header component
import Footer from "../components/footer"; // Assuming you have a footer component
import middle from "../assets/store/middle.png";
import smalleft from "../assets/store/smalleft.png";
import bigleft from "../assets/store/bigleft.png";
import left from "../assets/store/left.png";
import right from "../assets/store/right.png";
import bigright from "../assets/store/bigright.png";
import smallright from "../assets/store/smallright.png";
import down from "../assets/store/down.png";
import alt from "../assets/store/alt.png";
import axiosInstance from '../configs/axiosInstance';
import { HiOutlineSparkles,HiSparkles } from "react-icons/hi2";
import VirtualTryOn from '../components/VirtualTryOn';

const FashionTemplate = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});
  const [priceRange, setPriceRange] = useState([0, 100]); 
  const [selectedCategory, setSelectedCategory] = useState("NEW"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isAiSearchMode, setIsAiSearchMode] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([
    "NEW",
    "SHIRT",
    "POLO SHIRTS",
    "SHORT",
    "SUITS",
    "BEST SELLERS",
    "T-SHIRT",
    "JEANS",
    "JACKETS",
    "COATS",
  ]);
const formatVND = (v) =>
  (Number(v) || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  }) + " VND";

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    { name: "Availability", options: ["Available", "Out of Stock"] },
    { name: "Gender", options: ["Men", "Women", "Kids"] },
    { name: "Colors", options: ["Red", "Blue", "Green"] },
    { name: "Collections", options: ["Spring", "Summer", "Winter"] },
    { name: "Tags", options: ["Casual", "Formal", "Sports"] },
    { name: "Ratings", options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"] },
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    availability: [],
    gender: [],
    colors: [],
    collections: [],
    tags: [],
    ratings: [],
  });
  
  const handleCheckboxChange = (filterType, option) => {
    setSelectedFilters((prev) => {
      // Ensure the filterType key exists
      const updatedFilters = { ...prev };
      if (!Array.isArray(updatedFilters[filterType])) {
        updatedFilters[filterType] = [];
      }
  
      // Toggle the option in the filter
      if (updatedFilters[filterType].includes(option)) {
        // Remove the option if it already exists
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (item) => item !== option
        );
      } else {
        // Add the option if it doesn't exist
        updatedFilters[filterType] = [...updatedFilters[filterType], option];
      }
  
      console.log("Updated Filters:", updatedFilters);
      return updatedFilters; // Return the updated filters object
    });
  };
  
  
  // AI Search function
  const performAiSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post('/search/semantic-search', { query });
      setProducts(res.data);
    } catch (err) {
      setError("AI search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (isAiSearchMode && value) {
      // Debounce AI search
      clearTimeout(window.aiSearchTimeout);
      window.aiSearchTimeout = setTimeout(() => {
        performAiSearch(value);
      }, 800);
    }
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const { availability, gender, colors, collections, tags, ratings } = selectedFilters;

    // Skip text search filtering if in AI mode (AI already filtered)
    if (!isAiSearchMode && searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Handle category logic
    if (selectedCategory !== "NEW") {
      const categoryName = product.category?.name?.toLowerCase() || "";
      if (!categoryName.includes(selectedCategory.toLowerCase())) {
        return false; 
      }
    }

    // Check availability (if available in real data)
    if (availability.length && product.availability && !availability.includes(product.availability)) {
      return false;
    }

    // Check gender (if available in real data)
    if (gender.length && product.gender && !gender.includes(product.gender)) {
      return false;
    }

    // Check colors (if available in real data)
    if (colors.length && product.colors && !colors.some(c => product.colors.includes(c))) {
      return false;
    }

    // Check collections (if available in real data)
    if (collections.length && product.collection && !collections.includes(product.collection)) {
      return false;
    }

    // Check tags (if available in real data)
    if (tags.length && product.tags && !tags.some((tag) => product.tags.includes(tag))) {
      return false;
    }

    // Check ratings (if available in real data)
    if (ratings.length && product.rating && !ratings.includes(product.rating)) {
      return false;
    }

    return true; // Product passes all filters
  });
  
  
  return (
    <div className="relative-container noise-overlay min-h-screen flex flex-col">
      <Header />
      {/* Hero Section */}
      <section className="relative pt-52 h-full flex flex-col items-center justify-center">
        {/* Hero Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-6 font-Jsans text-[#353535]">
            Make Your Fashion Look <br /> More Charming
          </h1>
        </div>
        <div className="h-full grid grid-cols-5 gap-1  p-8 place-items-center">
          {/* Top Row - Single Image */}
          <div className="col-span-1 col-start-1 ">
            <img
              src={left}
              alt="Image 1"
              className="w-full h-full object-cover transition-transform duration-100 hover:scale-110"
            />
          </div>

          <div className="col-span-1 col-start-2">
            <div className="grid grid-rows-2 gap-0 place-items-start">
              <img
                src={smalleft}
                alt="Image 2"
                className="w-full h-auto object-cover transition-transform duration-100 hover:scale-110"
              />
              <img
                src={bigleft}
                alt="Image 3"
                className="w-full h-auto object-cover transition-transform duration-100 hover:scale-110"
              />
            </div>
          </div>
          <div className="col-span-1 col-start-3 ">
            <img
              src={middle}
              alt="Image 4"
              className="w-full h-full object-cover transition-transform duration-100 hover:scale-110"
            />
          </div>
          <div className="col-span-1 col-start-4">
            <div className="grid grid-rows-2 gap-0 place-items-end">
              <img
                src={bigright}
                alt="Image 5"
                className="w-full h-auto object-cover transition-transform duration-100 hover:scale-110"
              />
              <img
                src={smallright}
                alt="Image 6"
                className="w-full h-auto object-cover transition-transform duration-100 hover:scale-110"
              />
            </div>
          </div>
          <div className="col-span-1 col-start-5">
            <img
              src={right}
              alt="Image 7"
              className="w-full h-full object-cover transition-transform duration-100 hover:scale-110"
            />
          </div>
        </div>




        <div className="mt-20 grid grid-cols-3 gap-4 pb-8 px-12">
          {/* Quote Section */}
          <blockquote className=" font-Jsans font-medium text-[#434237] text-2xl leading-[50px]">
            <p className="text-[128px] font-jokey">“</p>
            <p>
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
              Nulla consequat massa quis enim.
            </p>
          </blockquote>
          <div className="flex justify-center mt-auto ">
            <button className="flex flex-row items-center bg-[#E6DAC4] px-6 py-2 rounded-xl  text-black font-bold text-base font-Jsans shadow-md border-[0.5px] border-[#A3A3A3] hover:bg-gray-300 transition">
              <span>SCROLL DOWN</span>
              <div className="relative ml-2 top-1 transform -translate-y-1/2 flex flex-col items-center">
                <img
                  src={down}
                  alt="Scroll Down Icon"
                  className="w-full h-full animate-move-down"
                />
                <img
                  src={down}
                  alt="Scroll Down Icon"
                  className="w-full h-full animate-move-down"
                />
              </div>
            </button>
          </div>
          {/* Pagination */}
          <div className="flex space-x-4 mt-auto ml-auto mr-8 z-10 items-center">
            <button  className="border-2 h-12 w-12 flex justify-center items-center align-middle rounded-full text-white hover:bg-gray-400">
              {"<"}
            </button>
            <button  className=" h-12 w-12 flex justify-center items-center align-middle rounded-full bg-[#434237] text-white hover:bg-gray-400">
              {">"}
            </button>
            <span className=" text-[#434237] font-kaisei text-5xl ">01   <span className="text-base">/ 05 </span></span>
          </div>
        </div>
      </section>


      {/* Product Grid Section */}
      <section className="py-8 h-full font-abeezee ">
        <div className="w-full px-8 flex gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="w-64 border-t border-[#434237] flex-shrink-0 space-y-6 pt-4">
            {/* Category Links */}
            <div className="space-y-0">
              <button
                onClick={() => handleCategoryClick('NEW')}
                className={`block w-full text-left py-1.5 text-sm transition-colors ${
                  selectedCategory === 'NEW'
                    ? 'font-normal text-[#434237]'
                    : 'text-[#8B7355] hover:text-[#434237]'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => handleCategoryClick('NEW')}
                className="block w-full text-left py-1.5 text-sm text-[#8B7355] hover:text-[#434237]"
              >
                New Arrivals
              </button>
              <button
                onClick={() => handleCategoryClick('BEST SELLERS')}
                className={`block w-full text-left py-1.5 text-sm transition-colors ${
                  selectedCategory === 'BEST SELLERS'
                    ? 'font-normal text-[#434237]'
                    : 'text-[#8B7355] hover:text-[#434237]'
                }`}
              >
                Finish Samples
              </button>
              <button className="block w-full text-left py-1.5 text-sm text-[#8B7355] hover:text-[#434237]">
                Quick Ship
              </button>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="font-normal text-sm mb-2 text-[#434237]">Categories</h3>
              <div className="space-y-0">
                {categories.slice(1).map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category)}
                    className={`block w-full text-left py-1.5 pl-4 text-sm transition-colors relative ${
                      selectedCategory === category
                        ? 'font-normal text-[#434237]'
                        : 'text-[#8B7355] hover:text-[#434237]'
                    }`}
                  >
                    { selectedCategory === category && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></span>
                    )}
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div>
              <h3 className="font-normal text-sm mb-2 text-[#434237]">Collections</h3>
              <div className="space-y-0">
                <button className="block w-full text-left py-1.5 text-sm text-[#8B7355] hover:text-[#434237]">
                  Featured
                </button>
                <button className="block w-full text-left py-1.5 text-sm text-[#8B7355] hover:text-[#434237]">
                  Seasonal
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 border-t border-[#434237] text-sm font-normal">
            {/* Top Header */}
            <div className="flex items-center justify-between my-2">
              <div className="flex items-center  gap-2">
                <h1 className="text-2xl text-gray-800">
                  {selectedCategory === 'NEW' ? 'All Products' : selectedCategory}
                </h1>
                <span className="text-sm text-gray-500 mt-2">{filteredProducts.length}</span>
              </div>

              <div className="flex items-center gap-6">
                {/* Search Box */}
                <div className="flex items-center bg-transparent border border-[#434237] px-4 py-2 rounded-full">
                  <input
                    type="text"
                    placeholder={isAiSearchMode ? "AI Search..." : "Search"}
                    className="bg-transparent text-gray-700  focus:outline-none w-48 ml-2 text-sm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button
                    onClick={() => {
                      setIsAiSearchMode(!isAiSearchMode);
                      setSearchTerm("");
                    }}
                    className={`ml-2 px-2 py-1 text-xl transition-colors rounded-full ${
                      isAiSearchMode 
                        ? 'bg-[#BFAF92] text-[#434237] border border-[#434237] hover:bg-gray-200' 
                        : 'bg-[#BFAF92] text-white border border-white hover:bg-gray-200'
                    }`}
                    title={isAiSearchMode ? "Switch to Normal Search" : "Switch to AI Search"}
                  >
                    {isAiSearchMode ? <HiSparkles /> : <HiOutlineSparkles />}
                  </button>
                </div>

                {/* Filter Button */}
                <button 
                  onClick={() => toggleSection('filters')}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
                >
                  <span>+ Filter</span>
                </button>

                {/* View Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">View:</span>
                  <button className="px-2 py-1 text-sm text-gray-700 hover:text-black">S</button>
                  <button className="px-2 py-1 text-sm text-gray-700 hover:text-black">M</button>
                  <button className="px-2 py-1 text-sm font-semibold text-black">L</button>
                </div>
              </div>
            </div>

            {/* Advanced Filters - Collapsible */}
            {openSections['filters'] && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <div className="grid grid-cols-4 gap-6">
                  {/* Size Filter */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {["S", "M", "L", "XL", "2X"].map((size, index) => (
                        <button
                          key={index}
                          className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other Filters */}
                  {sections.slice(0, 3).map((section, index) => (
                    <div key={index}>
                      <h3 className="text-sm font-semibold mb-2">{section.name}</h3>
                      <div className="space-y-1">
                        {section.options.slice(0, 3).map((option, idx) => (
                          <label key={idx} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              className="mr-2 rounded"
                              onChange={() => handleCheckboxChange(section.name.toLowerCase(), option)}
                              checked={selectedFilters[section.name.toLowerCase()]?.includes(option)}
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center text-xl text-gray-500 py-12">Loading...</div>
            ) : error ? (
              <div className="col-span-4 text-center text-xl text-red-500 py-12">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-4 text-center text-xl text-gray-400 py-12">No products found.</div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="cursor-pointer group"
                >
                  {/* Product Image */}
                  <div 
                    className="relative bg-[#E8E4DC] mb-3 overflow-hidden" 
                    style={{ aspectRatio: '3/4' }}
                    onClick={() => navigate(`/product?id=${product.id}`)}
                  >
                    <img
                      src={product.mainImg?.url || product.image || ''}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Virtual Try-On Button - appears on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setShowVirtualTryOn(true);
                      }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#BFAF92] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 font-semibold text-sm hover:bg-[#a89d7e] z-10"
                    >
                      <HiSparkles className="text-lg" />
                      Try On
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-normal text-gray-800 group-hover:underline">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatVND(product.price)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </section>


      {/* Recently Viewed Section */}
      <section className="py-16 px-8 h-full text-center ">
        <h2 className="text-3xl font-Jsans mb-8">Recently viewed</h2>

      </section>

      <section className=" py-8 px-12 font-Jsans">
        <div className="container  text-left">
          <h2 className="text-3xl  mb-4">Quick Link</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="px-6 py-2 flex items-center text-[#434237] rounded-full border border-[#434237] hover:bg-gray-300 transition">
            <span>Order Status</span>
            <img
              src={alt}
              alt="icon"
              className="w-6 h-auto object-contain" // Adjust width and height as needed
            />
            </button>
            <button className="px-6 py-2 flex items-center text-[#434237] rounded-full border border-[#434237] hover:bg-gray-300 transition">
              Shopping Help
              <img
              src={alt}
              alt="icon"
              className="w-6 h-auto object-contain" // Adjust width and height as needed
            />
            </button>
            <button className="px-6 py-2 flex items-center text-[#434237] rounded-full border border-[#434237] hover:bg-gray-300 transition">
              Return
              <img
              src={alt}
              alt="icon"
              className="w-6 h-auto object-contain" // Adjust width and height as needed
            />
            </button>
            <button className="px-6 py-2 flex items-center text-[#434237] rounded-full border border-[#434237] hover:bg-gray-300 transition">
              Your Saves
              <img
              src={alt}
              alt="icon"
              className="w-6 h-auto object-contain" // Adjust width and height as needed
            />
            </button>
          </div>
          <p className="text-[#434237] text-sm font-light leading-relaxed">
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
          </p>
        </div>
      </section>


      {/* Footer Section */}
      <Footer />
      
      {/* Virtual Try-On Modal */}
      {showVirtualTryOn && selectedProduct && (
        <VirtualTryOn
          product={selectedProduct}
          onClose={() => {
            setShowVirtualTryOn(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default FashionTemplate;
