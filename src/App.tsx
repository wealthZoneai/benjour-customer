import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Grocery from "./pages/Grocery/Grocery";
import GroceryItems from "./pages/Grocery/GroceryItems";
import Alcohol from "./pages/Alcohol/AlcoholDashboard";
// import GroceriesBanner from "./pages/Grocery/GroceriesBanner";

import RumPage from "./pages/Alcohol/Rumpage";
import WinePage from "./pages/Alcohol/WinePage";
import LiqueurPage from "./pages/Alcohol/LiqueursPage";
import VodkaPage from "./pages/Alcohol/VodkaPage";
import TequilaPage from "./pages/Alcohol/TequilaPage";
import WhiskyPage from "./pages/Alcohol/WhiskyPage";
import BeerPage from "./pages/Alcohol/BeerPage";
import BrandyPage from "./pages/Alcohol/BrandyPage";

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
        <Route path="/wine" element={<WinePage/>} />
        <Route path="/rum" element={<RumPage />} />
        <Route path="/liqueurs" element={<LiqueurPage />} />
        <Route path="/vodka" element={<VodkaPage />} />
        <Route path="/tequila" element={<TequilaPage />} />
        <Route path="/whisky" element={<WhiskyPage />} />
        <Route path="/beer" element={<BeerPage />} />
        <Route path="/brandy" element={<BrandyPage />} />

      </Routes>
    </div>
  );
}

export default App;
