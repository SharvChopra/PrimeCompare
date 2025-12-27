import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "Smartphone",
    brand: "",
    price: "",
    image: "",
    specs: {},
  });

  // Simple way to handle dynamic specs (comma separated for now for simplicity or JSON)
  const [specsInput, setSpecsInput] = useState('Screen: 6.1", RAM: 8GB');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse specs
      const specsObj = {};
      specsInput.split(",").forEach((item) => {
        const [key, val] = item.split(":");
        if (key && val) specsObj[key.trim()] = val.trim();
      });

      const productData = {
        ...formData,
        specs: specsObj,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/products`, productData);
      navigate("/products");
    } catch (error) {
      console.error("Error adding product", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-white">Add New Product</h2>
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-bold mb-2">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-primary/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent focus:outline-none transition"
              placeholder="e.g. iPhone 15 Pro"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 font-bold mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-primary/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent focus:outline-none transition"
              >
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Smartwatch">Smartwatch</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-2">
                Brand
              </label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-3 bg-primary/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent focus:outline-none transition"
                placeholder="e.g. Apple"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-2">
              Price ($)
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 bg-primary/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent focus:outline-none transition"
              placeholder="999"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-2">
              Image URL
            </label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-3 bg-primary/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent focus:outline-none transition"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-2">
              Specifications
            </label>
            <p className="text-gray-400 text-sm mb-2">
              Format: Screen: 6.5", RAM: 12GB (comma separated)
            </p>
            <textarea
              value={specsInput}
              onChange={(e) => setSpecsInput(e.target.value)}
              className="w-full p-3 bg-primary/50 border border-white/10 rounded-lg text-white h-24 focus:ring-2 focus:ring-accent focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-lg mt-4"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
