import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";

const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");
  const errorMessage =
    searchParams.get("error") || "Payment was cancelled or failed";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden"
      >
        {/* Top Section */}
        <div className="bg-red-500 p-5 text-center">
          <XCircle className="w-14 h-14 text-white mx-auto" />

          <h1 className="text-xl font-bold text-white mt-3">
            Payment Failed
          </h1>

          <p className="text-red-100 text-sm mt-1">
            Unable to process your payment
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">

          {/* Error */}
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm">
            <h3 className="font-semibold text-red-900">What happened?</h3>
            <p className="text-red-700 mt-1">{errorMessage}</p>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="text-sm">
              <h3 className="font-semibold text-gray-900 mb-1">Session Info</h3>
              <div className="bg-gray-50 p-2 rounded border">
                <p className="text-gray-900 font-medium break-all">{sessionId}</p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
            <h3 className="font-semibold text-blue-900 mb-1">
              Why payments fail?
            </h3>
            <ul className="list-disc list-inside space-y-0.5 text-blue-700">
              <li>Insufficient funds</li>
              <li>Incorrect card details</li>
              <li>User cancelled the payment</li>
              <li>Weak internet connection</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/home")}
              className="flex-1 bg-red-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600"
            >
              <RefreshCw size={18} />
              Try Again
            </button>

            <button
              onClick={() => navigate("/home")}
              className="flex-1 bg-gray-100 border border-gray-300 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <Home size={18} />
              Home
            </button>
          </div>

          <button
            onClick={() => navigate(-3)}
            className="w-full text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 text-sm"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;
