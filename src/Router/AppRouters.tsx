import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layout from "../pages/Layout";
import Home from "../pages/HomeScreen/Home";
import Grocery from "../pages/Grocery/Grocery";


const AppRouters = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/groceries" element={<Grocery />} />
      </Route>

      {/* Routes without Header & Footer */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRouters;
