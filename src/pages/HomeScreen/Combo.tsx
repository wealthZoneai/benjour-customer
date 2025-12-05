import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Pencil, Trash2, X, Loader2, UploadCloud, Tag, Sparkles } from "lucide-react";
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
    <section className="w-full bg-white py-6 px-4 md:px-5 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-100/30 to-red-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag size={20} className="text-orange-600" />
              <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                Special Deals
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Combo Collections
            </h2>
            <p className="text-gray-600">
              Handpicked sets for every occasion
            </p>
          </div>

          {role === "ADMIN" && (
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Combo</span>
            </button>
          )}
        </div>

        {/* Horizontal Scrolling Combos */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x no-scrollbar snap-mandatory">
            {combos.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[320px] sm:w-[380px] snap-start"
              >
                <div className="relative h-[420px] rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} />
                      <span className="text-sm font-bold">Special Offer</span>
                    </div>
                  </div>

                  {/* Admin Controls */}
                  {role === "ADMIN" && (
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-colors"
                      >
                        <Pencil size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-200 text-sm mb-4">
                        {item.subtitle}
                      </p>
                      <div className="flex items-center gap-2 text-orange-400 font-semibold">
                        <span className="text-sm">Shop Now</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}

            {/* Add New Card (Admin Only) */}
            {role === "ADMIN" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: combos.length * 0.1 }}
                className="flex-shrink-0 w-[320px] sm:w-[380px] snap-start"
              >
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsModalOpen(true);
                  }}
                  className="w-full h-[420px] rounded-3xl border-2 border-dashed border-gray-300 hover:border-orange-500 bg-gray-50 hover:bg-orange-50 transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                    <Plus size={32} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                      Add New Combo
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
          {combos.length > 3 && (
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{initialData ? "Edit Combo" : "New Combo"}</h2>
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
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  required
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border"
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
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 flex items-center gap-2 transition-all"
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
