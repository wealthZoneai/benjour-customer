import React, { useState } from "react";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/apiHelpers";

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, otp } = location.state || {};

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!email) {
            toast.error("Email is missing. Please restart the process.");
            navigate("/forgot-password");
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword({ email, password, otp });
            toast.success("Password reset successfully!");
            navigate("/");
        } catch (error: any) {
            console.error("Failed to reset password:", error);
            const msg = error.response?.data?.message || "Failed to reset password. Please try again.";
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
                    onClick={() => navigate("/forgot-password")}
                    className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
                >
                    <FaArrowLeft size={18} />
                </button>

                <h2 className="text-3xl font-bold text-center mb-2 mt-4">Reset Password</h2>
                <p className="text-center text-gray-300 mb-8 text-sm max-w-xs mx-auto">
                    Create a new, strong password for your account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            New Password
                        </label>
                        <div className="relative flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-500/50 transition-all">
                            <FaLock className="text-gray-400 mr-2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400 pr-8"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-500/50 transition-all">
                            <FaLock className="text-gray-400 mr-2" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400 pr-8"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-sky-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
