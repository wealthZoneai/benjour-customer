import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../Redux/store";
import { addToCart } from "../Redux/cartSlice";
import { addToWishlist, clearWishlist } from "../Redux/wishlistSlice";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getFavoriteItems, AddToCart } from "../services/apiHelpers";
import SubItemCard from "./SubCategory/SubItemCard";

const Wishlist: React.FC = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();
  const [quantities, ] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  // Fetch favorite items from API on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getFavoriteItems(userId);

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

  // const handleQuantityChange = (id: number, delta: number) => {
  //   setQuantities((prev) => ({
  //     ...prev,
  //     [id]: Math.max(1, (prev[id] || 1) + delta),
  //   }));
  // };

  // const toggleWishlist = async (item: any) => {
  //   if (!userId) {
  //     toast.error("Please login to manage your wishlist");
  //     return;
  //   }

  //   const isWishlisted = wishlist.some((w) => w.id === item.id);
  //   const newFavoriteStatus = !isWishlisted;

  //   // Optimistic UI update
  //   if (isWishlisted) {
  //     dispatch(removeFromWishlist(item.id));
  //   } else {
  //     dispatch(addToWishlist(item));
  //   }

  //   try {
  //     // Call API to persist favorite status
  //     const response = await setFavoriteItem(item.id, newFavoriteStatus, userId);

  //     if (!response || !response.data) {
  //       // Revert optimistic update on failure
  //       if (isWishlisted) {
  //         dispatch(addToWishlist(item));
  //       } else {
  //         dispatch(removeFromWishlist(item.id));
  //       }
  //       toast.error("Failed to update wishlist");
  //       return;
  //     }

  //     // Show success message
  //     if (newFavoriteStatus) {
  //       toast.success("Added to wishlist ❤️");
  //     } else {
  //       toast("Removed from wishlist 💔");
  //     }
  //   } catch (error) {
  //     console.error("Wishlist API Error:", error);

  //     // Revert optimistic update on error
  //     if (isWishlisted) {
  //       dispatch(addToWishlist(item));
  //     } else {
  //       dispatch(removeFromWishlist(item.id));
  //     }

  //     toast.error("Something went wrong while updating wishlist");
  //   }
  // };

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
              // const quantity = quantities[item.id] || 1;
              // const isWishlisted = wishlist.some((w) => w.id === item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <SubItemCard
                    id={item?.id}
                    name={item?.name}
                    category={item?.category}
                    price={item?.price}
                    image={item?.image}
                    discount={item?.discount}
                    rating={item?.rating}
                    minValue={item?.minValue}
                    maxValue={item?.maxValue}
                    // stepValue={item?.stepValue}
                    unitType={item?.unitType}
                  />
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
