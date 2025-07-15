// backend/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

// Ensure API key is provided
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY environment variable is not set. Please add it to your .env file.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/**
 * POST /api/ielts-score
 * Body: {
 *   module: "writing" | "speaking", // for future expansion
 *   prompt: string // user's answer (essay or transcript)
 * }
 * Response: {
 *   band: number, // 0.0 - 9.0
 *   feedback: string // textual feedback
 * }
 */
app.post("/api/ielts-score", async (req, res) => {
  try {
    const { module = "writing", prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "'prompt' field is required" });
    }

    // System message prepares the assistant as IELTS examiner
    const systemMsg = `You are an experienced IELTS examiner. Based on the candidate's ${module} response, assess the band score (0-9, increments of 0.5) and give concise feedback following official IELTS band descriptors. Return the result strictly as JSON with keys 'band' (number) and 'feedback' (string).`;

    const messages = [
      { role: "system", content: systemMsg },
      { role: "user", content: prompt },
    ];

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // widely available and cost-effective
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = chatResponse.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      // Fallback if model didn't follow JSON strictly
      return res.status(500).json({ error: "Failed to parse AI response", raw: content });
    }

    return res.json(parsed);
  } catch (err) {
    console.error("/api/ielts-score error: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`IELTS scoring server listening on port ${PORT}`);
});