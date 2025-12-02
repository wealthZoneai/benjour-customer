import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCardProps";
import { ChevronLeft, X, Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import PageHeader from "./PageHeader";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import {
  getAlcoholItems,
  createAlcoholItem,
  updateAlcoholItem,
  deleteAlcoholItem,
} from "../../services/apiHelpers";
import CreateItemModal from "../../components/CreateItemModal";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-hot-toast";


export interface Product {
  id: number; // Keeping as number to match ProductCardProps
  name: string;
  image: string;
  price: number;
  discount?: number;
  rating?: number;
  category: string;
  description?: string;
  subCategoryId?: number;
  isFavorite?: boolean;
}

const defaultItems: Product[] = [
  { id: 1, name: "Chateau Margaux 2015", image: "https://cdn.shopify.com/s/files/1/0062/7775/9094/files/ChateauMargauxPavillonRouge2005_750ml_360x.jpg?v=1721409466", price: 250, discount: 10, rating: 4.8, category: "wine", description: "Crafted with exceptional care and tradition, this premium spirit offers a smooth, rich flavor with a balanced finish. Perfect for celebrations or quiet moments, it embodies timeless quality and the artistry of fine distillation in every sip." },
  { id: 2, name: "Penfolds Grange", image: "https://hedonism.co.uk/sites/default/files/uploads/styles/product_large/cms/vintner/vintner-images/HED24614.JPG.webp", price: 220, discount: 5, rating: 4.7, category: "wine", description: "Crafted with exceptional care and tradition, this premium spirit offers a smooth, rich flavor with a balanced finish. Perfect for celebrations or quiet moments, it embodies timeless quality and the artistry of fine distillation in every sip." },
];

const AlcoholItems: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.user);

  const [items, setItems] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: number }>({ isOpen: false });
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);

  const categoryInfo: Record<string, { tagline: string; emoji: string }> = {
    wine: { tagline: "Sip, Savor, and Celebrate Life.", emoji: "🍷" },
    whisky: { tagline: "Aged to Perfection, Just for You.", emoji: "🥃" },
    vodka: { tagline: "Pure Spirit, Pure Joy.", emoji: "🍸" },
    rum: { tagline: "The Spirit of the Islands.", emoji: "🏴‍☠️" },
    tequila: { tagline: "Life is Better with Tequila.", emoji: "🌵" },
    beer: { tagline: "Brewed for Good Times.", emoji: "🍺" },
  };

  const info = categoryInfo[category?.toLowerCase() || ""] || {
    tagline: "Premium Selection",
    emoji: "🥂",
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  const fetchItems = async () => {
    try {
      setFetchingItems(true);
      // If category is not present, maybe fetch all? Or handle error.
      // Assuming getAlcoholItems handles the category param.
      const response = await getAlcoholItems(category || "wine");
      if (response.data && Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        // Fallback if API returns empty or invalid
        // setItems(defaultItems); 
        // Actually, let's just set empty if API works but returns nothing.
        // If API fails, we might want to show defaults for demo?
        // Let's stick to empty array if success but empty.
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems(defaultItems); // Fallback for demo/error
      toast.error("Using default items. Connection failed.");
    } finally {
      setFetchingItems(false);
    }
  };

  const handleSubmitItem = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append all data fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'file' && data[key]) {
          formData.append('image', data[key]); // API expects 'image' usually
        } else if (key !== 'file' && key !== 'preview' && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Add category if not present (though modal might not have it, we can inject it)
      if (!data.category && category) {
        formData.append('category', category);
      }

      if (editingItem) {
        const response = await updateAlcoholItem(editingItem.id.toString(), formData);
        if (response.data) {
          setItems(items.map(item =>
            item.id === editingItem.id ? response.data : item
          ));
          toast.success("Item updated successfully!");
        }
        setEditingItem(null);
      } else {
        const response = await createAlcoholItem(formData);
        if (response.data) {
          setItems([...items, response.data]);
          toast.success("Item created successfully!");
        }
      }
      setItemModalOpen(false);
    } catch (err: any) {
      console.error("Error saving item:", err);
      toast.error(err.response?.data?.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (item: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id: item.id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      setLoading(true);
      await deleteAlcoholItem(deleteModal.id.toString());
      setItems(items.filter(item => item.id !== deleteModal.id));
      toast.success("Item deleted successfully!");
      setDeleteModal({ isOpen: false, id: undefined });
    } catch (err: any) {
      console.error("Error deleting item:", err);
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  const categoryProducts = items.filter(
    (product) => product.category.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="pt-16">
        <PageHeader
          title={category || "Alcohol"}
          tagline={info.tagline}
          emoji={info.emoji}
        />
      </div>

      {/* Actions Bar */}
      {role === "ADMIN" && (
        <div className="max-w-7xl mx-auto px-6 mt-6 flex justify-end">
          <button
            onClick={() => {
              setEditingItem(null);
              setItemModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
          >
            <Plus size={20} />
            <span>Add Item</span>
          </button>
        </div>
      )}

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {fetchingItems ? (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-gray-100">
                <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categoryProducts.length > 0 ? (
              categoryProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    category={product.category}
                    price={product.price}
                    image={product.image}
                    discount={product.discount}
                    rating={product.rating}
                    onViewDetails={() => setSelectedProduct(product)}
                  />

                  {/* Admin Actions Overlay */}
                  {role === "ADMIN" && (
                    <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(product);
                          setItemModalOpen(true);
                        }}
                        className="p-2 bg-white/90 text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteItem(product, e)}
                        className="p-2 bg-white/90 text-red-600 rounded-full shadow-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">No items found</h3>
                <p className="text-gray-500 mt-2">Try checking back later or add a new item.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors md:hidden"
                  onClick={() => setSelectedProduct(null)}
                >
                  <ChevronLeft size={24} />
                </button>
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                      {selectedProduct.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    ${selectedProduct.price}
                  </div>
                  {selectedProduct.discount && selectedProduct.discount > 0 && (
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      {selectedProduct.discount}% OFF
                    </div>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="font-semibold text-gray-700">
                      {selectedProduct.rating}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  {selectedProduct.description || "No description available for this premium product."}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <button
                    className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                    onClick={() => {
                      toast.success("Added to cart!");
                      setSelectedProduct(null);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <CreateItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmitItem}
        initialData={editingItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: undefined })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to remove this product? This action cannot be undone."
      />
    </div>
  );
};

export default AlcoholItems;
