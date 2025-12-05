import React, { useState, useEffect } from "react";
import { Star, Plus, Pencil, Trash2, X, UploadCloud, Loader2 } from "lucide-react";
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
    reviews: 1,
    category: "top",
  },
  {
    id: 2,
    name: "Honey Beer",
    image: "https://images.unsplash.com/photo-1542959863-3f384b6b1624?auto=format&fit=crop&w=800&q=60",
    rating: 4,
    reviews: 1,
    category: "best",
  },
  {
    id: 3,
    name: "Barley Vodka",
    image:
      "https://images.unsplash.com/photo-1590080875832-8405c0b4c44e?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 1,
    category: "top",
  },
  {
    id: 4,
    name: "Brazilian Rum",
    image:
      "https://images.unsplash.com/photo-1610911254767-40f1e01ac8d0?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 1,
    category: "best",
  },
  {
    id: 5,
    name: "Dessert Tequila",
    image:
      "https://images.unsplash.com/photo-1610641818989-77cf0b4574d6?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 1,
    category: "top",
  },
  {
    id: 6,
    name: "Premium Vodka",
    image:
      "https://parisdrinksguide.com/cont/blog/imagePot/08312021084700000000-612e32d4e5217.jpg",
    rating: 5,
    reviews: 1,
    category: "best",
  },
];

const ImageWithLoader: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-full h-[320px] overflow-hidden rounded-t-2xl bg-gray-200">
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
      )}
      <img
        src={isError ? fallbackImage : src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        className={`w-full h-full object-cover transform transition-transform duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
          } hover:scale-110`}
      />
    </div>
  );
};

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
    <section className="max-w-7xl mx-auto px-6 py-10 relative">
      {/* Admin Add Button */}
      {role === "ADMIN" && (
        <div className="absolute top-10 right-6">
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex justify-center mb-10 space-x-4">
        {["top", "best"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as "top" | "best")}
            className={`px-6 py-2 border border-yellow-500 font-semibold text-sm transition-all duration-300 ${filter === type
                ? "bg-yellow-500 text-white shadow-md scale-105"
                : "text-yellow-600 hover:bg-yellow-100"
              }`}
          >
            {type === "top" ? "TOP RATING" : "BEST SELLING"}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="flex flex-wrap justify-center gap-10">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 w-[380px] overflow-hidden relative"
          >
            {/* Image */}
            <ImageWithLoader src={item.image} alt={item.name} />

            {/* Admin Actions */}
            {role === "ADMIN" && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-white/90 text-blue-600 rounded-full hover:bg-white shadow-sm"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-5 text-center transition-transform duration-500 group-hover:-translate-y-1">
              {/* Star Rating */}
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < item.rating ? "#FFD700" : "none"}
                    stroke={i < item.rating ? "#FFD700" : "#ccc"}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  ({item.reviews} review)
                </span>
              </div>

              {/* Product Name */}
              <h3 className="text-gray-900 font-semibold text-lg transition-all duration-300 group-hover:text-yellow-500 group-hover:-translate-y-1">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{initialData ? "Edit Item" : "New Item"}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
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
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
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
