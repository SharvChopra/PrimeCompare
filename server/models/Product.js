const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Smartphone", "Laptop", "Headphone", "Smartwatch"], // Example categories
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // URL
      default: "https://via.placeholder.com/300",
    },
    specs: {
      type: Map,
      of: String, // Dynamic specs: "RAM": "8GB", "Storage": "256GB"
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    analysis: {
      averageSentiment: { type: Number, default: 0 },
      pros: [String],
      cons: [String],
      features: [String],
      sources: [String],
      verdict: String,
      lastAnalyzed: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
