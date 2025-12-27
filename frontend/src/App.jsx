import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProductList from "./pages/ProductList";
import ComparisonPage from "./pages/ComparisonPage";
import AddProduct from "./pages/AddProduct";
import { useAuth } from "./context/AuthContext";
import "./index.css";

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="grow pt-20">
        {" "}
        {/* Added padding for fixed navbar */}
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/products" /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/products" /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/products" /> : <Signup />}
          />

          {/* Protected Routes */}
          <Route
            path="/products"
            element={user ? <ProductList /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-product"
            element={user ? <AddProduct /> : <Navigate to="/login" />}
          />
          <Route
            path="/compare"
            element={user ? <ComparisonPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
export default App;
