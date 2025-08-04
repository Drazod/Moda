import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import gallery1 from "../assets/productdetail/product-image.png";
import gallery2 from "../assets/productdetail/product-image_sub1.png";
import gallery3 from "../assets/productdetail/product-image_sub2.png";
import gallery4 from "../assets/productdetail/product-image_sub3.png";


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
              className="absolute left-0 top-1/2 -translate-y-1/2 p-4 hover:bg-white text-black text-4xl z-10"
            >
              {"<"}
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-4 hover:bg-white text-black text-4xl z-10"
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
        <div>
          <nav className="text-gray-500 text-sm mb-4">
            <a href="/" className="hover:underline">Home</a> /
            <a href="/products" className="hover:underline"> Products</a> /
            <span className="text-black">{product.name}</span>
          </nav>

          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-800 font-semibold mt-2">${product.price.toFixed(2)}</p>

          {/* Tabs */}
          <div className="flex space-x-6 mt-4 border-b border-gray-300">
            <button
              className={`py-2 ${activeTab === "description" ? "border-b-2 border-black text-black font-semibold" : "text-gray-500"}`}
              onClick={() => setActiveTab("description")}
            >
              Product Description
            </button>
            <button
              className={`py-2 ${activeTab === "materials" ? "border-b-2 border-black text-black font-semibold" : "text-gray-500"}`}
              onClick={() => setActiveTab("materials")}
            >
              Materials
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <p className="mt-4 text-gray-700">{product.description}</p>
          )}
          {activeTab === "materials" && (
            <p className="mt-4 text-gray-700">High-quality cotton blend, ethically sourced.</p>
          )}

          {/* Product Color Selection */}
          <div className="mt-6">
            <p className="text-gray-800 font-semibold">Product color: <span className="text-black">{selectedColor}</span></p>
            <div className="flex space-x-3 mt-2">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Product Size Selection */}
          <div className="mt-6">
            <p className="text-gray-800 font-semibold">Product size</p>
            <div className="flex space-x-3 mt-2">
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

      <section className="mt-20 px-8 text-[#333] font-['Abeezee']">
        {/* More About Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">More about this product</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim...
          </p>
        </div>

        {/* Side-by-side Images */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-10">
          <img src="/images/product-closeup.jpg" alt="Front View" className="w-[300px] rounded" />
          <img src="/images/product-back.jpg" alt="Back View" className="w-[300px] rounded" />
        </div>
      </section>

      <section className="mt-10 px-6  mx-auto font-['Abeezee'] text-[#333]">
        {/* Rating Summary */}
        <div className="flex items-center text-lg mb-6">
          <span className="text-3xl mr-2">5.0</span>
          <div className="text-black mr-2">
            {"★★★★★".split("").map((_, i) => (
              <span key={i} className="text-3xl">★</span>
            ))}
          </div>
          <span className="text-2xl text-gray-600">| 15 reviews</span>
        </div>

        {/* Reviews */}
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="ml-16 py-6 border-b border-[#c7c2b7] font-abeezee text-xl">
            <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr] gap-4 items-justify-start">
              <div>
                <p className="font-semibold text-black">Ricky Ng.</p>
                <p className="text-xs text-gray-500">Verified Buyer</p>
              </div>
              <div className="ml-32">
                <div className="flex items-center mb-2">
                  <span className="text-black text-base">
                    {"★★★★★".split("").map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </span>
                  <span className="font-semibold ml-2">Perfect essential</span>
                </div>
                <p className="text-[#444] max-w-[90%]">
                  This is an amazing staple for my wardrobe. So soft and effortless, lightweight but warm.
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
