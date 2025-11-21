import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import cakeImage from "../assets/welcomepage/hbgforest.png";
import city from "../assets/welcomepage/bgcity.jpg";
import forest from "../assets/welcomepage/bgforest.jpg";
import korea from "../assets/welcomepage/hbgkorea.png";
import Header from "../components/header";
import circle from "../assets/welcomepage/workshopword.png";
import { FaMapPin,FaFacebook,FaInstagram } from "react-icons/fa";
import "../App.css";

const Welcome = () => {

  const images = [cakeImage, korea];
  const bgImages = [city, forest];


  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsTransitioning(false);
    }, 500);
  };

  // Navigate to the previous image
  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 300);
  };
  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Moda | Fashion Ecommerce & Socialize</title>
        <meta
          name="description"
          content="Enjoy the best vegan chocolate chip cookie dough at Yumeow-Cookie. Order now for freshly baked vegan cookies!"
        />
      </Helmet>

      <div className="h-screen w-screen flex flex-col bg-[#BFAF92]">
        <Header />
        <div className="relative h-full w-full grid grid-cols-2">
          {/* Left Section */}
          <div className=" flex flex-col justify-center z-10 relative ">

            <div className="p-8 md:p-16 mt-80">
              <h1
                className="text-[#072B05] text-2xl md:text-4xl font-bold leading-snug tracking-wider"
                style={{ fontFamily: "'Josefin Sans', serif" }}
              >
                Free clothes for
                <br />
                 those who care 
                <br />
                of nature
              </h1>
              <p
                className="text-[#E6DAC4] text-lg md:text-xl  mr-20 md:mr-52"
                style={{ fontFamily: "'Josefin Sans', serif", lineHeight: "30px"  }}
                
              >
                Receive free clothes as a thank-you for caring for nature! Join us in promoting sustainability and making eco-friendly choices while enjoying stylish, complimentary apparel.
                <br />
              </p>
              <div className="relative w-[200px] h-[50px] mt-6">
                <a href="/store">
                  <button
                    className="absolute text-white bg-[#072B05] font-bold text-base w-full h-full z-10"
                    style={{ fontFamily: "'Josefin Sans', serif" }}
                  >
                    VIEW CATALOG
                  </button>
                </a>
                <div className="absolute border-2 w-full h-full top-1 left-1 z-0"></div>
              </div>
              
            </div>
            <div className="flex items-center mt-auto pl-6">
              <FaMapPin className="text-[#434237] w-12 h-10" />
              <p
                className="text-[#938791] text-base md:text-lg  leading-relaxed"
                style={{ fontFamily: "'Josefin Sans', serif" }}
              >
                Visit us today and enjoy the best vegan cookies in town.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex relative ">
            <div className="absolute -translate-y-[50%] right-2 top-1/2 space-x-4 z-10 flex flex-col items-center">
              {/* Buttons */}
              <div className="flex space-x-4">
                <button onClick={handlePrev} className="border-2 h-12 w-12 flex justify-center items-center align-middle rounded-full text-white hover:bg-gray-400">
                  {"<"}
                </button>
                <button onClick={handleNext} className=" h-12 w-12 flex justify-center items-center align-middle rounded-full bg-[#434237] text-white hover:bg-gray-400">
                  {">"}
                </button>
                <span className=" text-[#434237] font-kaisei text-5xl ">0 {currentIndex+1}  <span className="text-base">/ 0 {images.length}</span></span>
              </div>
              {/* Image */}
              <img
                src={images[currentIndex]}
                alt={`Carousel ${currentIndex + 1}`}
                className=" w-[300px] h-[400px] object-cover transition-all duration-500 ease-in-out"
              />
            </div>
            <div className="flex items-center ml-auto mt-auto space-x-2 mb-2 mr-2 pl-6">
              <FaFacebook className="text-[#434237] w-12 h-12" />
              <FaInstagram className="text-[#434237] w-12 h-12" />
            </div>
          </div>
          
          <div className='absolute inset-0 overflow-hidden'>
            <img
              src={images[(currentIndex + 1) % images.length]}
              alt={`Carousel ${currentIndex + 2}`}
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[520px] h-auto z-20 transition-all duration-500 ease-in-out ${
                isTransitioning ? "opacity-0 scale-90" : "opacity-100 scale-100"
              }`}
            />
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 shadow-inner h-5/6 w-1/3 aspect-h-4 aspect-w-3 rounded-full z-10 transition-all duration-500 ease-in-out"
              style={{
                backgroundImage: `url(${bgImages[(currentIndex + 2) % images.length]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
          {/* Cake Image */}
        </div>
      </div>
    </>
  );
};

export default Welcome;