import React,{useEffect} from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import featurepic from "../assets/homepage/featurepic.png";
import author from "../assets/homepage/author.png";
import gallery1 from "../assets/homepage/gallery1.png";
import gallery2 from "../assets/homepage/gallery2.png";
import gallery3 from "../assets/homepage/gallery3.png";
import discount from "../assets/homepage/discount.png";
import product1 from "../assets/homepage/product1.png";
import product2 from "../assets/homepage/product2.png";
import product3 from "../assets/homepage/product3.png";
import product4 from "../assets/homepage/product4.png";
import { BsArrowRight } from "react-icons/bs";
import Contact from "../components/homePage/contact";
import AOS from "aos";
import "aos/dist/aos.css";
const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 200, 
      easing: "ease-in-out", 
    });
  }, []);
  return (
  <div className="relative-container noise-overlay min-h-screen flex flex-col">
    <Header />
    <div className=" pt-40 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="container mx-auto py-16 px-8 flex flex-col lg:flex-row " data-aos="fade-up">
        {/* Left Content */}
        <div className="lg:w-1/2 ">
          <h1 className="text-4xl lg:text-6xl font-bold">
            EXPLORE Exclusive STYLES WITHOUT Borders!
          </h1>
          <div className="mt-10">
            <a
              href="#shop"
              className=" text-black border-[0.5px] border-black py-2 px-6 rounded-full hover:bg-gray-700"
            >
                <span>TRY ON NOW</span>
                <BsArrowRight className="ml-2 inline-block text-2xl pb-1" />
            </a>
          </div>
          <div className="space-x-8 flex flex-col lg:flex-row mt-80">
            <div className="lg:w-1/2">
              <div className="bg-[#BFAF92] w-full h-[150px] shadow-md flex justify-center items-end">
                <img 
                  src={author}
                  alt="" 
                />
              </div>
            </div>
            <p className="lg:w-1/2 text-lg" style={{ fontFamily: "'Josefin Sans', serif" }}>
              Discover the latest trends that let you shine effortlessly.
            </p>
          </div>
        </div>
        {/* Right Image */}
        <div className="lg:w-1/2 mt-8 lg:mt-0  items-center">
          <img
            src={featurepic}
            alt="Hero Image"
            className=" w-full"
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto py-16 px-8 "  data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Section */}
          <div className="space-y-4">
            <img
              src={gallery1}
              alt="Gallery Item"
              className="w-full"
            />
            <div className="space-x-32 flex flex-col lg:flex-row">
              <h3 className="text-4xl font-karla font-bold leading-tight">Choose the best</h3>
              <p className="lg:w-1/2 text-xl font-Jsans text-gray-700">
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
                Nulla consequat massa quis enim.
              </p>
            </div>

          </div>

          {/* Right Section */}
          <div className="space-y-32">
            <h2 className="text-6xl font-bold font-kaisei leading-tight">
              Clothes <span className="italic font-light font-Jsans">your spirit</span> <br /> of
              Fashion
            </h2>
              <div className="relative w-[188px] h-[77px]"> 
                <a href="/store">
                  <button
                    className="absolute w-full h-full text-[#434237] bg-[#BFAF92] font-normal text-xl z-10 font-Jsans"
                  >
                    SHOP NOW
                  </button>
                </a>
                <div className="absolute w-full h-full border-2 border-[#434237] top-2 left-2 z-0"></div>
              </div>
            <div className=" grid grid-cols-2 gap-4">
              <img
                src={gallery2}
                alt="Item 1"
        
              />
              <img
                src={gallery3}
                alt="Item 2"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Featured Products Section */}
      <section className="container mx-auto py-16 px-8"  data-aos="fade-up">
        {/* Section Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10  items-center mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-5xl font-bold font-kaisei">
              Style up <span className="italic font-light font-Jsans">SEASON</span> without breaking
              <span className="italic font-light font-Jsans">  the bank!</span>
            </h2>
          </div>
          <div>
            <p className="font-Jsans text-base text-[#434237] font-medium">
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            </p>
          </div>
          <div className="flex flex-col items-center space-x-4 lg:col-span-2">
            <div className=" p-4  w-full h-[211px] flex items-center justify-center"
                style={{
                  backgroundImage: `url(${discount})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
            </div>
            <div>
              <p className="text-4xl font-karla text-[#353535] font-bold">take your discount</p>
              <p className="mt-2 font-Jsans text-base text-[#434237] font-medium">
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "NEW STREET STYLE",
              image: product1,
              description:
                "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
            },
            {
              title: "YOUR WINTER LOOK",
              image: product2,
              description:
                "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
            },
            {
              title: "EVERYDAY WEAR SUITABLE",
              image: product3,
              description:
                "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
            },
            {
              title: "OLD BUT GOLD",
              image: product4,
              description:
                "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
            },
          ].map((product, index) => (
            <div
              data-aos={index % 2 === 0 ? "fade-down" : "fade-up"}
              key={index}
              className={`space-y-2 text-center flex flex-col ${
                index % 2 === 1 ? "flex-col-reverse" : ""
              }`}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full"
    
              />
              <div className="space-y-4">
                <h3 className="text-2xl  text-black font-Jsans font-semibold">{product.title}</h3>
                <p className=" font-Jsans text-[#434237] text-base">{product.description}</p>
                <div>
                  <a
                    href="#shop"
                    className="text-base text-black font-Jsans font-bold  hover:text-gray-700"
                  >
                    SHOP NOW
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Contact Section */}
      <div id="contact" className="grid grid-cols-1  relative mt-10 z-0">
        <div className="w-full col-span-1">
          <Contact />
        </div>
      </div>
      <section className="border-t border-[#434237] mx-10 py-8 px-12 font-Jsans">
        <div className="container  text-left">
          <p className="text-[#434237] text-sm font-light leading-relaxed">
          1. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
          </p>
          <p className="text-[#434237] text-sm font-light leading-relaxed">
          2. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
          </p>
        </div>
      </section>
    </div>
    <Footer/>
  </div>
  );
};

export default Home;
