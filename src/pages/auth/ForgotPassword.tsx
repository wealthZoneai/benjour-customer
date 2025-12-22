import React, { useState } from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/apiHelpers";

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsLoading(true);

        try {
            await forgotPassword({ email });
            toast.success("OTP sent to your email!");
            navigate("/otp", { state: { email, mode: "forgotPassword" } });
        } catch (error: any) {
            console.error("Failed to send OTP:", error);
            const msg = error.response?.data?.message || "Failed to send OTP. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')`,
            }}
        >
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/75 to-black/90"></div>

            <div className="relative z-10 w-full max-w-md mx-4 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white">
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
                >
                    <FaArrowLeft size={18} />
                </button>

                <h2 className="text-3xl font-bold text-center mb-2 mt-4">Forgot Password?</h2>
                <p className="text-center text-gray-300 mb-8 text-sm max-w-xs mx-auto">
                    Enter your email address and we'll send you an OTP to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email Address
                        </label>
                        <div className="flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-500/50 transition-all">
                            <FaEnvelope className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-sky-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Remember your password?{" "}
                        <button
                            onClick={() => navigate("/")}
                            className="text-sky-400 font-medium hover:text-sky-300 hover:underline transition-all"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
