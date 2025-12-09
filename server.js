const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = 3000;

// OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Frontend route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Actual AI route
app.post("/api/nefeli", async (req, res) => {
  const { text, mode, lang } = req.body;
console.log("🔹 Received:", req.body);

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Nefeli, an intelligent assistant that answers in ${lang}.`,
        },
        { role: "user", content: text },
      ],
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "AI error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
