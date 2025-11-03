import React from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "St Glx",
    location: "South London",
    date: "24th September, 2023",
    text: "Rich, bold, and full-bodied with deep notes of dark berries, plum, and subtle spice. Smooth tannins create a warm, lasting finish — perfect for savoring slowly with hearty meals.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
  },
  {
    id: 2,
    name: "St Glx",
    location: "South London",
    date: "24th September, 2023",
    text: "Delicate sweetness with strawberry and floral aromas. Refreshing, slightly fruity taste that is easy to drink — ideal for gatherings and relaxed moments.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "St Glx",
    location: "South London",
    date: "24th September, 2023",
    text: "Light, crisp, and refreshing with citrus and tropical fruit hints. A clean acidity that feels bright on the palate, making it excellent for warm weather and lighter foods.",
    image: "https://randomuser.me/api/portraits/women/46.jpg",
    rating: 5,
  },
  {
    id: 4,
    name: "St Glx",
    location: "South London",
    date: "24th September, 2023",
    text: "A smooth blend with notes of vanilla and oak, providing a rich and satisfying experience with every sip.",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    rating: 4,
  },
  {
    id: 5,
    name: "St Glx",
    location: "South London",
    date: "24th September, 2023",
    text: "Bold flavor and balanced sweetness — a delightful drink for casual evenings.",
    image: "https://randomuser.me/api/portraits/women/48.jpg",
    rating: 4,
  },
];

const CustomerReviews: React.FC = () => {
  return (
    <section className="py-10 bg-[#f9f7f4] overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

        {/* Infinite Scrolling Slider */}
        <div className="relative w-full ">
          <div className="flex animate-scroll gap-6">
            {[...reviews, ...reviews].map((review, index) => (
              <div
                key={index}
                className="w-[350px] flex-shrink-0 bg-white text-left rounded-2xl shadow-md p-6 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-sm text-red-500">{review.location}</p>
                  </div>
                </div>
                <div className="flex mb-2 text-red-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-red-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.text}
                </p>
                <p className="text-xs text-gray-400 mt-3">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
