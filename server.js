const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// SERVE STATIC FILES
app.use(express.static(path.join(__dirname)));

// API ENDPOINT
app.use(express.json());

app.post("/api/nefeli", async (req, res) => {
  try {
    console.log("Received:", req.body);

    const { text, mode, lang } = req.body;

    // OPENAI CALL
    const openai = new (require("openai"))({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: text }]
    });

    res.json({
      answer: completion.choices[0].message.content,
      citations: []
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "OpenAI error" });
  }
});

// DEFAULT ROUTE → serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));
