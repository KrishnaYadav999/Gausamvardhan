import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello, I’m Gausam 🐄. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const { data } = await axios.post("/api/chat", {
        message: input,
      });
      const botMsg = { from: "bot", text: data.answer || "No answer." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Server error." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
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

      {/* Chat Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="fixed bottom-5 right-5 w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center">
              <span className="font-semibold flex items-center gap-2">
                🐄 Gausam
              </span>
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
                    transition={{ duration: 0.3 }}
                    className={`mb-2 flex ${
                      m.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        m.from === "user"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      } px-3 py-2 rounded-lg max-w-[70%] shadow`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
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
