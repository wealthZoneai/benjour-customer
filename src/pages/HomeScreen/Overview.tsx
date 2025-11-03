import React from "react";
import { Star } from "lucide-react";

// ---------------------------
// ReviewCard Component
// ---------------------------
interface ReviewProps {
  rating: number;
  reviews: number;
}

const ReviewCard: React.FC<ReviewProps> = ({ rating, reviews }) => {
  const totalStars = 5;

  return (
    <div className="flex flex-col items-center justify-center  rounded-xl shadow-md w-[180px] h-[200px]  border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Rating Number */}
      <h2 className="text-6xl font-semibold text-black mb-3">
        {rating.toFixed(1)}
      </h2>

      {/* Star Rating */}
      <div className="flex items-center justify-center mb-2">
        {Array.from({ length: totalStars }, (_, i) => {
          const isFilled = i < Math.round(rating);
          return (
            <Star
              key={i}
              size={22}
              className={`${
                isFilled ? "text-red-500 fill-red-500" : "text-gray-300"
              }`}
            />
          );
        })}
      </div>

      {/* Review Count */}
      <p className="text-sm text-gray-600">{reviews.toLocaleString()} reviews</p>
    </div>
  );
};

// ---------------------------
// Overview Component
// ---------------------------
const Overview: React.FC = () => {
  return (
    <section>
      
      <div className="flex justify-center  flex-wrap py-2 bg-gray">
        <ReviewCard rating={3.4} reviews={1360} />
        
      </div>
    </section>
  );
};

export default Overview;
