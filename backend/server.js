const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "NKT Biology API is running" });
});

// Groq API helper
async function groqChat(messages, temperature, max_tokens) {
  temperature = temperature || 0.7;
  max_tokens = max_tokens || 2048;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.GROQ_API_KEY,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens,
    }),
  });
  const data = await response.json();
  return data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "Error";
}

// AI Chat
app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;
    const content = await groqChat(messages);
    res.json({ response: content });
  } catch (err) {
    res.status(500).json({ response: "Server error: " + err.message });
  }
});

// Hints
app.post("/api/hints", async (req, res) => {
  try {
    const question = req.body.question;
    const options = req.body.options;
    const hintType = req.body.hintType || "mini";
    const hintTypeText = hintType === "mini" ? "short" : "full";
    const content = await groqChat([
      { role: "system", content: "You are a biology teacher. Answer in Kazakh." },
      { role: "user", content: 'Question: "' + question + '" Give a ' + hintTypeText + ' hint. Options: ' + (options ? options.join(", ") : "") }
    ], 0.6, 500);
    res.json({ hint: content });
  } catch (err) {
    res.status(500).json({ hint: "Error: " + err.message });
  }
});

// Explain
app.post("/api/explain", async (req, res) => {
  try {
    const question = req.body.question;
    const options = req.body.options;
    const correctAnswer = req.body.correctAnswer;
    const correctText = options && options[correctAnswer] ? options[correctAnswer] : "";
    const content = await groqChat([
      { role: "system", content: "You are a biology teacher. Explain in 30 seconds in Kazakh." },
      { role: "user", content: 'Explain "' + question + '". Options: ' + (options ? options.join(", ") : "") + ". Correct: " + correctText }
    ], 0.6, 500);
    res.json({ explanation: content });
  } catch (err) {
    res.status(500).json({ explanation: "Error: " + err.message });
  }
});

// Generate Tests
app.post("/api/generate-tests", async (req, res) => {
  try {
    const topic = req.body.topic;
    const count = req.body.count || 10;
    const content = await groqChat([
      { role: "system", content: "You are a biology teacher. Create " + count + " NKT format questions in Kazakh. Each has 5 options. Return JSON: [{\"q\":\"question\",\"options\":[\"A\",\"B\",\"C\",\"D\",\"E\"],\"correct\":0,\"explanation\":\"explanation\"}]" },
      { role: "user", content: "Topic: " + topic }
    ], 0.7, 4000);
    const match = content.match(/\[.*\]/s);
    const questions = match ? JSON.parse(match[0]) : [];
    res.json({ questions: questions });
  } catch (err) {
    res.status(500).json({ questions: [] });
  }
});

// Voice STT
app.post("/api/voice", async (req, res) => {
  try {
    const audioBase64 = req.body.audioBase64;
    if (!audioBase64) {
      return res.json({ text: "No audio provided" });
    }
    res.json({ text: "Audio processed (demo mode)" });
  } catch (err) {
    res.status(500).json({ text: "Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});
