import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  tagline: string;
}

const mainCategories: Category[] = [
  {
    id: "groceries",
    name: "Groceries",
    imageUrl:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1920&q=80",
    tagline: "Freshly packed, perfectly delivered to your doorstep.",
  },
  {
    id: "alcohol",
    name: "Alcohol",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
    tagline: "Your favorite drinks, delivered chilled & fast.",
  },
];

const CategoriesScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (categoryId: string) => {
    // console.log("Navigating to:", categoryId); // 🧩 Debug log
    if (categoryId === "alcohol") {
      navigate("/alcohol");
    } else if (categoryId === "groceries") {
      navigate("/groceries");
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <div className="py-16 bg-linear-to-b from-white via-emerald-50/40 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Explore Our Categories
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Discover luxury essentials & curated lifestyle products.
          </p>
        </div>

        {/* Category Cards */}
        <div className="flex flex-wrap justify-center gap-10">
          {mainCategories.map((category) => (
            <div
              key={category.id}
              className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 ease-in-out w-[320px] sm:w-[390px]"
            >
              {/* Background Image */}
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-[230px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 z-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/60"></div>

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-6 text-white z-20">
                <h2 className="text-2xl font-extrabold mb-1">{category.name}</h2>
                <p className="text-sm font-light text-gray-200 mb-4">
                  {category.tagline}
                </p>

                {/* Shop Now Button */}
                <button
                  className="relative z-30 flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-md backdrop-blur-md hover:bg-white transition-all duration-300"
                  onClick={() => handleNavigate(category.id)}
                >
                  <span>Shop Now</span>
                  <FaArrowRight className="text-[12px]" />
                </button>
              </div>

              {/* Light Effect (below text, no click interference) */}
              <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_60%)]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;
