import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMoon, FiSun } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import ReactMarkdown from "react-markdown";

const STORAGE_KEY = "gausam-chat-history";
const THEME_KEY = "chat-dark";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem(THEME_KEY) === "true");

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved).map((m) => ({ ...m, time: new Date(m.time) }))
      : [
          {
            from: "bot",
            text: "Hello 👋 I’m **Gausam Assistant**.\nHow can I help you today?",
            time: new Date(),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);


  const logo =
    "https://gausamvardhan.sfo3.cdn.digitaloceanspaces.com/chatbot.png";

  /* Auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, suggestions]);

  /* Persist chat */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  /* Persist theme */
  useEffect(() => {
    localStorage.setItem(THEME_KEY, dark);
  }, [dark]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, { ...msg, time: new Date() }]);
  };

  /* Typing animation */
  const streamBotMessage = (fullText) => {
  // ⛔ old typing stop
  if (typingIntervalRef.current) {
    clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = null;
  }

  let index = 0;
  pushMessage({ from: "bot", text: "" });

  typingIntervalRef.current = setInterval(() => {
    index++;
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].text = fullText.slice(0, index);
      return updated;
    });

    if (index >= fullText.length) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, 22);
};

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || typing) return;

    const text = input.trim();
    pushMessage({ from: "user", text });
    setInput("");
    setSuggestions([]);
    setTyping(true);

    try {
      const { data } = await axios.post("/api/chat", { message: text });
      setTyping(false);
      streamBotMessage(data.answer || "Sorry, I couldn’t understand that.");

      if (Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions.slice(0, 4));
      }
    } catch {
      setTyping(false);
      pushMessage({
        from: "bot",
        text: "⚠️ Server error. Please try again later.",
      });
    }
  };

const sendSuggestion = (text) => {
  // ⛔ typing immediately stop
  if (typingIntervalRef.current) {
    clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = null;
  }

  setTyping(false);
  setSuggestions([]);
  setInput(text);

  setTimeout(() => {
    document.getElementById("chat-send")?.click();
  }, 50);
};


  return (
    <>
      {/* Floating Button */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 
          w-12 h-12 sm:w-16 sm:h-16 
          rounded-full bg-gradient-to-br from-emerald-500 to-green-600
          shadow-2xl flex items-center justify-center z-50"
        >
          <img
            src={logo}
            alt="chat"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border"
          />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className={`fixed bottom-[env(safe-area-inset-bottom,1rem)] right-4
            w-[90vw] sm:w-[92vw] max-w-[380px]
            h-[45vh] sm:h-[65vh] max-h-[520px]
            rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border
            ${
              dark
                ? "bg-gray-900 text-white border-white/10"
                : "bg-white/80 backdrop-blur-2xl border-white/40"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                dark
                  ? "bg-gray-800"
                  : "bg-gradient-to-r from-emerald-600 to-green-500 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={logo} className="w-9 h-9 rounded-full border" />
                <div>
                  <div className="font-semibold">Gausam Assistant</div>
                  <div className="text-xs flex items-center gap-1 opacity-80">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setDark(!dark)}>
                  {dark ? <FiSun /> : <FiMoon />}
                </button>
                <button onClick={() => setOpen(false)} className="text-xl">
                  <IoClose />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-3 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    m.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 sm:px-4 sm:py-3
                    text-[13px] sm:text-sm shadow-lg whitespace-pre-wrap
                    ${
                      m.from === "user"
                        ? "bg-gradient-to-br from-emerald-600 to-green-500 text-white rounded-2xl rounded-br-sm"
                        : dark
                        ? "bg-gray-800 text-white rounded-2xl rounded-bl-sm"
                        : "bg-white text-gray-800 rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                    <div className="text-[10px] mt-1 opacity-50 text-right">
                      {m.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {typing && (
                <div className="flex gap-1 text-xs opacity-60">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150" />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-300" />
                </div>
              )}

              {/* ✅ Suggestions BACK */}
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendSuggestion(s.prompt)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition ${
                        dark
                          ? "bg-gray-800 border-white/10 hover:bg-gray-700"
                          : "bg-white hover:bg-emerald-50 hover:border-emerald-400"
                      }`}
                    >
                      {s.prompt}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className={`p-3 border-t ${
                dark ? "border-white/10" : "bg-white/80 backdrop-blur"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={typing}
                  className={`flex-1 px-4 py-2 rounded-full outline-none text-sm ${
                    dark
                      ? "bg-gray-800 text-white border border-white/10"
                      : "bg-white border focus:ring-2 focus:ring-emerald-400"
                  }`}
                />
                <button
                  id="chat-send"
                  type="submit"
                  disabled={typing}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full
                  bg-gradient-to-br from-emerald-600 to-green-500
                  text-white flex items-center justify-center"
                >
                  <FiSend />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;
