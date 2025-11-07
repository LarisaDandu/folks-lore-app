import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import chatRoute from "./api/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API route
app.use("/api/chat", chatRoute);

// serve Vite build output if you're deploying
app.use(express.static(path.join(__dirname, "dist")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
