import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GroceriesBanner from "./GroceriesBanner";
import { ChevronRight } from "lucide-react";
import Footer from "../../components/Footer";

const categories = [
  {
    name: "fruits",
    displayName: "Fruits",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1470",
    description: "Fresh and organic fruits picked daily for you.",
    gradient: "text-white",
    iconColor: "text-green-600",
  },
  {
    name: "vegetables",
    displayName: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=1632",
    description: "Green, leafy, and full of vitamins and nutrients.",
    gradient: "text-white",
    iconColor: "text-green-600",
  },
  {
    name: "dairy",
    displayName: "Dairy & Eggs",
    image:
      "https://images.unsplash.com/photo-1572086301796-cb8920f1b2af?auto=format&fit=crop&q=80&w=1470",
    description: "Pure milk, cheese, butter, and farm-fresh eggs.",
    gradient: "text-white",
    iconColor: "text-green-600",
  },
  {
    name: "snacks",
    displayName: "Snacks",
    image:
      "https://plus.unsplash.com/premium_photo-1679591002405-13fec066bd53?auto=format&fit=crop&q=80&w=1632",
    description: "Crunchy, salty, sweet — perfect for every craving!",
    gradient: "text-white",
    iconColor: "text-green-600",
  },
  {
    name: "beverages",
    displayName: "Beverages",
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1557",
    description: "Refreshing juices, smoothies, and energizing drinks.",
    gradient: "text-white",
    iconColor: "text-green-600",
  },
  {
    name: "bakery",
    displayName: "Bakery",
    image:
      "https://plus.unsplash.com/premium_photo-1681826507324-0b3c43928753?auto=format&fit=crop&q=80&w=1469",
    description: "Soft breads, delicious pastries, and gourmet cakes.",
    gradient: "text-white",
    iconColor: "text-green-600",
  },
  {
    name: "spices",
    displayName: "Spices & Herbs",
    image:
      "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?auto=format&fit=crop&q=80&w=1423",
    description: "Aromatic spices and herbs to elevate every dish.",
    gradient: "text-white",
    iconColor: "text-green-600",
  },
  {
    name: "grains",
    displayName: "Grains & Pulses",
    image:
      "https://plus.unsplash.com/premium_photo-1726750862897-4b75116bca34?auto=format&fit=crop&q=80&w=1467",
    description: "Wholesome grains and protein-rich pulses.",
    gradient: "text-white",
    iconColor: "text-green-600",
  },
];

const Grocery: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <GroceriesBanner />

      {/* Shop by Category */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the freshest groceries handpicked for your daily needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ scale: 1.03 }}
                className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${category.gradient} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer`}
                onClick={() => navigate(`/grocery/${category.name}`)}
              >
                <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                    {category.displayName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <div
                    className={`flex items-center text-sm font-medium ${category.iconColor}`}
                  >
                    Explore <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Grocery;
