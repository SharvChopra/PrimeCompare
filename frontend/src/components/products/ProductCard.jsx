import { useComparison } from "../../context/ComparisonContext";
import { Plus, Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { selectedProducts, toggleProduct, clearSelection } = useComparison();
  const navigate = useNavigate();
  const isSelected = selectedProducts.find((p) => p._id === product._id);

  return (
    <div
      className={`glass-card relative overflow-hidden transition-all duration-300 hover:-translate-y-2 group ${isSelected ? "ring-2 ring-accent" : ""
        }`}
    >
      <div className="h-48 bg-white/5 flex items-center justify-center p-4 relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Star size={12} className="text-highlight mr-1 fill-highlight" />{" "}
          {product.rating}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-accent transition">
          {product.name}
        </h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400 text-sm">{product.brand}</span>
          <span className="text-xl font-bold text-white">${product.price}</span>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => toggleProduct(product)}
            className={`flex-1 py-3 px-6 rounded-lg font-medium tracking-wide flex items-center justify-center transition-all cursor-pointer ${isSelected
              ? "bg-accent text-white shadow-lg shadow-accent/25"
              : "bg-white/10 text-white hover:bg-white/20 hover:text-accent"
              }`}
          >
            {isSelected ? (
              <>
                <Check size={18} className="mr-2" /> Selected
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" /> Compare
              </>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // For analyze: Clear others so we focus on this one
              if (selectedProducts.length > 0 && !isSelected) {
                clearSelection();
              } else if (selectedProducts.length > 1 && isSelected) {
                clearSelection();
              }

              if (!isSelected) {
                toggleProduct(product);
              }
              navigate("/compare");
            }}
            className="flex-1 py-3 px-6 rounded-lg font-medium tracking-wide flex items-center justify-center bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105 cursor-pointer"
          >
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
