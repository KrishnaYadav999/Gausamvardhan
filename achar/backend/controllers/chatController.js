import Prompt from "../models/Prompt.js";
import Product from "../models/Product.js";
import GheeProduct from "../models/GheeProduct.js";
import Ganpati from "../models/ganpatimodel.js";
import Agarbatti from "../models/agarbattiModel.js";
import stringSimilarity from "string-similarity";

/* ================= CACHE ================= */
let cachedProducts = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/* ================= FETCH PRODUCTS ================= */
const fetchAllProducts = async () => {
  const all = [];

  const fetchAndPush = async (Model, category, nameFields = ["name", "title", "productName"]) => {
    const items = await Model.find().lean();
    items.forEach((p) => {
      const productName = nameFields.map((f) => p[f]).find(Boolean);
      if (!productName) return;

      let price = p.currentPrice || p.current_price || p.price || p.cutPrice || "Price not available";

      all.push({
        name: productName.toLowerCase().trim(),
        displayName: productName,
        category,
        price,
        moreAboutPickle: category === "pickle" ? p.moreAboutPickle || "" : "",
        raw: p,
      });
    });
  };

  await fetchAndPush(Product, "pickle");
  await fetchAndPush(GheeProduct, "ghee");
  await fetchAndPush(Ganpati, "ganpati");
  await fetchAndPush(Agarbatti, "pooja");

  console.log("Total products fetched:", all.length);
  return all;
};

const fetchAllProductsCached = async () => {
  const now = Date.now();
  if (cachedProducts.length && now - lastFetchTime < CACHE_DURATION) {
    return cachedProducts;
  }
  cachedProducts = await fetchAllProducts();
  lastFetchTime = now;
  return cachedProducts;
};

/* ================= CHAT ================= */
export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "message required" });

    const text = message.toLowerCase().trim();
    const products = await fetchAllProductsCached();

    /* ===== GREETING ===== */
    if (["hi", "hii", "hello", "hey"].includes(text)) {
      return res.json({
        answer: "Hello, I’m Gausam 🐄. How can I help you today?",
        suggestions: [
          { prompt: "Pickle products" },
          { prompt: "Ghee products" },
          { prompt: "Ganpati items" },
          { prompt: "Pooja items" },
        ],
      });
    }

    /* ===== CONTACT ===== */
    if (text.includes("contact") || text.includes("phone") || text.includes("email")) {
      return res.json({
        answer:
          "📞 Phone: +91 9326539055\n📧 Email: customercare@gausamvardhan.com",
      });
    }

    /* ===== PRODUCT EXACT MATCH FIRST ===== */
    const exactProduct = products.find(p => p.name === text);
    if (exactProduct) {
      let answer = `🛍️ ${exactProduct.displayName}\n💰 Price: ${exactProduct.price}`;
      if (exactProduct.category === "pickle" && exactProduct.moreAboutPickle) {
        answer += `\n📖 ${exactProduct.moreAboutPickle}`;
      }

      return res.json({
        answer,
        suggestions: products
          .filter(p => p.category === exactProduct.category)
          .slice(0, 4)
          .map(p => ({ prompt: p.displayName })),
      });
    }

    /* ===== CATEGORY DETECTION ===== */
    const categoryMap = {
      pickle: ["pickle", "achar"],
      ghee: ["ghee"],
      ganpati: ["ganpati", "ganesh"],
      pooja: ["pooja", "puja", "agarbatti", "incense"],
    };

    for (const category in categoryMap) {
      if (categoryMap[category].some((k) => text.includes(k))) {
        const list = products.filter((p) => p.category === category);

        if (!list.length) {
          return res.json({ answer: `Sorry, no ${category} products available right now.` });
        }

        const answer = list
          .map((p) => {
            let info = `• ${p.displayName} - 💰 ${p.price}`;
            if (category === "pickle" && p.moreAboutPickle) {
              info += `\n  📖 ${p.moreAboutPickle}`;
            }
            return info;
          })
          .join("\n\n");

        return res.json({
          answer: `Here are our ${category} products with prices 👇\n\n${answer}`,
          suggestions: list.slice(0, 4).map(p => ({ prompt: p.displayName })),
        });
      }
    }

    /* ===== SIMILARITY MATCH ===== */
    const names = products.map((p) => p.name);
    const match = stringSimilarity.findBestMatch(text, names);

    if (match.bestMatch.rating >= 0.55) {
      const product = products.find((p) => p.name === match.bestMatch.target);

      let answer = `🛍️ ${product.displayName}\n💰 Price: ${product.price}`;
      if (product.category === "pickle" && product.moreAboutPickle) {
        answer += `\n📖 About: ${product.moreAboutPickle}`;
      }

      return res.json({ answer });
    }

    /* ===== FALLBACK ===== */
    return res.json({
      answer:
        "I can help you with Pickle, Ghee, Ganpati, or Pooja products. Which one would you like to explore?",
      suggestions: [
        { prompt: "Pickle products" },
        { prompt: "Ghee products" },
        { prompt: "Ganpati items" },
        { prompt: "Pooja items" },
      ],
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= TRAIN ================= */
export const train = async (req, res) => {
  try {
    const { prompt, response } = req.body;
    if (!prompt || !response) return res.status(400).json({ error: "prompt and response required" });

    const exists = await Prompt.findOne({ prompt: prompt.trim() });
    if (exists) {
      exists.response = response;
      await exists.save();
      return res.json({ success: true });
    }

    await Prompt.create({ prompt: prompt.trim(), response });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= LIST ================= */
export const listPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
