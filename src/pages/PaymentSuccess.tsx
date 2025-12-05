import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
                {/* Raised Circle */}
                <motion.div
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 180 }}
                    className="mx-auto w-24 h-24 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex items-center justify-center"
                >
                    <CheckCircle className="w-14 h-14 text-emerald-600" />
                </motion.div>

                <h1 className="text-center text-2xl font-semibold text-gray-900 mt-6">
                    Payment Successful
                </h1>

                <p className="text-center text-gray-500 text-sm mt-2">
                    Your order has been placed successfully.
                </p>

                {/* Info Box */}
                <div className="mt-8 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-emerald-600 font-medium text-sm mt-1">
                        Order Confirmed
                    </p>

                    <p className="text-gray-500 text-xs mt-3">
                        You will receive updates once your order is dispatched.
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-8 space-y-3">
                    <button
                        onClick={() => navigate("/home")}
                        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => navigate("/orders")}
                        className="w-full py-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition flex justify-center items-center gap-2"
                    >
                        View Orders <ArrowRight size={18} />
                    </button>
                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                    A confirmation email has been sent to your inbox.
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;

