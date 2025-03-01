import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 px-8 ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-lg">

        {/* About Section */}
        <div className="max-sm:text-left">
          <h2 className="text-3xl font-bold text-red-600">Brick & Beams</h2>
          <p className="text-gray-400 mt-4 leading-relaxed">
            Your trusted partner in buying, selling, and renting properties.
            We make real estate transactions easy and hassle-free.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center max-sm:text-left">
          <h3 className="text-2xl font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <Link to="/" className="hover:text-red-600 transition" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/AboutPage" className="hover:text-red-600 transition" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/propertyPage" className="hover:text-red-600 transition" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Properties
              </Link>
            </li>
            <li>
              <Link to="/Contact" className="hover:text-red-600 transition" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-right max-sm:text-left">
          <h3 className="text-2xl font-semibold">Contact Us</h3>
          <p className="text-gray-400 mt-4">📍 123 Real Estate St, City, Country</p>
          <p className="text-gray-400 mt-2">📞 +1 234 567 890</p>
          <p className="text-gray-400 mt-2">📧 support@brickandbeams.com</p>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center">
        <div className="flex justify-center space-x-6 text-2xl">
          <a href="#" className="hover:text-red-600 transition">🐦</a>
          <a href="#" className="hover:text-red-600 transition">📘</a>
          <a href="#" className="hover:text-red-600 transition">📸</a>
          <a href="#" className="hover:text-red-600 transition">🔗</a>
        </div>
        <p className="text-gray-500 text-lg mt-4">
          © {new Date().getFullYear()} Brick & Beams. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
