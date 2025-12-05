import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, Trash2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import CreateItemModal from "../../components/CreateItemModal";
import SubItemCard from "./SubItemCard";
import SubItemHeader from "./SubItemHeader";
import { getSubcategoryItems, createItem, updateItem, deleteItem } from "../../services/apiHelpers";
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
}

const GroceryItems: React.FC = () => {
    const { subcategoryId } = useParams<{ subcategoryId: string }>();
    const { role } = useSelector((state: RootState) => state.user);

    const [items, setItems] = useState<GroceryProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<GroceryProduct | null>(null);
    const [editingItem, setEditingItem] = useState<GroceryProduct | null>(null);
    const [isItemModalOpen, setItemModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch items on mount
    useEffect(() => {
        if (subcategoryId) {
            fetchItems();
        }
    }, [subcategoryId]);

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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="pt-16">
                <SubItemHeader
                    title="Items"
                    tagline="Browse our collection"
                    emoji="🛒"
                />
            </div>

            {/* ADMIN: Create Item */}
            {role === "ADMIN" && (
                <div className="flex justify-end mb-8 px-6">
                    <button
                        onClick={() => {
                            console.log("Create Item button clicked");
                            setEditingItem(null);
                            setItemModalOpen(true);
                            console.log("Modal should be open now, isItemModalOpen:", true);
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 shadow-lg transition"
                    >
                        <Plus size={20} />
                        Create Item
                    </button>
                </div>
            )}

            {/* Product cards */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {items.length === 0 ? (
                    <div className="w-full py-20 flex justify-center items-center">
                        <p className="text-gray-500 text-lg font-medium">
                            No Data Found
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {items.map((product) => (
                            <div key={product.id} className="relative group">

                                {/* Admin Edit/Delete */}
                                {role === "ADMIN" && (
                                    <div className="absolute top-3 right-10 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">

                                        {/* Edit */}
                                        <button
                                            onClick={() => {
                                                setEditingItem(product);
                                                setItemModalOpen(true);
                                            }}
                                            className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-md transform hover:scale-110 transition"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDeleteItem(product.id)}
                                            className="p-2 bg-white/90 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 shadow-md transform hover:scale-110 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Card */}
                                <SubItemCard
                                    id={product.id}
                                    name={product.name}
                                    category={product.category}
                                    price={product.price}
                                    image={product.imageUrl}
                                    discount={product.discount}
                                    rating={product.rating}
                                    isFavorite={product.isFavorite}
                                    onViewDetails={() => setSelectedProduct(product)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* PRODUCT DETAILS POPUP */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-6 max-w-lg w-full relative shadow-xl"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>

                            <img
                                src={selectedProduct.imageUrl}
                                className="w-48 h-48 object-cover rounded-xl mx-auto mb-4"
                                alt={selectedProduct.name}
                            />

                            <h2 className="text-2xl font-bold text-center">
                                {selectedProduct.name}
                            </h2>
                            <p className="text-gray-600 text-center mt-2">
                                {selectedProduct.description}
                            </p>
                        </motion.div>
                    </motion.div>
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
            />
        </div>
    );
};

export default GroceryItems;
