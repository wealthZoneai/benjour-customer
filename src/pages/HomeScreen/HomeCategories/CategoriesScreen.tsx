import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader2, Plus, ChevronRight, Sparkles } from "lucide-react";
import type { RootState } from "../../../Redux/store";
import CreateCategoryModal from "./CreateMainCategoryModal";
import DeleteModal from "../../../components/DeleteModal";
import { getMainCategories, createMainCategory, updateMainCategory, deleteMainCategory } from "../../../services/apiHelpers";

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  status: boolean;
}

const CategoriesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.user);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: string | null }>({ isOpen: false, id: null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getMainCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await deleteMainCategory(deleteModal.id);
      toast.success("Category deleted successfully!");
      fetchCategories();
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="w-full py-12 px-4 md:px-8 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Explore
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-600 mt-2">
              Browse through our curated collections
            </p>
          </div>

          {role === "ADMIN" && (
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Category</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Horizontal Scrolling Categories */}
            <div className="relative">
              {/* Scroll Container */}
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                  >
                    <div
                      onClick={() => navigate(`/category/${category.id}`)}
                      className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Image */}
                      <img
                        src={category.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {category.name}
                          </h3>
                          <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                            {category.description}
                          </p>
                          <div className="flex items-center gap-2 text-white font-semibold">
                            <span className="text-sm">Explore</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Admin Controls */}
                      {role === "ADMIN" && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button
                            onClick={(e) => handleEdit(category, e)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-colors"
                          >
                            <Plus size={16} className="text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(category.id, e)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-colors"
                          >
                            <Plus size={16} className="text-red-600 rotate-45" />
                          </button>
                        </div>
                      )}

                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}

                {/* Add New Card (Admin Only) */}
                {role === "ADMIN" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categories.length * 0.1 }}
                    className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                  >
                    <button
                      onClick={handleCreateNew}
                      className="w-full h-[380px] rounded-3xl border-2 border-dashed border-gray-300 hover:border-emerald-500 bg-gray-50 hover:bg-emerald-50 transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-200 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                        <Plus size={32} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">
                          Add New Category
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
              {categories.length > 3 && (
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={() => {
          fetchCategories();
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to permanently delete this category? This action cannot be undone."
      />

    </div>
  );
};

export default CategoriesScreen;
