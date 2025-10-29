import React from "react";
import ProductCard from "./ProductCardProps";
import PageHeader from "./PageHeader";


import Img1 from "../../assets/wine/redwine.png";
import Img2 from "../../assets/wine/whitewine.png";
import Img3 from "../../assets/wine/rosewine.png";
import Img4 from "../../assets/wine/sparklingwine.png";


const products = [
  { title: "Scotch Whisky", category: "Drinks", price: 3.0, image: Img1, discount: 10, rating: 5 },
  { title: "Irish Whisky", category: "Drinks", price: 2.5, image: Img2, discount: 15, rating: 4 },
  { title: "Bourbon", category: "Drinks", price: 3.2, image: Img3, discount: 20, rating: 5 },
  { title: "Blended Whisky", category: "Drinks", price: 2.8, image: Img4, discount: 25, rating: 5 },
];

const WhiskyPage: React.FC = () => {
  return (
    <div className="w-full">
      <PageHeader title="Whisky Section"  />

      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
};

export default WhiskyPage;
