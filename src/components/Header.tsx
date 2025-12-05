// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { Search, Heart, ShoppingCart, User, X, Trash2, Package } from "lucide-react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, data } from "react-router-dom";
import {

  setCart,
} from "../Redux/cartSlice";
import type { RootState } from "../Redux/store";
import { motion, AnimatePresence } from "framer-motion";
import ShowCart from "./ShowCart";
import { getAddToCart } from "../services/apiHelpers";

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
  console.log(cart.length);
  const userId = useSelector((state: RootState) => state.user.userId);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    getCartCount();
  }, [showCart])

  async function getCartCount() {
    try {
      const response = await getAddToCart(userId);

      if (response.status === 200) {
        const cartData = response.data;

        const formattedItems = cartData.cartItems.map((cartItem: any) => ({
          id: cartItem.item.id,
          name: cartItem.item.name,
          price: cartItem.item.price,
          quantity: cartItem.quantity,
          image: cartItem.item.imageUrl,
        }));

        dispatch(setCart(formattedItems));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
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
      navigate('/home')
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
                className="ml-1 text-gray-400 hover:text-gray-600 transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="sm:hidden p-2 rounded-full bg-gray-100 hover:bg-green-50 transition"
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
            className="relative group p-2 rounded-full bg-gray-100 shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-300"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* My Orders */}
          <button
            onClick={() => navigate("/orders")}
            className="relative group p-2 rounded-full bg-gray-100 shadow-md hover:bg-blue-50 hover:scale-110 transition-all duration-300"
            aria-label="My Orders"
          >
            <Package className="w-5 h-5 text-gray-700 group-hover:text-blue-500 transition" />
          </button>

          {/* Cart */}
          <button
            className="relative group p-2 rounded-full bg-gray-100 shadow-md hover:bg-yellow-50 hover:scale-110 transition-all duration-300"
            onClick={() => setShowCart(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-yellow-500 transition" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded-full shadow-sm">
                {cart.length}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="group p-2 rounded-full bg-gray-100 shadow-md hover:bg-emerald-50 hover:scale-110 transition-all duration-300"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-gray-700 group-hover:text-emerald-500 transition" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden px-4 pb-3"
          >
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-green-400 transition-all duration-300">
              <button
                onClick={handleSearch}
                className="text-gray-500 hover:text-green-600 transition"
                aria-label="Search mobile"
              >
                <Search className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="bg-transparent outline-none ml-2 text-sm text-gray-700 w-full"
              />

              {query && (
                <button
                  onClick={clearSearch}
                  className="ml-1 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Clear mobile search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
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
