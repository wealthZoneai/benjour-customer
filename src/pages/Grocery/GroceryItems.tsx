import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GroceryProductCard from "./ProductCard";
import { ChevronLeft, X } from "lucide-react";
import PageHeader from "./PageHeader";

export interface GroceryProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: number;
  rating?: number;
  category: string;
  description?: string;
}

// 🥕 Sample grocery products
export const groceryProducts: GroceryProduct[] = [
  {
    id: 1,
    name: "Fresh Red Apples",
    image:
      "https://cdn.shopify.com/s/files/1/0580/7633/7911/products/apple_1024x1024.jpg?v=1638556800",
    price: 2.5,
    discount: 10,
    rating: 4.8,
    category: "fruits",
    description:
      "Crisp and juicy red apples freshly picked from organic farms. Perfect for snacking or juicing!",
  },
  {
    id: 2,
    name: "Organic Bananas",
    image:
      "https://cdn.shopify.com/s/files/1/0609/1064/3589/products/banana.png?v=1632306804",
    price: 1.2,
    discount: 5,
    rating: 4.7,
    category: "fruits",
    description:
      "Naturally sweet organic bananas rich in fiber and potassium. Great for smoothies or breakfast bowls.",
  },
  {
    id: 3,
    name: "Broccoli Bunch",
    image:
      "https://cdn.shopify.com/s/files/1/0573/4246/1198/products/broccoli.png?v=1646995181",
    price: 1.8,
    discount: 8,
    rating: 4.6,
    category: "vegetables",
    description:
      "Fresh green broccoli packed with nutrients. Perfect for steaming, salads, or healthy meals.",
  },
  {
    id: 4,
    name: "Whole Milk (1L)",
    image:
      "https://cdn.shopify.com/s/files/1/0617/2681/9474/products/milk.png?v=1647005313",
    price: 3.0,
    discount: 12,
    rating: 4.5,
    category: "dairy",
    description:
      "Farm-fresh whole milk rich in calcium and flavor — perfect for your tea, coffee, or cereal.",
  },
];

const GroceryItems: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<GroceryProduct | null>(
    null
  );

  const categoryProducts = groceryProducts.filter(
    (product) => product.category.toLowerCase() === category?.toLowerCase()
  );

  // 🍏 Category info for theme
  const categoryInfo: Record<
    string,
    { emoji: string; tagline: string; color: string }
  > = {
    fruits: {
      emoji: "🍎",
      tagline: "Fresh and juicy from the orchard",
      color: "from-green-500 to-emerald-700",
    },
    vegetables: {
      emoji: "🥬",
      tagline: "Farm-fresh & full of goodness",
      color: "from-lime-500 to-green-600",
    },
    dairy: {
      emoji: "🥛",
      tagline: "Pure, creamy, and wholesome",
      color: "from-blue-400 to-indigo-600",
    },
    snacks: {
      emoji: "🍿",
      tagline: "Crunchy delights for any time",
      color: "from-orange-400 to-red-600",
    },
    beverages: {
      emoji: "🧃",
      tagline: "Refreshing sips for your day",
      color: "from-cyan-400 to-blue-600",
    },
  };

  const info =
    categoryInfo[category?.toLowerCase() || ""] ?? {
      emoji: "🛒",
      tagline: "Shop the best grocery essentials",
      color: "from-gray-400 to-gray-700",
    };

  // ❌ No items fallback
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
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Oops! Category Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn’t find any products in this category.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
      <div className="pt-16">
        <PageHeader
          title={category || "Grocery"}
          tagline={info.tagline}
          emoji={info.emoji}
        />
      </div>

      {/* Product Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categoryProducts.map((product) => (
            <GroceryProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              image={product.image}
              discount={product.discount}
              rating={product.rating}
              onViewDetails={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      {/* 🧺 Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-48 h-48 object-cover rounded-xl shadow-md"
                />

                <div className="w-full">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-3 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {selectedProduct.description ||
                      "No description available."}
                  </p>
                  <p className="text-green-700 font-semibold text-lg mb-4">
                    ${selectedProduct.price.toFixed(2)}
                  </p>

                  <button className="bg-linear-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-full shadow hover:from-green-700 hover:to-emerald-600 transition-all">
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroceryItems;
