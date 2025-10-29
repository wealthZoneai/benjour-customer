import React from "react";
import ProductCard from "./ProductCardProps";
import PageHeader from "./PageHeader";
 // or header.jpg, any banner you use
import Vodka1 from "../../assets/wine/redwine.png";
import Vodka2 from "../../assets/wine/whitewine.png";
import Vodka3 from "../../assets/wine/rosewine.png";
import Vodka4 from "../../assets/wine/sparklingwine.png";



const vodkaProducts = [
  { title: "Dark Vodka", category: "Drinks", price: 2.0, image: Vodka1, discount: 15, rating: 5 },
  { title: "White Vodka", category: "Drinks", price: 1.8, image: Vodka2, discount: 10, rating: 4 },
  { title: "Spiced Vodka", category: "Drinks", price: 2.2, image: Vodka3, discount: 20, rating: 5 },
  { title: "Gold Vodka", category: "Drinks", price: 2.0, image: Vodka4, discount: 25, rating: 5 },

];

const VodkaPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* === Header Section === */}
      <PageHeader title="Vodka Section"  />

      {/* === Product Grid === */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {vodkaProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default VodkaPage;
