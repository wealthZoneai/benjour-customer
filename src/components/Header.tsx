import React, { useState } from "react";
import { Search, Heart, ShoppingCart, User, X } from "lucide-react";

interface HeaderProps {
  onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearchChange(value); // 🔥 send to Layout
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Logo */}
        <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
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

          {/* Cart */}
          <button className="relative group p-2 rounded-full bg-gray-100 shadow-md hover:bg-yellow-50 hover:scale-110 transition-all duration-300">
            <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-yellow-500 transition" />
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded-full shadow-sm">
              3
            </span>
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
    </header>
  );
};

export default Header;
