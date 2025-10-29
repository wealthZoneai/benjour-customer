import React from "react";
import ProductCard from "./ProductCardProps";
import PageHeader from "./PageHeader";
 // or header.jpg, any banner you use
import Brandy1 from "../../assets/wine/redwine.png";
import Brandy2 from "../../assets/wine/whitewine.png";
import Brandy3 from "../../assets/wine/rosewine.png";
import Brandy4 from "../../assets/wine/sparklingwine.png";


const brandyProducts = [
  { title: "Dark Brandy", category: "Drinks", price: 2.0, image: Brandy1, discount: 15, rating: 5 },
  { title: "White Brandy", category: "Drinks", price: 1.8, image: Brandy2, discount: 10, rating: 4 },
  { title: "Spiced Brandy", category: "Drinks", price: 2.2, image: Brandy3, discount: 20, rating: 5 },
  { title: "Gold Brandy", category: "Drinks", price: 2.0, image: Brandy4, discount: 25, rating: 5 },

];

const BrandyPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* === Header Section === */}
      <PageHeader title="Brandy Section"  />

      {/* === Product Grid === */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {brandyProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default BrandyPage;
