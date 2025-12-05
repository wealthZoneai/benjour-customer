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


const AppRouters = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
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

        </Route>

        {/* Routes without Header & Footer */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpScreen />} />
      </Routes>
    </>
  );
};

export default AppRouters;
