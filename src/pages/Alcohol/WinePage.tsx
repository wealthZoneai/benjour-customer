import React from "react";
import ProductCard from "./ProductCardProps"; 
import PageHeader from "./PageHeader";
import RedWine from "../../assets/wine/redwine.png"
import WhiteWine from "../../assets/wine/whitewine.png"
import RoseWine from "../../assets/wine/rosewine.png"
import SparklingWine from "../../assets/wine/sparklingwine.png"


const products = [
  { title: "Red Wine", category: "Drinks", price: 1.0, image: RedWine, discount: 20, rating: 5 },
  { title: "White Wine", category: "Drinks", price: 1.0, image:WhiteWine, discount: 20, rating: 4 },
  { title: "Rose Wine", category: "Drinks", price: 1.0, image: RoseWine, discount: 20, rating: 5 },
  { title: "Sparkling Wine", category: "Drinks", price: 1.0, image: SparklingWine, discount: 20, rating: 4 },
  
];

const WinePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <PageHeader title="Wine Products" />

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default WinePage;
