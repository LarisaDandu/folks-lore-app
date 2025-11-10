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
  const scrollRef = useRef(null);

  // 🌑 Full mythic lineup
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
    {
      name: "Anansi",
      descriptors: [
        "Trickster spider god",
        "Weaver of stories",
        "Bringer of wisdom",
        "Clever and mischievous",
        "Outsmarts gods and beasts",
        "Spins webs of deceit and truth",
        "Symbol of wit and resilience",
        "Speaks in riddles",
        "Laughs at human folly",
        "Loves tales and lessons alike",
      ],
    },
    {
      name: "Inkanyamba",
      descriptors: [
        "Giant serpent of South Africa",
        "Dwells in waterfalls and storms",
        "Controls thunder and lightning",
        "Eyes like glowing amber",
        "Wings hidden beneath its scales",
        "Brings floods when angered",
        "Feared by fishermen and travelers",
        "Guardian of sacred waters",
        "Invisible until provoked",
        "Spirit of vengeance and rain",
      ],
    },
    {
      name: "Adze",
      descriptors: [
        "Vampiric firefly spirit",
        "Origin of Ewe folklore",
        "Feeds on blood and life force",
        "Possesses humans in the night",
        "Spreads jealousy and sickness",
        "Appears as a glowing insect",
        "Cannot cross salt or iron",
        "Exposes hidden envy",
        "Destroyed only by ritual fire",
        "Feared by villagers and healers alike",
      ],
    },
    {
      name: "Leshy",
      descriptors: [
        "Forest guardian spirit",
        "Tall as trees, small as moss",
        "Eyes glow green like leaves",
        "Voice mimics wanderers",
        "Protector of animals",
        "Leads travelers astray for fun",
        "Shape-shifts into beasts or men",
        "Whistles through the wind",
        "Can befriend those who respect the forest",
        "Angers when nature is harmed",
      ],
    },
  ];

  // 🌘 Pick today’s legend
  const [dailyLegend, setDailyLegend] = useState(null);
  useEffect(() => {
    const dkDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" })
    );
    const dayOfYear = Math.floor((dkDate - new Date(dkDate.getFullYear(), 0, 0)) / 86400000);
    setDailyLegend(legends[dayOfYear % legends.length]);
  }, []);

  // ⏳ Countdown timer
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

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

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

  const handleSend = async () => {
    if (!input.trim() || loading || attemptsLeft <= 0) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttemptsLeft((prev) => prev - 1);
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
You are "Storyteller", a wise, ancient entity who guards the fire pit of legends.
You always respond in a dark, mystical, and poetic tone.
Your role is to challenge the user to guess the "legend of the day": ${dailyLegend?.name}.
You must NEVER say the legend's name directly, unless the user guesses it exactly.
Do not give clues, hints, or detailed answers unless the user has correctly guessed the legend.
If the user asks for clues, respond mysteriously but never reveal information that gives away the legend.

Additional behavior:
- Keep your responses short while the user is guessing the creature(1–3 poetic sentences).
- Only tell a longer, vivid story when the user guesses correctly.
- Always remain in-character as the Storyteller, keeper of the fire and lore.
- If the user guesses the character correctly, provide a story about daily creature. Longer paragraph.
- When starting the chat, do not reveal any clues about the creature, such as location or traits.
              `,
            },
            ...messages,
            userMsg,
          ],
        }),
      });

      const data = await response.json();
      let aiReply = data.choices?.[0]?.message?.content || "(The fire crackles softly...)";

      // ✂️ Limit overly long replies unless it's a story
      if (!aiReply.toLowerCase().includes("you have guessed") && aiReply.length > 350) {
        aiReply = aiReply.split(". ").slice(0, 2).join(". ") + "...";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      await simulateTyping(aiReply, 20);
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
            placeholder="Type your question..."
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
