// client/src/components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello, I’m Gausam 🐄. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, suggestions]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = { from: "user", text };
    pushMessage(userMsg);
    setInput("");
    setSuggestions([]);

    try {
      const { data } = await axios.post("/api/chat", { message: text });

      // Detect if the answer contains email or phone
      let answer = data.answer || "No answer.";
      if (answer.includes("Email:")) {
        answer = answer.split("\n").map((line, idx) => {
          if (line.toLowerCase().includes("email:")) {
            const email = line.split("Email:")[1].trim();
            return <a key={idx} href={`mailto:${email}`} className="text-blue-600 underline">{line}</a>;
          } else if (line.toLowerCase().includes("phone:")) {
            const phone = line.split("Phone:")[1].trim();
            return <a key={idx} href={`tel:${phone}`} className="text-blue-600 underline">{line}</a>;
          }
          return <span key={idx}>{line}</span>;
        });
      }

      const botMsg = { from: "bot", text: answer };
      pushMessage(botMsg);

      if (Array.isArray(data.suggestions) && data.suggestions.length) {
        const filtered = data.suggestions.filter(s => s.prompt !== data.matchedPrompt);
        setSuggestions(filtered.slice(0, 4));
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error(err);
      pushMessage({ from: "bot", text: "Server error. Try again later." });
    }
  };

  const onSuggestionClick = async (sugg) => {
    setInput(sugg.prompt);
    setTimeout(() => {
      document.getElementById("chat-send-btn")?.click();
    }, 120);
  };

  return (
    <>
      {!open && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="fixed bottom-5 right-5 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white text-xl cursor-pointer shadow-lg hover:bg-green-700 z-50"
          onClick={() => setOpen(true)}
        >
          🐄
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="fixed bottom-5 right-5 w-80 sm:w-96 h-96 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center">
              <span className="font-semibold flex items-center gap-2">🐄 Gausam</span>
              <button
                onClick={() => setOpen(false)}
                className="text-white font-bold hover:scale-110 transition"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-2 overflow-y-auto">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: m.from === "user" ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`mb-2 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`${
                        m.from === "user"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      } px-3 py-2 rounded-lg max-w-[70%] shadow break-words`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="my-2">
                  <div className="text-xs text-gray-500 mb-1">Suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSuggestionClick(s)}
                        className="text-sm px-3 py-1 border border-gray-300 rounded-full hover:bg-green-50 hover:border-green-400 transition font-medium"
                        title={s.response}
                      >
                        {s.prompt.length > 30 ? s.prompt.slice(0, 30) + "..." : s.prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex border-t p-2 gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message..."
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
              />
              <button
                id="chat-send-btn"
                type="submit"
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;
