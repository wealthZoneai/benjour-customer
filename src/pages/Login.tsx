import React, { useState, useRef, useEffect } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
// import bgImage from "../assets/login.jpeg"; // replace with your own image

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/';
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Handle initial form state based on route
  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.transform = 'rotateY(0deg)';
    }
  }, [isLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login
      if (!formData.email || !formData.password) {
        alert("Please fill all fields");
        return;
      }
      alert("Login successful!");
    } else {
      // Handle register
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        alert("Please fill all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      alert("Registration successful!");
    }
  };

  const toggleForm = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    // Get the target route
    const targetRoute = isLogin ? '/register' : '/';
    
    // Start flip animation (first half)
    if (formRef.current) {
      formRef.current.style.transition = 'transform 0.3s ease-in-out';
      formRef.current.style.transform = 'rotateY(90deg)';
    }
    
    // After first half of flip, update route and complete the flip
    setTimeout(() => {
      // Navigate to the other route
      navigate(targetRoute);
      
      // Reset form when toggling
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      
      // Start second half of flip after a small delay
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.transform = 'rotateY(0deg)';
        }
        
        // Reset flipping state after animation completes
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.style.transition = ''; // Reset transition
          }
          setIsFlipping(false);
        }, 300);
      }, 50); // Small delay to ensure route has updated
    }, 300); // Match this with the CSS transition duration
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* 🔹 Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/75 to-black/90"></div>

      {/* 🔹 Login Card */}
      <div 
        ref={formRef}
        className="relative z-10 w-full max-w-md mx-4 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white transform-style-preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(0deg)'
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          {isLogin ? 'Log In' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-300 mb-6 text-sm">
          {isLogin 
            ? 'Log in to access your merchant dashboard' 
            : 'Create a new account to get started'}
        </p>

        {/* 🔸 Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field (Only for Register) */}
          {!isLogin && (
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
                Full Name
              </label>
              <div className="flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Email Address
            </label>
            <div className="flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Confirm Password (Only for Register) */}
          {!isLogin && (
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
                Confirm Password
              </label>
              <div className="flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Forgot Password (Only for Login) */}
          {isLogin && (
            <div className="text-right text-xs text-sky-400 hover:underline cursor-pointer">
              Forgot Password?
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-2 rounded-lg font-semibold text-sm shadow-md transition-all duration-300"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <hr className="flex-1 border-gray-600" />
          <span className="mx-3 text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        {/* Toggle Form Link */}
        <p className="text-center text-sm text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-sky-400 font-medium hover:underline focus:outline-none"
            type="button"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
