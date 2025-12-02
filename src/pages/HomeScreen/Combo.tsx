import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ComboItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  className: string;
}

const comboData: ComboItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbmVzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
    title: "The Taste of Europe",
    subtitle: "Curated wines from Italy, France & Spain",
    className: "md:col-span-2 md:row-span-2 h-[500px]",
  },
  {
    id: 2,
    image:
      "https://plus.unsplash.com/premium_photo-1682097091093-dd18b37764a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2luZXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000",
    title: "Mixed Wine Packs",
    subtitle: "Perfect for tasting parties",
    className: "md:col-span-1 md:row-span-1 h-[240px]",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=1000",
    title: "Paris Best Reds",
    subtitle: "Bold & Elegant",
    className: "md:col-span-1 md:row-span-1 h-[240px]",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=1000",
    title: "Classic Collection",
    subtitle: "Timeless favorites",
    className: "md:col-span-2 md:row-span-1 h-[240px]",
  },
];

const Combo: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Combo Collections
          </h2>
          <p className="text-gray-500 text-lg">
            Handpicked sets for every occasion.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all">
          View All Collections <ArrowRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {comboData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-3xl overflow-hidden group cursor-pointer ${item.className}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="text-white text-2xl font-bold mb-1">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {item.subtitle}
                </p>
                <div className="flex items-center gap-2 text-amber-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  Shop Now <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <button className="inline-flex items-center gap-2 text-amber-600 font-semibold">
          View All Collections <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default Combo;
