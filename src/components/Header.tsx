import React, { useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  X,
  Trash2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, clearCart } from "../Redux/cartSlice";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: any) => state.cart.items);
  const cartCount = cart.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );
  const totalPrice = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearchChange(value);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Logo */}
        <div
          className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          🍹 MyStore
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar (Desktop) */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-2 w-[220px] sm:w-[280px] shadow-inner focus-within:ring-2 focus-within:ring-green-400 transition-all duration-300">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search your favorite..."
              className="bg-transparent outline-none ml-2 text-sm text-gray-700 w-full"
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="sm:hidden p-2 rounded-full bg-gray-100 hover:bg-green-50 transition"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Search className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Favorite */}
          <button className="relative group p-2 rounded-full bg-gray-100 shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-300">
            <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full shadow-sm">
              2
            </span>
          </button>

          {/* 🛒 Cart — Opens Animated Drawer */}
          <button
            className="relative group p-2 rounded-full bg-gray-100 shadow-md hover:bg-yellow-50 hover:scale-110 transition-all duration-300"
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-yellow-500 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button className="group p-2 rounded-full bg-gray-100 shadow-md hover:bg-emerald-50 hover:scale-110 transition-all duration-300">
            <User className="w-5 h-5 text-gray-700 group-hover:text-emerald-500 transition" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="sm:hidden px-4 pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-green-400 transition-all duration-300">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search..."
              className="bg-transparent outline-none ml-2 text-sm text-gray-700 w-full"
            />
          </div>
        </div>
      )}

      {/* 🧾 Cart Modal with Slide Animation */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">
                    Your cart is empty 🛒
                  </p>
                ) : (
                  cart.map((item: any) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="flex items-center justify-between mb-4 border-b pb-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1 ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t p-4"
                >
                  <div className="flex justify-between text-sm font-semibold text-gray-800 mb-3">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-md mb-2 hover:bg-gray-200 transition"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => alert('Proceed to checkout')}
                    className="w-full bg-linear-to-r from-green-600 to-emerald-500 text-white py-2 rounded-md hover:from-green-700 hover:to-emerald-600 transition"
                  >
                    Checkout
                  </button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
