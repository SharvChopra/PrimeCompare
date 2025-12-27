import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/products/ProductCard";
import Sidebar from "../components/layout/Sidebar";
import { useComparison } from "../context/ComparisonContext";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const { selectedProducts } = useComparison();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl = `${import.meta.env.VITE_API_URL}/products`;
        const url = category ? `${baseUrl}?category=${category}` : baseUrl;
        const res = await axios.get(url);
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-8 text-secondary">
        Explore Products
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <Sidebar currentCategory={category} setCategory={setCategory} />

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20 text-xl font-bold text-gray-400">
              Loading products...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-20">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="text-center col-span-3 py-10 text-gray-500">
                  No products found in this category.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Comparison Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-2xl z-40 animate-slide-up">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex gap-4 overflow-auto">
              {selectedProducts.map((p) => (
                <div
                  key={p._id}
                  className="relative w-16 h-16 border rounded bg-gray-50 flex items-center justify-center"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full object-contain"
                  />
                  <span className="absolute -top-2 -right-2 bg-accent text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                    1
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <span className="text-gray-600 hidden md:block self-center font-medium">
                {selectedProducts.length} product(s) selected
              </span>
              <button
                onClick={() => navigate("/compare")}
                className="bg-secondary text-white px-6 py-2 rounded font-bold hover:bg-primary transition shadow-lg"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
