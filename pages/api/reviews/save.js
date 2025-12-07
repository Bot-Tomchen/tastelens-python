import { createClient } from "@supabase/supabase-js";

console.log("🔌 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔌 SUPABASE_KEY length:", process.env.SUPABASE_KEY?.length);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  console.log("🔥 SAVE API HIT");
  console.log("Request body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { restaurant_id, text, emotion, trust_score, keywords, summary } =
    req.body;

  console.log("📝 Inserting into Supabase…");

  const { data, error } = await supabase.from("reviews").insert([
    {
      restaurant_id,
      text,
      emotion,
      trust_score,
      keywords,
      summary,
    },
  ]);

  console.log("📦 Supabase result:", { data, error });

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({ success: true, data });
}
