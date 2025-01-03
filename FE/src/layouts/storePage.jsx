import React,{useState} from "react";
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
import {products} from "../utils/mockdata";

const FashionTemplate = () => {
  const [openSections, setOpenSections] = useState({});
  const [priceRange, setPriceRange] = useState([0, 100]); 
  const [selectedCategory, setSelectedCategory] = useState("NEW"); 
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "NEW",
    "SHIRT",
    "POLO SHIRTS",
    "SHORTS",
    "SUITS",
    "BEST SELLERS",
    "T-SHIRT",
    "JEANS",
    "JACKETS",
    "COATS",
  ];

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
  
  
  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const { availability, gender, colors, collections, tags, ratings } = selectedFilters;
  
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Handle category logic
    if (selectedCategory !== "NEW") {
      const categoryWords = product.category?.toLowerCase().split(/\s+/) || [];
      if (!categoryWords.includes(selectedCategory.toLowerCase())) {
        return false; 
      }
    }
  
    // Check availability
    if (availability.length && !availability.includes(product.availability)) {
      return false;
    }
  
    // Check gender
    if (gender.length && !gender.includes(product.gender)) {
      return false;
    }
  
    // Check colors
    if (colors.length && !colors.includes(product.colors)) {
      return false;
    }
  
    // Check collections
    if (collections.length && !collections.includes(product.collection)) {
      return false;
    }
  
    // Check tags
    if (tags.length && !tags.some((tag) => product.tags.includes(tag))) {
      return false;
    }
  
    // Check ratings
    if (ratings.length && !ratings.includes(product.rating)) {
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
      <section className=" grid grid-cols-4 gap-2 py-8 h-full items-center justify-center font-abeezee">
        {/* Breadcrumbs */}
        <div className="col-start-2 col-span-3 container mb-6 ">
          <div></div> {/* Empty space for the sidebar */}
          <div className="col-span-3">
            <p className="text-sm">
              <a href="/" className="hover:underline">Home</a> / <span>Products</span>
            </p>
            <h1 className="text-2xl font-bold mt-2">PRODUCTS</h1>
          </div>
        </div>

        {/* Main Layout */}
        <div className="h-full col-start-1 col-span-1 px-12 tracking-widest">
          {/* Sidebar - Filters */}
          <aside className="col-start-1 space-y-10">
            {/* Filters Title */}
            <h2 className="text-xl">Filters</h2>

            {/* Size Filter */}
            <div>
              <h3 className="text-sm text-gray-700 mb-2">Size</h3>
              <div className="flex flex-wrap text-center gap-2">
                {["S", "M", "L", "XL", "2X"].map((size, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 h-9 w-9 text-center justify-center items-center text-sm border border-[#A3A3A3] text-gray-800  hover:bg-gray-200 transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible Categories */}
            {sections.map((section, index) => (
              <div key={index} className="border-b border-[#C9C9C9] border-dashed pb-2">
                {/* Section Header */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection(section.name)}
                >
                  <h3 className="text-sm text-gray-700">{section.name}</h3>
                  <button className="text-gray-700 hover:text-gray-900 transition">
                    {openSections[section.name] ? "▲" : "▼"} {/* Toggle Icon */}
                  </button>
                </div>

                {/* Collapsible Content */}
                {openSections[section.name] && (
                  <ul className="mt-2 space-y-2 pl-4">
                    {section.options.map((option, idx) => (
                      <li key={idx} className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox text-gray-800 rounded mr-2"
                          onChange={() => handleCheckboxChange(section.name.toLowerCase(), option)}
                          checked={selectedFilters[section.name.toLowerCase()]?.includes(
                            option
                          )}
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}


              {/* Price Range Section */}
              <div className="border-b border-gray-300 pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection("Price Range")}
                >
                  <h3 className="text-sm text-gray-700">Price Range</h3>
                  <button className="text-gray-700 hover:text-gray-900 transition">
                    {openSections["Price Range"] ? "▲" : "▼"}
                  </button>
                </div>

                {openSections["Price Range"] && (
                  <div className="mt-2 px-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full appearance-none h-2 bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                    <div className="flex justify-between text-sm text-gray-700 mt-1">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                )}
              </div>
          </aside>
        </div>
        

        {/* Product Grid */}
        <div className="col-start-2 col-span-3 pr-12">
          {/* Sort & Search */}
          <div className="container h-[50px] mx-auto mb-6 flex flex-col lg:flex-row items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Box */}
            <div className="flex h-[50px] items-center bg-[#BFAF92] px-4 py-2 w-full lg:w-1/3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-600"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m0 0a7 7 0 11-2 2 7 7 0 012-2z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent text-gray-700 placeholder-gray-600 focus:outline-none w-full ml-2"
                value={searchTerm} // Bind the searchTerm state
                onChange={(e) => setSearchTerm(e.target.value)} // Update the state on change
              />
            </div>

            {/* Sort Categories */}
            <div className="grid grid-cols-5 h-[50px] justify-center gap-1">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category)} // Update selected category
                  className={`px-4 h-[25px] text-sm border border-[#A3A3A3] transition-all duration-300 ${
                    selectedCategory === category
                      ? " text-black border-black"
                      : " text-[#5E5E5E] hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
                <div key={product.id} className="">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-auto mb-4 object-cover"
                    />
                  </div>

                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-700">{product.name}</h3>
                    <span className="text-lg font-semibold text-gray-600">{product.price}VND</span>
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default FashionTemplate;
