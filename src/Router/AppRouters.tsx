import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layout from "../pages/Layout";
import Home from "../pages/HomeScreen/Home";
import Grocery from "../pages/Grocery/Grocery";
import AlcoholDashboard from "../pages/Alcohol/AlcoholDashboard";
import AlcoholItems from "../pages/Alcohol/AlcoholItems";
import ScrollToTop from "../components/ScrollToTop";
import GroceryItems from "../pages/Grocery/GroceryItems";


const AppRouters = () => {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/groceries" element={<Grocery />} />
        <Route path="/grocery/:category" element={<GroceryItems />} />
        <Route path="/alcohol" element={<AlcoholDashboard />} />
        <Route path="/alcohol/:category" element={<AlcoholItems />} />

      </Route>

      {/* Routes without Header & Footer */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    </>
  );
};

export default AppRouters;
