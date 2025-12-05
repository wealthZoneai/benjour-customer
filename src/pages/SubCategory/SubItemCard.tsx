import React from "react";
import { Heart, ShoppingCart, Plus, Minus, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../Redux/wishlistSlice";
import type { RootState } from "../../Redux/store";
import toast from "react-hot-toast";
import { AddToCart, setFavoriteItem } from "../../services/apiHelpers";

interface GroceryProductCardProps {
  id: any;
  name: string;
  price: number;
  image: string;
  discount?: number;
  rating?: number;
  category: string;
  isFavorite?: boolean;
  onViewDetails?: () => void;
}

const SubItemCard: React.FC<GroceryProductCardProps> = ({
  id,
  name,
  image,
  category,
  price,
  discount = 5,
  rating = 4,
  isFavorite,
  onViewDetails,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);
  const dispatch = useDispatch();

  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const userId = useSelector((state: RootState) => state.user.userId);
  const isWishlisted = wishlist.some((item) => item.id === id);

  const toggleWishlist = async () => {
    if (!userId) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    const newFavoriteStatus = !isWishlisted;

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist({ id, name, price, image, category }));
    }

    try {
      const response = await setFavoriteItem(id, newFavoriteStatus);

      if (!response || !response.data) {
        if (isWishlisted) {
          dispatch(addToWishlist({ id, name, price, image, category }));
        } else {
          dispatch(removeFromWishlist(id));
        }
        toast.error("Failed to update wishlist");
        return;
      }

      if (newFavoriteStatus) {
        toast.success("Added to wishlist ❤️");
      } else {
        toast("Removed from wishlist 💔");
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);

      if (isWishlisted) {
        dispatch(addToWishlist({ id, name, price, image, category }));
      } else {
        dispatch(removeFromWishlist(id));
      }

      toast.error("Something went wrong while updating wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please login before adding items to cart");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select at least 1 item");
      return;
    }

    setIsAdding(true);

    try {
      const response = await AddToCart(userId, id, quantity);

      if (!response || !response.data) {
        toast.error("Failed to add item to cart");
        return;
      }

      dispatch(addToCart({ id, name, image, price, quantity }));
      toast.success(`${name} added to cart 🛒`);
      setQuantity(1);
    } catch (error) {
      console.error("Cart API Error:", error);
      toast.error("Something went wrong while adding item");
    } finally {
      setIsAdding(false);
    }
  };

  const originalPrice = (price / (1 - discount / 100)).toFixed(0);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1">
          <Sparkles size={12} />
          {discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          size={18}
          className={`${isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-400"
            } transition-colors`}
        />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {/* <div className="mb-2">
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {category}
          </span>
        </div> */}

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
                }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating}.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-emerald-600">₹{price}</span>
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="flex-1 text-center font-semibold text-gray-800">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2.5 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>

        {/* View Details */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 underline transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SubItemCard;
