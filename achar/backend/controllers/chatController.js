import Prompt from "../models/Prompt.js";
import Product from "../models/Product.js";
import GheeProduct from "../models/GheeProduct.js";
import Ganpati from "../models/ganpatimodel.js";
import Agarbatti from "../models/agarbattiModel.js";
import stringSimilarity from "string-similarity";

/* ================= FETCH PRODUCTS ================= */

const fetchAllProducts = async () => {
  const all = [];

  // Helper to fetch and normalize products
  const fetchAndPush = async (Model, category, nameFields = ["name", "title", "productName"]) => {
    const items = await Model.find().lean();
    console.log(`${category} products fetched:`, items.map(p => p[nameFields[0]] || p[nameFields[1]] || p[nameFields[2]]));
    items.forEach(p => {
      const productName = nameFields.map(f => p[f]).find(Boolean);
      if (productName) {
        all.push({
          name: productName.toLowerCase().trim(),
          category,
          raw: p,
        });
      }
    });
  };

  await fetchAndPush(Product, "pickle");
  await fetchAndPush(GheeProduct, "ghee");
  await fetchAndPush(Ganpati, "ganpati");
  await fetchAndPush(Agarbatti, "pooja");

  console.log("Total products fetched:", all.length);
  return all;
};

/* ================= CHAT ================= */

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: "message required" });
    }

    const text = message.toLowerCase().trim();
    const products = await fetchAllProducts();
    console.log("User text:", text);

    // Greeting
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

    // Contact info
    if (text.includes("contact") || text.includes("email") || text.includes("phone")) {
      return res.json({
        answer: "You can reach us at:\nEmail: customercare@gausamvardhan.com\nPhone: +91 9326539055",
        suggestions: [
          { prompt: "Pickle products" },
          { prompt: "Ghee products" },
          { prompt: "Ganpati items" },
          { prompt: "Pooja items" },
        ],
      });
    }

    // Category detection
    const categoryMap = {
      pickle: ["pickle", "achar"],
      ghee: ["ghee"],
      ganpati: ["ganpati", "ganesh"],
      pooja: ["pooja", "puja", "agarbatti", "incense"],
    };

    for (const category in categoryMap) {
      if (categoryMap[category].some(k => text.includes(k))) {
        const list = products.filter(p => p.category === category);
        if (list.length > 0) {
          return res.json({
            answer: `Here are some ${category} products you may like:`,
            suggestions: list.slice(0, 5).map(p => ({
              prompt: p.raw.name || p.raw.productName || p.raw.title,
            })),
          });
        } else {
          return res.json({
            answer: `Sorry, no ${category} products are available right now.`,
            suggestions: [
              { prompt: "Pickle products" },
              { prompt: "Ghee products" },
              { prompt: "Ganpati items" },
              { prompt: "Pooja items" },
            ],
          });
        }
      }
    }

    // String similarity fallback
    const names = products.map(p => p.name);
    if (names.length > 0) {
      const match = stringSimilarity.findBestMatch(text, names);
      if (match.bestMatch.rating >= 0.45) {
        const matched = products.find(p => p.name === match.bestMatch.target);
        return res.json({
          answer: `${matched.raw.name || matched.raw.productName || matched.raw.title} is available in our ${matched.category} collection.`,
          suggestions: [
            { prompt: "Pickle products" },
            { prompt: "Ghee products" },
            { prompt: "Ganpati items" },
            { prompt: "Pooja items" },
          ],
        });
      }
    }

    // Fallback
    return res.json({
      answer:
        "I couldn’t understand that. Please ask about Pickle, Ghee, Ganpati, Pooja products, or contact info.",
      suggestions: [
        { prompt: "Pickle products" },
        { prompt: "Ghee products" },
        { prompt: "Ganpati items" },
        { prompt: "Pooja items" },
        { prompt: "Contact info" },
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
    if (!prompt || !response) {
      return res.status(400).json({ error: "prompt and response required" });
    }

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
