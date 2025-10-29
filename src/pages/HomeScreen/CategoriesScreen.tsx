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
    id: "alcohol",
    name: "Alcohol",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
    tagline: "Your favorite drinks, delivered chilled & fast.",
  },
  {
    id: "groceries",
    name: "Groceries",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
    tagline: "Freshly packed, perfectly delivered to your doorstep.",
  },
];

const CategoriesScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // e.stopPropagation();
    console.log(`Navigating to  category`);
    // navigate("/groceries");
    // if (data === "Alcohol") {
    //   navigate("/alcohol");
    // } else if (data === "Groceries") {
    //   navigate("/groceries");
    // }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white via-emerald-50/40 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Explore Our Categories
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Discover luxury essentials & curated lifestyle products.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {mainCategories.map((category) => (
            <div
              key={category.id}
              className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 ease-in-out w-[320px] sm:w-[390px]"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-[230px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/60"></div>

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h2 className="text-2xl font-extrabold mb-1">{category.name}</h2>
                <p className="text-sm font-light text-gray-200 mb-4">
                  {category.tagline}
                </p>

                
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.1),_transparent_60%)]"></div>
              <button
                  className="flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-md backdrop-blur-md hover:bg-white transition-all duration-300"
                  onClick={ () => navigate("/groceries") }
                >
                  <span>Shop Now</span>
                  <FaArrowRight className="text-[12px]" />
                </button>
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;
