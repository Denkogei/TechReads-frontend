import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-10 py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Logo and Tagline */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600">TechReads</h2>
          <p className="text-sm mt-2 text-gray-600">
            Empowering Kenyan Minds, One Book at a Time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-900">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {["Home", "Browse Books", "About Us", "Contact"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-blue-600 transition-colors duration-300">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="font-semibold text-gray-900">Get in Touch</h3>
          <p className="text-sm mt-3">
            Email:{" "}
            <a href="mailto:support@techreads.co.ke" className="text-blue-600 font-medium">
              support@techreads.co.ke
            </a>
          </p>
          <p className="text-sm">Phone: +254 712 345 678</p>

          <div className="mt-4 flex justify-center md:justify-start space-x-4">
            <a href="#" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 mt-8 border-t pt-4">
        &copy; {new Date().getFullYear()} TechReads. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
