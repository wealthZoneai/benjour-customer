import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../Redux/store";
import { addToCart } from "../Redux/cartSlice";
import { addToWishlist, removeFromWishlist, clearWishlist } from "../Redux/wishlistSlice";
import { ShoppingCart, Plus, Minus, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getFavoriteItems, setFavoriteItem, AddToCart } from "../services/apiHelpers";

const Wishlist: React.FC = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  // Fetch favorite items from API on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getFavoriteItems();

        if (response?.data) {
          // Clear existing wishlist and populate with API data
          dispatch(clearWishlist());

          // Add each favorite item to Redux store
          response.data.forEach((item: any) => {
            dispatch(addToWishlist({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.imageUrl,
              category: item.category || "General",
              rating: item.rating || 4,
            }));
          });
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Failed to load wishlist items");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId, dispatch]);

  const handleAddToCart = async (item: any) => {
    if (!userId) {
      toast.error("Please login before adding items to cart");
      return;
    }

    const quantity = quantities[item.id] || 1;

    if (quantity < 1) {
      toast.error("Please select at least 1 item");
      return;
    }

    try {
      // Call backend API
      const response = await AddToCart(userId, item.id, quantity);

      if (!response || !response.data) {
        toast.error("Failed to add item to cart");
        return;
      }

      // Update Redux state
      dispatch(addToCart({ ...item, quantity }));
      toast.success(`${item.name} added to cart 🛒`);
    } catch (error) {
      console.error("Cart API Error:", error);
      toast.error("Something went wrong while adding item");
    }
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const toggleWishlist = async (item: any) => {
    if (!userId) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    const isWishlisted = wishlist.some((w) => w.id === item.id);
    const newFavoriteStatus = !isWishlisted;

    // Optimistic UI update
    if (isWishlisted) {
      dispatch(removeFromWishlist(item.id));
    } else {
      dispatch(addToWishlist(item));
    }

    try {
      // Call API to persist favorite status
      const response = await setFavoriteItem(item.id, newFavoriteStatus);

      if (!response || !response.data) {
        // Revert optimistic update on failure
        if (isWishlisted) {
          dispatch(addToWishlist(item));
        } else {
          dispatch(removeFromWishlist(item.id));
        }
        toast.error("Failed to update wishlist");
        return;
      }

      // Show success message
      if (newFavoriteStatus) {
        toast.success("Added to wishlist ❤️");
      } else {
        toast("Removed from wishlist 💔");
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);

      // Revert optimistic update on error
      if (isWishlisted) {
        dispatch(addToWishlist(item));
      } else {
        dispatch(removeFromWishlist(item.id));
      }

      toast.error("Something went wrong while updating wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="bg-white rounded-3xl p-12 shadow-lg">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={48} className="text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mb-6">
              Save your favorite items here and shop them later!
            </p>
            <button
              onClick={() => window.location.href = "/home"}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Heart className="text-red-500 fill-red-500" size={32} />
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
              </p>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white rounded-xl px-6 py-3 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Total Value</p>
                <p className="text-lg font-bold text-emerald-600">
                  ₹{wishlist.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((item, index) => {
              const quantity = quantities[item.id] || 1;
              const isWishlisted = wishlist.some((w) => w.id === item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
                    >
                      <Heart
                        size={20}
                        className={`${isWishlisted
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                          } transition-colors`}
                      />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <p className="text-xs font-medium text-gray-700">
                        {item.category || "General"}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < (item.rating || 4)
                              ? "text-yellow-400"
                              : "text-gray-300"
                            }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({item.rating || 4}.0)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <p className="text-2xl font-bold text-emerald-600">
                        ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-400 line-through">
                        ₹{(item.price * 1.2).toFixed(0)}
                      </p>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        17% OFF
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="flex-1 text-center font-semibold text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add All to Cart Button */}
        {wishlist.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={() => {
                wishlist.forEach(item => handleAddToCart(item));
              }}
              className="bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg flex items-center gap-3"
            >
              <ShoppingBag size={20} />
              Add All to Cart ({wishlist.length} items)
              <Sparkles size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
