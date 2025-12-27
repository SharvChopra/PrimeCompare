const Sentiment = require("sentiment");
const sentiment = new Sentiment();

// Comprehensive tech keywords
const FEATURE_KEYWORDS = [
  // Display
  "screen", "display", "amoled", "oled", "120hz", "refresh rate", "brightness", "notch", "bezel",
  // Performance
  "performance", "speed", "processor", "chipset", "snapdragon", "exynos", "dimensity", "gaming", "lag", "heating", "thermal",
  // Battery
  "battery", "charging", "fast charging", "drain", "backup", "life",
  // Camera
  "camera", "photo", "video", "night mode", "zoom", "portrait", "wide angle", "selfie", "clarity",
  // Build
  "design", "build", "quality", "glass", "plastic", "metal", "weight", "grip", "hand feel",
  // Audio
  "sound", "audio", "speaker", "speakers", "jack", "microphone", "call quality",
  // Software
  "software", "ui", "bloatware", "bugs", "update", "updates", "android", "ios",
  // Connectivity
  "5g", "4g", "wifi", "bluetooth", "signal",
  // Value
  "price", "value", "money", "expensive", "cheap", "budget",
  // Extras
  "fingerprint", "face id", "haptics", "vibration", "storage", "ram"
];

const analyzeReviews = (reviews) => {
  let totalScore = 0;
  let keywordMap = {};

  reviews.forEach((review) => {
    // sentiment analysis
    const result = sentiment.analyze(review.text);
    totalScore += result.score;

    // keyword extraction (naive approach)
    const words = review.text.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      // simple cleaning
      const cleanWord = word.replace(/[^a-z]/g, "");
      if (FEATURE_KEYWORDS.includes(cleanWord)) {
        if (!keywordMap[cleanWord]) {
          keywordMap[cleanWord] = { count: 0, sentiment: 0 };
        }
        keywordMap[cleanWord].count++;
        keywordMap[cleanWord].sentiment += result.score;
      }
    });
  });

  const averageSentiment = reviews.length > 0 ? totalScore / reviews.length : 0;

  // Determine Pros, Cons, and Key Features
  const pros = [];
  const cons = [];
  const features = []; // Highly discussed positive aspects

  Object.keys(keywordMap).forEach((key) => {
    const data = keywordMap[key];
    // Pros: Positive sentiment
    if (data.sentiment > 0) {
      pros.push(key);
      // Features: If mentioned frequently and positive, it's a key feature
      if (data.count >= 1) {
        features.push(key);
      }
    } else if (data.sentiment < 0) {
      cons.push(key);
    }
  });

  // Sort features by sentiment score to get the "best" ones
  features.sort((a, b) => keywordMap[b].sentiment - keywordMap[a].sentiment);

  // Generate AI Verdict
  let verdict = "Analysis pending...";
  if (averageSentiment > 2) verdict = "Excellent choice! Highly praised by users.";
  else if (averageSentiment > 1) verdict = "Generally positive, delivering good value.";
  else if (averageSentiment > 0.5) verdict = "Decent product, but has some compromises.";
  else if (averageSentiment > -0.5) verdict = "Mixed reception. Consider alternatives if possible.";
  else verdict = "Not recommended due to significant negative feedback.";

  // Enrich verdict
  if (features.length > 0) {
    verdict += ` Users are impressed with the ${features.slice(0, 3).join(", ")}.`;
  }
  if (cons.length > 0) {
    verdict += ` However, some reported issues with ${cons.slice(0, 2).join(" and ")}.`;
  }

  return {
    averageSentiment,
    pros: pros.slice(0, 6),
    cons: cons.slice(0, 6),
    features: features.slice(0, 8), // Return top 8 key features
    verdict,
  };
};

module.exports = { analyzeReviews };
