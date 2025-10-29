import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
  image: string;
  category?: string;
  isFeatured?: boolean;
}

const CategoryCard: React.FC<Props> = ({ name, image, category, isFeatured = false }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/grocery/${category || name.toLowerCase()}`);
  };

  if (isFeatured) {
    return (
      <div 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 h-full min-h-[300px] flex flex-col"
      >
        <div className="relative h-full">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transform transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-3 transition-transform duration-300 group-hover:translate-x-2">
              {name}
            </h3>
            <span className="inline-flex items-center px-4 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-full transition-all duration-300 transform group-hover:translate-x-2 group-hover:bg-emerald-600">
              Shop Now
              <svg 
                className={`w-4 h-4 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1.5"
    >
      <div className="relative pt-[100%] overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5 text-center grow flex flex-col justify-center">
        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300 mb-1">
          {name}
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span>{Math.floor(Math.random() * 50) + 10} items</span>
          <span>•</span>
          <span className="flex items-center">
            {Math.floor(Math.random() * 5) + 1}
            <svg className="w-4 h-4 ml-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        </div>
        <div className="mt-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
            Shop Now
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
