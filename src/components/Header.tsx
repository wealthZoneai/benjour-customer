// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { Search, Heart, ShoppingCart, User, X, Package } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCart } from "../Redux/cartSlice";
import { setWishlist } from "../Redux/wishlistSlice";
import type { RootState } from "../Redux/store";
import { motion, AnimatePresence } from "framer-motion";
import ShowCart from "./ShowCart";
import { getAddToCart, getFavoriteItems } from "../services/apiHelpers";

interface HeaderProps {
  onSearchChange?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart.items);
  const userId = useSelector((state: RootState) => state.user.userId);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Initial Fetch on Login / Application Load
  useEffect(() => {
    if (userId) {
      getCartCount();
      getAllWishlist();
    }
  }, [userId]);

  // Refresh cart when opened
  useEffect(() => {
    if (showCart && userId) {
      getCartCount();
    }
  }, [showCart]);

  async function getCartCount() {
    if (!userId) return;
    try {
      const response = await getAddToCart(userId);

      if (response.status === 200) {
        const cartData = response.data;
        // Handle potentially different response structures
        const items = cartData.cartItems || (Array.isArray(cartData) ? cartData : []);

        const formattedItems = items.map((cartItem: any) => ({
          id: cartItem.item.id,
          name: cartItem.item.name,
          price: cartItem.item.price,
          quantity: cartItem.quantity,
          image: cartItem.item.imageUrl || cartItem.item.image,
        }));

        dispatch(setCart(formattedItems));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }

  async function getAllWishlist() {
    if (!userId) return;
    try {
      const response = await getFavoriteItems();
      if (response.data) {
        // Handle response.data being the array or wrapped
        const wishlistData = Array.isArray(response.data) ? response.data : (response.data.items || []);

        const formattedWishlist = wishlistData.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: item.imageUrl || item.image,
          price: item.price,
          category: item.category || "",
          rating: item.rating
        }));
        dispatch(setWishlist(formattedWishlist));
      }
    } catch (error) {
      // console.error("Error loading wishlist:", error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length >= 2) {
      if (onSearchChange) onSearchChange(value.trim());
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      setShowSearch(false);
    } else if (value.trim().length === 0) {
      setShowSearch(true);
      navigate("/home");
    }
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSearchChange) onSearchChange(trimmed);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setShowSearch(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (onSearchChange) onSearchChange("");

    if (location.pathname === "/search") {
      navigate("/home");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3">
          {/* Logo */}
          <div
          className="text-2xl sm:text-3xl font-extrabold cursor-pointer"
            onClick={() => navigate("/home")}
            role="button"
          >
          🍹 MyStore
          </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar (Desktop) */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-2 w-[220px] sm:w-[300px] shadow-inner focus-within:ring-2 focus-within:ring-green-400 transition-all duration-300">
            <button
              onClick={handleSearch}
              className="text-gray-500 hover:text-green-600 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
              placeholder="Search your favorite..."
              className="bg-transparent outline-none ml-2 text-sm text-gray-700 w-full"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition"
              onClick={() => setShowSearch((s) => !s)}
              aria-label="Toggle search"
            >
              {showSearch ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Search className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2.5 rounded-xl hover:bg-red-50 transition group"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* My Orders */}
            <button
              onClick={() => navigate("/orders")}
              className="relative p-2.5 rounded-xl hover:bg-blue-50 transition group"
              aria-label="My Orders"
            >
              <Package className="w-5 h-5 text-gray-700 group-hover:text-blue-500 transition" />
            </button>

            {/* Cart */}
            <button
              className="relative p-2.5 rounded-xl hover:bg-emerald-50 transition group"
              onClick={() => setShowCart(true)}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-emerald-500 transition" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate("/profile")}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition group"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-200 bg-gray-50"
          >
            <div className="px-4 py-3">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-emerald-500 transition-all">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for products..."
                  className="bg-transparent outline-none ml-3 text-sm text-gray-700 w-full placeholder-gray-400"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Clear mobile search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <ShowCart
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        totalPrice={totalPrice}
        cartCount={cartCount}
      />
    </header>
  );
};

export default Header;
