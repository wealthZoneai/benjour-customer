import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, UploadCloud, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { RootState } from "../../Redux/store";
import { getHomeBanner, updateHomeBanner } from "../../services/apiHelpers";

interface BannerData {
  videoUrl?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

const fallbackBanner: BannerData = {
  imageUrl:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  title: "Everything You Crave, Delivered Fast.",
  subtitle:
    "From fresh groceries to fine spirits — shop all your essentials in one place.",
};

const HomeBanner: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.user);
  const [bannerData, setBannerData] = useState<BannerData>(fallbackBanner);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await getHomeBanner();
      if (response.data) {
        setBannerData(response.data);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      // Keep fallback
    }
  };

  // Video handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsVideoReady(true);
    const handlePlay = () => setIsVideoPlaying(true);
    const handleWaiting = () => setIsVideoPlaying(false);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("waiting", handleWaiting);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("waiting", handleWaiting);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && bannerData.videoUrl) {
      video.src = bannerData.videoUrl;
      video.load();
      video.play().catch(() => setIsVideoPlaying(false));
    }
  }, [bannerData.videoUrl]);

  return (
    <div className="relative w-[98%] h-[50vh] flex overflow-hidden rounded-b-3xl mt-16 mx-auto bg-transparent group">
      {/* Media */}
      {(!isVideoPlaying || !bannerData.videoUrl) && (
        <img
          src={bannerData.imageUrl || fallbackBanner.imageUrl}
          alt="banner"
          className="absolute top-0 left-0 w-full h-full object-cover object-center rounded-3xl z-0"
        />
      )}

      {bannerData.videoUrl && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute top-0 left-0 w-full h-full object-cover object-center rounded-3xl transition-opacity duration-700 z-10 ${isVideoPlaying ? "opacity-100" : "opacity-0"
            }`}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-black/80 via-black/40 to-transparent z-20"></div>

      {/* Content */}
      <div className="absolute bottom-8 left-6 sm:left-12 text-white animate-fade-up z-30">
        <h1 className="text-2xl sm:text-4xl font-semibold mb-3 tracking-tight">
          {bannerData.title || fallbackBanner.title}
        </h1>
        <p className="text-sm sm:text-lg font-light opacity-90 mb-5 max-w-lg">
          {bannerData.subtitle || fallbackBanner.subtitle}
        </p>
      </div>

      {/* Admin Edit Button */}
      {role === "ADMIN" && (
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-4 right-4 z-40 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
        >
          <Pencil size={20} />
        </button>
      )}

      {/* Edit Modal */}
      <EditBannerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={bannerData}
        onSuccess={(newData) => {
          setBannerData(newData);
          setIsEditModalOpen(false);
        }}
      />

      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 1.2s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: BannerData;
  onSuccess: (data: BannerData) => void;
}

const EditBannerModal: React.FC<EditModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialData.imageUrl);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData);
      setPreview(initialData.imageUrl);
      setImageFile(null);
      setVideoFile(null);
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
      formData.append("title", form.title || "");
      formData.append("subtitle", form.subtitle || "");
      if (imageFile) formData.append("image", imageFile);
      if (videoFile) formData.append("video", videoFile);

      const response = await updateHomeBanner(formData);
      if (response.data) {
        onSuccess(response.data);
        toast.success("Banner updated successfully!");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner");
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
              <h2 className="text-xl font-bold">Edit Banner</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Banner Image</label>
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

              {/* Video Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Background Video (Optional)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Text Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <textarea
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
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

export default HomeBanner;
