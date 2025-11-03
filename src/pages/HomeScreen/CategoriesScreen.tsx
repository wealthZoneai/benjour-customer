import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CategoriesScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-white to-white px-5 md:px-10 py-8">
      {/* 🔹 Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
        Categories
      </h1>

      {/* 🔹 Responsive Section */}
      <div className="flex justify-center w-full">
        <div className="relative w-full max-w-7xl h-auto md:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
          {/* ✅ Desktop Layout (hidden on mobile) */}
          <div className="hidden md:block w-full h-full relative">
            {/* 🥦 Groceries Section */}
            <div className="absolute inset-0 [clip-path:polygon(0_0,70%_0,70%_100%,0_100%)] group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1920&q=80"
                alt="Groceries"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent group-hover:opacity-80 transition-all duration-500"></div>

              <div className="absolute top-6 left-6 text-white z-10">
                <h2 className="text-3xl font-bold mb-2 ">Groceries</h2>
                <p className="text-sm text-gray-200 mb-3 max-w-xs">
                  Freshly packed, perfectly delivered to your doorstep.
                </p>
                <button
                  onClick={() => handleNavigate("/groceries")}
                  className="flex items-center gap-2 bg-white/90 text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all"
                >
                  Shop Now <FaArrowRight className="text-[12px]" />
                </button>
              </div>
            </div>

            {/* 🍷 Alcohol Section */}
            <div className="absolute inset-0 [clip-path:polygon(30%_0,100%_0,100%_100%,70%_100%)] group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1920&q=80"
                alt="Alcohol"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:opacity-80 transition-all duration-500"></div>

              <div className="absolute bottom-6 right-6 text-white text-right z-10">
                <h2 className="text-3xl font-bold mb-2">Alcohol</h2>
                <p className="text-sm text-gray-200 mb-3 max-w-xs">
                  Your favorite drinks, delivered chilled & fast.
                </p>
                <button
                  onClick={() => handleNavigate("/alcohol")}
                  className="flex items-center gap-2 bg-white/90 text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all ml-auto"
                >
                  Shop Now <FaArrowRight className="text-[12px]" />
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Mobile Layout (stacked) */}
          <div className="flex flex-col gap-6 md:hidden">
            {/* 🥦 Groceries */}
            <div
              onClick={() => handleNavigate("/groceries")}
              className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80"
                alt="Groceries"
                className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:opacity-80 transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold mb-1">Groceries</h2>
                <button className="flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white transition-all">
                  Shop Now <FaArrowRight className="text-[12px]" />
                </button>
              </div>
            </div>

            {/* 🍷 Alcohol */}
            <div
              onClick={() => handleNavigate("/alcohol")}
              className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80"
                alt="Alcohol"
                className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:opacity-80 transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold mb-1">Alcohol</h2>
                <button className="flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white transition-all">
                  Shop Now <FaArrowRight className="text-[12px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;
