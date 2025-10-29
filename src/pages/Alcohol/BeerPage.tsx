import React from "react";
import ProductCard from "./ProductCardProps";
import PageHeader from "./PageHeader";
 // or header.jpg, any banner you use
import Beer1 from "../../assets/wine/redwine.png";
import Beer2 from "../../assets/wine/whitewine.png";
import Beer3 from "../../assets/wine/rosewine.png";
import Beer4 from "../../assets/wine/sparklingwine.png";


const beerProducts = [
  { title: "Dark Beer", category: "Drinks", price: 2.0, image: Beer1, discount: 15, rating: 5 },
  { title: "White Beer", category: "Drinks", price: 1.8, image: Beer2, discount: 10, rating: 4 },
  { title: "Spiced Beer", category: "Drinks", price: 2.2, image: Beer3, discount: 20, rating: 5 },
  { title: "Gold Beer", category: "Drinks", price: 2.0, image: Beer4, discount: 25, rating: 5 },

];

const BeerPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* === Header Section === */}
      <PageHeader title="Beer Section"  />

      {/* === Product Grid === */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {beerProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default BeerPage;
