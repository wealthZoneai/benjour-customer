import React from "react";
import ProductCard from "./ProductCardProps";
import PageHeader from "./PageHeader";
 // or header.jpg, any banner you use
import Rum1 from "../../assets/wine/redwine.png";
import Rum2 from "../../assets/wine/whitewine.png";
import Rum3 from "../../assets/wine/rosewine.png";
import Rum4 from "../../assets/wine/sparklingwine.png";


const rumProducts = [
  { title: "Dark Rum", category: "Drinks", price: 2.0, image: Rum1, discount: 15, rating: 5 },
  { title: "White Rum", category: "Drinks", price: 1.8, image: Rum2, discount: 10, rating: 4 },
  { title: "Spiced Rum", category: "Drinks", price: 2.2, image: Rum3, discount: 20, rating: 5 },
  { title: "Gold Rum", category: "Drinks", price: 2.0, image: Rum4, discount: 25, rating: 5 },
  
];

const RumPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* === Header Section === */}
      <PageHeader title="Rum Section"  />

      {/* === Product Grid === */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {rumProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default RumPage;
