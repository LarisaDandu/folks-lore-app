import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small", // or whichever model you're using
        messages,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("🔥 Error contacting Mistral:", error);
    res.status(500).json({ error: "Failed to reach Mistral API" });
  }
});

export default router;
