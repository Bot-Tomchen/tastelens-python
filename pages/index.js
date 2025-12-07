import Link from "next/link";

export default function Home() {
  const restaurants = [
    { id: 1, name: "Jahunger", rating: 4.7, img: "/images/jahunger.jpg" },
    { id: 2, name: "Den Den Korean Fried Chicken", rating: 4.6, img: "/images/denden.jpg" },
    { id: 3, name: "Feedbacks", rating: 4.5, img: "/images/Tastelens.jpg" },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] p-5">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#4a3a2e]">
        Nearby restaurant
      </h1>

      <div className="space-y-4">
        {restaurants.map((r) => (
          <Link key={r.id} href={`/restaurant/${r.id}`} className="block">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f0ebe3] cursor-pointer hover:shadow-md transition-shadow duration-150">
              {/* 图片区域：固定 16:9 比例，object-cover 居中裁剪 */}
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl mb-3 bg-[#f5f0e8]">
                <img
                  src={r.img}
                  alt={r.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="text-xl font-semibold text-[#4a3a2e]">
                {r.name}
              </div>
              <div className="text-[#a8712a] font-medium mt-1">
                ⭐ {r.rating}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
