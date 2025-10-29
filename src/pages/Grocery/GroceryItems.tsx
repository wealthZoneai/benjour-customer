import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { products } from "../../data/products";
import { ChevronLeft } from "lucide-react";
import PageHeader from "./PageHeader";
import Footer from "../../components/Footer";

const GroceryItems: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const categoryProducts = products.filter(
    (product) => product.category.toLowerCase() === category?.toLowerCase()
  );

  // Category metadata for extra flair
  const categoryInfo = {
    fruits: { emoji: "fruits🍎", tagline: "Fresh from the orchard", color: "from-green-400 to-emerald-600" },
    vegetables: { emoji: "vegetables🥬", tagline: "Farm-fresh & organic", color: "from-lime-400 to-green-600" },
    dairy: { emoji: "dairy🥛", tagline: "Creamy, fresh, delicious", color: "from-blue-400 to-indigo-600" },
    snacks: { emoji: "snacks🍿", tagline: "Crunchy munchies await!", color: "from-orange-400 to-red-600" },
    beverages: { emoji: "beverages🧃", tagline: "Refresh & recharge", color: "from-cyan-400 to-blue-600" },
    default: { emoji: "🛒", tagline: "Explore delicious picks", color: "from-purple-400 to-pink-600" }
  };

  const info = categoryInfo[category?.toLowerCase() as keyof typeof categoryInfo] || categoryInfo.default;

  if (categoryProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 bg-linear-to-br from-gray-50 to-gray-100"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">{info.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Oops! Category Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find what you're looking for.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">

      {/* Hero Section with Category Highlight */}
      <PageHeader title="fruits"/>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-8 py-8">
  {categoryProducts.map((product) => (
    <ProductCard
      key={product.id}
      name={product.name}
      price={product.price}
      image={product.image}
      // discount={product.discount}
      rating={product.rating}
    />
  ))}
</div>


        {/* No Products Fallback */}
        {categoryProducts.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 text-lg py-20"
          >
            No products found in this category.
          </motion.p>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default GroceryItems;