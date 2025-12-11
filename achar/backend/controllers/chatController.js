// controllers/chatController.js
import Prompt from "../models/Prompt.js";
import stringSimilarity from "string-similarity";

/**
 * POST /api/chat
 * body: { message }
 * Returns:
 *  - answer: string
 *  - matchedPrompt: string | null
 *  - score: number (best match score)
 *  - suggestions: [{ prompt, response, score }]
 */
export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "message required" });
    }

    const prompts = await Prompt.find();
    if (!prompts.length) {
      return res.json({
        answer:
          "मुझे अभी ट्रेनिंग की ज़रूरत है — डेटाबेस में कोई प्रम्प्ट नहीं मिला। आप नया सवाल जोड़ सकते हैं।",
        suggestions: [],
      });
    }

    const pool = prompts.map((p) => p.prompt);
    const matchData = stringSimilarity.findBestMatch(message, pool);
    const bestMatch = matchData.bestMatch; // { target, rating }

    // Build top suggestions (sorted descending) excluding bestMatch target duplication
    const similarities = matchData.ratings
      .map((r, idx) => ({ prompt: r.target, score: r.rating }))
      .sort((a, b) => b.score - a.score);

    // Attach responses
    const suggestions = [];
    for (let i = 0; i < Math.min(5, similarities.length); i++) {
      const s = similarities[i];
      const p = prompts.find((x) => x.prompt === s.prompt);
      if (p) {
        suggestions.push({
          prompt: p.prompt,
          response: p.response,
          score: Number(s.score.toFixed(4)),
        });
      }
    }

    const THRESHOLD = 0.45; // tune as needed

    if (bestMatch.rating >= THRESHOLD) {
      const matchedPrompt = prompts.find((p) => p.prompt === bestMatch.target);
      return res.json({
        answer: matchedPrompt.response,
        matchedPrompt: matchedPrompt.prompt,
        score: Number(bestMatch.rating.toFixed(4)),
        suggestions, // still provide related suggestions
      });
    } else {
      // Fallback helpful reply with suggestions
      return res.json({
        answer:
          "मुझे इसका सटीक जवाब अभी नहीं पता — नीचे कुछ संभावित सुझाव दें रहा हूँ। इनमे से किसी पर क्लिक कर के आगे बढ़ें, या नया प्रश्न add कर दें।",
        matchedPrompt: null,
        score: Number(bestMatch.rating.toFixed(4)),
        suggestions,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * POST /api/train
 * body: { prompt, response, tags }
 */
export const train = async (req, res) => {
  try {
    const { prompt, response, tags } = req.body;
    if (!prompt || !response) {
      return res.status(400).json({ error: "prompt and response are required" });
    }
    const exists = await Prompt.findOne({ prompt: prompt.trim() });
    if (exists) {
      exists.response = response;
      if (tags) exists.tags = tags;
      await exists.save();
      return res.json({ success: true, prompt: exists, msg: "Updated existing prompt." });
    }
    const doc = new Prompt({ prompt: prompt.trim(), response, tags });
    await doc.save();
    return res.json({ success: true, prompt: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /api/prompts
 */
export const listPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 }).limit(500);
    res.json(prompts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
