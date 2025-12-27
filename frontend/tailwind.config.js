/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // Slate 900 (Deep, premium dark background)
        secondary: "#334155", // Slate 700 (Lighter dark for cards/nav)
        accent: "#8b5cf6", // Violet 500 (Vibrant pop)
        highlight: "#f59e0b", // Amber 500 (Golden touch for stars/buttons)
        "text-main": "#f8fafc", // White text
        "text-muted": "#94a3b8", // Slate 400
      },
    },
  },
  plugins: [],
};
