import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-primary/80 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold flex items-center gap-2 group"
        >
          <div className="bg-accent p-1.5 rounded-lg group-hover:rotate-12 transition">
            <span className="text-white text-xl">⚡</span>
          </div>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
            Prime Compare
          </span>
        </Link>

        <div className="flex items-center space-x-8 font-medium text-text-muted">
          {user && (
            <>
              <Link
                to="/add-product"
                className="hover:text-accent transition hover:scale-105 transform"
              >
                Add Product
              </Link>
              <Link
                to="/compare"
                className="hover:text-accent transition hover:scale-105 transform"
              >
                Compare Products
              </Link>
            </>
          )}
          {user ? (
            <>
              <div className="flex items-center space-x-3 pl-4 border-l border-white/20">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-accent to-pink-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white hidden md:block">
                  {user.username}
                </span>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/"; // Force redirect
                  }}
                  className="text-sm bg-secondary hover:bg-red-500/80 hover:text-white px-3 py-1.5 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-primary px-4 py-2 rounded-full font-bold hover:bg-accent hover:text-white transition shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
