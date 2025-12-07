// pages/restaurant/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

// 跟首页一致的餐厅数据
const restaurantData = {
  1: {
    id: 1,
    name: "Jahunger",
    label: "Suggested",
    imgs: [
      "/images/jahunger1.jpg",
      "/images/jahunger2.jpg",
      "/images/jahunger3.jpg",
      "/images/jahunger4.jpg",
    ],
    description: "Uyghur / Central Asian comfort food in Fox Point.",
  },
  2: {
    id: 2,
    name: "Den Den Korean Fried Chicken",
    label: "Preferred",
    imgs: [
      "/images/denden1.jpg",
      "/images/denden2.jpg",
      "/images/denden3.jpg",
      "/images/denden4.jpg",
    ],
    description:
      "Crispy Korean fried chicken & casual bites on Thayer Street.",
  },
  3: {
    id: 3,
    name: "Feedbacks (TasteLens Team)",
    label: "Anniversary-Worthy",
    imgs: ["/images/Tastelens.jpg"],
    description:
      "Our own TasteLens pop-up: a space to collect real, trusted food feedback.",
  },
};

export default function RestaurantPage() {
  const router = useRouter();
  const { id } = router.query;

  const restaurant = restaurantData[id]; // 根据 id 拿对应餐厅
  const [reviews, setReviews] = useState(null);

  // ------------- 加载 Supabase 评论 -------------
  useEffect(() => {
    if (!id) return;

    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews/list?id=${id}`);
        const data = await res.json();
        console.log("Loaded reviews:", data.reviews);
        setReviews(data.reviews);
      } catch (err) {
        console.error("❌ Error loading reviews:", err);
      }
    }

    loadReviews();
  }, [id]);

  // ------------- 如果 id 不对 -------------
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#faf7f2] p-5">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-[#a8712a] mb-4"
        >
          ← Back to home
        </button>
        <div className="text-lg text-[#4a3a2e] font-semibold">
          Restaurant not found.
        </div>
      </div>
    );
  }

  // ------------- 页面 UI -------------
  return (
    <div className="min-h-screen bg-[#faf7f2] p-5">
      {/* 返回首页按钮 */}
      <button
        onClick={() => router.push("/")}
        className="text-sm text-[#a8712a] mb-4"
      >
        ← Back to home
      </button>

      {/* 头图（用第一张图） */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl mb-3 bg-[#f5f0e8]">
        <img
          src={restaurant.imgs[0]}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* 额外小图廊 */}
      {restaurant.imgs.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {restaurant.imgs.map((src, i) => (
            <div
              key={i}
              className="relative h-20 w-32 min-w-[8rem] overflow-hidden rounded-xl bg-[#f5f0e8]"
            >
              <img
                src={src}
                alt={`${restaurant.name} ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* 餐厅基本信息 */}
      <h1 className="text-2xl font-bold text-[#4a3a2e] mb-1">
        {restaurant.name}
      </h1>
      <div className="text-[#a8712a] font-medium mb-2">⭐ {restaurant.label}</div>
      <p className="text-sm text-[#6d5a48] mb-5">{restaurant.description}</p>

      {/* 写评论按钮 */}
      <button
        onClick={() => router.push(`/restaurant/${restaurant.id}/comment`)}
        className="w-full mb-6 p-3 bg-[#ffb357] text-white rounded-xl font-semibold shadow hover:shadow-md transition-shadow duration-150"
      >
        Write a Review
      </button>

      {/* 评论区域 */}
      <h2 className="text-lg font-semibold text-[#4a3a2e] mb-3">Reviews</h2>

      {!reviews && (
        <div className="text-sm text-[#6d5a48]">Loading reviews…</div>
      )}

      {reviews && reviews.length === 0 && (
        <div className="text-sm text-[#6d5a48]">
          No reviews yet. Be the first!
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-3 shadow-sm border border-[#f0ebe3]"
            >
              <div className="font-semibold text-[#4a3a2e] mb-1">
                {review.summary}
              </div>

              <div className="text-sm text-[#6d5a48] mb-2">{review.text}</div>

              <div className="text-xs text-[#a8712a] mb-1">
                Emotion: {review.emotion} • Trust: {review.trust_score}
              </div>

              {review.keywords && review.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {review.keywords.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-[#faf7f2] text-[#6d5a48] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[11px] text-[#8a7a68]">
                {new Date(review.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
