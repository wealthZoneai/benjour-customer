import React from "react";
import { motion } from "framer-motion";

interface CategoryBannerProps {
    title: string;
    description: string;
    image?: string;
}

const SubCategoryBanner: React.FC<CategoryBannerProps> = ({
    title,
    description,
    image,
}) => {
    const defaultImage =
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80";

    return (
        <div className="relative w-full">
            {/* Banner Container */}
            <div className="relative h-[260px] sm:h-[320px] w-full rounded-b-[32px] overflow-hidden shadow-md">
                
                {/* Background Image */}
                <motion.img
                    src={image || defaultImage}
                    alt={title}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.9 }}
                    className="w-full h-full object-cover"
                />

                {/* Swiggy/Zomato Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                {/* Text Content */}
                <div className="absolute bottom-6 left-5 right-5">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl sm:text-4xl font-extrabold text-white"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-gray-200 text-lg mt-2 leading-snug"
                    >
                        {description}
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

export default SubCategoryBanner;
