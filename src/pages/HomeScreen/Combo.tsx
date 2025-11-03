import React, { useState } from "react";

interface ComboItem {
  id: number;
  image: string;
  title: string;
}

const comboData: ComboItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbmVzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
    title: "The Taste of Europe",
  },
  {
    id: 2,
    image:
      "https://plus.unsplash.com/premium_photo-1682097091093-dd18b37764a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2luZXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000",
    title: "Mixed Wine Packs",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbmVzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
    title: "Paris Best Reds",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbmVzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
    title: "Classic Wine Taste",
  },
];

const Combo: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="max-w-8xl mx-auto   px-10 py-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 mx-13 py-2 ">
        Combo Collections
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {comboData.map((item) => (
          <div
            key={item.id}
            className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image with Zoom on Hover (responsive height) */}
            <img
              src={item.image}
              alt={item.title}
              className={`w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[490px] object-cover transform transition-transform duration-700 ${
                hoveredId === item.id ? "scale-110" : "scale-100"
              }`}
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            {/* Title + Hover Effects */}
            <div className="absolute bottom-8 left-0 w-full text-center">
              <h3
                className={`text-white text-2xl font-bold mb-2 transition-all duration-500 ${
                  hoveredId === item.id
                    ? "translate-y-[-12px] opacity-90"
                    : "translate-y-0 opacity-100"
                }`}
              >
                {item.title}
              </h3>

              <h4
                className={`text-white text-lg font-semibold transition-all duration-500 ${
                  hoveredId === item.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-[10px]"
                }`}
              >
                Shop Collection
              </h4>

              <div
                className={`mx-auto mt-2 h-[2px] bg-white transition-all duration-500 ${
                  hoveredId === item.id ? "w-24 opacity-100" : "w-0 opacity-0"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Combo;
