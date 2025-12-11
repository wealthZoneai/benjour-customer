import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    ChefHat,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    Users,
    Activity,
    MapPin,
    Phone,
    MoreVertical,
    Search,
    Filter,
    ArrowRight,
    Loader2,
    XCircle,
    Calendar,
    Receipt
} from "lucide-react";
import toast from "react-hot-toast";
import { getOrdersByStatus, updateOrderStatus } from "../../../services/apiHelpers";

// --- Type Definitions (Kept the same) ---
type OrderStatus = "PLACED" | "PREPARING" | "READY" | "ASSIGNED" | "PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED";

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
    deliveryAddress: string;
    customerName?: string;
    customerPhone?: string;
}

// --- TABS Configuration (Updated Colors and Icons) ---
const TABS: { id: OrderStatus; label: string; icon: React.ReactNode; color: string; hoverColor: string }[] = [
    { id: "PLACED", label: "New Orders", icon: <Package size={18} />, color: "text-blue-600 bg-blue-50", hoverColor: "hover:bg-blue-100" },
    { id: "PREPARING", label: "Preparing", icon: <ChefHat size={18} />, color: "text-orange-600 bg-orange-50", hoverColor: "hover:bg-orange-100" },
    { id: "READY", label: "Ready for Pickup", icon: <CheckCircle size={18} />, color: "text-lime-600 bg-lime-50", hoverColor: "hover:bg-lime-100" }, // New Zomato-esque Green
    { id: "ASSIGNED", label: "Driver Assigned", icon: <Clock size={18} />, color: "text-indigo-600 bg-indigo-50", hoverColor: "hover:bg-indigo-100" },
    { id: "PICKUP", label: "Picked Up", icon: <ShoppingBag size={18} />, color: "text-purple-600 bg-purple-50", hoverColor: "hover:bg-purple-100" },
    { id: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: <Truck size={18} />, color: "text-emerald-600 bg-emerald-50", hoverColor: "hover:bg-emerald-100" },
    { id: "DELIVERED", label: "Delivered", icon: <CheckCircle size={18} />, color: "text-green-700 bg-green-100", hoverColor: "hover:bg-green-200" },
];

const AdminOrderScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<OrderStatus>("PLACED");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchOrders = useCallback(async (status: OrderStatus) => {
        setLoading(true);
        try {
            const response = await getOrdersByStatus(status);
            const data = response.data;

            const mappedOrders: Order[] = (Array.isArray(data) ? data : []).map((item: any) => ({
                id: item.id?.toString(),
                orderNumber: `ORD-${item.id}`,
                date: item.createdAt || new Date().toISOString(),
                status: status, // Important: Status is taken from the tab for display consistency
                totalAmount: item.totalAmount || 0,
                deliveryAddress: item.address?.fullAddress || "Address not provided",
                customerName: item.user?.name || "Unknown Customer",
                customerPhone: item.user?.phone || "No Phone",
                items: item.orderItems?.map((oi: any) => ({
                    id: oi.item?.id,
                    name: oi.item?.name,
                    quantity: oi.quantity,
                    price: oi.priceAtPurchase || oi.item?.price,
                    image: oi.item?.imageUrl
                })) || []
            }));

            setOrders(mappedOrders);
        } catch (error) {
            console.error("Error fetching admin orders:", error);
            toast.error("Failed to fetch orders.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        try {
            toast.loading(`Updating order ${orderId} status to ${newStatus}...`, { id: 'status-update' });
            await updateOrderStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`, { id: 'status-update' });
            // Remove the order from the current list immediately for smooth transition
            setOrders((prev) => prev.filter((o) => o.id !== orderId));

            // Optional: Re-fetch the current tab's orders after a small delay to ensure all updates are reflected
            // setTimeout(() => fetchOrders(activeTab), 500);

        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status", { id: 'status-update' });
        }
    };

    useEffect(() => {
        fetchOrders(activeTab);
    }, [activeTab, fetchOrders]);

    const filteredOrders = useMemo(() => {
        if (!searchQuery) return orders;

        const query = searchQuery.toLowerCase();
        return orders.filter(
            (order) =>
                order.customerName?.toLowerCase().includes(query) ||
                order.orderNumber.toLowerCase().includes(query) ||
                order.id.toLowerCase().includes(query)
        );
    }, [orders, searchQuery]);

    const activeTabData = TABS.find(t => t.id === activeTab);

    return (
        <div className="min-h-screen bg-gray-50 pb-12 pt-20">
            {/* Sticky Header with Stats and Tabs */}
            <div className="w-full bg-white border-b border-gray-100 shadow-lg sticky top-0 md:top-16 z-20">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    {/* Top Dashboard Stats Area */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6">
                        <StatCard
                            icon={<Activity className="text-white" size={20} />}
                            label="Live Orders"
                            value={filteredOrders.length.toString()}
                            trend="2 min average preparation"
                            color="from-red-500 to-red-600"
                        />
                        <StatCard
                            icon={<DollarSign className="text-white" size={20} />}
                            label="Today's Revenue"
                            value="₹ 45,230"
                            trend="Target met by 80%"
                            color="from-green-500 to-green-600"
                        />
                        <StatCard
                            icon={<Users className="text-white" size={20} />}
                            label="New Customers"
                            value="128"
                            trend="45% Repeat Rate"
                            color="from-yellow-500 to-yellow-600"
                        />
                        <StatCard
                            icon={<Truck className="text-white" size={20} />}
                            label="Avg. Delivery Time"
                            value="28 min"
                            trend="3 min faster than last week"
                            color="from-indigo-500 to-indigo-600"
                        />
                    </div>
                </div>

                {/* Tabs Container */}
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="overflow-x-auto pb-0.5 scrollbar-hide border-t border-gray-100">
                        <div className="flex w-max">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        relative flex items-center gap-2.5 px-6 py-4 font-semibold text-sm transition-all duration-300
                                        ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                                    `}
                                >
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${activeTab === tab.id ? tab.color : 'bg-gray-100 text-gray-500'}`}>
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                    <span className={`ml-1 px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-red-500/90 text-white' : 'bg-gray-100 text-gray-700'} text-xs font-bold`}>
                                        {orders.filter(o => o.status === tab.id).length}
                                    </span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-red-500 shadow-red-300/50 shadow-inner"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">{activeTabData?.label}</h2>
                        <span className={`px-3 py-1 rounded-full ${activeTabData?.color} text-sm font-semibold`}>
                            {filteredOrders.length} Orders
                        </span>
                    </div>

                    {/* Search Bar with updated styling */}
                    <div className="relative group w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm"
                        />
                        <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors" onClick={() => setSearchQuery("")}>
                            {searchQuery ? <XCircle size={18} /> : <Filter size={18} />}
                        </button>
                    </div>
                </div>

                {/* Orders Grid/Loading/Empty State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="h-72 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <EmptyState activeTab={activeTab} searchQuery={searchQuery} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order) => (
                                <OrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Sub-Components ---

// 1. StatCard Component (More vibrant colors)
const StatCard = ({ icon, label, value, trend, color }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <h4 className="text-3xl font-bold text-gray-900 mt-1">{value}</h4>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-gray-200`}>
                {icon}
            </div>
        </div>
        <p className="text-gray-500 text-xs font-medium mt-3 flex items-center gap-1">
            <TrendingUp size={12} className="text-green-500" /> {trend}
        </p>
    </div>
);

// 2. OrderCard Component (Zomato-style focused information)
const OrderCard = ({ order, onStatusUpdate }: { order: Order, onStatusUpdate: (id: string, status: OrderStatus) => void }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Determines the next logical status for a quick action button
    const getNextStatus = (currentStatus: OrderStatus): { id: OrderStatus, label: string, color: string } | null => {
        switch (currentStatus) {
            case "PLACED":
                return { id: "PREPARING", label: "Accept & Start Prep", color: "bg-red-500 hover:bg-red-600" };
            case "PREPARING":
                return { id: "READY", label: "Mark as Ready", color: "bg-lime-500 hover:bg-lime-600" };
            case "READY":
                return { id: "ASSIGNED", label: "Assign Driver", color: "bg-indigo-500 hover:bg-indigo-600" };
            case "ASSIGNED":
                return { id: "PICKUP", label: "Mark as Picked Up", color: "bg-purple-500 hover:bg-purple-600" };
            case "PICKUP":
                return { id: "OUT_FOR_DELIVERY", label: "Start Delivery", color: "bg-emerald-500 hover:bg-emerald-600" };
            case "OUT_FOR_DELIVERY":
                return { id: "DELIVERED", label: "Confirm Delivered", color: "bg-green-500 hover:bg-green-600" };
            default:
                return null;
        }
    };

    const nextStatus = getNextStatus(order.status);
    const orderItemsCount = order.items.length;
    const currentTabInfo = TABS.find(t => t.id === order.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Receipt size={14} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-800">
                            Order #{order.orderNumber.replace('ORD-', '')}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="mx-1 text-gray-300">|</span>
                        <Calendar size={12} />
                        {new Date(order.date).toLocaleDateString()}
                    </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${currentTabInfo?.color}`}>
                    {currentTabInfo?.label}
                </span>
            </div>

            {/* Body - Customer & Address */}
            <div className="p-5 flex-1 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <Users size={18} className="text-red-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <MapPin size={16} className="text-red-500 mt-1 shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Delivery Address</p>
                        <p className="text-sm text-gray-700 line-clamp-2 leading-tight">{order.deliveryAddress}</p>
                    </div>
                </div>
            </div>

            {/* Items Summary & Total */}
            <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500 font-medium">Items ({orderItemsCount})</p>
                    <p className="text-sm font-semibold text-gray-900">Total</p>
                </div>
                <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 font-medium line-clamp-1">
                                {item.quantity} x {item.name}
                            </span>
                            <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    {orderItemsCount > 2 && (
                        <p className="text-xs font-semibold text-red-500 text-center pt-1">
                            +{orderItemsCount - 2} more item{orderItemsCount - 2 > 1 ? 's' : ''}
                        </p>
                    )}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-gray-200">
                    <p className="text-lg text-gray-900 font-bold">Total Bill</p>
                    <p className="text-xl font-black text-red-600">₹{order.totalAmount}</p>
                </div>
            </div>

            {/* Footer - Actions */}
            <div className="p-5 flex justify-between items-center gap-2">
                {nextStatus ? (
                    <button
                        onClick={() => onStatusUpdate(order.id, nextStatus.id)}
                        className={`flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all shadow-md ${nextStatus.color}`}
                    >
                        {nextStatus.label}
                        <ArrowRight size={16} />
                    </button>
                ) : (
                    <span className="flex-1 text-center text-sm font-medium text-gray-500">Order Completed</span>
                )}

                {/* More Options Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
                    >
                        <MoreVertical size={20} />
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-40 py-1 overflow-hidden origin-bottom-right"
                                >
                                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">Manual Status Change</p>
                                    {TABS.filter(t => t.id !== order.status).map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                onStatusUpdate(order.id, tab.id);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors flex items-center gap-2"
                                        >
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${tab.color} text-gray-900`}>{tab.icon}</span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

// 3. EmptyState Component (Improved visual feedback)
const EmptyState = ({ activeTab, searchQuery }: { activeTab: OrderStatus, searchQuery: string }) => {
    const tabInfo = TABS.find(t => t.id === activeTab);

    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-inner mt-4">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="text-red-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
                {searchQuery ? "No Matching Orders" : `${tabInfo?.label} is Empty`}
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm text-center">
                {searchQuery
                    ? `We couldn't find any orders matching "${searchQuery}" in this tab.`
                    : `There are currently no orders that are in the ${tabInfo?.label.toLowerCase()} phase.`
                }
            </p>
            {!searchQuery && (
                <p className="mt-4 text-sm font-medium text-red-500">
                    Keep an eye on the **New Orders** tab!
                </p>
            )}
        </div>
    );
}


export default AdminOrderScreen;