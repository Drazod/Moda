import React, { useEffect, useState } from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa"; 
import axios from "axios";

const Footer = () => {
  const [contact, setContact] = useState({
    facebook: '',
    tiktok: '',
    youtube: '',
    instagram: '',
    phone_number: ''
  });
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchContact = async () => {
  //     try {
  //       const response = await axios.get('http://localhost/api/contact');
  //       if (response.status === 200 && response.data.success) {
  //         setContact(response.data.data[0]);
  //       }
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchContact();
  // }, []);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <footer className="bg-[#BFAF92] py-8 min-w-screen z-50 flex">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="flex justify-between">
          {/* Logo Section */}
          <div>
            <h2 className="text-3xl font-dancing font-semibold">
              Moda
            </h2>
            <p className="mt-2 text-gray-700">
              Get your precious time with <br /> favorite cake
            </p>
            <div className="flex flex-row space-x-4">
              <a
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl text-gray-600" />
              </a>
              <a
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-xl text-gray-600" />
              </a>
              <a
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                href={contact.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok className="text-xl text-gray-600" />
              </a>
              <a
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                href={contact.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube className="text-xl text-gray-600" />
              </a>
            </div>


            <p className="mt-6 text-gray-500 text-sm">
              Copyright 2023 YUMEOW, Inc. Terms & Privacy
              <p>Phone number: {contact.phone_number}</p>
            </p>

          </div>

          {/* Links Section */}
          <div className="flex space-x-16">
            {/* Blog Links */}
            <div>
              <h3 className="font-semibold text-gray-800">More on The Blog</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="/home#about"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/home#how-it-made"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    How It's Made
                  </a>
                </li>
                <li>
                  <a
                    href="/home#activities"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Activities
                  </a>
                </li>
              </ul>
            </div>
            {/* Other Links */}
            <div>
              <h3 className="font-semibold text-gray-800">Other Links</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

