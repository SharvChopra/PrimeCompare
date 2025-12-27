import { Filter, Star } from "lucide-react";

const Sidebar = ({ currentCategory, setCategory }) => {
  const categories = ["Smartphone", "Laptop", "Headphone", "Smartwatch"];

  return (
    <aside className="w-full md:w-64 glass-card p-6 h-fit mb-6 md:mb-0 md:sticky md:top-24">
      <div className="flex items-center mb-6 text-white border-b border-white/10 pb-2">
        <Filter size={20} className="mr-2 text-accent" />
        <h3 className="font-bold text-lg">Filters</h3>
      </div>

      <div className="mb-6">
        <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-gray-400">
          Categories
        </h4>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setCategory("")}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium ${currentCategory === ""
                ? "bg-accent/20 text-accent border border-accent/50"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium ${currentCategory === cat
                  ? "bg-accent/20 text-accent border border-accent/50"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-gray-400">
          Rating
        </h4>
        <div className="space-y-2 text-sm text-gray-500 cursor-not-allowed opacity-60">
          <div className="flex items-center">
            <Star size={14} fill="currentColor" className="text-yellow-500 mr-2" />
            <span>4 Stars & Up</span>
          </div>
          <div className="flex items-center">
            <Star size={14} fill="currentColor" className="text-yellow-500 mr-2" />
            <span>3 Stars & Up</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
