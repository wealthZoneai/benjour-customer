import React from "react";
import { Wine, Flame, Grape } from "lucide-react";
// import wineglass from "../../assets/Glass.jpg"; // ✅ update this path if needed

const BrandSection: React.FC = () => {
  return (
    <section className="w-full mx-auto bg-white   ">
      {/* Header */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2  mx-13 py-2 px-8">
        Popular Brand Section
      </h2>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row justify-center px-6   ">
        {/* Left - Image */}
        <div className="md:w-1/2 w-full flex justify-center items-center overflow-hidden  ">
          <div className="relative w-full md:w-[100%] h-[320px] md:h-[400px]  ">
            <img
              // src={wineglass}
              alt="Wine glass"
              className="w-full h-full object-cover transform scale-100 transition-transform duration-500 hover:scale-110"
            />
          </div>
        </div>

        {/* Right - Content */}
        <div className="md:w-1/2 w-full bg-[#fdf3f3]  md:p-12   md:text-left overflow-hidden  ">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Premium & Elegant
            <span className="block w-20 h-1 mt-2 bg-rose-500 rounded-full mx-auto md:mx-0"></span>
          </h3>

          <p className="text-gray-700 text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            Discover the world of wine — from bold reds to refreshing whites,
            every bottle carries a story of taste, aroma, and celebration.
            Explore, sip, and find the flavor that speaks to you.
          </p>

          {/* Icons Section */}
          <div className="flex justify-center md:justify-start gap-8 md:gap-10">
            {/* Wine glass */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <div className="bg-rose-100 p-4 rounded-full mb-3 shadow-sm">
                <Wine className="text-rose-600 w-7 h-7" />
              </div>
              <p className="text-gray-800 font-semibold text-sm">Wine glass</p>
            </div>

            {/* Fine smell */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <div className="bg-rose-100 p-4 rounded-full mb-3 shadow-sm">
                <Flame className="text-rose-600 w-7 h-7" />
              </div>
              <p className="text-gray-800 font-semibold text-sm">Fine smell</p>
            </div>

            {/* Unique sorts */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <div className="bg-rose-100 p-4 rounded-full mb-3 shadow-sm">
                <Grape className="text-rose-600 w-7 h-7" />
              </div>
              <p className="text-gray-800 font-semibold text-sm">Unique sorts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
