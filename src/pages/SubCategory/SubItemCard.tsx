import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart, Plus, Minus, Star, Sparkles, Ban } from "lucide-react";
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
  minValue?: number;
  maxValue?: number;
  unitType?: string;
  stock?: number;
  onViewDetails?: () => void;
}

const SubItemCard: React.FC<GroceryProductCardProps> = ({
  id,
  name,
  image,
  category,
  price,
  discount = 0,
  rating = 4,
  minValue = 1,
  maxValue = 50,
  unitType = "PIECE",
  stock = 100, // Default to 100 if not provided, or handle as infinite? Better to have a safe default.
  onViewDetails,
}) => {
  // Determine if using decimal units (e.g. Kg, L)
  const isDecimalUnit = ["KILOGRAM", "LITRE", "GRAM", "MILLILITER", "KG", "L", "G", "ML"].includes(unitType.toUpperCase());

  // Logic for Step & Min/Max
  // If no minValue is provided for decimal units, default to 0.5.
  const safeMinValue = minValue > 0 ? minValue : (isDecimalUnit ? 0.5 : 1);
  const step = isDecimalUnit ? safeMinValue : 1;
  const maxLimit = Math.min(maxValue || 50, stock);

  const [quantity, setQuantity] = useState(safeMinValue);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const userId = useSelector((state: RootState) => state.user.userId);
  const isWishlisted = wishlist.some((item) => item.id === id);

  // Reset quantity if props change significantly
  useEffect(() => {
    setQuantity(safeMinValue);
  }, [id, safeMinValue]);

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
      const response = await setFavoriteItem(id, newFavoriteStatus, userId);

      if (!response || !response.data) {
        if (isWishlisted) dispatch(addToWishlist({ id, name, price, image, category }));
        else dispatch(removeFromWishlist(id));

        toast.error("Failed to update wishlist");
        return;
      }

      newFavoriteStatus
        ? toast.success("Added to wishlist ❤️")
        : toast("Removed from wishlist 💔");
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

  const updateQuantity = (newQty: number) => {
    // Round to 2 decimals to avoid floating point errors
    const roundedQty = Math.round(newQty * 100) / 100;

    if (roundedQty < safeMinValue) return;
    if (roundedQty > maxLimit) {
      toast.error(`Maximum limit is ${maxLimit} ${unitLabel}`);
      return;
    }
    setQuantity(roundedQty);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please login before adding items to cart");
      return;
    }

    if (stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} ${unitLabel} available in stock`);
      return;
    }

    setIsAdding(true);

    try {
      const response = await AddToCart(userId, id, quantity);

      if (!response || !response.data) {
        toast.error("Failed to add item to cart");
        return;
      }

      const cartItem = response.data.cartItems.find(
        (ci: any) => ci.item.id === id
      );

      if (!cartItem) {
        // Fallback if not found in response immediately (rare)
        toast.success(`${name} added to cart 🛒`);
      } else {
        dispatch(addToCart({ cartItemId: cartItem.id, id, name, image, price, quantity, discount, minValue, maxValue, unitType }));
        toast.success(`${name} added to cart 🛒`);
      }
    } catch (error) {
      console.error("Cart API Error:", error);
      toast.error("Something went wrong while adding item");
    } finally {
      setIsAdding(false);
    }
  };

  const originalPrice = (price / (1 - discount / 100));
  const finalPrice = price * quantity;
  const finalOriginalPrice = originalPrice * quantity;

  const unitLabel = unitType
    .replace("LITRE", "L")
    .replace("MILLILITER", "ml")
    .replace("KILOGRAM", "kg")
    .replace("GRAM", "g")
    .replace("PIECE", "pc")
    .replace("PACKET", "pkt")
    || "";

  const isOutOfStock = stock <= 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

      {/* Discount Badge */}
      {discount > 0 && !isOutOfStock && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1">
          <Sparkles size={12} />
          {discount}% OFF
        </div>
      )}

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 bg-gray-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1">
          <Ban size={12} />
          Out of Stock
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          size={18}
          className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
            } transition-colors`}
        />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-50 shrink-0">
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">

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
              className={`${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating})</span>
        </div>

        {/* Dynamic Price */}
        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-xl font-bold text-emerald-600">
            ₹{finalPrice.toFixed(2)}
          </span>

          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{finalOriginalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* DYNAMIC QUANTITY SELECTOR */}
        {!isOutOfStock ? (
          <div className="flex items-center justify-between mb-4 bg-emerald-50 py-2 px-3 rounded-xl">

            {/* Minus */}
            <button
              onClick={() => updateQuantity(quantity - step)}
              disabled={quantity <= safeMinValue}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
              ${quantity <= safeMinValue
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-100"
                }`}
            >
              <Minus size={14} />
            </button>

            {/* Quantity Display */}
            <span className="text-md font-semibold text-gray-800 tabular-nums">
              {quantity} {unitLabel}
            </span>

            {/* Plus */}
            <button
              onClick={() => updateQuantity(quantity + step)}
              disabled={quantity >= maxLimit}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
              ${quantity >= maxLimit
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-100"
                }`}
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <div className="mb-4 py-2 px-3 rounded-xl bg-gray-100 text-center text-gray-500 text-sm font-medium">
            Currently Unavailable
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className={`w-full py-2.5 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2
             ${isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg'
            }
             disabled:opacity-80
          `}
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
              {isOutOfStock ? <Ban size={16} /> : <ShoppingCart size={16} />}
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </button>

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
