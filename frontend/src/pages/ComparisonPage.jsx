import { useEffect, useState } from "react";
import { useComparison } from "../context/ComparisonContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";

const ComparisonPage = () => {
  const { selectedProducts, clearSelection } = useComparison();
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProducts.length === 0) {
      navigate("/products");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch full details if needed, but we have most in context
        // We need to fetch review analysis for each product
        const promises = selectedProducts.map(async (product) => {
          // Get analysis
          const analysisRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/analyze/${product._id}`
          );
          return {
            ...product,
            analysis: analysisRes.data,
          };
        });

        const results = await Promise.all(promises);
        setComparisonData(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comparison data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProducts, navigate]);

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-bold">
        Generating Insights...
      </div>
    );

  // Extract all unique spec keys from all products
  const allSpecKeys = Array.from(
    new Set(
      comparisonData.flatMap((p) => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <button
        onClick={() => navigate("/products")}
        className="flex items-center text-gray-500 hover:text-accent mb-6 font-bold"
      >
        <ArrowLeft className="mr-2" size={20} /> Back to Products
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Comparison</h1>
        <button
          onClick={clearSelection}
          className="text-red-500 hover:underline font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-max table-fixed text-left border-collapse">
          <thead>
            <tr>
              <th className="w-48 p-6 bg-primary/40 text-gray-300 font-bold uppercase tracking-wider text-sm border-b border-white/10 sticky left-0 backdrop-blur-md z-10">
                Features
              </th>
              {comparisonData.map((product) => (
                <th
                  key={product._id}
                  className="w-72 p-6 bg-primary/40 align-top border-l border-b border-white/10 backdrop-blur-md"
                >
                  <div className="flex flex-col items-center group">
                    <div className="relative mb-4 p-4 bg-white rounded-xl shadow-lg transition-transform transform group-hover:scale-105 duration-300">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-40 w-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center leading-tight mb-2 text-white">
                      {product.name}
                    </h3>
                    <span className="text-2xl font-extrabold text-accent mb-2">
                      ${product.price}
                    </span>
                    <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                      <Star
                        size={14}
                        fill="currentColor"
                        className="text-yellow-400 mr-1"
                      />
                      <span className="text-sm font-bold text-white">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        ({product.numReviews || 0})
                      </span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* Technical Specs Header */}
            <tr className="bg-white/5">
              <td
                colSpan={comparisonData.length + 1}
                className="p-3 pl-6 font-bold text-accent uppercase text-xs tracking-widest"
              >
                Technical Specifications
              </td>
            </tr>
            {allSpecKeys.map((key) => (
              <tr
                key={key}
                className="hover:bg-white/5 transition duration-150"
              >
                <td className="p-4 pl-6 font-medium text-gray-300 bg-primary/30 sticky left-0 backdrop-blur-sm border-r border-white/5 align-middle">
                  {key}
                </td>
                {comparisonData.map((product) => (
                  <td
                    key={product._id}
                    className="p-4 border-l border-white/5 text-center text-gray-200"
                  >
                    {product.specs && product.specs[key]
                      ? product.specs[key]
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}

            {/* AI Analysis Header */}
            <tr className="bg-linear-to-r from-accent/20 to-purple-600/20">
              <td
                colSpan={comparisonData.length + 1}
                className="p-3 pl-6 font-bold text-white uppercase text-xs tracking-widest flex items-center gap-2"
              >
                <span className="bg-accent text-white px-2 py-0.5 rounded text-[10px] shadow-sm shadow-accent/50">
                  AI
                </span>{" "}
                Review Insights
              </td>
            </tr>

            {/* Top Features */}
            <tr className="hover:bg-white/5 transition duration-150">
              <td className="p-4 pl-6 font-medium text-gray-300 bg-primary/30 sticky left-0 backdrop-blur-sm border-r border-white/5 align-middle">
                Top Features
              </td>
              {comparisonData.map((product) => (
                <td
                  key={product._id}
                  className="p-4 border-l border-white/5 align-top"
                >
                  <div className="flex flex-wrap gap-2">
                    {product.analysis.features && product.analysis.features.length > 0 ? (
                      product.analysis.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs font-semibold bg-white/10 text-white px-2 py-1 rounded border border-white/20 capitalize"
                        >
                          {feature}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm italic">
                        Analyzing features...
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* AI Verdict Row */}
            <tr className="hover:bg-white/5 transition duration-150">
              <td className="p-4 pl-6 font-medium text-gray-300 bg-primary/30 sticky left-0 backdrop-blur-sm border-r border-white/5">
                AI Verdict
              </td>
              {comparisonData.map((product) => (
                <td
                  key={product._id}
                  className="p-4 border-l border-white/5 text-center align-top"
                >
                  <p className="text-sm text-gray-200 italic leading-relaxed">
                    "{product.analysis.verdict || "Analysis in progress..."}"
                  </p>
                </td>
              ))}
            </tr>

            {/* Sentiment Score */}
            <tr className="hover:bg-white/5 transition duration-150">
              <td className="p-4 pl-6 font-medium text-gray-300 bg-primary/30 sticky left-0 backdrop-blur-sm border-r border-white/5">
                Sentiment Score
              </td>
              {comparisonData.map((product) => (
                <td
                  key={product._id}
                  className="p-4 border-l border-white/5 text-center"
                >
                  <div className="w-full bg-gray-700/50 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full shadow-lg ${product.analysis.averageSentiment > 2
                        ? "bg-green-500 shadow-green-500/50"
                        : product.analysis.averageSentiment > 0
                          ? "bg-yellow-500 shadow-yellow-500/50"
                          : "bg-red-500 shadow-red-500/50"
                        }`}
                      style={{
                        width: `${Math.min(
                          Math.max(
                            (product.analysis.averageSentiment + 5) * 10,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    Score:{" "}
                    <span
                      className={
                        product.analysis.averageSentiment > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {product.analysis.averageSentiment.toFixed(2)}
                    </span>
                  </span>
                </td>
              ))}
            </tr>

            {/* Pros */}
            <tr className="hover:bg-white/5 transition duration-150">
              <td className="p-4 pl-6 font-medium text-gray-300 bg-primary/30 sticky left-0 backdrop-blur-sm border-r border-white/5 align-top">
                Pros
              </td>
              {comparisonData.map((product) => (
                <td
                  key={product._id}
                  className="p-4 border-l border-white/5 align-top"
                >
                  <ul className="space-y-2">
                    {product.analysis.pros.map((pro) => (
                      <li
                        key={pro}
                        className="flex items-start text-sm text-gray-300"
                      >
                        <ThumbsUp
                          size={14}
                          className="mr-2 mt-0.5 shrink-0 text-green-400"
                        />{" "}
                        <span className="capitalize">{pro}</span>
                      </li>
                    ))}
                    {product.analysis.pros.length === 0 && (
                      <span className="text-gray-500 text-sm italic">
                        No major pros detected
                      </span>
                    )}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Cons */}
            <tr className="hover:bg-white/5 transition duration-150">
              <td className="p-4 pl-6 font-medium text-gray-300 bg-primary/30 sticky left-0 backdrop-blur-sm border-r border-white/5 align-top">
                Cons
              </td>
              {comparisonData.map((product) => (
                <td
                  key={product._id}
                  className="p-4 border-l border-white/5 align-top"
                >
                  <ul className="space-y-2">
                    {product.analysis.cons.map((con) => (
                      <li
                        key={con}
                        className="flex items-start text-sm text-gray-300"
                      >
                        <ThumbsDown
                          size={14}
                          className="mr-2 mt-0.5 shrink-0 text-red-400"
                        />{" "}
                        <span className="capitalize">{con}</span>
                      </li>
                    ))}
                    {product.analysis.cons.length === 0 && (
                      <span className="text-gray-500 text-sm italic">
                        No major cons detected
                      </span>
                    )}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonPage;
