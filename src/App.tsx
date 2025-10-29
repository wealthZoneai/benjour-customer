import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Grocery from "./pages/Grocery/Grocery";
import GroceryItems from "./pages/Grocery/GroceryItems";
import Alcohol from "./pages/Alcohol/AlcoholDashboard";
// import GroceriesBanner from "./pages/Grocery/GroceriesBanner";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/grocery-dashboard" element={<Grocery />} />
        <Route path="/grocery/:category" element={<GroceryItems />} />
        <Route path="/alcohol-dashboard" element={<Alcohol />} />
        {/* <Route path="/banner" element={<GroceriesBanner/>} /> */}

      </Routes>
    </div>
  );
}

export default App;
