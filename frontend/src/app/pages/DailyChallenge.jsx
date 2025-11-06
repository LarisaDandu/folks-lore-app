import { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";
import storytellerImg from "../assets/images/storyteller.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to the fire pit. Would you like to guess your daily legend? You have 10 attempts.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dailyLegend, setDailyLegend] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const scrollRef = useRef(null);

  const legends = [
    { name: "Baba Yaga", descriptors: ["Old lady", "White hair", "Witch", "Lives in forest"] },
    { name: "Wendigo", descriptors: ["Cannibal", "Spirit", "Winter", "Deer skull"] },
    { name: "Kitsune", descriptors: ["Fox", "Shape-shifter", "Nine tails", "Japan"] },
    { name: "La Llorona", descriptors: ["Ghost", "Crying", "Children", "River"] },
    { name: "Anansi", descriptors: ["Spider", "Trickster", "Stories", "Web"] },
  ];

  useEffect(() => {
    const dkDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" })
    );
    const dayOfYear = Math.floor((dkDate - new Date(dkDate.getFullYear(), 0, 0)) / 86400000);
    setDailyLegend(legends[dayOfYear % legends.length]);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const dkTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));
      const tomorrow = new Date(dkTime);
      tomorrow.setDate(dkTime.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diffMs = tomorrow - dkTime;
      const hours = Math.floor(diffMs / 1000 / 60 / 60);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      setTimeLeft(`${hours}h ${minutes}m`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // 👇 Smooth scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const simulateTyping = (fullText, speedMs = 45) => {
    return new Promise((resolve) => {
      let i = 0;
      const tick = () => {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1].content = fullText.slice(0, i + 1);
          return next;
        });
        i++;
        if (i < fullText.length) setTimeout(tick, speedMs);
        else resolve();
      };
      tick();
    });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `You are "Storyteller", legend: ${dailyLegend?.name}` },
            ...messages,
            userMsg,
          ],
        }),
      });

      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || "(The fire crackles softly...)";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      await simulateTyping(aiReply, 45);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "The fire fades... try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="fire-glow"></div>
      <div className="storyteller-container">
        <img src={storytellerImg} alt="Storyteller" className="storyteller-image" />
      </div>

      <div className="chat-overlay">
        <div className="chat-fade-top"></div>

        <div className="chat-scroll" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role === "user" ? "user" : "ai"}`}>
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="typing-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type here..."
          />
          <button onClick={handleSend} disabled={loading}>
            <span>➤</span>
          </button>
        </div>

        <div className="countdown-box">⏳ New legend in: {timeLeft}</div>
      </div>
    </div>
  );
};

export default Chatbot;
