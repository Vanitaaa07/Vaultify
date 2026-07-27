export const askVault = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": req.headers.origin || "https://vaultify-kappa.vercel.app", // ✅ dynamic production referer
        "X-Title": "Vaultify AskVault"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-preview-02-05:free", // ✅ ultra-fast Google Gemini Flash Lite
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512
      })
    });

    const data = await response.json();
    console.log("🧪 Debug:", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      let errorMessage = "No response from OpenRouter AI";
      if (typeof data?.error === "string") errorMessage = data.error;
      else if (data?.error?.message) errorMessage = data.error.message;
      else if (data?.message) errorMessage = data.message;
      else if (data && Object.keys(data).length > 0) errorMessage = JSON.stringify(data);

      return res.status(500).json({ error: errorMessage, debug: data });
    }

    res.status(200).json({ reply });

  } catch (error) {
    console.error(" OpenRouter API Error:", error.message);
    res.status(500).json({ error: "OpenRouter request failed: " + error.message });
  }
};
