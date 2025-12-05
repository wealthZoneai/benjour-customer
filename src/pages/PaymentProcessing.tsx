import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../Redux/cartSlice";
import { getSessionStatus, confirmOrder } from "../services/apiHelpers";
import toast from "react-hot-toast";
import type { RootState } from "../Redux/store";

const ProcessingPayment = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasRun = React.useRef(false);
    const userId = useSelector((state: RootState) => state.user.userId);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const sessionId = params.get("session_id");
        if (!sessionId) {
            navigate("/home");
            return;
        }

        const verify = async () => {
            try {
                const s = await getSessionStatus(sessionId);

                if (s.data === "paid") {
                    const res = await confirmOrder(userId, sessionId);
                    if (res.status === 200) {
                        dispatch(clearCart());
                        navigate("/payment-success");
                    }
                }else{
                    navigate("/payment-failure");
                }
            } catch {
                toast.error("Something went wrong.");
            } finally {
            }
        };

        verify();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
            />

            <p className="mt-4 text-gray-600 font-medium">
                Processing your order...
            </p>

            <p className="text-gray-400 text-sm">Please wait, do not close the page.</p>
        </div>
    );
};

export default ProcessingPayment;
