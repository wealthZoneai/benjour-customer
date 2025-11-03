import React, { useState } from "react";
import { Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  category: "top" | "best";
}

const fallbackImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80";

const productData: Product[] = [
  {
    id: 1,
    name: "Rose Wine",
    image:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 1,
    category: "top",
  },
  {
    id: 2,
    name: "Honey Beer",
    image:
      "https://images.unsplash.com/photo-1542959863-3f384b6b1624?auto=format&fit=crop&w=800&q=60",
    rating: 4,
    reviews: 1,
    category: "best",
  },
  {
    id: 3,
    name: "Barley Vodka",
    image:
      "https://images.unsplash.com/photo-1590080875832-8405c0b4c44e?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 1,
    category: "top",
  },
  {
    id: 4,
    name: "Brazilian Rum",
    image:
      "https://images.unsplash.com/photo-1610911254767-40f1e01ac8d0?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 1,
    category: "best",
  },
  {
    id: 5,
    name: "Dessert Tequila",
    image:
      "https://images.unsplash.com/photo-1610641818989-77cf0b4574d6?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 1,
    category: "top",
  },
  {
    id: 6,
    name: "Premium Vodka",
    image:
      "https://parisdrinksguide.com/cont/blog/imagePot/08312021084700000000-612e32d4e5217.jpg",
    rating: 5,
    reviews: 1,
    category: "best",
  },
];

const ImageWithLoader: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-full h-[320px] overflow-hidden rounded-t-2xl bg-gray-200">
      {/* Gradient Loader */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={isError ? fallbackImage : src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        className={`w-full h-full object-cover transform transition-transform duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } hover:scale-110`}
      />
    </div>
  );
};

const TopRating: React.FC = () => {
  const [filter, setFilter] = useState<"top" | "best">("top");

  const filteredProducts = productData.filter(
    (product) => product.category === filter
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Filter Buttons */}
      <div className="flex justify-center mb-10 space-x-4">
        {["top", "best"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as "top" | "best")}
            className={`px-6 py-2 border border-yellow-500 font-semibold text-sm  transition-all duration-300 ${
              filter === type
                ? "bg-yellow-500 text-white shadow-md scale-105"
                : "text-yellow-600 hover:bg-yellow-100"
            }`}
          >
            {type === "top" ? "TOP RATING" : "BEST SELLING"}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="flex flex-wrap justify-center gap-10">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 w-[380px] overflow-hidden"
          >
            {/* Image */}
            <ImageWithLoader src={item.image} alt={item.name} />

            {/* Content */}
            <div className="p-5 text-center transition-transform duration-500 group-hover:-translate-y-1">
              {/* Star Rating */}
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < item.rating ? "#FFD700" : "none"}
                    stroke={i < item.rating ? "#FFD700" : "#ccc"}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  ({item.reviews} review)
                </span>
              </div>

              {/* Product Name */}
              <h3 className="text-gray-900 font-semibold text-lg transition-all duration-300 group-hover:text-yellow-500 group-hover:-translate-y-1">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopRating;
