const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { analyzeReviews } = require("../utils/nlp");
const { searchReviews } = require("../utils/scraper");

// Analyze reviews for a product (Hybrid: DB + Web)
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // 1. Check if analysis already exists (Caching strategy)
    const Product = require("../models/Product");
    const product = await Product.findById(productId);

    if (
      product.analysis &&
      product.analysis.lastAnalyzed &&
      product.analysis.pros.length > 0
    ) {
      console.log("Returning cached analysis for:", product.name);
      return res.json({
        averageSentiment: product.analysis.averageSentiment,
        pros: product.analysis.pros,
        cons: product.analysis.cons,
        features: product.analysis.features,
        verdict: product.analysis.verdict,
        source: { cached: true },
      });
    }

    // 2. Fetch DB reviews
    const dbReviews = await Review.find({ product: productId });

    let webReviews = [];
    if (product) {
      console.log(`Searching web for: ${product.name} [${product.category}]`);
      const { reviews, specs } = await searchReviews(product.name, product.category);

      webReviews = reviews.map((r) => ({ text: r.text }));

      // Update Product Specs if found and currently empty/sparse
      if (specs && Object.keys(specs).length > 0) {
        // Merge existing specs with new ones (new ones take precedence if we trust scraper)
        // Convert Map to Object if needed or just use object access
        const updatedSpecs = { ...Object.fromEntries(product.specs || new Map()), ...specs };
        product.specs = updatedSpecs;
        console.log("Updated product specs from web:", specs);
      }
    }

    const { generateAIReview } = require("../utils/gemini");

    // ... inside the route ...

    // 3. Combine Reviews
    let allReviews = [...dbReviews, ...webReviews];

    // STRATEGY 5: GEMINI AI FALLBACK (Generative Analysis)
    // Check if we have enough data quality (at least some pros/cons detected)
    const tempAnalysis = analyzeReviews(allReviews);
    const hasInsufficientData = tempAnalysis.pros.length === 0 && tempAnalysis.cons.length === 0;

    if (allReviews.length === 0 || hasInsufficientData) {
      console.log(`Web data status: ${allReviews.length} reviews. Quality insufficient: ${hasInsufficientData}. Attempting Gemini AI Generation...`);
      const aiData = await generateAIReview(product.name);

      if (aiData) {
        console.log("Gemini generated analysis successfully.");
        // Save valid AI data to product for caching
        product.analysis = {
          averageSentiment: aiData.averageSentiment || 7.5,
          pros: aiData.pros || [],
          cons: aiData.cons || [],
          features: aiData.features || [],
          verdict: aiData.verdict || "AI Generated Review based on internal knowledge.",
          lastAnalyzed: new Date()
        };
        product.specs = { ...Object.fromEntries(product.specs || new Map()), ...aiData.specs };

        await product.save();

        return res.json({
          ...aiData,
          source: { type: "Generative AI", model: "Gemini Pro" }
        });
      }
    }

    if (allReviews.length === 0) {
      return res.json({
        averageSentiment: 0,
        pros: [],
        cons: [],
        features: [],
        verdict: "No expert reviews found. Please ensure GEMINI_API_KEY is set in .env to enable AI generation fallback.",
        message: "No reviews to analyze",
      });
    }

    // 4. Analyze Combined Data
    const analysis = analyzeReviews(allReviews);

    // 5. Save Analysis to DB
    product.analysis = {
      averageSentiment: analysis.averageSentiment,
      pros: analysis.pros,
      cons: analysis.cons,
      features: analysis.features || [],
      verdict: analysis.verdict,
      lastAnalyzed: new Date(),
    };
    await product.save();
    console.log("Saved new analysis for:", product.name);

    // Return analysis
    res.json({
      ...analysis,
      source: {
        db: dbReviews.length,
        web: webReviews.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Direct Web Analysis Route (By Name)
router.get("/web/:productName", async (req, res) => {
  try {
    const { productName } = req.params;
    const { reviews } = await searchReviews(productName);
    const webReviews = reviews.map((r) => ({ text: r.text }));

    if (webReviews.length === 0) {
      return res.json({
        averageSentiment: 0,
        pros: [],
        cons: [],
        message: "No web results found",
      });
    }

    const analysis = analyzeReviews(webReviews);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
