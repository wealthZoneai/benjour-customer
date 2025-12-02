import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, X, Pencil, Trash2 } from "lucide-react";
import PageHeader from "./PageHeader";
import GroceryProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import CreateItemModal from "../../components/CreateItemModal";

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
  image: string; // base64 preview OR url
  category: string;
}

// Sample item list with new fields
const defaultItems: GroceryProduct[] = [
  {
    id: 1,
    subCategoryId: 3,
    name: "Fresh Red Apples",
    price: 250,
    discount: 10,
    rating: 4.8,
    description:
      "Crisp and juicy red apples freshly picked from organic farms.",
    isFavorite: false,
    image:
      "https://cdn.shopify.com/s/files/1/0580/7633/7911/products/apple_1024x1024.jpg?v=1638556800",
    category: "fruits",
  },
  {
    id: 2,
    subCategoryId: 3,
    name: "Organic Bananas",
    price: 120,
    discount: 5,
    rating: 4.7,
    description:
      "Naturally sweet organic bananas rich in fiber and potassium.",
    isFavorite: false,
    image:
      "https://cdn.shopify.com/s/files/1/0609/1064/3589/products/banana.png?v=1632306804",
    category: "fruits",
  },
];

const GroceryItems: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.user);

  const [items, setItems] = useState<GroceryProduct[]>(defaultItems);
  const [selectedProduct, setSelectedProduct] = useState<GroceryProduct | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<GroceryProduct | null>(null);
  const [isItemModalOpen, setItemModalOpen] = useState(false);

  const categoryProducts = items.filter(
    (p) => p.category.toLowerCase() === category?.toLowerCase()
  );

  const categoryInfo: Record<
    string,
    { emoji: string; tagline: string; color: string }
  > = {
    fruits: {
      emoji: "🍎",
      tagline: "Fresh and juicy from the orchard",
      color: "from-green-500 to-emerald-700",
    },
    vegetables: {
      emoji: "🥬",
      tagline: "Farm-fresh & full of goodness",
      color: "from-lime-500 to-green-600",
    },
    dairy: {
      emoji: "🥛",
      tagline: "Pure, creamy, and wholesome",
      color: "from-blue-400 to-indigo-600",
    },
  };

  const info =
    categoryInfo[category || ""] ?? {
      emoji: "🛒",
      tagline: "Shop the best grocery essentials",
      color: "from-gray-400 to-gray-700",
    };

  // DELETE Item
  const handleDeleteItem = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // When creating OR updating item
  const handleSubmitItem = (data: any) => {
    if (editingItem) {
      // Edit existing item
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...data } : item
        )
      );
      setEditingItem(null);
    } else {
      // Create new item
      const newItem: GroceryProduct = {
        id: Date.now(),
        category: category || "unknown",
        ...data,
      };

      setItems((prev) => [...prev, newItem]);
    }
  };

  // Admin-only: show create/edit/delete
  if (categoryProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-100"
      >
        <h1 className="text-4xl font-bold">No Products Found</h1>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="pt-16">
        <PageHeader
          title={category || "Grocery"}
          tagline={info.tagline}
          emoji={info.emoji}
        />
      </div>

      {/* ADMIN: Create Item */}
      {role === "ADMIN" && (
        <div className="flex justify-end mb-8 px-6">
          <button
            onClick={() => {
              setEditingItem(null);
              setItemModalOpen(true);
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
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categoryProducts.map((product) => (
            <div key={product.id} className="relative group">

              {/* Admin Edit/Delete */}
              {role === "ADMIN" && (
                <div className="
                  absolute top-3 right-3 flex gap-2 z-20
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 pointer-events-auto
                ">
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditingItem(product);
                      setItemModalOpen(true);
                    }}
                    className="p-2 bg-white/90 rounded-full text-blue-600 
                          hover:bg-blue-50 hover:text-blue-700 shadow-md 
                          transform hover:scale-110 transition"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteItem(product.id)}
                    className="p-2 bg-white/90 rounded-full text-red-600 
                            hover:bg-red-50 hover:text-red-700 shadow-md 
                            transform hover:scale-110 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* Card */}
              <GroceryProductCard
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
                discount={product.discount}
                rating={product.rating}
                onViewDetails={() => setSelectedProduct(product)}
              />
            </div>
          ))}
        </div>
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
                src={selectedProduct.image}
                className="w-48 h-48 object-cover rounded-xl mx-auto mb-4"
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
