import { createClient } from "@supabase/supabase-js";

console.log("🔌 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔑 SUPABASE_KEY starts with:", process.env.SUPABASE_KEY?.slice(0, 4));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
).schema("public"); // 👈 force schema properly

export default async function handler(req, res) {
  let { id } = req.query;
  const restaurantId = Number(id);

  console.log("🔥 LIST API HIT for restaurant:", restaurantId);

  const { data, error } = await supabase
    .from("reviews") // 👈 now uses public.reviews safely
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  console.log("🟢 SUPABASE QUERY RESULT:", data);
  console.log("❓ SUPABASE ERROR:", error);

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({ reviews: data });
}
