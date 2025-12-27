import { createContext, useState, useContext } from "react";

const ComparisonContext = createContext();

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        if (prev.length >= 3) {
          alert("You can only compare up to 3 products");
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const clearSelection = () => setSelectedProducts([]);

  return (
    <ComparisonContext.Provider
      value={{ selectedProducts, toggleProduct, clearSelection }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};
