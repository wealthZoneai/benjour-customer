import React, { useState } from "react";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";

interface ProductCardProps {
  image: string;
  title: string;
  category: string;
  price: number;
  discount?: number;
  rating?: number;
  onAddToCart?: () => void;
}

const GlassProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  category,
  price,
  discount = 10,
  rating = 4,
  onAddToCart,
}) => {
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm z-10">
          -{discount}%
        </div>
      )}

      {/* Wishlist / Heart */}
      <button
        onClick={() => setLiked(!liked)}
        className={`absolute top-3 right-3 z-10 transition-all duration-300 ${
          liked ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-400"
        }`}
      >
        <Heart
          size={18}
          className={liked ? "fill-red-500 text-red-500" : ""}
        />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-contain w-36 h-36 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="px-4 py-3 text-center">
        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
          {title}
        </h3>
        <p className="text-blue-700 font-semibold mt-0.5 text-sm">
          ${price.toFixed(2)}
        </p>

        {/* Rating */}
        <div className="flex justify-center mt-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          ))}
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex items-center justify-between bg-gray-50 rounded-full px-2.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-white border border-gray-200 p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              <Minus size={10} className="text-blue-700" />
            </button>
            <span className="text-xs font-medium w-4 text-center text-gray-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-white border border-gray-200 p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              <Plus size={10} className="text-blue-700" />
            </button>
          </div>

          <button
            onClick={onAddToCart}
            className="bg-linear-to-r from-blue-600 to-indigo-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md hover:from-blue-700 hover:to-indigo-600 transition-all duration-300 flex items-center gap-1"
          >
            <ShoppingCart size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlassProductCard;
