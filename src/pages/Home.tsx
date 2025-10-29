import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 to-gray-700 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
        Welcome to the Store
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => navigate("/grocery-dashboard")}
          className="px-8 py-4 bg-green-600 rounded-xl text-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Grocery
        </button>

        <button
          onClick={() => navigate("/alcohol-dashboard")}
          className="px-8 py-4 bg-yellow-600 rounded-xl text-xl font-semibold hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Alcohol
        </button>
      </div>
    </div>
  );
};

export default Home;
