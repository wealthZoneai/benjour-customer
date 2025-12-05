import React, { useState, useEffect } from "react";
import { Star, Plus, Pencil, Trash2, X, UploadCloud, Loader2, TrendingUp, Award } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { RootState } from "../../Redux/store";
import {
  getHomeTopRated,
  createHomeTopRated,
  updateHomeTopRated,
  deleteHomeTopRated
} from "../../services/apiHelpers";

interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  category: "top" | "best";
}

const fallbackImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80";

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Rose Wine",
    image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 124,
    category: "top",
  },
  {
    id: 2,
    name: "Honey Beer",
    image: "https://images.unsplash.com/photo-1542959863-3f384b6b1624?auto=format&fit=crop&w=800&q=60",
    rating: 4.5,
    reviews: 89,
    category: "best",
  },
  {
    id: 3,
    name: "Barley Vodka",
    image:
      "https://images.unsplash.com/photo-1590080875832-8405c0b4c44e?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 156,
    category: "top",
  },
  {
    id: 4,
    name: "Brazilian Rum",
    image:
      "https://images.unsplash.com/photo-1610911254767-40f1e01ac8d0?auto=format&fit=crop&w=800&q=60",
    rating: 4.8,
    reviews: 203,
    category: "best",
  },
  {
    id: 5,
    name: "Dessert Tequila",
    image:
      "https://images.unsplash.com/photo-1610641818989-77cf0b4574d6?auto=format&fit=crop&w=800&q=60",
    rating: 4.9,
    reviews: 178,
    category: "top",
  },
  {
    id: 6,
    name: "Premium Vodka",
    image:
      "https://parisdrinksguide.com/cont/blog/imagePot/08312021084700000000-612e32d4e5217.jpg",
    rating: 4.7,
    reviews: 142,
    category: "best",
  },
];

const TopRating: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.user);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [filter, setFilter] = useState<"top" | "best">("top");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getHomeTopRated();
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching top rated:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteHomeTopRated(id.toString());
      setProducts(products.filter(p => p.id !== id));
      toast.success("Item deleted");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const filteredProducts = products.filter(
    (product) => product.category === filter
  );

  return (
    <section className="w-full bg-white py-1 px-4 md:px-2 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-100/30 to-orange-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">
                Popular Picks
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Rated Products
            </h2>

            {/* Filter Buttons */}
            <div className="flex gap-3">
              {[
                { type: "top", label: "Top Rating", icon: Star },
                { type: "best", label: "Best Selling", icon: Award }
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as "top" | "best")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${filter === type
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {role === "ADMIN" && (
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-yellow-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:bg-yellow-700 hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          )}
        </div>

        {/* Horizontal Scrolling Products */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {filteredProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
              >
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                  {/* Image */}
                  <div className="relative h-[280px] overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-900">{item.rating}</span>
                      </div>
                    </div>

                    {/* Admin Controls */}
                    {role === "ADMIN" && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-colors"
                        >
                          <Pencil size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${i < Math.floor(item.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({item.reviews} reviews)
                      </span>
                    </div>

                    {/* View Button */}
                    <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2.5 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg">
                      View Details
                    </button>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}

            {/* Add New Card (Admin Only) */}
            {role === "ADMIN" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: filteredProducts.length * 0.1 }}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
              >
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsModalOpen(true);
                  }}
                  className="w-full h-[440px] rounded-2xl border-2 border-dashed border-gray-300 hover:border-yellow-500 bg-gray-50 hover:bg-yellow-50 transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200 group-hover:bg-yellow-100 flex items-center justify-center transition-colors">
                    <Plus size={32} className="text-gray-400 group-hover:text-yellow-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-700 group-hover:text-yellow-600 transition-colors">
                      Add New Product
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to create
                    </p>
                  </div>
                </button>
              </motion.div>
            )}
          </div>

          {/* Scroll Hint */}
          {filteredProducts.length > 3 && (
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      <TopRatedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSuccess={(newItem) => {
          if (editingItem) {
            setProducts(products.map(p => p.id === newItem.id ? newItem : p));
            toast.success("Item updated");
          } else {
            setProducts([...products, newItem]);
            toast.success("Item created");
          }
          setIsModalOpen(false);
        }}
      />

    </section>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Product | null;
  onSuccess: (item: Product) => void;
}

const TopRatedModal: React.FC<ModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    reviews: 0,
    category: "top",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          name: initialData.name,
          rating: initialData.rating,
          reviews: initialData.reviews,
          category: initialData.category,
        });
        setPreview(initialData.image);
      } else {
        setForm({
          name: "",
          rating: 5,
          reviews: 0,
          category: "top",
        });
        setPreview("");
      }
      setImageFile(null);
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("rating", form.rating.toString());
      formData.append("reviews", form.reviews.toString());
      formData.append("category", form.category);
      if (imageFile) formData.append("image", imageFile);

      let response;
      if (initialData) {
        response = await updateHomeTopRated(initialData.id.toString(), formData);
      } else {
        response = await createHomeTopRated(formData);
      }

      if (response.data) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{initialData ? "Edit Item" : "New Item"}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <UploadCloud size={32} />
                      <span className="text-sm mt-2">Click to upload image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as "top" | "best" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                  >
                    <option value="top">Top Rating</option>
                    <option value="best">Best Selling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Review Count</label>
                <input
                  type="number"
                  min="0"
                  value={form.reviews}
                  onChange={(e) => setForm({ ...form, reviews: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TopRating;
