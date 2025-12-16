// routes/chatRoutes.js
import express from "express";
import { chat, listPrompts, train } from "../controllers/chatController.js";
import Prompt from "../models/Prompt.js";

const router = express.Router();

router.post("/chat", chat);
router.post("/train", train);
router.get("/prompts", listPrompts);

/* -------- DEFAULT TRAINING -------- */

router.get("/train/default", async (req, res) => {
  try {
    const trainingData = [
      { prompt: "hi", response: "Hello! How can I help you?" },
      { prompt: "hello", response: "Hi there! What are you looking for?" },
      { prompt: "hey", response: "Hey! Ask me about Pickle, Ghee or Pooja items." },
      { prompt: "good morning", response: "Good morning! 🌞" },
      { prompt: "good night", response: "Good night! 🌙" },
      { prompt: "thank you", response: "You’re welcome 😊" },
      { prompt: "bye", response: "Goodbye! Visit again." }
    ];

    for (const item of trainingData) {
      const exists = await Prompt.findOne({ prompt: item.prompt });
      if (!exists) {
        await Prompt.create(item);
      }
    }

    res.json({ success: true, msg: "Default training added ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
