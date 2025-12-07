import { useRouter } from "next/router";
import { useState } from "react";

export default function CommentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [saved, setSaved] = useState(false);

  // ----------------------------
  // Step 1: Analyze (manual trigger ONLY)
  // ----------------------------
  async function analyzeReview() {
    if (!text.trim()) return;   // prevent empty call
    if (loading) return;         // prevent double click

    setLoading(true);

    const aiRes = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const result = await aiRes.json();
    console.log("AI Result:", result);

    if (!result.error) {
      setAiResult(result);
    }

    setLoading(false);
  }

  // ----------------------------
  // Step 2: Save to Supabase
  // ----------------------------
  async function saveReview() {
    if (!aiResult) return;
    if (loading) return;

    setLoading(true);

    const dbRes = await fetch("/api/reviews/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: id,
        text,
        ...aiResult,
      }),
    });

    const json = await dbRes.json();
    console.log("Save result:", json);

    if (dbRes.ok) {
      setSaved(true);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen p-5 bg-[#faf7f2]">
      <h1 className="text-xl font-bold mb-4 text-[#4a3a2e]">Write a Review</h1>

      {!saved && (
        <>
          <textarea
            className="w-full p-3 h-40 bg-[#f9f5ef] border border-[#e4dccf] rounded-xl"
            placeholder="Write your comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* ANALYZE BUTTON */}
          {!aiResult && (
            <button
              onClick={analyzeReview}
              className="w-full mt-4 p-3 bg-[#ffb357] text-white rounded-xl font-semibold"
            >
              {loading ? "Analyzing..." : "Analyze Review"}
            </button>
          )}
        </>
      )}

      {/* SHOW AI RESULT */}
      {aiResult && !saved && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-2">AI Analysis Result</h2>

          <p><b>Emotion:</b> {aiResult.emotion}</p>
          <p><b>Trust Score:</b> {aiResult.trust_score}</p>
          <p><b>Summary:</b> {aiResult.summary}</p>
          <p><b>Keywords:</b> {aiResult.keywords.join(", ")}</p>

          {/* SAVE BUTTON */}
          <button
            onClick={saveReview}
            className="w-full mt-4 p-3 bg-[#4a3a2e] text-white rounded-xl font-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Review"}
          </button>
        </div>
      )}

      {/* CONFIRMATION */}
      {saved && (
        <div className="mt-8 bg-white p-5 rounded-xl shadow">
          <p className="text-lg font-semibold text-[#4a3a2e] mb-2">
            Review Submitted ✔
          </p>

          <button
            onClick={() => router.push(`/restaurant/${id}`)}
            className="w-full mt-2 p-3 bg-[#ffb357] text-white rounded-xl font-semibold"
          >
            Return to Restaurant
          </button>
        </div>
      )}
    </div>
  );
}
