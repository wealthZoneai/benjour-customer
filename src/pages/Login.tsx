import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
// import bgImage from "../assets/login.jpeg"; // replace with your own image

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    alert("Login successful!");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* 🔹 Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/90"></div>

      {/* 🔹 Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back 👋</h2>
        <p className="text-center text-gray-300 mb-6 text-sm">
          Log in to access your merchant dashboard
        </p>

        {/* 🔸 Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Email Address
            </label>
            <div className="flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Password
            </label>
            <div className="flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right text-xs text-sky-400 hover:underline cursor-pointer">
            Forgot Password?
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-2 rounded-lg font-semibold text-sm shadow-md transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <hr className="flex-1 border-gray-600" />
          <span className="mx-3 text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-sky-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
