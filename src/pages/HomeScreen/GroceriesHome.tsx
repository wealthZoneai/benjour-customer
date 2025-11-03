import React, { useState } from "react";

const fallbackImage =
  "https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2024-07/grocery-list-1024x536.jpg";

const groceries = [
  {
    name: "Pastries",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTetSsIU-nc7l9osF0VY6KxpgLD4qBZQPIUAQ&s",
  },
  {
    name: "Popcorn",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/057/197/431/small/tasty-popcorn-in-a-classic-striped-bucket-at-a-cozy-cinema-snack-bar-during-an-evening-movie-photo.jpeg",
  },
  {
    name: "Cookies",
    image:
      "https://images.unsplash.com/photo-1548365328-9da0b6e301cc?auto=format&fit=crop&w=800&q=80",
  },
];

const GroceriesHome: React.FC = () => {
  return (
    <section className="py-10 bg-white text-center">
      {/* Simple Heading (no button style) */}
      <h2 className="text-3xl font-bold text-700 mb-10">Groceries</h2>

      {/* Flex Layout */}
      <div className="flex flex-wrap justify-center gap-8">
        {groceries.map((item) => (
          <ImageCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
};

interface GroceryItem {
  name: string;
  image: string;
}

const ImageCard: React.FC<{ item: GroceryItem }> = ({ item }) => {
  const [imgSrc, setImgSrc] = useState(item.image);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-110 h-80 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 group">
      {/* Loading Gradient */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={imgSrc}
        alt={item.name}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackImage);
          setIsLoading(false);
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Overlay Title */}
      <h3 className="absolute bottom-0 left-0 w-full text-lg font-semibold text-white py-3 transition-all duration-500 transform group-hover:-translate-y-10">
        {item.name}
      </h3>
    </div>
  );
};

export default GroceriesHome;
