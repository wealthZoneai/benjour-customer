import React from "react";
import ProductCard from "./ProductCardProps";
import PageHeader from "./PageHeader";
 // or header.jpg, any banner you use
import Tequila1 from "../../assets/wine/redwine.png";
import Tequila2 from "../../assets/wine/whitewine.png";
import Tequila3 from "../../assets/wine/rosewine.png";
import Tequila4 from "../../assets/wine/sparklingwine.png";


const tequilaProducts = [
  { title: "Dark Tequila", category: "Drinks", price: 2.0, image: Tequila1, discount: 15, rating: 5 },
  { title: "White Tequila", category: "Drinks", price: 1.8, image: Tequila2, discount: 10, rating: 4 },
  { title: "Spiced Tequila", category: "Drinks", price: 2.2, image: Tequila3, discount: 20, rating: 5 },
  { title: "Gold Tequila", category: "Drinks", price: 2.0, image: Tequila4, discount: 25, rating: 5 },
  
];

const TequilaPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* === Header Section === */}
      <PageHeader title="Tequila Section"  />

      {/* === Product Grid === */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {tequilaProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default TequilaPage;
