import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Elegant background accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,_#34d399,_transparent_50%)]"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-3xl font-extrabold text-white flex items-center">
              <span className="bg-white text-emerald-600 p-2.5 rounded-xl mr-3 shadow-md">🍽️</span>
              <span className="tracking-tight">Benjour</span>
            </h3>
            <p className="text-emerald-100 leading-relaxed text-sm sm:text-base">
              Delivering culinary excellence straight to your doorstep. Fresh
              ingredients, authentic flavors, and the joy of dining redefined.
            </p>
            <div className="flex space-x-4 pt-3">
              {[
                { icon: FaFacebook, link: "#" },
                { icon: FaTwitter, link: "#" },
                { icon: FaInstagram, link: "#" },
                { icon: FaLinkedin, link: "#" },
              ].map(({ icon: Icon, link }, i) => (
                <a
                  key={i}
                  href={link}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <Icon size={18} className="text-emerald-200 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-emerald-700 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "Menu", "About Us", "Contact", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center text-emerald-100 hover:text-white transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-emerald-700 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm sm:text-base">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-emerald-300 mt-1 mr-3 flex-shrink-0" />
                <span className="text-emerald-100">
                  123 Gourmet Street, Foodie City, FC 12345
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-emerald-300 mr-3" />
                <a
                  href="tel:+1234567890"
                  className="text-emerald-100 hover:text-white transition-colors duration-300"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-emerald-300 mr-3" />
                <a
                  href="mailto:hello@benjour.com"
                  className="text-emerald-100 hover:text-white transition-colors duration-300"
                >
                  hello@benjour.com
                </a>
              </li>
              <li className="flex items-center">
                <FaClock className="text-emerald-300 mr-3" />
                <span className="text-emerald-100">
                  Mon–Sun: 8:00 AM – 11:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-emerald-700 inline-block">
              Newsletter
            </h4>
            <p className="text-emerald-100 mb-4 text-sm sm:text-base">
              Join our foodie circle for exclusive offers & chef’s specials.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg bg-emerald-950 border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-emerald-300"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-950 hover:from-emerald-300 hover:to-emerald-400 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-emerald-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-emerald-300 text-sm tracking-wide">
            &copy; {currentYear} <span className="font-semibold text-white">Benjour</span>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-emerald-300 hover:text-white transition-all duration-300 hover:underline underline-offset-4"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
