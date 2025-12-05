import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "../Redux/cartSlice";
import toast from "react-hot-toast";
import { deleteFromCart, createCheckoutSession, updateCartQuantity } from "../services/apiHelpers";
import type { RootState } from "../Redux/store";

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface ShowCartProps {
    showCart: boolean;
    setShowCart: (value: boolean) => void;
    cart: CartItem[];
    cartCount: number;
    totalPrice: number;
}

const ShowCart: React.FC<ShowCartProps> = ({
    showCart,
    setShowCart,
    cart,
    cartCount,
    totalPrice,
}) => {
    const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.user.userId);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleRemoveFromCart = async (id: number) => {
        try {
            const response = await deleteFromCart(userId, id);
            if (response.status === 200) {
                dispatch(removeFromCart(id));
                toast.success("Product removed from cart");
            }
        } catch (error) {
            toast.error("Failed to remove product from cart");
        }
    };

    const handleIncreaseQuantity = async (item: CartItem) => {
        const newQuantity = item.quantity + 1;

        // Optimistic update
        dispatch(increaseQuantity(item.id));

        try {
            await updateCartQuantity(userId, item.id, newQuantity);
        } catch (error) {
            // Revert on error
            dispatch(decreaseQuantity(item.id));
            toast.error("Failed to update quantity");
        }
    };

    const handleDecreaseQuantity = async (item: CartItem) => {
        if (item.quantity <= 1) {
            handleRemoveFromCart(item.id);
            return;
        }

        const newQuantity = item.quantity - 1;

        // Optimistic update
        dispatch(decreaseQuantity(item.id));

        try {
            await updateCartQuantity(userId, item.id, newQuantity);
        } catch (error) {
            // Revert on error
            dispatch(increaseQuantity(item.id));
            toast.error("Failed to update quantity");
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // Minimum order amount to meet Stripe's requirement (30 pence ≈ ₹50)
        const MINIMUM_ORDER_AMOUNT = 50;
        if (totalPrice < MINIMUM_ORDER_AMOUNT) {
            toast.error(`Minimum order amount is ₹${MINIMUM_ORDER_AMOUNT}. Please add more items.`);
            return;
        }

        console.log("🛒 Frontend Cart Total:", totalPrice);
        console.log("🛒 Cart Items:", cart);

        setIsCheckingOut(true);

        try {
            const baseUrl = window.location.origin;

            const successUrl = `${baseUrl}/processing-payment`;

            const cancelUrl = `${baseUrl}/payment-failure`;

            const response = await createCheckoutSession(userId, successUrl, cancelUrl);

            if (response.data.checkoutUrl) {
                window.location.href = response.data.checkoutUrl;
            } else {
                toast.error("Failed to create checkout session");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Failed to proceed to checkout");
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <AnimatePresence>
            {showCart && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCart(false)}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 80, damping: 20 }}
                        className="fixed right-0 top-0 h-full w-[95%] sm:w-[700px] md:w-[850px] bg-white shadow-2xl z-50 flex flex-col rounded-l-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-center relative px-6 py-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950">
                            <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>

                            <button
                                onClick={() => setShowCart(false)}
                                className="absolute right-6 text-white hover:text-gray-200 transition"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Cart Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-600">
                                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                        <ShoppingCart size={80} className="text-gray-400 mb-4" />
                                    </motion.div>
                                    <h3 className="text-lg font-semibold">Your Cart is Empty</h3>
                                    <p className="text-sm text-gray-500 mt-1">No products here!</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Product Table */}
                                    <div className="md:col-span-2 overflow-x-auto rounded-xl shadow-sm">
                                        <table className="min-w-full text-sm">
                                            <thead>
                                                <tr className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white text-left">
                                                    <th className="p-3 font-semibold">Product</th>
                                                    <th className="p-3 font-semibold">Price</th>
                                                    <th className="p-3 font-semibold text-center">Quantity</th>
                                                    <th className="p-3 font-semibold text-right">Sub Total</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {cart.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-100 transition">
                                                        <td className="flex items-center gap-3 p-3">
                                                            <button
                                                                onClick={() => handleRemoveFromCart(item.id)}
                                                                className="text-gray-400 hover:text-red-500"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>

                                                            <img src={item?.image} alt={item?.name} className="w-12 h-12 object-cover rounded-md" />
                                                            <div>
                                                                <p className="font-medium text-gray-800">{item?.name}</p>
                                                            </div>
                                                        </td>

                                                        <td className="p-3">
                                                            ₹{Number(item?.price || 0).toFixed(2)}
                                                        </td>

                                                        <td className="p-3 text-center">
                                                            <div className="flex justify-center items-center gap-2 bg-gray-100 rounded-full px-3 py-1 w-fit mx-auto">
                                                                <button
                                                                    onClick={() => handleDecreaseQuantity(item)}
                                                                    className="text-gray-600 hover:text-red-500"
                                                                >
                                                                    <FaMinus size={12} />
                                                                </button>

                                                                <span className="w-6 text-center font-semibold">{item?.quantity}</span>

                                                                <button
                                                                    onClick={() => handleIncreaseQuantity(item)}
                                                                    className="text-gray-600 hover:text-green-500"
                                                                >
                                                                    <FaPlus size={12} />
                                                                </button>
                                                            </div>
                                                        </td>

                                                        <td className="p-3 text-right font-semibold text-gray-700">
                                                            ₹{(item?.price * item?.quantity).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="rounded-xl p-5 shadow-sm h-fit">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h3>

                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Items</span>
                                            <span>{cartCount}</span>
                                        </div>

                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Subtotal</span>
                                            <span>₹{totalPrice.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>

                                        <hr className="my-3" />

                                        <div className="flex justify-between text-base font-bold mb-4">
                                            <span>Total</span>
                                            <span>₹{totalPrice.toFixed(2)}</span>
                                        </div>

                                        {/* Minimum Order Warning */}
                                        {totalPrice < 50 && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                                                <p className="text-xs text-amber-700">
                                                    ⚠️ Minimum order: ₹50.00
                                                    <br />
                                                    <span className="font-semibold">Add ₹{(50 - totalPrice).toFixed(2)} more</span>
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleCheckout}
                                            disabled={isCheckingOut || totalPrice < 50}
                                            className="w-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isCheckingOut ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Proceed to Checkout"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShowCart;
