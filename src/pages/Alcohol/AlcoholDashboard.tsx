import React from "react";
import { useNavigate } from "react-router-dom";

import Beer from "../../assets/beer.jpg";
import Wine from "../../assets/wine.jpg";
import Whisky from "../../assets/whisky.jpg";
import Vodka from "../../assets/vodka.jpg";
import Rum from "../../assets/rum.jpg";
import Tequila from "../../assets/tequila.jpg";
import Brandy from "../../assets/brandy.jpg";
import Liqueurs from "../../assets/liqueurs.jpg";
import Cocktails from "../../assets/cocktails.jpg";
import PageHeader from "./PageHeader";

interface Category {
  id: number;
  title: string;
  image: string;
  path: string;
}

const categories: Category[] = [
  { id: 1, title: "Wine", image: Wine, path: "/wine" },
  { id: 2, title: "Whisky", image: Whisky, path: "/whisky" },
  { id: 3, title: "Vodka", image: Vodka, path: "/vodka" },
  { id: 4, title: "Rum", image: Rum, path: "/rum" },
  { id: 5, title: "Tequila", image: Tequila, path: "/tequila" },
  { id: 6, title: "Beer", image: Beer, path: "/beer" },
  { id: 7, title: "Brandy", image: Brandy, path: "/brandy" },
  { id: 8, title: "Liqueurs", image: Liqueurs, path: "/liqueurs" },
  { id: 9, title: "Cocktails", image: Cocktails, path: "/cocktails" },
];

const AlcoholDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="m-1">
      {/* ===== HEADER (with horizontal margin) ===== */}
      <div className="">
        <PageHeader title="Alcohol Dashboard" />
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ===== CATEGORY GRID (4 per row, 2 rows) ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-6 place-items-center">
          {categories.slice(0, 8).map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(category.path)}
              className="cursor-pointer w-full rounded-xl shadow-md hover:shadow-lg transition-all bg-white overflow-hidden hover:scale-[1.02]"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-3 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlcoholDashboard;
