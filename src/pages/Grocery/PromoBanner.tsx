import React from "react";
import { motion } from "framer-motion";

const PromoBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16 mt-20 rounded-3xl shadow-2xl bg-linear-to-r from-orange-500 via-pink-600 to-rose-600">
      {/* Dark overlay for luxury depth */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      {/* Decorative glowing circles */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl"></div>

      {/* Floating product image (optional) */}
      <motion.img
        src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2615"
        alt="Delicious Burger"
        className="absolute bottom-0 right-10 w-64 md:w-80 drop-shadow-2xl rounded-3xl object-cover"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center px-6 z-10">
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md mb-4"
        >
          Hungry for More? 🍔
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-lg md:text-xl text-white/90 mb-8 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Get <span className="font-bold text-yellow-300">20% OFF</span> on your
          first order above <span className="text-white font-semibold">$30</span>.
          Taste freshness delivered fast!
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="px-10 py-4 bg-white text-orange-600 font-bold text-lg rounded-full shadow-xl hover:bg-linear-to-r hover:from-yellow-50 hover:to-white transition-all duration-300"
        >
          Order Now
        </motion.button>

        {/* Small fine-print text */}
        <p className="text-white/70 text-sm mt-6 italic">
          *Limited time offer. Terms & Conditions apply.
        </p>
      </div>

      {/* Optional shimmer animation */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut",
        }}
      />
    </section>
  );
};

export default PromoBanner;
