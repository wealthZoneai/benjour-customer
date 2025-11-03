import React, { useState } from "react";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../Redux/wishlistSlice";
import type { RootState } from "../../Redux/store";
import toast from "react-hot-toast";

interface GroceryProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  rating?: number;
  category: string;
  onViewDetails?: () => void;
}

const GroceryProductCard: React.FC<GroceryProductCardProps> = ({
  id,
  name,
  image,
  category,
  price,
  discount = 5,
  rating = 4,
  onViewDetails,
}) => {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();

  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlist.some((item) => item.id === id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
      toast("Removed from wishlist 💔");
    } else {
      dispatch(addToWishlist({ id, name, price, image, category }));
      toast.success("Added to wishlist ❤️");
    }
  };

  const handleAddToCart = () => {
    if (quantity < 1) {
      toast.error("Please select at least 1 item");
      return;
    }
    dispatch(addToCart({ id, name, image, price, quantity }));
    toast.success(`${name} added to your cart 🛒`);
  };

  return (
    <div className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
      {/* Subtle green glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

      {/* Discount Tag */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm z-10">
          -{discount}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 z-10 transition-all duration-300 ${
          isWishlisted
            ? "text-red-500 scale-110"
            : "text-gray-400 hover:text-red-400"
        }`}
      >
        <Heart
          size={18}
          className={isWishlisted ? "fill-red-500 text-red-500" : ""}
        />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info Section */}
      <div className="px-4 py-3 text-center">
        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
          {name}
        </h3>
        <p className="text-green-700 font-semibold mt-0.5 text-sm">
          ₹{price.toFixed(2)}
        </p>

        {/* Rating */}
        <div className="flex justify-center mt-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < rating ? "text-yellow-400" : "text-gray-300"}
            >
              ★
            </span>
          ))}
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex flex-col gap-2">
          <div
            className="
              flex flex-col sm:flex-row items-center justify-between 
              bg-gray-50 rounded-full px-3 py-2 
              gap-2 sm:gap-0 
              w-full
            "
          >
            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="bg-gray-100 border border-gray-200 p-1 rounded-full hover:bg-gray-200 transition-all"
              >
                <Minus size={12} className="text-green-700" />
              </button>
              <span className="text-sm font-medium w-4 text-center text-gray-800">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-100 border border-gray-200 p-1 rounded-full hover:bg-gray-200 transition-all"
              >
                <Plus size={12} className="text-green-700" />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="
                bg-gradient-to-r from-green-600 to-emerald-500 
                text-white text-[12px] font-semibold 
                px-4 py-1.5 rounded-full shadow-md 
                hover:from-green-700 hover:to-emerald-600 
                transition-all duration-300 
                flex items-center gap-1 justify-center 
                w-full sm:w-auto
              "
            >
              <ShoppingCart size={14} /> Add
            </button>
          </div>

          {/* Details Button */}
          <button
            onClick={onViewDetails}
            className="text-xs font-semibold text-green-700 hover:text-green-900 underline transition-all"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroceryProductCard;
