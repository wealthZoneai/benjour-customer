import React from "react";
import ProductCard from "./ProductCardProps";
import PageHeader from "./PageHeader";
 // or header.jpg, any banner you use
import Liqueur1 from "../../assets/wine/redwine.png";
import Liqueur2 from "../../assets/wine/whitewine.png";
import Liqueur3 from "../../assets/wine/rosewine.png";
import Liqueur4 from "../../assets/wine/sparklingwine.png";


const liqueurProducts = [
  { title: "Dark Liqueur", category: "Drinks", price: 2.0, image: Liqueur1, discount: 15, rating: 5 },
  { title: "White Liqueur", category: "Drinks", price: 1.8, image: Liqueur2, discount: 10, rating: 4 },
  { title: "Spiced Liqueur", category: "Drinks", price: 2.2, image: Liqueur3, discount: 20, rating: 5 },
  { title: "Gold Liqueur", category: "Drinks", price: 2.0, image: Liqueur4, discount: 25, rating: 5 },

];

const LiqueurPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* === Header Section === */}
      <PageHeader title="Liqueurs Section"  />

      {/* === Product Grid === */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {liqueurProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default LiqueurPage;
