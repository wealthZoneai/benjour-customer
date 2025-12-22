import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layout from "../pages/Layout";
import Home from "../pages/HomeScreen/Home";
import CategoryPage from "../pages/SubCategory/SubCategoryPage";
import CategoryItems from "../pages/SubCategory/SubCategoryItems";
import ScrollToTop from "../components/ScrollToTop";
import Profile from "../pages/Profile";
import Wishlist from "../pages/Wishlist";
import Orders from "../pages/Orders";
import OtpScreen from "../pages/auth/OtpScreen";
import SearchResults from "../pages/SearchResults";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailure from "../pages/PaymentFailure";
import ProcessingPayment from "../pages/PaymentProcessing";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AnalyticsDashboard from "../pages/Admin/Analytics/AnalyticsDashboard";
import Coupons from "../pages/Admin/Marketing/Coupons";
import AdminOrderScreen from "../pages/Admin/Orders/AdminOrderScreen";

import PrivateRoute from "../utils/PrivateRoute";
import PublicRoute from "../utils/PublicRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const AppRouters = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ---------------------- PROTECTED ROUTES ---------------------- */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Dynamic Category Routes */}
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/category/:categoryId/items/:subcategoryId" element={<CategoryItems />} />

          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />

          {/* Payment Routes */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/processing-payment" element={<ProcessingPayment />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/marketing" element={<Coupons />} />
          <Route path="/admin/orders" element={<AdminOrderScreen />} />
        </Route>

        {/* ---------------------- PUBLIC ROUTES ---------------------- */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/otp" element={<PublicRoute><OtpScreen /> </PublicRoute>
        }
        />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /> </PublicRoute>
        }
        />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /> </PublicRoute>
        }
        />
      </Routes>
    </>
  );
};

export default AppRouters;
