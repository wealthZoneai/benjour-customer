import React, { useState } from "react";
import { Search, Heart, ShoppingCart, User, X, Trash2 } from "lucide-react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../Redux/cartSlice";
import type { RootState } from "../Redux/store"; // ✅ added type import
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

  // ✅ Use proper RootState typing
  const cart = useSelector((state: RootState) => state.cart.items);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
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
          onClick={() => navigate("/home")}
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

          {/* ❤️ Wishlist */}
          <button
            onClick={() => navigate("/wishlist")}
            className="relative group p-2 rounded-full bg-gray-100 shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-300"
          >
            <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 🛒 Cart */}
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

          {/* 👤 Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="group p-2 rounded-full bg-gray-100 shadow-md hover:bg-emerald-50 hover:scale-110 transition-all duration-300"
          >
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

      {/* 🧾 Cart Drawer (unchanged) */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed right-0 top-0 h-full w-[95%] sm:w-[700px] md:w-[850px] bg-white shadow-2xl z-50 flex flex-col rounded-l-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-center relative px-6 py-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950">
                <h2 className="text-xl font-semibold text-white text-center">
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="absolute right-6 text-white hover:text-gray-200 transition"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-gray-600">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <ShoppingCart size={80} className="text-gray-400 mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold">Your Cart is Empty</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      No Products exist here!
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Left: Product Table */}
                    <div className="md:col-span-2 overflow-x-auto rounded-xl shadow-sm">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white text-left">
                            <th className="p-3 font-semibold">Product</th>
                            <th className="p-3 font-semibold">Price</th>
                            <th className="p-3 font-semibold text-center">
                              Quantity
                            </th>
                            <th className="p-3 font-semibold text-right">
                              Sub Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-gray-100 transition"
                            >
                              <td className="flex items-center gap-3 p-3">
                                <button
                                  onClick={() =>
                                    dispatch(removeFromCart(item.id))
                                  }
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {item.name}
                                  </p>
                                </div>
                              </td>
                              <td className="p-3">${item.price.toFixed(2)}</td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center items-center gap-2 bg-gray-100 rounded-full px-3 py-1 w-fit mx-auto">
                                  <button
                                    className="text-gray-600 hover:text-red-500 transition"
                                    onClick={() =>
                                      dispatch(decreaseQuantity(item.id))
                                    }
                                  >
                                    <FaMinus size={12} />
                                  </button>
                                  <span className="w-6 text-center font-semibold">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="text-gray-600 hover:text-green-500 transition"
                                    onClick={() =>
                                      dispatch(increaseQuantity(item.id))
                                    }
                                  >
                                    <FaPlus size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-right font-semibold text-gray-700">
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="rounded-xl p-5 shadow-sm h-fit">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Order summary
                      </h3>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Items</span>
                        <span>{cartCount}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Sub Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Shipping</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Taxes</span>
                        <span>$0.00</span>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between text-base font-bold mb-4">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => alert("Proceeding to checkout")}
                        className="w-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
