import React from "react";
import { useOutletContext } from "react-router-dom";
import HomeBanner from "./HomeBanner";
import CategoriesScreen from "./CategoriesScreen";
import BrandSection from "./Popular Brand Section";
import ComboScreen from "./Combo";
import TopRating from "./TopRating";
import GroceriesHome from "./GroceriesHome";
import CustomerReviews from "./CustomerReviews";
import Overview from "./Overview";

interface LayoutContext {
  searchQuery: string;
}

const Home: React.FC = () => {
  const { searchQuery } = useOutletContext<LayoutContext>();

  const items = ["Whiskey", "Vodka", "Beer", "Rum", "Wine", "Tequila"];
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {searchQuery.trim() === "" ? (
        <>
          <HomeBanner />
          <CategoriesScreen />
          <BrandSection />
          <ComboScreen />
          <TopRating />
          <GroceriesHome />
          <CustomerReviews />
          <Overview/>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Search Results</h1>
          {filteredItems.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <li
                  key={item}
                  className="bg-white rounded-xl shadow-md p-4 text-center font-semibold hover:scale-105 transition-all duration-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No results found for “{searchQuery}”</p>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
