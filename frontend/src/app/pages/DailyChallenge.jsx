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
        "Ah, greetings, traveler. The embers glow, the shadows dance—do you dare step closer? The night whispers secrets, and I, an old storyteller, hold one just for you. Would you like to guess your daily legend? Ten attempts, no more, no less. The fire awaits your words.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [currency, setCurrency] = useState(1000);
  const [currencyGlow, setCurrencyGlow] = useState(false); // 💙 blue glow under currency
  const [fireGlow, setFireGlow] = useState(false); // 🔥 storyteller glow
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTopStart = useRef(0);

  // 🌑 Mythic lineup
  const legends = [
    {
      name: "Wendigo",
      descriptors: [
        "Spirit of hunger",
        "Gaunt and skeletal",
        "Eyes glow with starvation",
        "Elongated limbs",
        "Voice like howling wind",
        "Cannibalistic creature",
        "Born from greed and famine",
        "Heart made of ice",
        "Antlers of bone",
        "Cursed with endless hunger",
      ],
    },
    {
      name: "Dokkaebi",
      descriptors: [
        "Goblin spirit of Korea",
        "Mischievous and playful",
        "One-legged and horned",
        "Carries a magical club",
        "Rewards the good, punishes the wicked",
        "Loves rice wine and games",
        "Appears at night in the forest",
        "Can shapeshift to trick humans",
        "Laughter echoes in the dark",
        "Symbol of chaos and fortune",
      ],
    },
    {
      name: "Skinwalker",
      descriptors: [
        "Navajo witch",
        "Steals the form of animals",
        "Eyes glow in the dark",
        "Wears the skin of its victims",
        "Cursed practitioner of dark magic",
        "Swift as a coyote, silent as death",
        "Reeks of decay and malice",
        "Feared name, never spoken aloud",
        "Cannot enter sacred ground",
        "Hunts those who glimpse its true face",
      ],
    },
    {
      name: "Chupacabra",
      descriptors: [
        "Blood-sucking beast",
        "Attacks livestock at night",
        "Red glowing eyes",
        "Leathery or scaly skin",
        "Spines running down its back",
        "Leaps like a kangaroo",
        "Leaves no footprints",
        "Seen in the deserts of the Americas",
        "Feared by farmers and travelers",
        "Drains life with silent hunger",
      ],
    },
    {
      name: "Baba Yaga",
      descriptors: [
        "Old witch of the woods",
        "Iron teeth and bony legs",
        "Flies in a mortar and pestle",
        "Lives in a hut on chicken legs",
        "Eyes that pierce lies",
        "Keeper of ancient wisdom",
        "Feeds on the foolish",
        "Tests the brave and the lost",
        "Commands fire and storms",
        "Half-helper, half-horror",
      ],
    },
  ];

  // 🌘 Daily legend
  const [dailyLegend, setDailyLegend] = useState(null);
  useEffect(() => {
    const dkDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" })
    );
    const dayOfYear = Math.floor(
      (dkDate - new Date(dkDate.getFullYear(), 0, 0)) / 86400000
    );
    setDailyLegend(legends[dayOfYear % legends.length]);
  }, []);

  // ⏳ Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const dkTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Copenhagen" })
      );
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

  // 🧭 Scroll logic
  useEffect(() => {
    const chat = scrollRef.current;
    if (!chat) return;
    const isNearBottom =
      chat.scrollHeight - chat.scrollTop - chat.clientHeight < 150;
    if (isNearBottom) {
      chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // 🖱️ Drag scrolling
  useEffect(() => {
    const chat = scrollRef.current;
    if (!chat) return;

    const onMouseDown = (e) => {
      isDragging.current = true;
      startY.current = e.clientY;
      scrollTopStart.current = chat.scrollTop;
      chat.style.cursor = "grabbing";
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaY = e.clientY - startY.current;
      chat.scrollTop = scrollTopStart.current - deltaY;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      chat.style.cursor = "default";
    };

    chat.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      chat.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // ✍️ Typing simulation
  const simulateTyping = (fullText, speedMs = 20) =>
    new Promise((resolve) => {
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

  // 💰 Currency refill — adds blue glow + storyteller fire boost
  const handleCurrencyClick = () => {
    setCurrencyGlow(true);
    setFireGlow(true);
    setAttemptsLeft(10);
    setCurrency(1000);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "💙 The currency flares with cold blue fire — the storyteller’s flames rise higher!",
      },
    ]);
    setTimeout(() => {
      setCurrencyGlow(false);
      setFireGlow(false);
    }, 2000);
  };

  // 🧠 Handle send
  const handleSend = async () => {
    if (!input.trim() || loading || attemptsLeft <= 0 || currency <= 0) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setAttemptsLeft((prev) => Math.max(prev - 1, 0));
    setCurrency((prev) => Math.max(prev - 100, 0));
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `
You are "Storyteller", an ancient keeper of the fire.
The user is guessing the daily legend: ${dailyLegend?.name}.
Descriptors: ${dailyLegend?.descriptors.join(", ")}.

Behavior:
- Confirm or deny descriptors clearly.
- Keep answers short and poetic (1–3 sentences).
- Tell the full story if guessed correctly.
- Never reveal new clues unless confirming/denying.
- When out of points, remind user to refill via the currency icon.
              `,
            },
            ...messages,
            userMsg,
          ],
        }),
      });

      const data = await response.json();
      let aiReply =
        data.choices?.[0]?.message?.content ||
        "(The fire crackles softly...)";

      if (attemptsLeft - 1 <= 0 || currency - 100 <= 0) {
        aiReply +=
          "\n\n🕯️ The embers dim... Click the currency to rekindle your flame.";
      }

      if (
        !aiReply.toLowerCase().includes("you have guessed") &&
        aiReply.length > 350
      ) {
        aiReply = aiReply.split(". ").slice(0, 2).join(". ") + "...";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      await simulateTyping(aiReply, 20);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "The fire fades... try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <ChallengeTopBar
        onBack={() => window.history.back()}
        currency={currency}
        onCurrencyClick={handleCurrencyClick}
        currencyGlow={currencyGlow}
      />

      {/* 🔥 Storyteller fire glow retained */}
      <div className={`fire-glow ${fireGlow ? "fire-revive" : ""}`}></div>

      <div className="storyteller-container">
        <img
          src={storytellerImg}
          alt="Storyteller"
          className={`storyteller-image ${fireGlow ? "glow-bright" : ""}`}
        />
      </div>

      <div className="chat-overlay">
        <div className="chat-fade-top"></div>

        <div className="chat-scroll" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${msg.role === "user" ? "user" : "ai"}`}
            >
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
            placeholder={
              attemptsLeft > 0 && currency > 0
                ? `Type your question... (${attemptsLeft} left, ${currency} pts)`
                : "Out of strength — click currency to refill."
            }
            disabled={attemptsLeft <= 0 || currency <= 0}
          />
          <button
            onClick={handleSend}
            disabled={loading || attemptsLeft <= 0 || currency <= 0}
          >
            <span>➤</span>
          </button>
        </div>

        <div className="countdown-box">⏳ New legend in: {timeLeft}</div>
      </div>
    </div>
  );
};

export default Chatbot;
