import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import { addToWishlist } from "../Redux/wishlistSlice";
import { toast } from "react-hot-toast";

// Mock product data (replace with actual API call or Redux store)
const mockProducts = [
    { id: 1, name: "Fresh Organic Apples", price: 4.99, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", category: "Groceries", description: "Fresh and crispy organic apples" },
    { id: 2, name: "Premium Red Wine", price: 24.99, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", category: "Alcohol", description: "Fine red wine from Italy" },
    { id: 3, name: "Craft Beer Pack", price: 15.99, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", category: "Alcohol", description: "Assorted craft beers" },
    { id: 4, name: "Fresh Orange Juice", price: 5.99, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", category: "Beverages", description: "100% fresh squeezed orange juice" },
    { id: 5, name: "Whole Grain Bread", price: 3.49, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", category: "Groceries", description: "Healthy whole grain bread" },
    { id: 6, name: "Sparkling Water", price: 2.99, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400", category: "Beverages", description: "Refreshing sparkling water" },
    { id: 7, name: "Whiskey Bottle", price: 45.99, image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", category: "Alcohol", description: "Premium aged whiskey" },
    { id: 8, name: "Greek Yogurt", price: 4.49, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", category: "Groceries", description: "Creamy Greek yogurt" },
    { id: 9, name: "Avocado Pack", price: 6.99, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400", category: "Groceries", description: "Fresh ripe avocados" },
    { id: 10, name: "Coffee Beans", price: 12.99, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400", category: "Beverages", description: "Premium arabica coffee beans" },
];

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const query = searchParams.get("q") || "";
    const [filteredProducts, setFilteredProducts] = useState(mockProducts);

    useEffect(() => {
        if (query.trim()) {
            const results = mockProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(results);
        } else {
            setFilteredProducts(mockProducts);
        }
    }, [query]);

    const handleAddToCart = (product: typeof mockProducts[0]) => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        toast.success(`${product.name} added to cart!`);
    };

    const handleAddToWishlist = (product: typeof mockProducts[0]) => {
        dispatch(addToWishlist(product));
        toast.success(`${product.name} added to wishlist!`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <Search className="w-6 h-6 text-green-600" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Search Results
                        </h1>
                    </div>
                    {query && (
                        <p className="text-gray-600">
                            Showing results for <span className="font-semibold text-gray-900">"{query}"</span>
                        </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Results */}
                {filteredProducts.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer transition-shadow hover:shadow-xl"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                {/* Product Image */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                                        {product.category}
                                    </div>
                                    {/* Quick Actions */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToWishlist(product);
                                            }}
                                            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition"
                                        >
                                            <Heart className="w-4 h-4 text-red-500" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                            className="p-2 bg-white rounded-full shadow-lg hover:bg-green-50 transition"
                                        >
                                            <ShoppingCart className="w-4 h-4 text-green-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-green-600">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20"
                    >
                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            No products found
                        </h2>
                        <p className="text-gray-600 mb-6 text-center max-w-md">
                            We couldn't find any products matching "{query}". Try searching with different keywords.
                        </p>
                        <button
                            onClick={() => navigate("/home")}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Back to Home
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
