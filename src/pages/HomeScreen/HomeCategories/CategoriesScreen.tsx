import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import { Loader2, Plus } from "lucide-react";
import type { RootState } from "../../../Redux/store";

// import { getMainCategories } from "../../../services/apiHelpers";
import CategoryCard from "./CategoryCard";
import CreateCategoryModal from "./CreateMainCategoryModal";
import DeleteModal from "../../../components/DeleteModal";
import { getMainCategories, createMainCategory, updateMainCategory, deleteMainCategory } from "../../../services/apiHelpers";

// --- Types ---
interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  status: boolean;
}


const dummyCategories: Category[] = [
  {
    id: "1",
    name: "Groceries",
    description: "All your daily essentials",
    imageUrl: "https://via.placeholder.com/400/300?text=Groceries",
    status: true,
  },
  {
    id: "2",
    name: "Alcohol & Liquor",
    description: "Beer, wine, spirits, and mixers",
    imageUrl: "https://via.placeholder.com/400/300?text=Alcohol",
    status: true,
  },
  {
    id: "3",
    name: "Beverages",
    description: "Sodas, juices, water, and coffee",
    imageUrl: "https://via.placeholder.com/400/300?text=Drinks",
    status: true,
  },
  {
    id: "4",
    name: "Electronics",
    description: "Gadgets and smart home devices",
    imageUrl: "https://via.placeholder.com/400/300?text=Electronics",
    status: true,
  },
  {
    id: "4",
    name: "Electronics",
    description: "Gadgets and smart home devices",
    imageUrl: "https://via.placeholder.com/400/300?text=Electronics",
    status: true,
  },
];

const CategoriesScreen: React.FC = () => {
  const navigate = useNavigate();
  // Using a mock role for demonstration, replace with actual state.user.role
  const { role } = useSelector((state: RootState) => state.user);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false); // Changed to false for better initial display
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id?: string | null;
  }>({ isOpen: false, id: null });

  // Disabled initial fetchCategories for brevity, assuming dummy data is used.
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };


  return (
    // IMPROVEMENT 1: New background (less flat white)
    <div className="w-full py-16 px-4 md:px-8 bg-gray-100/50 relative">

      {/* Improvement 2: Unified Header with Action Button */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b pb-4 border-gray-200">
        <div>
          <h5 className="text-emerald-600 font-semibold uppercase text-sm tracking-widest mb-1">
            Product Organization
          </h5>
          <h2 className="text-5xl font-extrabold text-zinc-900 leading-tight">
            Shop Collections
          </h2>
        </div>

        {role === "ADMIN" && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-zinc-800 text-white px-6 py-3 rounded-xl shadow-lg shadow-zinc-800/30 transition-all hover:bg-zinc-900"
          >
            <Plus size={20} className="w-4 h-4" />
            <span className="font-semibold text-sm">Add New Category</span>
          </motion.button>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Improvement 3: More Aggressive Grid Spacing */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" // Increased gap to gap-8
            >
              {categories.map((cat) => (
                <motion.div key={cat.id} variants={itemVariants}>
                  {/* CategoryCard component integration */}
                  <CategoryCard
                    item={cat}
                    isAdmin={role === "ADMIN"}
                    onClick={() => navigate(`/category/${cat.id}`)}
                    onEdit={(e: any) => handleEdit(cat, e)}
                    onDelete={(e: any) => handleDelete(cat.id, e)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
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
