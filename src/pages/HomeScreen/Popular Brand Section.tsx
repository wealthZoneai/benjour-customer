import React, { useEffect, useState } from "react";
import { Wine, Pencil, X, Loader2, Award, Star, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { RootState } from "../../Redux/store";
import { getHomeBrands, updateHomeBrands } from "../../services/apiHelpers";

interface BrandData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const defaultData: BrandData = {
  title: "Popular Brands",
  subtitle: "Premium & Elegant",
  description: "Discover the world of wine — from bold reds to refreshing whites, every bottle carries a story of taste, aroma, and celebration. Explore, sip, and find the flavor that speaks to you.",
  image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2940&auto=format&fit=crop",
};

const BrandSection: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.user);
  const [data, setData] = useState<BrandData>(defaultData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await getHomeBrands();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching home brands:", error);
    }
  };

  const features = [
    { icon: Wine, label: "Premium Selection", color: "from-purple-500 to-pink-500" },
    { icon: Award, label: "Award Winning", color: "from-yellow-500 to-orange-500" },
    { icon: Star, label: "Top Rated", color: "from-blue-500 to-cyan-500" },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-2 px-4 md:px-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-cyan-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp size={20} className="text-purple-600" />
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
              Featured
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {data.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated selection of premium brands and products
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group"
        >
          {/* Admin Edit Button */}
          {role === "ADMIN" && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-4 right-4 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Pencil size={20} className="text-gray-700" />
            </button>
          )}

          <div className="grid md:grid-cols-2 gap-0">
            {/* Left - Image */}
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
              <img
                src={data.image}
                alt="Brand"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800">Premium Quality</span>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-pink-50">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {data.subtitle}
                </h3>
                <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6" />

                <p className="text-gray-700 text-base leading-relaxed mb-8">
                  {data.description}
                </p>

                {/* Feature Icons */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex flex-col items-center text-center group/feature"
                    >
                      <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl mb-3 shadow-lg group-hover/feature:scale-110 transition-transform duration-300`}>
                        <feature.icon className="text-white w-6 h-6" />
                      </div>
                      <p className="text-gray-800 font-semibold text-xs">
                        {feature.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transition-all"
                >
                  Explore Collection
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>

      <EditBrandModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={data}
        onSuccess={(newData) => {
          setData(newData);
          setIsEditModalOpen(false);
        }}
      />
    </section>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: BrandData;
  onSuccess: (data: BrandData) => void;
}

const EditBrandModal: React.FC<EditModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialData.image);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData);
      setPreview(initialData.image);
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
      formData.append("description", form.description);
      if (imageFile) formData.append("image", imageFile);

      const response = await updateHomeBrands(formData);
      if (response.data) {
        onSuccess(response.data);
        toast.success("Brand section updated successfully!");
      }
    } catch (error) {
      console.error("Error updating brand section:", error);
      toast.error("Failed to update brand section");
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
              <h2 className="text-xl font-bold">Edit Brand Section</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Section Image</label>
                <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Text Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Main Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
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
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BrandSection;
