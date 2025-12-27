const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModelsRaw() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.log("No key"); return; }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(` - ${m.name}`);
                }
            });
        } else {
            console.log("Error listing:", data);
        }
    } catch (e) {
        console.log("Fetch error:", e.message);
    }
}

listModelsRaw();
