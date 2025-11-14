import express from "express";
import { chat, listPrompts } from "../controllers/chatController.js";
import Prompt from "../models/Prompt.js";

const router = express.Router();

router.post("/chat", chat);
router.get("/prompts", listPrompts);

// ✅ Seed multiple default prompts
router.get("/train/default", async (req, res) => {
  try {
    const trainingData = [
      { prompt: "hii", response: "How can I help you today?" },
      { prompt: "hello", response: "Hello! How are you doing?" },
      { prompt: "hey", response: "Hey there! How can I assist you?" },
      { prompt: "good morning", response: "Good morning! Hope you have a great day!" },
      { prompt: "good night", response: "Good night! Sleep well!" },
      { prompt: "how are you", response: "I’m just a bot, but I’m doing great! How about you?" },
      { prompt: "thank you", response: "You’re welcome! Happy to help." },
      { prompt: "bye", response: "Goodbye! Have a nice day." }
    ];

    for (const item of trainingData) {
      const exists = await Prompt.findOne({ prompt: item.prompt });
      if (!exists) {
        await Prompt.create(item);
      }
    }

    return res.json({ success: true, msg: "Default multi training added ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;