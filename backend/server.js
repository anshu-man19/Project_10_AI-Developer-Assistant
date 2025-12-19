import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Backend Running");
});

app.post("/api/chat", async (req, res) => {
  const { model, prompt } = req.body;
  const selectedModel = model?.toLowerCase();
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // ---------- OPENAI ----------
    if (selectedModel === "openai") {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an AI Developer Assistant. Explain clearly. If code exists, use markdown & code blocks.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      return res.json({
        reply: response.data.choices[0].message.content,
      });
    }

    // ---------- GEMINI ----------
    if (selectedModel === "gemini") {
      const result = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `
You are an AI Developer Assistant.

Behavior Rules:
- If user asks about coding → explain, debug, optimize, or analyze complexity.
- If user chats casually → respond normally, no random code.
- Only give code when truly needed.
- Always format responses using Markdown with readable formatting.
`
                },
                { text: prompt }
              ],
            },
          ],
        }
      );

      return res.json({
        reply: result.data.candidates[0].content.parts[0].text,
      });
    }



    return res.status(400).json({ error: "Invalid model" });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Backend running at port " + process.env.PORT);
});
