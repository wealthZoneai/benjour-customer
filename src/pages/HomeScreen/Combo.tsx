import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Pencil, Trash2, X, Loader2, UploadCloud } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import type { RootState } from "../../Redux/store";
import {
  getHomeCombos,
  createHomeCombo,
  updateHomeCombo,
  deleteHomeCombo
} from "../../services/apiHelpers";

interface ComboItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  className: string;
}

const defaultCombos: ComboItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbmVzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
    title: "The Taste of Europe",
    subtitle: "Curated wines from Italy, France & Spain",
    className: "md:col-span-2 md:row-span-2 h-[500px]",
  },
  {
    id: 2,
    image: "https://plus.unsplash.com/premium_photo-1682097091093-dd18b37764a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2luZXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000",
    title: "Mixed Wine Packs",
    subtitle: "Perfect for tasting parties",
    className: "md:col-span-1 md:row-span-1 h-[240px]",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=1000",
    title: "Paris Best Reds",
    subtitle: "Bold & Elegant",
    className: "md:col-span-1 md:row-span-1 h-[240px]",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=1000",
    title: "Classic Collection",
    subtitle: "Timeless favorites",
    className: "md:col-span-2 md:row-span-1 h-[240px]",
  },
];

const Combo: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.user);
  const [combos, setCombos] = useState<ComboItem[]>(defaultCombos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ComboItem | null>(null);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await getHomeCombos();
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setCombos(response.data);
      }
    } catch (error) {
      console.error("Error fetching combos:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this combo?")) return;
    try {
      await deleteHomeCombo(id.toString());
      setCombos(combos.filter(c => c.id !== id));
      toast.success("Combo deleted successfully");
    } catch (error) {
      console.error("Error deleting combo:", error);
      toast.error("Failed to delete combo");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Combo Collections
          </h2>
          <p className="text-gray-500 text-lg">
            Handpicked sets for every occasion.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {role === "ADMIN" && (
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} /> Add Combo
            </button>
          )}
          <button className="hidden md:flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all">
            View All Collections <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {combos.map((item, index) => (
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

            {/* Admin Actions */}
            {role === "ADMIN" && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-white/90 text-blue-600 rounded-full hover:bg-white"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

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

      <ComboModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSuccess={(newItem) => {
          if (editingItem) {
            setCombos(combos.map(c => c.id === newItem.id ? newItem : c));
            toast.success("Combo updated successfully");
          } else {
            setCombos([...combos, newItem]);
            toast.success("Combo created successfully");
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
  initialData: ComboItem | null;
  onSuccess: (item: ComboItem) => void;
}

const ComboModal: React.FC<ModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    className: "md:col-span-1 md:row-span-1 h-[240px]",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title,
          subtitle: initialData.subtitle,
          className: initialData.className,
        });
        setPreview(initialData.image);
      } else {
        setForm({
          title: "",
          subtitle: "",
          className: "md:col-span-1 md:row-span-1 h-[240px]",
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
      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("className", form.className);
      if (imageFile) formData.append("image", imageFile);

      let response;
      if (initialData) {
        response = await updateHomeCombo(initialData.id.toString(), formData);
      } else {
        response = await createHomeCombo(formData);
      }

      if (response.data) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Error saving combo:", error);
      toast.error("Failed to save combo");
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
              <h2 className="text-xl font-bold">{initialData ? "Edit Combo" : "New Combo"}</h2>
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
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  required
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Size / Layout</label>
                <select
                  value={form.className}
                  onChange={(e) => setForm({ ...form, className: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                >
                  <option value="md:col-span-1 md:row-span-1 h-[240px]">Small Square</option>
                  <option value="md:col-span-2 md:row-span-1 h-[240px]">Wide Rectangle</option>
                  <option value="md:col-span-2 md:row-span-2 h-[500px]">Large Square</option>
                </select>
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

export default Combo;
