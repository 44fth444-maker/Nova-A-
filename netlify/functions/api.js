
const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        name: "NOVA AI",
        status: "online"
      })
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Bir mesaj yazmalısın."
        })
      };
    }

    if (!process.env.GROQ_API_KEY) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          error: "GROQ_API_KEY ayarlanmamış."
        })
      };
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Sen NOVA AI adında, Türkçe konuşan, samimi ve yardımcı bir yapay zekâ asistanısın. Kısa ve anlaşılır cevaplar ver."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: response.choices[0].message.content
      })
    };
  } catch (error) {
    console.error("NOVA Groq API hatası:", error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Groq yanıt veremedi: " + error.message
      })
    };
  }
};

