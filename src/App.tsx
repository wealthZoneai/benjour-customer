import { Routes, Route} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import "./App.css";
import Home from "./pages/Home";
import Grocery from "./pages/Grocery/GroceryDashboard";
import Alcohol from "./pages/Alcohol/AlcoholDashboard";

function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/grocery-dashboard" element={<Grocery />} />
        <Route path="/alcohol-dashboard" element={<Alcohol />} />
      </Routes>
    </div>
  );
}

export default App;
