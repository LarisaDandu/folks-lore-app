import { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";
import "../styles/ChallengeTopBar.css";
import storytellerImg from "../assets/images/storyteller.png";
import ChallengeTopBar from "../components/ChallengeTopBar";

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

  // 🧾 Legends list
  const legends = [
    {
      name: "Baba Yaga",
      descriptors: [
        "Old lady",
        "White hair",
        "Tiny pupils",
        "Slavic mythology",
        "Witch",
        "Lives in forest",
        "House on chicken legs",
        "Flying broom",
        "Targets children",
        "Eastern Europe",
      ],
    },
    {
      name: "Wendigo",
      descriptors: ["Cannibal", "Spirit", "Winter", "Deer skull", "Forest", "Cold", "Hunger"],
    },
    {
      name: "Kitsune",
      descriptors: [
        "Fox",
        "Shape-shifter",
        "Nine tails",
        "Japan",
        "Trickster",
        "Beautiful woman",
      ],
    },
    {
      name: "La Llorona",
      descriptors: ["Ghost", "Crying", "Children", "River", "Water", "Weeping", "Latin America"],
    },
    {
      name: "Anansi",
      descriptors: ["Spider", "Trickster", "Stories", "Web", "Africa", "Deceiver", "Clever"],
    },
  ];

  // 🎴 Pick legend of the day
  useEffect(() => {
    const dkDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" })
    );
    const dayOfYear = Math.floor((dkDate - new Date(dkDate.getFullYear(), 0, 0)) / 86400000);
    setDailyLegend(legends[dayOfYear % legends.length]);
  }, []);

  // 🕰 Countdown
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

  // 💬 Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // 🎭 Simulated typing animation
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

  // 🌒 Handle message send (Agent version)
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userAttempts = messages.filter((m) => m.role === "user").length;
    if (userAttempts >= 11) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "You have used all 10 attempts. The fire fades... come back tomorrow.",
        },
      ]);
      return;
    }

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.mistral.ai/v1/agents/${import.meta.env.VITE_MISTRAL_AGENT_ID}/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            input: [
              {
                role: "system",
                content: `Today's legend: ${dailyLegend?.name}. Respond as the Storyteller — dark, mysterious, and always speaking in riddles.`,
              },
              ...messages,
              userMsg,
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("🧙 Mistral reply:", data);

      // ✅ Correct parsing for Mistral Agent responses
      const aiReply =
        data.output?.[0]?.content?.[0]?.text ||
        data.output?.[0]?.message?.content ||
        "(The fire crackles softly...)";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      await simulateTyping(aiReply, 45);
    } catch (error) {
      console.error("🔥 Error contacting Mistral:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "The fire fades... something went wrong contacting the spirits.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      {/* 🧭 Challenge Top Bar */}
      <ChallengeTopBar onBack={() => window.history.back()} />

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
