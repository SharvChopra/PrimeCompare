const puppeteer = require("puppeteer");

// 1. SEED TRUSTED REVIEW URLS (Fast Path)
const TRUSTED_REVIEW_URLS = {
  "Samsung Galaxy S24": [
    "https://www.gsmarena.com/samsung_galaxy_s24-review-2679.php",
    "https://www.techradar.com/reviews/samsung-galaxy-s24",
  ],
  "iPhone 15": [
    "https://www.gsmarena.com/apple_iphone_15-review-2619.php",
  ],
  "Pixel 8": [
    "https://www.gsmarena.com/google_pixel_8-review-2628.php",
  ],
  // Laptops
  "MacBook Air M2": [
    "https://www.notebookcheck.net/Apple-MacBook-Air-M2-Entry-Review-A-very-good-but-expensive-daily-laptop.636637.0.html"
  ],
  // Headphones
  "Sony WH-1000XM5": [
    "https://www.soundguys.com/sony-wh-1000xm5-review-71783/"
  ]
};

const searchReviews = async (productName, category = "Smartphone") => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");

    let targetUrls = [];
    let sources = [];
    let allReviews = [];
    let extractedSpecs = {};

    console.log(`Scraper initialized for: ${productName} (${category})`);

    // STRATEGY 1: CHECK KNOWN URLS
    const knownKey = Object.keys(TRUSTED_REVIEW_URLS).find(key =>
      productName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(productName.toLowerCase())
    );
    if (knownKey) {
      console.log(`Matched Trusted Key: ${knownKey} `);
      targetUrls = TRUSTED_REVIEW_URLS[knownKey];
    }

    // STRATEGY 2: CATEGORY-SPECIFIC INTERNAL SEARCH
    if (targetUrls.length === 0) {
      console.log("No known match. Attempting Category-Specific Internal Search...");

      // --- SMARTPHONE / SMARTWATCH -> GSMArena ---
      if (category === "Smartphone" || category === "Smartwatch") {
        const searchUrl = `https://www.gsmarena.com/res.php3?sSearch=${encodeURIComponent(productName)}`;
        try {
          await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
          const firstResult = await page.evaluate((prodName) => {
            const items = document.querySelectorAll(".makers ul li a");
            for (const item of items) {
              const text = item.innerText.toLowerCase();
              // Loose matching
              if (text.includes(prodName.toLowerCase().split(' ')[0])) return item.getAttribute("href");
            }
            return items.length > 0 ? items[0].getAttribute("href") : null;
          }, productName);

          if (firstResult) {
            console.log(`Found GSMArena result: ${firstResult}`);
            targetUrls = [`https://www.gsmarena.com/${firstResult}`];
          }
        } catch (e) { console.log("GSMArena search error:", e.message); }
      }

      // --- LAPTOP -> NotebookCheck ---
      else if (category === "Laptop") {
        // NotebookCheck Internal Search
        const searchUrl = `https://www.notebookcheck.net/Search.826.0.html?search=${encodeURIComponent(productName)}`;
        try {
          await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
          const result = await page.evaluate(() => {
            // Find first review link in results
            const link = document.querySelector("#search .gsc-results .gsc-webResult .gs-title a.gs-title");
            return link ? link.href : null;
          });
          if (result) {
            console.log(`Found NotebookCheck result: ${result}`);
            targetUrls = [result];
          }
        } catch (e) { console.log("NotebookCheck search error:", e.message); }
      }

      // --- HEADPHONE -> SoundGuys ---
      else if (category === "Headphone") {
        const searchUrl = `https://www.soundguys.com/?s=${encodeURIComponent(productName)}`;
        try {
          await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
          const result = await page.evaluate(() => {
            // SoundGuys article titles are usually h2.entry-title a
            const link = document.querySelector("main#main article h2.entry-title a");
            return link ? link.href : null;
          });
          if (result) {
            console.log(`Found SoundGuys result: ${result}`);
            targetUrls = [result];
          }
        } catch (e) { console.log("SoundGuys search error:", e.message); }
      }
    }

    // STRATEGY 3: FALLBACK (Bing Safety Net)
    if (targetUrls.length === 0) {
      console.log("Category search failed. Engaging Bing Safety Net...");
      const bingQuery = `${productName} ${category} review`;
      try {
        await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(bingQuery)}`, { waitUntil: "networkidle2" });
        const snippets = await page.evaluate(() => {
          const items = [];
          document.querySelectorAll("li.b_algo").forEach((element) => {
            const snippet = element.querySelector(".b_caption p")?.innerText || element.querySelector(".b_snippet")?.innerText;
            if (snippet && snippet.length > 50) items.push({ source: "Web Search", text: snippet });
          });
          return items.slice(0, 5);
        });

        // Extract basic specs from Bing rich results if possible
        const bingSpecs = await page.evaluate(() => {
          const s = {};
          // Bing sometimes shows a side card .b_entityTP
          const facts = document.querySelectorAll(".b_factrow");
          facts.forEach(f => {
            const label = f.querySelector("div:first-child")?.innerText?.replace(":", "");
            const val = f.querySelector("div:last-child")?.innerText;
            if (label && val) s[label] = val;
          });
          return s;
        });
        if (Object.keys(bingSpecs).length > 0) extractedSpecs = bingSpecs;

        if (snippets.length > 0) {
          allReviews = snippets;
          return { reviews: allReviews, specs: extractedSpecs };
        }
      } catch (e) { console.log("Bing fallback failed:", e.message); }
    }


    // SCRAPE TARGETS
    for (const link of targetUrls) {
      if (allReviews.length > 15) break;
      try {
        console.log(`Visting Review: ${link}`);
        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

        // Content Extraction
        const pageData = await page.evaluate((url) => {
          const paragraphs = [];
          const selectors = [
            "#review-body p", ".article-body p", ".review-body p", ".entry-content p",
            "#content p", "article p"
          ];

          let found = false;
          for (const sel of selectors) {
            const els = document.querySelectorAll(sel);
            if (els.length > 2) {
              els.forEach(el => {
                if (el.innerText.length > 60) paragraphs.push({ source: new URL(url).hostname, text: el.innerText });
              });
              found = true;
              break;
            }
          }
          if (!found) { // Generic fallback
            document.querySelectorAll("p").forEach(p => {
              if (p.innerText.length > 100) paragraphs.push({ source: new URL(url).hostname, text: p.innerText });
            });
          }

          // SPECS EXTRACTION (Generalized)
          const specs = {};
          // GSMArena strategy
          if (url.includes("gsmarena")) {
            document.querySelectorAll("table").forEach(table => {
              const th = table.querySelector("th");
              if (th) {
                const cat = th.innerText.toUpperCase();
                let k = null;
                if (cat.includes("DISPLAY")) k = "Display";
                else if (cat.includes("PLATFORM")) k = "Processor";
                else if (cat.includes("MEMORY")) k = "Storage";
                else if (cat.includes("BATTERY")) k = "Battery";
                else if (cat.includes("CAMERA")) k = "Camera";

                if (k) {
                  const val = table.querySelector(".nfo")?.innerText;
                  if (val) specs[k] = val;
                }
              }
            });
          }
          // NotebookCheck strategy (often in tables or dl lists)
          else if (url.includes("notebookcheck")) {
            document.querySelectorAll(".specs_element").forEach(el => {
              const label = el.querySelector(".specs_header")?.innerText;
              const val = el.querySelector(".specs_details")?.innerText;
              if (label && val) {
                if (label.includes("Processor")) specs["Processor"] = val;
                if (label.includes("Graphics")) specs["GPU"] = val;
                if (label.includes("Display")) specs["Display"] = val;
                if (label.includes("Storage")) specs["Storage"] = val;
              }
            });
          }

          return { p: paragraphs.slice(0, 10), s: specs };
        }, link);

        if (pageData.p.length > 0) allReviews = [...allReviews, ...pageData.p];
        if (Object.keys(pageData.s).length > 0) extractedSpecs = { ...extractedSpecs, ...pageData.s };

      } catch (e) { console.log(`Failed to scrape ${link}:`, e.message); }
    }

    return { reviews: allReviews, specs: extractedSpecs };

  } catch (error) {
    console.error("Scraper Critical Error:", error);
    return { reviews: [], specs: {} };
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { searchReviews };
