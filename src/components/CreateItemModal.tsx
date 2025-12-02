import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  ArrowRight,
  Image as ImageIcon,
  Trash2,
  Star,
  Tag,
  DollarSign,
  Percent,
  Box,
} from "lucide-react";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  initialData?: any;
}

const defaultData = {
  subCategoryId: "",
  name: "",
  price: "",
  discount: "",
  rating: "",
  description: "",
  isFavorite: false,
  file: null as File | null,
  preview: "",
};

export default function CreateItemModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateItemModalProps) {
  const [form, setForm] = useState<typeof defaultData>(defaultData);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...defaultData, ...initialData } : defaultData);
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm((p) => ({
        ...p,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please upload an image");
    
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, file, preview: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForm((p) => ({ ...p, file: null, preview: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name is required");
    if (!form.price || Number(form.price) <= 0)
      return alert("Price must be greater than 0");
    onSubmit(form);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {initialData ? "Update Product" : "New Product"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Fill in the details to manage your inventory.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Image Upload (Span 5) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="group relative w-full aspect-[4/5] rounded-3xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 transition-all hover:border-zinc-400 dark:hover:border-zinc-600">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                      className="hidden"
                    />
                    
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        isDragging ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-500" : ""
                      }`}
                    >
                      {form.preview ? (
                        <>
                          <img
                            src={form.preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
                            <UploadCloud size={32} />
                          </div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Click or drag image
                          </p>
                          <p className="text-xs text-zinc-500 mt-2 max-w-[200px] mx-auto">
                            Supports JPG, PNG, WEBP. <br /> Max size 5MB.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Favorite Toggle as a Card */}
                  <div
                    onClick={() => setForm(p => ({...p, isFavorite: !p.isFavorite}))}
                    className={`cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                      form.isFavorite 
                        ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800" 
                        : "bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${form.isFavorite ? "bg-amber-100 text-amber-600" : "bg-zinc-100 text-zinc-500"}`}>
                        <Star size={20} fill={form.isFavorite ? "currentColor" : "none"} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Highlight Item</span>
                        <span className="text-xs text-zinc-500">Mark as favorite/bestseller</span>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${form.isFavorite ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${form.isFavorite ? 'left-7' : 'left-1'}`} />
                    </div>
                  </div>
                </div>

                {/* Right Column: Inputs (Span 7) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Name & Cat Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup label="Product Name" icon={<Box size={16} />}>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Carlsberg Elephant"
                        className="w-full bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                      />
                    </InputGroup>

                    <InputGroup label="Sub Category ID" icon={<Tag size={16} />}>
                      <input
                        type="number"
                        name="subCategoryId"
                        value={form.subCategoryId}
                        onChange={handleChange}
                        placeholder="ID"
                        className="w-full bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                      />
                    </InputGroup>
                  </div>

                  {/* Pricing Group */}
                  <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pricing & Rating</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Price</label>
                        <div className="relative group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all overflow-hidden">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            <DollarSign size={14} />
                          </div>
                          <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full pl-8 pr-3 py-2.5 bg-transparent outline-none text-sm font-semibold"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="col-span-1">
                        <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Discount</label>
                        <div className="relative group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 focus-within:border-indigo-500 transition-all overflow-hidden">
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            <Percent size={14} />
                          </div>
                          <input
                            type="number"
                            name="discount"
                            value={form.discount}
                            onChange={handleChange}
                            className="w-full pl-3 pr-8 py-2.5 bg-transparent outline-none text-sm font-semibold"
                            placeholder="0"
                          />
                        </div>
                      </div>

                       <div className="col-span-1">
                        <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Rating</label>
                        <div className="relative group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 focus-within:border-indigo-500 transition-all overflow-hidden">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400">
                            <Star size={14} fill="currentColor" />
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            max="5"
                            name="rating"
                            value={form.rating}
                            onChange={handleChange}
                            className="w-full pl-8 pr-3 py-2.5 bg-transparent outline-none text-sm font-semibold"
                            placeholder="4.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Write a catchy description..."
                      className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none text-sm"
                    />
                  </div>

                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-end gap-3 z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="group relative px-8 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold shadow-lg shadow-zinc-900/20 dark:shadow-white/20 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2"
              >
                <span>{initialData ? "Save Changes" : "Create Item"}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Utility Component for consistent input styling
function InputGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide ml-1">{label}</label>
      <div className="flex items-center gap-3 px-4 py-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-white focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all duration-300">
        <div className="text-zinc-400 dark:text-zinc-500">{icon}</div>
        {children}
      </div>
    </div>
  );
}