import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GroceriesBanner from "./GroceriesBanner";
import { ChevronRight, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import CreateCategoryModal from "../../components/CreateCategoryModal";
import DeleteModal from "../../components/DeleteModal";
import { getGroceryCategories, createGroceryCategory, updateGroceryCategory, deleteGroceryCategory } from "../../services/apiHelpers";
import { toast } from "react-hot-toast";



const Grocery: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.user);
  const [categoriesList, setCategoriesList] = useState<any>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: any }>({ isOpen: false });
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setFetchingCategories(true);
      const response = await getGroceryCategories();
      if (response.data && Array.isArray(response.data)) {
        setCategoriesList(response?.data);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      // Use fallback categories on error
      setCategoriesList([]) ;
      toast.error("Using default categories. Please check your connection.");
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleCreateCategory = async (categoryData: any) => {
    try {
      setLoading(true);
      if (editingCategory) {
        // Update existing category
        const response = await updateGroceryCategory(editingCategory.id, categoryData);
        if (response.data) {
          setCategoriesList(categoriesList.map((cat:any) =>
            cat.id === editingCategory.id ? response.data : cat
          ));
          toast.success("Category updated successfully!");
        }
        setEditingCategory(null);
      } else {
        // Create new category
        const response = await createGroceryCategory(categoryData);
        if (response.data) {
          setCategoriesList([...categoriesList, response.data]);
          toast.success("Category created successfully!");
        }
      }
      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error("Error saving category:", err);
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category);
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (category: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id: category.id })
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      setLoading(true);
      await deleteGroceryCategory(deleteModal.id);
      setCategoriesList((prev:any) => prev.filter((i: any) => i.id !== deleteModal.id));
      toast.success("Category deleted successfully!");
      setDeleteModal({ isOpen: false, id: null });
    } catch (err: any) {
      console.error("Error deleting category:", err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };


  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen mt-10 bg-linear-to-br  from-gray-50 via-white to-gray-50">
      <GroceriesBanner />

      {/* Shop by Category */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the freshest groceries handpicked for your daily needs.
            </p>
          </div>

          {/* Admin Create Button */}
          {role === "ADMIN" && (
            <div className="flex justify-end mb-8">
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Create Category
              </button>
            </div>
          )}

          {/* Loading State */}
         {fetchingCategories ? (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {categoriesList.map((category: any, index: number) => (
      <motion.div
        key={category.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * (index + 1) }}
        whileHover={{ scale: 1.03 }}
        className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${category.gradient} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer`}
        onClick={() => navigate(`/grocery/${category.name}`)}
      >
        {/* IMAGE */}
        <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>

          {/* ADMIN BUTTONS */}
          {role === "ADMIN" && (
            <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

              {/* EDIT BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 prevent navigation
                  handleEditClick(category, e);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-all transform hover:scale-110"
                title="Edit Category"
              >
                <Pencil size={16} />
              </button>

              {/* DELETE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 prevents navigate
                  handleDeleteClick(category , e);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm transition-all transform hover:scale-110"
                title="Delete Category"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
            {category.displayName}
          </h3>

          <p className="text-gray-600 text-sm mb-4">
            {category.description}
          </p>

          <div
            className={`flex items-center text-sm font-medium ${category.iconColor}`}
          >
            Explore <ChevronRight className="w-4 h-4 ml-1" />
          </div>

          {/* PRODUCT COUNT */}
          <p className="mt-4 text-gray-700 font-medium">
            {category?.products?.length
              ? `${category.products.length} products`
              : "No products available"}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
)}

        </div>
      </div>


      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateCategory}
        initialData={editingCategory}
        isLoading={loading}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to permanently delete this item?"
      />

    </div >
  );
};

export default Grocery;
