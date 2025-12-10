import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    Users,
    Star,
    Image as ImageIcon,
    MessageSquare,
    Package,
    ShieldCheck,
    TrendingUp,
    Clock,
    MapPin,
    Gift,
    BarChart2,
    Bell
} from "lucide-react";
import type { RootState } from "../../Redux/store";
import AdminStatCard from "../../components/Admin/AdminStatCard";
import AdminFeatureSection from "../../components/Admin/AdminFeatureSection";
import { getAllOrders, getMainCategories } from "../../services/apiHelpers";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { role, userId } = useSelector((state: RootState) => state.user);

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        categories: 0
    });

    useEffect(() => {
        if (role !== "ADMIN") {
            navigate("/home");
            return;
        }
        fetchStats();
    }, [role, navigate, userId]);

    const fetchStats = async () => {
        if (!userId) return;
        try {
            // Parallel fetch for dashboard speed
            const [ordersRes, catsRes] = await Promise.all([
                getAllOrders(userId), // Assuming this returns all orders for admin
                getMainCategories()
            ]);

            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
            // Calculate stats
            const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
            const pendingOrders = orders.filter((order: any) => order.status === 'PENDING').length;

            setStats({
                totalOrders: orders.length,
                totalRevenue,
                pendingOrders,
                categories: Array.isArray(catsRes.data) ? catsRes.data.length : 0
            });

        } catch (error) {
            console.error("Error fetching admin stats:", error);
        }
    };

    const featureSections = [
        {
            title: "Live Operations",
            description: "Real-time store management",
            icon: <Clock className="w-6 h-6 text-red-600" />,
            color: "bg-red-50 text-red-600",
            items: [
                { label: `Live Orders (${stats.pendingOrders})`, path: "/orders", icon: <ShoppingBag size={18} /> },
                { label: "Dispatch Drivers", path: "/admin/drivers", icon: <MapPin size={18} /> },
                { label: "Kitchen View", path: "/admin/kitchen", icon: <Bell size={18} /> },
            ]
        },
        {
            title: "Product Catalog",
            description: "Manage menu & inventory",
            icon: <Package className="w-6 h-6 text-emerald-600" />,
            color: "bg-emerald-50 text-emerald-600",
            items: [
                { label: "Main Categories", path: "/home", icon: <Layers size={18} /> },
                { label: "Add New Item", path: "/home", icon: <Package size={18} /> },
                { label: "Inventory", path: "/admin/inventory", icon: <LayoutDashboard size={18} /> },
            ]
        },
        {
            title: "Marketing & Growth",
            description: "Boost sales with promos",
            icon: <Gift className="w-6 h-6 text-purple-600" />,
            color: "bg-purple-50 text-purple-600",
            items: [
                { label: "Banners & ads", path: "/admin/banners", icon: <ImageIcon size={18} /> },
                { label: "Coupons & Offers", path: "/admin/marketing", icon: <Gift size={18} /> },
                { label: "Notifications", path: "/admin/notifications", icon: <Bell size={18} /> },
            ]
        },
        {
            title: "Analytics & Reports",
            description: "Insights and finances",
            icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
            color: "bg-blue-50 text-blue-600",
            items: [
                { label: "Sales Report", path: "/admin/analytics", icon: <TrendingUp size={18} /> },
                { label: "User Feedback", path: "/home", icon: <MessageSquare size={18} /> },
                { label: "Ratings", path: "/home", icon: <Star size={18} /> },
            ]
        },
        {
            title: "User Management",
            description: "Customers & Staff",
            icon: <Users className="w-6 h-6 text-orange-600" />,
            color: "bg-orange-50 text-orange-600",
            items: [
                { label: "Customer List", path: "/admin/users", icon: <Users size={18} /> },
                { label: "Staff Access", path: "/admin/staff", icon: <ShieldCheck size={18} /> },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-emerald-700" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Command Center</h1>
                        </div>
                        <p className="text-gray-500">
                            Overview of your store's performance and daily operations.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                            Last updated: Just now
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminStatCard
                        title="Total Revenue"
                        value={`₹${stats.totalRevenue.toLocaleString()}`}
                        icon={<TrendingUp size={20} className="text-emerald-600" />}
                        color="text-emerald-500"
                        trend="up"
                        trendValue="+12.5%"
                        delay={0}
                    />
                    <AdminStatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingBag size={20} className="text-blue-600" />}
                        color="text-blue-500"
                        trend="up"
                        trendValue="+5.2%"
                        delay={0.1}
                    />
                    <AdminStatCard
                        title="Active Categories"
                        value={stats.categories}
                        icon={<Layers size={20} className="text-purple-600" />}
                        color="text-purple-500"
                        delay={0.2}
                    />
                    <AdminStatCard
                        title="Customers"
                        value="1,240"
                        icon={<Users size={20} className="text-orange-600" />}
                        color="text-orange-500"
                        trend="up"
                        trendValue="+8.1%"
                        delay={0.3}
                    />
                </div>

                {/* Action Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featureSections.map((section, idx) => (
                        <AdminFeatureSection
                            key={idx}
                            {...section}
                            delay={0.4 + (idx * 0.1)}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
