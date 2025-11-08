// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());

// Serve your built frontend (Vite or CRA)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Chat route
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch(
      `https://api.mistral.ai/v1/agents/${process.env.VITE_MISTRAL_AGENT_ID}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VITE_MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          input: messages, // ✅ Mistral expects "input" instead of "messages"
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();
    console.log("🧙 Mistral API response:", data);

    // ✅ Adapt response format so frontend understands it
    const reply =
      data.output?.[0]?.content ||
      data.choices?.[0]?.message?.content ||
      "(The fire crackles softly...)";

    res.json({
      choices: [{ message: { content: reply } }],
    });
  } catch (error) {
    console.error("🔥 Error contacting Mistral:", error);
    res.status(500).json({ error: "Failed to reach Mistral API" });
  }
});

// ✅ Serve frontend for all other routes
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
