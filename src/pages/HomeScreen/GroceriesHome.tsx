import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Pencil, Trash2, X, UploadCloud, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { RootState } from "../../Redux/store";
// import {
//   getHomeGroceries,
//   createHomeGrocery,
//   updateHomeGrocery,
//   deleteHomeGrocery
// } from "../../services/apiHelpers";

interface GroceryItem {
  id: number;
  name: string;
  image: string;
}

const fallbackImage =
  "https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2024-07/grocery-list-1024x536.jpg";

const defaultGroceries: GroceryItem[] = [
  {
    id: 1,
    name: "Pastries",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTetSsIU-nc7l9osF0VY6KxpgLD4qBZQPIUAQ&s",
  },
  {
    id: 2,
    name: "Popcorn",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/057/197/431/small/tasty-popcorn-in-a-classic-striped-bucket-at-a-cozy-cinema-snack-bar-during-an-evening-movie-photo.jpeg",
  },
  
];

const GroceriesHome: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.user);
  const [groceries, setGroceries] = useState<GroceryItem[]>(defaultGroceries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      // const response = await getHomeGroceries();
      // if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      //   setGroceries(response.data);
      // }
    } catch (error) {
      console.error("Error fetching groceries:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      // await deleteHomeGrocery(id.toString());
      setGroceries(groceries.filter(g => g.id !== id));
      toast.success("Item deleted");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  return (
    <section className="py-10 bg-white text-center relative">
      {/* Admin Add Button */}
      {role === "ADMIN" && (
        <div className="absolute top-10 right-6 z-10">
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

      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-700 mb-10">Groceries</h2>

      {/* Flex Layout */}
      <div className="flex flex-wrap justify-center gap-8 px-4">
        {groceries.map((item) => (
          <div key={item.id} className="relative group">
            <ImageCard item={item} />

            {/* Admin Actions */}
            {role === "ADMIN" && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
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
          </div>
        ))}
      </div>

      <GroceryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSuccess={(newItem) => {
          if (editingItem) {
            setGroceries(groceries.map(g => g.id === newItem.id ? newItem : g));
            toast.success("Item updated");
          } else {
            setGroceries([...groceries, newItem]);
            toast.success("Item created");
          }
          setIsModalOpen(false);
        }}
      />
    </section>
  );
};

const ImageCard: React.FC<{ item: GroceryItem }> = ({ item }) => {
  const [imgSrc, setImgSrc] = useState(item.image);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-80 h-60 sm:w-96 sm:h-72 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 group">
      {/* Loading Gradient */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={imgSrc}
        alt={item.name}
        className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"
          }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackImage);
          setIsLoading(false);
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Overlay Title */}
      <h3 className="absolute bottom-0 left-0 w-full text-lg font-semibold text-white py-3 transition-all duration-500 transform group-hover:-translate-y-2">
        {item.name}
      </h3>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: GroceryItem | null;
  onSuccess: (item: GroceryItem) => void;
}

const GroceryModal: React.FC<ModalProps> = ({ isOpen, onClose, initialData }) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setPreview(initialData.image);
      } else {
        setName("");
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
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);

      // let response;
      // if (initialData) {
      //   response = await updateHomeGrocery(initialData.id.toString(), formData);
      // } else {
      //   response = await createHomeGrocery(formData);
      // }

      // if (response.data) {
      //   onSuccess(response.data);
      // }
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
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
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

export default GroceriesHome;
