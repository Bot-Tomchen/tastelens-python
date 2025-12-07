export default async function handler(req, res) {
  console.log("🔥 analyze.js HIT");

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No review text provided." });
  }

  const prompt = `
You are a restaurant review analysis model. Analyze the following user-written review and return a JSON object with the following structure:

{
  "emotion": "Joy | Slightly Positive | Mixed | Slightly Negative | Anger",
  "trust_score": 0-100,
  "keywords": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "summary": "One-sentence summary of the review"
}

Keyword / tag rules:
- Generate 3–5 meaningful and insightful tags.
- Tags can be MULTI-WORD phrases; they do NOT need to be single words.
- Tags must provide ACTUAL insight about the restaurant or the dishes.
- Tags may include:
    * signature dishes (e.g., “signature big plate chicken”)
    * dish-specific praise (e.g., “handmade noodles with excellent texture”)
    * meaningful themes (e.g., “worth the wait”, “perfect for group dining”)
    * cuisine identity if relevant and helpful (e.g., “authentic Uighur flavors”)
- Tags must be useful, readable, and capture what matters most to potential diners.
- Do NOT include:
    * generic adjectives without context (“good”, “tasty” alone)
    * locations (“Providence”)
    * irrelevant tags (“service slow” is allowed, “salt” is not)
    * microscopic details that are not helpful
- The goal: Produce concise, high-information, helpful insight tags.

Review:
"${text}"

Important rules:
- Output JSON only.
- Do NOT include markdown code blocks.
- Do NOT include explanations or extra text.
`;



  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("🔥 Gemini raw response:", data);

    const outputText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    console.log("🔥 outputText:", outputText);

    if (!outputText) {
      return res.status(500).json({
        error: "Gemini returned no usable text",
        data,
      });
    }

    // Clean up potential markdown-style JSON fences
    const cleaned = outputText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    return res.status(200).json(result);
  } catch (err) {
    console.log("🔥 ERROR:", err);
    return res.status(500).json({
      error: "Gemini API error",
      details: err.message,
    });
  }
}
