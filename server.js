
const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.MISTRAL_API_KEY,
  baseURL: "https://api.mistral.ai/v1"
});

app.get("/api/status", (req, res) => {
  res.json({ name: "NOVA AI", status: "online" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Bir mesaj yazmalısın."
      });
    }

    const response = await client.chat.completions.create({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: "Sen NOVA AI adında, Türkçe konuşan, samimi bir yapay zekâ asistanısın."
        },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });
  } catch (error) {
    console.error("Mistral API hatası:", error.message);
    res.status(500).json({
      error: "Yapay zekâ yanıt veremedi. Render Logs bölümünü kontrol et."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NOVA AI ${PORT} portunda çalışıyor.`);
});

