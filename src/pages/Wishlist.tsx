import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../Redux/store";
import { addToCart } from "../Redux/cartSlice";
import { addToWishlist, removeFromWishlist, clearWishlist } from "../Redux/wishlistSlice";
import { ShoppingCart, Plus, Minus, Heart } from "lucide-react";
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
      [id]: Math.max(0, (prev[id] || 0) + delta),
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your wishlist is empty 💔
          </h2>
          <p className="text-gray-500">Start adding some favorites!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24 pb-12 px-4 flex flex-col items-center">
      <div className="max-w-6xl w-full">
        {/* ❤️ Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-10 flex items-center gap-2 justify-center">
          <span className="text-red-500">❤️</span> My Wishlist
        </h1>

        {/* 🧩 Product Grid */}
        <div
          className="
            grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 
            gap-[6px] justify-items-center 
            place-items-center
          "
        >
          {wishlist.map((item) => {
            const quantity = quantities[item.id] || 0;
            const isWishlisted = wishlist.some((w) => w.id === item.id);

            return (
              <div
                key={item.id}
                className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out w-full max-w-[260px] h-[370px] flex flex-col"
              >
                {/* ❤️ Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(item)}
                  className={`absolute top-3 right-3 z-10 transition-all duration-300 ${isWishlisted
                    ? "text-red-500 scale-110"
                    : "text-gray-400 hover:text-red-400"
                    }`}
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                  />
                </button>

                {/* Image */}
                <div className="relative w-full h-[150px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="px-4 py-3 text-center flex flex-col justify-between flex-grow">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                      {item.category || "General"}
                    </p>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-blue-700 font-semibold mt-0.5 text-sm">
                      ₹{item.price}
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center mt-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < (item.rating || 4)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between bg-gray-50 rounded-full px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="bg-white border border-gray-200 p-1 rounded-full hover:bg-gray-100 transition-all"
                        >
                          <Minus size={10} className="text-blue-700" />
                        </button>
                        <span className="text-xs font-medium w-4 text-center text-gray-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="bg-white border border-gray-200 p-1 rounded-full hover:bg-gray-100 transition-all"
                        >
                          <Plus size={10} className="text-blue-700" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-linear-to-r from-blue-600 to-indigo-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md hover:from-blue-700 hover:to-indigo-600 transition-all duration-300 flex items-center gap-1"
                      >
                        <ShoppingCart size={12} /> Add
                      </button>
                    </div>

                    <button
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline transition-all"
                      onClick={() => toast("Coming soon — product details!")}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
