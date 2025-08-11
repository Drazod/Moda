import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import gallery1 from "../assets/productdetail/product-image.png";
import gallery2 from "../assets/productdetail/product-image_sub1.png";
import gallery3 from "../assets/productdetail/product-image_sub2.png";
import gallery4 from "../assets/productdetail/product-image_sub3.png";
import gallery5 from "../assets/productdetail/product-image_detail1.png";
import gallery6 from "../assets/productdetail/product-image_detail2.png";

const ProductDetail = () => {
  const [selectedColor, setSelectedColor] = useState("Green");
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const suggestedProducts = [
    { name: "Cotton Polo Shirt", image: "/products/polo1.jpg" },
    { name: "Summer Chino Shorts", image: "/products/shorts1.jpg" },
    { name: "Linen Casual Pants", image: "/products/pants1.jpg" },
    { name: "Leather Sandals", image: "/products/sandals1.jpg" },
  ];

  // Mock product data
  const product = {
    name: "Cotton Blend Cotton Shirt",
    price: 99.0,
    colors: ["#E8E6E3", "#617144", "#6C63FF"], // Beige, Green, Blue
    sizes: ["S", "M", "L", "XL", "2XL"],
    images: [
      gallery1,
      gallery2,
      gallery3,
      gallery4,
    ],
    description:
      "Our shirt is very fashion, timeless classic. It’s our OG style, and always a fan favorite.",
    details: {
      design: {
        title: "Airy & Warm",
        description:
          "Our chocolate side adds depth & airiness. The inner cotton layers provide warmth. Deep collar and open breathable style with a grainy outside.",
      },
      quality: {
        title: "Made in ABC",
        description:
          "Our chocolate side adds depth & airiness. The inner cotton layers provide warmth. Deep collar and open breathable style with a grainy outside.",
      },
      sustainability: {
        title: "Sustainable Baby Alpaca",
        description:
          "Our chocolate side adds depth & airiness. The inner cotton layers provide warmth. Deep collar and open breathable style with a grainy outside.",
      },
    },
  };

  return (
    <div className="relative-container noise-overlay min-h-screen flex flex-col">
      <Header />
      <div className="pt-40 text-gray-800 font-sans">
      {/* Breadcrumbs */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 px-12 mx-auto">
        {/* Left: Product Images */}
        <div className="lg:col-span-2">
          <div className="relative w-full flex items-center justify-center">
            {/* Image */}
            <img
              src={product.images[currentImageIndex]}
              alt="Product Main"
              className="w-[85%] h-auto object-contain"
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
            {product.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index+1}`}
                className="h-full w-auto  cursor-pointer border border-gray-300 hover:border-black"
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="font-Jsans text-[#353535]">
          <nav className="text-gray-500 text-sm mb-4">
            <a href="/" className="hover:underline">Home</a> /
            <a href="/products" className="hover:underline"> Products</a> /
            <span className="text-black">{product.name}</span>
          </nav>

          <h1 className="text-4xl text-black font-bold">{product.name}</h1>
          <p className="text-4xl text-black  mt-4">${product.price.toFixed(2)}</p>

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
            <p className="mt-4 ">High-quality cotton blend, ethically sourced.</p>
          )}

          {/* Product Color Selection */}
          <div className="mt-4">
            <p className="text-black font-semibold">Product color: <span >{selectedColor}</span></p>
            <p className="mt-2 font-light">Select a color</p>
            <div className="flex space-x-10 mt-2">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-2 cursor-pointer ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Product Size Selection */}
          <div className="mt-4">
            <p className="text-black font-semibold">Product size</p>
            <div className="flex space-x-14 mt-2">
              {product.sizes.map((size) => (
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

          {/* Add to Cart Button */}
          <button className="mt-6 bg-black text-white py-3 px-6 w-full rounded-lg hover:bg-gray-800 transition">
            Add to cart
          </button>
        </div>
      </div>

      {/* Bottom Section: Design, Quality, Sustainability */}
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

      <section className="mt-20 px-8 ">
        {/* More About Section */}
        <div className="text-center mx-auto">
          <h2 className="text-2xl mb-4 font-Jsans text-[#353535]">More about this product</h2>
          <p className="font-Jsans font-light text-base text-[#434237] leading-loose">
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enimNulla consequat massa quis enim.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. 
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
