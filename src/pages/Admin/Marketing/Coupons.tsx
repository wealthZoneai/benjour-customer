import { ArrowLeft, Plus, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Coupons = () => {
    const navigate = useNavigate();

    const coupons = [
        { code: "WELCOME50", discount: "50% OFF", status: "Active", used: 124 },
        { code: "SUMMER20", discount: "20% OFF", status: "Expired", used: 450 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6">
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Coupons & Offers</h1>
                    <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                        <Plus size={20} />
                        Create New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                            <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                <Ticket size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{coupon.code}</h3>
                            <p className="text-emerald-600 font-medium mb-4">{coupon.discount}</p>

                            <div className="w-full flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                                <span>Status: <span className={coupon.status === 'Active' ? 'text-green-600' : 'text-red-500'}>{coupon.status}</span></span>
                                <span>{coupon.used} used</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Coupons;
