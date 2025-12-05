import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import CreateCategoryModal from "../../components/CreateCategoryModal";
import DeleteModal from "../../components/DeleteModal";
import { getCategoryById, getCategorySubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from "../../services/apiHelpers";
import { toast } from "react-hot-toast";
import SubCategoryBanner from "./SubCategoryBanner";

const SubCategoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams<{ categoryId: string }>();
    const { role } = useSelector((state: RootState) => state.user);

    const [category, setCategory] = useState<any>(null);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: any }>({ isOpen: false });
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    useEffect(() => {
        if (categoryId) {
            fetchCategoryData();
        }
    }, [categoryId]);

    const fetchCategoryData = async () => {
        try {
            setFetchingData(true);

            // Fetch category details
            const categoryResponse = await getCategoryById(categoryId!);
            if (categoryResponse.data) {
                setCategory(categoryResponse.data);
            }
            console.log(categoryId);
            // Fetch subcategories
            const subcategoriesResponse = await getCategorySubcategories(categoryId!);
            if (subcategoriesResponse.data && Array.isArray(subcategoriesResponse.data)) {
                setSubcategories(subcategoriesResponse.data);
            }
        } catch (err: any) {
            console.error("Error fetching category data:", err);
            setSubcategories([]);
            toast.error("Failed to load category data");
        } finally {
            setFetchingData(false);
        }
    };

    const handleCreateSubcategory = async (subcategoryData: any) => {
        try {
            setLoading(true);
            if (editingSubcategory) {
                // Update existing subcategory
                const response = await updateSubcategory(editingSubcategory.id, subcategoryData?.data);
                if (response.data) {
                    setSubcategories(subcategories.map((sub: any) =>
                        sub.id === editingSubcategory.id ? response.data : sub
                    ));
                    toast.success("Subcategory updated successfully!");
                }
                setEditingSubcategory(null);
            } else {
                // Create new subcategory
                const response = await createSubcategory(categoryId!, subcategoryData?.data);
                if (response.data) {
                    toast.success("Subcategory created successfully!");
                    fetchCategoryData();
                }
            }
            setIsCreateModalOpen(false);
        } catch (err: any) {
            console.error("Error saving subcategory:", err);
            toast.error(err.response?.data?.message || "Failed to save subcategory");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (subcategory: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSubcategory(subcategory);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (subcategory: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, id: subcategory.id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;

        try {
            const response = await deleteSubcategory(deleteModal.id);
            if (response.data) {
                toast.success("Subcategory deleted successfully!");
                fetchCategoryData();
                setDeleteModal({ isOpen: false, id: null });
            }
        } catch (err: any) {
            console.error("Error deleting subcategory:", err);
            toast.error("Failed to delete subcategory");
        }
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setEditingSubcategory(null);
    };

    if (fetchingData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-10 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <SubCategoryBanner
                title={category?.name || "Category"}
                description={category?.description || "Explore our selection"}
                image={category?.imageUrl}
            />

            {/* Shop by Subcategory */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Shop by Category
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore {category?.name || "our"} collection
                        </p>
                    </div>

                    {/* Admin Create Button */}
                    {role === "ADMIN" && (
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={() => {
                                    setEditingSubcategory(null);
                                    setIsCreateModalOpen(true);
                                }}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                <Plus size={20} />
                                Create Subcategory
                            </button>
                        </div>
                    )}

                    {/* Subcategories Grid */}
                    {fetchingData ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {subcategories.length === 0 ? (
                                <div className="w-full py-20 flex justify-center items-center">
                                    <p className="text-gray-500 text-lg font-medium">
                                        No Data Found
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {subcategories.map((subcategory: any, index: number) => (
                                        <motion.div
                                            key={subcategory.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * (index + 1) }}
                                            whileHover={{ scale: 1.03 }}
                                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                                            onClick={() =>
                                                navigate(`/category/${categoryId}/items/${subcategory.id}`)
                                            }
                                        >
                                            {/* IMAGE */}
                                            <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                                                <img
                                                    src={
                                                        subcategory.imageUrl ||
                                                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                                                    }
                                                    alt={subcategory.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                                                {/* ADMIN BUTTONS */}
                                                {role === "ADMIN" && (
                                                    <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        {/* EDIT */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditClick(subcategory, e);
                                                            }}
                                                            className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-transform hover:scale-110"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        {/* DELETE */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(subcategory, e);
                                                            }}
                                                            className="p-2 bg-white/90 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm transition-transform hover:scale-110"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CONTENT */}
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                                                    {subcategory.name}
                                                </h3>

                                                <p className="text-gray-600 text-sm mb-4">
                                                    {subcategory.description || "Explore this category"}
                                                </p>

                                                <div className="flex items-center text-sm font-medium text-green-600">
                                                    Explore <ChevronRight className="w-4 h-4 ml-1" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>

            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateSubcategory}
                initialData={editingSubcategory}
                isLoading={loading}
            />
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Subcategory"
                message="Are you sure you want to permanently delete this subcategory?"
            />
        </div>
    );
};

export default SubCategoryPage;
