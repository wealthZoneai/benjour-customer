import React, { useEffect, useState } from "react";
import { Wine, Flame, Grape, Pencil, X, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { RootState } from "../../Redux/store";
import { getHomeBrands, updateHomeBrands } from "../../services/apiHelpers";

// import wineglass from "../../assets/Glass.jpg"; // ✅ update this path if needed

interface BrandData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const defaultData: BrandData = {
  title: "Popular Brand Section",
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

  return (
    <section className="w-full mx-auto bg-white relative group/section">
      {/* Admin Edit Button */}
      {role === "ADMIN" && (
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors opacity-0 group-hover/section:opacity-100"
        >
          <Pencil size={20} />
        </button>
      )}

      {/* Header */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 mx-13 py-2 px-8">
        {data.title}
      </h2>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row justify-center px-6">
        {/* Left - Image */}
        <div className="md:w-1/2 w-full flex justify-center items-center overflow-hidden">
          <div className="relative w-full md:w-[100%] h-[320px] md:h-[400px]">
            <img
              src={data.image}
              alt="Brand Image"
              className="w-full h-full object-cover transform scale-100 transition-transform duration-500 hover:scale-110"
            />
          </div>
        </div>

        {/* Right - Content */}
        <div className="md:w-1/2 w-full bg-[#fdf3f3] md:p-12 md:text-left overflow-hidden">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {data.subtitle}
            <span className="block w-20 h-1 mt-2 bg-rose-500 rounded-full mx-auto md:mx-0"></span>
          </h3>

          <p className="text-gray-700 text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            {data.description}
          </p>

          {/* Icons Section */}
          <div className="flex justify-center md:justify-start gap-8 md:gap-10">
            {/* Wine glass */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <div className="bg-rose-100 p-4 rounded-full mb-3 shadow-sm">
                <Wine className="text-rose-600 w-7 h-7" />
              </div>
              <p className="text-gray-800 font-semibold text-sm">Wine glass</p>
            </div>

            {/* Fine smell */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <div className="bg-rose-100 p-4 rounded-full mb-3 shadow-sm">
                <Flame className="text-rose-600 w-7 h-7" />
              </div>
              <p className="text-gray-800 font-semibold text-sm">Fine smell</p>
            </div>

            {/* Unique sorts */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <div className="bg-rose-100 p-4 rounded-full mb-3 shadow-sm">
                <Grape className="text-rose-600 w-7 h-7" />
              </div>
              <p className="text-gray-800 font-semibold text-sm">Unique sorts</p>
            </div>
          </div>
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Edit Brand Section</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 border"
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
