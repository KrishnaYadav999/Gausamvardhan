import Prompt from "../models/Prompt.js";
import stringSimilarity from "string-similarity";

/**
 * POST /api/chat
 * body: { message }
 * Finds the best matching stored prompt and returns its response.
 */
export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message required" });

    const prompts = await Prompt.find();
    if (!prompts.length) {
      return res.json({
        answer: "I don't know yet. Backend training is required."
      });
    }

    const pool = prompts.map((p) => p.prompt);
    const { bestMatch } = stringSimilarity.findBestMatch(message, pool);

    const THRESHOLD = 0.45;
    if (bestMatch.rating >= THRESHOLD) {
      const matchedPrompt = prompts.find((p) => p.prompt === bestMatch.target);
      return res.json({
        answer: matchedPrompt.response,
        matchedPrompt: matchedPrompt.prompt,
        score: bestMatch.rating
      });
    } else {
      return res.json({
        answer: "Sorry, I don't have an answer for that yet.",
        score: bestMatch.rating
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * (Optional) Manual training if needed
 * POST /api/train
 */
export const train = async (req, res) => {
  try {
    const { prompt, response, tags } = req.body;
    if (!prompt || !response) {
      return res.status(400).json({ error: "prompt and response are required" });
    }
    const doc = new Prompt({ prompt, response, tags });
    await doc.save();
    return res.json({ success: true, prompt: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /api/prompts
 * List saved prompts
 */
export const listPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 }).limit(100);
    res.json(prompts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};