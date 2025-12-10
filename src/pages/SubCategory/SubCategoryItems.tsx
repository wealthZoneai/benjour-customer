import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, Trash2, Loader2, Filter, Grid3x3, List, Search } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import CreateItemModal from "../../components/CreateItemModal";
import SubItemCard from "./SubItemCard";
import SubItemHeader from "./SubItemHeader";
import { getSubcategoryItems, createItem, updateItem, deleteItem, uploadBulkItems } from "../../services/apiHelpers";
import { toast } from "react-hot-toast";

// Updated product interface to match CreateItemModal fields
export interface GroceryProduct {
    id: number;
    subCategoryId: number;
    name: string;
    price: number;
    discount: number;
    rating: number;
    description: string;
    isFavorite: boolean;
    imageUrl: string;
    category: string;
    minValue: number;
    maxValue: number;
    stepValue: number;
    unitType: string;
}

const GroceryItems: React.FC = () => {
    const { subcategoryId } = useParams<{ subcategoryId: string }>();
    const { role } = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const { name: categoryName, description: categoryDescription, image: categoryImage } = location.state || {};

    const [items, setItems] = useState<GroceryProduct[]>([]);
    const [filteredItems, setFilteredItems] = useState<GroceryProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<GroceryProduct | null>(null);
    const [editingItem, setEditingItem] = useState<GroceryProduct | null>(null);
    const [isItemModalOpen, setItemModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "rating">("name");

    // Fetch items on mount
    useEffect(() => {
        if (subcategoryId) {
            fetchItems();
        }
    }, [subcategoryId]);

    // Filter and sort items
    useEffect(() => {
        let result = [...items];

        // Search filter
        if (searchQuery) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "name":
            default:
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        setFilteredItems(result);
    }, [items, searchQuery, sortBy]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await getSubcategoryItems(subcategoryId!);
            if (response.data && Array.isArray(response.data)) {
                setItems(response.data);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    // DELETE Item
    const handleDeleteItem = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await deleteItem(id.toString());
            toast.success("Item deleted successfully!");
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    // When creating OR updating item
    const handleSubmitItem = async (data: any) => {
        try {
            if (editingItem) {
                // Edit existing item
                await updateItem(editingItem.id.toString(), data);
                toast.success("Item updated successfully!");
            } else {
                // Create new item
                await createItem(subcategoryId!, data);
                toast.success("Item created successfully!");
            }

            fetchItems();
            setEditingItem(null);
            setItemModalOpen(false);
        } catch (error: any) {
            console.error("Error saving item:", error);
            toast.error(error?.response?.data?.error || "Failed to save item");
        }
    };
    const handleSubmitBulkItem = async ({
        excelFile,
        zipFile
    }: {
        excelFile: File;
        zipFile: File;
    }) => {
        if (!excelFile) {
            alert("Excel file missing");
            return;
        }
        if (!zipFile) {
            alert("ZIP file missing");
            return;
        }

        try {
            await uploadBulkItems(subcategoryId!, excelFile, zipFile);
            toast.success("Items uploaded successfully!");
            fetchItems();
            setItemModalOpen(false);
        } catch (error: any) {
            console.error("Error uploading items:", error);
            toast.error(error?.response?.data?.error || "Failed to upload");
        }
    };



    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="pt-16">
                <SubItemHeader
                    title={categoryName || "Premium Collection"}
                    tagline={categoryDescription || "Discover our exclusive range of products"}
                    emoji="✨"
                    imageUrl={categoryImage}
                />
            </div>

            {/* Filters & Controls */}
            <div className="max-w-7xl mx-auto  py-6">
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Sort & View Controls */}
                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                        ? "bg-white shadow-sm text-emerald-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <Grid3x3 size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                                        ? "bg-white shadow-sm text-emerald-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <List size={20} />
                                </button>
                            </div>

                            {/* ADMIN: Create Item */}
                            {role === "ADMIN" && (
                                <button
                                    onClick={() => {
                                        setEditingItem(null);
                                        setItemModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 shadow-md hover:shadow-lg transition-all"
                                >
                                    <Plus size={20} />
                                    Add Item
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <p>
                            Showing <span className="font-semibold text-gray-800">{filteredItems.length}</span> of{" "}
                            <span className="font-semibold text-gray-800">{items.length}</span> products
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                </div>

                {/* Product Grid/List */}
                {filteredItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm p-12 text-center"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchQuery ? "No products found" : "No products available"}
                        </h3>
                        <p className="text-gray-500">
                            {searchQuery
                                ? "Try adjusting your search terms"
                                : "Check back later for new items"}
                        </p>
                    </motion.div>
                ) : (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                                : "flex flex-col gap-4"
                        }
                    >
                        <AnimatePresence>
                            {filteredItems.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative group"
                                >
                                    {/* Admin Edit/Delete */}
                                    {role === "ADMIN" && (
                                        <div className="absolute top-3 right-10 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                                            {/* Edit */}
                                            <button
                                                onClick={() => {
                                                    setEditingItem(product);
                                                    setItemModalOpen(true);
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-md transform hover:scale-110 transition"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDeleteItem(product.id)}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 shadow-md transform hover:scale-110 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Card */}
                                    <SubItemCard
                                        id={product?.id}
                                        name={product?.name}
                                        category={product?.category}
                                        price={product?.price}
                                        image={product?.imageUrl}
                                        discount={product?.discount}
                                        rating={product?.rating}
                                        minValue={product?.minValue}
                                        maxValue={product?.maxValue}
                                        stepValue={product?.stepValue}
                                        unitType={product?.unitType}
                                        onViewDetails={() => setSelectedProduct(product)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* PRODUCT DETAILS POPUP */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                        >
                            {/* Modal */}
                            <motion.div
                                className="bg-white rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={selectedProduct.imageUrl}
                                            className="w-full md:w-64 h-64 object-cover rounded-2xl"
                                            alt={selectedProduct.name}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="mb-3">
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                                {selectedProduct.category}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            {selectedProduct.name}
                                        </h2>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-lg ${i < selectedProduct.rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                ({selectedProduct.rating}.0)
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {selectedProduct.description || "No description available."}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-3 mb-6">
                                            <span className="text-3xl font-bold text-emerald-600">
                                                ₹{selectedProduct.price}
                                            </span>
                                            {selectedProduct.discount > 0 && (
                                                <>
                                                    <span className="text-lg text-gray-400 line-through">
                                                        ₹{(selectedProduct.price * (1 + selectedProduct.discount / 100)).toFixed(0)}
                                                    </span>
                                                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        {selectedProduct.discount}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedProduct(null);
                                                // Add to cart logic here
                                            }}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Create / Edit Item Modal */}
            <CreateItemModal
                isOpen={isItemModalOpen}
                onClose={() => {
                    setItemModalOpen(false);
                    setEditingItem(null);
                }}
                initialData={editingItem}
                onSubmit={handleSubmitItem}
                onBulkSubmit={handleSubmitBulkItem}
            />
        </div>
    );
};

export default GroceryItems;
