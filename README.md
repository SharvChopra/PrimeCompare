# PrimeCompare

**PrimeCompare** is an AI-driven product comparison platform that analyzes expert reviews to deliver clear pros, cons, and smart purchase insights. It helps users make informed buying decisions by leveraging AI and web scraping to provide detailed comparisons and sentiment analysis.

## Features

- **AI-Powered Analysis**: Uses Google's Gemini AI to generate comprehensive product reviews and comparisons.
- **Smart Scraping**: Utilizes Puppeteer to gather real-time product data and reviews.
- **Sentiment Analysis**: Analyzes customer reviews to determine overall sentiment (Positive/Negative/Neutral).
- **Product Comparison**: Compare products side-by-side to find the best value.
- **User Authentication**: Secure login and signup functionality.
- **Modern UI**: Built with React, TailwindCSS, and Framer Motion for a smooth and responsive user experience.

## Tech Stack

### Frontend
- **React** (Vite)
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Axios** for API integration
- **React Router** for navigation

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** for database
- **Google Generative AI (Gemini)** for AI features
- **Puppeteer** for web scraping
- **BcryptJS & JWT** for authentication

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed (or a MongoDB Atlas URI)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SharvChopra/PrimeCompare.git
   cd PrimeCompare
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Start the server:
   ```bash
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
