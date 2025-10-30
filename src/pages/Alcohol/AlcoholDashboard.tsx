import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AlcoholBanner from "./AlcoholBanner"; 
import { ChevronRight } from "lucide-react";


import Beer from "../../assets/beer.jpg";
import Wine from "../../assets/wine.jpg";
import Whisky from "../../assets/whisky.jpg";
import Vodka from "../../assets/vodka.jpg";
import Rum from "../../assets/rum.jpg";
import Tequila from "../../assets/tequila.jpg";
import Brandy from "../../assets/brandy.jpg";
import Liqueurs from "../../assets/liqueurs.jpg";
import Cocktails from "../../assets/cocktails.jpg";

const categories = [
  {
    name: "wine",
    displayName: "Wine",
    image: Wine,
    description: "Elegant wines for every occasion.",
    iconColor: "text-amber-500",
  },
  {
    name: "whisky",
    displayName: "Whisky",
    image: Whisky,
    description: "Premium aged blends from around the world.",
    iconColor: "text-amber-500",
  },
  {
    name: "vodka",
    displayName: "Vodka",
    image: Vodka,
    description: "Crystal clear, smooth, and full-bodied flavors.",
    iconColor: "text-amber-500",
  },
  {
    name: "rum",
    displayName: "Rum",
    image: Rum,
    description: "Rich, dark, and spiced Caribbean perfection.",
    iconColor: "text-amber-500",
  },
  {
    name: "tequila",
    displayName: "Tequila",
    image: Tequila,
    description: "Vibrant spirits crafted from blue agave.",
    iconColor: "text-amber-500",
  },
  {
    name: "beer",
    displayName: "Beer",
    image: Beer,
    description: "Craft, lager, or stout — chilled to perfection.",
    iconColor: "text-amber-500",
  },
  {
    name: "brandy",
    displayName: "Brandy",
    image: Brandy,
    description: "Smooth, aromatic, and beautifully aged.",
    iconColor: "text-amber-500",
  },
  {
    name: "liqueurs",
    displayName: "Liqueurs",
    image: Liqueurs,
    description: "Flavored delights to elevate your spirits.",
    iconColor: "text-amber-500",
  },
  {
    name: "cocktails",
    displayName: "Cocktails",
    image: Cocktails,
    description: "Vibrant mixes for every celebration.",
    iconColor: "text-amber-500",
  },
];

const AlcoholDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mt-15 bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* === Banner === */}
      <AlcoholBanner />

      {/* === Shop by Category === */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover premium spirits, wines, and brews curated for every
              celebration.
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
                className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/alcohol/${category.name}`)}
              >
                {/* === Image === */}
                <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                </div>

                {/* === Content === */}
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

    </div>
  );
};

export default AlcoholDashboard;
