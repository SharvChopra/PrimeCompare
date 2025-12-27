const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Optional if we allow anonymous reviews, but usually linked
      ref: "User",
    },
    username: String, // Snapshot of name in case user is deleted
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
    },
    sentimentScore: {
      type: Number, // Calculated by NLP
      default: 0,
    },
    keywords: [String], // Extracted by NLP
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
