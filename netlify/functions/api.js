const OpenAI = require("openai");

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "NOVA AI", status: "online" })
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Bir mesaj yazmalısın." })
      };
    }

    if (!process.env.MISTRAL_API_KEY) {
      return {
        statusCode: 503,
        body: JSON.stringify({
          error: "MISTRAL_API_KEY ayarlanmamış."
        })
      };
    }

    const client = new OpenAI({
      apiKey: process.env.MISTRAL_API_KEY,
      baseURL: "https://api.mistral.ai/v1"
    });

    const response = await client.chat.completions.create({
      model: "mistral-small-2603",
      messages: [
        {
          role: "system",
          content: "Sen NOVA AI adında, Türkçe konuşan, samimi bir yapay zekâ asistanısın."
        },
        { role: "user", content: message }
      ]
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: response.choices[0].message.content
      })
    };
  } catch (error) {
    console.error("NOVA API hatası:", error.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Yapay zekâ yanıt veremedi." })
    };
  }
};
