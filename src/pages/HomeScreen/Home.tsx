import React from "react";
import HomeBanner from "./HomeBanner";
import BrandSection from "./Popular Brand Section";
import ComboScreen from "./Combo";
import TopRating from "./TopRating";
// import GroceriesHome from "./GroceriesHome";
import CustomerReviews from "./CustomerReviews";
import Overview from "./Overview";
import CategoriesScreen from "./HomeCategories/CategoriesScreen";

const Home: React.FC = () => {
  return (
    <div>
      <HomeBanner />
      <CategoriesScreen />
      <BrandSection />
      <ComboScreen />
      <TopRating />
      {/* <GroceriesHome /> */}
      <CustomerReviews />
      <Overview />
    </div>
  );
};

export default Home;
