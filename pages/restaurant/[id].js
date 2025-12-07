import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function RestaurantPage() {
  const router = useRouter();
  const { id } = router.query;

  const [restaurant, setRestaurant] = useState(null); // placeholder if you add restaurant data later
  const [reviews, setReviews] = useState(null);

  // -----------------------------
  // Load reviews from Supabase
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews/list?id=${id}`);
        const data = await res.json();

        console.log("🔥 Loaded reviews:", data.reviews);
        setReviews(data.reviews);
      } catch (err) {
        console.log("❌ Error loading reviews:", err);
      }
    }

    loadReviews();
  }, [id]);

  // -----------------------------
  // Page UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-[#faf7f2] p-5">
      {/* Placeholder Restaurant Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eee]">
        <h1 className="text-2xl font-bold text-[#4a3a2e]">
          Restaurant #{id}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Sample description or restaurant address goes here.
        </p>
      </div>

      {/* Add Review Button */}
      <button
        onClick={() => router.push(`/restaurant/${id}/comment`)}
        className="w-full mt-5 p-3 bg-[#ffb357] text-white rounded-xl font-semibold shadow"
      >
        Write a Review
      </button>

      {/* Reviews Section */}
      <h2 className="text-lg font-bold mt-8 mb-3 text-[#4a3a2e]">Reviews</h2>

      {/* Loading state */}
      {!reviews && (
        <p className="text-sm text-gray-500">Loading reviews…</p>
      )}

      {/* No reviews */}
      {reviews && reviews.length === 0 && (
        <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>
      )}

      {/* Review Cards */}
      {reviews && reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded-xl shadow border border-[#eee]"
            >
              {/* Summary */}
              <p className="font-semibold text-[#4a3a2e]">{review.summary}</p>

              {/* Raw Review */}
              <p className="text-sm text-[#6a5f55] mt-2">{review.text}</p>

              {/* Emotion + Trust */}
              <p className="text-xs text-gray-500 mt-2">
                <b>Emotion:</b> {review.emotion} •{" "}
                <b>Trust:</b> {review.trust_score}
              </p>

              {/* Keywords / Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {review.keywords?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Timestamp */}
              <p className="text-[10px] text-gray-400 mt-3">
                {new Date(review.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
