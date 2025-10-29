import React, { useState } from "react";
import { FaPlus, FaMinus, FaHeart } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface Props {
  name: string;
  price: number;
  image: string;
  discount?: number;
  rating?: number;
}

const ProductCard: React.FC<Props> = ({
  name,
  price,
  image,
  discount = 10,
  rating = 4,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
      {/* Glow on Hover */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm z-10">
          -{discount}%
        </div>
      )}

      {/* Wishlist Icon */}
      <button
        onClick={() => setLiked(!liked)}
        className={`absolute top-3 right-3 text-lg transition-all duration-300 z-10 ${
          liked ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-400"
        }`}
      >
        <FaHeart />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="px-4 py-3 text-center">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
          {name}
        </h3>
        <p className="text-green-700 font-medium mt-0.5 text-sm">
          ${price.toFixed(2)}
        </p>

        {/* Rating */}
        <div className="flex justify-center mt-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) =>
            i < rating ? (
              <AiFillStar key={i} className="text-yellow-400" />
            ) : (
              <AiOutlineStar key={i} className="text-gray-300" />
            )
          )}
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex items-center justify-between bg-gray-50 rounded-full px-2.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-white border border-gray-200 p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              <FaMinus size={9} className="text-green-700" />
            </button>
            <span className="text-xs font-medium w-4 text-center text-gray-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-white border border-gray-200 p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              <FaPlus size={9} className="text-green-700" />
            </button>
          </div>

          <button className="bg-linear-to-r from-green-600 to-emerald-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md hover:from-green-700 hover:to-emerald-600 transition-all duration-300">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
