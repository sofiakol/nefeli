const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// TO ΣΩΣΤΟ — Render δίνει το port αυτόματα
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== API ENDPOINT =====
app.post("/api/nefeli", async (req, res) => {
  try {
    console.log("Received:", req.body);

    const openai = new (require("openai"))({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: req.body.text }]
    });

    res.json({
      answer: completion.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error contacting the server." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
