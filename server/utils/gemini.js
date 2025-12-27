const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAIReview = async (productName) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.log("Gemini API Key is missing.");
            return null;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
      You are a tech expert. 
      Analyze the product "${productName}" based on your internal knowledge base. 
      Provide a detailed review in strict JSON format.
      If you don't know the product, return null.

      JSON Structure:
      {
        "averageSentiment": 8.5,
        "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
        "cons": ["Con 1", "Con 2"],
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "verdict": "Detailed verdict summary (2-3 sentences).",
        "specs": {
           "Display": "...",
           "Processor": "...",
           "Battery": "...",
           "Camera": "..."
        }
      }
      
      Do not include markdown pricing or extra text. Just the JSON.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Gemini Generation Error:", error.message);
        return null;
    }
};

module.exports = { generateAIReview };
